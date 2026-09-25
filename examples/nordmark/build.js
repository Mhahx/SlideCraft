// Full Nordmark test deck (SKILL.md steps 5 to 7): 9 slides from the story skeleton in plan.md.
// Direction picked by Max: title slide from C (horizon photo, dark green field, statement title with a bold key phrase),
// content slides from A (Cambria titles, Calibri text, exhibit left, interpretation on a green-tinted field). All figures invented.
// Usage: NODE_PATH=<dir with node_modules containing pptxgenjs> node examples/nordmark/build.js
const pptxgen = require('pptxgenjs');
const path = require('path');
const DIR = __dirname;
const IMG = (f) => path.join(DIR, 'assets', f);
const pt = (v) => v / 72;
const col = (c) => 48 + (c - 1) * (57.333 + 16);
const span = (n) => n * 57.333 + (n - 1) * 16;

// design system (plan.md section 4)
const TF = 'Cambria', BF = 'Calibri';
const GREEN = '1F4A3A', TINT = 'EEF2EF', INK = '1C1C1C', MUTED = '595959', GREY = '8C8C8C', RULE = 'BFBFBF', SIGNAL = 'A33A2B', LIGHT = 'D6E4DC';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
function master(name) {
  pres.defineSlideMaster({ title: name, background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(64), w: pt(864), h: pt(58), fontFace: TF, fontSize: 24,
      bold: true, color: INK, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
    slideNumber: { x: pt(872), y: pt(486), w: pt(40), h: pt(16), fontFace: BF, fontSize: 8, color: MUTED, align: 'right' } });
}
['P03 summary', 'P04 chart-rail', 'P07 table', 'P09 before-after', 'P12 case', 'P08 bridge', 'P11 timeline'].forEach(master);
pres.defineSlideMaster({ title: 'P01 cover', background: { color: GREEN }, objects: [
  { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(360), w: pt(span(10)), h: pt(56), fontFace: TF, fontSize: 40,
    bold: false, color: 'FFFFFF', align: 'left', valign: 'top', margin: 0 }, text: '' } }] });

function text(s, t, x, y, w, h, o = {}) {
  s.addText(t, Object.assign({ x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: BF, fontSize: 14, color: INK,
    align: 'left', valign: 'top', margin: 0, isTextBox: true }, o));
}
const paras = (list, o = {}) => list.map((t, i) => ({ text: t, options: Object.assign({ breakLine: i < list.length - 1 }, o) }));
function measure(s, t) { text(s, t, 48, 124, 864, 18, { fontSize: 11, color: MUTED }); }
function source(s, t) { text(s, 'Quelle: ' + t, 48, 474, 700, 12, { fontSize: 8, color: MUTED }); }
function rail(s, head, items, y = 156, h = 296) {
  s.addShape('rect', { x: pt(col(9)), y: pt(y), w: pt(span(4)), h: pt(h), fill: { color: TINT }, line: { type: 'none' } });
  text(s, head, col(9) + 16, y + 16, span(4) - 32, 20, { fontSize: 14, bold: true, color: GREEN });
  text(s, paras(items), col(9) + 16, y + 44, span(4) - 32, h - 60, { fontSize: 14, paraSpaceAfter: 10 });
}
let s;

// 1 P01 cover
s = pres.addSlide({ masterName: 'P01 cover' });
s.addImage({ path: IMG('koog-wide.jpg'), x: 0, y: 0, w: pt(960), h: pt(320), altText: 'Ein einzelnes Haus am Horizont hinter einem Rapsfeld im Tümlauer Koog, weiter Himmel' });
s.addText([{ text: 'Nah bleiben, ', options: { bold: false } }, { text: 'anders erreichbar', options: { bold: true } }], { placeholder: 'title' });
text(s, 'Filialnetz 2027 · Entscheidungsvorlage für den Vorstand · Beispieldaten', 48, 420, span(10), 20, { color: LIGHT });
text(s, 'Foto: Matthias Süßen, CC BY-SA 4.0, Wikimedia Commons', 48, 500, 400, 12, { fontSize: 8, color: LIGHT });

