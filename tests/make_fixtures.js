// Builds the two test decks for scripts/check_deck.py with pptxgenjs.
// Usage: NODE_PATH=<dir with node_modules> node tests/make_fixtures.js <outdir>
const pptxgen = require('pptxgenjs');
const path = require('path');
const out = process.argv[2] || 'tests/fixtures';
const png = path.join(out, 'pixel.png'); // created by the test runner (Pillow)

function master(pres, bg) {
  pres.defineSlideMaster({
    title: 'MAIN',
    background: { color: bg },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.667, y: 0.667, w: 12.0, h: 1.0,
          fontFace: 'Arial', fontSize: 26, bold: true, color: '1A1A1A', align: 'left', valign: 'top' }, text: '' } },
    ],
  });
}

// ---- good deck: profile read, safe font, one accent, inherited sizes
(function good() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'FFFFFF');
  let s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('Retention drives the 12 % revenue growth', { placeholder: 'title' });
  s.addText('Churn fell from 9 % to 6 % after the onboarding change.', { x: 0.667, y: 1.9, w: 5.5, h: 1.0, fontFace: 'Arial', fontSize: 16, color: '333333', align: 'left' });
  s.addChart(pres.charts.BAR, [{ name: 'Revenue', labels: ['2023', '2024', '2025'], values: [10, 11, 12.3] }],
    { x: 6.8, y: 1.9, w: 5.8, h: 3.8, chartColors: ['1F4E79'], catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, legendFontSize: 10, dataLabelFontSize: 10, showLegend: false, altText: 'Revenue 2023 to 2025 rises from 10 to 12.3' });
  s.addText('Source: Company data, 2025', { x: 0.667, y: 6.4, w: 6, h: 0.3, fontFace: 'Arial', fontSize: 10, color: '595959', align: 'left' });

  s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('Two levers explain most of the gain', { placeholder: 'title' });
  s.addText('Pricing and onboarding.', { x: 0.667, y: 1.9, w: 8, h: 0.6, fontFace: 'Arial', fontSize: 20, color: '1F4E79', align: 'left' });
  pres.writeFile({ fileName: path.join(out, 'good.pptx') });
})();

// ---- bad deck: deliberate violations, each with an expected finding
(async function bad() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'FFFFFF');
  let s = pres.addSlide({ masterName: 'MAIN' });
  // slide 1: 8 pt text, BFBFBF on white (1.84:1), Comic Sans + Georgia + Arial (3 families),
  //          emoji, shadow, shape outside margin, third hue, image without alt text
  s.addText('Overview of results', { placeholder: 'title' });
  s.addText('Tiny footnote text', { x: 0.667, y: 6.9, w: 4, h: 0.3, fontFace: 'Arial', fontSize: 8, color: '333333' });
  s.addText('Light grey body', { x: 0.667, y: 2.0, w: 4, h: 0.5, fontFace: 'Comic Sans MS', fontSize: 18, color: 'BFBFBF' });
  s.addText('Georgia body 🚀', { x: 0.667, y: 2.8, w: 4, h: 0.5, fontFace: 'Georgia', fontSize: 18, color: '333333' });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.0, w: 2, h: 1, fill: { color: 'C00000' }, shadow: { type: 'outer', color: '000000', blur: 6, offset: 3, angle: 45, opacity: 0.4 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 8.0, y: 2.0, w: 2, h: 1, fill: { color: '2E8B57' } });
  s.addShape(pres.shapes.RECTANGLE, { x: 12.0, y: 4.0, w: 1.3, h: 1, fill: { color: '1F4E79' } });
  s.addImage({ path: png, x: 0.667, y: 4.0, w: 2, h: 1 });
  // slide 2: no title, table without source, long text
  s = pres.addSlide();
  s.addText('word '.repeat(150), { x: 0.667, y: 0.667, w: 12, h: 3, fontFace: 'Arial', fontSize: 14, color: '333333' });
  s.addTable([[{ text: 'A' }, { text: 'B' }], [{ text: '1' }, { text: '2' }]], { x: 0.667, y: 4.5, w: 6, h: 1, fontFace: 'Arial', fontSize: 14, color: '333333' });
  await pres.writeFile({ fileName: path.join(out, 'bad.pptx') });
})();
