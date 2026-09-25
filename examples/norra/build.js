// Norra Series-A pitch (fictional company), built from plan.md. Direction "Glas": mix of drafts A, B, C with Liquid Glass.
// Usage: NODE_PATH=<dir with node_modules/pptxgenjs> node examples/norra/build.js (light images: python3 examples/norra/assets/light.py)
const pptxgen = require('pptxgenjs');
const path = require('path');
const DIR = __dirname;
const pt = (v) => v / 72;
const col = (c) => 48 + (c - 1) * (57.333 + 16);
const span = (n) => n * 57.333 + (n - 1) * 16;
const IMG = (f) => path.join(DIR, 'assets', f + '.png');
const G = { bg: 'F5F9FC', ink: '0A2A4A', grey2: '46607A', glassLabel: '2F4760', bar: '7A8A9A', blue: '125EA8', rule: 'A9BED2', ph: 'EAF2F8' };
const F = 'Arial';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Norra Series-A-Pitch (fiktiv, Beispieldaten)';
const NUM = { x: pt(872), y: pt(496), w: pt(40), h: pt(16), fontFace: F, fontSize: 9, color: G.grey2, align: 'right' };
pres.defineSlideMaster({ title: 'P01 cover', background: { color: G.bg }, objects: [
  { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(136), w: pt(span(6)), h: pt(200), fontFace: F, fontSize: 44,
    color: G.ink, align: 'left', valign: 'bottom', margin: 0 }, text: '' } }] });
for (const name of ['P04 chart-rail', 'P07 table', 'P08 bridge', 'P09 before-after', 'P10 numbered-rows', 'P11 timeline', 'P12 case']) {
  pres.defineSlideMaster({ title: name, background: { color: G.bg }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(56), w: pt(864), h: pt(84), fontFace: F, fontSize: 34, bold: true,
      color: G.ink, align: 'left', valign: 'top', margin: 0 }, text: '' } }], slideNumber: NUM });
}

// ---------------------------------------------------------------- helpers
function text(s, t, x, y, w, h, o) {
  s.addText(t, Object.assign({ x: pt(x), y: pt(y), w: pt(w), h: pt(h), align: 'left', valign: 'top', margin: 0, isTextBox: true,
    fontFace: F, fontSize: 20, color: G.ink }, o));
}
// Liquid Glass: soft light behind, one translucent rounded panel in front
function glass(s, x, y, w, h, light, pad = 32) {
  s.addImage({ path: IMG(light), x: pt(x - pad), y: pt(y - pad), w: pt(w + 2 * pad), h: pt(h + 2 * pad), altText: 'Dekoratives hellblaues Licht hinter der Glasfläche' });
  s.addShape('roundRect', { x: pt(x), y: pt(y), w: pt(w), h: pt(h), rectRadius: pt(24),
    fill: { color: 'FFFFFF', transparency: 30 }, line: { color: 'FFFFFF', width: 1.5 },
    shadow: { type: 'outer', color: G.ink, opacity: 0.12, blur: 24, offset: 6, angle: 90 } });
}
function slide(master, title) {
  const s = pres.addSlide({ masterName: master });
  s.addText(title, { placeholder: 'title' });
  return s;
}
const measure = (s, t, x = 48, w = 600) => text(s, t, x, 148, w, 20, { fontSize: 15, color: G.grey2 });
const source = (s, t) => text(s, t, 48, 472, 700, 12, { fontSize: 9, color: G.grey2 });
function rail(s, t, y = 184, h = 136) {
  glass(s, col(9), y, span(4), h, 'light-rail');
  text(s, t, col(9) + 24, y + 24, span(4) - 48, h - 48, { fontSize: 20 });
}
function chart(s, type, cats, vals, focus, o) {
  s.addChart(type === 'bar' ? pres.charts.BAR : pres.charts.BAR, [{ name: o.name, labels: cats, values: vals }], Object.assign({
    x: pt(col(1)), y: pt(184), w: pt(span(8)), h: pt(264), barDir: type, barGapWidthPct: 45,
    chartColors: vals.map((_, i) => (i === focus ? G.blue : G.bar)), valAxisHidden: true, valGridLine: { style: 'none' },
    catAxisLineShow: type === 'col', catAxisLineColor: G.rule, catAxisLabelFontFace: F, catAxisLabelFontSize: 15, catAxisLabelColor: G.ink,
    showValue: true, dataLabelFontFace: F, dataLabelFontSize: 15, dataLabelColor: G.ink, dataLabelPosition: 'outEnd', showLegend: false,
  }, type === 'bar' ? { catAxisOrientation: 'maxMin' } : {}, o.extra || {}, { altText: o.alt }));
}