// 2 P03 summary
s = pres.addSlide({ masterName: 'P03 summary' });
s.addText('Der Umbau spart 6,6 Mio. € im Jahr und hält 97 % der Kunden in Reichweite', { placeholder: 'title' });
[['Die Schalterbesuche sind seit 2019 um 38 % gesunken; 14 Filialen haben weniger als 40 Kunden am Tag.',
  'Diese 14 Filialen tragen 12 % der Besuche, aber 7,7 Mio. € der Kosten.'],
 ['Sechs SB-Anker und zwei Beratungsbusse halten 97 % der Kunden in 15 Minuten Reichweite einer Filiale oder eines Ankers.',
  'Heute sind es 99 %. In der Pilotregion Angeln blieben 92 % der Kunden.'],
 ['Der Umbau spart netto 6,6 Mio. € im Jahr bei 3,2 Mio. € Einmalkosten und ist Ende 2027 abgeschlossen.',
  'Heute zu entscheiden: der Umbau und die Freigabe der ersten Welle mit 5 Filialen.']].forEach((l, i) => {
  const y = 160 + i * 98;
  s.addShape('line', { x: pt(48), y: pt(y - 8), w: pt(span(10)), h: 0, line: { color: i === 0 ? GREEN : RULE, width: i === 0 ? 1.5 : 0.75 } });
  text(s, l[0], 48, y, span(10), 48, { fontSize: 18, bold: true });
  text(s, l[1], 48, y + 52, span(10), 22, { color: MUTED });
});
source(s, 'Filialcontrolling und Kostenrechnung Nordmark, 2026 (Beispieldaten)');

// 3 P04 chart-rail: trend
s = pres.addSlide({ masterName: 'P04 chart-rail' });
s.addText('Die Schalterbesuche sind seit 2019 um 38 % gesunken', { placeholder: 'title' });
measure(s, 'Schalterbesuche in allen 42 Filialen, Mio. je Jahr, 2019–2026 (2026 hochgerechnet)');
const yrs = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
s.addChart(pres.charts.LINE, [{ name: 'Schalterbesuche', labels: yrs, values: [2.10, 1.62, 1.55, 1.51, 1.46, 1.40, 1.35, 1.30] }],
  { x: pt(col(1)), y: pt(156), w: pt(span(8)), h: pt(296), chartColors: [GREEN], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 6,
    valAxisMinVal: 0, valAxisMaxVal: 2.5, valAxisMajorUnit: 0.5, valAxisLabelFontSize: 11, catAxisLabelFontSize: 11, valAxisLabelFontFace: BF,
    catAxisLabelFontFace: BF, valGridLine: { style: 'none' }, showLegend: false, showValue: true, dataLabelFontSize: 11,
    dataLabelColor: INK, dataLabelPosition: 't', dataLabelFormatCode: '0.00',
    altText: 'Linie 2019 bis 2026: Schalterbesuche fallen von 2,10 auf 1,30 Millionen im Jahr, am stärksten 2020' });
rail(s, 'Was das bedeutet', [
  'Den größten Einbruch brachte 2020; die Besuche kamen danach nicht zurück.',
  '71 % der Kundinnen und Kunden nutzen Online-Banking, 2019 waren es 48 %.',
  'Beratungstermine blieben stabil bei 41.000 im Jahr: Gefragt ist Beratung, nicht der Schalter.']);
source(s, 'Filialcontrolling Nordmark, 2019–2026; Digitalbericht 2026 (Beispieldaten)');

// 4 P04 chart-rail: key slide (as drafted in direction A)
const FREQ = [182, 170, 161, 155, 149, 140, 133, 128, 120, 114, 109, 103, 98, 94, 90, 86, 81, 77, 74, 70, 66, 62, 58, 55, 52, 48, 44, 41,
  39, 37, 35, 33, 31, 29, 27, 26, 24, 22, 21, 19, 18, 16];
