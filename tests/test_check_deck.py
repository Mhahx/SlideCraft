#!/usr/bin/env python3
"""Tests for scripts/check_deck.py.

Run from the repo root:  python3 tests/test_check_deck.py
The fixture decks are built with pptxgenjs (tests/make_fixtures.js); the tests that need them are
skipped with a message when tests/fixtures/*.pptx do not exist. The synthetic-deck tests need nothing.
"""
import io
import os
import sys
import unittest
import zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import check_deck as cd  # noqa: E402
import plan as planmod  # noqa: E402
import render as rendermod  # noqa: E402

FIX = os.path.join(ROOT, 'tests', 'fixtures')
NS = ('xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"')


# ------------------------------------------------------------------ synthetic deck (no external tools)

def rels(*items):
    body = ''.join('<Relationship Id="%s" Type="http://x/%s" Target="%s"/>' % i for i in items)
    return '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">%s</Relationships>' % body


THEME = ('<a:theme %s><a:themeElements><a:clrScheme name="t">'
         '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'
         '<a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2>'
         '<a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2>'
         '<a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4>'
         '<a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6>'
         '<a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink>'
         '</a:clrScheme><a:fontScheme name="f"><a:majorFont><a:latin typeface="Calibri"/></a:majorFont>'
         '<a:minorFont><a:latin typeface="Arial"/></a:minorFont></a:fontScheme></a:themeElements></a:theme>') % NS

MASTER = ('<p:sldMaster %s><p:cSld><p:bg><p:bgPr><a:solidFill><a:schemeClr val="bg1"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>'
          '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>'
          '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>'
          '<p:spPr><a:xfrm><a:off x="609600" y="609600"/><a:ext cx="10668000" cy="914400"/></a:xfrm></p:spPr>'
          '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>t</a:t></a:r></a:p></p:txBody></p:sp>'
          '</p:spTree></p:cSld>'
          '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" '
          'accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
          '<p:txStyles><p:titleStyle><a:lvl1pPr><a:defRPr sz="2600" b="1"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill>'
          '<a:latin typeface="+mj-lt"/></a:defRPr></a:lvl1pPr></p:titleStyle>'
          '<p:bodyStyle><a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr></p:bodyStyle><p:otherStyle/></p:txStyles></p:sldMaster>') % NS

LAYOUT = ('<p:sldLayout %s type="obj"><p:cSld name="Content"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>'
          '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:spPr/>'
          '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>t</a:t></a:r></a:p></p:txBody></p:sp>'
          '</p:spTree></p:cSld></p:sldLayout>') % NS


def rpr_of(sz=None, color=None):
    """Returns the inside of <a:rPr ...>: attributes, then '>' children."""
    attrs = 'sz="%d"' % (sz * 100) if sz else ''
    kids = '<a:solidFill><a:srgbClr val="%s"/></a:solidFill>' % color if color else ''
    return attrs + '>' + kids


def sp_text(idn, name, x, y, w, h, text, rpr='>', fill='', ph=''):
    nvpr = '<p:nvPr>%s</p:nvPr>' % ph
    xfrm = '<a:xfrm><a:off x="%d" y="%d"/><a:ext cx="%d" cy="%d"/></a:xfrm>' % (x, y, w, h) if w else ''
    return ('<p:sp><p:nvSpPr><p:cNvPr id="%d" name="%s"/><p:cNvSpPr/>%s</p:nvSpPr><p:spPr>%s%s</p:spPr>'
            '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" %s</a:rPr><a:t>%s</a:t></a:r></a:p></p:txBody></p:sp>'
            % (idn, name, nvpr, xfrm, fill, rpr, text))


def build_pptx(slide_bodies, slide_bg=''):
    """slide_bodies: list of xml fragments for spTree content. Returns bytes."""
    z = io.BytesIO()
    with zipfile.ZipFile(z, 'w') as f:
        f.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
        f.writestr('_rels/.rels', rels(('rId1', 'officeDocument', 'ppt/presentation.xml')))
        ids = ''.join('<p:sldId id="%d" r:id="rId%d"/>' % (256 + i, i + 10) for i in range(len(slide_bodies)))
        f.writestr('ppt/presentation.xml',
                   '<p:presentation %s><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>'
                   '<p:sldIdLst>%s</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/>'
                   '<p:defaultTextStyle><a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr></p:defaultTextStyle></p:presentation>' % (NS, ids))
        f.writestr('ppt/_rels/presentation.xml.rels',
                   rels(('rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'),
                        *[('rId%d' % (i + 10), 'slide', 'slides/slide%d.xml' % (i + 1)) for i in range(len(slide_bodies))]))
        f.writestr('ppt/slideMasters/slideMaster1.xml', MASTER)
        f.writestr('ppt/slideMasters/_rels/slideMaster1.xml.rels',
                   rels(('rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'), ('rId2', 'theme', '../theme/theme1.xml')))
        f.writestr('ppt/slideLayouts/slideLayout1.xml', LAYOUT)
        f.writestr('ppt/slideLayouts/_rels/slideLayout1.xml.rels', rels(('rId1', 'slideMaster', '../slideMasters/slideMaster1.xml')))
        f.writestr('ppt/theme/theme1.xml', THEME)
        for i, body in enumerate(slide_bodies, 1):
            f.writestr('ppt/slides/slide%d.xml' % i,
                       '<p:sld %s><p:cSld>%s<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>%s</p:spTree></p:cSld></p:sld>'
                       % (NS, slide_bg, body))
            f.writestr('ppt/slides/_rels/slide%d.xml.rels' % i, rels(('rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml')))
    z.seek(0)
    return z


