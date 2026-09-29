const pptxgen = require('/tmp/claude-0/pg/node_modules/pptxgenjs');

const IN = (pt) => pt / 72;
const M = IN(48);
const W = 13.333;

const YEARS = ['0', '1', '2', '3', '4', '5', '6'];
const BASE = [-2.4, -1.62, -0.84, -0.06, 0.72, 1.5, 2.28];
const STAG = [-2.4, -1.88, -1.36, -0.84, -0.32, 0.2, 0.72];

const TITLE7 = 'Linie 2 amortisiert sich in 3,1 Jahren, bei stagnierender Nachfrage in 4,6 Jahren';
const MEASURE7 = 'Kumulierter Nettobeitrag Linie 2 nach Investition, Mio.\u00A0€, Jahre ab Produktionsstart (linear gerechnet)';
const SOURCE7 = 'Quelle: Szenariorechnung Controlling, 02.10.2026; Angebot Anlagenlieferant, 18.09.2026. Verlauf berechnet: −2,4 Mio.\u00A0€ Invest plus Nettobeitrag × Jahre.';
const RAIL_HEAD = 'Was das für den Beschluss heißt';
const RAIL = [
  'Im Basisszenario ist die Investition nach 3,1 Jahren zurückverdient (0,78 Mio.\u00A0€ pro Jahr).',
  'Ohne weiteres Nachfragewachstum dauert es 4,6 Jahre (0,52 Mio.\u00A0€ pro Jahr).',
  'Die Kasse von 5,1 Mio.\u00A0€ deckt die 2,4 Mio.\u00A0€, die Kreditlinie von 2,0 Mio.\u00A0€ ist ungenutzt.',
];

const dirs = {
  A: {
    file: 'A-werkstatt.pptx',
    titleFont: 'Arial', bodyFont: 'Arial',
    ink: '1A1A1A', muted: '595959', neutral: '767676', accent: 'C2410C', ground: 'FFFFFF',
    coverGround: 'FFFFFF', coverInk: '1A1A1A', coverAccent: 'C2410C', field: null,
  },
  B: {
    file: 'B-jahresbericht.pptx',
    titleFont: 'Cambria', bodyFont: 'Calibri',
    ink: '111111', muted: '404040', neutral: '767676', accent: '111111', ground: 'FFFFFF',
    coverGround: 'FFC629', coverInk: '111111', coverAccent: '111111', field: 'EBEBEB',
  },
};

