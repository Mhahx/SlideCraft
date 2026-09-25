"""Render support for check_deck.py: convert the deck to PDF with LibreOffice, read word boxes with
pdftotext -bbox, and turn them into overflow, line-count and missing-text observations.

Rendered results are observations, never thresholds (rules-core.md: render estimate). They are only as
good as the font match: LibreOffice replaces fonts it does not have, so the fonts actually drawn are
read from the PDF (pdffonts) and reported next to the result.
"""
import collections
import html
import os
import re
import shutil
import subprocess
import tempfile

# requested family (lower case) -> substring of the PDF font name that has the same glyph widths
METRIC_COMPATIBLE = {
    'arial': 'liberationsans', 'helvetica': 'liberationsans',
    'times new roman': 'liberationserif', 'courier new': 'liberationmono',
    'calibri': 'carlito', 'cambria': 'caladea',
}
WORD_RE = re.compile(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>')
PAGE_RE = re.compile(r'<page width="([\d.]+)" height="([\d.]+)">(.*?)</page>', re.S)


def find_soffice():
    for name in (os.environ.get('SOFFICE'), shutil.which('soffice'), shutil.which('libreoffice'),
                 '/Applications/LibreOffice.app/Contents/MacOS/soffice', '/usr/bin/soffice', '/usr/lib/libreoffice/program/soffice'):
        if name and os.path.exists(name):
            return name
    return None


def render(deck, outdir=None, png_dpi=60):
    """Returns {'ok', 'reason', 'pages': [{'w','h','words':[(x0,y0,x1,y1,text)]}], 'fonts': [pdf font names], 'png': [...]}."""
    soffice = find_soffice()
    if not soffice:
        return {'ok': False, 'reason': 'LibreOffice (soffice) not found; set SOFFICE or install it'}
    if not (shutil.which('pdftotext') and shutil.which('pdffonts')):
        return {'ok': False, 'reason': 'poppler (pdftotext, pdffonts) not found'}
    tmp = tempfile.mkdtemp(prefix='slidecraft-')
    try:
        try:
            subprocess.run([soffice, '-env:UserInstallation=file://%s/profile' % tmp, '--headless', '--convert-to', 'pdf',
                            '--outdir', tmp, deck], capture_output=True, timeout=180, check=True)
        except (subprocess.SubprocessError, OSError) as e:
            return {'ok': False, 'reason': 'LibreOffice conversion failed: %s' % e}
        pdf = os.path.join(tmp, os.path.splitext(os.path.basename(deck))[0] + '.pdf')
        if not os.path.exists(pdf):
            return {'ok': False, 'reason': 'LibreOffice produced no PDF'}
        txt = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True, timeout=60).stdout
        pages = []
        for m in PAGE_RE.finditer(txt):
            words = [(float(a), float(b), float(c), float(d), html.unescape(t)) for a, b, c, d, t in WORD_RE.findall(m.group(3))]
            pages.append({'w': float(m.group(1)), 'h': float(m.group(2)), 'words': words})
        fonts = []
        for line in subprocess.run(['pdffonts', pdf], capture_output=True, text=True, timeout=60).stdout.splitlines()[2:]:
            name = line.split()[0] if line.split() else ''
            if name:
                fonts.append(name.split('+', 1)[-1])
        png = []
        if outdir:
            os.makedirs(outdir, exist_ok=True)
            base = os.path.join(outdir, os.path.splitext(os.path.basename(deck))[0])
            subprocess.run(['pdftoppm', '-r', str(png_dpi), '-png', pdf, base], capture_output=True, timeout=120)
            png = sorted(os.path.join(outdir, f) for f in os.listdir(outdir) if f.startswith(os.path.basename(base)) and f.endswith('.png'))
        return {'ok': True, 'pages': pages, 'fonts': sorted(set(fonts)), 'png': png}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def font_report(requested, pdf_fonts):
    """requested: family names from the file. Returns (status, value, evidence)."""
    low = [f.lower().replace('-', '').replace(' ', '') for f in pdf_fonts]
    rows, unreliable = [], []
    for fam in sorted(requested):
        key = fam.lower()
        want = METRIC_COMPATIBLE.get(key)
        flat = key.replace(' ', '')
        if any(flat in f for f in low):
            rows.append('%s: drawn as itself' % fam)
        elif want and any(want in f for f in low):
            rows.append('%s: drawn as %s (same glyph widths)' % (fam, want))
        else:
            unreliable.append(fam)
            rows.append('%s: replaced by another font, glyph widths may differ' % fam)
    return ('observation' if unreliable else 'pass'), sorted(pdf_fonts), '; '.join(rows) + \
        ('. Rendered line breaks and overflow are unreliable for: %s' % ', '.join(unreliable) if unreliable else '')


def toks(text):
    """Lower-case tokens split at whitespace and hyphens: a line may break after a hyphen, which splits a word in the PDF."""
    return [x for x in re.split(r'[\s\-\u2013\u2014]+', text.lower()) if x]


def analyse_page(page, shapes, sw, sh, title, words_of):
    """Returns dict with stray words, outside words, missing tokens and title line count (None if not found)."""
    scale = sw / page['w'] if page['w'] else 1.0
    words = [(a * scale, b * scale, c * scale, d * scale, t) for a, b, c, d, t in page['words']]
    tol = 3.0
    boxes = []
    for s in shapes:
        if s.bbox is None:
            continue
        if s.kind in ('text', 'table', 'chart') or (s.kind == 'shape' and s.has_text):
            x, y, w, h = s.bbox
            if s.kind == 'text' and s.autofit == 'spAutoFit':
                h = max(h, sh - y)     # the box grows with its text: the stored height is stale
            boxes.append((x - tol, y - tol, x + w + tol, y + h + tol))
    outside, stray = [], []
    for (x0, y0, x1, y1, t) in words:
        if x0 < -1 or y0 < -1 or x1 > sw + 1 or y1 > sh + 1:
            outside.append(t)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        if not any(bx0 <= cx <= bx1 and by0 <= cy <= by1 for bx0, by0, bx1, by1 in boxes):
            stray.append('%s@(%.0f,%.0f)' % (t, x0, y0))

    file_tokens = collections.Counter()
    for s in shapes:
        if s.kind in ('text', 'table') and s.has_text and not (s.ph and s.ph[0] in ('sldNum', 'ftr', 'dt')):
            file_tokens.update(toks(s.text))
    flat = [(tk, w[1]) for w in words for tk in toks(w[4])]      # (token, yMin) in reading order
    pdf_tokens = collections.Counter(tk for tk, _ in flat)
    missing = file_tokens - pdf_tokens
    missing_list = sorted(missing.elements())

    lines = None
    if title is not None and title.has_text:
        want = toks(title.text)
        seq = [tk for tk, _ in flat]
        n = len(want)
        for i in range(0, len(seq) - n + 1):
            if n and seq[i:i + n] == want:
                ys = sorted(y for _, y in flat[i:i + n])
                size = max([r['size'] for r in title.runs() if r['size']] or [12])
                cluster = [ys[0]]
                for y in ys[1:]:
                    if y - cluster[-1] > 0.5 * size:
                        cluster.append(y)
                lines = len(cluster)
                break
    return {'stray': stray, 'outside': outside, 'missing': missing_list, 'title_lines': lines, 'words': len(words)}