s = pres.addSlide({ masterName: 'P04 chart-rail' });
s.addText('14 Filialen haben weniger als 40 Schalterkunden am Tag', { placeholder: 'title' });
measure(s, 'Schalterkunden je Filiale und Werktag, Mittel Januar bis August 2026, 42 Filialen');
s.addChart(pres.charts.BAR, [{ name: 'Schalterkunden je Tag', labels: FREQ.map((_, i) => 'F' + (i + 1)), values: FREQ }],
  { x: pt(col(1)), y: pt(156), w: pt(span(8)), h: pt(296), barDir: 'col', barGapWidthPct: 40, chartColors: FREQ.map((v) => (v < 40 ? GREEN : GREY)),
    showLegend: false, catAxisHidden: true, catAxisLabelFontSize: 11, dataLabelFontSize: 11, valAxisLabelFontSize: 11, valAxisLabelFontFace: BF, valAxisLabelColor: MUTED,
    valAxisMaxVal: 200, valAxisMajorUnit: 40, valGridLine: { color: 'D9D9D9', size: 0.5 }, valAxisLineShow: false,
    altText: 'Säulen für 42 Filialen, absteigend von 182 bis 16 Schalterkunden je Tag; die 14 Filialen unter 40 sind hervorgehoben' });
rail(s, 'Was das bedeutet', [
  'Die 14 Filialen tragen 12 % der Schalterbesuche, aber 7,7 Mio. € der Kosten.',
  'Zehn davon liegen weniger als 12 Minuten von der nächsten größeren Filiale entfernt.',
  'Sechs liegen in Orten ohne andere Bank: Dort bleibt ein SB-Anker mit Automat und Videoberatung.']);
source(s, 'Filialcontrolling Nordmark, Januar bis August 2026 (Beispieldaten)');

// 5 P07 table
s = pres.addSlide({ masterName: 'P07 table' });
s.addText('Die 14 Filialen kosten 7,7 Mio. € im Jahr bei 12 % der Schalterbesuche', { placeholder: 'title' });
measure(s, 'Filialen mit weniger als 40 Schalterkunden je Tag, nach Region, 2026');
const hdr = ['Region', 'Filialen heute', 'davon unter 40 Kunden', 'Schalterkunden je Tag', 'Kosten Mio. € je Jahr', 'nächste Filiale, Minuten'];
const rows = [['Angeln', '12', '5', '131', '2,8', '10'], ['Schwansen', '9', '3', '81', '1,6', '11'], ['Hüttener Berge', '11', '4', '104', '2,2', '13'],
  ['Küste', '10', '2', '61', '1,1', '9'], ['Nordmark', '42', '14', '377', '7,7', '11']];
const last = rows.length - 1;
const cell = (v, i, r) => ({ text: v, options: { align: i === 0 ? 'left' : 'right', bold: r === 'h' || r === last, color: r === 'h' ? MUTED : INK,
  fill: r === last ? { color: TINT } : undefined,
  border: [{ type: 'none' }, { type: 'none' }, { pt: r === 'h' || r === last - 1 ? 0.75 : 0.5, color: r === 'h' || r === last - 1 ? INK : RULE }, { type: 'none' }] } });
s.addTable([hdr.map((v, i) => cell(v, i, 'h')), ...rows.map((r, k) => r.map((v, i) => cell(v, i, k)))],
  { x: pt(48), y: pt(156), w: pt(864), colW: [2.6, 1.9, 1.95, 1.95, 1.9, 1.7], fontFace: BF, fontSize: 14, rowH: pt(34), margin: [0.03, 0.1, 0.03, 0.1] });
text(s, 'Ein Schalterbesuch kostet in diesen 14 Filialen 82 €, im ganzen Netz 36 €.', 48, 380, 864, 26, { fontSize: 18, bold: true, color: GREEN });
text(s, 'Kosten je Besuch: Kosten je Jahr geteilt durch Schalterkunden je Tag mal 250 Werktage; Netz gesamt 28,6 Mio. € bei 3.137 Kunden je Tag.',
  48, 456, 864, 12, { fontSize: 8, color: MUTED });
