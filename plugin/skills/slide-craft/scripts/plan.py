"""Deck plan support for check_deck.py: parse deck-plan.md, check the plan against itself,
compare a measured deck against it (check 12), and derive a plan from a deck that has none.

The parser reads the template of references/deck-plan.md and nothing else:
  - `Label: value` lines (a label ends at the next label or heading),
  - the text-role table (columns role | family | weight | size pt | colour | use),
  - the slide table (columns No. | Layout type | Claim title | ... | Exhibit | Source | ...),
  - hex colours as six digits (with or without #) in the Palette block, each tied to the role word
    (background, text, accent, signal, status, neutral) in the same segment; segments split at | ; , or a new line.
Whatever cannot be parsed is reported as not_measured with the reason, never guessed.
"""
import re

LABELS = ['Purpose', 'Audience', 'Situation', 'Duration / length', 'Language', 'Pinned by user', 'Waivers', 'Placeholders', 'Profile',
          'Scene sentence', 'Mechanism', 'Mode', 'Chosen direction', 'Drafts shown', 'Alternatives', 'Colour strategy', 'Pattern variants',
          'Direction contract', 'Rationale', 'Self-check', 'Governing message', 'Title strand', 'Arc',
          'Fonts', 'Text roles', 'Palette', 'Grid and spacing', 'Layout types', 'Images and icons', 'Charts']
LABEL_RE = re.compile(r'^\s*(?:[-*]\s*)?\**\s*(%s)\s*\**\s*:\s*\**\s*(.*)$' % '|'.join(re.escape(l) for l in LABELS), re.I)
HEX_RE = re.compile(r'#?\b([0-9A-Fa-f]{6})\b')
NUM_RE = re.compile(r'\d+(?:[.,]\d+)?')
BOLD_WORDS = ('bold', 'semibold', 'semi-bold', 'heavy', 'black', 'extrabold', 'demibold')
REGULAR_WORDS = ('regular', 'normal', 'book', 'light', 'medium', 'roman')
EMPTY_TITLE = {'', '-', '—', '–', 'n/a', 'n.a.', 'tbd', 'none'}
CLEAN_NO_RE = re.compile(r'^\**\s*\d+[.)]?\s*\**$')  # a plain ordinal, e.g. "3" or "3."; not "A1" or "P04"
# the Profiles: line of each pattern in references/patterns.md (change it there first)
ALL_PROFILES = ('read', 'talk', 'pitch', 'update')
PATTERN_PROFILES = {
    1: ALL_PROFILES, 2: ('read', 'update', 'pitch'), 3: ('read', 'update'), 4: ('read', 'update', 'pitch'),
    5: ('talk', 'pitch', 'read'), 6: ('read', 'update'), 7: ('read', 'update'), 8: ('read', 'update', 'pitch'),
    9: ('read', 'update', 'pitch', 'talk'), 10: ('read', 'update', 'pitch'), 11: ALL_PROFILES, 12: ('read', 'pitch', 'talk'),
    13: ('talk', 'pitch', 'read'), 14: ('talk', 'pitch'),
}
ROWS_FAMILY = (7, 9, 10)     # P07 table, P09 before-after, P10 numbered-rows: one composition (patterns.md)
ROWS_FAMILY_MAX = 2          # in talk and pitch; starting value, reported as an observation
PATTERN_ID_RE = re.compile(r'\bp\s?0?(\d{1,2})\b', re.I)


# ----------------------------------------------------------------- parsing

DESIGN_LABELS = ('fonts', 'text roles', 'palette', 'grid and spacing', 'layout types', 'images and icons', 'charts')
DESIGN_HEADING_RE = re.compile(r'^#+\s*(4\b|4\.|design system)', re.I)
# direction.md round 2 shows 2 to 3 candidate directions before the user picks one; describing each with its
# own "Pattern variants:"/"Colour strategy:" line repeats those labels legitimately (0.22 fix). The template's
# "Directions considered" table is the documented way to do this without repeating labels at all; this
# exemption is the fallback for a plan that still writes it as repeated fields under the Direction heading.
DIRECTION_LABELS = ('pattern variants', 'colour strategy', 'rationale', 'self-check')
DIRECTION_HEADING_RE = re.compile(r'^#+\s*(2\b|2\.|direction\b)', re.I)
AS_BUILT_RE = re.compile(r'^#+\s*(7\b|7\.)?\s*as built', re.I)


