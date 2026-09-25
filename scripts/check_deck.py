#!/usr/bin/env python3
"""slide-craft check script: measures a .pptx and reports per slide, with method and origin.

Reads the OOXML directly (standard library only). Check 9 includes the detector for typical AI-slide
patterns (scripts/detect.py). Every value carries its origin
(part, shape, property). Statuses:
  pass / fail          only for checks measured from the file, computed, or run by script
  observation          estimates and heuristics (never a threshold)
  not_measured         cannot be measured here (say so instead of guessing)

Usage:
  check_deck.py deck.pptx --profile read|talk|pitch|update [--plan deck-plan.md] [--render] [--render-dir DIR] [--exempt 1,9] [--lang auto|en|de]
                          [--out report.json] [--compact]
  check_deck.py deck.pptx --profile read --derive-plan      (print a plan derived from the deck)
Exit code: 0 = no fail, 1 = at least one fail, 2 = input error.
"""
import argparse
import colorsys
import json
import math
import os
import posixpath
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

import detect as detect_mod

A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
C = '{http://schemas.openxmlformats.org/drawingml/2006/chart}'
REL = '{http://schemas.openxmlformats.org/package/2006/relationships}'

EMU_PT = 12700.0
MARGIN_PT = 48.0
FOOTER_MARGIN_PT = 18.0  # footnotes, source and page number may sit in the bottom margin (research: sources at 482-514 of 540 pt)
TOL = 0.75  # pt tolerance for geometry comparisons

# Thresholds: copied from references/profiles.md and rules-core.md. Change them there first.
PROFILES = {
    'read':   dict(title_min=20, title_max=28, title_words=15, body_min=14, foot_min=8, words=250, chars=1500, fill=0.75),
    'talk':   dict(title_min=40, title_max=None, title_words=8, body_min=24, foot_min=12, words=15, chars=90, fill=0.30),
    'pitch':  dict(title_min=28, title_max=36, title_words=10, body_min=18, foot_min=8, words=40, chars=240, fill=0.50),
    'update': dict(title_min=20, title_max=28, title_words=15, body_min=14, foot_min=8, words=80, chars=480, fill=0.60),
}
SAFE_FONTS = {'arial', 'calibri', 'cambria', 'times new roman', 'courier new',
              'bookman old style', 'century schoolbook'}
TEXT_CONTRAST = 4.5
LARGE_TEXT_CONTRAST = 3.0
NONTEXT_CONTRAST = 3.0
STEP_FACTOR = 1.25
EMOJI_RE = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿️]')
AUTO_ALT_RE = re.compile(r'(\.(png|jpe?g|gif|svg|bmp|tiff?|webp|emf|wmf)$|[\\/]|^(image|picture|graphic|chart|bild|grafik|diagramm|abbildung)\s*\d*$)', re.I)
SOURCE_RE = re.compile(r'^\s*(sources?|quellen?)\s*[:：]', re.I)
# a date on a source line: a year, a calendar week (KW/CW), a quarter or a month name
YEAR_RE = re.compile(r'\b(19|20)\d{2}\b|\b(KW|CW)\s?\d{1,2}\b|\bQ[1-4]\b|\b(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)\b', re.I)
# layouts named after the exempt patterns of patterns.md: P01 cover, P02 divider-agenda
PATTERN_EXEMPT_RE = re.compile(r'^\s*P0?[12](?![0-9])', re.I)
DASH_VALUES = {'solid', 'dot', 'dash', 'lgDash', 'dashDot', 'lgDashDot', 'lgDashDotDot', 'sysDash', 'sysDot', 'sysDashDot', 'sysDashDotDot'}
DE_STOP = set('der die das und ist nicht mit für von den dem ein eine wir sie zu im auf als auch sich wird werden'.split())


# ----------------------------------------------------------------- colour math

def hex_to_rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return ''.join('%02X' % max(0, min(255, int(round(v)))) for v in rgb)