source(s, 'Kostenrechnung und Filialcontrolling Nordmark, 2026 (Beispieldaten)');

// 6 P09 before-after
s = pres.addSlide({ masterName: 'P09 before-after' });
s.addText('SB-Anker und Beratungsbusse ersetzen den Schalter, nicht die Nähe', { placeholder: 'title' });
text(s, 'Heute', col(3), 156, span(5), 18, { bold: true, color: MUTED });
text(s, 'Ab 2027', col(8), 156, span(5), 18, { bold: true, color: GREEN });
s.addShape('line', { x: pt(48), y: pt(180), w: pt(864), h: 0, line: { color: INK, width: 0.75 } });
[['Bargeld', 'Schalter in 42 Filialen, geöffnet an 3 bis 5 Tagen', 'Automaten in 28 Filialen und 6 SB-Ankern, rund um die Uhr'],
 ['Beratung', 'nach Termin in jeder Filiale', 'in 28 Filialen, per Video im SB-Anker und zu Hause durch 2 Beratungsbusse'],
 ['Service', 'Überweisung und Daueraufträge am Schalter', 'online, am SB-Terminal oder am Telefon mit Rückruf in 2 Stunden']].forEach((r, i) => {
  const y = 192 + i * 84;
  text(s, r[0], 48, y, span(2), 20, { bold: true });
  text(s, r[1], col(3), y, span(5) - 24, 60);
  s.addShape('chevron', { x: pt(col(8) - 24), y: pt(y + 3), w: pt(12), h: pt(16), fill: { color: GREEN }, line: { type: 'none' } });
  text(s, r[2], col(8), y, span(5), 60);
  s.addShape('line', { x: pt(48), y: pt(y + 72), w: pt(864), h: 0, line: { color: RULE, width: 0.5 } });
});
source(s, 'Konzept Filialnetz 2027, Nordmark (Beispieldaten)');

// 7 P12 case (photo is a symbolic image, not from the pilot region)
s = pres.addSlide({ masterName: 'P12 case' });
s.addText('In der Pilotregion Angeln blieben 92 % der Kunden nach dem Umbau', { placeholder: 'title' });
text(s, 'Was im Pilot umgesetzt wurde', col(1), 156, span(5), 20, { bold: true, color: GREEN });
text(s, paras(['Drei Filialen im Frühjahr 2024 zu SB-Ankern umgebaut', 'Videoberatung im Anker, Montag bis Samstag 8 bis 20 Uhr',
  'Beratungsbus an zwei Tagen je Woche in sechs Dörfern'], { bullet: { indent: 12 } }), col(1), 184, span(5), 130, { paraSpaceAfter: 8 });
s.addImage({ path: IMG('windeby-1050-strip.jpg'), x: pt(col(6)), y: pt(156), w: pt(span(7)), h: pt(span(7) * 600 / 1920),
  altText: 'Symbolbild: hügelige Felder mit Baumgruppen bei Windeby' });
const ph = span(7) * 600 / 1920;
text(s, 'Symbolbild: Windeby. Foto: Dietmar Rabich, CC BY-SA 4.0, Wikimedia Commons', col(6), 156 + ph + 4, span(7), 12, { fontSize: 8, color: MUTED });
[['92 %', 'der Kunden blieben, in der Vergleichsregion 95 %'], ['+6 %', 'mehr Beratungstermine als vor dem Umbau'], ['6 Monate', 'bis die Beschwerden wieder auf Vorjahresniveau lagen']].forEach((k, i) => {
  const x = col(6) + i * (span(7) + 16) / 3;
  text(s, k[0], x, 156 + ph + 28, (span(7) - 32) / 3, 30, { fontFace: TF, fontSize: 24, bold: true, color: GREEN });
  text(s, k[1], x, 156 + ph + 62, (span(7) - 32) / 3, 44, { fontSize: 11 });
});
source(s, 'Pilotauswertung Angeln, Frühjahr 2024 bis Frühjahr 2025 (Beispieldaten)');