def _fields_all(text):
    """Every `Label: value` occurrence as (label, value, heading it sits under), in file order."""
    found, cur, buf, head, cur_head = [], None, [], '', ''

    def flush():
        if cur:
            found.append((cur, '\n'.join(buf), cur_head))
    for line in text.splitlines():
        if line.startswith('#'):
            flush()
            cur, buf, head = None, [], line.strip()
            continue
        m = LABEL_RE.match(line)
        if m:
            flush()
            cur, buf, cur_head = m.group(1).lower(), [m.group(2)], head
        elif cur is not None:
            buf.append(line)
    flush()
    return found


def _fields(text, duplicates=None):
    """One value per label. A label that occurs more than once is resolved, never silently: design-system labels
    (Palette, Fonts, ...) come from section 4 (Design system) when they occur there; direction labels (Pattern
    variants, Colour strategy, Rationale, Self-check) come from section 2 (Direction), where round 2 of
    direction.md legitimately repeats them once per candidate direction; all others from their first
    occurrence. Every repeated label is listed in `duplicates` as (label, count, heading used, exempt?)."""
    by = {}
    for label, value, head in _fields_all(text):
        by.setdefault(label, []).append((value, head))
    # section 7 (As built) restates real values on purpose: used only when a label occurs nowhere else
    for label in list(by):
        planned = [o for o in by[label] if not AS_BUILT_RE.match(o[1])]
        if planned:
            by[label] = planned
    out = {}
    for label, occ in by.items():
        pick = occ[0]
        exempt_re = DESIGN_HEADING_RE if label in DESIGN_LABELS else DIRECTION_HEADING_RE if label in DIRECTION_LABELS else None
        exempt = False
        if exempt_re:
            in_section = [o for o in occ if exempt_re.match(o[1])]
            if in_section:
                pick = in_section[0]
                exempt = True   # still exempt even if the section itself repeats the label (e.g. 3 directions)
        out[label] = pick[0]
        if len(occ) > 1 and duplicates is not None:
            duplicates.append((label, len(occ), pick[1] or '(no heading)', exempt))
    return out


def _tables(text):
    tables, cur = [], []
    for line in text.splitlines() + ['']:
        s = line.strip()
        if s.startswith('|'):
            cur.append([c.strip() for c in s.strip('|').split('|')])
        else:
            if len(cur) >= 2:
                tables.append(cur)
            cur = []
    out = []
    for t in tables:
        header = [h.lower() for h in t[0]]
        rows = [r for r in t[1:] if not all(re.fullmatch(r':?-{2,}:?', c) or c == '' for c in r)]
        out.append((header, rows))
    return out


def _col(header, *keys):
    for i, h in enumerate(header):
        if any(k in h for k in keys):
            return i
    return None


def _num(cell):
    m = NUM_RE.search(cell or '')
    return float(m.group(0).replace(',', '.')) if m else None


def _hexes(cell):
    return [m.group(1).upper() for m in HEX_RE.finditer(cell or '')
            if '#' in m.group(0) or any(ch.isdigit() for ch in m.group(1)) or m.group(1).isupper()]


def _palette(block):
    role, out = None, []
    for seg in re.split(r'[|;,\n]', block or ''):
        s = seg.lower()
        for key, name in (('status', 'status'), ('accent', 'accent'), ('signal', 'signal'), ('neutral', 'neutral'), ('grey', 'neutral'),
                          ('gray', 'neutral'), ('background', 'background'), ('bg', 'background'), ('text', 'text')):
            if key in s:
                role = name
                break
        for h in _hexes(seg):
            out.append({'role': role or 'unlabelled', 'hex': h})
    return out