// ---------------------------------------------------------------- 1 cover
let s = pres.addSlide({ masterName: 'P01 cover' });
s.addImage({ path: IMG('light-cover'), x: pt(480), y: 0, w: pt(480), h: pt(540), altText: 'Dekoratives hellblaues Licht hinter der Glasfläche' });
s.addText([{ text: 'Norra: Wasserstoff tanken', options: { bold: true } }, { text: ' ohne Wasserstofftankstelle', options: { bold: false } }], { placeholder: 'title' });
text(s, 'Series-A-Pitch · Investorengespräch 2026 · alle Zahlen Beispieldaten', 48, 352, span(6), 40, { fontSize: 15, color: G.grey2 });
s.addShape('roundRect', { x: pt(col(8) + 16), y: pt(120), w: pt(span(4) + 32), h: pt(300), rectRadius: pt(24),
  fill: { color: 'FFFFFF', transparency: 30 }, line: { color: 'FFFFFF', width: 1.5 },
  shadow: { type: 'outer', color: G.ink, opacity: 0.12, blur: 24, offset: 6, angle: 90 } });
[['Reichweite', '600 km'], ['Nachladen', '90 Sekunden'], ['Kapseln', '2 × 3 kg Wasserstoff'], ['Preis', 'ab 39.900 €']].forEach(([k, v], i) => {
  const x = col(8) + 48, w = span(4) - 32, y = 144 + i * 64;
  if (i) s.addShape('line', { x: pt(x), y: pt(y - 8), w: pt(w), h: 0, line: { color: G.rule, width: 0.75 } });
  text(s, k, x, y, w, 16, { fontSize: 12, color: G.glassLabel });
  text(s, v, x, y + 18, w, 26, { bold: true });
});

// ---------------------------------------------------------------- 2 problem
s = slide('P04 chart-rail', 'Wasserstoffautos scheitern an fehlenden Tankstellen');
measure(s, 'Tankstellen in Deutschland 2026, Anzahl');
chart(s, 'bar', ['Benzin und Diesel', 'Schnellladeparks', 'Wasserstoff'], [14000, 5000, 80], 2,
  { name: 'Tankstellen', extra: { dataLabelFormatCode: '#,##0' },
    alt: 'Balken: Tankstellen in Deutschland 2026. Benzin und Diesel 14.000, Schnellladeparks 5.000, Wasserstoff 80 (Beispieldaten)' });
