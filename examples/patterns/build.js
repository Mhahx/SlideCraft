// Test build of the slide patterns in references/patterns.md (P01 to P14).
// Two decks: read.pptx (reading patterns, profile read) and talk.pptx (P01 photo, P05, P13 single number, P14; profile talk).
// The look here is a neutral test rendering (white, ink, one blue accent, Arial), not a direction; all figures are invented.
// Usage: NODE_PATH=<dir with node_modules containing pptxgenjs> node examples/patterns/build.js
const pptxgen = require('pptxgenjs');
const path = require('path');
const DIR = __dirname;
const PHOTO = path.join(DIR, 'assets', 'photo-placeholder.png');
const STRIP = path.join(DIR, 'assets', 'photo-placeholder-strip.png');

const pt = (v) => v / 72;                 // pt -> inch
const F = 'Arial';
const INK = '1A1A1A', MUTED = '595959', GREY = '949494', GREY_ON_LIGHT = '858585', LIGHT = 'F2F2F2', RULE = 'BFBFBF', ACC = '0F5E9C', NEG = 'B42318';
const col = (c) => 48 + (c - 1) * (57.333 + 16);        // left edge of column c (1..12), pt
const span = (n) => n * 57.333 + (n - 1) * 16;            // width of n columns, pt

function master(pres, name, titleSize, titleH, footSize = 10) {
  pres.defineSlideMaster({
    title: name,
    background: { color: 'FFFFFF' },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(64), w: pt(864), h: pt(titleH),
          fontFace: F, fontSize: titleSize, bold: true, color: INK, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: pt(872), y: pt(462), w: pt(40), h: pt(16), fontFace: F, fontSize: footSize, color: MUTED, align: 'right' },
  });
}

function text(s, t, x, y, w, h, o = {}) {
  s.addText(t, Object.assign({ x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: 14, color: INK,
    align: 'left', valign: 'top', margin: 0, isTextBox: true }, o));
}
function measure(s, t) { text(s, t, 48, 124, 864, 18, { fontSize: 12, color: MUTED }); }
function source(s, t, size = 10) { text(s, 'Quelle: ' + t, 48, 446, 700, 18, { fontSize: size, color: MUTED }); }
function rule(s, x, y, w, color = RULE) { s.addShape('line', { x: pt(x), y: pt(y), w: pt(w), h: 0, line: { color, width: 0.75 } }); }