def parse_plan(text):
    dups = []
    f = _fields(text, dups)
    notes = []
    plan = {'notes': notes, 'duplicate_labels': dups}
    m = re.search(r'\b(read|talk|pitch|update)\b', f.get('profile', ''), re.I)
    plan['profile'] = m.group(1).lower() if m else None
    plan['waivers'] = f.get('waivers', '')
    plan['placeholders_allowed'] = placeholders_allowed(f.get('placeholders', ''))

    roles = []
    for header, rows in _tables(text):
        if _col(header, 'role') is not None and _col(header, 'size') is not None:
            ci = {k: _col(header, *v) for k, v in dict(role=('role',), family=('family', 'font'), weight=('weight',),
                                                       size=('size',), color=('colour', 'color'), use=('use',)).items()}
            for r in rows:
                get = lambda k: r[ci[k]] if ci[k] is not None and ci[k] < len(r) else ''
                fam = get('family').strip('* ')
                roles.append({'name': get('role').strip('* ').lower(), 'family': '' if fam in ('?', '-', '—') else fam,
                              'weight': get('weight').strip('* ').lower(), 'size': _num(get('size')),
                              'colors': _hexes(get('color')), 'use': get('use')})
            break
    plan['roles'] = roles
    if not roles:
        notes.append('no text-role table found (need columns role | family | weight | size pt | colour | use)')

    plan['palette'] = _palette(f.get('palette', ''))
    if not plan['palette']:
        notes.append('no hex colours found in the Palette block')

    m = re.search(r'(?:margins?|r\u00e4nder|rand)[^0-9\n]{0,25}(\d+(?:[.,]\d+)?)\s*(in\b|inch|"|pt\b)', f.get('grid and spacing', ''), re.I)
    plan['margin_pt'] = None
    if m:
        v = float(m.group(1).replace(',', '.'))
        plan['margin_pt'] = v * 72.0 if m.group(2).lower() != 'pt' else v
    else:
        notes.append('no margin value found in the Grid and spacing block')

    lt = []
    for tok in re.split(r'[,;/|\n]', f.get('layout types', '')):
        tok = re.sub(r'\(.*?\)', '', tok).strip(' -*\t').lower()
        if tok:
            lt.append(tok)
    plan['layout_types'] = lt

    slides = []
    for header, rows in _tables(text):
        if _col(header, 'layout') is not None and _col(header, 'title') is not None:
            ci = {k: _col(header, *v) for k, v in dict(no=('no',), layout=('layout',), title=('title',),
                                                       exhibit=('exhibit',), source=('source',)).items()}
            for idx, r in enumerate(rows, 1):
                get = lambda k: r[ci[k]] if ci[k] is not None and ci[k] < len(r) else ''
                label = get('no').strip()
                # the row's position in the table is the slide index; a label like "A1" contains a digit
                # too, but is not that index, so it is never used to pick a deck slide (0.22 fix)
                slides.append({'no': idx, 'no_label': label, 'no_clean': bool(CLEAN_NO_RE.match(label)),
                               'layout': get('layout').strip('* ').lower(),
                               'title': get('title').strip('* "'), 'exhibit': get('exhibit'), 'source': get('source')})
            break
    plan['slides'] = slides
    if not slides:
        notes.append('no slide table found (need columns No. | Layout type | Claim title | ...)')
    return plan


# ----------------------------------------------------------------- helpers

def placeholders_allowed(value):
    """Brief field `Placeholders: allowed | not allowed`. Anything but a clear "allowed" means not allowed."""
    v = (value or '').lower()
    if re.search(r'\bnot\s+allowed\b|\bnicht\b|\bno\b|\bnone\b', v):
        return False
    return bool(re.search(r'\ballowed\b|\berlaubt\b|\byes\b|\bja\b', v))

def _role_kind(name):
    # roles for exempt slide types (title slide, divider, quote) are not bound to the title size range
    if any(k in name for k in ('slide', 'divider', 'quote', 'display', 'cover')):
        return 'other'
    if 'subtitle' in name:
        return 'other'
    if 'title' in name:
        return 'title'
    if 'body' in name:
        return 'body'
    if 'foot' in name or 'source' in name:
        return 'foot'
    return 'other'


def _weight_bold(w):
    bold = any(k in w for k in BOLD_WORDS)
    regular = any(k in w for k in REGULAR_WORDS)
    if bold and regular:
        return None   # a role that lists both ("regular, bold": body text with bold lead-ins) constrains neither (0.24)
    if bold:
        return True
    if regular:
        return False
    return None


def _waived(text, item):
    t = text.lower()
    i = item.lower()
    return bool(i) and (i in t or ('#' + i) in t)


def _chk(cid, name, method, status, value=None, limit=None, evidence=None):
    d = {'id': cid, 'name': name, 'method': method, 'status': status}
    if value is not None:
        d['value'] = value
    if limit is not None:
        d['limit'] = limit
    if evidence:
        d['evidence'] = evidence
    return d


# ----------------------------------------------------------------- plan against itself (deck-plan.md consistency checks)

def pattern_id(layout):
    """The pattern number named in a plan's Layout type cell ("P10 numbered-rows", "p07"), or None."""
    m = PATTERN_ID_RE.search(layout or '')
    n = int(m.group(1)) if m else None
    return n if n in PATTERN_PROFILES else None