def rel_lum(hexv):
    def lin(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = hex_to_rgb(hexv)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(h1, h2):
    l1, l2 = rel_lum(h1), rel_lum(h2)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


def blend(fg, bg, alpha):
    f, b = hex_to_rgb(fg), hex_to_rgb(bg)
    return rgb_to_hex([f[i] * alpha + b[i] * (1 - alpha) for i in range(3)])


def hls_of(hexv):
    r, g, b = [c / 255.0 for c in hex_to_rgb(hexv)]
    return colorsys.rgb_to_hls(r, g, b)  # h, l, s in 0..1


# ----------------------------------------------------------------- package access

class Package:
    def __init__(self, path):
        self.z = zipfile.ZipFile(path)
        self.names = set(self.z.namelist())
        self._cache = {}

    def xml(self, part):
        part = part.lstrip('/')
        if part not in self._cache:
            if part not in self.names:
                return None
            self._cache[part] = ET.fromstring(self.z.read(part))
        return self._cache[part]

    def rels(self, part):
        d, f = posixpath.split(part.lstrip('/'))
        rp = posixpath.join(d, '_rels', f + '.rels')
        root = self.xml(rp)
        out = {}
        if root is None:
            return out
        for r in root.findall(REL + 'Relationship'):
            tgt = r.get('Target')
            if r.get('TargetMode') == 'External':
                out[r.get('Id')] = (tgt, r.get('Type'))
                continue
            full = tgt.lstrip('/') if tgt.startswith('/') else posixpath.normpath(posixpath.join(d, tgt))
            out[r.get('Id')] = (full, r.get('Type'))
        return out


# ----------------------------------------------------------------- theme and colour resolution

class Theme:
    def __init__(self, root):
        self.colors = {}
        self.major = self.minor = None
        if root is None:
            return
        cs = root.find('.//' + A + 'clrScheme')
        if cs is not None:
            for ch in cs:
                name = ch.tag.replace(A, '')
                c = ch[0] if len(ch) else None
                if c is None:
                    continue
                if c.tag == A + 'srgbClr':
                    self.colors[name] = c.get('val').upper()
                elif c.tag == A + 'sysClr':
                    self.colors[name] = (c.get('lastClr') or '000000').upper()
        fs = root.find('.//' + A + 'fontScheme')
        if fs is not None:
            mj = fs.find(A + 'majorFont/' + A + 'latin')
            mn = fs.find(A + 'minorFont/' + A + 'latin')
            self.major = mj.get('typeface') if mj is not None else None
            self.minor = mn.get('typeface') if mn is not None else None


def resolve_color(parent, theme, clrmap):
    """parent holds a colour child (srgbClr/schemeClr/sysClr/prstClr). Returns dict or None.
    {hex, alpha, exact, note}"""
    if parent is None:
        return None
    c = None
    for ch in parent:
        if ch.tag in (A + 'srgbClr', A + 'schemeClr', A + 'sysClr', A + 'prstClr'):
            c = ch
            break
    if c is None:
        return None
    note = []
    exact = True
    if c.tag == A + 'srgbClr':
        hexv = c.get('val').upper()
    elif c.tag == A + 'sysClr':
        hexv = (c.get('lastClr') or '000000').upper()
    elif c.tag == A + 'prstClr':
        named = {'black': '000000', 'white': 'FFFFFF'}
        hexv = named.get(c.get('val'))
        if hexv is None:
            return {'hex': None, 'alpha': 1.0, 'exact': False, 'note': 'prstClr %s unsupported' % c.get('val')}
    else:
        v = c.get('val')
        v = clrmap.get(v, v)
        hexv = theme.colors.get(v)
        if hexv is None:
            return {'hex': None, 'alpha': 1.0, 'exact': False, 'note': 'scheme colour %s unresolved' % v}
        note.append('scheme %s' % c.get('val'))
    alpha = 1.0
    for t in c:
        name = t.tag.replace(A, '')
        val = t.get('val')
        if name == 'alpha':
            alpha = int(val) / 100000.0
        elif name in ('lumMod', 'lumOff'):
            pass  # applied together below
        elif name == 'tint':
            k = int(val) / 100000.0
            r, g, b = hex_to_rgb(hexv)
            hexv = rgb_to_hex([r + (255 - r) * (1 - k), g + (255 - g) * (1 - k), b + (255 - b) * (1 - k)])
            exact = False
            note.append('tint approximated in sRGB')
        elif name == 'shade':
            k = int(val) / 100000.0
            r, g, b = hex_to_rgb(hexv)
            hexv = rgb_to_hex([r * k, g * k, b * k])
            exact = False
            note.append('shade approximated in sRGB')
        elif name in ('satMod', 'hueMod', 'hueOff', 'satOff', 'sat', 'hue', 'lum'):
            exact = False
            note.append('transform %s not applied' % name)
    lm = c.find(A + 'lumMod')
    lo = c.find(A + 'lumOff')
    if lm is not None or lo is not None:
        h, l, s = hls_of(hexv)
        l = l * (int(lm.get('val')) / 100000.0 if lm is not None else 1.0) + \
            (int(lo.get('val')) / 100000.0 if lo is not None else 0.0)
        l = max(0.0, min(1.0, l))
        r, g, b = colorsys.hls_to_rgb(h, l, s)
        hexv = rgb_to_hex([r * 255, g * 255, b * 255])
    return {'hex': hexv, 'alpha': alpha, 'exact': exact, 'note': '; '.join(note)}


NEUTRAL_MAP_KEYS = ('bg1', 'tx1', 'bg2', 'tx2')


def read_clrmap(master_root):
    m = {'bg1': 'lt1', 'tx1': 'dk1', 'bg2': 'lt2', 'tx2': 'dk2'}
    if master_root is not None:
        cm = master_root.find(P + 'clrMap')
        if cm is not None:
            for k in cm.attrib:
                m[k] = cm.get(k)
    return m


# ----------------------------------------------------------------- deck model

def norm_ph_type(t):
    if t in (None, 'obj', 'body', 'tbl', 'chart', 'pic', 'media', 'clipArt', 'dgm', 'subTitle'):
        return 'body'
    if t == 'ctrTitle':
        return 'title'
    return t


class Ctx:
    """Everything needed to interpret one slide."""

    def __init__(self, pkg, slide_part, pres_root):
        self.pkg = pkg
        self.part = slide_part
        self.root = pkg.xml(slide_part)
        rels = pkg.rels(slide_part)
        self.layout_part = next((t for t, ty in rels.values() if ty.endswith('/slideLayout')), None)
        self.layout = pkg.xml(self.layout_part) if self.layout_part else None
        lrels = pkg.rels(self.layout_part) if self.layout_part else {}
        self.master_part = next((t for t, ty in lrels.values() if ty.endswith('/slideMaster')), None)
        self.master = pkg.xml(self.master_part) if self.master_part else None
        mrels = pkg.rels(self.master_part) if self.master_part else {}
        theme_part = next((t for t, ty in mrels.values() if ty.endswith('/theme')), None)
        self.theme = Theme(pkg.xml(theme_part) if theme_part else None)
        self.clrmap = read_clrmap(self.master)
        self.pres = pres_root
        self.rels = rels
        self.short = posixpath.basename(slide_part)


def ph_of(sp):
    nv = sp.find(P + 'nvSpPr/' + P + 'nvPr/' + P + 'ph')
    if nv is None:
        nv = sp.find(P + 'nvPicPr/' + P + 'nvPr/' + P + 'ph')
    if nv is None:
        nv = sp.find(P + 'nvGraphicFramePr/' + P + 'nvPr/' + P + 'ph')
    if nv is None:
        return None
    return (nv.get('type'), nv.get('idx'))


def find_ph(tree_root, ph):
    if tree_root is None or ph is None:
        return None
    ptype, pidx = ph
    want = norm_ph_type(ptype)
    tree = tree_root.find(P + 'cSld/' + P + 'spTree')
    cand = None
    for sp in tree.iter(P + 'sp'):
        p2 = ph_of(sp)
        if p2 is None:
            continue
        if pidx is not None and p2[1] == pidx:
            return sp
        if cand is None and norm_ph_type(p2[0]) == want and (pidx is None or want != 'body'):
            cand = sp
    return cand


def xfrm_of(el):
    """Return (x,y,w,h) in pt from spPr/xfrm, or None."""
    if el is None:
        return None
    x = el.find(P + 'spPr/' + A + 'xfrm')
    if x is None:
        x = el.find(P + 'xfrm')  # graphicFrame
    if x is None:
        x = el.find(P + 'grpSpPr/' + A + 'xfrm')
    if x is None:
        return None
    off, ext = x.find(A + 'off'), x.find(A + 'ext')
    if off is None or ext is None:
        return None
    return (int(off.get('x')) / EMU_PT, int(off.get('y')) / EMU_PT,
            int(ext.get('cx')) / EMU_PT, int(ext.get('cy')) / EMU_PT)


def group_frame(grp):
    x = grp.find(P + 'grpSpPr/' + A + 'xfrm')
    off, ext = x.find(A + 'off'), x.find(A + 'ext')
    cho, che = x.find(A + 'chOff'), x.find(A + 'chExt')
    return (int(off.get('x')), int(off.get('y')), int(ext.get('cx')), int(ext.get('cy')),
            int(cho.get('x')), int(cho.get('y')), int(che.get('cx')), int(che.get('cy')))


def apply_tf(bbox, tf):
    """tf = list of group frames (outer first). bbox in EMU->pt handled by caller in pt."""
    x, y, w, h = bbox
    for (ox, oy, ecx, ecy, cx, cy, ccx, ccy) in reversed(tf):
        sx = ecx / ccx if ccx else 1.0
        sy = ecy / ccy if ccy else 1.0
        x = (ox / EMU_PT) + (x - cx / EMU_PT) * sx
        y = (oy / EMU_PT) + (y - cy / EMU_PT) * sy
        w *= sx
        h *= sy
    return (x, y, w, h)


def get_fill(spPr, style, theme, clrmap):
    """Fill of a shape properties element. Returns {'kind': solid|none|gradient|picture|pattern|inherit|unresolved, hex, alpha, ...}"""
    if spPr is not None:
        for ch in spPr:
            t = ch.tag
            if t == A + 'noFill':
                return {'kind': 'none'}
            if t == A + 'solidFill':
                c = resolve_color(ch, theme, clrmap)
                if c is None or c['hex'] is None:
                    return {'kind': 'unresolved', 'note': (c or {}).get('note', 'no colour')}
                return {'kind': 'solid', 'hex': c['hex'], 'alpha': c['alpha'], 'exact': c['exact'], 'note': c['note']}
            if t == A + 'gradFill':
                return {'kind': 'gradient'}
            if t == A + 'blipFill':
                return {'kind': 'picture'}
            if t == A + 'pattFill':
                return {'kind': 'pattern'}
    if style is not None:
        fr = style.find(A + 'fillRef')
        if fr is not None:
            if fr.get('idx') == '0':
                return {'kind': 'none'}
            c = resolve_color(fr, theme, clrmap)
            if c and c['hex']:
                return {'kind': 'solid', 'hex': c['hex'], 'alpha': c['alpha'], 'exact': False,
                        'note': 'from shape style fillRef idx=%s (theme fill style not read)' % fr.get('idx')}
            return {'kind': 'unresolved', 'note': 'style fillRef without colour'}
    return {'kind': 'inherit'}


def sp_effects(spPr):
    out = []
    if spPr is None:
        return out
    ef = spPr.find(A + 'effectLst')
    if ef is not None:
        for ch in ef:
            out.append(ch.tag.replace(A, ''))
    if spPr.find(A + 'scene3d') is not None or spPr.find(A + 'sp3d') is not None:
        out.append('3d')
    return out


def get_line(spPr, style, theme, clrmap):
    """Outline of a shape: {'visible': bool, 'width': pt or None, 'hex': str or None, 'origin': str}."""
    ln = spPr.find(A + 'ln') if spPr is not None else None
    if ln is not None:
        if ln.find(A + 'noFill') is not None:
            return {'visible': False, 'width': None, 'hex': None, 'origin': 'spPr ln noFill'}
        width = int(ln.get('w')) / EMU_PT if ln.get('w') else None
        sf = ln.find(A + 'solidFill')
        if sf is not None:
            c = resolve_color(sf, theme, clrmap)
            return {'visible': True, 'width': width if width is not None else 0.75, 'hex': c['hex'] if c else None, 'origin': 'spPr ln'}
        if ln.find(A + 'gradFill') is not None or ln.find(A + 'pattFill') is not None:
            return {'visible': True, 'width': width if width is not None else 0.75, 'hex': None, 'origin': 'spPr ln (gradient/pattern)'}
    if style is not None:
        lr = style.find(A + 'lnRef')
        if lr is not None and lr.get('idx') not in (None, '0'):
            c = resolve_color(lr, theme, clrmap)
            return {'visible': True, 'width': None, 'hex': c['hex'] if c else None,
                    'origin': 'style lnRef idx=%s (theme line width not read)' % lr.get('idx')}
    return {'visible': False, 'width': None, 'hex': None, 'origin': 'no outline'}


def geom_of(spPr):
    if spPr is None:
        return None
    g = spPr.find(A + 'prstGeom')
    if g is not None:
        return g.get('prst')
    if spPr.find(A + 'custGeom') is not None:
        return 'custom'
    return None


# ----------------------------------------------------------------- text style inheritance

def lvl_defrpr(container, lvl):
    if container is None:
        return None
    n = container.find(A + 'lvl%dpPr' % (lvl + 1))
    if n is None:
        return None
    return n.find(A + 'defRPr')


def style_sources(ctx, ph, layout_sp, master_sp, own_lst):
    """Ordered list of (label, lstStyle-like element) from specific to generic."""
    src = []
    if own_lst is not None:
        src.append(('shape lstStyle', own_lst))
    if layout_sp is not None:
        src.append(('layout placeholder lstStyle', layout_sp.find(P + 'txBody/' + A + 'lstStyle')))
    if master_sp is not None:
        src.append(('master placeholder lstStyle', master_sp.find(P + 'txBody/' + A + 'lstStyle')))
    if ctx.master is not None:
        ts = ctx.master.find(P + 'txStyles')
        if ts is not None:
            if ph is not None:
                kind = norm_ph_type(ph[0])
                name = 'titleStyle' if kind == 'title' else ('otherStyle' if kind in ('dt', 'ftr', 'sldNum') else 'bodyStyle')
            else:
                name = None
            if name:
                src.append(('master txStyles/' + name, ts.find(P + name)))
    if ctx.pres is not None:
        src.append(('presentation defaultTextStyle', ctx.pres.find(P + 'defaultTextStyle')))
    return [(l, e) for l, e in src if e is not None]


def lookup_rpr(rpr, sources, lvl, getter):
    """Return (value, origin) for the first level that defines the property."""
    if rpr is not None:
        v = getter(rpr)
        if v is not None:
            return v, 'run rPr'
    for label, cont in sources:
        d = lvl_defrpr(cont, lvl)
        if d is not None:
            v = getter(d)
            if v is not None:
                return v, label
    return None, 'unresolved'


def g_size(e):
    v = e.get('sz')
    return int(v) / 100.0 if v else None


def g_bold(e):
    v = e.get('b')
    return (v in ('1', 'true')) if v is not None else None


def g_font(e):
    n = e.find(A + 'latin')
    return n.get('typeface') if n is not None and n.get('typeface') else None


def make_color_getter(ctx):
    def g(e):
        sf = e.find(A + 'solidFill')
        if sf is None:
            return None
        c = resolve_color(sf, ctx.theme, ctx.clrmap)
        return c if c else None
    return g


def resolve_font(name, theme):
    if name == '+mj-lt':
        return theme.major or name
    if name == '+mn-lt':
        return theme.minor or name
    return name


def read_paragraphs(ctx, tx, ph, layout_sp, master_sp, shape_ref, fontscale=1.0):
    """tx: element with a:p children (txBody or tc/txBody). Returns list of paragraphs (list of run dicts)."""
    own_lst = tx.find(A + 'lstStyle')
    sources = style_sources(ctx, ph, layout_sp, master_sp, own_lst)
    cget = make_color_getter(ctx)
    paras = []
    for p in tx.findall(A + 'p'):
        ppr = p.find(A + 'pPr')
        lvl = int(ppr.get('lvl')) if ppr is not None and ppr.get('lvl') else 0
        algn = ppr.get('algn') if ppr is not None else None
        if algn is None:
            for _label, cont in sources:
                lp = cont.find(A + 'lvl%dpPr' % (lvl + 1))
                if lp is not None and lp.get('algn'):
                    algn = lp.get('algn')
                    break
        runs = []
        for r in p:
            if r.tag not in (A + 'r', A + 'fld'):
                continue
            t = r.find(A + 't')
            text = t.text if t is not None and t.text else ''
            rpr = r.find(A + 'rPr')
            size, so = lookup_rpr(rpr, sources, lvl, g_size)
            bold, _ = lookup_rpr(rpr, sources, lvl, g_bold)
            font, fo = lookup_rpr(rpr, sources, lvl, g_font)
            col, co = lookup_rpr(rpr, sources, lvl, cget)
            cap, _ = lookup_rpr(rpr, sources, lvl, lambda e: e.get('cap'))
            spc, _ = lookup_rpr(rpr, sources, lvl, lambda e: int(e.get('spc')) / 100.0 if e.get('spc') else None)
            eff = size * fontscale if size is not None else None
            runs.append({
                'text': text,
                'size': eff, 'size_raw': size, 'size_origin': '%s %s' % (shape_ref, so),
                'bold': bool(bold),
                'font': resolve_font(font, ctx.theme) if font else None, 'font_origin': fo,
                'color': col, 'color_origin': co,
                'caps': cap in ('all', 'small'), 'spc': spc, 'algn': algn,
                'field': r.tag == A + 'fld'})
        paras.append(runs)
    return paras


def words_of(text):
    return [w for w in text.split() if re.search(r'\w', w)]


# ----------------------------------------------------------------- slide parsing

class Shape:
    def __init__(self):
        self.id = None
        self.name = ''
        self.kind = 'shape'      # text | shape | pic | chart | table | line | other
        self.ph = None
        self.z = 0
        self.bbox = None
        self.bbox_origin = ''
        self.descr = None
        self.fill = {'kind': 'inherit'}
        self.line = {'visible': False, 'width': None, 'hex': None, 'origin': 'not read'}
        self.geom = None
        self.effects = []
        self.paras = []
        self.autofit = None
        self.fontscale = 1.0
        self.insets = (7.2, 3.6, 7.2, 3.6)
        self.is_source = False
        self.chart = None        # dict for charts
        self.table_margin_issues = []
        self.cell_fills = []
        self.ref = ''

    @property
    def text(self):
        return '\n'.join(''.join(r['text'] for r in p) for p in self.paras)

    @property
    def has_text(self):
        return any(r['text'].strip() for p in self.paras for r in p)

    def runs(self):
        return [r for p in self.paras for r in p if r['text'].strip()]


def parse_chart(ctx, rid, shape_ref):
    tgt = ctx.rels.get(rid)
    info = {'part': None, 'series_colors': [], 'texts': [], 'sizes': [], 'gradient': False, 'notes': [], 'bad_dash': []}
    if not tgt:
        info['notes'].append('chart relationship %s not found' % rid)
        return info
    part = tgt[0]
    info['part'] = part
    root = ctx.pkg.xml(part)
    if root is None:
        info['notes'].append('chart part missing')
        return info
    for d in root.iter(A + 'prstDash'):
        if d.get('val') not in DASH_VALUES:
            info['bad_dash'].append(d.get('val'))
    for ser in root.iter(C + 'ser'):
        sp = ser.find(C + 'spPr')
        name = 'series'
        cols = []
        for holder in ([sp] if sp is not None else []) + [d.find(C + 'spPr') for d in ser.findall(C + 'dPt') if d.find(C + 'spPr') is not None]:
            if holder.find(A + 'gradFill') is not None:
                info['gradient'] = True
            sf = holder.find(A + 'solidFill')
            if sf is not None:
                c = resolve_color(sf, ctx.theme, ctx.clrmap)
                if c and c['hex']:
                    cols.append(c)
            ln = holder.find(A + 'ln')
            if ln is not None and ln.find(A + 'solidFill') is not None:
                c = resolve_color(ln.find(A + 'solidFill'), ctx.theme, ctx.clrmap)
                if c and c['hex']:
                    cols.append(c)
        info['series_colors'].append({'series': len(info['series_colors']) + 1, 'colors': cols})
    for t in root.iter(A + 't'):
        if t.text and t.text.strip():
            info['texts'].append(t.text.strip())
    for tag in ('cat', 'tx'):
        for el in root.iter(C + tag):
            for v in el.iter(C + 'v'):
                if v.text and v.text.strip():
                    info['texts'].append(v.text.strip())
    for d in root.iter(A + 'defRPr'):
        if d.get('sz'):
            info['sizes'].append(int(d.get('sz')) / 100.0)
    for r in root.iter(A + 'rPr'):
        if r.get('sz'):
            info['sizes'].append(int(r.get('sz')) / 100.0)
    return info


def parse_slide(ctx):
    shapes = []
    counter = [0]
    tree = ctx.root.find(P + 'cSld/' + P + 'spTree')

    def visit(container, tf):
        for el in container:
            tag = el.tag
            if tag == P + 'grpSp':
                try:
                    gf = group_frame(el)
                    visit(el, tf + [gf])
                except Exception:
                    visit(el, tf)
                continue
            if tag not in (P + 'sp', P + 'pic', P + 'graphicFrame', P + 'cxnSp'):
                continue
            s = Shape()
            counter[0] += 1
            s.z = counter[0]
            nv = None
            for cand in ('nvSpPr', 'nvPicPr', 'nvGraphicFramePr', 'nvCxnSpPr'):
                nv = el.find(P + cand)
                if nv is not None:
                    break
            cnv = nv.find(P + 'cNvPr') if nv is not None else None
            s.id = cnv.get('id') if cnv is not None else '?'
            s.name = cnv.get('name') if cnv is not None else ''
            s.descr = (cnv.get('descr') or '').strip() if cnv is not None else ''
            s.ref = '%s#%s "%s"' % (ctx.short, s.id, s.name)
            s.ph = ph_of(el)
            layout_sp = find_ph(ctx.layout, s.ph) if s.ph else None
            master_sp = find_ph(ctx.master, s.ph) if s.ph else None

            # geometry, inherited for placeholders
            bb = xfrm_of(el)
            origin = 'slide xfrm'
            if bb is None and layout_sp is not None:
                bb = xfrm_of(layout_sp)
                origin = 'layout placeholder xfrm'
            if bb is None and master_sp is not None:
                bb = xfrm_of(master_sp)
                origin = 'master placeholder xfrm'
            if bb is not None and tf:
                bb = apply_tf(bb, tf)
            s.bbox, s.bbox_origin = bb, origin if bb else 'none'

            spPr = el.find(P + 'spPr')
            style = el.find(P + 'style')
            if tag == P + 'pic':
                s.kind = 'pic'
                s.fill = {'kind': 'picture'}
            elif tag == P + 'cxnSp':
                s.kind = 'line'
                s.fill = {'kind': 'none'}
            elif tag == P + 'graphicFrame':
                gd = el.find(A + 'graphic/' + A + 'graphicData')
                uri = gd.get('uri') if gd is not None else ''
                if 'chart' in uri:
                    s.kind = 'chart'
                    ch = gd.find(C + 'chart')
                    s.chart = parse_chart(ctx, ch.get(R + 'id'), s.ref) if ch is not None else {'notes': ['no c:chart']}
                elif 'table' in uri:
                    s.kind = 'table'
                    # the stored frame height is often stale: the table is as tall as its rows (a:tr h) and as wide as its columns
                    col_w = [int(gc.get('w') or 0) for gc in gd.iter(A + 'gridCol')]
                    for tr in gd.iter(A + 'tr'):
                        ci = 0
                        for tc in tr.findall(A + 'tc'):
                            span = int(tc.get('gridSpan') or 1)
                            pr = tc.find(A + 'tcPr')
                            ml = int(pr.get('marL')) if pr is not None and pr.get('marL') else 91440
                            mr = int(pr.get('marR')) if pr is not None and pr.get('marR') else 91440
                            width = sum(col_w[ci:ci + span])
                            if width and ml + mr >= 0.6 * width and ''.join(t.text or '' for t in tc.iter(A + 't')).strip():
                                s.table_margin_issues.append('column %d: margins %.0f + %.0f pt in a %.0f pt wide cell' % (ci + 1, ml / EMU_PT, mr / EMU_PT, width / EMU_PT))
                            ci += span
                    rows_h = sum(int(tr.get('h') or 0) for tr in gd.iter(A + 'tr')) / EMU_PT
                    cols_w = sum(int(gc.get('w') or 0) for gc in gd.iter(A + 'gridCol')) / EMU_PT
                    if s.bbox is not None and (rows_h > s.bbox[3] or cols_w > s.bbox[2]):
                        s.bbox = (s.bbox[0], s.bbox[1], max(s.bbox[2], cols_w), max(s.bbox[3], rows_h))
                        s.bbox_origin += ' (extended to the table rows and columns)'
                    for tc in gd.iter(A + 'tc'):
                        tx = tc.find(A + 'txBody')
                        if tx is not None:
                            cell_paras = read_paragraphs(ctx, tx, None, None, None, s.ref)
                            cf = get_fill(tc.find(A + 'tcPr'), None, ctx.theme, ctx.clrmap)
                            if cf['kind'] == 'solid':
                                s.cell_fills.append(cf['hex'])
                                for p_ in cell_paras:
                                    for r_ in p_:
                                        r_['surface'] = cf          # text in a filled cell sits on the cell, not on the slide
                            s.paras.extend(cell_paras)
                else:
                    s.kind = 'other'
                s.fill = {'kind': 'none'}
            else:
                s.fill = get_fill(spPr, style, ctx.theme, ctx.clrmap)
                if s.fill['kind'] == 'inherit' and s.ph:
                    for src in (layout_sp, master_sp):
                        if src is not None:
                            f = get_fill(src.find(P + 'spPr'), None, ctx.theme, ctx.clrmap)
                            if f['kind'] != 'inherit':
                                s.fill = f
                                break
                    if s.fill['kind'] == 'inherit':
                        s.fill = {'kind': 'none'}
                elif s.fill['kind'] == 'inherit':
                    s.fill = {'kind': 'none'}
                tx = el.find(P + 'txBody')
                if tx is not None:
                    bp = tx.find(A + 'bodyPr')
                    fs = 1.0
                    if bp is not None:
                        na = bp.find(A + 'normAutofit')
                        if na is not None:
                            s.autofit = 'normAutofit'
                            if na.get('fontScale'):
                                fs = int(na.get('fontScale')) / 100000.0
                        elif bp.find(A + 'spAutoFit') is not None:
                            s.autofit = 'spAutoFit'
                        elif bp.find(A + 'noAutofit') is not None:
                            s.autofit = 'noAutofit'
                        emu = lambda k, d: int(bp.get(k)) / EMU_PT if bp.get(k) else d
                        s.insets = (emu('lIns', 7.2), emu('tIns', 3.6), emu('rIns', 7.2), emu('bIns', 3.6))
                    s.fontscale = fs
                    s.paras = read_paragraphs(ctx, tx, s.ph, layout_sp, master_sp, s.ref, fs)
                    if s.has_text:
                        s.kind = 'text'
            s.effects = sp_effects(spPr)
            if tag == P + 'sp':
                s.geom = geom_of(spPr)
                s.line = get_line(spPr, style, ctx.theme, ctx.clrmap)
            if s.kind == 'text' and s.has_text and SOURCE_RE.match(s.text):
                s.is_source = True
            shapes.append(s)

    visit(tree, [])
    return shapes


def read_background(ctx):
    """Slide background: solid hex or a reason it cannot be computed."""
    for label, root in (('slide', ctx.root), ('layout', ctx.layout), ('master', ctx.master)):
        if root is None:
            continue
        bg = root.find(P + 'cSld/' + P + 'bg')
        if bg is None:
            continue
        bp = bg.find(P + 'bgPr')
        if bp is not None:
            f = get_fill(bp, None, ctx.theme, ctx.clrmap)
            if f['kind'] == 'solid':
                return {'kind': 'solid', 'hex': f['hex'], 'alpha': f['alpha'], 'origin': '%s bgPr' % label}
            return {'kind': f['kind'], 'origin': '%s bgPr' % label, 'note': f.get('note', '')}
        br = bg.find(P + 'bgRef')
        if br is not None:
            c = resolve_color(br, ctx.theme, ctx.clrmap)
            if c and c['hex']:
                return {'kind': 'solid', 'hex': c['hex'], 'alpha': 1.0,
                        'origin': '%s bgRef idx=%s (theme fill style not read)' % (label, br.get('idx')),
                        'approx': br.get('idx') not in ('1001',)}
    return {'kind': 'unresolved', 'origin': 'no background found', 'note': 'default assumed unknown'}


# ----------------------------------------------------------------- checks

def chk(cid, name, method, status, value=None, limit=None, evidence=None):
    d = {'id': cid, 'name': name, 'method': method, 'status': status}
    if value is not None:
        d['value'] = value
    if limit is not None:
        d['limit'] = limit
    if evidence:
        d['evidence'] = evidence
    return d


def is_ground(s, sw, sh):
    if s.bbox is None:
        return False
    return s.bbox[2] >= 0.95 * sw and s.bbox[3] >= 0.95 * sh


def backdrop_for(s, shapes, bg):
    """Surface behind shape s: ('solid', hex_pair_list, origin) or ('unknown', reason)."""
    if s.bbox is None:
        return ('unknown', 'no geometry')
    x, y, w, h = s.bbox
    if s.fill['kind'] == 'solid':
        return ('solid', s.fill, s.ref + ' own fill')
    for o in sorted((o for o in shapes if o.z < s.z), key=lambda o: -o.z):
        if o.bbox is None:
            continue
        ox, oy, ow, oh = o.bbox
        if ox - TOL <= x and oy - TOL <= y and ox + ow + TOL >= x + w and oy + oh + TOL >= y + h:
            if o.kind == 'pic':
                return ('unknown', 'text over picture %s (needs scrim of known colour)' % o.ref)
            if o.fill['kind'] == 'solid':
                return ('solid', o.fill, o.ref + ' fill')
            if o.fill['kind'] in ('gradient', 'pattern', 'picture'):
                return ('unknown', 'text over %s fill of %s' % (o.fill['kind'], o.ref))
    if bg['kind'] == 'solid':
        return ('solid', {'hex': bg['hex'], 'alpha': 1.0}, 'slide background (%s)' % bg['origin'])
    return ('unknown', 'background is %s (%s)' % (bg['kind'], bg.get('origin', '')))


def worst_contrast(fg_hex, back, fg_alpha=1.0):
    """back: fill dict. Semi-transparent surfaces: blend over white and black, take the worse (rules-core rule 3)."""
    fg = fg_hex
    if back.get('alpha', 1.0) >= 0.999:
        bgs = [back['hex']]
    else:
        bgs = [blend(back['hex'], 'FFFFFF', back['alpha']), blend(back['hex'], '000000', back['alpha'])]
    return min(contrast(fg, b) for b in bgs)


def fmt(v):
    return round(v, 2) if isinstance(v, float) else v


def hue_family_key(hexv):
    h, l, s = hls_of(hexv)
    if s < 0.15 or l > 0.95 or l < 0.08:
        return None  # neutral
    return h * 360.0


def cluster_hues(entries):
    """entries: list of (hue_deg, hex, where). Return list of clusters (hue within 20 deg)."""
    clusters = []
    for hue, hexv, where in sorted(entries):
        for c in clusters:
            d = abs(c['hue'] - hue)
            d = min(d, 360 - d)
            if d <= 20:
                c['members'].add(hexv)
                c['where'].add(where)
                break
        else:
            clusters.append({'hue': hue, 'members': {hexv}, 'where': {where}})
    return clusters


def estimate_lines(s):
    """Line estimate with 0.5 em average glyph width (starting value, see profiles.md). Returns (lines, height_pt) or None."""
    if s.bbox is None or not s.has_text:
        return None
    w = s.bbox[2] - s.insets[0] - s.insets[2]
    if w <= 0:
        return None
    lines = 0
    height = 0.0
    for p in s.paras:
        txt = ''.join(r['text'] for r in p)
        sizes = [r['size'] for r in p if r['size']]
        if not sizes:
            return None
        sz = max(sizes)
        per_line = max(1.0, w / (0.5 * sz))
        n = max(1, math.ceil(len(txt) / per_line)) if txt else 1
        lines += n
        height += n * sz * 1.2
    return lines, height + s.insets[1] + s.insets[3]


def analyse(pkg, path, profile_name, exempt_manual, lang, plan=None, render_opts=None):
    prof = PROFILES[profile_name]
    pres = pkg.xml('ppt/presentation.xml')
    if pres is None:
        raise SystemExit('not a pptx (ppt/presentation.xml missing)')
    sz = pres.find(P + 'sldSz')
    sw, sh = int(sz.get('cx')) / EMU_PT, int(sz.get('cy')) / EMU_PT
    prels = pkg.rels('ppt/presentation.xml')
    slide_parts = []
    for sid in pres.findall(P + 'sldIdLst/' + P + 'sldId'):
        rid = sid.get(R + 'id')
        if rid in prels:
            slide_parts.append(prels[rid][0])

    report = {
        'file': path, 'profile': profile_name, 'thresholds': prof,
        'slide_size_pt': [round(sw, 2), round(sh, 2)],
        'slide_size_check': None,
        'slides': [], 'deck': [], 'notes': []}
    expect = (960.0, 540.0)
    report['slide_size_check'] = chk('0', 'slide size is 13.33 x 7.5 in (960 x 540 pt)', 'file',
                                     'pass' if abs(sw - expect[0]) < 1 and abs(sh - expect[1]) < 1 else 'fail',
                                     value=[round(sw, 1), round(sh, 1)], limit=list(expect),
                                     evidence='ppt/presentation.xml sldSz')

    live = (MARGIN_PT, MARGIN_PT, sw - 2 * MARGIN_PT, sh - 2 * MARGIN_PT)
    waivers = ''
    if plan is not None:
        import plan as plan_mod
        try:
            waivers = plan_mod.parse_plan(plan).get('waivers', '') or ''
        except Exception:
            waivers = ''
    grounds = []
    all_text_for_lang = []
    slides = []
    for i, part in enumerate(slide_parts, 1):
        ctx = Ctx(pkg, part, pres)
        shapes = parse_slide(ctx)
        bg = read_background(ctx)
        ltype = ctx.layout.get('type') if ctx.layout is not None else None
        lname = None
        if ctx.layout is not None:
            cs = ctx.layout.find(P + 'cSld')
            lname = cs.get('name') if cs is not None else None
        slides.append((i, ctx, shapes, bg, ltype, lname))
        for s in shapes:
            if s.kind == 'text':
                all_text_for_lang.append(s.text)

    tokens = words_of(' '.join(all_text_for_lang).lower())
    de_share = (sum(1 for w in tokens if w in DE_STOP) / len(tokens)) if tokens else 0.0
    if lang == 'auto':
        lang_used = 'de' if de_share >= 0.06 else 'en'
        lang_note = 'auto: German stop-word share %.1f %%' % (de_share * 100)
    else:
        lang_used, lang_note = lang, 'set by --lang'
    report['language'] = {'used': lang_used, 'note': lang_note}

    deck_fonts = {}
    deck_hues = []
    deck_sizes = {}
    ph_positions = {}
    title_sizes = {}
    run_facts = []      # one record per text run, for the plan comparison
    color_use = {}      # hex -> list of places
    insets = []         # (inset pt, ref) of shapes considered for the margin check
    chart_sizes = set()
    slide_facts = []

    for (i, ctx, shapes, bg, ltype, lname) in slides:
        checks = []
        pattern_exempt = bool(lname and PATTERN_EXEMPT_RE.match(lname))
        exempt = (i in exempt_manual) or (ltype in ('title', 'secHead')) or pattern_exempt
        exempt_why = ('--exempt' if i in exempt_manual else ('layout "%s" (patterns.md P01/P02)' % lname if pattern_exempt else 'layout type=%s' % ltype)) if exempt else None
        title = next((s for s in shapes if s.ph and norm_ph_type(s.ph[0]) == 'title' and s.has_text), None)
        # word and character counting (glossary: not source line, not slide number, footer, date, notes)
        words = 0
        chars = 0
        counted = []
        for s in shapes:
            if s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt'):
                continue
            if s.is_source:
                continue
            if s.kind in ('text', 'table') and s.has_text:
                t = s.text
                words += len(words_of(t))
                chars += len(t.replace('\n', ''))
                counted.append(s.ref)
            elif s.kind == 'chart' and s.chart:
                for t in s.chart['texts']:
                    words += len(words_of(t))
                    chars += len(t)
                counted.append(s.ref + ' (chart text)')

        # -- 1 title
        if title is None:
            checks.append(chk('1', 'title present and non-empty', 'file',
                              'fail' if not exempt else 'observation',
                              evidence='no title placeholder with text' + (' (exempt slide: %s)' % exempt_why if exempt else '')))
        else:
            tw = len(words_of(title.text))
            if exempt:
                checks.append(chk('1', 'title word ceiling', 'file', 'observation', value=tw,
                                  evidence='%s: exempt slide type (%s)' % (title.ref, exempt_why)))
            else:
                checks.append(chk('1', 'title word ceiling', 'file', 'pass' if tw <= prof['title_words'] else 'fail',
                                  value=tw, limit=prof['title_words'], evidence='%s "%s"' % (title.ref, title.text.strip()[:80])))
            est = estimate_lines(title)
            if est is not None:
                checks.append(chk('1', 'title fits 2 lines', 'estimate (0.5 em glyph width, not a render)',
                                  'observation', value=est[0], limit=2,
                                  evidence='%s; estimate only, not a threshold' % title.ref))
            tr = title.runs()
            if tr:
                tsz = sorted({r['size'] for r in tr if r['size']})
                title_sizes[i] = tsz
                if tsz and not exempt:
                    lo, hi = prof['title_min'], prof['title_max']
                    okk = all(v >= lo - 0.01 and (hi is None or v <= hi + 0.01) for v in tsz)
                    checks.append(chk('2', 'title size within profile range', 'file', 'pass' if okk else 'fail',
                                      value=tsz, limit='%s-%s pt' % (lo, hi if hi else 'open'),
                                      evidence='; '.join(sorted({r['size_origin'] for r in tr}))))
                elif not tsz:
                    checks.append(chk('2', 'title size within profile range', 'file', 'not_measured',
                                      evidence='size unresolved: ' + tr[0]['size_origin']))

        # -- 2 fonts, sizes
        runs = [(s, r) for s in shapes for r in s.runs()]
        for s, r in runs:
            run_facts.append({'slide': i, 'ref': s.ref, 'size': r['size'], 'bold': r['bold'], 'font': r['font'],
                              'color': (r['color'] or {}).get('hex'), 'title': s is title, 'source': s.is_source,
                              'ph': norm_ph_type(s.ph[0]) if s.ph else None})
        for s in shapes:
            if s.kind == 'chart' and s.chart:
                for z in s.chart['sizes']:
                    deck_sizes.setdefault(z, set()).add(i)
                    chart_sizes.add(z)
        fonts = {}
        for s, r in runs:
            if r['font']:
                fonts.setdefault(r['font'], []).append(s.ref)
                deck_fonts.setdefault(r['font'], set()).add(i)
        unresolved = [s.ref for s, r in runs if r['size'] is None]
        below_foot = sorted({(r['size'], s.ref) for s, r in runs if r['size'] is not None and r['size'] < prof['foot_min'] - 0.01})
        if below_foot:
            checks.append(chk('2', 'no text below footnote minimum', 'file', 'fail', value=[b[0] for b in below_foot][:8],
                              limit='%s pt' % prof['foot_min'], evidence='; '.join('%s %spt' % (b[1], b[0]) for b in below_foot[:6])))
        else:
            checks.append(chk('2', 'no text below footnote minimum', 'file', 'pass' if runs else 'not_measured',
                              limit='%s pt' % prof['foot_min'],
                              evidence=('all resolved sizes >= minimum' if not unresolved else '%d run(s) with unresolved size' % len(unresolved))))
        if unresolved:
            checks.append(chk('2', 'text sizes resolved', 'file', 'not_measured', value=len(unresolved),
                              evidence='size not found in run, shape, layout, master or defaults: ' + ', '.join(sorted(set(unresolved))[:5])))
        src_runs = [r for s in shapes if s.is_source for r in s.runs()]
        for s, r in runs:
            if r['size'] is not None:
                deck_sizes.setdefault(r['size'], set()).add(i)
        body_small = sorted({(r['size'], s.ref) for s, r in runs
                             if r['size'] is not None and prof['foot_min'] - 0.01 <= r['size'] < prof['body_min'] - 0.01
                             and not s.is_source and not (s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt'))})
        if body_small:
            checks.append(chk('2', 'text between footnote and body minimum', 'file', 'observation',
                              value=sorted({b[0] for b in body_small}), limit='body >= %s pt' % prof['body_min'],
                              evidence='role (body vs label) is only known from the deck plan: ' + '; '.join('%s %spt' % (b[1], b[0]) for b in body_small[:5])))
        if src_runs:
            bad = [r for r in src_runs if r['size'] is not None and r['size'] < prof['foot_min'] - 0.01]
            checks.append(chk('2', 'source line at or above footnote minimum', 'file', 'fail' if bad else 'pass',
                              value=sorted({r['size'] for r in src_runs if r['size']}), limit='%s pt' % prof['foot_min']))

        # -- 3 margins and overflow
        edge_bad = []
        bleed = []
        for s in shapes:
            if s.bbox is None or s.kind in ('other',) or is_ground(s, sw, sh):
                continue
            if s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt') and not s.has_text:
                continue
            if s.kind == 'text' and not s.has_text and s.fill['kind'] != 'solid':
                continue
            x, y, w, h = s.bbox
            if s.kind != 'pic':
                insets.append((min(x, y, sw - x - w, sh - y - h), s.ref))
            footer_item = s.is_source or bool(s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt')) or (
                s.kind == 'text' and s.has_text and y >= sh - MARGIN_PT - 60 and
                all(r['size'] is not None and r['size'] < prof['body_min'] - 0.01 for r in s.runs()))
            bottom = sh - (FOOTER_MARGIN_PT if footer_item else MARGIN_PT)
            if x < MARGIN_PT - TOL or y < MARGIN_PT - TOL or x + w > sw - MARGIN_PT + TOL or y + h > bottom + TOL:
                (bleed if s.kind == 'pic' else edge_bad).append('%s [%.0f,%.0f,%.0f,%.0f]' % (s.ref, x, y, w, h))
        checks.append(chk('3', 'shapes inside 48 pt margins', 'file', 'fail' if edge_bad else 'pass',
                          limit='48 pt (footer items: 18 pt at the bottom)', evidence='; '.join(edge_bad[:6]) if edge_bad else 'all non-ground shapes inside live area'))
        if bleed:
            checks.append(chk('3', 'pictures crossing margins (bleed)', 'file', 'observation', evidence='; '.join(bleed[:4]) + ' (allowed only if deliberate)'))
        over = []
        for s in shapes:
            if s.kind == 'text' and s.autofit != 'spAutoFit':
                est = estimate_lines(s)
                if est and s.bbox and est[1] > s.bbox[3] * 1.02:
                    over.append('%s needs ~%.0f pt, box %.0f pt' % (s.ref, est[1], s.bbox[3]))
        checks.append(chk('3', 'text overflow', 'estimate (0.5 em glyph width, not a render)', 'observation',
                          value=len(over), evidence='; '.join(over[:5]) if over else 'no estimated overflow (unreliable for non-safe fonts)'))

        # -- 5 colour and contrast
        pairs = []
        skipped = []
        for s in shapes:
            rs = s.runs()
            if not rs:
                continue
            bk_shape = backdrop_for(s, shapes, bg)
            for r in rs:
                bk = ('solid', r['surface'], s.ref + ' table cell fill') if r.get('surface') else bk_shape
                if bk[0] != 'solid':
                    skipped.append('%s: %s' % (s.ref, bk[1]))
                    continue
                col = r['color']
                if not col or not col.get('hex'):
                    skipped.append('%s: text colour unresolved (%s)' % (s.ref, r['color_origin']))
                    continue
                if col['alpha'] < 0.999:
                    skipped.append('%s: semi-transparent text colour' % s.ref)
                    continue
                size = r['size'] or 0
                large = size >= 18 or (size >= 14 and r['bold'])
                need = LARGE_TEXT_CONTRAST if large else TEXT_CONTRAST
                ratio = worst_contrast(col['hex'], bk[1])
                pairs.append((ratio, need, col['hex'], bk[1]['hex'], size, s.ref, bk[2], col['exact']))
        fails = sorted({(round(p[0], 2), p[1], p[2], p[3], p[4], p[5], p[6]) for p in pairs if p[0] < p[1] - 1e-9})
        if pairs:
            worst = min(pairs, key=lambda p: p[0] / p[1])
            checks.append(chk('5', 'text contrast', 'computed (WCAG relative luminance from file colours)',
                              'fail' if fails else 'pass',
                              value=round(worst[0], 2), limit='%s:1 (large %s:1)' % (TEXT_CONTRAST, LARGE_TEXT_CONTRAST),
                              evidence=('; '.join('%s %s on %s = %s:1 (%s pt, need %s:1, surface: %s)' % (f[5], f[2], f[3], f[0], f[4], f[1], f[6]) for f in fails[:5])
                                        if fails else 'worst pair %s on %s at %s pt (%s)' % (worst[2], worst[3], worst[4], worst[5]))
                              + ('; theme transforms approximated for some colours' if not all(p[7] for p in pairs) else '')))
        if skipped:
            checks.append(chk('5', 'text contrast not computable for some text', 'computed', 'not_measured',
                              value=len(skipped), evidence='; '.join(sorted(set(skipped))[:4])))
        # non-text contrast: chart series vs slide surface
        for s in shapes:
            if s.kind == 'chart' and s.chart and s.chart['series_colors']:
                bk = backdrop_for(s, shapes, bg)
                if bk[0] != 'solid':
                    checks.append(chk('5', 'chart series contrast', 'computed', 'not_measured', evidence=bk[1]))
                    continue
                bad = []
                allc = []
                for sc in s.chart['series_colors']:
                    for c in sc['colors']:
                        r = worst_contrast(c['hex'], bk[1])
                        allc.append(r)
                        if r < NONTEXT_CONTRAST - 1e-9:
                            bad.append('series %d %s = %.2f:1' % (sc['series'], c['hex'], r))
                if allc:
                    checks.append(chk('5', 'chart series contrast (WCAG 1.4.11)', 'computed', 'fail' if bad else 'pass',
                                      value=round(min(allc), 2), limit='%s:1' % NONTEXT_CONTRAST,
                                      evidence='; '.join(bad[:5]) if bad else '%s series colours vs surface' % s.ref))
                else:
                    checks.append(chk('5', 'chart series contrast (WCAG 1.4.11)', 'computed', 'not_measured',
                                      evidence='%s: no explicit series colours in chart part (theme defaults not read)' % s.ref))

        # colour usage for the deck-level count and the palette comparison
        def use(hexv, where):
            color_use.setdefault(hexv, []).append(where)
        if bg['kind'] == 'solid':
            use(bg['hex'], 'slide %d background' % i)
        for s in shapes:
            if s.fill['kind'] == 'solid':
                use(s.fill['hex'], 'slide %d fill %s' % (i, s.ref))
            for hx in s.cell_fills:
                use(hx, 'slide %d table cell fill %s' % (i, s.ref))
            for r in s.runs():
                if r['color'] and r['color'].get('hex'):
                    use(r['color']['hex'], 'slide %d text %s' % (i, s.ref))
            if s.kind == 'chart' and s.chart:
                for sc in s.chart['series_colors']:
                    for c in sc['colors']:
                        use(c['hex'], 'slide %d chart series %d' % (i, sc['series']))
        for s in shapes:
            if s.fill['kind'] == 'solid' and not is_ground(s, sw, sh):
                k = hue_family_key(s.fill['hex'])
                if k is not None:
                    deck_hues.append((k, s.fill['hex'], 'slide %d fill %s' % (i, s.ref)))
            for hx in s.cell_fills:
                k = hue_family_key(hx)
                if k is not None:
                    deck_hues.append((k, hx, 'slide %d table cell fill %s' % (i, s.ref)))
            for r in s.runs():
                if r['color'] and r['color'].get('hex'):
                    k = hue_family_key(r['color']['hex'])
                    if k is not None:
                        deck_hues.append((k, r['color']['hex'], 'slide %d text %s' % (i, s.ref)))
            if s.kind == 'chart' and s.chart:
                for sc in s.chart['series_colors']:
                    for c in sc['colors']:
                        k = hue_family_key(c['hex'])
                        if k is not None:
                            deck_hues.append((k, c['hex'], 'slide %d chart series %d' % (i, sc['series'])))
        if bg['kind'] == 'solid':
            checks.append(chk('5', 'slide background resolved', 'file', 'pass', value=bg['hex'], evidence=bg['origin'] +
                              ('; theme fill style not read' if bg.get('approx') else '')))
        else:
            checks.append(chk('5', 'slide background resolved', 'file', 'not_measured', value=bg['kind'], evidence=bg.get('origin', '') + ' ' + bg.get('note', '')))

        # -- 6 words, characters, fill
        if lang_used == 'de':
            checks.append(chk('6', 'characters per slide (German rule)', 'file', 'pass' if chars <= prof['chars'] else 'fail',
                              value=chars, limit=prof['chars'], evidence='counted: ' + ', '.join(counted[:6])))
            checks.append(chk('6', 'words per slide', 'file', 'observation', value=words, limit=prof['words'], evidence='reported only; character limit applies for German'))
        else:
            checks.append(chk('6', 'words per slide', 'file', 'pass' if words <= prof['words'] else 'fail',
                              value=words, limit=prof['words'], evidence='counted: ' + ', '.join(counted[:6]) +
                              ('; chart numeric values not counted' if any(s.kind == 'chart' for s in shapes) else '')))
            checks.append(chk('6', 'characters per slide', 'file', 'observation', value=chars, limit=prof['chars'], evidence='reported only; word limit applies for English'))
        cell = 8.0
        cols, rows = int(live[2] // cell), int(live[3] // cell)
        grid = [[False] * cols for _ in range(rows)]
        contributing = []
        for s in shapes:
            if s.bbox is None or is_ground(s, sw, sh):
                continue
            if s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt'):
                continue
            if s.kind == 'line':
                continue
            counts = (s.kind in ('table', 'chart')) or (s.kind == 'pic') or (s.kind == 'text' and (s.has_text or s.fill['kind'] == 'solid')) \
                or (s.kind == 'shape' and s.fill['kind'] in ('solid', 'gradient', 'pattern'))
            if not counts or (s.is_source):
                continue
            x, y, w, h = s.bbox
            c0 = max(0, int((x - live[0]) // cell)); c1 = min(cols, int(math.ceil((x + w - live[0]) / cell)))
            r0 = max(0, int((y - live[1]) // cell)); r1 = min(rows, int(math.ceil((y + h - live[1]) / cell)))
            for rr in range(r0, r1):
                for cc in range(c0, c1):
                    grid[rr][cc] = True
            contributing.append(s.ref)
        fillv = sum(sum(1 for c in row if c) for row in grid) / float(cols * rows)
        # observation until calibrated (decision Max 2026-09-25, AUDIT-4 H1): as a fail it pushed builds towards shrinking exhibits
        checks.append(chk('6', 'fill of live area (bounding boxes, union, 8 pt cells)', 'script',
                          'observation', value=round(fillv, 3), limit=prof['fill'],
                          evidence='%d shapes counted; %s the starting value; box-based, so text boxes larger than their text overstate the fill. '
                                   'Reported, not a threshold, until the value is calibrated: never shrink an exhibit below its pattern zone to meet it'
                                   % (len(contributing), 'within' if fillv <= prof['fill'] else 'above')))

        # -- 7 data slides
        has_data = any(s.kind in ('chart', 'table') for s in shapes)
        if has_data:
            srcs = [s for s in shapes if s.is_source]
            ok = any(YEAR_RE.search(s.text) for s in srcs)
            checks.append(chk('7', 'data slide has source and date', 'file', 'pass' if ok else 'fail',
                              evidence=('source line: "%s"' % srcs[0].text.strip()[:80]) if srcs else 'no line starting with Source:/Quelle: found'))
        else:
            checks.append(chk('7', 'data slide has source and date', 'file', 'observation', evidence='no chart or table; slides with outside numbers in plain text are a judgement'))

        # -- 8 accessibility
        checks.append(chk('8', 'title set', 'file', 'pass' if title is not None else 'fail',
                          evidence=title.ref if title else 'no title placeholder with text'))
        withimg = [s for s in shapes if s.kind in ('pic', 'chart')]
        noalt = ['%s (empty)' % s.ref for s in withimg if not s.descr]
        autoalt = ['%s (alt text is a file name or generic label: "%s")' % (s.ref, s.descr[:40]) for s in withimg if s.descr and AUTO_ALT_RE.search(s.descr.strip())]
        bad_alt = noalt + autoalt
        checks.append(chk('8', 'alt text on pictures and charts', 'file', 'fail' if bad_alt else ('pass' if withimg else 'observation'),
                          value=len(withimg), evidence=('missing or not a description: ' + '; '.join(bad_alt[:5])) if bad_alt else
                          ('all %d have alt text (whether it describes the content is a judgement)' % len(withimg) if withimg else 'no pictures or charts')))
        textshapes = [s for s in shapes if s.has_text and not (s.ph and norm_ph_type(s.ph[0]) in ('sldNum', 'ftr', 'dt'))]
        if title is not None and textshapes:
            first = textshapes[0]
            checks.append(chk('8', 'reading order: title first', 'file', 'pass' if first is title else 'fail',
                              evidence='first text object in z-order: %s' % first.ref))

        for s in shapes:
            if s.kind == 'table':
                bad = sorted(set(s.table_margin_issues))
                checks.append(chk('3', 'table cell margins leave room for the text', 'file', 'fail' if bad else 'pass',
                                  evidence=('%s: %s' % (s.ref, '; '.join(bad[:3]))) if bad else '%s: margins are below 60 %% of every cell width' % s.ref))
        # -- file validity of chart parts (the pptx validator lets invalid line-dash values through)
        for s in shapes:
            if s.kind == 'chart' and s.chart and s.chart['bad_dash']:
                checks.append(chk('0', 'chart line dash values are valid', 'file', 'fail', value=sorted(set(s.chart['bad_dash'])),
                                  evidence='%s: prstDash %s is not a preset dash value; PowerPoint may repair or refuse the file' % (s.ref, ', '.join(sorted(set(s.chart['bad_dash']))))))
        # -- 9 refuse list (detectable items)
        found = []
        for s in shapes:
            if s.fill['kind'] == 'gradient':
                found.append('gradient fill %s' % s.ref)
            for e in s.effects:
                if e in ('outerShdw', 'innerShdw', 'prstShdw', 'glow', 'softEdge', 'reflection', '3d'):
                    found.append('%s on %s' % (e, s.ref))
            if s.kind == 'chart' and s.chart and s.chart['gradient']:
                found.append('gradient in chart %s' % s.ref)
            m = EMOJI_RE.findall(s.text) if s.kind in ('text', 'table') else []
            if m:
                found.append('emoji/symbol characters %s in %s' % (''.join(sorted(set(m))), s.ref))
        if bg['kind'] == 'gradient':
            found.append('gradient background (%s)' % bg['origin'])
        checks.append(chk('9', 'detectable refuse items (gradient, shadow, 3D, emoji/symbol icons)', 'file',
                          'fail' if found else 'pass', value=len(found), evidence='; '.join(found[:6]) if found else 'none found'))
        # heuristic: thin bar under title or thin edge stripe on a shape
        heur = []
        for s in shapes:
            if s.kind in ('shape', 'line') and s.bbox and s.fill['kind'] in ('solid', 'none') and not s.has_text:
                x, y, w, h = s.bbox
                if title is not None and title.bbox and h <= 6 and w >= 24 and 0 <= y - (title.bbox[1] + title.bbox[3]) <= 24 and s.kind == 'shape':
                    heur.append('thin bar under title: %s' % s.ref)
                if w <= 6 and h >= 24 and s.kind == 'shape':
                    for o in shapes:
                        if o is not s and o.bbox and o.kind in ('shape', 'text') and abs(o.bbox[0] - x) <= 2 and o.bbox[3] >= h - 4 and o.bbox[2] > 24:
                            heur.append('side stripe on %s: %s' % (o.ref, s.ref))
                            break
        if heur:
            checks.append(chk('9', 'accent line under title / side stripe (heuristic)', 'estimate (geometry heuristic)', 'observation', value=len(heur), evidence='; '.join(heur[:4])))
        # -- 9 detector for typical AI-slide patterns (scripts/detect.py)
        findings = detect_mod.detect_slide(shapes, bg, sw, sh, title, profile_name, exempt, sys.modules[__name__])
        for f in findings:
            st = 'waived' if f['status'] == 'fail' and detect_mod.is_waived(f['rule'], waivers) else f['status']
            checks.append(chk('1' if f['rule'] == 'question-title' else '9', 'refuse [%s]: %s' % (f['rule'], detect_mod.RULES[f['rule']]),
                              'file (detector)', st, value=f['value'],
                              evidence=f['evidence'] + ('; waived by brief' if st == 'waived' else '')))
        if not findings:
            checks.append(chk('9', 'refuse patterns (detector)', 'file (detector)', 'pass',
                              evidence='none of the %d detector rules found (%s)' % (len(detect_mod.RULES), ', '.join(sorted(detect_mod.RULES)))))
        grounds.append((i, detect_mod.ground_colour(bg, shapes, sw, sh)[0]))

        # placeholders' positions for the recurring-element check, per layout: each layout type (pattern) has its own positions
        for s in shapes:
            if s.ph and s.bbox and not exempt:
                ph_positions.setdefault((norm_ph_type(s.ph[0]), lname), {})[i] = (tuple(round(v, 1) for v in s.bbox), s.ref)

        slide_facts.append({'n': i, 'exhibits': sorted({s.kind for s in shapes if s.kind in ('chart', 'table', 'pic')}),
                            'source': next((s.text.strip() for s in shapes if s.is_source), '')})
        report['slides'].append({
            'n': i, 'part': ctx.part, 'layout': lname, 'layout_type': ltype,
            'exempt_from_action_title': exempt_why,
            'title': title.text.strip() if title else None,
            'shapes': [{'ref': s.ref, 'kind': s.kind, 'ph': s.ph[0] if s.ph else None,
                        'bbox_pt': [round(v, 1) for v in s.bbox] if s.bbox else None, 'bbox_origin': s.bbox_origin,
                        'fill': s.fill.get('hex') or s.fill['kind'],
                        'sizes_pt': sorted({r['size'] for r in s.runs() if r['size']}),
                        'fonts': sorted({r['font'] for r in s.runs() if r['font']})} for s in shapes],
            'checks': checks})

    # ---- deck-level checks
    deck = report['deck']
    if deck_fonts:
        fam = sorted(deck_fonts)
        deck.append(chk('2', 'at most 2 font families', 'file', 'pass' if len(fam) <= 2 else 'fail', value=fam, limit=2,
                        evidence='families used on slides: ' + ', '.join('%s (slides %s)' % (f, sorted(deck_fonts[f])) for f in fam)))
        notsafe = [f for f in fam if f.lower() not in SAFE_FONTS]
        deck.append(chk('2', 'fonts on the safe list', 'file', 'observation' if notsafe else 'pass', value=notsafe or None,
                        evidence='not on safe list: %s (needs a brand/user waiver in the plan, else use the safe list)' % ', '.join(notsafe) if notsafe else 'all on safe list'))
    else:
        deck.append(chk('2', 'at most 2 font families', 'file', 'not_measured', evidence='no font family resolved from runs'))
    sizes = sorted(deck_sizes)
    if sizes:
        small_steps = [(a, b) for a, b in zip(sizes, sizes[1:]) if b / a < STEP_FACTOR - 1e-9]
        deck.append(chk('2', 'steps between neighbouring sizes >= 1.25', 'file', 'observation', value=sizes,
                        evidence=('pairs below factor 1.25: %s. Roles are only known from the deck plan, so this is not a threshold yet.' % ', '.join('%g/%g' % p for p in small_steps)) if small_steps else 'all neighbouring sizes differ by at least 1.25'))
    clusters = cluster_hues(deck_hues)
    st = 'pass' if len(clusters) <= 3 else 'fail'
    if profile_name == 'update' and len(clusters) > 3:
        st = 'observation'
    deck.append(chk('5', 'colour roles: 1 accent + at most a positive/negative signal pair (chromatic hue families, tints of one hue count once, neutrals ignored)', 'computed (hue clusters within 20 deg; saturation < 0.15 or near black/white counts as neutral)',
                    st, value=len(clusters), limit=3,
                    evidence='; '.join('hue %d deg: %s' % (round(c['hue']), ','.join(sorted(c['members']))) for c in clusters) or 'no chromatic colours found'
                    + ('; update profile: status colours are a documented exception' if profile_name == 'update' and len(clusters) > 3 else '')))
    for f in detect_mod.default_look(grounds, sys.modules[__name__]):
        deck.append(chk('11', 'refuse [%s]: look matches a default AI look' % f['rule'], 'computed (hue and lightness of the slide ground)',
                        f['status'], value=f['value'], evidence=f['evidence']))
    for (phtype, lay), pos in ph_positions.items():
        if len(pos) < 2:
            continue
        uniq = {}
        for n, (bb, ref) in pos.items():
            uniq.setdefault(bb, []).append(n)
        same = len(uniq) == 1
        deck.append(chk('4', 'recurring %s placeholder at the same position%s' % (phtype, ' (layout "%s")' % lay if lay else ''), 'file', 'pass' if same else 'fail',
                        value=len(uniq), evidence=('slides %s share %s' % (sorted(pos), list(uniq)[0])) if same else
                        '; '.join('slides %s at %s' % (sorted(v), k) for k, v in uniq.items())))
    lefts = {}
    for sl in report['slides']:
        for s in sl['shapes']:
            if s['kind'] == 'text' and s['bbox_pt'] and s['ph'] not in ('sldNum', 'ftr', 'dt'):
                lefts.setdefault(round(s['bbox_pt'][0]), set()).add(sl['n'])
    deck.append(chk('4', 'distinct left edges of text shapes', 'file', 'observation', value=len(lefts),
                    evidence='x positions (pt): %s. Optical alignment is not measured.' % sorted(lefts)[:12]))
    if plan is None:
        deck.append(chk('12', 'deck matches its deck plan', 'file', 'not_measured',
                        evidence='no plan given: run with --plan deck-plan.md, or --derive-plan to write one from this deck'))
    deck.append(chk('3', 'spacing in multiples of 8 pt', 'file', 'not_measured', evidence='not implemented yet'))
    deck.append(chk('10', 'title strand reads as a story', 'judgement', 'not_measured', evidence='judgement item, not scripted'))
    deck.append(chk('11', 'direction contract held, look not guessable', 'judgement', 'not_measured', evidence='judgement item, not scripted'))
    strand = [(sl['n'], sl['title']) for sl in report['slides']]
    report['title_strand'] = [{'n': n, 't': t} for n, t in strand]
    report['render'] = None
    if render_opts is not None:
        import render as render_mod
        rr = render_mod.render(path, render_opts.get('dir')) if isinstance(path, str) and os.path.isfile(path) \
            else {'ok': False, 'reason': 'render needs a file path'}
        report['render'] = {k: v for k, v in rr.items() if k != 'pages'}
        if not rr['ok']:
            report['deck'].append(chk('3', 'rendering', 'render (LibreOffice)', 'not_measured', evidence=rr['reason']))
        else:
            npages = len(rr['pages'])
            if npages != len(slides):
                report['deck'].append(chk('3', 'rendered page count equals slide count', 'render (LibreOffice)', 'observation',
                                          value=npages, limit=len(slides), evidence='hidden slides are not exported; pages are matched by position'))
            fstatus, fvalue, fevid = render_mod.font_report(sorted(deck_fonts), rr['fonts'])
            report['deck'].append(chk('3', 'fonts drawn in the render', 'render (LibreOffice, pdffonts)', fstatus, value=fvalue, evidence=fevid))
            for k, (i, ctx, shapes, bg, ltype, lname) in enumerate(slides):
                sl = report['slides'][k]
                if k >= npages:
                    sl['checks'].append(chk('3', 'rendered page', 'render (LibreOffice)', 'not_measured', evidence='no page %d in the PDF' % (k + 1)))
                    continue
                ttl = next((s for s in shapes if s.ph and norm_ph_type(s.ph[0]) == 'title' and s.has_text), None)
                res = render_mod.analyse_page(rr['pages'][k], shapes, sw, sh, ttl, words_of)
                sl['checks'] = [c for c in sl['checks'] if not (c['name'] in ('text overflow', 'title fits 2 lines') and c['method'].startswith('estimate'))]
                bad = res['stray'] + ['outside slide: ' + w for w in res['outside']]
                sl['checks'].append(chk('3', 'text overflow (rendered)', 'render (LibreOffice PDF word boxes, observation)', 'observation',
                                        value=len(res['stray']), limit=0,
                                        evidence=('words drawn outside every text box: ' + ', '.join(bad[:6])) if bad else 'all %d rendered words lie inside a text box' % res['words']))
                if res['missing']:
                    sl['checks'].append(chk('3', 'text missing in the render', 'render (LibreOffice PDF word boxes, observation)', 'observation',
                                            value=len(res['missing']), evidence='in the file but not in the PDF: ' + ', '.join(res['missing'][:8])))
                if res['title_lines'] is not None:
                    sl['checks'].append(chk('1', 'title lines (rendered)', 'render (LibreOffice PDF word boxes, observation)', 'observation',
                                            value=res['title_lines'], limit=2,
                                            evidence='title needs %d line(s) at its role size; the limit is 2 (not a threshold: render)' % res['title_lines']))
    facts = {
        'slide_count': len(report['slides']),
        'layouts': [sl['layout'] for sl in report['slides']],
        'titles': [sl['title'] for sl in report['slides']],
        'fonts': sorted(deck_fonts),
        'runs': run_facts,
        'colors': {h: sorted(set(w))[:6] for h, w in color_use.items()},
        'min_inset_pt': round(min(insets)[0], 2) if insets else None,
        'min_inset_at': min(insets)[1] if insets else None,
        'profile': profile_name,
        'chart_sizes': sorted(chart_sizes),
        'slide_facts': slide_facts,
    }
    report['facts'] = facts
    if plan is not None:
        import plan as plan_mod
        plan_mod.attach(report, plan, prof, sys.modules[__name__])
    report['not_measured_here'] = [('overflow: render observation only' if report['render'] and report['render'].get('ok') else 'overflow and rendering (not run: use --render; otherwise estimates only)'),
                                   'optical alignment'] + ([] if plan is not None else ['plan comparison (run with --plan)']) + ['spacing scale',
                                   'theme fill styles (bgRef idx, fillRef idx), slide-level colour map overrides']
    # summary
    counts = {'pass': 0, 'fail': 0, 'observation': 0, 'not_measured': 0, 'waived': 0}
    for sl in report['slides']:
        for c in sl['checks']:
            counts[c['status']] += 1
    for c in report['deck'] + (report.get('plan', {}).get('checks', []) if plan is not None else []):
        counts[c['status']] += 1
    counts[report['slide_size_check']['status']] += 1
    report['summary'] = counts
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('deck')
    ap.add_argument('--profile', choices=sorted(PROFILES), help='required unless --plan names a profile')
    ap.add_argument('--plan', help='deck-plan.md: check the plan against itself and the deck against the plan (check 12)')
    ap.add_argument('--derive-plan', action='store_true', help='print a plan derived from the deck (facts only) and exit')
    ap.add_argument('--render', action='store_true', help='render with LibreOffice and report overflow, title lines and missing text (observations)')
    ap.add_argument('--render-dir', help='also write one PNG per slide here (implies --render)')
    ap.add_argument('--exempt', default='', help='comma-separated slide numbers exempt from the action-title rule')
    ap.add_argument('--lang', default='auto', choices=['auto', 'en', 'de'])
    ap.add_argument('--out')
    ap.add_argument('--compact', action='store_true', help='omit the per-shape list')
    a = ap.parse_args()
    try:
        pkg = Package(a.deck)
    except (OSError, zipfile.BadZipFile) as e:
        print('cannot open %s: %s' % (a.deck, e), file=sys.stderr)
        return 2
    plan_text = None
    if a.plan:
        try:
            plan_text = open(a.plan, encoding='utf-8').read()
        except OSError as e:
            print('cannot open plan %s: %s' % (a.plan, e), file=sys.stderr)
            return 2
    profile = a.profile
    if profile is None and plan_text:
        m = re.search(r'^\s*(?:[-*]\s*)?\**\s*Profile\s*\**\s*:\s*\**\s*(read|talk|pitch|update)\b', plan_text, re.I | re.M)
        profile = m.group(1).lower() if m else None
    if profile is None:
        print('need --profile (or a plan with a "Profile:" line)', file=sys.stderr)
        return 2
    exempt = {int(x) for x in a.exempt.split(',') if x.strip().isdigit()}
    render_opts = {'dir': a.render_dir} if (a.render or a.render_dir) else None
    rep = analyse(pkg, a.deck, profile, exempt, a.lang, plan_text, render_opts)
    if a.derive_plan:
        import plan as plan_mod
        print(plan_mod.derive(rep, sys.modules[__name__]))
        return 0
    if a.compact:
        for s in rep['slides']:
            s.pop('shapes', None)
        rep['facts'].pop('runs', None)
    text = json.dumps(rep, indent=2, ensure_ascii=False)
    if a.out:
        with open(a.out, 'w', encoding='utf-8') as f:
            f.write(text)
    else:
        print(text)
    return 1 if rep['summary']['fail'] else 0


if __name__ == '__main__':
    sys.exit(main())