def run_on(zbytes, profile='read', **kw):
    pkg = cd.Package(zbytes)
    return cd.analyse(pkg, 'synthetic', profile, kw.get('exempt', set()), kw.get('lang', 'en'))


def find(checks, name_part, status=None):
    return [c for c in checks if name_part in c['name'] and (status is None or c['status'] == status)]


# ------------------------------------------------------------------ tests

class ColourMath(unittest.TestCase):
    def test_wcag_reference_values(self):
        self.assertAlmostEqual(cd.contrast('000000', 'FFFFFF'), 21.0, places=2)
        self.assertAlmostEqual(cd.contrast('949494', 'FFFFFF'), 3.03, delta=0.01)   # lightest grey reaching 3:1 on white
        self.assertLess(cd.contrast('959595', 'FFFFFF'), 3.0)                       # 2.995:1, does not pass
        self.assertAlmostEqual(cd.contrast('BFBFBF', 'FFFFFF'), 1.84, delta=0.01)   # CHANGELOG 0.5
        self.assertAlmostEqual(cd.contrast('D9D9D9', 'FFFFFF'), 1.41, delta=0.01)
        self.assertAlmostEqual(cd.contrast('A6A6A6', 'FFFFFF'), 2.43, delta=0.01)

    def _resolve(self, inner):
        el = ET.fromstring('<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">%s</a:solidFill>' % inner)
        theme = cd.Theme(ET.fromstring(THEME))
        return cd.resolve_color(el, theme, {'bg1': 'lt1', 'tx1': 'dk1', 'bg2': 'lt2', 'tx2': 'dk2'})

    def test_theme_colour_transforms_match_office_swatches(self):
        # Office "Blue, Accent 1" family (accent1 = 4472C4): published swatch values.
        self.assertEqual(self._resolve('<a:schemeClr val="accent1"/>')['hex'], '4472C4')
        self.assertEqual(self._resolve('<a:schemeClr val="accent1"><a:lumMod val="75000"/></a:schemeClr>')['hex'], '2F5597')
        self.assertEqual(self._resolve('<a:schemeClr val="accent1"><a:lumMod val="60000"/><a:lumOff val="40000"/></a:schemeClr>')['hex'], '8FAADC')
        self.assertEqual(self._resolve('<a:schemeClr val="accent1"><a:lumMod val="20000"/><a:lumOff val="80000"/></a:schemeClr>')['hex'], 'DAE3F3')

    def test_tx1_bg1_map_through_clrmap(self):
        self.assertEqual(self._resolve('<a:schemeClr val="bg1"/>')['hex'], 'FFFFFF')
        self.assertEqual(self._resolve('<a:schemeClr val="tx1"/>')['hex'], '000000')

    def test_semi_transparent_takes_worse_of_white_and_black(self):
        back = {'hex': '808080', 'alpha': 0.5}
        # over white: 808080@50% -> BFBFBF; over black: 404040. Text FFFFFF: worse is against BFBFBF.
        self.assertAlmostEqual(cd.worst_contrast('FFFFFF', back), cd.contrast('FFFFFF', 'BFBFBF'), places=1)


class Inheritance(unittest.TestCase):
    def test_size_font_colour_inherited_from_master(self):
        # Title without any explicit size/font/colour: must resolve to master titleStyle (26 pt, theme major font, tx1).
        title = sp_text(2, 'Title 1', 0, 0, 0, 0, 'Retention drives growth', ph='<p:ph type="title"/>')
        rep = run_on(build_pptx([title]))
        sl = rep['slides'][0]
        self.assertEqual(sl['title'], 'Retention drives growth')
        shape = next(s for s in sl['shapes'] if s['ph'] == 'title')
        self.assertEqual(shape['sizes_pt'], [26.0])
        self.assertEqual(shape['fonts'], ['Calibri'])           # +mj-lt resolved through the theme
        self.assertEqual(shape['bbox_pt'], [48.0, 48.0, 840.0, 72.0])  # geometry inherited from the master placeholder
        self.assertEqual(shape['bbox_origin'], 'master placeholder xfrm')
        self.assertTrue(find(sl['checks'], 'title size within profile range', 'pass'))

    def test_unresolved_size_is_not_guessed(self):
        # A text box on a deck whose defaultTextStyle is missing must report "not measured", not invent a size.
        body = sp_text(3, 'Box', 609600, 1524000, 3048000, 457200, 'Hello world')
        data = build_pptx([body]).getvalue()
        zin = zipfile.ZipFile(io.BytesIO(data))
        out = io.BytesIO()
        with zipfile.ZipFile(out, 'w') as zout:
            for n in zin.namelist():
                b = zin.read(n)
                if n == 'ppt/presentation.xml':
                    b = b.replace(b'<a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr>', b'<a:lvl1pPr/>')
                zout.writestr(n, b)
        out.seek(0)
        rep = run_on(out)
        self.assertTrue(find(rep['slides'][0]['checks'], 'text sizes resolved', 'not_measured'))

    def test_autofit_font_scale_applied(self):
        body = ('<p:sp><p:nvSpPr><p:cNvPr id="3" name="Box"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="609600" y="1524000"/>'
                '<a:ext cx="3048000" cy="457200"/></a:xfrm></p:spPr><p:txBody><a:bodyPr><a:normAutofit fontScale="62500"/></a:bodyPr>'
                '<a:lstStyle/><a:p><a:r><a:rPr sz="1600"/><a:t>Shrunk text</a:t></a:r></a:p></p:txBody></p:sp>')
        rep = run_on(build_pptx([body]))
        # 16 pt x 62.5 % = 10 pt: at the footnote floor of profile read, not below.
        shape = next(s for s in rep['slides'][0]['shapes'] if s['ref'].endswith('"Box"'))
        self.assertEqual(shape['sizes_pt'], [10.0])