// 8 P08 bridge (drawn from shapes: pptxgenjs cannot write the native waterfall)
s = pres.addSlide({ masterName: 'P08 bridge' });
s.addText('Der Umbau spart netto 6,6 Mio. € im Jahr bei 3,2 Mio. € Einmalkosten', { placeholder: 'title' });
measure(s, 'Jährliche Wirkung ab 2028 in Mio. €');
const y0 = 420, scale = 30, bw = 84;
[['Kosten der 14 Filialen', 7.7, 'base', INK], ['Betrieb 6 SB-Anker', -0.5, 'down', SIGNAL], ['Betrieb 2 Beratungsbusse', -0.6, 'down', SIGNAL], ['Einsparung netto', 6.6, 'base', GREEN]]
  .reduce((run, st, i) => {
    const x = col(1) + 20 + i * 130;
    let top, h;
    if (st[2] === 'base') { top = st[1]; h = st[1]; run = st[1]; } else { top = run; h = -st[1]; run += st[1]; }
    const yTop = y0 - top * scale;
    s.addShape('rect', { x: pt(x), y: pt(yTop), w: pt(bw), h: pt(h * scale), fill: { color: st[3] }, line: { type: 'none' } });
    text(s, (st[2] === 'down' ? '−' : '') + Math.abs(st[1]).toFixed(1).replace('.', ','), x - 8, yTop - 20, bw + 16, 16, { align: 'center', bold: true, color: st[3] === GREEN ? GREEN : INK });
    text(s, st[0], x - 18, y0 + 8, bw + 36, 30, { fontSize: 11, align: 'center', color: MUTED });
    return run;
  }, 0);
s.addShape('line', { x: pt(col(1)), y: pt(y0), w: pt(4 * 130 + 20), h: 0, line: { color: INK, width: 0.75 } });
rail(s, 'Einmalkosten 3,2 Mio. €', ['Umbau der 6 SB-Anker: 2,1 Mio. €', 'Zwei Beratungsbusse: 1,1 Mio. €',
  'Die Einmalkosten sind nach knapp sechs Monaten Einsparung gedeckt.']);
source(s, 'Kostenrechnung Nordmark, Planung 2026 (Beispieldaten)');

// 9 P11 timeline
s = pres.addSlide({ masterName: 'P11 timeline' });
s.addText('Der Umbau läuft in drei Wellen bis Ende 2027 und beginnt mit Ihrem Beschluss', { placeholder: 'title' });
s.addShape('line', { x: pt(48), y: pt(172), w: pt(864), h: 0, line: { color: INK, width: 0.75 } });
[['Heute', 'Beschluss des Vorstands', true], ['Q1 2027', 'Welle 1: 5 Filialen in Angeln, 2 SB-Anker', false],
 ['Q2 bis Q3 2027', 'Welle 2: 5 Filialen an der Küste und in Schwansen, 3 SB-Anker', false],
 ['Q4 2027', 'Welle 3: 4 Filialen in den Hüttener Bergen, 1 SB-Anker, beide Beratungsbusse', false]].forEach((m, i) => {
  const x = 48 + i * 216;
  s.addShape('ellipse', { x: pt(x), y: pt(164), w: pt(16), h: pt(16), fill: { color: m[2] ? GREEN : INK }, line: { type: 'none' } });
  text(s, m[0], x, 192, 190, 18, { bold: true, color: m[2] ? GREEN : INK });
  text(s, m[1], x, 214, 190, 80);
});
s.addShape('rect', { x: pt(48), y: pt(328), w: pt(864), h: pt(52), fill: { color: GREEN }, line: { type: 'none' } });
text(s, 'Heute zu entscheiden: Umbau und Freigabe der ersten Welle (5 Filialen, 1,2 Mio. €)', 64, 342, 832, 26, { fontSize: 18, bold: true, color: 'FFFFFF' });
source(s, 'Projektplan Filialnetz 2027, Nordmark (Beispieldaten)');

pres.writeFile({ fileName: path.join(DIR, 'deck.pptx') }).then(() => console.log('deck.pptx'));