def pattern_checks(plan, profile):
    """Each slide's pattern is meant for the plan's profile (patterns.md, Profiles: line), and talk/pitch decks
    use at most two slides of the rows family (P07, P09, P10), which look alike whatever their id. Found by a
    test run: a 6-slide pitch built P10, P09 and P07 back to back, and passed every other check."""
    out = []
    rows = [(s['no'], pattern_id(s['layout'])) for s in plan['slides']]
    known = [(n, p) for n, p in rows if p is not None]
    if not profile or not known:
        return out
    waivers = (plan.get('waivers') or '').lower()
    misfit = ['slide %s: P%02d is for %s' % (n, p, ', '.join(PATTERN_PROFILES[p])) for n, p in known
              if profile not in PATTERN_PROFILES[p] and not re.search(r'\bp\s?0?%d\b' % p, waivers)]
    out.append(_chk('P4', 'plan: every pattern is meant for the profile (patterns.md, Profiles line)', 'file (plan)',
                    'fail' if misfit else 'pass', value=len(misfit),
                    evidence=('; '.join(misfit[:6]) + '; pick the pattern for this job in %s, or name the pattern id in the '
                              'Waivers line with the user\'s words' % profile) if misfit
                    else 'all %d pattern rows fit %s' % (len(known), profile)))
    if profile in ('talk', 'pitch'):
        fam = [n for n, p in known if p in ROWS_FAMILY]
        if len(fam) > ROWS_FAMILY_MAX:
            out.append(_chk('P4', 'plan: at most %d slides of the rows family (P07, P09, P10) in talk or pitch' % ROWS_FAMILY_MAX,
                            'file (plan)', 'observation', value=len(fam), limit=ROWS_FAMILY_MAX,
                            evidence='slides %s look alike (label column, rows separated by rules): change the pattern of all '
                                     'but two (render review, check 13c)' % ', '.join(str(n) for n in fam)))
    return out


