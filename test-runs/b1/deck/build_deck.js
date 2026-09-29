// Beiratsvorlage Kessler Lastenräder Q3 2026, Look A (Werkstatt-Datenblatt), Profil read
const pptxgen = require('/tmp/claude-0/pg/node_modules/pptxgenjs');

const IN = (pt) => pt / 72;
const NB = ' '; // non-breaking space
const M = 48;
const col = (n) => 48 + (n - 1) * (57.3 + 16); // x of column n (pt)
const span = (n) => n * 57.3 + (n - 1) * 16; // width of n columns (pt)

const C = {
  bg: 'FFFFFF', ink: '1A1A1A', muted: '595959', neutral: '767676', accent: 'C2410C',
  dark: '404040', light: '949494', rule: 'D9D9D9',
};
const F = 'Arial';
const SZ = { cover: 40, title: 24, subtitle: 18, body: 14, label: 11, foot: 8, key: 60 };

const SRC_ERP = 'ERP-Export Controlling, Stand 06.10.2026';
const SRC_CRM = 'Vertriebs-CRM, Stand 06.10.2026';
const SRC_ANL = 'Angebot Anlagenlieferant, 18.09.2026';
const SRC_SZ = 'Szenariorechnung Controlling, 02.10.2026';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Beiratsvorlage Q3 2026: Zweite Montagelinie';
pres.author = 'Kessler Lastenräder GmbH';
pres.lang = 'de-DE';

const ph = (o) => ({
  placeholder: {
    options: Object.assign({ name: 'title', type: 'title', fontFace: F, bold: true, align: 'left', valign: 'top', margin: 0 }, o),
    text: '',
  },
});
const titleBox = { x: IN(M), y: IN(64), w: IN(864), h: IN(58), fontSize: SZ.title, color: C.ink };
pres.defineSlideMaster({ title: 'P01 cover', background: { color: C.bg }, objects: [ph({ x: IN(M), y: IN(190), w: IN(700), h: IN(130), fontSize: SZ.cover, color: C.ink })] });
['P03 summary', 'P04 chart-rail', 'P06 two-exhibits', 'P08 bridge', 'P09 before-after', 'P13 key-numbers'].forEach((n) =>
  pres.defineSlideMaster({ title: n, background: { color: C.bg }, objects: [ph(titleBox)] }));

// ---------- helpers ----------
function T(s, text, x, y, w, h, o) {
  s.addText(text, Object.assign({
    x: IN(x), y: IN(y), w: IN(w), h: IN(h), fontFace: F, fontSize: SZ.body, color: C.ink,
    isTextBox: true, margin: 0, align: 'left', valign: 'top',
  }, o || {}));
}
function frame(s, page, source, measure) {
  if (measure) T(s, measure, M, 132, 864, 18, { fontSize: SZ.label, color: C.muted });
  T(s, source, M, 466, 700, 36, { fontSize: SZ.foot, color: C.muted });
  T(s, String(page), 872, 488, 40, 16, { fontSize: SZ.foot, color: C.muted, align: 'right' });
}
const focusColors = (n) => Array.from({ length: n }, (_, i) => (i === n - 1 ? C.accent : C.neutral));
function barChart(s, cats, vals, x, y, w, h, fmt, max, alt) {
  s.addChart(pres.charts.BAR, [{ name: 'Wert', labels: cats, values: vals }], {
    x: IN(x), y: IN(y), w: IN(w), h: IN(h), barDir: 'col', barGapWidthPct: 45,
    chartColors: focusColors(vals.length),
    valAxisHidden: true, valAxisLabelFontSize: SZ.label, valAxisMinVal: 0, valAxisMaxVal: max,
    valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    catAxisLabelFontFace: F, catAxisLabelFontSize: SZ.label, catAxisLabelColor: C.muted,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: F, dataLabelFontSize: SZ.label,
    dataLabelColor: C.ink, dataLabelFormatCode: fmt,
    showLegend: false, showTitle: false, altText: alt.replace(/Q(\d)\/(\d\d)/g, 'Q$1 20$2'),
  });
}
const QUARTERS = ['Q3/25', 'Q4/25', 'Q1/26', 'Q2/26', 'Q3/26'];