function build(key) {
  const d = dirs[key];
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Beiratsvorlage Kessler Lastenräder Q3 2026 (Entwurf ' + key + ')';

  const ph = (o) => ({ placeholder: { options: Object.assign({ name: 'title', type: 'title', fontFace: d.titleFont, bold: true, align: 'left', valign: 'top', margin: 0 }, o), text: '' } });
  pres.defineSlideMaster({
    title: 'P01 cover',
    background: { color: d.coverGround },
    objects: [ph({ x: M, y: IN(190), w: IN(700), h: IN(130), fontSize: 40, color: d.coverInk })],
  });
  pres.defineSlideMaster({
    title: 'P04 chart-rail',
    background: { color: d.ground },
    objects: [ph({ x: M, y: IN(64), w: IN(864), h: IN(58), fontSize: 24, color: d.ink })],
  });

  // ---------- Slide 1: P01 cover ----------
  const s1 = pres.addSlide({ masterName: 'P01 cover' });
  s1.addNotes('Entwurf ' + key + ': Titelfolie.');
  if (key === 'A') {
    s1.addText('Linie 2 freigeben, Rahmenschweißen auslagern', { placeholder: 'title' });
    s1.addText('Beiratsvorlage Q3 2026', {
      x: M, y: IN(64), w: IN(424), h: IN(20), fontFace: d.bodyFont, fontSize: 11, color: d.muted,
      isTextBox: true, margin: 0, align: 'left',
    });
    s1.addText([
      { text: 'Entscheidung über ' },
      { text: '2,4 Mio.\u00A0€', options: { bold: true, color: d.coverAccent } },
      { text: ' für die zweite Montagelinie. Kessler Lastenräder GmbH, Beirat.' },
    ], {
      x: M, y: IN(340), w: IN(560), h: IN(70), fontFace: d.bodyFont, fontSize: 18, color: d.muted,
      isTextBox: true, margin: 0, align: 'left', valign: 'top',
    });
  } else {
    s1.addText('Linie 2 freigeben, Rahmenschweißen auslagern', { placeholder: 'title' });
    s1.addText('Beiratsvorlage Q3 2026', {
      x: M, y: IN(64), w: IN(424), h: IN(20), fontFace: d.bodyFont, fontSize: 11, color: d.coverInk,
      isTextBox: true, margin: 0, align: 'left',
    });
    s1.addText('Entscheidung über 2,4 Mio.\u00A0€ für die zweite Montagelinie. Kessler Lastenräder GmbH, Beirat.', {
      x: M, y: IN(356), w: IN(560), h: IN(70), fontFace: d.bodyFont, fontSize: 18, color: d.coverInk,
      isTextBox: true, margin: 0, align: 'left', valign: 'top',
    });
  }

  // ---------- Slide 2: P04 chart-rail (Amortisation) ----------
  const s = pres.addSlide({ masterName: 'P04 chart-rail' });
  s.addNotes('Entwurf ' + key + ': Schlüsselfolie Amortisation. Verlauf berechnet, linear ab Produktionsstart.');

  // exhibit / rail geometry (12 columns, column 57.3 pt, gutter 16 pt)
  const col = (n) => 48 + (n - 1) * (57.3 + 16); // x of column n in pt
  let chartX, chartW, railX, railW;
  if (key === 'A') { chartX = col(1); chartW = 571; railX = col(9); railW = 277; }
  else { chartX = col(5); chartW = 571; railX = col(1); railW = 277; }

  s.addText([{ text: 'Linie 2 amortisiert sich in 3,1 Jahren,', options: { breakLine: true } }, { text: 'bei stagnierender Nachfrage in 4,6 Jahren' }], { placeholder: 'title' });
  s.addText(MEASURE7, {
    x: M, y: IN(124), w: IN(864), h: IN(18), fontFace: d.bodyFont, fontSize: 11, color: d.muted,
    isTextBox: true, margin: 0, align: 'left', valign: 'top',
  });

  const bodyTop = 156, bodyH = 300;
  if (d.field) {
    s.addShape(pres.ShapeType.rect, {
      x: IN(railX), y: IN(bodyTop), w: IN(railW), h: IN(bodyH),
      fill: { color: d.field }, line: { color: d.field, width: 0 },
    });
  }
  // rail
  const rx = railX + 16;
  const rw = railW - 32;
  if (key === 'A') {
    s.addShape(pres.ShapeType.line, { x: IN(railX), y: IN(bodyTop), w: 0, h: IN(bodyH), line: { color: d.neutral, width: 1 } });
  }
  const railRuns = [{ text: RAIL_HEAD, options: { bold: true, fontSize: 14, breakLine: true, paraSpaceAfter: 8 } }];
  RAIL.forEach((t, i) => railRuns.push({
    text: t,
    options: { fontSize: 14, breakLine: i < RAIL.length - 1, paraSpaceAfter: 10, bold: false },
  }));
  s.addText(railRuns, {
    x: IN(rx), y: IN(bodyTop + (d.field ? 16 : 0)), w: IN(rw), h: IN(bodyH - 16), fontFace: d.bodyFont, color: d.ink,
    isTextBox: true, margin: 0, align: 'left', valign: 'top',
  });

  // chart
  const chartLabelW = 150; // pt reserved on the right of the chart for direct labels
  s.addChart(pres.charts.LINE, [
    { name: 'Basisszenario', labels: YEARS, values: BASE },
    { name: 'Nachfrage stagniert', labels: YEARS, values: STAG },
  ], {
    x: IN(chartX), y: IN(bodyTop), w: IN(chartW - chartLabelW), h: IN(bodyH),
    chartColors: [d.accent, d.neutral], lineSize: 3, lineDataSymbol: 'none',
    showLegend: false, showTitle: false,
    valAxisMinVal: -2.5, valAxisMaxVal: 2.5, valAxisMajorUnit: 0.5,
    valAxisLabelFontSize: 11, valAxisLabelColor: d.muted, valAxisLabelFontFace: d.bodyFont,
    valAxisLabelFormatCode: '0.0',
    catAxisLabelFontSize: 11, catAxisLabelColor: d.muted, catAxisLabelFontFace: d.bodyFont,
    catAxisLabelPos: 'low',
    valGridLine: { color: 'D9D9D9', size: 0.5 }, catGridLine: { style: 'none' },
    showValue: false, dataLabelFontSize: 11,
    altText: 'Liniendiagramm: kumulierter Nettobeitrag Linie 2 in Mio. Euro über sechs Jahre. Basisszenario erreicht Null nach 3,1 Jahren, bei stagnierender Nachfrage nach 4,6 Jahren.',
  });
  // direct labels at the line ends (positions tuned after render)
  const lx = chartX + chartW - chartLabelW + 6;
  s.addText([
    { text: 'Basis: 0,78 Mio.\u00A0€ pro Jahr', options: { bold: true, breakLine: true } },
    { text: '3,1 Jahre', options: {} },
  ], { x: IN(lx), y: IN(bodyTop + 6), w: IN(chartLabelW - 6), h: IN(40), fontFace: d.bodyFont, fontSize: 11, color: d.accent === '111111' ? d.ink : d.accent, isTextBox: true, margin: 0, align: 'left', valign: 'top' });
  s.addText([
    { text: 'Stagnation: 0,52 Mio.\u00A0€ pro Jahr', options: { bold: true, breakLine: true } },
    { text: '4,6 Jahre', options: {} },
  ], { x: IN(lx), y: IN(bodyTop + 96), w: IN(chartLabelW - 6), h: IN(40), fontFace: d.bodyFont, fontSize: 11, color: d.muted, isTextBox: true, margin: 0, align: 'left', valign: 'top' });

  // source + page number
  s.addText(SOURCE7, {
    x: M, y: IN(466), w: IN(700), h: IN(36), fontFace: d.bodyFont, fontSize: 8, color: d.muted,
    isTextBox: true, margin: 0, align: 'left', valign: 'top',
  });
  s.addText('7', {
    x: IN(872), y: IN(488), w: IN(40), h: IN(16), fontFace: d.bodyFont, fontSize: 8, color: d.muted,
    isTextBox: true, margin: 0, align: 'right', valign: 'top',
  });

  return pres.writeFile({ fileName: __dirname + '/' + d.file });
}

Promise.all([build('A'), build('B')]).then((f) => console.log(f));