def self_checks(plan, prof, cd, profile=None):
    out = []
    dups = plan.get('duplicate_labels') or []
    if dups:
        # a repeated design label is resolved by section 4, a repeated direction label by section 2 (0.22: was
        # hardcoded to section 4 only, so 2-3 candidate directions each restating "Pattern variants:" failed)
        amb = [d for d in dups if not d[3]]
        out.append(_chk('P0', 'plan: every label appears once (or is read from its owning section: design labels '
                        'from section 4, direction labels from section 2)', 'file (plan)',
                        'fail' if amb else 'observation', value=[d[0] for d in dups],
                        evidence='; '.join('"%s:" appears %d times, used the one under %s' % (d[0].capitalize(), d[1], d[2]) for d in dups)
                        + ('' if amb else '; write other sections without these label words to silence this (section 7, As built, is exempt)')))
    roles = [r for r in plan['roles'] if r['size']]
    if roles:
        bad = []
        for r in roles:
            kind = _role_kind(r['name'])
            lo = {'title': prof['title_min'], 'body': prof['body_min']}.get(kind, prof['foot_min'])
            hi = prof['title_max'] if kind == 'title' else None
            if r['size'] < lo - 0.01 or (hi and r['size'] > hi + 0.01):
                bad.append('%s %g pt (allowed %s%s)' % (r['name'], r['size'], '>= %g' % lo, ', <= %g' % hi if hi else ''))
        out.append(_chk('P2', 'plan: role sizes within profile limits', 'file (plan)', 'fail' if bad else 'pass',
                        value=[r['size'] for r in roles], evidence='; '.join(bad) if bad else 'all %d roles within limits' % len(roles)))
        sizes = sorted({r['size'] for r in roles})
        steps = ['%g/%g = %.2f' % (a, b, b / a) for a, b in zip(sizes, sizes[1:]) if b / a < cd.STEP_FACTOR - 1e-9]
        out.append(_chk('P2', 'plan: neighbouring role sizes differ by at least 1.25', 'file (plan)', 'fail' if steps else 'pass',
                        value=sizes, limit=cd.STEP_FACTOR, evidence='; '.join(steps) if steps else 'all steps >= 1.25'))
    else:
        out.append(_chk('P2', 'plan: role sizes within profile limits', 'file (plan)', 'not_measured',
                        evidence='; '.join(plan['notes']) or 'no roles with a size'))

    pal = plan['palette']
    if pal:
        acc_hex = sorted({p['hex'] for p in pal if p['role'] == 'accent'})
        sig_hex = sorted({p['hex'] for p in pal if p['role'] == 'signal'})
        n_acc, n_sig = len(acc_hex), len(sig_hex)
        ok = n_acc <= 1 and n_sig <= 2
        # name every hex under its role, not just the count: a role word stays in effect for later
        # comma-separated hexes until the next role word (intended for one role's own shades), so an
        # unexpected count is otherwise invisible until someone re-reads the raw Palette text (0.22)
        out.append(_chk('P3', 'plan: palette has 1 accent and at most 2 signal colours (a positive/negative pair)', 'file (plan)', 'pass' if ok else 'fail',
                        value={'accent': n_acc, 'signal': n_sig}, limit={'accent': 1, 'signal': 2},
                        evidence='accent: %s; signal: %s. A role word stays in effect for the hexes after it until the next role '
                                 'word or line break; one direction\'s whole palette per "Palette:" line, written once, avoids this'
                                 % (', '.join(acc_hex) or 'none', ', '.join(sig_hex) or 'none')))
        unl = [p['hex'] for p in pal if p['role'] == 'unlabelled']
        if unl:
            out.append(_chk('P3', 'plan: palette entries without a role word', 'file (plan)', 'observation', value=unl,
                            evidence='write background / text / accent / signal / neutral next to each hex'))
        backs = [p['hex'] for p in pal if p['role'] == 'background']
        # The plan does not say which surface a role sits on, so each role colour must reach the threshold on at least one
        # declared background (write panels such as a coloured decision bar as further background entries).
        # The measured deck check tests every text against the surface it really sits on.
        pairs, bad = [], []
        for r in roles:
            cols = r['colors'] or [p['hex'] for p in pal if p['role'] == 'text']
            for c in cols:
                large = r['size'] >= 18 or (r['size'] >= 14 and _weight_bold(r['weight']))
                need = cd.LARGE_TEXT_CONTRAST if large else cd.TEXT_CONTRAST
                best = max((cd.contrast(c, b), b) for b in backs) if backs else None
                if best:
                    pairs.append(best[0])
                    if best[0] < need - 1e-9:
                        bad.append('%s %s reaches %.2f:1 at best, on %s (need %g:1)' % (r['name'], c, best[0], best[1], need))
        if backs and pairs:
            out.append(_chk('P3', 'plan: role colours against palette backgrounds (contrast)', 'computed', 'fail' if bad else 'pass',
                            value=round(min(pairs), 2), evidence='; '.join(bad[:5]) if bad else '%d pairs computed' % len(pairs)))
        else:
            out.append(_chk('P3', 'plan: role colours against palette backgrounds (contrast)', 'computed', 'not_measured',
                            evidence='need a background hex and a colour per role (or a text hex) in the plan'))
    else:
        out.append(_chk('P3', 'plan: palette rule and contrast', 'file (plan)', 'not_measured', evidence='; '.join(plan['notes'])))

    if plan['slides']:
        if plan['layout_types']:
            unknown = ['slide %s: "%s"' % (s['no'], s['layout']) for s in plan['slides']
                       if not any(t in s['layout'] or s['layout'] in t for t in plan['layout_types'])]
            out.append(_chk('P4', 'plan: every slide row uses a layout type defined in the design system', 'file (plan)',
                            'fail' if unknown else 'pass', evidence='; '.join(unknown[:5]) if unknown else 'all rows match'))
        out += pattern_checks(plan, profile or plan.get('profile'))
        data_rows = [s for s in plan['slides'] if re.search(r'chart|table|graph|diagram|data|plot', s['exhibit'], re.I)]
        nosrc = ['slide %s' % s['no'] for s in data_rows if len(s['source'].strip(' -—–')) < 3]
        out.append(_chk('P5', 'plan: every data slide row has a source', 'file (plan)', 'fail' if nosrc else 'pass',
                        value=len(data_rows), evidence=('no source in: ' + ', '.join(nosrc)) if nosrc else 'checked %d data rows' % len(data_rows)))
        odd_no = ['row %d: "No." reads "%s"' % (s['no'], s['no_label']) for s in plan['slides'] if not s['no_clean']]
        if odd_no:
            out.append(_chk('P4', 'plan: the "No." column is a plain ordinal', 'file (plan)', 'observation',
                            evidence='matched by the row\'s position in the table, not by this label, so it never picks the wrong deck slide: '
                                     + '; '.join(odd_no[:6])))
    return out