class Contrast(unittest.TestCase):
    def test_text_on_filled_panel_uses_panel_not_background(self):
        panel = ('<p:sp><p:nvSpPr><p:cNvPr id="5" name="Panel"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="609600" y="1524000"/>'
                 '<a:ext cx="6096000" cy="1524000"/></a:xfrm><a:solidFill><a:srgbClr val="1F4E79"/></a:solidFill></p:spPr></p:sp>')
        text = sp_text(6, 'On panel', 762000, 1676400, 3048000, 457200, 'White on navy',
                       rpr=rpr_of(20, 'FFFFFF'))
        rep = run_on(build_pptx([panel + text]))
        c = find(rep['slides'][0]['checks'], 'text contrast', 'pass')
        self.assertTrue(c, rep['slides'][0]['checks'])
        self.assertAlmostEqual(c[0]['value'], cd.contrast('FFFFFF', '1F4E79'), places=1)

    def test_large_text_threshold_3_small_text_threshold_4_5(self):
        # 949494 on white is 3.03:1: enough for 18 pt text (3:1), not for 12 pt text (4.5:1).
        small = sp_text(6, 'Small', 762000, 1676400, 3048000, 457200, 'small grey', rpr=rpr_of(12, '949494'))
        large = sp_text(7, 'Large', 762000, 2676400, 3048000, 457200, 'large grey', rpr=rpr_of(18, '949494'))
        self.assertTrue(find(run_on(build_pptx([small]))['slides'][0]['checks'], 'text contrast', 'fail'))
        self.assertTrue(find(run_on(build_pptx([large]))['slides'][0]['checks'], 'text contrast', 'pass'))
        bold14 = sp_text(8, 'Bold', 762000, 1676400, 3048000, 457200, 'bold grey', rpr=rpr_of(14, '949494').replace('sz="1400"', 'sz="1400" b="1"'))
        self.assertTrue(find(run_on(build_pptx([bold14]))['slides'][0]['checks'], 'text contrast', 'pass'))  # 14 pt bold counts as large

    def test_text_over_picture_is_not_measured(self):
        pic = ('<p:pic><p:nvPicPr><p:cNvPr id="5" name="Photo" descr="A calm lake at dawn"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill/>'
               '<p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="6858000"/></a:xfrm></p:spPr></p:pic>')
        text = sp_text(6, 'Over photo', 762000, 1676400, 3048000, 457200, 'Over the photo',
                       rpr=rpr_of(20, 'FFFFFF'))
        rep = run_on(build_pptx([pic + text]))
        self.assertTrue(find(rep['slides'][0]['checks'], 'not computable', 'not_measured'))
        self.assertFalse(find(rep['slides'][0]['checks'], 'text contrast', 'pass'))

    def test_dark_slide_background_from_slide_bg(self):
        text = sp_text(6, 'Light on dark', 762000, 1676400, 3048000, 457200, 'Light text',
                       rpr=rpr_of(20, 'EEEEEE'))
        bg = '<p:bg><p:bgPr><a:solidFill><a:srgbClr val="101820"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>'
        rep = run_on(build_pptx([text], slide_bg=bg))
        c = find(rep['slides'][0]['checks'], 'text contrast', 'pass')
        self.assertTrue(c)
        self.assertAlmostEqual(c[0]['value'], cd.contrast('EEEEEE', '101820'), places=1)