// ---------- 1 P01 cover ----------
{
  const s = pres.addSlide({ masterName: 'P01 cover' });
  s.addText('Linie 2 freigeben, Rahmenschweißen auslagern', { placeholder: 'title' });
  T(s, 'Beiratsvorlage Q3 2026', M, 64, 424, 20, { fontSize: SZ.label, color: C.muted });
  T(s, [
    { text: 'Entscheidung über ' },
    { text: '2,4' + NB + 'Mio.' + NB + '€', options: { bold: true, color: C.accent } },
    { text: ' für die zweite Montagelinie', options: { breakLine: true } },
    { text: 'Kessler Lastenräder GmbH, Beirat' },
  ], M, 340, 700, 70, { fontSize: SZ.subtitle, color: C.muted });
  s.addNotes('Vorab-PDF für den Beirat (5 Personen), Besprechung 20 Minuten. Entscheidung: 2,4 Mio. € für die zweite Montagelinie freigeben und bis dahin das Rahmenschweißen auslagern.');
}

// ---------- 2 P03 summary ----------
{
  const s = pres.addSlide({ masterName: 'P03 summary' });
  s.addText([{ text: 'Linie 1 ist voll und Kunden stornieren:', options: { breakLine: true } }, { text: 'Wir empfehlen Linie 2 und eine Überbrückung' }], { placeholder: 'title' });
  const leads = [
    ['Kessler wächst, aber Linie 1 ist mit 97 % ausgelastet.',
      ['Umsatz Q3/26: 3,9 Mio. €, +26 % gegenüber Q3/25.', 'Auftragsbestand 1.380 Stück, Lieferzeit 12 Wochen (Q3/25: 610 Stück, 6 Wochen).']],
    ['Die lange Lieferzeit kostet Aufträge, und die Bruttomarge sinkt.',
      ['118 Stornos im Q3/26, rund 0,39 Mio. € entgangener Umsatz.', 'Bruttomarge von 38,2 % auf 33,9 % gesunken (−4,3 Punkte).']],
    ['Linie 2 rechnet sich auch ohne weiteres Wachstum.',
      ['2,4 Mio. € Invest, +900 Stück pro Quartal ab Q2/27.', 'Amortisation 3,1 Jahre (Basis), 4,6 Jahre (Nachfrage stagniert).']],
    ['Beschlussvorschlag: Linie 2 freigeben, bis dahin das Rahmenschweißen auslagern.',
      ['Auslagerung: +300 Stück pro Quartal nach 8 Wochen, 54 T€ Mehrkosten pro Quartal.', 'Liquidität: 5,1 Mio. € Kasse, 2,0 Mio. € Kreditlinie ungenutzt.']],
  ];
  const runs = [];
  leads.forEach(([lead, sup], i) => {
    runs.push({ text: lead, options: { bold: true, breakLine: true, paraSpaceBefore: i === 0 ? 0 : 14, paraSpaceAfter: 4 } });
    sup.forEach((t, j) => runs.push({
      text: t,
      options: { bullet: { indent: 14 }, breakLine: !(i === leads.length - 1 && j === sup.length - 1), paraSpaceAfter: 2 },
    }));
  });
  T(s, runs, M, 156, span(10), 300);
  frame(s, 2, 'Quellen: ' + SRC_ERP + '; ' + SRC_CRM + '; ' + SRC_ANL + '; ' + SRC_SZ + '. Angaben zu Auslagerung, Kasse und Kreditlinie ohne benannte Quelle. Berechnet: Umsatzwachstum (3,9 / 3,1), Mehrkosten Auslagerung (300 Stück × 180 €).');
  s.addNotes('Berechnet: +26 % = 3,9 / 3,1 − 1; 54 T€ = 300 Stück × 180 € je Rad pro Quartal. Übrige Zahlen unverändert aus den Quellen.');
}