# ----------------------------------------------------------------- deck against plan (check 12)

def compare(plan, facts, report, cd):
    out = []
    w = plan['waivers']
    n = facts['slide_count']
    if plan['slides']:
        out.append(_chk('12', 'slide count equals plan rows', 'file', 'pass' if n == len(plan['slides']) else 'fail',
                        value=n, limit=len(plan['slides']), evidence='deck has %d slides, plan lists %d' % (n, len(plan['slides']))))
        norm = lambda s: re.sub(r'\s+', ' ', (s or '')).strip().rstrip('.').casefold()
        diff, skipped = [], 0
        for row in plan['slides']:
            k = row['no'] - 1
            if not 0 <= k < n:
                continue
            pt = row['title']
            if norm(pt) in EMPTY_TITLE:
                skipped += 1
                continue
            if norm(pt) != norm(facts['titles'][k]):
                diff.append('slide %d: plan "%s" / deck "%s"' % (row['no'], pt[:50], (facts['titles'][k] or '')[:50]))
        out.append(_chk('12', 'slide titles equal the plan', 'file', 'fail' if diff else 'pass',
                        evidence='; '.join(diff[:5]) if diff else 'titles match (%d rows without a plan title skipped)' % skipped))
        mism = []
        for row in plan['slides']:
            k = row['no'] - 1
            if 0 <= k < n:
                dl = (facts['layouts'][k] or '').lower()
                if not (row['layout'] and (row['layout'] in dl or (dl and dl in row['layout']))):
                    mism.append('slide %d: plan "%s" / file layout "%s"' % (row['no'], row['layout'], facts['layouts'][k]))
        out.append(_chk('12', 'slide layouts match the plan layout types by name', 'file',
                        'observation' if mism else 'pass',
                        evidence=('layout names in the file do not contain the plan\'s type names; the mapping is by name only. ' + '; '.join(mism[:4])) if mism else 'all layout names match'))
    else:
        out.append(_chk('12', 'slide table of the plan', 'file', 'not_measured', evidence='; '.join(plan['notes'])))

    roles = [r for r in plan['roles'] if r['size']]
    if roles:
        fams = {r['family'].lower() for r in roles if r['family']}
        used = {}
        for r in facts['runs']:
            if r['font']:
                used.setdefault(r['font'], []).append(r['ref'])
        extra = [f for f in used if f.lower() not in fams]
        unwaived = [f for f in extra if not _waived(w, f)]
        if fams:
            status = 'fail' if unwaived else ('waived' if extra else 'pass')
            out.append(_chk('12', 'fonts are those of the plan', 'file', status, value=sorted(used),
                            evidence=('not in plan: ' + ', '.join('%s (%s)' % (f, used[f][0]) for f in unwaived)) if unwaived else
                            ('waived by brief: ' + ', '.join(extra) if extra else 'plan families: ' + ', '.join(sorted(fams)))))
        role_sizes = {}
        for r in roles:
            role_sizes.setdefault(round(r['size'], 2), []).append(r)
        off = {}
        for r in facts['runs']:
            if r['size'] is not None and round(r['size'], 2) not in role_sizes:
                off.setdefault(round(r['size'], 2), []).append('slide %d %s' % (r['slide'], r['ref'].split(' ', 1)[-1]))
        for z in facts.get('chart_sizes', []):
            if round(z, 2) not in role_sizes:
                off.setdefault(round(z, 2), []).append('chart text')
        out.append(_chk('12', 'text sizes are role sizes of the plan', 'file', 'fail' if off else 'pass',
                        value=sorted(off) or None, limit=sorted(role_sizes),
                        evidence='; '.join('%g pt at %s' % (z, ', '.join(v[:2])) for z, v in sorted(off.items())[:5]) if off else 'every run size is a role size'))
        wrong = []
        for r in facts['runs']:
            cand = role_sizes.get(round(r['size'], 2)) if r['size'] is not None else None
            if not cand:
                continue
            wanted = {_weight_bold(c['weight']) for c in cand} - {None}
            if wanted and len(wanted) == 1 and r['bold'] not in wanted:
                wrong.append('slide %d %s is %s, plan says %s' % (r['slide'], r['ref'].split(' ', 1)[-1], 'bold' if r['bold'] else 'regular', cand[0]['weight']))
        out.append(_chk('12', 'weights match the plan roles (bold or regular)', 'file', 'fail' if wrong else 'pass',
                        evidence='; '.join(sorted(set(wrong))[:4]) if wrong else 'checked runs whose size identifies a role'))
    else:
        out.append(_chk('12', 'fonts, sizes and weights against the plan', 'file', 'not_measured', evidence='; '.join(plan['notes'])))

    if plan['palette']:
        allowed = {p['hex'] for p in plan['palette']}
        extra = {h: wh for h, wh in facts['colors'].items() if h not in allowed}
        unwaived = {h: wh for h, wh in extra.items() if not _waived(w, h)}
        status = 'fail' if unwaived else ('waived' if extra else 'pass')
        out.append(_chk('12', 'colours used are palette colours of the plan', 'file', status, value=sorted(extra) or None,
                        evidence=('not in plan: ' + '; '.join('%s (%s)' % (h, wh[0]) for h, wh in sorted(unwaived.items())[:5])) if unwaived else
                        ('waived by brief: ' + ', '.join(sorted(extra)) if extra else 'all %d colours are in the palette' % len(facts['colors']))))
    else:
        out.append(_chk('12', 'colours against the plan palette', 'file', 'not_measured', evidence='; '.join(plan['notes'])))

    if plan['margin_pt'] is not None and facts['min_inset_pt'] is not None:
        ok = facts['min_inset_pt'] >= plan['margin_pt'] - cd.TOL
        out.append(_chk('12', 'shapes keep the plan margin', 'file', 'pass' if ok else 'fail', value=facts['min_inset_pt'],
                        limit=round(plan['margin_pt'], 1), evidence='smallest edge distance %.1f pt at %s' % (facts['min_inset_pt'], facts['min_inset_at'])))
        if abs(plan['margin_pt'] - cd.MARGIN_PT) > cd.TOL:
            out.append(_chk('12', 'plan margin differs from the rule value 48 pt', 'file (plan)', 'observation', value=round(plan['margin_pt'], 1),
                            limit=cd.MARGIN_PT, evidence='check 3 still measures against 48 pt; a different margin needs a waiver in the plan'))
    else:
        out.append(_chk('12', 'shapes keep the plan margin', 'file', 'not_measured', evidence='no margin in the plan or no shapes measured'))
    return out