class Structure(unittest.TestCase):
    def test_margin_boundary_48pt(self):
        emu = lambda pt: int(pt * 12700)
        ok = sp_text(3, 'AtMargin', emu(48), emu(100), emu(300), emu(30), 'x', rpr=rpr_of(18, '333333'))
        bad = sp_text(3, 'InsideMargin', emu(44), emu(100), emu(300), emu(30), 'x', rpr=rpr_of(18, '333333'))
        right = sp_text(3, 'RightEdge', emu(48), emu(100), emu(864 + 6), emu(30), 'x', rpr=rpr_of(18, '333333'))  # ends 6 pt into the margin
        self.assertTrue(find(run_on(build_pptx([ok]))['slides'][0]['checks'], 'inside 48 pt margins', 'pass'))
        self.assertTrue(find(run_on(build_pptx([bad]))['slides'][0]['checks'], 'inside 48 pt margins', 'fail'))
        self.assertTrue(find(run_on(build_pptx([right]))['slides'][0]['checks'], 'inside 48 pt margins', 'fail'))

    def test_full_bleed_ground_is_not_a_margin_violation_and_not_fill(self):
        ground = ('<p:sp><p:nvSpPr><p:cNvPr id="5" name="Ground"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="0" y="0"/>'
                  '<a:ext cx="12192000" cy="6858000"/></a:xfrm><a:solidFill><a:srgbClr val="101820"/></a:solidFill></p:spPr></p:sp>')
        rep = run_on(build_pptx([ground]), profile='talk')
        checks = rep['slides'][0]['checks']
        self.assertTrue(find(checks, 'inside 48 pt margins', 'pass'))
        self.assertEqual(find(checks, 'fill of live area')[0]['value'], 0.0)

    def test_group_transform_applies_to_child_geometry(self):
        grp = ('<p:grpSp><p:nvGrpSpPr><p:cNvPr id="9" name="G"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm>'
               '<a:off x="1270000" y="1270000"/><a:ext cx="2540000" cy="2540000"/><a:chOff x="0" y="0"/><a:chExt cx="1270000" cy="1270000"/>'
               '</a:xfrm></p:grpSpPr>'
               '<p:sp><p:nvSpPr><p:cNvPr id="10" name="Child"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="635000" y="635000"/>'
               '<a:ext cx="635000" cy="635000"/></a:xfrm><a:solidFill><a:srgbClr val="333333"/></a:solidFill></p:spPr></p:sp></p:grpSp>')
        rep = run_on(build_pptx([grp]))
        child = next(s for s in rep['slides'][0]['shapes'] if s['ref'].endswith('"Child"'))
        # group at 100 pt, scale 2x: child at 100 + 50*2 = 200 pt, size 50*2 = 100 pt
        self.assertEqual(child['bbox_pt'], [200.0, 200.0, 100.0, 100.0])

    def test_source_line_excluded_from_words_and_needs_year(self):
        title = sp_text(2, 'Title 1', 0, 0, 0, 0, 'Sales grow', ph='<p:ph type="title"/>')
        src = sp_text(3, 'Src', 609600, 5334000, 6096000, 254000, 'Source: internal data',
                      rpr=rpr_of(10, '595959'))
        tbl = ('<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="4" name="Table"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>'
               '<p:xfrm><a:off x="609600" y="1524000"/><a:ext cx="4000000" cy="1000000"/></p:xfrm><a:graphic>'
               '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tr><a:tc><a:txBody><a:bodyPr/><a:lstStyle/>'
               '<a:p><a:r><a:rPr sz="1400"/><a:t>alpha beta</a:t></a:r></a:p></a:txBody></a:tc></a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>')
        rep = run_on(build_pptx([title + tbl + src]))
        checks = rep['slides'][0]['checks']
        self.assertEqual(find(checks, 'words per slide')[0]['value'], 4)   # title 2 + table 2, source line not counted
        self.assertTrue(find(checks, 'data slide has source and date', 'fail'))   # no year in the source line

    def test_exempt_layout_type_title_slide(self):
        title = sp_text(2, 'Title 1', 0, 0, 0, 0, 'A very long title that would break the ceiling of fifteen words for sure yes indeed it does exceed now', ph='<p:ph type="title"/>')
        rep = run_on(build_pptx([title]), exempt={1})
        self.assertTrue(find(rep['slides'][0]['checks'], 'title word ceiling', 'observation'))
        rep2 = run_on(build_pptx([title]))
        self.assertTrue(find(rep2['slides'][0]['checks'], 'title word ceiling', 'fail'))

    def test_german_uses_character_limit(self):
        text = sp_text(3, 'Box', 609600, 1524000, 9000000, 2000000, ('Der Umsatz ist nicht mit den Kosten für die Werke gestiegen ' * 12))
        rep = run_on(build_pptx([text]), profile='talk', lang='de')
        c = find(rep['slides'][0]['checks'], 'characters per slide (German rule)')
        self.assertTrue(c and c[0]['status'] == 'fail')


@unittest.skipUnless(os.path.exists(os.path.join(FIX, 'good.pptx')), 'fixtures missing (run tests/make_fixtures.js)')
class Fixtures(unittest.TestCase):
    def report(self, name, profile):
        return cd.analyse(cd.Package(os.path.join(FIX, name)), name, profile, set(), 'auto')

    def fails(self, rep):
        out = set()
        for sl in rep['slides']:
            for c in sl['checks']:
                if c['status'] == 'fail':
                    out.add((sl['n'], c['id'], c['name']))
        for c in rep['deck']:
            if c['status'] == 'fail':
                out.add(('deck', c['id'], c['name']))
        return out

    def test_good_deck_has_no_fail(self):
        rep = self.report('good.pptx', 'read')
        self.assertEqual(self.fails(rep), set())
        self.assertEqual(rep['slide_size_check']['status'], 'pass')

    def test_bad_deck_fails_exactly_the_planted_violations(self):
        rep = self.report('bad.pptx', 'read')
        expected = {
            (1, '2', 'no text below footnote minimum'),                       # 8 pt footnote
            (1, '3', 'shapes inside 48 pt margins'),                          # 8 pt box at y=6.9 in and a shape at x=12 in
            (1, '5', 'text contrast'),                                        # BFBFBF on white
            (1, '8', 'alt text on pictures and charts'),                      # pptxgenjs writes the file path as alt text
            (1, '9', 'detectable refuse items (gradient, shadow, 3D, emoji/symbol icons)'),  # shadow + emoji
            (2, '1', 'title present and non-empty'),
            (2, '6', 'words per slide'),                                      # 150 filler words + table
            (2, '7', 'data slide has source and date'),
            (2, '8', 'title set'),
            ('deck', '2', 'at most 2 font families'),                         # Arial, Comic Sans MS, Georgia
            ('deck', '5', 'colour rule: 1 accent + at most 1 signal (chromatic hue families, neutrals ignored)'),
        }
        self.assertEqual(self.fails(rep), expected)

    def test_contrast_value_in_bad_deck(self):
        rep = self.report('bad.pptx', 'read')
        c = find(rep['slides'][0]['checks'], 'text contrast', 'fail')[0]
        self.assertAlmostEqual(c['value'], 1.84, delta=0.01)

    def test_profile_changes_thresholds(self):
        # The good deck has slide 1 with 20 words: fine for read (120), too many for talk (15).
        rep = self.report('good.pptx', 'talk')
        self.assertIn((1, '6', 'words per slide'), self.fails(rep))