// ---------- 3 P06 two-exhibits ----------
{
  const s = pres.addSlide({ masterName: 'P06 two-exhibits' });
  s.addText([{ text: 'Der Umsatz wächst um 26 %,', options: { breakLine: true } }, { text: 'der Auftragsbestand hat sich mehr als verdoppelt' }], { placeholder: 'title' });
  const xa = col(1), xb = col(7), wa = span(6);
  T(s, 'Umsatz je Quartal', xa, 156, wa, 20, { bold: true });
  T(s, 'Mio. €, +26 % gegenüber Q3/25', xa, 178, wa, 16, { fontSize: SZ.label, color: C.muted });
  T(s, 'Auftragsbestand je Quartal', xb, 156, wa, 20, { bold: true });
  T(s, 'Stück, 2,3-fach gegenüber Q3/25', xb, 178, wa, 16, { fontSize: SZ.label, color: C.muted });
  barChart(s, QUARTERS, [3.1, 3.4, 3.0, 3.6, 3.9], xa, 204, wa, 252, '0.0', 4.6,
    'Säulendiagramm: Umsatz in Mio. Euro. Q3/25 3,1; Q4/25 3,4; Q1/26 3,0; Q2/26 3,6; Q3/26 3,9.');
  barChart(s, QUARTERS, [610, 740, 820, 1050, 1380], xb, 204, wa, 252, '#,##0', 1650,
    'Säulendiagramm: Auftragsbestand in Stück. Q3/25 610; Q4/25 740; Q1/26 820; Q2/26 1.050; Q3/26 1.380.');
  frame(s, 3, 'Quellen: ' + SRC_ERP + '; ' + SRC_CRM + '. Berechnet: +26 % (3,9 / 3,1), 2,3-fach (1.380 / 610).');
  s.addNotes('Beide Diagramme zeigen Quartalswerte Q3/25 bis Q3/26, hervorgehoben ist Q3/26. Berechnet: 3,9 / 3,1 = 1,26; 1.380 / 610 = 2,26.');
}

// ---------- 4 P04 chart-rail (Auslastung, Lieferzeit) ----------
function rail(s, head, points) {
  const runs = [{ text: head, options: { bold: true, breakLine: true, paraSpaceAfter: 8 } }];
  points.forEach((t, i) => runs.push({ text: t, options: { breakLine: i < points.length - 1, paraSpaceAfter: 10 } }));
  s.addShape(pres.ShapeType.line, { x: IN(col(9)), y: IN(156), w: 0, h: IN(300), line: { color: C.neutral, width: 1 } });
  T(s, runs, col(9) + 16, 156, span(4) - 16, 300);
}
{
  const s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText([{ text: 'Linie 1 läuft mit 97 % Auslastung,', options: { breakLine: true } }, { text: 'die Lieferzeit hat sich auf 12 Wochen verdoppelt' }], { placeholder: 'title' });
  barChart(s, QUARTERS, [6, 7, 8, 10, 12], col(1), 156, span(8), 300, '0', 14,
    'Säulendiagramm: durchschnittliche Lieferzeit in Wochen. Q3/25 6; Q4/25 7; Q1/26 8; Q2/26 10; Q3/26 12.');
  rail(s, 'Was das bedeutet', [
    'Linie 1 hat kaum Reserve: 1.120 von 1.150 Stück pro Quartal gebaut, das sind 30 Stück frei.',
    'Der Auftragsbestand von 1.380 Stück ist größer als die Kapazität eines ganzen Quartals.',
  ]);
  frame(s, 4, 'Quellen: ' + SRC_ERP + '; ' + SRC_CRM + '. Berechnet: 30 Stück (1.150 − 1.120), Auslastung 97 % (1.120 / 1.150).',
    'Durchschnittliche Lieferzeit, Wochen, Q3/25 bis Q3/26');
  s.addNotes('Kapazität Linie 1: 1.150 Stück pro Quartal, Q3/26 produziert: 1.120 (97 %). Freie Kapazität 30 Stück ist berechnet.');
}

