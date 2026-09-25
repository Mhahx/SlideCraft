// Round 2 drafts for the Norra pitch (SKILL.md step 4): three directions, each the title slide and the key content slide.
// Pinned by Max: investor pitch, modern "like Apple", light blue and white, futuristic; invented sample numbers. Profile pitch.
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const DIR = __dirname;
const pt = (v) => v / 72;
const col = (c) => 48 + (c - 1) * (57.333 + 16);
const span = (n) => n * 57.333 + (n - 1) * 16;

// shared content from the story skeleton
const TITLE = 'Norra: Wasserstoff tanken ohne Wasserstofftankstelle';
const SUB = 'Series-A-Pitch · Investorengespräch 2026 · alle Zahlen Beispieldaten';
const KEY = '500 km nachladen dauert 90 Sekunden statt\u00a035\u00a0Minuten';
const MEASURE = 'Minuten für 500 km Reichweite';
const CATS = ['E-Auto, Schnelllader', 'Wasserstoff, Säule', 'Benziner', 'Norra, Kapselwechsel'];
const VALS = [35, 5, 4, 1.5];
const SOURCE = 'Quelle: Norra-Messreihe 2026 (Beispieldaten)';
const FMT = '[<2]0.0;0';

function deck(name, build) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  build(pres);
  fs.mkdirSync(path.join(DIR, 'drafts'), { recursive: true });
  return pres.writeFile({ fileName: path.join(DIR, 'drafts', name + '.pptx') });
}
function text(s, t, x, y, w, h, o) {
  s.addText(t, Object.assign({ x: pt(x), y: pt(y), w: pt(w), h: pt(h), align: 'left', valign: 'top', margin: 0, isTextBox: true }, o));
}
function bars(pres, s, x, y, w, h, o) {
  s.addChart(pres.charts.BAR, [{ name: MEASURE, labels: CATS, values: VALS }], Object.assign({
    x: pt(x), y: pt(y), w: pt(w), h: pt(h), barDir: 'bar', barGapWidthPct: 45,
    chartColors: VALS.map((_, i) => (i === 3 ? o.accent : o.grey)),
    catAxisOrientation: 'maxMin', valAxisHidden: true, valGridLine: { style: 'none' }, catAxisLineShow: false,
    catAxisLabelFontFace: o.font, catAxisLabelFontSize: o.label, catAxisLabelColor: o.ink,
    showValue: true, dataLabelFormatCode: FMT, dataLabelFontFace: o.font, dataLabelFontSize: o.label, dataLabelColor: o.ink,
    dataLabelPosition: 'outEnd', showLegend: false,
    altText: 'Balken: Minuten für 500 km Reichweite. E-Auto am Schnelllader 35, Wasserstoffauto an der Säule 5, Benziner 4, Norra mit Kapselwechsel 1,5 (Beispieldaten)',
  }, o.extra || {}));
}
function titleMaster(pres, name, o) {
  pres.defineSlideMaster({ title: name, background: { color: o.bg }, objects: [
    { placeholder: { options: Object.assign({ name: 'title', type: 'title', align: 'left', valign: 'top', margin: 0 }, o.ph), text: '' } }],
    slideNumber: o.num });
}