GOOD_PLAN = """# Deck plan: test

## 1. Brief
Purpose:            decide
Profile:            read
Waivers:            none

## 4. Design system (deck-wide)
Fonts:              Arial
Text roles:

| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| title | Arial | bold | 26 | 1A1A1A | slide titles |
| body | Arial | regular | 16 | 333333 | body text |
| subtitle | Arial | regular | 20 | 1F4E79 | lead line |
| footnote | Arial | regular | 10 | 595959 | source, chart text |

Palette:            background FFFFFF | text 1A1A1A, 333333 | accent 1F4E79 | neutrals 595959
Grid and spacing:   13.33 x 7.5 in, margins 0.667 in (48 pt), 12 columns
Layout types:       main

## 5. Slide plan
| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | main | Retention drives the 12 % revenue growth | text, chart | chart | Company data, 2025 | |
| 2 | main | Two levers explain most of the gain | text | - | - | |
"""


def plan_run(deck, plan_text, profile='read'):
    return cd.analyse(cd.Package(os.path.join(FIX, deck)), deck, profile, set(), 'auto', plan_text)


def plan_fails(rep):
    return {c['name'] for c in rep['plan']['checks'] if c['status'] == 'fail'}


class PlanParsing(unittest.TestCase):
    def test_template_style_plan_is_parsed(self):
        p = planmod.parse_plan(GOOD_PLAN)
        self.assertEqual(p['profile'], 'read')
        self.assertEqual([(r['name'], r['size']) for r in p['roles']], [('title', 26.0), ('body', 16.0), ('subtitle', 20.0), ('footnote', 10.0)])
        self.assertEqual([(x['role'], x['hex']) for x in p['palette']],
                         [('background', 'FFFFFF'), ('text', '1A1A1A'), ('text', '333333'), ('accent', '1F4E79'), ('neutral', '595959')])
        self.assertAlmostEqual(p['margin_pt'], 0.667 * 72, places=1)
        self.assertEqual(p['layout_types'], ['main'])
        self.assertEqual([(s['no'], s['layout'], s['title']) for s in p['slides']],
                         [(1, 'main', 'Retention drives the 12 % revenue growth'), (2, 'main', 'Two levers explain most of the gain')])

    def test_bold_labels_and_bullets_are_accepted(self):
        p = planmod.parse_plan('- **Profile:** talk\n- **Palette:** background #101820 | accent FF5500\n')
        self.assertEqual(p['profile'], 'talk')
        self.assertEqual([(x['role'], x['hex']) for x in p['palette']], [('background', '101820'), ('accent', 'FF5500')])

    def test_unparseable_plan_reports_not_measured_and_does_not_crash(self):
        p = planmod.parse_plan('just some prose without structure')
        self.assertTrue(p['notes'])
        self.assertEqual(p['roles'], [])