// ---------- 5 P13 key numbers ----------
{
  const s = pres.addSlide({ masterName: 'P13 key-numbers' });
  s.addText([{ text: 'Stornos wegen Lieferzeit haben sich fast verdoppelt', options: { breakLine: true } }, { text: 'und kosten im Q3 rund 0,39 Mio.\u00A0€ Umsatz' }], { placeholder: 'title' });
  T(s, 'Stornierte Aufträge wegen Lieferzeit, bei durchschnittlich 3.300 € Auftragswert.', M, 156, span(12), 20);
  const nums = [
    ['64', C.neutral, 'Stornos im Q2/26'],
    ['118', C.accent, 'Stornos im Q3/26, +84 % gegenüber Q2/26'],
    ['0,39', C.accent, 'Mio. € entgangener Umsatz im Q3/26 (118 × 3.300 €)'],
  ];
  nums.forEach(([n, colr, label], i) => {
    const x = col(1 + i * 4);
    T(s, n, x, 240, span(4), 80, { fontSize: SZ.key, bold: true, color: colr });
    T(s, label, x, 330, span(4) - 24, 60, { fontSize: SZ.body, color: C.ink });
  });
  frame(s, 5, 'Quelle: ' + SRC_CRM + '. Berechnet: +84 % (118 / 64), 0,39 Mio. € (118 × 3.300 € = 389.400 €).');
  s.addNotes('Stornos wegen Lieferzeit: Q2/26 64, Q3/26 118. Entgangener Umsatz Q3: 118 × 3.300 € = 389.400 €, gerundet 0,39 Mio. €.');
}

// ---------- 6 P08 bridge (from shapes, no native waterfall); notes under the bars ----------
{
  const s = pres.addSlide({ masterName: 'P08 bridge' });
  s.addText([{ text: 'Die Bruttomarge fiel um 4,3 Punkte,', options: { breakLine: true } }, { text: '3,5 davon durch Batteriepreise und Überstunden' }], { placeholder: 'title' });
  const steps = [
    { label: 'Marge Q3/25', v: 38.2, kind: 'end' },
    { label: 'Batteriepreise', d: -2.1, kind: 'focus' },
    { label: 'Überstunden', d: -1.4, kind: 'focus' },
    { label: 'Fracht', d: -0.5, kind: 'minor' },
    { label: 'Produktmix', d: -0.3, kind: 'minor' },
    { label: 'Marge Q3/26', v: 33.9, kind: 'end' },
  ];
  const base = 30, top = 40, y0 = 340, y1 = 180; // value 30 at y0, value 40 at y1
  const yv = (v) => y0 - ((v - base) / (top - base)) * (y0 - y1);
  const pitch = span(12) / 6, bw = 72;
  let level = 38.2;
  steps.forEach((st, i) => {
    const x = M + i * pitch + (pitch - bw) / 2;
    let hi, lo, fill, lab;
    if (st.kind === 'end') { hi = st.v; lo = base; fill = C.dark; lab = String(st.v).replace('.', ',') + ' %'; }
    else { hi = level; lo = level + st.d; level = lo; fill = st.kind === 'focus' ? C.accent : C.light; lab = '−' + String(-st.d).replace('.', ','); }
    const yTop = yv(hi), yBot = yv(lo);
    s.addShape(pres.ShapeType.rect, { x: IN(x), y: IN(yTop), w: IN(bw), h: IN(Math.max(yBot - yTop, 1)), fill: { color: fill }, line: { color: fill, width: 0 } });
    if (st.kind === 'end') s.addShape(pres.ShapeType.rect, { x: IN(x - 2), y: IN(y0 - 24), w: IN(bw + 4), h: IN(4), fill: { color: C.bg }, line: { color: C.bg, width: 0 } });
    T(s, lab, x - 10, yTop - 20, bw + 20, 16, { fontSize: SZ.label, bold: true, align: 'center' });
    T(s, st.label, x - 20, y0 + 8, bw + 40, 16, { fontSize: SZ.label, color: C.muted, align: 'center' });
  });
  s.addShape(pres.ShapeType.line, { x: IN(M), y: IN(y0), w: IN(864), h: 0, line: { color: C.neutral, width: 1 } });
  T(s, 'Achse gekürzt, beginnt bei 30 %', M, 160, 300, 16, { fontSize: SZ.label, color: C.muted });
  const notes = [
    'Batteriepreise (−2,1) und Überstunden (−1,4) erklären 3,5 der 4,3 Punkte.',
    'Fracht (−0,5) und Produktmix (−0,3) machen zusammen 0,8 Punkte aus.',
    'Die Marge sinkt in jedem Quartal: 38,2 / 37,5 / 36,1 / 34,8 / 33,9 %.',
  ];
  notes.forEach((t, i) => T(s, t, col(1 + i * 4), 388, span(4) - 16, 60));
  s.addNotes('Wasserfall aus Formen gebaut, Achse beginnt bei 30 % (auf der Folie benannt, Balkenunterbrechung an Start- und Endbalken). Summe der Bausteine: 2,1 + 1,4 + 0,5 + 0,3 = 4,3 Punkte. Quartalswerte der Marge: 38,2; 37,5; 36,1; 34,8; 33,9.');
  frame(s, 6, 'Quelle: ' + SRC_ERP + '. Berechnet: Summe 3,5 (2,1 + 1,4) und 0,8 (0,5 + 0,3).',
    'Bruttomarge, %, Q3/25 bis Q3/26, Veränderung in Prozentpunkten');
}