// ------------------------------------------------------------------ A: Keynote (product launch stage)
// white ground, one family (Arial) with large bold titles, exhibit across the full width, no rail, a light-blue colour field on the cover only
const A = { ink: '1D1D1F', grey2: '5E5E63', bar: '949494', blue: '0A6CC2', field: 'D6ECFA' };
deck('a-keynote', (pres) => {
  titleMaster(pres, 'P01 cover', { bg: 'FFFFFF', ph: { x: pt(48), y: pt(120), w: pt(span(10)), h: pt(160), fontFace: 'Arial', fontSize: 54, bold: true, color: A.ink, valign: 'bottom' } });
  titleMaster(pres, 'P05 chart-focus', { bg: 'FFFFFF', ph: { x: pt(48), y: pt(56), w: pt(864), h: pt(84), fontFace: 'Arial', fontSize: 36, bold: true, color: A.ink },
    num: { x: pt(872), y: pt(496), w: pt(40), h: pt(16), fontFace: 'Arial', fontSize: 9, color: A.grey2, align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addText(TITLE, { placeholder: 'title' });
  s.addShape('rect', { x: 0, y: pt(360), w: pt(960), h: pt(180), fill: { color: A.field }, line: { type: 'none' } });
  text(s, SUB, 48, 400, span(10), 24, { fontFace: 'Arial', fontSize: 18, color: A.ink });

  s = pres.addSlide({ masterName: 'P05 chart-focus' });
  s.addText(KEY, { placeholder: 'title' });
  text(s, MEASURE, 48, 152, 864, 20, { fontFace: 'Arial', fontSize: 14, color: A.grey2 });
  bars(pres, s, 48, 184, 816, 264, { accent: A.blue, grey: A.bar, font: 'Arial', label: 16, ink: A.ink });
  text(s, '23-mal schneller als am Schnelllader', 300, 404, span(6), 24, { fontFace: 'Arial', fontSize: 18, bold: true, color: A.blue });
  text(s, SOURCE, 48, 472, 700, 12, { fontFace: 'Arial', fontSize: 9, color: A.grey2 });
});

// ------------------------------------------------------------------ B: Datenblatt (technical data sheet, product spec page)
// pale blue-white ground, Arial, text left and exhibit right, interpretation with a rule on its left, hairlines, denser
const B = { bg: 'F4F8FB', ink: '0B2540', grey2: '46607A', bar: '7A8A9A', blue: '1668B8', rule: 'A9BED2' };
deck('b-datenblatt', (pres) => {
  titleMaster(pres, 'P01 cover', { bg: B.bg, ph: { x: pt(48), y: pt(176), w: pt(span(7)), h: pt(120), fontFace: 'Arial', fontSize: 40, bold: true, color: B.ink, valign: 'bottom' } });
  titleMaster(pres, 'P04 chart-rail', { bg: B.bg, ph: { x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: 'Arial', fontSize: 28, bold: true, color: B.ink },
    num: { x: pt(872), y: pt(496), w: pt(40), h: pt(16), fontFace: 'Arial', fontSize: 9, color: B.grey2, align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addText(TITLE, { placeholder: 'title' });
  text(s, SUB, 48, 312, span(7), 40, { fontFace: 'Arial', fontSize: 14, color: B.grey2 });
  const spec = [['Reichweite', '600 km'], ['Nachladen', '90 Sekunden'], ['Kapseln', '2 × 3 kg Wasserstoff'], ['Preis', 'ab 39.900 €']];
  spec.forEach(([k, v], i) => {
    const y = 160 + i * 64;
    s.addShape('line', { x: pt(col(9)), y: pt(y), w: pt(span(4)), h: 0, line: { color: B.rule, width: 0.75 } });
    text(s, k, col(9), y + 10, span(4), 16, { fontFace: 'Arial', fontSize: 12, color: B.grey2 });
    text(s, v, col(9), y + 28, span(4), 26, { fontFace: 'Arial', fontSize: 20, bold: true, color: B.ink });
  });
  s.addShape('line', { x: pt(col(9)), y: pt(416), w: pt(span(4)), h: 0, line: { color: B.rule, width: 0.75 } });

  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText(KEY, { placeholder: 'title' });
  s.addShape('line', { x: pt(col(1)), y: pt(156), w: 0, h: pt(200), line: { color: B.blue, width: 1.5 } });
  text(s, 'Was das heißt', col(1) + 16, 156, span(4) - 16, 20, { fontFace: 'Arial', fontSize: 14, bold: true, color: B.ink });
  text(s, 'Flottenautos stehen nicht mehr am Lader, sondern fahren.', col(1) + 16, 184, span(4) - 24, 80, { fontFace: 'Arial', fontSize: 18, color: B.ink });
  text(s, MEASURE, col(6), 156, span(7), 18, { fontFace: 'Arial', fontSize: 12, color: B.grey2 });
  bars(pres, s, col(6), 180, span(7), 268, { accent: B.blue, grey: B.bar, font: 'Arial', label: 14, ink: B.ink });
  text(s, SOURCE, 48, 472, 700, 12, { fontFace: 'Arial', fontSize: 9, color: B.grey2 });
});

// ------------------------------------------------------------------ C: Himmelblau (sky-blue colour field, showroom brochure)
// cover drenched in light blue, statement title with a bold key phrase, Calibri, exhibit left and interpretation on a light field
const C = { sky: 'CFE6F6', ink: '0A2A4A', grey2: '3F5A74', bar: '7E8D9B', blue: '1565B0', tint: 'EAF4FB' };
deck('c-himmelblau', (pres) => {
  titleMaster(pres, 'P01 cover', { bg: C.sky, ph: { x: pt(48), y: pt(208), w: pt(span(9)), h: pt(150), fontFace: 'Calibri', fontSize: 48, color: C.ink, valign: 'bottom' } });
  titleMaster(pres, 'P04 chart-rail', { bg: 'FFFFFF', ph: { x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: 'Calibri', fontSize: 30, bold: true, color: C.ink },
    num: { x: pt(872), y: pt(496), w: pt(40), h: pt(16), fontFace: 'Calibri', fontSize: 9, color: C.grey2, align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addText([{ text: 'Norra: ', options: { bold: true } }, { text: 'Wasserstoff tanken', options: { bold: true } },
    { text: ' ohne Wasserstofftankstelle', options: { bold: false } }], { placeholder: 'title' });
  text(s, SUB, 48, 376, span(9), 24, { fontFace: 'Calibri', fontSize: 18, color: C.grey2 });

  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText(KEY, { placeholder: 'title' });
  text(s, MEASURE, 48, 128, 600, 18, { fontFace: 'Calibri', fontSize: 14, color: C.grey2 });
  bars(pres, s, col(1), 160, span(8), 288, { accent: C.blue, grey: C.bar, font: 'Calibri', label: 14, ink: C.ink });
  s.addShape('rect', { x: pt(col(9)), y: pt(160), w: pt(span(4)), h: pt(136), fill: { color: C.tint }, line: { type: 'none' } });
  text(s, 'Was das heißt', col(9) + 16, 176, span(4) - 32, 20, { fontFace: 'Calibri', fontSize: 14, bold: true, color: C.ink });
  text(s, 'Flottenautos stehen nicht mehr am Lader.', col(9) + 16, 204, span(4) - 32, 90, { fontFace: 'Calibri', fontSize: 18, color: C.ink });
  text(s, SOURCE, 48, 472, 700, 12, { fontFace: 'Calibri', fontSize: 9, color: C.grey2 });
});
