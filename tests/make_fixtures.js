// Builds the test decks (good, bad, overflow, fonts, slop) for plugin/skills/slide-craft/scripts/check_deck.py with pptxgenjs.
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

// ---- overflow deck: text that does not fit its box, a three-line title, a calibri run (font substitution)
(async function overflow() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'FFFFFF');
  const s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('This title is deliberately far too long so that it needs three full lines at twenty six points in the title area of the slide master, and it keeps going with more words until the third line is certainly reached', { placeholder: 'title' });
  s.addText('One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty ' +
    'twenty-one twenty-two twenty-three twenty-four twenty-five twenty-six twenty-seven twenty-eight',
    { x: 0.667, y: 2.5, w: 4, h: 0.6, fontFace: 'Arial', fontSize: 20, color: '333333', valign: 'top' });
  s.addText('Fits easily', { x: 6.0, y: 2.5, w: 4, h: 0.6, fontFace: 'Arial', fontSize: 20, color: '333333' });
  await pres.writeFile({ fileName: path.join(out, 'overflow.pptx') });
})();

// ---- fonts deck: Calibri and Cambria, which LibreOffice replaces unless Carlito/Caladea are installed
(async function fonts() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'FFFFFF');
  const s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('Calibri and Cambria are drawn by substitutes', { placeholder: 'title' });
  s.addText('Calibri body text', { x: 0.667, y: 2.5, w: 5, h: 0.6, fontFace: 'Calibri', fontSize: 20, color: '333333' });
  s.addText('Cambria body text', { x: 0.667, y: 3.5, w: 5, h: 0.6, fontFace: 'Cambria', fontSize: 20, color: '333333' });
  await pres.writeFile({ fileName: path.join(out, 'fonts.pptx') });
})();

// ---- slop deck: typical AI patterns (nested cards, icon tiles, stat row, card grid, stripes, 01 labels)
(function slop() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'FFFFFF');
  const F = 'Arial', INK = '1F2937', MUTED = '4B5563', ACC = '2563EB', CARD = 'F3F4F6', LINE = 'D1D5DB';
  let s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('Three levers cut operating cost by 18 percent', { placeholder: 'title' });
  s.addShape('roundRect', { x: 0.667, y: 1.9, w: 12, h: 4.7, fill: { color: 'F9FAFB' }, line: { color: LINE, width: 1 }, rectRadius: 0.2 });
  [['Energy', 'Long-term contracts lower power prices.'], ['Maintenance', 'Fewer moving parts lower maintenance.'], ['Crew', 'Smaller crews on short routes.']].forEach((c, i) => {
    const x = 1.0 + i * 3.9;
    s.addShape('roundRect', { x, y: 2.1, w: 3.6, h: 4.2, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 1 }, rectRadius: 0.15 });
    s.addShape('roundRect', { x: x + 0.3, y: 2.4, w: 0.7, h: 0.7, fill: { color: 'DBEAFE' }, line: { type: 'none' }, rectRadius: 0.12 });
    s.addText(c[0], { x: x + 0.3, y: 3.3, w: 3.0, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: INK });
    s.addText(c[1], { x: x + 0.3, y: 3.85, w: 3.0, h: 1.2, fontFace: F, fontSize: 14, color: MUTED });
  });
  s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('The fleet flies cheaper, quieter and cleaner', { placeholder: 'title' });
  [['-18 %', 'Operating cost'], ['-60 %', 'Noise'], ['0 g', 'CO2 in flight']].forEach((m, i) => {
    const x = 0.667 + i * 4.1;
    s.addShape('roundRect', { x, y: 2.0, w: 3.8, h: 3.2, fill: { color: CARD }, line: { type: 'none' }, rectRadius: 0.15 });
    s.addShape('rect', { x, y: 2.0, w: 0.08, h: 3.2, fill: { color: ACC }, line: { type: 'none' } });
    s.addText(m[0], { x: x + 0.3, y: 2.4, w: 3.3, h: 1.3, fontFace: F, fontSize: 54, bold: true, color: ACC });
    s.addText(m[1], { x: x + 0.3, y: 3.8, w: 3.3, h: 0.6, fontFace: F, fontSize: 16, color: MUTED });
  });
  s = pres.addSlide({ masterName: 'MAIN' });
  s.addText('Four steps lead to scheduled service by 2028', { placeholder: 'title' });
  ['Certification', 'Pilot route', 'Charging', 'Fleet'].forEach((t, i) => {
    const x = 0.667 + (i % 2) * 6.1, y = 1.9 + Math.floor(i / 2) * 2.4;
    s.addShape('roundRect', { x, y, w: 5.9, h: 2.1, fill: { color: CARD }, line: { type: 'none' }, rectRadius: 0.12 });
    s.addShape('rect', { x, y, w: 0.1, h: 2.1, fill: { color: ACC }, line: { type: 'none' } });
    s.addText('0' + (i + 1), { x: x + 0.35, y: y + 0.25, w: 1, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: ACC });
    s.addText(t, { x: x + 0.35, y: y + 0.7, w: 5.2, h: 0.5, fontFace: F, fontSize: 20, bold: true, color: INK });
  });
  pres.writeFile({ fileName: path.join(out, 'slop.pptx') });
})();