@unittest.skipUnless(os.path.exists(os.path.join(FIX, 'good.pptx')), 'fixtures missing')
class PlanComparison(unittest.TestCase):
    def test_matching_plan_has_no_fail_anywhere(self):
        rep = plan_run('good.pptx', GOOD_PLAN)
        self.assertEqual(plan_fails(rep), set(), [c for c in rep['plan']['checks'] if c['status'] == 'fail'])
        self.assertEqual(rep['summary']['fail'], 0)

    def test_derived_plan_round_trips_without_deck_findings(self):
        rep0 = cd.analyse(cd.Package(os.path.join(FIX, 'good.pptx')), 'good', 'read', set(), 'auto')
        derived = planmod.derive(rep0, cd)
        rep = plan_run('good.pptx', derived)
        deck_vs_plan = [c for c in rep['plan']['checks'] if c['id'] == '12']
        self.assertTrue(len(deck_vs_plan) >= 7)
        self.assertEqual([c['name'] for c in deck_vs_plan if c['status'] == 'fail'], [])

    def test_committed_derived_plan_still_matches_fixture(self):
        with open(os.path.join(FIX, 'good-plan.md'), encoding='utf-8') as fh:
            text = fh.read()
        rep = plan_run('good.pptx', text)
        self.assertEqual(plan_fails(rep), set())

    def test_each_deviation_is_reported(self):
        cases = [
            ('Retention drives the 12 % revenue growth', 'Retention grows', 'slide titles equal the plan'),
            ('| Arial |', '| Calibri |', 'fonts are those of the plan'),   # every role now names Calibri
            ('| Arial | regular | 20 |', '| Arial | regular | 22 |', 'text sizes are role sizes of the plan'),
            ('| title | Arial | bold |', '| title | Arial | regular |', 'weights match the plan roles (bold or regular)'),
            ('accent 1F4E79', 'accent 2F6EAA', 'colours used are palette colours of the plan'),
            ('margins 0.667 in (48 pt)', 'margins 60 pt', 'shapes keep the plan margin'),
            ('| 2 | main | Two levers explain most of the gain | text | - | - | |\n', '', 'slide count equals plan rows'),
        ]
        for old, new, expected in cases:
            self.assertIn(old, GOOD_PLAN)
            rep = plan_run('good.pptx', GOOD_PLAN.replace(old, new))
            self.assertIn(expected, plan_fails(rep), (old, new, plan_fails(rep)))

    def test_waiver_turns_font_and_colour_findings_into_waived(self):
        plan = GOOD_PLAN.replace('| Arial |', '| Calibri |').replace('accent 1F4E79', 'accent 2F6EAA')
        unwaived = plan_run('good.pptx', plan)
        self.assertEqual({'fonts are those of the plan', 'colours used are palette colours of the plan'} - plan_fails(unwaived), set())
        rep = plan_run('good.pptx', plan.replace('Waivers:            none', 'Waivers:            brand font Arial and brand colour 1F4E79 override the rules'))
        by = {c['name']: c['status'] for c in rep['plan']['checks']}
        self.assertEqual(by['fonts are those of the plan'], 'waived')
        self.assertEqual(by['colours used are palette colours of the plan'], 'waived')
        self.assertEqual(rep['summary']['waived'], 2)

    def test_plan_profile_mismatch(self):
        rep = plan_run('good.pptx', GOOD_PLAN, profile='talk')
        self.assertIn('plan profile equals the profile used for the run', plan_fails(rep))

    def test_plan_self_checks(self):
        cases = [
            ('| body | Arial | regular | 16 |', '| body | Arial | regular | 12 |', 'plan: role sizes within profile limits'),
            ('| body | Arial | regular | 16 |', '| body | Arial | regular | 17 |', 'plan: neighbouring role sizes differ by at least 1.25'),
            ('accent 1F4E79', 'accent 1F4E79, C00000', 'plan: palette has 1 accent and at most 1 signal colour'),
            ('| 333333 | body text |', '| BFBFBF | body text |', 'plan: role colours against palette backgrounds (contrast)'),
            ('| chart | Company data, 2025 |', '| chart | - |', 'plan: every data slide row has a source'),
            ('| 2 | main |', '| 2 | comparison |', 'plan: every slide row uses a layout type defined in the design system'),
        ]
        for old, new, expected in cases:
            self.assertIn(old, GOOD_PLAN, old)
            rep = plan_run('good.pptx', GOOD_PLAN.replace(old, new))
            self.assertIn(expected, plan_fails(rep), (old, new, plan_fails(rep)))

    def test_unparseable_plan_leaves_checks_not_measured(self):
        rep = plan_run('good.pptx', 'Profile: read\nnothing else')
        st = {c['status'] for c in rep['plan']['checks'] if c['id'] == '12'}
        self.assertEqual(st, {'not_measured'})



