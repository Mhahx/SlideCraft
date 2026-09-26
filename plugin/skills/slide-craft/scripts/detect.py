"""slide-craft detector: typical AI-slide patterns, read from the file (check 9 of rules-core.md).

Transferred from Impeccable's deterministic detector rules (crates/live/assets/antipatterns.json in
pbakaus/impeccable) to OOXML shapes. Every finding names its rule id, the shapes and the geometry it
was read from. Thresholds below are starting values, tested on a synthetic AI-style deck
(tests/fixtures/slop.pptx) and four example decks only. A rule id quoted in the plan's Waivers line turns that finding into "waived".

Statuses: fail where the pattern is unambiguous in the file, observation where the file cannot tell a
legitimate use from the reflex (the reason is in the evidence).
"""
import re

TOL = 3.0            # pt, edge alignment
SAME_SIZE = 0.05     # relative size difference for "equal-sized" cards
VISIBLE = 1.05       # contrast ratio below which a fill or outline is invisible on its surface

RULES = {
    'nested-cards': 'container inside a container (card in card)',
    'card-grid': 'three or more equal cards as slide structure',
    'icon-tile-stack': 'small icon tile above a heading, repeated',
    'stat-row': 'row of big numbers with small labels (hero-metric template)',
    'number-card': 'single big number boxed in a card',
    'side-stripe': 'coloured edge stripe on a box',
    'border-on-rounded': 'thick outline on a rounded box',
    'kicker': 'short label directly above the title',
    'numbered-labels': 'decorative 01 / 02 / 03 labels',
    'buzzword': 'filler vocabulary',
    'question-title': 'title is a question, not a claim',
    'justified-text': 'justified running text',
    'centered-running-text': 'centered running text',
    'all-caps-body': 'running text in capitals',
    'wide-tracking': 'letter-spaced running text',
    'shape-illustration': 'picture assembled from many simple shapes',
    'glass-stack': 'more than one translucent glass panel on a slide',
}

BIG_NUMBER_PT = 40.0
NUMBER_RE = re.compile(r'^[\s+\-−–~≈<>]*[\d][\d.,\s]*\s*(%|x|×|k|m|mio\.?|mrd\.?|bn|€|\$|£|db|km|kg|g|t|h|min|pt|ct|p\.?\s?p\.?)?\s*$', re.I)
LEAD_ZERO_RE = re.compile(r'^\s*0\d[.)]?\s*$')
# status marks are trackers, not kickers (rules-core glossary; MCK-DC p8, BCG-IRA p10, BAIN-IABC p9)
STATUS_RE = re.compile(r'(preliminary|draft|confidential|proprietary|pre-decisional|illustrative|not exhaustive|non-exhaustive|for discussion|'
                       r'vorl\u00e4ufig|entwurf|vertraulich|illustrativ|nicht abschlie\u00dfend|zur diskussion)', re.I)
BUZZ = [
    r'seamless(ly)?', r'powerful', r'holistic', r'synerg(y|ies|istic)', r'game[- ]?changer', r'cutting[- ]edge',
    r'next[- ]gen(eration)?', r'world[- ]class', r'best[- ]in[- ]class', r'revolutionary', r'market[- ]leading',
    r'empower(s|ed|ing)?', r'supercharg(e|es|ed|ing)', r'streamlin(e|es|ed|ing)', r'enterprise[- ]grade',
    r'nahtlos(e|en|er|es)?', r'leistungsstark(e|en|er|es)?', r'ganzheitlich(e|en|er|es)?', r'synergie(n|effekte)?',
    r'hebeln', r'bahnbrechend(e|en|er|es)?', r'revolutionär(e|en|er|es)?', r'marktführend(e|en|er|es)?',
    r'zukunftsweisend(e|en|er|es)?', r'gamechanger',
]
BUZZ_RE = re.compile(r'(?<![\w-])(%s)(?![\w-])' % '|'.join(BUZZ), re.I)


def _area(b):
    return b[2] * b[3]


def _inside(inner, outer, tol=1.0):
    return (inner[0] >= outer[0] - tol and inner[1] >= outer[1] - tol and
            inner[0] + inner[2] <= outer[0] + outer[2] + tol and inner[1] + inner[3] <= outer[1] + outer[3] + tol)


def _center_in(inner, outer):
    cx, cy = inner[0] + inner[2] / 2, inner[1] + inner[3] / 2
    return outer[0] <= cx <= outer[0] + outer[2] and outer[1] <= cy <= outer[1] + outer[3]