// ---------- 7 P04 chart-rail (Amortisation) ----------
{
  const s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addText([{ text: 'Linie 2 amortisiert sich in 3,1 Jahren,', options: { breakLine: true } }, { text: 'bei stagnierender Nachfrage in 4,6 Jahren' }], { placeholder: 'title' });
  const YEARS = ['0', '1', '2', '3', '4', '5', '6'];
  const base = [-2.4, -1.62, -0.84, -0.06, 0.72, 1.5, 2.28];
  const stag = [-2.4, -1.88, -1.36, -0.84, -0.32, 0.2, 0.72];
  const chartW = span(8) - 150;
  s.addChart(pres.charts.LINE, [
    { name: 'Basisszenario', labels: YEARS, values: base },
    { name: 'Nachfrage stagniert', labels: YEARS, values: stag },
  ], {
    x: IN(col(1)), y: IN(156), w: IN(chartW), h: IN(300), chartColors: [C.accent, C.neutral], lineSize: 3, lineDataSymbol: 'none',
    showLegend: false, showTitle: false, valAxisMinVal: -2.5, valAxisMaxVal: 2.5, valAxisMajorUnit: 0.5,
    valAxisLabelFontSize: SZ.label, valAxisLabelColor: C.muted, valAxisLabelFontFace: F, valAxisLabelFormatCode: '0.0',
    catAxisLabelFontSize: SZ.label, catAxisLabelColor: C.muted, catAxisLabelFontFace: F, catAxisLabelPos: 'low',
    valGridLine: { color: C.rule, size: 0.5 }, catGridLine: { style: 'none' }, showValue: false, dataLabelFontSize: SZ.label,
    altText: 'Liniendiagramm: kumulierter Nettobeitrag Linie 2 in Mio. Euro über sechs Jahre ab Produktionsstart. Im Basisszenario wird Null nach 3,1 Jahren erreicht, bei stagnierender Nachfrage nach 4,6 Jahren.',
  });
  const lx = col(1) + chartW + 6;
  T(s, [{ text: 'Basis: 0,78' + NB + 'Mio.' + NB + '€ pro Jahr', options: { bold: true, breakLine: true } }, { text: '3,1 Jahre' }], lx, 162, 140, 34, { fontSize: SZ.label, color: C.accent });
  T(s, [{ text: 'Stagnation: 0,52' + NB + 'Mio.' + NB + '€ pro Jahr', options: { bold: true, breakLine: true } }, { text: '4,6 Jahre' }], lx, 252, 140, 34, { fontSize: SZ.label, color: C.muted });
  rail(s, 'Was das für den Beschluss heißt', [
    'Im Basisszenario ist die Investition nach 3,1 Jahren zurückverdient (0,78 Mio. € pro Jahr).',
    'Ohne weiteres Nachfragewachstum dauert es 4,6 Jahre (0,52 Mio. € pro Jahr).',
    'Die Kasse von 5,1 Mio. € deckt die 2,4 Mio. €, die Kreditlinie von 2,0 Mio. € ist ungenutzt.',
  ]);
  frame(s, 7, 'Quellen: ' + SRC_SZ + '; ' + SRC_ANL + '. Angaben zu Kasse und Kreditlinie ohne benannte Quelle. Verlauf berechnet: −2,4 Mio. € Invest plus Nettobeitrag × Jahre, linear ab Produktionsstart (Vereinfachung).',
    'Kumulierter Nettobeitrag Linie 2 nach Investition, Mio. €, Jahre ab Produktionsstart (linear gerechnet)');
  s.addNotes('Amortisation laut Szenariorechnung: 3,1 Jahre (0,78 Mio. € pro Jahr) und 4,6 Jahre (0,52 Mio. € pro Jahr). Der Kurvenverlauf ist eine lineare Vereinfachung ab Produktionsstart (Q2/27), nicht Teil der Szenariorechnung.');
}

