// Deck "update": Status Pilotprojekt E-Regionalflug. Executes update/plan.md.
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source } = require('../lib');

const C = { bg: 'FFFFFF', ink: '1B2733', ink2: '4A5866', accent: '1F4E79', neutral: '7A808A', rule: 'D0D5DB', green: '2E7D32', amber: 'B45309', red: 'B71C1C' };
const STATUS = { Rot: C.red, Gelb: C.amber, Grün: C.green };
const F = 'Calibri';
const S = { titleSlide: 40, title: 28, body: 18, label: 14, foot: 10 };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Status Pilotprojekt E-Regionalflug, KW 39 (Beispieldaten)';

const common = { font: F, bg: C.bg, titleSize: S.title, titleBold: true, titleColor: C.ink, title: [48, 48, 864, 40], number: { size: S.foot, color: C.ink2 } };
master(pres, 'title', { ...common, titleSize: S.titleSlide, title: [48, 160, 768, 56] });
master(pres, 'overview', common);
master(pres, 'status', common);

const src = (s) => source(s, 'Quelle: Projektcontrolling, KW 39 (erfundene Daten)', { font: F, size: S.foot, color: C.ink2 });
const line = (strong) => [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: strong ? 1 : 0.75, color: strong ? C.ink : C.rule }, { type: 'none' }];
const cell = (t, o = {}) => ({ text: t, options: { fontFace: F, fontSize: S.label, color: o.color || C.ink, bold: !!o.bold, align: 'left', valign: 'middle', border: line(o.strong), margin: [0, 0.11, 0, 0] } });

let s = pres.addSlide({ masterName: 'title' });
s.addText('Status Pilotprojekt E-Regionalflug, KW 39', { placeholder: 'title' });
s.addText('Beispieldaten', { x: pt(48), y: pt(232), w: pt(480), h: pt(32), fontFace: F, fontSize: S.body, color: C.ink2, align: 'left', valign: 'top', margin: 0, isTextBox: true });

// 2 overview table
s = pres.addSlide({ masterName: 'overview' });
s.addText('Das Projekt liegt zwei Wochen hinter dem Plan', { placeholder: 'title' });
const data = [['Bereich', 'Status', 'Trend', 'Abweichung', 'Nächster Schritt'],
  ['Zulassung', 'Rot', 'verschlechtert', '+2 Wochen', 'Batterienachweis einreichen'],
  ['Prototyp', 'Grün', 'gleichbleibend', 'im Plan', 'Dauerlauf-Test starten'],
  ['Ladeinfrastruktur', 'Gelb', 'verschlechtert', '+1 Woche', 'Vergabe bis KW 41'],
  ['Budget', 'Grün', 'gleichbleibend', '−0,4 Mio. €', 'Prognose im Oktober'],
  ['Personal', 'Gelb', 'verbessert', '1 Stelle offen', 'Zwei Zusagen erwartet']];
s.addTable(data.map((r, i) => r.map((t, j) => cell(t, { bold: i === 0 || j === 1, strong: i === 0, color: i > 0 && j === 1 ? STATUS[t] : C.ink }))),
  { x: pt(48), y: pt(120), w: pt(864), colW: [pt(176), pt(96), pt(160), pt(152), pt(280)], rowH: pt(32) });
src(s);

