// Round 2 drafts for the Nordmark test deck (SKILL.md step 4): three directions, each the title slide and the key content slide.
// Pinned by Max: sober and trustworthy with a view forward, dark green, landscape photos, no brand. Profile read. All figures invented.
// Usage: NODE_PATH=<dir with node_modules containing pptxgenjs> node examples/nordmark/drafts.js
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const DIR = __dirname;
const A = (f) => path.join(DIR, 'assets', f);
const pt = (v) => v / 72;
const col = (c) => 48 + (c - 1) * (57.333 + 16);
const span = (n) => n * 57.333 + (n - 1) * 16;

// shared content from the story skeleton
const TITLE = 'Nah bleiben, anders erreichbar';
const SUB = 'Filialnetz 2027 · Entscheidungsvorlage für den Vorstand · Beispieldaten';
const KEY = '14 Filialen haben weniger als 40 Schalterkunden am Tag';
const MEASURE = 'Schalterkunden je Filiale und Werktag, Mittel Januar bis August 2026, 42 Filialen';
const FREQ = [182, 170, 161, 155, 149, 140, 133, 128, 120, 114, 109, 103, 98, 94, 90, 86, 81, 77, 74, 70, 66, 62, 58, 55, 52, 48, 44, 41,
  39, 37, 35, 33, 31, 29, 27, 26, 24, 22, 21, 19, 18, 16];
const RAIL_HEAD = 'Was das bedeutet';
const RAIL = [
  'Die 14 Filialen tragen 12 % der Schalterbesuche, aber 7,7 Mio. € der Kosten.',
  'Zehn davon liegen weniger als 12 Minuten von der nächsten größeren Filiale entfernt.',
  'Sechs liegen in Orten ohne andere Bank: Dort bleibt ein SB-Anker mit Automat und Videoberatung.',
];
const SOURCE = 'Quelle: Filialcontrolling Nordmark, Januar bis August 2026 (Beispieldaten)';
const CREDIT = (who) => 'Foto: ' + who + ', CC BY-SA 4.0, Wikimedia Commons';

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
function freqChart(pres, s, x, y, w, h, grey, accent, font, bg) {
  s.addChart(pres.charts.BAR, [{ name: 'Schalterkunden je Tag', labels: FREQ.map((_, i) => 'F' + (i + 1)), values: FREQ }],
    { x: pt(x), y: pt(y), w: pt(w), h: pt(h), barDir: 'col', barGapWidthPct: 40, chartColors: FREQ.map((v) => (v < 40 ? accent : grey)),
      showLegend: false, catAxisHidden: true, valAxisLabelFontSize: 10, valAxisLabelFontFace: font, valAxisLabelColor: '595959',
      valAxisMaxVal: 200, valAxisMajorUnit: 40, valGridLine: { color: 'D9D9D9', size: 0.5 }, valAxisLineShow: false,
      plotArea: bg ? { fill: { color: bg } } : undefined,
      altText: 'Säulen für 42 Filialen, absteigend von 182 bis 16 Schalterkunden je Tag; die 14 Filialen unter 40 sind hervorgehoben' });
}