def attach(report, plan_text, prof, cd):
    plan = parse_plan(plan_text)
    facts = report['facts']
    checks = self_checks(plan, prof, cd, report['profile']) + compare(plan, facts, report, cd)
    if plan['profile'] and plan['profile'] != report['profile']:
        checks.insert(0, _chk('P1', 'plan profile equals the profile used for the run', 'file (plan)', 'fail',
                              value=plan['profile'], limit=report['profile'], evidence='the plan says %s, the script ran with %s' % (plan['profile'], report['profile'])))
    report['plan'] = {'parsed': {'profile': plan['profile'], 'roles': len(plan['roles']), 'palette': len(plan['palette']),
                                 'margin_pt': plan['margin_pt'], 'layout_types': plan['layout_types'], 'slide_rows': len(plan['slides']),
                                 'waivers': plan['waivers'].strip()[:200], 'notes': plan['notes']},
                      'checks': checks}


# ----------------------------------------------------------------- derive a plan from a deck without one

def derive(report, cd):
    facts = report['facts']
    prof = report['profile']
    groups = {}
    for r in facts['runs']:
        if r['size'] is None:
            continue
        key = (r['size'], r['bold'], r['font'], r['color'])
        g = groups.setdefault(key, {'slides': set(), 'title': False, 'source': False})
        g['slides'].add(r['slide'])
        g['title'] |= r['title']
        g['source'] |= r['source']
    lines = ['# Deck plan (DERIVED FROM FILE): %s' % report['file'], '',
             'Facts only, read from the file by `scripts/check_deck.py --derive-plan`. Direction, story and rationale are not derivable and are left empty.',
             'Role names beyond title and footnote/source are placeholders: rename them by purpose, then review.', '',
             '## 1. Brief', 'Profile: %s' % prof, 'Waivers: (none derived; add brand or template items the user pinned)', '',
             '## 2. Direction', 'Not derived. Run direction.md for a redesign; a refinement keeps the look as measured below.', '',
             '## 3. Story', 'Title strand:']
    for k, t in enumerate(facts['titles'], 1):
        lines.append('  %d. %s' % (k, t or '(no title)'))
    lines += ['', '## 4. Design system (deck-wide)']
    fams = sorted(facts['fonts'])
    lines.append('Fonts: %s' % (', '.join(fams) or 'none resolved'))
    lines += ['Text roles:', '', '| role | family | weight | size pt | colour | use |', '|---|---|---|---|---|---|']
    ordered = sorted(groups.items(), key=lambda kv: -kv[0][0])
    used_names = {}
    for (size, bold, font, color), g in ordered:
        if g['title']:
            name = 'title'
        elif g['source']:
            name = 'footnote/source'
        else:
            name = 'text-%gpt' % size
        used_names[name] = used_names.get(name, 0) + 1
        if used_names[name] > 1:
            name += '-%d' % used_names[name]
        lines.append('| %s | %s | %s | %g | %s | slides %s |' % (name, font or '?', 'bold' if bold else 'regular', size, color or '?',
                                                               ','.join(str(s) for s in sorted(g['slides']))))
    for z in facts.get('chart_sizes', []):
        if not any(k[0] == z for k in groups):
            lines.append('| chart-text-%gpt | - | regular | %g | - | charts |' % (z, z))
    lines.append('')
    bgs = sorted({h for h, wh in facts['colors'].items() if any('background' in x for x in wh)})
    text_cols = sorted({r['color'] for r in facts['runs'] if r['color']})
    other = sorted(set(facts['colors']) - set(bgs) - set(text_cols))
    pal = []
    for h in bgs:
        pal.append('background %s' % h)
    for h in text_cols:
        if h not in bgs:
            pal.append('text %s' % h)
    for h in other:
        hue = cd.hue_family_key(h)
        pal.append(('neutral %s' % h) if hue is None else ('accent-or-signal %s' % h))
    lines.append('Palette: ' + ' | '.join(pal) if pal else 'Palette: none resolved')
    mi = facts['min_inset_pt']
    lines.append('Grid and spacing: slide %s x %s pt; smallest measured margin %s pt' % (report['slide_size_pt'][0], report['slide_size_pt'][1], mi if mi is not None else '?'))
    layouts = sorted({l for l in facts['layouts'] if l})
    lines.append('Layout types: ' + (', '.join(l.lower() for l in layouts) or 'none named'))
    lines += ['', '## 5. Slide plan', '', '| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |', '|---|---|---|---|---|---|---|']
    for k, t in enumerate(facts['titles'], 1):
        sf = facts['slide_facts'][k - 1]
        lines.append('| %d | %s | %s | | %s | %s | |' % (k, (facts['layouts'][k - 1] or '').lower(), (t or '').replace('|', '/'),
                                                      ', '.join(sf['exhibits']) or '-', (sf['source'] or '-').replace('|', '/')))
    lines.append('')
    return '\n'.join(lines)