def _visible_on(hexv, surface, cd):
    if hexv is None or surface is None:
        return True
    return cd.contrast(hexv, surface) >= VISIBLE


def _fill_hex(s):
    return s.fill.get('hex') if s.fill['kind'] == 'solid' and s.fill.get('alpha', 1.0) >= 0.1 else None


def _surface_visible(s, surface, cd):
    """A shape shows as a box on `surface` (hex or None) through its fill or its outline."""
    if s.fill['kind'] in ('gradient', 'pattern'):
        return True
    fh = _fill_hex(s)
    if fh is not None and _visible_on(fh, surface, cd):
        return True
    ln = s.line
    return bool(ln['visible'] and (ln['width'] is None or ln['width'] >= 0.25) and _visible_on(ln['hex'], surface, cd))


def _words(text):
    return [w for w in text.split() if re.search(r'\w', w)]


def _num_text(s):
    t = s.text.strip()
    return len(t) <= 12 and bool(NUMBER_RE.match(t))


def _max_size(s):
    sizes = [r['size'] for r in s.runs() if r['size']]
    return max(sizes) if sizes else None


def detect_slide(shapes, bg, sw, sh, title, profile, exempt, cd):
    """Return list of findings: dicts with rule, status, evidence, value."""
    bg_hex = bg.get('hex') if bg.get('kind') == 'solid' else None
    live = [s for s in shapes if s.bbox is not None and not cd.is_ground(s, sw, sh)]
    texts = [s for s in live if s.kind in ('text', 'table') and s.has_text and not s.is_source
             and not (s.ph and cd.norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt'))]
    found = []

    def add(rule, status, evidence, value=None):
        found.append({'rule': rule, 'status': status, 'evidence': evidence, 'value': value})

    # containers: boxes that show on the slide (fill or outline), not placeholders, not lines
    boxes = [s for s in live if s.kind in ('shape', 'text') and not s.ph and s.bbox[2] >= 36 and s.bbox[3] >= 24
             and _surface_visible(s, bg_hex, cd)]

    def text_in(c):
        return c.has_text or any(t is not c and t.kind == 'text' and _center_in(t.bbox, c.bbox) for t in texts)

    def text_items(c):
        """Number of separate text items in a box: its own paragraphs with text plus text shapes centred inside it."""
        own = sum(1 for p in c.paras if ''.join(r['text'] for r in p).strip())
        return own + sum(1 for t in texts if t is not c and t.kind == 'text' and _center_in(t.bbox, c.bbox))

    def is_band(inner, outer):
        """A header or footer band: flush with the top or bottom edge of its panel, (nearly) full width, low."""
        ix, iy, iw, ih = inner.bbox
        ox, oy, ow, oh = outer.bbox
        flush = abs(iy - oy) <= TOL or abs((iy + ih) - (oy + oh)) <= TOL
        return flush and iw >= 0.9 * ow and ih <= 0.35 * oh

    # nested-cards
    pairs = []
    for outer in boxes:
        for inner in boxes:
            if inner is outer or not _inside(inner.bbox, outer.bbox) or _area(inner.bbox) >= 0.9 * _area(outer.bbox):
                continue
            surface = _fill_hex(outer) or bg_hex
            if is_band(inner, outer):
                continue    # a panel's header band is panel grammar in consulting decks, not a card in a card
            if _surface_visible(inner, surface, cd) and text_in(inner):
                pairs.append('%s in %s' % (inner.ref, outer.ref))
    if pairs:
        add('nested-cards', 'fail', '; '.join(pairs[:4]) + (' (+%d more)' % (len(pairs) - 4) if len(pairs) > 4 else ''), len(pairs))

    # card-grid: >= 3 equal-sized boxes with text, sharing a row or a column
    # a card holds a heading and more (two or more text items); a row label or a header bar holds one
    cards = [c for c in boxes if c.bbox[2] >= 72 and c.bbox[3] >= 48 and text_items(c) >= 2]
    groups = []
    for c in sorted(cards, key=lambda c: -_area(c.bbox)):
        for g in groups:
            r = g[0].bbox
            if abs(c.bbox[2] - r[2]) <= SAME_SIZE * max(c.bbox[2], r[2]) and abs(c.bbox[3] - r[3]) <= SAME_SIZE * max(c.bbox[3], r[3]):
                g.append(c)
                break
        else:
            groups.append([c])
    for g in groups:
        if len(g) < 3:
            continue
        ys = [c.bbox[1] for c in g]
        xs = [c.bbox[0] for c in g]
        aligned = any(sum(1 for y in ys if abs(y - y0) <= TOL) >= 2 for y0 in ys) or any(sum(1 for x in xs if abs(x - x0) <= TOL) >= 2 for x0 in xs)
        if aligned:
            add('card-grid', 'fail', '%d equal boxes %.0f x %.0f pt: %s' % (len(g), g[0].bbox[2], g[0].bbox[3], ', '.join(c.ref for c in g[:4])), len(g))

    # icon-tile-stack: small square-ish shape or picture right above a text, twice or more
    cand = [s for s in live if s.kind in ('shape', 'pic') and not s.has_text and 20 <= s.bbox[2] <= 72 and 20 <= s.bbox[3] <= 72
            and 0.75 <= s.bbox[2] / s.bbox[3] <= 1.33 and (s.kind == 'pic' or _surface_visible(s, bg_hex, cd))]
    cand = [s for s in cand if not any(o is not s and _inside(s.bbox, o.bbox) and _area(o.bbox) > _area(s.bbox) for o in cand)]
    tiles = []
    for tile in cand:
        bx, by, bw, bh = tile.bbox
        for t in texts:
            tx, ty, tw, th = t.bbox
            gap = ty - (by + bh)
            if -2 <= gap <= 24 and (abs(tx - bx) <= 16 or abs((tx + tw / 2) - (bx + bw / 2)) <= 8):
                tiles.append('%s above %s' % (tile.ref, t.ref))
                break
    if len(tiles) >= 2:
        add('icon-tile-stack', 'fail', '; '.join(tiles[:4]), len(tiles))

    # stat-row / number-card
    bigs = [t for t in texts if t.kind == 'text' and (_max_size(t) or 0) >= BIG_NUMBER_PT and _num_text(t)]
    rows = []
    for b in bigs:
        row = [o for o in bigs if abs(o.bbox[1] - b.bbox[1]) <= 12]
        if len(row) >= 2 and row not in rows:
            rows.append(row)
    if rows:
        r0 = max(rows, key=len)
        boxed = [o for o in r0 if any(c is not o and _center_in(o.bbox, c.bbox) for c in boxes) or _surface_visible(o, bg_hex, cd)]
        listing = ', '.join('%s "%s"' % (o.ref, o.text.strip()) for o in r0[:4])
        if len(boxed) >= 2:
            add('stat-row', 'fail', '%d big numbers in one row, %d of them boxed: %s' % (len(r0), len(boxed), listing), len(r0))
        else:
            # real decks use an unboxed row of numbers when they are parts of one measure (Bain 2019, see research)
            add('stat-row', 'observation', '%d big numbers in one row: %s; fine when they are parts of one measure with a lead-in '
                'and a source, the hero-metric template when they are unrelated metrics' % (len(r0), listing), len(r0))
    elif len(bigs) == 1:
        b = bigs[0]
        box = next((c for c in boxes if c is not b and _center_in(b.bbox, c.bbox)), None)
        if box is not None or _surface_visible(b, bg_hex, cd):
            add('number-card', 'observation', '%s "%s" sits in %s; a single number with context is fine in talk, a boxed number is the hero-metric template'
                % (b.ref, b.text.strip(), box.ref if box else 'its own filled box'))

    # side-stripe: thin filled bar flush with a box edge
    stripes = []
    for s in live:
        if s.kind != 'shape' or s.has_text or s.fill['kind'] != 'solid':
            continue
        x, y, w, h = s.bbox
        vertical = w <= 8 and h >= 24
        horizontal = h <= 8 and w >= 24
        if not (vertical or horizontal):
            continue
        for c in boxes:
            if c is s:
                continue
            cx, cy, cw, ch = c.bbox
            if vertical and y >= cy - TOL and y + h <= cy + ch + TOL and h >= 0.6 * ch and \
                    (abs(x - cx) <= TOL or abs((x + w) - (cx + cw)) <= TOL or abs((x + w) - cx) <= TOL):
                stripes.append('%s on %s' % (s.ref, c.ref))
                break
            if horizontal and x >= cx - TOL and x + w <= cx + cw + TOL and w >= 0.6 * cw and \
                    (abs(y - cy) <= TOL or abs((y + h) - (cy + ch)) <= TOL):
                stripes.append('%s on %s' % (s.ref, c.ref))
                break
    if stripes:
        add('side-stripe', 'fail', '; '.join(stripes[:4]), len(stripes))

    # border-on-rounded
    thick = ['%s (%s, %.1f pt)' % (c.ref, c.geom, c.line['width']) for c in boxes
             if c.geom in ('roundRect', 'round1Rect', 'round2SameRect', 'round2DiagRect', 'snipRoundRect')
             and c.line['visible'] and c.line['width'] is not None and c.line['width'] >= 2.0]
    if thick:
        add('border-on-rounded', 'fail', '; '.join(thick[:4]), len(thick))

    # kicker: short label directly above the title
    if title is not None and title.bbox is not None:
        tx, ty, tw, th = title.bbox
        tsize = _max_size(title) or 0
        for t in texts:
            if t is title or t.kind != 'text':
                continue
            x, y, w, h = t.bbox
            n = len(_words(t.text))
            if n == 0 or n > 5:
                continue
            gap = ty - (y + h)
            overlap = min(x + w, tx + tw) - max(x, tx)
            right_mark = x >= tx + 0.6 * tw or any(p and p[0].get('algn') == 'r' for p in t.paras)
            if STATUS_RE.search(t.text) or right_mark:
                continue    # a status mark (top right, or a status word) is a tracker, never a kicker
            if -6 <= gap <= 24 and overlap > 0:
                runs = t.runs()
                letters = re.sub(r'[^A-Za-zÄÖÜäöüß]', '', t.text)
                style = (letters and letters.isupper()) or any(r.get('caps') for r in runs) or any((r.get('spc') or 0) > 0.5 for r in runs) \
                    or ((_max_size(t) or 0) <= 0.6 * tsize)
                if style:
                    st = 'fail' if profile in ('talk', 'pitch') else 'observation'
                    add('kicker', st, '%s "%s" sits %.0f pt above the title%s' % (t.ref, t.text.strip()[:40], gap,
                        '' if st == 'fail' else '; allowed in %s only as a tracker (status or chapter, fixed position)' % profile))
                    break

    # numbered-labels
    nums = [t for t in texts if t.kind == 'text' and LEAD_ZERO_RE.match(t.text)]
    if len(nums) >= 2:
        add('numbered-labels', 'observation', '%s; allowed only when the sequence carries information (steps), then without the leading zero'
            % ', '.join('%s "%s"' % (t.ref, t.text.strip()) for t in nums[:4]), len(nums))

    # buzzwords (all visible text, including charts is not read here)
    hits = []
    for t in texts:
        for m in BUZZ_RE.finditer(t.text):
            hits.append('"%s" in %s' % (m.group(0), t.ref))
    if hits:
        add('buzzword', 'fail', '; '.join(hits[:6]), len(hits))

    # question-title
    if title is not None and not exempt and title.text.strip().endswith('?'):
        add('question-title', 'fail', '%s "%s"' % (title.ref, title.text.strip()[:80]))

    # paragraph-level text rules
    just, ctr, caps, track = [], [], [], []
    for t in texts:
        if t.kind != 'text':
            continue
        for p in t.paras:
            txt = ''.join(r['text'] for r in p)
            n = len(_words(txt))
            if not p or n < 5:
                continue
            algn = p[0].get('algn')
            if algn in ('just', 'dist', 'justLow', 'thaiDist') and n >= 8:
                just.append('%s (%d words)' % (t.ref, n))
            if algn == 'ctr' and n >= 12 and t is not title:
                ctr.append('%s (%d words)' % (t.ref, n))
            letters = re.sub(r'[^A-Za-zÄÖÜäöüß]', '', txt)
            if (letters and letters.isupper() and len(letters) >= 20) or all(r.get('caps') for r in p if r['text'].strip()):
                caps.append('%s (%d words)' % (t.ref, n))
            sz = max((r['size'] or 0) for r in p) or None
            sp = max((r.get('spc') or 0) for r in p)
            if sz and sp / sz > 0.05:
                track.append('%s (%.1f pt at %.0f pt)' % (t.ref, sp, sz))
    if just:
        add('justified-text', 'fail', '; '.join(sorted(set(just))[:4]), len(set(just)))
    if ctr:
        add('centered-running-text', 'fail', '; '.join(sorted(set(ctr))[:4]), len(set(ctr)))
    if caps:
        add('all-caps-body', 'fail', '; '.join(sorted(set(caps))[:4]), len(set(caps)))
    if track:
        add('wide-tracking', 'observation', '; '.join(sorted(set(track))[:4]) + '; tracking above 0.05 em belongs to short labels only', len(set(track)))

    # shape-illustration: many small text-less shapes clustered in one region
    small = [s for s in live if s.kind in ('shape', 'line') and not s.has_text and _area(s.bbox) < 0.05 * sw * sh]
    if len(small) >= 12:
        x0 = min(s.bbox[0] for s in small); y0 = min(s.bbox[1] for s in small)
        x1 = max(s.bbox[0] + s.bbox[2] for s in small); y1 = max(s.bbox[1] + s.bbox[3] for s in small)
        if (x1 - x0) * (y1 - y0) <= 0.5 * sw * sh:
            add('shape-illustration', 'observation', '%d text-less shapes within %.0f x %.0f pt; a picture built from primitives reads as clip art '
                '(a diagram or chart built from shapes is fine)' % (len(small), x1 - x0, y1 - y0), len(small))
    # glass-stack: translucent panels (Liquid Glass, glassmorphism). One per slide marks the focus; more read as a card grid
    glass = [s for s in live if s.kind in ('shape', 'text') and not s.ph and s.fill['kind'] == 'solid'
             and s.fill.get('alpha', 1.0) < 0.95 and s.bbox[2] >= 72 and s.bbox[3] >= 48]
    if len(glass) >= 2:
        add('glass-stack', 'fail', '%d translucent panels: %s; one glass panel per slide marks the focus, more read as a card grid'
            % (len(glass), ', '.join(g.ref for g in glass[:4])), len(glass))
    return found


def ground_colour(bg, shapes, sw, sh):
    """The colour covering the slide: background or a full-bleed filled shape on top of it."""
    for s in sorted(shapes, key=lambda s: -s.z):
        if s.kind in ('shape', 'text') and s.bbox is not None and s.bbox[2] >= 0.95 * sw and s.bbox[3] >= 0.95 * sh:
            if s.fill['kind'] == 'solid':
                return s.fill['hex'], s.ref
            if s.fill['kind'] != 'none':
                return None, s.ref
        if s.kind == 'pic' and s.bbox is not None and s.bbox[2] >= 0.95 * sw and s.bbox[3] >= 0.95 * sh:
            # the picture's own colours are not read; the background under it is the best file evidence
            if bg.get('kind') == 'solid':
                return bg['hex'], 'slide background under full-bleed picture %s' % s.ref
            return None, s.ref
    if bg.get('kind') == 'solid':
        return bg['hex'], 'slide background'
    return None, 'unresolved background'


def default_look(grounds, cd):
    """Deck-level self-check against the default AI looks (direction.md, calibration). grounds: list of (slide, hex)."""
    out = []
    viol = [(n, h) for n, h in grounds if h and _is_violet(h, cd)]
    cream = [(n, h) for n, h in grounds if h and _is_cream(h, cd)]
    navy = [(n, h) for n, h in grounds if h and _is_navy(h, cd)]
    total = len([g for g in grounds if g[1]])
    for name, hits, what in (('violet-blue ground', viol, 'white or dark ground with blue-purple as the surface colour (look 3)'),
                             ('cream ground', cream, 'warm cream ground (look 2)'),
                             ('dark navy ground', navy, 'near-black or navy ground (look 1)')):
        if total and len(hits) >= max(1, total // 2):
            out.append({'rule': 'default-look', 'status': 'observation',
                        'evidence': '%s on %d of %d slides (%s): %s. Legitimate when the direction chose it; otherwise the self-check in direction.md failed'
                        % (name, len(hits), total, ', '.join(sorted({h for _, h in hits})), what), 'value': len(hits)})
    return out


def _hls(h, cd):
    hh, l, s = cd.hls_of(h)
    return hh * 360.0, l, s


def _is_violet(h, cd):
    hue, l, s = _hls(h, cd)
    return 235 <= hue <= 290 and s >= 0.35 and 0.15 <= l <= 0.75


def _is_cream(h, cd):
    hue, l, s = _hls(h, cd)
    return 25 <= hue <= 60 and s >= 0.2 and 0.86 <= l < 0.985


def _is_navy(h, cd):
    hue, l, s = _hls(h, cd)
    return l < 0.2 and (s < 0.15 or 200 <= hue <= 250)


def is_waived(rule, waivers):
    return bool(waivers) and re.search(r'(?<![\w-])%s(?![\w-])' % re.escape(rule), waivers, re.I) is not None