class RenderAnalysis(unittest.TestCase):
    """analyse_page and font_report on fabricated page data: no LibreOffice needed."""

    def _shapes(self):
        title = sp_text(2, 'Title 1', 0, 0, 0, 0, 'A title that wraps', ph='<p:ph type="title"/>')
        box = sp_text(3, 'Box', 48 * 12700, 120 * 12700, 300 * 12700, 30 * 12700, 'inside words', rpr=rpr_of(18, '333333'))
        pkg = cd.Package(build_pptx([title + box]))
        ctx = cd.Ctx(pkg, 'ppt/slides/slide1.xml', pkg.xml('ppt/presentation.xml'))
        shapes = cd.parse_slide(ctx)
        return shapes, next(s for s in shapes if s.ph)

    def test_words_outside_their_box_are_stray_and_title_lines_counted(self):
        shapes, title = self._shapes()
        page = {'w': 960.0, 'h': 540.0, 'words': [
            (48, 54, 100, 80, 'A'), (110, 54, 170, 80, 'title'),          # title line 1
            (48, 84, 100, 110, 'that'), (110, 84, 170, 110, 'wraps'),     # title line 2 (inside the 72 pt title box + 3 pt tolerance? no: y=84..110)
            (60, 125, 120, 145, 'inside'), (130, 125, 200, 145, 'words'),  # inside the 300 x 30 box
            (60, 300, 120, 320, 'spilled')]}                               # far below every box
        res = rendermod.analyse_page(page, shapes, 960.0, 540.0, title, cd.words_of)
        stray = [s.split('@')[0] for s in res['stray']]
        self.assertIn('spilled', stray)
        self.assertNotIn('inside', stray)
        self.assertNotIn('words', stray)
        self.assertEqual(res['title_lines'], 2)
        self.assertEqual(res['missing'], [])

    def test_missing_text_and_hyphen_wrapping(self):
        shapes, title = self._shapes()
        box = next(s for s in shapes if not s.ph)
        shapes = [box]
        box.paras = [[{'text': 'twenty-six items', 'size': 18, 'bold': False}]]
        page = {'w': 960.0, 'h': 540.0, 'words': [(60, 125, 120, 145, 'twenty-'), (60, 150, 100, 170, 'six')]}   # 'items' cut off
        res = rendermod.analyse_page(page, shapes, 960.0, 540.0, None, cd.words_of)
        self.assertEqual(res['missing'], ['items'])       # the hyphen break alone is not a difference

    def test_page_is_scaled_to_slide_points(self):
        shapes, title = self._shapes()
        page = {'w': 480.0, 'h': 270.0, 'words': [(30, 62.5, 50, 72.5, 'inside')]}   # half-size page: box is at 48..348 x 120..150 pt
        res = rendermod.analyse_page(page, shapes, 960.0, 540.0, None, cd.words_of)
        self.assertEqual(res['stray'], [])

    def test_words_beyond_the_slide_edge_are_reported(self):
        shapes, title = self._shapes()
        page = {'w': 960.0, 'h': 540.0, 'words': [(60, 125, 120, 145, 'inside'), (940, 125, 990, 145, 'clipped'), (60, 520, 100, 560, 'below')]}
        res = rendermod.analyse_page(page, shapes, 960.0, 540.0, None, cd.words_of)
        self.assertEqual(res['outside'], ['clipped', 'below'])

    def test_growing_autofit_box_does_not_make_its_own_lines_stray(self):
        shapes, title = self._shapes()
        box = next(s for s in shapes if not s.ph)
        page = {'w': 960.0, 'h': 540.0, 'words': [(60, 400, 120, 420, 'grown')]}   # far below the stored 30 pt height
        self.assertEqual(len(rendermod.analyse_page(page, shapes, 960.0, 540.0, None, cd.words_of)['stray']), 1)
        box.autofit = 'spAutoFit'
        self.assertEqual(rendermod.analyse_page(page, shapes, 960.0, 540.0, None, cd.words_of)['stray'], [])

    def test_font_report_metric_compatible_and_replaced(self):
        st, _, ev = rendermod.font_report(['Arial', 'Calibri'], ['LiberationSans', 'Carlito'])
        self.assertEqual(st, 'pass')
        st, _, ev = rendermod.font_report(['Arial', 'Comic Sans MS'], ['LiberationSans', 'DejaVuSans'])
        self.assertEqual(st, 'observation')
        self.assertIn('Comic Sans MS', ev.split('unreliable for:')[-1])

    def test_missing_renderer_is_not_measured(self):
        orig = rendermod.find_soffice
        rendermod.find_soffice = lambda: None
        try:
            rep = cd.analyse(cd.Package(os.path.join(FIX, 'good.pptx')), os.path.join(FIX, 'good.pptx'), 'read', set(), 'auto',
                             None, {}) if os.path.exists(os.path.join(FIX, 'good.pptx')) else None
        finally:
            rendermod.find_soffice = orig
        if rep is not None:
            c = find(rep['deck'], 'rendering')
            self.assertTrue(c and c[0]['status'] == 'not_measured')
            self.assertTrue(any(c['name'] == 'text overflow' for c in rep['slides'][0]['checks']))   # estimate stays as fallback