// ------------------------------------------------------------------ read deck
(async function readDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  // one layout per pattern, named by its id: the plan comparison (check 12) matches layouts by name
  master(pres, 'P02 divider-agenda', 24, 58);
  master(pres, 'P03 summary', 24, 58);
  master(pres, 'P04 chart-rail', 24, 58);
  master(pres, 'P05 chart-focus', 24, 58);
  master(pres, 'P06 two-exhibits', 24, 58);
  master(pres, 'P07 table', 24, 58);
  master(pres, 'P08 bridge', 24, 58);
  master(pres, 'P09 before-after', 24, 58);
  master(pres, 'P10 numbered-rows', 24, 58);
  master(pres, 'P11 timeline', 24, 58);
  master(pres, 'P12 case', 24, 58);
  master(pres, 'P13 key-numbers', 24, 58);
  pres.defineSlideMaster({ title: 'P01 cover', background: { color: 'FFFFFF' },
    objects: [{ placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(230), w: pt(span(8)), h: pt(80),
      fontFace: F, fontSize: 32, bold: true, color: INK, align: 'left', valign: 'bottom', margin: 0 }, text: '' } }] });
  let s;

  // P01 cover (typographic)
  s = pres.addSlide({ masterName: 'P01 cover' });
  s.addText('Werk Nord: Wege zu 12 % niedrigeren Stückkosten', { placeholder: 'title' });
  text(s, 'Entscheidungsvorlage für die Geschäftsführung · Oktober 2026 · Beispieldaten', 48, 318, span(8), 20, { fontSize: 14, color: MUTED });
  rule(s, 48, 350, 96, INK);

  // P02 divider-agenda
  s = pres.addSlide({ masterName: 'P02 divider-agenda' });
  s.addText('Inhalt', { placeholder: 'title' });
  ['1  Ausgangslage', '2  Kostentreiber', '3  Hebel und Wirkung', '4  Umsetzung'].forEach((t, i) => {
    text(s, t, 48, 180 + i * 44, span(7), 30, { fontSize: 22, bold: i === 1, color: i === 1 ? ACC : GREY });
  });

  // P03 summary
  s = pres.addSlide({ masterName: 'P03 summary' });
  s.addText('Drei Hebel senken die Stückkosten bis 2028 um 12 %', { placeholder: 'title' });
  const leads = [
    ['Energie und Ausschuss verursachen zwei Drittel der Mehrkosten gegenüber Werk Süd.', 'Energie je Stück liegt 31 % über Werk Süd, Ausschuss bei 4,8 % statt 2,1 %.'],
    ['Wärmerückgewinnung und Prozessregelung bringen 9 Prozentpunkte bei 6,2 Mio. € Investition.', 'Amortisation in 2,4 Jahren, beide Maßnahmen sind in Werk Süd erprobt.'],
    ['Ein Pilot an Linie 3 ab Q1 2027 sichert die Entscheidung über den Rollout ab.', 'Freigabe heute: 1,1 Mio. € für den Pilot.'],
  ];
  leads.forEach((l, i) => {
    const y = 156 + i * 92;
    text(s, l[0], 48, y, span(10), 40, { fontSize: 16, bold: true });
    text(s, l[1], 48, y + 44, span(10), 36, { fontSize: 14, color: MUTED, bullet: { indent: 12 } });
  });
  source(s, 'Kostenrechnung Werk Nord und Werk Süd, 2026 (Beispieldaten)');

  // P04 chart-rail
  s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText('Energie je Stück liegt in Werk Nord 31 % über Werk Süd', { placeholder: 'title' });
  measure(s, 'Energiekosten je Stück in €, 2022–2026');
  const yrs = ['2022', '2023', '2024', '2025', '2026'];
  s.addChart(pres.charts.LINE, [
    { name: 'Werk Nord', labels: yrs, values: [1.42, 1.51, 1.58, 1.66, 1.71] },
    { name: 'Werk Süd', labels: yrs, values: [1.21, 1.24, 1.27, 1.29, 1.31] }],
    { x: pt(col(1)), y: pt(156), w: pt(span(7)), h: pt(270), chartColors: [ACC, GREY], lineSize: 2, lineDataSymbol: 'none',
      valAxisMinVal: 1.0, valAxisMaxVal: 1.8, valAxisMajorUnit: 0.2,
      showLegend: false, catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, valAxisLabelFontFace: F, catAxisLabelFontFace: F,
      valGridLine: { style: 'none' }, showValue: false, altText: 'Linien 2022 bis 2026: Werk Nord steigt von 1,42 auf 1,71 €, Werk Süd von 1,21 auf 1,31 €' });
  text(s, 'Werk Nord', col(8) + 4, 186, span(1) + 12, 16, { fontSize: 12, color: ACC, bold: true });
  text(s, 'Werk Süd', col(8) + 4, 300, span(1) + 12, 16, { fontSize: 12, color: MUTED, bold: true });
  s.addShape('line', { x: pt(col(9)), y: pt(156), w: 0, h: pt(270), line: { color: RULE, width: 0.75 } });
  text(s, 'Was das bedeutet', col(9) + 16, 156, span(4) - 16, 20, { fontSize: 14, bold: true });
  text(s, [
    { text: 'Die Lücke wächst jedes Jahr, weil Werk Nord Abwärme nicht nutzt.', options: { breakLine: true } },
    { text: '0,40 € je Stück entsprechen bei 1,35 Mio. Stück 0,54 Mio. € im Jahr.', options: { breakLine: true } },
    { text: 'Werk Süd senkte den Wert 2021 mit Wärmerückgewinnung.' }],
    col(9) + 16, 184, span(4) - 16, 230, { fontSize: 14, color: INK, paraSpaceAfter: 10 });
  source(s, 'Energiecontrolling, 2026 (Beispieldaten)');

  // P05 chart-focus
  s = pres.addSlide({ masterName: 'P05 chart-focus' });
  s.addText('Der Ausschuss stieg 2026 auf 4,8 % und liegt damit am höchsten seit 2019', { placeholder: 'title' });
  measure(s, 'Ausschussquote Werk Nord in %, 2019–2026');
  const y8 = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  // one series, one colour per point: the focus bar in the accent, the rest neutral
  s.addChart(pres.charts.BAR, [{ name: 'Ausschuss', labels: y8, values: [2.4, 2.9, 3.1, 3.3, 3.8, 4.0, 4.2, 4.8] }],
    { x: pt(48), y: pt(156), w: pt(864), h: pt(270), barDir: 'col', chartColors: [GREY, GREY, GREY, GREY, GREY, GREY, GREY, ACC],
      showLegend: false, catAxisLabelFontSize: 12, valAxisHidden: true, valGridLine: { style: 'none' },
      showValue: true, dataLabelFontSize: 12, dataLabelColor: INK, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0',
      altText: 'Säulen 2019 bis 2026, Ausschuss steigt von 2,4 auf 4,8 Prozent, 2026 hervorgehoben' });
  source(s, 'Qualitätsberichte, 2019–2026 (Beispieldaten)');

  // P06 two-exhibits
  s = pres.addSlide({ masterName: 'P06 two-exhibits' });
  s.addText('Mehr Energie und mehr Ausschuss treffen dieselben zwei Linien', { placeholder: 'title' });
  s.addShape('rect', { x: pt(48), y: pt(150), w: pt(864), h: pt(284), fill: { color: LIGHT }, line: { type: 'none' } });
  const lines = ['Linie 1', 'Linie 2', 'Linie 3', 'Linie 4'];
  [['Energie je Stück', '€, 2026', [1.52, 1.61, 2.04, 1.95]], ['Ausschuss', '%, 2026', [3.1, 3.4, 6.9, 6.2]]].forEach((e, i) => {
    const x = i === 0 ? col(1) + 16 : col(7) + 8;
    text(s, e[0], x, 162, span(6) - 24, 18, { fontSize: 14, bold: true });
    text(s, e[1], x, 182, span(6) - 24, 16, { fontSize: 12, color: MUTED });
    s.addChart(pres.charts.BAR, [{ name: e[0], labels: lines, values: e[2] }],
      { x: pt(x), y: pt(204), w: pt(span(6) - 24), h: pt(220), barDir: 'bar', chartColors: [GREY_ON_LIGHT, GREY_ON_LIGHT, ACC, ACC],
        showLegend: false, catAxisLabelFontSize: 12, valAxisHidden: true, valGridLine: { style: 'none' }, showValue: true,
        dataLabelFontSize: 12, dataLabelColor: INK, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0#', catAxisOrientation: 'maxMin',
        altText: e[0] + ' je Linie 2026, Linien 3 und 4 hervorgehoben' });
  });
  source(s, 'Energie- und Qualitätscontrolling, 2026 (Beispieldaten)');

  // P07 table
  s = pres.addSlide({ masterName: 'P07 table' });
  s.addText('Linie 3 hat die höchsten Kosten je Stück bei geringster Auslastung', { placeholder: 'title' });
  measure(s, 'Kennzahlen je Linie, 2026');
  const hdr = ['Linie', 'Stück (Tsd.)', 'Auslastung', 'Energie €/Stück', 'Ausschuss', 'Kosten €/Stück'];
  const rows = [['Linie 1', '412', '86 %', '1,52', '3,1 %', '11,40'], ['Linie 2', '398', '84 %', '1,61', '3,4 %', '11,75'],
    ['Linie 3', '251', '63 %', '2,04', '6,9 %', '13,90'], ['Linie 4', '287', '71 %', '1,95', '6,2 %', '13,10'], ['Werk', '1.348', '77 %', '1,71', '4,8 %', '12,30']];
  const cell = (v, i, r) => ({ text: v, options: { align: i === 0 ? 'left' : 'right', bold: r === 'h' || r === 2 || r === 4,
    color: r === 2 ? 'FFFFFF' : INK, fill: r === 2 ? { color: ACC } : undefined,
    border: [{ type: 'none' }, { type: 'none' }, { pt: r === 'h' || r === 3 ? 0.75 : 0.5, color: r === 'h' || r === 3 ? INK : RULE }, { type: 'none' }] } });
  s.addTable([hdr.map((v, i) => cell(v, i, 'h')), ...rows.map((r, k) => r.map((v, i) => cell(v, i, k)))],
    { x: pt(48), y: pt(156), w: pt(864), colW: [2.2, 1.95, 1.95, 1.95, 1.95, 2.0], fontFace: F, fontSize: 14, rowH: pt(32), margin: [0.02, 0.08, 0.02, 0.08] });
  text(s, 'Linie 3 kostet 2,50 € je Stück mehr als Linie 1, zusammen 0,6 Mio. € im Jahr.', 48, 360, 864, 22, { fontSize: 14, bold: true });
  source(s, 'Kostenrechnung je Linie, 2026 (Beispieldaten)');

  // P08 bridge (drawn: pptxgenjs cannot write PowerPoint's native waterfall chart)
  s = pres.addSlide({ masterName: 'P08 bridge' });
  s.addText('Energie und Ausschuss erklären 1,25 € der 1,90 € Mehrkosten', { placeholder: 'title' });
  measure(s, 'Stückkosten Werk Süd bis Werk Nord in €, 2026');
  const steps = [['Werk Süd', 10.40, 'base'], ['Energie', 0.40, 'up'], ['Ausschuss', 0.85, 'up'], ['Personal', 0.80, 'up'], ['Einkauf', -0.15, 'down'], ['Werk Nord', 12.30, 'base']];
  const y0 = 410, scale = 80, from = 9.5; let run = 0; const bw = 64;
  steps.forEach((st, i) => {
    const x = col(1) + 24 + i * 92;
    let top, h, color;
    if (st[2] === 'base') { top = st[1]; h = st[1] - from; color = INK; run = st[1]; }
    else if (st[2] === 'up') { top = run + st[1]; h = st[1]; color = GREY; run += st[1]; }
    else { top = run; h = -st[1]; color = NEG; run += st[1]; }
    const yTop = y0 - (top - from) * scale;
    s.addShape('rect', { x: pt(x), y: pt(yTop), w: pt(bw), h: pt(h * scale), fill: { color }, line: { type: 'none' } });
    text(s, (st[2] === 'down' ? '−' : st[2] === 'up' ? '+' : '') + Math.abs(st[1]).toFixed(2).replace('.', ','), x - 10, yTop - 18, bw + 20, 14, { fontSize: 12, align: 'center', bold: st[2] === 'base' });
    text(s, st[0], x - 16, y0 + 6, bw + 32, 14, { fontSize: 12, align: 'center', color: MUTED });
  });
  rule(s, col(1), y0, 92 * 5 + bw + 48, INK);
  const notes = [['Energie', 'keine Wärmerückgewinnung, ältere Öfen'], ['Ausschuss', 'Linien 3 und 4, fehlende Prozessregelung'], ['Personal', 'Tarif Nord, Schichtmodell'], ['Einkauf', 'Rahmenvertrag Stahl 2025']];
  notes.forEach((n, i) => {
    text(s, n[0], col(9), 168 + i * 60, span(4), 18, { fontSize: 14, bold: true });
    text(s, n[1], col(9), 188 + i * 60, span(4), 18, { fontSize: 14, color: MUTED });
  });
  s.addShape('line', { x: pt(col(9) - 12), y: pt(160), w: 0, h: pt(260), line: { color: RULE, width: 0.75 } });
  source(s, 'Kostenvergleich der Werke, 2026 (Beispieldaten)');

  // P09 before-after
  s = pres.addSlide({ masterName: 'P09 before-after' });
  s.addText('Der Pilot ändert an Linie 3 Steuerung, Wärme und Wartung', { placeholder: 'title' });
  text(s, 'Heute', col(3), 156, span(5), 18, { fontSize: 14, bold: true, color: MUTED });
  text(s, 'Nach dem Pilot', col(8), 156, span(5), 18, { fontSize: 14, bold: true, color: ACC });
  rule(s, 48, 178, 864, INK);
  [['Steuerung', 'Ofentemperatur von Hand, Stichproben alle 4 Stunden', 'Regelung je Charge, Messung in Echtzeit'],
   ['Wärme', 'Abwärme geht über das Dach verloren', 'Rückgewinnung heizt Halle und Vorwärmung'],
   ['Wartung', 'nach Ausfall, im Mittel 11 Stunden Stillstand', 'nach Zustand, Stillstand unter 3 Stunden']].forEach((r, i) => {
    const y = 190 + i * 78;
    text(s, r[0], 48, y, span(2), 20, { fontSize: 14, bold: true });
    text(s, r[1], col(3), y, span(5) - 20, 60, { fontSize: 14 });
    s.addShape('chevron', { x: pt(col(8) - 22), y: pt(y + 4), w: pt(12), h: pt(16), fill: { color: GREY }, line: { type: 'none' } });
    text(s, r[2], col(8), y, span(5), 60, { fontSize: 14 });
    rule(s, 48, y + 70, 864);
  });
  source(s, 'Konzept Pilot Linie 3, 2026 (Beispieldaten)');

  // P10 numbered-rows
  s = pres.addSlide({ masterName: 'P10 numbered-rows' });
  s.addText('Vier Treiber erklären die Mehrkosten, zwei davon sind lösbar', { placeholder: 'title' });
  text(s, 'Treiber', col(2), 156, span(2), 18, { fontSize: 12, bold: true, color: MUTED });
  text(s, 'Befund', col(4), 156, span(5), 18, { fontSize: 12, bold: true, color: MUTED });
  text(s, 'Hebel', col(9), 156, span(4), 18, { fontSize: 12, bold: true, color: MUTED });
  rule(s, 48, 176, 864, INK);
  [['Energie', 'Abwärme ungenutzt, Öfen von 2004', 'Wärmerückgewinnung, 4,1 Mio. €', true],
   ['Ausschuss', 'Linien 3 und 4 ohne Prozessregelung', 'Regelung, 2,1 Mio. €', true],
   ['Personal', 'Tarif Nord liegt 6 % über Süd', 'nicht beeinflussbar', false],
   ['Einkauf', 'Rahmenvertrag bereits günstiger', 'beibehalten', false]].forEach((r, i) => {
    const y = 186 + i * 58;
    text(s, String(i + 1), 48, y, 30, 24, { fontSize: 20, bold: true, color: r[3] ? ACC : GREY });
    text(s, r[0], col(2), y + 2, span(2), 20, { fontSize: 14, bold: true });
    text(s, r[1], col(4), y + 2, span(5), 40, { fontSize: 14 });
    text(s, r[2], col(9), y + 2, span(4), 40, { fontSize: 14, color: r[3] ? ACC : MUTED, bold: r[3] });
    rule(s, 48, y + 50, 864);
  });
  source(s, 'Kostenanalyse Werk Nord, 2026 (Beispieldaten)');

  // P11 timeline
  s = pres.addSlide({ masterName: 'P11 timeline' });
  s.addText('Nach dem Pilot entscheidet die Geschäftsführung im Juli 2027 über den Rollout', { placeholder: 'title' });
  rule(s, 48, 200, 864, INK);
  [['Q1 2027', 'Pilot startet an Linie 3', false], ['Q2 2027', 'Messung von Energie und Ausschuss', false],
   ['Juli 2027', 'Entscheidung über den Rollout', true], ['2028', 'Linien 1, 2 und 4 umgerüstet', false]].forEach((m, i) => {
    const x = 48 + i * 216;
    s.addShape('ellipse', { x: pt(x), y: pt(192), w: pt(16), h: pt(16), fill: { color: m[2] ? ACC : INK }, line: { type: 'none' } });
    text(s, m[0], x, 220, 190, 18, { fontSize: 14, bold: true, color: m[2] ? ACC : INK });
    text(s, m[1], x, 242, 190, 44, { fontSize: 14 });
  });
  s.addShape('rect', { x: pt(48), y: pt(340), w: pt(864), h: pt(44), fill: { color: ACC }, line: { type: 'none' } });
  text(s, 'Heute zu entscheiden: Freigabe von 1,1 Mio. € für den Pilot an Linie 3', 64, 352, 832, 22, { fontSize: 16, bold: true, color: 'FFFFFF' });
  source(s, 'Projektplan, 2026 (Beispieldaten)');

  // P12 case (quote variant: no real photo available)
  s = pres.addSlide({ masterName: 'P12 case' });
  s.addText('Werk Süd senkte den Energiebedarf mit derselben Technik um 18 %', { placeholder: 'title' });
  text(s, 'Was Werk Süd 2021 umgesetzt hat', col(1), 156, span(5), 18, { fontSize: 14, bold: true });
  text(s, [
    { text: 'Wärmetauscher an allen Öfen', options: { bullet: { indent: 12 }, breakLine: true } },
    { text: 'Abwärme heizt Halle und Vorwärmung', options: { bullet: { indent: 12 }, breakLine: true } },
    { text: 'Investition 3,8 Mio. €, Amortisation 2,6 Jahre', options: { bullet: { indent: 12 } } }],
    col(1), 182, span(5), 120, { fontSize: 14, paraSpaceAfter: 6 });
  text(s, '„Die Rückgewinnung lief nach sechs Wochen stabil, der Aufwand lag bei der Planung, nicht im Betrieb.“', col(7), 156, span(6), 70, { fontSize: 16, italic: true });
  text(s, 'Werkleiter Süd', col(7), 230, span(6), 18, { fontSize: 12, color: MUTED });
  text(s, '„Seitdem messen wir Energie je Charge, das war der eigentliche Hebel.“', col(7), 270, span(6), 50, { fontSize: 16, italic: true });
  text(s, 'Leiterin Instandhaltung Süd', col(7), 324, span(6), 18, { fontSize: 12, color: MUTED });
  s.addShape('line', { x: pt(col(7) - 12), y: pt(156), w: 0, h: pt(190), line: { color: RULE, width: 0.75 } });
  source(s, 'Interviews Werk Süd, September 2026 (Beispieldaten)');

  // P13 key-numbers (parts of one measure)
  s = pres.addSlide({ masterName: 'P13 key-numbers' });
  s.addText('Zwei Drittel der Mehrkosten liegen in Energie und Ausschuss', { placeholder: 'title' });
  text(s, 'Mehrkosten Werk Nord gegenüber Süd, 1,90 € je Stück, aufgeteilt nach Ursache:', 48, 156, 864, 20, { fontSize: 14 });
  [['66 %', 'Energie und Ausschuss, durch Technik lösbar', ACC], ['42 %', 'Personal, durch den Tarif bestimmt', GREY], ['−8 %', 'Einkauf, schon günstiger als Süd', GREY]].forEach((k, i) => {
    const x = col(1 + i * 4);
    rule(s, x, 200, span(4) - 16, INK);
    text(s, k[0], x, 212, span(4) - 16, 60, { fontSize: 48, bold: true, color: k[2] === ACC ? ACC : INK });
    text(s, k[1], x, 280, span(4) - 16, 40, { fontSize: 14 });
  });
  source(s, 'Kostenvergleich der Werke, 2026 (Beispieldaten)');

  await pres.writeFile({ fileName: path.join(DIR, 'read.pptx') });
})();

