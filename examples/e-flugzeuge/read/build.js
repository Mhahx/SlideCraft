// Deck "read": Entscheidungsvorlage E-Regionalflugzeuge, image-led version. Executes read/plan.md.
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source, ground, plate } = require('../lib');

const C = { bg: 'FFFFFF', ink: '1B2733', ink2: '4A5866', accent: 'C2410C', neutral: '7B8794', rule: 'D0D5DB' };
const F = 'Arial';
const S = { titleSlide: 40, title: 28, body: 18, label: 14, foot: 10 };
const A = (n) => path.join(__dirname, '..', 'assets', `read-${n}.png`);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'E-Regionalflugzeuge, Entscheidungsvorlage (Beispieldaten)';

const common = { font: F, bg: C.bg, titleSize: S.title, titleBold: true, titleColor: C.ink, title: [48, 48, 864, 40], number: { size: S.foot, color: C.ink2 } };
master(pres, 'title', { ...common, titleSize: S.titleSlide, title: [48, 160, 480, 160], number: null });
for (const n of ['chart', 'table', 'map', 'timeline']) master(pres, n, common);

const src = (s, t) => source(s, 'Quelle: ' + t + ' (erfundene Daten)', { font: F, size: S.foot, color: C.ink2 });
const txt = (s, o) => s.addText(o.t, { x: pt(o.x), y: pt(o.y), w: pt(o.w), h: pt(o.h), fontFace: F, fontSize: o.size || S.body, color: o.color || C.ink, bold: !!o.bold, align: 'left', valign: 'top', margin: 0, isTextBox: true, fill: o.fill });
const body = (s, lines, x, y, w, h) => s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1, paraSpaceAfter: 16 } })),
  { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: S.body, color: C.ink, align: 'left', valign: 'top', margin: 0, isTextBox: true });
const chartBase = { catAxisLabelFontFace: F, valAxisLabelFontFace: F, dataLabelFontFace: F, catAxisLabelFontSize: S.label, valAxisLabelFontSize: S.label,
  dataLabelFontSize: S.label, catAxisLabelColor: C.ink, valAxisLabelColor: C.ink, dataLabelColor: C.ink, showLegend: false,
  catGridLine: { style: 'none' }, valGridLine: { style: 'none' } };
const line = (strong) => [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: strong ? 1 : 0.75, color: strong ? C.ink : C.rule }, { type: 'none' }];
const cell = (t, o = {}) => ({ text: t, options: { fontFace: F, fontSize: S.label, color: C.ink, align: o.right ? 'right' : 'left', bold: !!o.bold, valign: 'middle', border: line(o.strong), margin: [0, 0.11, 0, 0] } });
const rows = (data, boldLast) => data.map((r, i) => r.map((t, j) => cell(t, { right: j > 0, bold: i === 0 || (boldLast && i === data.length - 1), strong: i === 0 })));

// 1 title
let s = pres.addSlide({ masterName: 'title' });
ground(s, A('title'), 'Illustration: Elektroflugzeug in der Draufsicht, orange, über hellgrauen Reichweitenringen');
plate(s, pres, 48, 160, 480, 160, C.bg);
s.addText('E-Regionalflugzeuge: Entscheidungsvorlage für den Vorstand', { placeholder: 'title' });
txt(s, { t: 'Beispieldaten: alle Zahlen sind erfunden', x: 48, y: 336, w: 480, h: 24, color: C.ink2, fill: { color: C.bg } });

// 2 network map
s = pres.addSlide({ masterName: 'map' });
s.addText('14 von 30 Strecken liegen innerhalb von 320 Kilometern', { placeholder: 'title' });
s.addImage({ path: A('map'), x: pt(48), y: pt(120), w: pt(427), h: pt(320), altText: 'Streckenkarte des Beispielnetzes: 30 Strecken vom Drehkreuz, 14 orange innerhalb des Rings von 320 Kilometern, 16 grau außerhalb.' });
body(s, ['14 Strecken (47 %) sind elektrisch erreichbar.', 'Sie tragen 38 % der Passagiere.', 'Die übrigen 16 bleiben beim Turboprop.'], 528, 128, 384, 144);
const key = (y, drawer, label) => { drawer(y); txt(s, { t: label, x: 560, y, w: 352, h: 20, size: S.label }); };
key(352, (y) => s.addShape(pres.shapes.OVAL, { x: pt(528), y: pt(y + 3), w: pt(14), h: pt(14), fill: { color: C.accent }, line: { type: 'none' } }), 'Strecke innerhalb von 320 km');
key(384, (y) => s.addShape(pres.shapes.OVAL, { x: pt(528), y: pt(y + 3), w: pt(14), h: pt(14), fill: { type: 'none' }, line: { color: C.neutral, width: 1.5 } }), 'Strecke darüber');
key(416, (y) => s.addShape(pres.shapes.OVAL, { x: pt(528), y: pt(y + 3), w: pt(14), h: pt(14), fill: { type: 'none' }, line: { color: C.accent, width: 1.5 } }), 'Ring: 320 km Reichweite');
src(s, 'Streckennetz der Beispielairline, Stand 2026');

// 3 cost
s = pres.addSlide({ masterName: 'table' });
s.addText('Mit E-Flugzeug wird der Sitzkilometer 22 % günstiger', { placeholder: 'title' });
s.addTable(rows([['ct je Sitzkilometer', 'Turboprop', 'E-Flugzeug'], ['Energie', '4,6', '1,9'], ['Wartung', '3,1', '1,9'], ['Kapital', '3,0', '3,8'], ['Personal', '3,5', '3,5'], ['Summe', '14,2', '11,1']], true),
  { x: pt(48), y: pt(120), w: pt(432), colW: [pt(192), pt(120), pt(120)], rowH: pt(40) });