// ---------- 8 P09 before-after (two options along the same rows) ----------
{
  const s = pres.addSlide({ masterName: 'P09 before-after' });
  s.addText([{ text: 'Wir beantragen 2,4 Mio.\u00A0€ für Linie 2', options: { breakLine: true } }, { text: 'und bis Q2/27 die Auslagerung des Schweißens' }], { placeholder: 'title' });
  const xl = col(3), wl = span(5), xr = col(8), wr = span(5);
  T(s, 'Überbrückung: Rahmenschweißen auslagern', xl, 156, wl, 20, { bold: true });
  T(s, 'Dauerlösung: zweite Montagelinie', xr, 156, wr, 20, { bold: true });
  const rows = [
    ['Kapazität', '+300 Stück pro Quartal, wirksam nach 8 Wochen', '+900 Stück pro Quartal ab Q2/27'],
    ['Kosten', 'Mehrkosten 180 € je Rad, rund 54 T€ pro Quartal', 'Invest 2,4 Mio. €'],
    ['Ergebnis', 'Gilt, bis Linie 2 anläuft; ersetzt sie nicht', 'Nettobeitrag 0,78 Mio. € pro Jahr, Amortisation 3,1 Jahre (Stagnation: 0,52 Mio. €, 4,6 Jahre)'],
  ];
  const y = [184, 250, 316]; const rh = 60;
  rows.forEach(([lab, l, r], i) => {
    s.addShape(pres.ShapeType.line, { x: IN(M), y: IN(y[i]), w: IN(864), h: 0, line: { color: C.rule, width: 1 } });
    T(s, lab, M, y[i] + 10, span(2), 20, { bold: true, color: C.muted });
    T(s, l, xl, y[i] + 10, wl, rh - 12);
    T(s, r, xr, y[i] + 10, wr, rh - 12);
  });
  s.addShape(pres.ShapeType.line, { x: IN(M), y: IN(382), w: IN(864), h: 0, line: { color: C.rule, width: 1 } });
  T(s, [
    { text: 'Beschlussvorschlag: ', options: { bold: true, color: C.accent } },
    { text: '2,4' + NB + 'Mio.' + NB + '€ für Linie 2 freigeben, bis dahin das Rahmenschweißen auslagern.', options: { bold: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Liquidität: 5,1' + NB + 'Mio.' + NB + '€ Kasse und 2,0' + NB + 'Mio.' + NB + '€ ungenutzte Kreditlinie.' },
  ], M, 392, 864, 64);
  frame(s, 8, 'Quellen: ' + SRC_ANL + '; ' + SRC_SZ + '. Angaben zu Auslagerung, Kasse und Kreditlinie ohne benannte Quelle. Berechnet: 54 T€ pro Quartal (300 Stück × 180 €).');
  s.addNotes('Beschluss laut Auftrag: 2,4 Mio. € für die zweite Montagelinie freigeben und bis dahin das Rahmenschweißen auslagern. Keine Alternativoption dargestellt, dafür liegen keine Zahlen vor.');
}

pres.writeFile({ fileName: __dirname + '/kessler-beiratsvorlage-q3-2026.pptx' }).then((f) => console.log(f));
