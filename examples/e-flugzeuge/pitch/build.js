// Deck "pitch": Voltair, Seed-Runde, image-led version. Executes pitch/plan.md.
// A small aircraft advances along a progress track from slide 3 to slide 8 (assets/pitch-mark.png).
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source, ground, plate } = require('../lib');

const C = { bg: 'FFFFFF', ink: '20242B', ink2: '5B6470', accent: 'B0175F', neutral: '7A808A', rule: 'D3D6DB' };
const F = 'Calibri';
const S = { titleSlide: 44, title: 32, body: 20, label: 14, foot: 10 };
const A = (n) => path.join(__dirname, '..', 'assets', `pitch-${n}.png`);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Voltair, Seed-Runde (Beispieldaten)';

const common = { font: F, bg: C.bg, titleSize: S.title, titleBold: true, titleColor: C.ink, title: [48, 48, 864, 40], number: { size: S.foot, color: C.ink2 } };
master(pres, 'title', { ...common, titleSize: S.titleSlide, title: [48, 160, 480, 160], number: null });
master(pres, 'text', { ...common, number: null });
for (const n of ['table', 'chart']) master(pres, n, common);

const src = (s, t) => source(s, 'Quelle: ' + t + ' (erfundene Daten)', { font: F, size: S.foot, color: C.ink2, w: 336, h: 16 });
const body = (s, lines, x, y, w, h, fill) => s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1, paraSpaceAfter: 16 } })),
  { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: S.body, color: C.ink, align: 'left', valign: 'top', margin: 0, isTextBox: true, fill: fill ? { color: C.bg } : undefined });
const chartBase = { catAxisLabelFontFace: F, valAxisLabelFontFace: F, dataLabelFontFace: F, catAxisLabelFontSize: S.label, valAxisLabelFontSize: S.label,
  dataLabelFontSize: S.label, catAxisLabelColor: C.ink, valAxisLabelColor: C.ink, dataLabelColor: C.ink, showLegend: false, valAxisHidden: true,
  catGridLine: { style: 'none' }, valGridLine: { style: 'none' }, showValue: true, dataLabelPosition: 'outEnd' };
const line = (strong) => [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: strong ? 1 : 0.75, color: strong ? C.ink : C.rule }, { type: 'none' }];
const cell = (t, o = {}) => ({ text: t, options: { fontFace: F, fontSize: S.body, color: C.ink, align: o.right ? 'right' : 'left', bold: !!o.bold, valign: 'middle', border: line(o.strong), margin: [0, 0.11, 0, 0], fill: { color: C.bg } } });
const rows = (data, rightFrom = 99) => data.map((r, i) => r.map((t, j) => cell(t, { right: j >= rightFrom, bold: i === 0, strong: i === 0 })));
// progress track: dotted line under the left text column, the aircraft sits further right on every slide
const track = (s, i, n) => {
  s.addShape(pres.shapes.LINE, { x: pt(48), y: pt(424), w: pt(296), h: 0, line: { color: C.rule, width: 2, dashType: 'dash' } });
  s.addImage({ path: A('mark'), x: pt(48 + (296 - 40) * i / (n - 1)), y: pt(404), w: pt(40), h: pt(40), altText: 'Kleines Flugzeug auf einer Fortschrittsleiste: je weiter rechts, desto weiter ist der Vortrag.' });
};

// 1
let s = pres.addSlide({ masterName: 'title' });
ground(s, A('title'), 'Illustration: Elektroflugzeug in Magenta in der Draufsicht über hellgrauen Ringen');
plate(s, pres, 48, 160, 480, 160, C.bg);
s.addText('Voltair: Elektroflug für Regionalstrecken', { placeholder: 'title' });
s.addText('Seed-Runde, Beispieldaten', { x: pt(48), y: pt(336), w: pt(480), h: pt(32), fontFace: F, fontSize: S.body, color: C.ink2, align: 'left', valign: 'top', margin: 0, isTextBox: true, fill: { color: C.bg } });

// 2 problem
s = pres.addSlide({ masterName: 'text' });
ground(s, A('problem'), 'Illustration: Turboprop-Flugzeug in Grau mit Schallwellen und einer Abgasfahne nach rechts');
plate(s, pres, 48, 48, 864, 40, C.bg);
s.addText('Regionalflüge sind teuer, laut und klimaschädlich', { placeholder: 'title' });
body(s, ['Ein Sitzkilometer kostet heute 14,2 ct.', 'Der Startlärm liegt bei 82 dB.', 'Jeder Passagier verursacht 112 g CO₂ je Kilometer.'], 48, 144, 456, 160, true);

// 3 solution: text left, datasheet right
s = pres.addSlide({ masterName: 'table' });
s.addText('Ein 19-Sitzer, der 320 Kilometer elektrisch fliegt', { placeholder: 'title' });
body(s, ['Er ersetzt den Turboprop auf Strecken bis 320 km.', 'Geladen wird in 40 Minuten.'], 48, 128, 296, 120);
s.addTable(rows([['Voltair EV-19', ''], ['Sitzplätze', '19'], ['Reichweite', '320 km'], ['Ladezeit', '40 min'], ['Startlärm', '67 dB'], ['Kosten je Sitzkilometer', '11,1 ct']], 1),
  { x: pt(384), y: pt(128), w: pt(528), colW: [pt(336), pt(192)], rowH: pt(32) });