rail(s, 'Wer Wasserstoff fährt, plant jede Fahrt um die Säule.');
source(s, 'Quelle: Norra-Recherche 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 3 before-after
s = slide('P09 before-after', 'Norra tankt aus Wechselkapseln statt an der Säule');
const today = ['Tanken an 80 Säulen', '5 Minuten plus Umweg', 'Preis ab 70.000 €'];
const norra = ['Tauschen in 2.000 Märkten', '90 Sekunden, kein Umweg', 'Preis ab 39.900 €'];
text(s, 'Heute: Wasserstoffauto', col(1), 192, span(5), 26, { bold: true });
glass(s, col(7) - 24, 168, span(6) + 24, 232, 'light-mid');
text(s, 'Mit Norra', col(7), 192, span(6) - 24, 26, { bold: true });
[today, norra].forEach((rows, k) => {
  const x = k ? col(7) : col(1), w = k ? span(6) - 24 : span(5);
  rows.forEach((r, i) => {
    const y = 240 + i * 48;
    s.addShape('line', { x: pt(x), y: pt(y), w: pt(w), h: 0, line: { color: G.rule, width: 0.75 } });
    text(s, r, x, y + 12, w, 26, {});
  });
});
source(s, 'Quelle: Norra 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 4 product
s = slide('P12 case', 'Zwei Kapseln reichen für 600 km');
s.addShape('roundRect', { x: pt(col(1)), y: pt(168), w: pt(span(7)), h: pt(280), rectRadius: pt(24), fill: { color: G.ph },
  line: { color: G.rule, width: 1, dashType: 'dash' } });
text(s, '[Produktbild: Norra mit Kapsel einfügen]', col(1), 296, span(7), 24, { fontSize: 15, color: G.grey2, align: 'center' });
glass(s, col(9), 168, span(4), 280, 'light-tall');
[['300 km', 'Reichweite je Kapsel'], ['3 kg', 'Wasserstoff je Kapsel'], ['90 s', 'Wechsel beider Kapseln']].forEach(([v, k], i) => {
  const y = 192 + i * 80;
  text(s, v, col(9) + 24, y, span(4) - 48, 32, { fontSize: 26, bold: true });
  text(s, k, col(9) + 24, y + 34, span(4) - 48, 16, { fontSize: 12, color: G.glassLabel });
});
source(s, 'Quelle: Norra-Entwicklung 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 5 key slide
s = slide('P04 chart-rail', '500 km nachladen dauert 90 Sekunden statt 35 Minuten');
measure(s, 'Minuten für 500 km Reichweite');
chart(s, 'bar', ['E-Auto, Schnelllader', 'Wasserstoff, Säule', 'Benziner', 'Norra, Kapselwechsel'], [35, 5, 4, 1.5], 3,
  { name: 'Minuten', extra: { dataLabelFormatCode: '[<2]0.0;0' },
    alt: 'Balken: Minuten für 500 km Reichweite. E-Auto am Schnelllader 35, Wasserstoffauto an der Säule 5, Benziner 4, Norra mit Kapselwechsel 1,5 (Beispieldaten)' });
text(s, '23-mal schneller', 300, 404, 240, 24, { bold: true, color: G.blue });
rail(s, 'Flottenautos stehen nicht mehr am Lader.', 200);
source(s, 'Quelle: Norra-Messreihe 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 6 network
s = slide('P10 numbered-rows', 'Kapseln kommen über 2.000 Supermärkte, nicht über neue Säulen');
const steps = [['1', 'Füllen', 'Windstrom füllt Kapseln im Werk'], ['2', 'Liefern', 'Lkw bringen volle Kapseln in 2.000 Märkte'],
  ['3', 'Tauschen', 'Fahrer tauschen in 90 Sekunden']];
glass(s, col(9) - 24, 168, span(4) + 24, 216, 'light-tall');
steps.forEach(([n, h, t], i) => {
  const x = col(1 + i * 4), w = span(4) - 24;
  if (i < 2) s.addShape('line', { x: pt(x), y: pt(184), w: pt(w), h: 0, line: { color: G.rule, width: 0.75 } });
  text(s, n, x, 200, w, 32, { fontSize: 26, bold: true, color: G.blue });
  text(s, h, x, 248, w, 26, { bold: true });
  text(s, t, x, 280, w, 60, {});
});
source(s, 'Quelle: Norra 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 7 market
s = slide('P04 chart-rail', 'Europas Flotten kaufen 2031 1,5 Mio. emissionsfreie Autos');
measure(s, 'Neuzulassungen emissionsfreier Flottenautos in Europa, Mio.');
chart(s, 'col', ['2027', '2028', '2029', '2030', '2031'], [0.6, 0.7, 0.9, 1.2, 1.5], 4,
  { name: 'Mio. Autos', extra: { dataLabelFormatCode: '0.0' },
    alt: 'Säulen: Neuzulassungen emissionsfreier Flottenautos in Europa, 2027 0,6 Mio. bis 2031 1,5 Mio. (Beispieldaten)' });
rail(s, '40.000 Norra-Autos wären knapp 3 % davon.');
source(s, 'Quelle: Norra-Marktmodell 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 8 competition
s = slide('P07 table', 'Nur Norra verbindet schnelles Tanken mit dichtem Netz');
const tx = 48, ty = 184, head = 40, rh = 56;
glass(s, tx, ty + head + 2 * rh - 4, 864, rh + 8, 'light-wide', 24);
const hdr = (t) => ({ text: t, options: { fontSize: 15, color: G.grey2 } });
const cell = (t, b) => ({ text: t, options: { bold: !!b } });
const rows = [
  [hdr(''), hdr('Nachladen für 500 km'), hdr('Netz in Deutschland'), hdr('Preis ab')],
  [cell('E-Auto', 1), cell('35 Minuten'), cell('5.000 Ladeparks'), cell('35.000 €')],
  [cell('Wasserstoffauto', 1), cell('5 Minuten plus Umweg'), cell('80 Säulen'), cell('70.000 €')],
  [cell('Norra', 1), cell('90 Sekunden', 1), cell('2.000 Märkte', 1), cell('39.900 €', 1)],
];
s.addTable(rows, { x: pt(tx), y: pt(ty), w: pt(864), colW: [pt(216), pt(240), pt(240), pt(168)], rowH: [pt(head), pt(rh), pt(rh), pt(rh)],
  fontFace: F, fontSize: 20, color: G.ink, valign: 'middle', margin: [0, 0, 0, pt(16)], fill: { type: 'none' },
  border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: G.rule }, { type: 'none' }] });
source(s, 'Quelle: Norra-Recherche 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 9 bridge (from shapes: pptxgenjs has no waterfall)
s = slide('P08 bridge', 'Jedes Auto bringt über acht Jahre 50.000 € Umsatz');
measure(s, 'Umsatz je Auto über acht Jahre, €');
const base = 432, scale = 224 / 50000, bw = 96;
const parts = [['Auto (netto)', 33500], ['Kapseln', 14000], ['Service', 2500]];
let run = 0;
parts.forEach(([k, v], i) => {
  const x = col(1) + 32 + i * 144, top = base - (run + v) * scale;
  s.addShape('rect', { x: pt(x), y: pt(top), w: pt(bw), h: pt(v * scale), fill: { color: G.bar }, line: { type: 'none' } });
  text(s, v.toLocaleString('de-DE') + ' €', x - 24, top - 24, bw + 48, 18, { fontSize: 15, align: 'center' });
  text(s, k, x - 24, base + 8, bw + 48, 18, { fontSize: 15, align: 'center' });
  run += v;
  s.addShape('line', { x: pt(x + bw), y: pt(base - run * scale), w: pt(48), h: 0, line: { color: G.rule, width: 0.75, dashType: 'dash' } });
});
const tx2 = col(1) + 32 + 3 * 144;
s.addShape('rect', { x: pt(tx2), y: pt(base - 50000 * scale), w: pt(bw), h: pt(50000 * scale), fill: { color: G.blue }, line: { type: 'none' } });
text(s, '50.000 €', tx2 - 24, base - 50000 * scale - 24, bw + 48, 18, { fontSize: 15, align: 'center' });
text(s, 'Summe', tx2 - 24, base + 8, bw + 48, 18, { fontSize: 15, align: 'center' });
s.addShape('line', { x: pt(col(1)), y: pt(base), w: pt(span(8)), h: 0, line: { color: G.rule, width: 0.75 } });
rail(s, 'Kapseln und Service bringen ein Drittel des Umsatzes.');
source(s, 'Quelle: Norra-Businessplan 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 10 traction
s = slide('P04 chart-rail', 'Flottenkunden haben in sechs Monaten 450 Autos vorbestellt');
measure(s, 'Vorbestellte Autos, kumuliert, 2026');
chart(s, 'col', ['Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep'], [30, 70, 130, 210, 320, 450], 5,
  { name: 'Vorbestellungen', extra: { dataLabelFormatCode: '0' },
    alt: 'Säulen: vorbestellte Autos kumuliert, April 30 bis September 450 (Beispieldaten)' });
rail(s, 'Darunter zwei Taxiflotten und ein Lieferdienst.');
source(s, 'Quelle: Norra-Vertrieb 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 11 roadmap
s = slide('P11 timeline', 'Serienstart 2029, erst Flotten, dann Privatkunden');
const ms = [['2026', 'Series A'], ['2027', '200 Prototypen'], ['2028', 'Erstes Kapselwerk'], ['2029', 'Serienstart für Flotten'], ['2031', 'Privatkunden, Break-even']];
const lineY = 272, step = 176;
glass(s, 48 + 3 * step - 16, 208, 176, 176, 'light-mid', 24);
s.addShape('line', { x: pt(48), y: pt(lineY), w: pt(864), h: 0, line: { color: G.rule, width: 1.5 } });
ms.forEach(([y, t], i) => {
  const x = 48 + i * step, focus = i === 3;
  s.addShape('ellipse', { x: pt(x), y: pt(lineY - 6), w: pt(12), h: pt(12), fill: { color: focus ? G.blue : G.bar }, line: { type: 'none' } });
  text(s, y, x, 224, 144, 26, { bold: true, color: focus ? G.blue : G.ink });
  text(s, t, x, 296, 144, 60, {});
});
source(s, 'Quelle: Norra-Plan 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 12 team
s = slide('P12 case', 'Drei Gründer bringen Brennstoffzelle, Fahrzeugbau und Handel zusammen');
[['CEO', '10 Jahre Einzelhandel'], ['CTO', '12 Jahre Brennstoffzelle'], ['COO', '15 Jahre Fahrzeugbau']].forEach(([r, b], i) => {
  const x = col(1 + i * 4);
  s.addShape('ellipse', { x: pt(x), y: pt(176), w: pt(112), h: pt(112), fill: { color: G.ph }, line: { color: G.rule, width: 1, dashType: 'dash' } });
  text(s, '[Foto]', x, 222, 112, 20, { fontSize: 15, color: G.grey2, align: 'center' });
  text(s, '[Name]', x, 312, span(4), 26, { bold: true });
  text(s, r, x, 342, span(4), 20, { fontSize: 15, color: G.grey2 });
  text(s, b, x, 368, span(4), 26, {});
});
source(s, 'Namen, Fotos und Werdegänge: Platzhalter (Beispieldaten)');

// ---------------------------------------------------------------- 13 finance
s = slide('P04 chart-rail', 'Norra erreicht 2031 den Break-even bei 40.000 Autos');
measure(s, 'EBIT, Mio. €');
chart(s, 'col', ['2027', '2028', '2029', '2030', '2031', '2032'], [-38, -55, -40, -12, 6, 45], 4,
  { name: 'EBIT', extra: { dataLabelFormatCode: '0;−0', catAxisLabelPos: 'low', valAxisMinVal: -80, valAxisMaxVal: 60 },
    alt: 'Säulen: EBIT in Mio. €, 2027 minus 38, 2028 minus 55, 2029 minus 40, 2030 minus 12, 2031 plus 6, 2032 plus 45 (Beispieldaten)' });
rail(s, 'Umsatz 2031: 1,4 Mrd. € bei 40.000 Autos.');
source(s, 'Quelle: Norra-Businessplan 2026 (Beispieldaten)');

// ---------------------------------------------------------------- 14 ask
s = slide('P04 chart-rail', '40 Mio. € bringen 200 Prototypen auf die Straße');
measure(s, 'Mittelverwendung, Mio. €');
chart(s, 'bar', ['Prototypen', 'Kapselwerk-Pilot', 'Team', 'Reserve'], [18, 12, 6, 4], 0,
  { name: 'Mio. €', extra: { dataLabelFormatCode: '0' },
    alt: 'Balken: Mittelverwendung der 40 Mio. €. Prototypen 18, Kapselwerk-Pilot 12, Team 6, Reserve 4 (Beispieldaten)' });
glass(s, col(9), 184, span(4), 168, 'light-rail');
text(s, '40 Mio. €', col(9) + 24, 208, span(4) - 48, 52, { fontSize: 44, bold: true });
text(s, 'Series A, 24 Monate', col(9) + 24, 272, span(4) - 48, 52, {});
source(s, 'Quelle: Norra-Businessplan 2026 (Beispieldaten)');

pres.writeFile({ fileName: path.join(DIR, 'deck.pptx') }).then(() => console.log('deck.pptx written'));