s.addChart(pres.charts.BAR, [{ name: 'ct je Sitzkilometer', labels: ['Turboprop', 'E-Flugzeug'], values: [14.2, 11.1] }],
  { ...chartBase, x: pt(528), y: pt(120), w: pt(384), h: pt(160), barDir: 'bar', barGapWidthPct: 40, chartColors: [C.neutral, C.accent], showValue: true, valAxisHidden: true, dataLabelPosition: 'outEnd',
    dataLabelFormatCode: '0.0', catAxisOrientation: 'maxMin', valAxisMinVal: 0, valAxisMaxVal: 18, altText: 'Kosten je Sitzkilometer in Cent: Turboprop 14,2, E-Flugzeug 11,1.' });
body(s, ['Energie und Wartung sinken zusammen um 3,9 ct, das Kapital steigt um 0,8 ct.'], 528, 304, 384, 72);
src(s, 'Kostenmodell Flottenplanung, Annahmen 2026');

// 4 limits, datasheet style
s = pres.addSlide({ masterName: 'table' });
s.addText('320 Kilometer Reichweite bleiben die harte Grenze', { placeholder: 'title' });
s.addTable(rows([['Merkmal', 'Turboprop', 'E-Flugzeug'], ['Sitzplätze', '19', '19'], ['Reichweite', '900 km', '320 km'], ['Lade- oder Tankzeit', '20 min', '40 min'], ['Startlärm', '82 dB', '67 dB']], false),
  { x: pt(48), y: pt(120), w: pt(456), colW: [pt(216), pt(120), pt(120)], rowH: pt(40) });
s.addImage({ path: A('plane'), x: pt(578), y: pt(104), w: pt(322), h: pt(336), altText: 'Technische Zeichnung des E-Flugzeugs Modell EV-19 in der Draufsicht mit vier Propellern und einer Maßlinie unter der Spannweite.' });
body(s, ['45 Minuten Reserve sind eingerechnet.', 'Jeder Zielflughafen braucht einen Schnelllader.'], 48, 344, 456, 96);
src(s, 'Herstellerangaben Modell EV-19, Vorabversion 2026');

// 5 payback
s = pres.addSlide({ masterName: 'chart' });
s.addText('Die 137 Mio. € Investition amortisieren sich bis 2033', { placeholder: 'title' });
s.addChart(pres.charts.LINE, [{ name: 'Kumulierter Saldo in Mio. €', labels: ['2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'], values: [-45, -98, -137, -118, -89, -49, 3, 52, 104] }],
  { ...chartBase, x: pt(48), y: pt(120), w: pt(624), h: pt(320), chartColors: [C.accent], lineSize: 4, lineDataSymbol: 'none', valAxisLabelFormatCode: '0',
    valGridLine: { color: C.rule, size: 0.75 }, showValAxisTitle: true, valAxisTitle: 'Mio. €', valAxisTitleFontFace: F, valAxisTitleFontSize: S.label, valAxisTitleColor: C.ink,
    altText: 'Kumulierter Saldo in Mio. Euro von 2027 bis 2035: Tiefpunkt minus 137 im Jahr 2029, Nulldurchgang 2033, plus 104 im Jahr 2035.' });
body(s, ['Investition: 14 × 9,8 Mio. €.', 'Tiefpunkt 2029 bei −137 Mio. €.', 'Annahme: 74 % Auslastung.'], 720, 128, 192, 176);
src(s, 'Investitionsplanung, Annahmen 2026');

// 6 timeline and decision
s = pres.addSlide({ masterName: 'timeline' });
s.addText('Wir empfehlen einen Pilotbetrieb mit vier Flugzeugen', { placeholder: 'title' });
s.addShape(pres.shapes.LINE, { x: pt(48), y: pt(160), w: pt(864), h: 0, line: { color: C.ink, width: 1.5 } });
const steps = [['Q1 2027', 'Bestellung von 4 Flugzeugen', '39,2 Mio. €'], ['Q3 2027', 'Ladeinfrastruktur an 2 Flughäfen', '6,0 Mio. €'], ['ab Q2 2028', 'Pilotbetrieb auf 3 Strecken', '4,0 Mio. €'], ['Q4 2029', 'Entscheidung über Serienausbau', 'offen']];
steps.forEach(([d, t, b], i) => {
  const x = 48 + i * 224;   // last step ends at 912
  s.addShape(pres.shapes.OVAL, { x: pt(x), y: pt(152), w: pt(16), h: pt(16), fill: { color: C.accent }, line: { type: 'none' } });
  s.addText([{ text: d, options: { bold: true, breakLine: true } }, { text: t, options: { breakLine: true } }, { text: b, options: {} }],
    { x: pt(x), y: pt(184), w: pt(192), h: pt(96), fontFace: F, fontSize: S.label, color: C.ink, align: 'left', valign: 'top', margin: 0, paraSpaceAfter: 4, isTextBox: true });
});
s.addText('Beschluss erbeten: Freigabe von 49,2 Mio. € für den Pilotbetrieb.', { x: pt(48), y: pt(336), w: pt(864), h: pt(96), fontFace: F, fontSize: S.body, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle', margin: [24, 24, 0, 0], isTextBox: true, fill: { color: C.accent } });   // text box margin order is [left, right, bottom, top] in pt (table cells: [top, right, bottom, left] in inches)
src(s, 'Investitionsplanung, Annahmen 2026');

pres.writeFile({ fileName: path.join(__dirname, 'deck.pptx') }).then(() => console.log('written'));