// ------------------------------------------------------------------ talk deck
(async function talkDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  master(pres, 'P05 chart-focus', 40, 104, 12);
  master(pres, 'P13 key-numbers', 40, 104, 12);
  pres.defineSlideMaster({ title: 'P01 cover', background: { color: 'FFFFFF' },
    objects: [{ placeholder: { options: { name: 'title', type: 'title', x: pt(72), y: pt(356), w: pt(span(7) - 48), h: pt(96),
      fontFace: F, fontSize: 40, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle', margin: 0 }, text: '' } }] });
  pres.defineSlideMaster({ title: 'P14 statement', background: { color: 'FFFFFF' },
    objects: [{ placeholder: { options: { name: 'title', type: 'title', x: pt(48), y: pt(290), w: pt(span(8)), h: pt(64),
      fontFace: F, fontSize: 44, bold: true, color: INK, align: 'left', valign: 'top', margin: 0 }, text: '' } }] });
  let s;

  // P01 cover (photo with solid panel)
  s = pres.addSlide({ masterName: 'P01 cover' });
  s.addImage({ path: PHOTO, x: 0, y: 0, w: pt(960), h: pt(540), altText: 'Platzhalter für ein Foto aus Werk Nord' });
  s.addShape('rect', { x: pt(48), y: pt(336), w: pt(span(7)), h: pt(136), fill: { color: INK }, line: { type: 'none' } });
  s.addText('Werk Nord wird günstiger', { placeholder: 'title' });

  // P05 chart-focus
  s = pres.addSlide({ masterName: 'P05 chart-focus' });
  s.addText('Ausschuss verdoppelt seit 2022', { placeholder: 'title' });
  const y5 = ['2022', '2023', '2024', '2025', '2026'];
  s.addChart(pres.charts.BAR, [{ name: 'Ausschuss', labels: y5, values: [2.4, 3.1, 3.8, 4.2, 4.8] }],
    { x: pt(48), y: pt(190), w: pt(864), h: pt(240), barDir: 'col', chartColors: [GREY, GREY, GREY, GREY, ACC],
      showLegend: false, catAxisLabelFontSize: 14, valAxisHidden: true, valGridLine: { style: 'none' },
      showValue: true, dataLabelFontSize: 14, dataLabelColor: INK, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0',
      altText: 'Säulen 2022 bis 2026, Ausschuss steigt von 2,4 auf 4,8 Prozent' });
  source(s, 'Qualitätsberichte 2022–2026 (Beispieldaten)', 12);

  // P13 key number (single)
  s = pres.addSlide({ masterName: 'P13 key-numbers' });
  s.addText('Das kostet uns jährlich', { placeholder: 'title' });
  text(s, '0,54 Mio. €', 48, 210, span(8), 110, { fontSize: 96, bold: true, color: ACC });
  text(s, 'nur durch ungenutzte Abwärme', 48, 330, span(8), 30, { fontSize: 24, color: MUTED });
  source(s, 'Energiecontrolling 2026 (Beispieldaten)', 12);

  // P14 statement (photo top half)
  s = pres.addSlide({ masterName: 'P14 statement' });
  s.addImage({ path: STRIP, x: 0, y: 0, w: pt(960), h: pt(250), altText: 'Platzhalter für ein Foto der Öfen' });
  s.addText('Die Wärme ist schon da', { placeholder: 'title' });
  text(s, 'wir lassen sie entweichen', 48, 370, span(8), 34, { fontSize: 28, color: MUTED });

  await pres.writeFile({ fileName: path.join(DIR, 'talk.pptx') });
})();