// ------------------------------------------------------------------ A: Geschäftsbericht (annual report of a cooperative bank)
// light ground, serif titles (Cambria) with sans body (Calibri), interpretation as a light field, exhibit left, emphasis accent plus tint field
const A_GREEN = '1F4A3A', A_TINT = 'EEF2EF', A_INK = '1C1C1C', A_GREY = '8C8C8C';
deck('a-geschaeftsbericht', (pres) => {
  pres.defineSlideMaster({ title: 'P01 cover', background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(72), y: pt(318), w: pt(span(6)), h: pt(96), fontFace: 'Cambria',
      fontSize: 36, bold: true, color: 'FFFFFF', align: 'left', valign: 'bottom', margin: 0 }, text: '' } }] });
  pres.defineSlideMaster({ title: 'P04 chart-rail', background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: 'Cambria',
      fontSize: 26, bold: true, color: A_INK, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
    slideNumber: { x: pt(872), y: pt(486), w: pt(40), h: pt(16), fontFace: 'Calibri', fontSize: 9, color: '595959', align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addImage({ path: A('windeby-1049-169.jpg'), x: 0, y: 0, w: pt(960), h: pt(540), altText: 'Weizenfelder und Baumreihen bei Windeby unter hellem Himmel' });
  s.addShape('rect', { x: pt(48), y: pt(296), w: pt(span(7)), h: pt(196), fill: { color: A_GREEN }, line: { type: 'none' } });
  s.addText(TITLE, { placeholder: 'title' });
  text(s, SUB, 72, 422, span(6), 40, { fontFace: 'Calibri', fontSize: 14, color: 'FFFFFF' });
  text(s, CREDIT('Dietmar Rabich'), 72, 470, 400, 12, { fontFace: 'Calibri', fontSize: 8, color: 'D6E4DC' });   // on the panel, never on the photo

  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText(KEY, { placeholder: 'title' });
  text(s, MEASURE, 48, 124, 864, 18, { fontFace: 'Calibri', fontSize: 12, color: '595959' });
  freqChart(pres, s, col(1), 156, span(8), 296, A_GREY, A_GREEN, 'Calibri');
  s.addShape('rect', { x: pt(col(9)), y: pt(156), w: pt(span(4)), h: pt(296), fill: { color: A_TINT }, line: { type: 'none' } });
  text(s, RAIL_HEAD, col(9) + 16, 172, span(4) - 32, 20, { fontFace: 'Calibri', fontSize: 14, bold: true, color: A_GREEN });
  text(s, RAIL.map((t, i) => ({ text: t, options: { breakLine: i < RAIL.length - 1 } })), col(9) + 16, 200, span(4) - 32, 240,
    { fontFace: 'Calibri', fontSize: 14, color: A_INK, paraSpaceAfter: 10 });
  text(s, SOURCE, 48, 474, 700, 12, { fontFace: 'Calibri', fontSize: 8, color: '595959' });
});

// ------------------------------------------------------------------ B: Flurkarte (survey office, cadastral maps)
// sans only (Arial), text left and exhibit right, interpretation as a rule, lean, colour field on the title slide with a photo strip
const B_GREEN = '1E4D3C', B_INK = '222222', B_GREY = '949494';
deck('b-flurkarte', (pres) => {
  pres.defineSlideMaster({ title: 'P01 cover', background: { color: B_GREEN }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(300), w: pt(span(9)), h: pt(60), fontFace: 'Arial',
      fontSize: 36, bold: true, color: 'FFFFFF', align: 'left', valign: 'top', margin: 0 }, text: '' } }] });
  pres.defineSlideMaster({ title: 'P04 chart-rail', background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: 'Arial',
      fontSize: 24, bold: true, color: B_INK, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
    slideNumber: { x: pt(872), y: pt(486), w: pt(40), h: pt(16), fontFace: 'Arial', fontSize: 8, color: '595959', align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addImage({ path: A('windeby-1050-strip.jpg'), x: 0, y: 0, w: pt(960), h: pt(300 - 36), altText: 'Hügelige Felder und Baumgruppen bei Windeby' });
  s.addText(TITLE, { placeholder: 'title' });
  text(s, SUB, 48, 364, span(9), 20, { fontFace: 'Arial', fontSize: 14, color: 'FFFFFF' });
  s.addShape('line', { x: pt(48), y: pt(404), w: pt(864), h: 0, line: { color: '8FB3A3', width: 0.75 } });
  text(s, 'Regionalbank Nordmark · 42 Filialen · 312.000 Kundinnen und Kunden', 48, 414, span(9), 16, { fontFace: 'Arial', fontSize: 12, color: 'D6E4DC' });
  text(s, CREDIT('Dietmar Rabich'), 48, 500, 400, 12, { fontFace: 'Arial', fontSize: 8, color: 'D6E4DC' });

  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText(KEY, { placeholder: 'title' });
  text(s, RAIL_HEAD, col(1), 156, span(4) - 16, 18, { fontFace: 'Arial', fontSize: 14, bold: true, color: B_GREEN });
  text(s, RAIL.map((t, i) => ({ text: t, options: { breakLine: i < RAIL.length - 1 } })), col(1), 182, span(4) - 16, 260,
    { fontFace: 'Arial', fontSize: 14, color: B_INK, paraSpaceAfter: 12 });
  s.addShape('line', { x: pt(col(5) - 8), y: pt(156), w: 0, h: pt(296), line: { color: 'BFBFBF', width: 0.75 } });
  text(s, MEASURE, col(5) + 8, 156, span(8) - 8, 16, { fontFace: 'Arial', fontSize: 12, color: '595959' });
  freqChart(pres, s, col(5) + 8, 180, span(8) - 8, 272, B_GREY, B_GREEN, 'Arial');
  text(s, SOURCE, 48, 474, 700, 12, { fontFace: 'Arial', fontSize: 8, color: '595959' });
});

// ------------------------------------------------------------------ C: Weitblick (horizon, perspective)
// statement titles with a bold key phrase (Arial), dark green ground on the title, wide photo, exhibit left, interpretation as a rule, airy
const C_GREEN = '173D30', C_INK = '1E1E1E', C_GREY = '949494', C_LIGHT = 'CFE0D6';
deck('c-weitblick', (pres) => {
  pres.defineSlideMaster({ title: 'P01 cover', background: { color: C_GREEN }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(360), w: pt(span(10)), h: pt(56), fontFace: 'Arial',
      fontSize: 40, bold: false, color: 'FFFFFF', align: 'left', valign: 'top', margin: 0 }, text: '' } }] });
  pres.defineSlideMaster({ title: 'P04 chart-rail', background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: 'Arial',
      fontSize: 26, bold: false, color: C_INK, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
    slideNumber: { x: pt(872), y: pt(486), w: pt(40), h: pt(16), fontFace: 'Arial', fontSize: 8, color: '595959', align: 'right' } });
  let s = pres.addSlide({ masterName: 'P01 cover' });
  s.addImage({ path: A('koog-wide.jpg'), x: 0, y: 0, w: pt(960), h: pt(320), altText: 'Ein einzelnes Haus am Horizont hinter einem Rapsfeld im Tümlauer Koog, weiter Himmel' });
  s.addText([{ text: 'Nah bleiben, ', options: { bold: false } }, { text: 'anders erreichbar', options: { bold: true } }], { placeholder: 'title' });
  text(s, SUB, 48, 420, span(10), 20, { fontFace: 'Arial', fontSize: 14, color: C_LIGHT });
  text(s, CREDIT('Matthias Süßen'), 48, 500, 400, 12, { fontFace: 'Arial', fontSize: 8, color: C_LIGHT });

  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText([{ text: '14 Filialen ', options: { bold: true } }, { text: 'haben weniger als 40 Schalterkunden am Tag', options: { bold: false } }], { placeholder: 'title' });
  text(s, MEASURE, 48, 124, 864, 18, { fontFace: 'Arial', fontSize: 12, color: '595959' });
  freqChart(pres, s, col(1), 164, span(8), 288, C_GREY, C_GREEN, 'Arial');
  s.addShape('line', { x: pt(col(9)), y: pt(172), w: 0, h: pt(260), line: { color: C_GREEN, width: 1.5 } });
  text(s, RAIL.map((t, i) => ({ text: t, options: { breakLine: i < RAIL.length - 1 } })), col(9) + 20, 172, span(4) - 20, 270,
    { fontFace: 'Arial', fontSize: 14, color: C_INK, paraSpaceAfter: 14 });
  text(s, SOURCE, 48, 474, 700, 12, { fontFace: 'Arial', fontSize: 8, color: '595959' });
});
