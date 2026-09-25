// Round 2b: Max asked for "a mix of all three, but really Apple style: rounded, Liquid Glass".
// Mix: A's large bold Arial titles, full chart and callout; B's spec list on the cover; C's statement title with a bold key phrase
// and the interpretation beside the chart. Liquid Glass: one translucent rounded panel per slide, lit from behind by soft light blue.
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const DIR = __dirname;
const pt = (v) => v / 72;
const col = (c) => 48 + (c - 1) * (57.333 + 16);
const span = (n) => n * 57.333 + (n - 1) * 16;
const G = { bg: 'F5F9FC', ink: '0A2A4A', grey2: '46607A', bar: '7A8A9A', blue: '1668B8', rule: 'A9BED2' };
const KEY = '500 km nachladen dauert 90 Sekunden statt 35 Minuten';
const MEASURE = 'Minuten für 500 km Reichweite';
const CATS = ['E-Auto, Schnelllader', 'Wasserstoff, Säule', 'Benziner', 'Norra, Kapselwechsel'];
const VALS = [35, 5, 4, 1.5];
const SOURCE = 'Quelle: Norra-Messreihe 2026 (Beispieldaten)';

function text(s, t, x, y, w, h, o) {
  s.addText(t, Object.assign({ x: pt(x), y: pt(y), w: pt(w), h: pt(h), align: 'left', valign: 'top', margin: 0, isTextBox: true, fontFace: 'Arial', color: G.ink }, o));
}
function glass(s, x, y, w, h) {
  s.addShape('roundRect', { x: pt(x), y: pt(y), w: pt(w), h: pt(h), rectRadius: pt(24),
    fill: { color: 'FFFFFF', transparency: 30 }, line: { color: 'FFFFFF', width: 1.5 },
    shadow: { type: 'outer', color: G.ink, opacity: 0.12, blur: 24, offset: 6, angle: 90 } });
}
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.defineSlideMaster({ title: 'P01 cover', background: { color: G.bg }, objects: [
  { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(136), w: pt(span(6)), h: pt(200), fontFace: 'Arial', fontSize: 44,
    color: G.ink, align: 'left', valign: 'bottom', margin: 0 }, text: '' } }] });
pres.defineSlideMaster({ title: 'P04 chart-rail', background: { color: G.bg }, objects: [
  { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(56), w: pt(864), h: pt(84), fontFace: 'Arial', fontSize: 34, bold: true,
    color: G.ink, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
  slideNumber: { x: pt(872), y: pt(496), w: pt(40), h: pt(16), fontFace: 'Arial', fontSize: 9, color: G.grey2, align: 'right' } });

let s = pres.addSlide({ masterName: 'P01 cover' });
s.addImage({ path: path.join(DIR, 'assets/light-cover.png'), x: pt(480), y: 0, w: pt(480), h: pt(540), altText: 'Weiches hellblaues Licht als Hintergrund, ohne Inhalt' });
s.addText([{ text: 'Norra: Wasserstoff tanken', options: { bold: true } }, { text: ' ohne Wasserstofftankstelle', options: { bold: false } }], { placeholder: 'title' });
text(s, 'Series-A-Pitch · Investorengespräch 2026 · alle Zahlen Beispieldaten', 48, 352, span(6), 40, { fontSize: 16, color: G.grey2 });
glass(s, col(8) + 16, 120, span(4) + 32, 300);
const spec = [['Reichweite', '600 km'], ['Nachladen', '90 Sekunden'], ['Kapseln', '2 × 3 kg Wasserstoff'], ['Preis', 'ab 39.900 €']];
spec.forEach(([k, v], i) => {
  const x = col(8) + 48, w = span(4) - 32, y = 144 + i * 64;
  if (i) s.addShape('line', { x: pt(x), y: pt(y - 8), w: pt(w), h: 0, line: { color: G.rule, width: 0.75 } });
  text(s, k, x, y, w, 16, { fontSize: 12, color: '2F4760' });
  text(s, v, x, y + 18, w, 26, { fontSize: 20, bold: true });
});

s = pres.addSlide({ masterName: 'P04 chart-rail' });
s.addText(KEY, { placeholder: 'title' });
text(s, MEASURE, 48, 152, 600, 18, { fontSize: 14, color: G.grey2 });
s.addChart(pres.charts.BAR, [{ name: MEASURE, labels: CATS, values: VALS }], {
  x: pt(col(1)), y: pt(184), w: pt(span(8)), h: pt(264), barDir: 'bar', barGapWidthPct: 45,
  chartColors: VALS.map((_, i) => (i === 3 ? G.blue : G.bar)), catAxisOrientation: 'maxMin', valAxisHidden: true,
  valGridLine: { style: 'none' }, catAxisLineShow: false, catAxisLabelFontFace: 'Arial', catAxisLabelFontSize: 14, catAxisLabelColor: G.ink,
  showValue: true, dataLabelFormatCode: '[<2]0.0;0', dataLabelFontFace: 'Arial', dataLabelFontSize: 14, dataLabelColor: G.ink,
  dataLabelPosition: 'outEnd', showLegend: false,
  altText: 'Balken: Minuten für 500 km Reichweite. E-Auto am Schnelllader 35, Wasserstoffauto an der Säule 5, Benziner 4, Norra mit Kapselwechsel 1,5 (Beispieldaten)' });
text(s, '23-mal schneller', 300, 404, 240, 24, { fontSize: 18, bold: true, color: G.blue });
s.addImage({ path: path.join(DIR, 'assets/light-rail.png'), x: pt(col(9) - 16), y: pt(160), w: pt(288), h: pt(320), altText: 'Weiches hellblaues Licht hinter der Glasfläche, ohne Inhalt' });
glass(s, col(9), 200, span(4), 136);
text(s, 'Was das heißt', col(9) + 24, 224, span(4) - 48, 20, { fontSize: 14, bold: true });
text(s, 'Flottenautos stehen nicht mehr am Lader.', col(9) + 24, 252, span(4) - 48, 80, { fontSize: 20 });
text(s, SOURCE, 48, 472, 700, 12, { fontSize: 9, color: G.grey2 });

fs.mkdirSync(path.join(DIR, 'drafts'), { recursive: true });
pres.writeFile({ fileName: path.join(DIR, 'drafts', 'm-glas.pptx') });