# ----------------------------------------------------------------- command line: check the plan before building

def main(argv=None):
    """python3 plan.py deck-plan.md [--profile read] [--json]: the plan's own consistency checks (deck-plan.md,
    "Consistency checks on the plan itself"), no deck needed. Exit code 1 = at least one fail."""
    import argparse
    import json
    import os
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import check_deck as cd
    ap = argparse.ArgumentParser(description=main.__doc__)
    ap.add_argument('plan')
    ap.add_argument('--profile', choices=sorted(cd.PROFILES), help='default: the plan\'s own Profile line')
    ap.add_argument('--json', action='store_true', help='print the checks as JSON instead of one line each')
    a = ap.parse_args(argv)
    try:
        with open(a.plan, encoding='utf-8') as fh:
            text = fh.read()
    except OSError as e:
        print('cannot open %s: %s' % (a.plan, e), file=sys.stderr)
        return 2
    plan = parse_plan(text)
    profile = a.profile or plan['profile']
    if profile is None:
        print('need --profile (or a "Profile:" line in the plan)', file=sys.stderr)
        return 2
    checks = self_checks(plan, cd.PROFILES[profile], cd, profile)
    if a.json:
        print(json.dumps({'profile': profile, 'notes': plan['notes'], 'checks': checks}, indent=2, ensure_ascii=False))
    else:
        for c in checks:
            print('[%s] %s: %s%s' % (c['id'], c['status'], c['name'], (' - ' + c['evidence']) if c.get('evidence') else ''))
        for n in plan['notes']:
            print('note: %s' % n)
    return 1 if any(c['status'] == 'fail' for c in checks) else 0


if __name__ == '__main__':
    import sys
    sys.exit(main())