@unittest.skipUnless(rendermod.find_soffice() and __import__('shutil').which('pdftotext'), 'LibreOffice or poppler missing')
class RenderEndToEnd(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        def run(name):
            path = os.path.join(FIX, name)
            return cd.analyse(cd.Package(path), path, 'read', set(), 'auto', None, {})
        cls.good, cls.over, cls.bad = run('good.pptx'), run('overflow.pptx'), run('bad.pptx')

    def test_good_deck_renders_without_overflow(self):
        for sl in self.good['slides']:
            c = find(sl['checks'], 'text overflow (rendered)')[0]
            self.assertEqual(c['value'], 0, c)
            self.assertFalse(find(sl['checks'], 'text missing in the render'))
            self.assertEqual(find(sl['checks'], 'title lines (rendered)')[0]['value'], 1)
        self.assertEqual(find(self.good['deck'], 'fonts drawn in the render')[0]['status'], 'pass')

    def test_overflow_deck_reports_spill_and_three_title_lines(self):
        sl = self.over['slides'][0]
        self.assertGreater(find(sl['checks'], 'text overflow (rendered)')[0]['value'], 10)
        self.assertEqual(find(sl['checks'], 'title lines (rendered)')[0]['value'], 3)
        self.assertFalse(find(sl['checks'], 'text missing in the render'))       # hyphen wrap is not missing text

    def test_render_replaces_the_estimate_and_never_creates_a_fail(self):
        names = [c['name'] for c in self.over['slides'][0]['checks']]
        self.assertNotIn('text overflow', names)
        self.assertNotIn('title fits 2 lines', names)
        self.assertTrue(all(c['status'] == 'observation' for sl in self.over['slides'] for c in sl['checks'] if 'render' in c['method']))
        self.assertTrue(all(c['status'] != 'fail' for c in self.over['deck'] if 'render' in c['method']))

    def test_unavailable_font_is_flagged_unreliable(self):
        c = find(self.bad['deck'], 'fonts drawn in the render')[0]
        self.assertEqual(c['status'], 'observation')
        self.assertIn('Comic Sans MS', c['evidence'])

    def test_png_export(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            rr = rendermod.render(os.path.join(FIX, 'good.pptx'), d)
            self.assertTrue(rr['ok'])
            self.assertEqual(len(rr['png']), 2)
            self.assertTrue(all(os.path.getsize(p) > 500 for p in rr['png']))


def table_body(marl=91440, colw=(2000000, 2000000), text='alpha'):
    cells = ''.join('<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr sz="1400"/><a:t>%s</a:t></a:r></a:p></a:txBody><a:tcPr marL="%d"/></a:tc>' % (text, marl) for _ in colw)
    grid = ''.join('<a:gridCol w="%d"/>' % w for w in colw)
    return ('<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="4" name="Table"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>'
            '<p:xfrm><a:off x="609600" y="1524000"/><a:ext cx="4000000" cy="100000"/></p:xfrm><a:graphic>'
            '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblGrid>%s</a:tblGrid>'
            '<a:tr h="508000">%s</a:tr><a:tr h="508000">%s</a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>' % (grid, cells, cells))


class ScriptRound4(unittest.TestCase):
    def test_source_date_accepts_year_week_quarter_month(self):
        for good in ('Quelle: Controlling, 2026', 'Quelle: Controlling, KW 39', 'Source: Ops, CW39', 'Quelle: Plan, Q3', 'Quelle: Bericht, Oktober'):
            self.assertTrue(cd.YEAR_RE.search(good), good)
        for bad in ('Quelle: Controlling', 'Quelle: interne Daten', 'Source: Ops team'):
            self.assertFalse(cd.YEAR_RE.search(bad), bad)

    def test_table_frame_is_as_tall_as_its_rows(self):
        rep = run_on(build_pptx([table_body(colw=(2500000, 2500000))]))
        tbl = next(s for s in rep['slides'][0]['shapes'] if s['kind'] == 'table')
        self.assertEqual(tbl['bbox_pt'][3], 80.0)          # two rows of 40 pt, not the stored 7.9 pt
        self.assertEqual(tbl['bbox_pt'][2], 393.7)         # two columns of 196.85 pt, wider than the stored 315 pt frame

    def test_table_margins_larger_than_the_cell_fail(self):
        good = find(run_on(build_pptx([table_body()]))['slides'][0]['checks'], 'table cell margins', 'pass')
        self.assertTrue(good)
        bad = find(run_on(build_pptx([table_body(marl=8 * 914400)]))['slides'][0]['checks'], 'table cell margins', 'fail')   # 8 inches, the pptxgenjs unit trap
        self.assertTrue(bad and 'margins' in bad[0]['evidence'])

    def test_invalid_chart_dash_value_fails(self):
        chart = ('<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
                 '<c:chart><c:plotArea><c:lineChart><c:ser><c:spPr><a:ln><a:solidFill><a:srgbClr val="1F4E79"/></a:solidFill><a:prstDash val="%s"/></a:ln></c:spPr></c:ser></c:lineChart></c:plotArea></c:chart></c:chartSpace>')
        frame = ('<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="4" name="Chart" descr="A chart of values"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>'
                 '<p:xfrm><a:off x="609600" y="1524000"/><a:ext cx="4000000" cy="2000000"/></p:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">'
                 '<c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="rId9"/></a:graphicData></a:graphic></p:graphicFrame>')
        def deck(dash):
            src = build_pptx([frame])
            zin = zipfile.ZipFile(src)
            out = io.BytesIO()
            with zipfile.ZipFile(out, 'w') as zout:
                for n in zin.namelist():
                    b = zin.read(n)
                    if n == 'ppt/slides/_rels/slide1.xml.rels':
                        b = b.replace(b'</Relationships>', b'<Relationship Id="rId9" Type="http://x/chart" Target="../charts/chart1.xml"/></Relationships>')
                    zout.writestr(n, b)
                zout.writestr('ppt/charts/chart1.xml', chart % dash)
            out.seek(0)
            return out
        self.assertTrue(find(run_on(deck('dash,solid'))['slides'][0]['checks'], 'chart line dash', 'fail'))
        self.assertFalse(find(run_on(deck('dash'))['slides'][0]['checks'], 'chart line dash', 'fail'))

    def test_plan_status_colours_do_not_count_as_signal_and_slide_roles_are_exempt(self):
        p = planmod.parse_plan('Palette: background FFFFFF | accent 1F4E79 | status 2E7D32, B45309, B71C1C | neutrals 7A808A\n')
        roles = [(x['role'], x['hex']) for x in p['palette']]
        self.assertEqual([r for r in roles if r[0] == 'status'], [('status', '2E7D32'), ('status', 'B45309'), ('status', 'B71C1C')])
        self.assertEqual(planmod._role_kind('title-slide'), 'other')
        self.assertEqual(planmod._role_kind('title'), 'title')
        self.assertEqual(planmod._role_kind('subtitle'), 'other')


if __name__ == '__main__':
    unittest.main(verbosity=2)