track(s, 0, 6);
src(s, 'Herstellerdaten Voltair, 2026');

// 4 proof
s = pres.addSlide({ masterName: 'chart' });
s.addText('Der Prototyp flog 2026 erstmals 212 Kilometer', { placeholder: 'title' });
body(s, ['Acht Testflüge, kein Ausfall.', 'Ziel: 320 km bis Ende 2027.'], 48, 128, 296, 72);
s.addChart(pres.charts.BAR, [{ name: 'Distanz in km', labels: ['1', '2', '3', '4', '5', '6', '7', '8'], values: [18, 35, 60, 92, 130, 165, 190, 212] }],
  { ...chartBase, x: pt(384), y: pt(120), w: pt(528), h: pt(240), barDir: 'col', barGapWidthPct: 50, chartColors: [C.neutral, C.neutral, C.neutral, C.neutral, C.neutral, C.neutral, C.neutral, C.accent],
    showCatAxisTitle: true, catAxisTitle: 'Testflug', catAxisTitleFontFace: F, catAxisTitleFontSize: S.label, catAxisTitleColor: C.ink,
    altText: 'Flugdistanz der acht Testflüge in km: 18, 35, 60, 92, 130, 165, 190 und 212. Der letzte Flug ist hervorgehoben.' });
track(s, 1, 6);
src(s, 'Flugtestprotokolle Voltair, 2026');

// 5 market
s = pres.addSlide({ masterName: 'chart' });
s.addText('Vierzig Prozent der Regionalflüge sind erreichbar', { placeholder: 'title' });
body(s, ['8,4 von 21 Mrd. € sind 40 %.', 'Bis 2032 erreichbar: 1,1 Mrd. €.'], 48, 128, 296, 72);
s.addChart(pres.charts.BAR, [{ name: 'Marktvolumen in Mrd. €', labels: ['Regionalflüge Europa', 'davon unter 320 km', 'erreichbar bis 2032'], values: [21, 8.4, 1.1] }],
  { ...chartBase, x: pt(384), y: pt(120), w: pt(528), h: pt(232), barDir: 'bar', barGapWidthPct: 50, chartColors: [C.neutral, C.neutral, C.accent], dataLabelFormatCode: '0.0',
    catAxisOrientation: 'maxMin', altText: 'Marktvolumen in Mrd. Euro: Regionalflüge Europa 21, davon unter 320 km 8,4, erreichbar bis 2032: 1,1. Der erreichbare Teil ist hervorgehoben.' });
track(s, 2, 6);
src(s, 'Marktmodell Voltair, 2026');

// 6 model
s = pres.addSlide({ masterName: 'table' });
s.addText('Wir verkaufen Flugzeuge und Wartung im Abo', { placeholder: 'title' });
body(s, ['Der Verkauf bringt 62 % vom Umsatz.', 'Die Wartung bringt 41 % Marge.'], 48, 128, 296, 120);
s.addTable(rows([['Erlösquelle', 'Anteil 2032', 'Marge'], ['Flugzeugverkauf', '62 %', '18 %'], ['Wartungsabo', '28 %', '41 %'], ['Ladeinfrastruktur', '10 %', '25 %']], 1),
  { x: pt(384), y: pt(128), w: pt(528), colW: [pt(232), pt(156), pt(140)], rowH: pt(40) });
track(s, 3, 6);
src(s, 'Geschäftsplan Voltair, 2026');

// 7 team
s = pres.addSlide({ masterName: 'table' });
s.addText('Ein Team aus Zulassung, Antrieb und Airline-Betrieb', { placeholder: 'title' });
s.addTable(rows([['Name', 'Aufgabe', 'Zuvor'], ['Mara Keller', 'Geschäftsführung', 'Flugzeugbau'], ['Jonas Weber', 'Antrieb', 'Batterieentwicklung'], ['Selin Aydin', 'Zulassung', 'Luftfahrtbehörde']]),
  { x: pt(48), y: pt(128), w: pt(864), colW: [pt(288), pt(288), pt(288)], rowH: pt(40) });
track(s, 4, 6);
src(s, 'Unternehmensangaben Voltair, 2026');

// 8 ask
s = pres.addSlide({ masterName: 'chart' });
s.addText('Wir suchen 18 Millionen Euro für die Zulassung', { placeholder: 'title' });
body(s, ['Zugelassen bis 2029, danach Serienstart.'], 48, 128, 296, 56);
s.addChart(pres.charts.BAR, [{ name: 'Mittelverwendung in Mio. €', labels: ['Zulassung', 'Serienvorbereitung', 'Team'], values: [8, 6, 4] }],
  { ...chartBase, x: pt(384), y: pt(120), w: pt(528), h: pt(232), barDir: 'bar', barGapWidthPct: 50, chartColors: [C.accent, C.neutral, C.neutral], dataLabelFormatCode: '0', catAxisOrientation: 'maxMin',
    altText: 'Mittelverwendung in Mio. Euro: Zulassung 8, Serienvorbereitung 6, Team 4. Die Zulassung ist hervorgehoben.' });
track(s, 5, 6);
src(s, 'Finanzplan Voltair, 2026');

pres.writeFile({ fileName: path.join(__dirname, 'deck.pptx') }).then(() => console.log('written'));
