// Deck "read": Entscheidungsvorlage E-Regionalflugzeuge. Executes read/plan.md.
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source } = require('../lib');

const C = { bg: 'FFFFFF', ink: '1B2733', ink2: '4A5866', accent: 'C2410C', neutral: '7B8794', rule: 'D0D5DB' };
const F = 'Arial';
const S = { title: 28, body: 18, label: 14, foot: 10 };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'E-Regionalflugzeuge, Entscheidungsvorlage (Beispieldaten)';

const common = { font: F, bg: C.bg, titleSize: S.title, titleBold: true, titleColor: C.ink, title: [48, 48, 864, 80], number: { size: S.foot, color: C.ink2 } };
master(pres, 'title', { ...common, titleSize: 40, title: [48, 160, 768, 112] });
master(pres, 'chart', common);
master(pres, 'table', common);

const src = (s, t) => source(s, 'Quelle: ' + t + ' (erfundene Daten)', { font: F, size: S.foot, color: C.ink2 });
const body = (s, lines, x, y, w, h) => s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1, paraSpaceAfter: 16 } })),
  { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: S.body, color: C.ink, align: 'left', valign: 'top', margin: 0, isTextBox: true });
const chartBase = { catAxisLabelFontFace: F, valAxisLabelFontFace: F, dataLabelFontFace: F, catAxisLabelFontSize: S.label, valAxisLabelFontSize: S.label,
  dataLabelFontSize: S.label, catAxisLabelColor: C.ink, valAxisLabelColor: C.ink, dataLabelColor: C.ink, showLegend: false,
  catGridLine: { style: 'none' }, valGridLine: { style: 'none' } };

// 1 title
let s = pres.addSlide({ masterName: 'title' });
s.addText('E-Regionalflugzeuge: Entscheidungsvorlage für den Vorstand', { placeholder: 'title' });
s.addText('Beispieldaten: alle Zahlen sind erfunden', { x: pt(48), y: pt(296), w: pt(768), h: pt(32), fontFace: F, fontSize: S.body, color: C.ink2, align: 'left', valign: 'top', margin: 0, isTextBox: true });

// 2 network
s = pres.addSlide({ masterName: 'chart' });
s.addText('14 von 30 Strecken liegen innerhalb von 320 Kilometern', { placeholder: 'title' });
s.addChart(pres.charts.BAR, [{ name: 'Strecken', labels: ['bis 150 km', '150 bis 320 km', '320 bis 500 km', 'über 500 km'], values: [5, 9, 8, 8] }],
  { ...chartBase, x: pt(48), y: pt(144), w: pt(528), h: pt(296), barDir: 'col', chartColors: [C.accent, C.accent, C.neutral, C.neutral], showValue: true, valAxisHidden: true,
    dataLabelPosition: 'outEnd', barGapWidthPct: 60, altText: 'Anzahl der Strecken nach Entfernung: 5 bis 150 km, 9 bis 320 km, 8 bis 500 km, 8 darüber. Die ersten zwei Klassen sind hervorgehoben.' });
body(s, ['14 Strecken (47 %) sind elektrisch erreichbar.', 'Sie tragen 38 % der Passagiere.', 'Die übrigen 16 bleiben beim Turboprop.'], 624, 160, 288, 144);
src(s, 'Streckennetz der Beispielairline, Stand 2026');

// 3 cost
s = pres.addSlide({ masterName: 'table' });
s.addText('Der Sitzkilometer wird mit dem E-Flugzeug 22 % günstiger', { placeholder: 'title' });
const line = (b) => [{ type: 'none' }, { type: 'none' }, b ? { type: 'solid', pt: 1, color: C.ink } : { type: 'solid', pt: 0.75, color: C.rule }, { type: 'none' }];
const cell = (t, o = {}) => ({ text: t, options: { fontFace: F, fontSize: S.label, color: C.ink, align: o.right ? 'right' : 'left', bold: !!o.bold, valign: 'middle', border: line(o.strong), margin: [0, 0.11, 0, 0] } });   // table cell margins are inches in pptxgenjs, not pt
const rows = (data, boldLast) => data.map((r, i) => r.map((t, j) => cell(t, { right: j > 0, bold: i === 0 || (boldLast && i === data.length - 1), strong: i === 0 })));
s.addTable(rows([['ct je Sitzkilometer', 'Turboprop', 'E-Flugzeug'], ['Energie', '4,6', '1,9'], ['Wartung', '3,1', '1,9'], ['Kapital', '3,0', '3,8'], ['Personal', '3,5', '3,5'], ['Summe', '14,2', '11,1']], true),
  { x: pt(48), y: pt(144), w: pt(528), colW: [pt(288), pt(120), pt(120)], rowH: pt(40) });