// 3 to 5: one fixed status layout
function status(title, st, trend, dev, next, chart) {
  const sl = pres.addSlide({ masterName: 'status' });
  sl.addText(title, { placeholder: 'title' });
  const run = (t, o) => ({ text: t, options: { fontFace: F, fontSize: S.body, color: C.ink, ...o } });
  sl.addText([run('Status: ', { breakLine: false }), run(st, { bold: true, color: STATUS[st], breakLine: true }),
    run('Trend: ' + trend, { breakLine: true }), run('Abweichung: ' + dev)],
    { x: pt(48), y: pt(120), w: pt(288), h: pt(88), fontFace: F, fontSize: S.body, color: C.ink, align: 'left', valign: 'top', margin: 0, paraSpaceAfter: 4, isTextBox: true });
  sl.addText([{ text: 'Nächster Schritt', options: { fontFace: F, fontSize: S.label, bold: true, color: C.ink, breakLine: true } },
    { text: next, options: { fontFace: F, fontSize: S.body, color: C.ink } }],
    { x: pt(48), y: pt(240), w: pt(288), h: pt(80), align: 'left', valign: 'top', margin: 0, isTextBox: true });
  sl.addChart(pres.charts.LINE, [{ name: 'Plan', labels: ['KW 35', 'KW 36', 'KW 37', 'KW 38', 'KW 39'], values: chart.plan }, { name: 'Ist', labels: ['KW 35', 'KW 36', 'KW 37', 'KW 38', 'KW 39'], values: chart.ist }],
    { x: pt(384), y: pt(120), w: pt(528), h: pt(232), chartColors: [C.neutral, C.accent], lineSize: 3, lineDataSymbol: 'none', lineDash: 'solid',   // pptxgenjs takes one value for all series; the plan series is made dashed after writing (see below)
      dataLabelFontFace: F, dataLabelFontSize: S.label, showLegend: true, legendPos: 'b', legendFontFace: F, legendFontSize: S.label, legendColor: C.ink,
      catAxisLabelFontFace: F, valAxisLabelFontFace: F, catAxisLabelFontSize: S.label, valAxisLabelFontSize: S.label, catAxisLabelColor: C.ink, valAxisLabelColor: C.ink,
      valAxisMinVal: chart.min, valAxisMaxVal: chart.max, valGridLine: { color: C.rule, size: 0.75 }, catGridLine: { style: 'none' }, showValAxisTitle: true, valAxisTitle: chart.unit,
      valAxisTitleFontFace: F, valAxisTitleFontSize: S.label, valAxisTitleColor: C.ink, altText: chart.alt });
  src(sl);
}
status('Zulassung: Batterienachweis verzögert sich um zwei Wochen', 'Rot', 'verschlechtert seit KW 37', '+2 Wochen', 'Nachweis bis KW 41 einreichen',
  { plan: [55, 62, 70, 78, 86], ist: [52, 57, 61, 64, 66], min: 40, max: 100, unit: 'Fortschritt in %', alt: 'Fortschritt der Zulassung in Prozent, KW 35 bis 39. Plan steigt von 55 auf 86, Ist von 52 auf 66.' });
status('Prototyp: Der Dauerlauf-Test startet planmäßig', 'Grün', 'gleichbleibend', 'im Plan', 'Dauerlauf in KW 40 starten',
  { plan: [40, 48, 56, 64, 72], ist: [41, 49, 56, 64, 72], min: 30, max: 90, unit: 'Fortschritt in %', alt: 'Fortschritt des Prototyps in Prozent, KW 35 bis 39. Plan und Ist liegen übereinander bei 72 Prozent in KW 39.' });
status('Budget: Die Prognose liegt 0,4 Mio. € unter Plan', 'Grün', 'gleichbleibend', '−0,4 Mio. €', 'Forecast im Oktober aktualisieren',
  { plan: [6.0, 6.8, 7.6, 8.4, 9.2], ist: [5.9, 6.6, 7.3, 8.0, 8.8], min: 4, max: 10, unit: 'Kosten in Mio. €', alt: 'Kumulierte Kosten in Mio. Euro, KW 35 bis 39. Plan 9,2, Ist 8,8 in KW 39.' });

// pptxgenjs has no per-series dash: set the Plan series (first c:ser in every chart) to dashed in the written package.
const JSZip = require('jszip');
const file = path.join(__dirname, 'deck.pptx');
pres.writeFile({ fileName: file }).then(async () => {
  const zip = await JSZip.loadAsync(require('fs').readFileSync(file));
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/charts\/chart\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async('string');
    let i = 0;
    xml = xml.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, (ser) => ser.replace(/<a:prstDash val="[^"]*"\/>/, '<a:prstDash val="' + (i++ === 0 ? 'dash' : 'solid') + '"/>'));
    zip.file(name, xml);
  }
  require('fs').writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('written');
});