body(s, ['Energie und Wartung sinken zusammen um 3,9 ct, das Kapital steigt um 0,8 ct.'], 624, 160, 288, 80);
src(s, 'Kostenmodell Flottenplanung, Annahmen 2026');

// 4 limits
s = pres.addSlide({ masterName: 'table' });
s.addText('Die Reichweite von 320 Kilometern bleibt die harte Grenze', { placeholder: 'title' });
s.addTable(rows([['Merkmal', 'Turboprop', 'E-Flugzeug'], ['Sitzplätze', '19', '19'], ['Reichweite', '900 km', '320 km'], ['Lade- oder Tankzeit', '20 min', '40 min'], ['Startlärm', '82 dB', '67 dB']], false),
  { x: pt(48), y: pt(144), w: pt(528), colW: [pt(288), pt(120), pt(120)], rowH: pt(40) });
body(s, ['45 Minuten Reserve sind eingerechnet.', 'Jeder Zielflughafen braucht einen Schnelllader.'], 624, 160, 288, 96);
src(s, 'Herstellerangaben Modell EV-19, Vorabversion 2026');

// 5 payback
s = pres.addSlide({ masterName: 'chart' });
s.addText('Bis 2033 amortisieren sich 14 Flugzeuge bei 137 Mio. € Investition', { placeholder: 'title' });
s.addChart(pres.charts.LINE, [{ name: 'Kumulierter Saldo in Mio. €', labels: ['2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'], values: [-45, -98, -137, -118, -89, -49, 3, 52, 104] }],
  { ...chartBase, x: pt(48), y: pt(144), w: pt(528), h: pt(296), chartColors: [C.accent], lineSize: 3, lineDataSymbol: 'none', valAxisLabelFormatCode: '0',
    valGridLine: { color: C.rule, size: 0.75 }, altText: 'Kumulierter Saldo in Mio. Euro von 2027 bis 2035: Tiefpunkt minus 137 im Jahr 2029, Nulldurchgang 2033, plus 104 im Jahr 2035.' });
body(s, ['Investition: 14 × 9,8 Mio. €.', 'Tiefpunkt 2029 bei −137 Mio. €.', 'Annahme: 74 % Auslastung.'], 624, 160, 288, 120);
src(s, 'Investitionsplanung, Annahmen 2026');

// 6 recommendation
s = pres.addSlide({ masterName: 'table' });
s.addText('Wir empfehlen einen Pilotbetrieb mit vier Flugzeugen ab 2028', { placeholder: 'title' });
const wide = rows([['Schritt', 'Zeitpunkt', 'Budget'], ['Bestellung von 4 Flugzeugen', 'Q1 2027', '39,2 Mio. €'], ['Ladeinfrastruktur an 2 Flughäfen', 'Q3 2027', '6,0 Mio. €'], ['Pilotbetrieb auf 3 Strecken', 'ab Q2 2028', '4,0 Mio. €'], ['Entscheidung über Serienausbau', 'Q4 2029', '-']], false);
s.addTable(wide, { x: pt(48), y: pt(144), w: pt(864), colW: [pt(504), pt(180), pt(180)], rowH: pt(40) });
s.addText('Beschluss erbeten: Freigabe von 49,2 Mio. € für den Pilotbetrieb.', { x: pt(48), y: pt(376), w: pt(864), h: pt(32), fontFace: F, fontSize: S.body, bold: false, color: C.accent, align: 'left', valign: 'top', margin: 0, isTextBox: true });
src(s, 'Investitionsplanung, Annahmen 2026');

pres.writeFile({ fileName: path.join(__dirname, 'deck.pptx') }).then(() => console.log('written'));
