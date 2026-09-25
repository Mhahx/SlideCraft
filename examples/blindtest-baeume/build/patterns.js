// Pattern builders for the talk-profile patterns used in this deck: P01, P05, P11, P13, P14.
// Geometry from patterns.md "Frame"; sizes from profiles.md "talk" column and rules-core.md.
// Deviations from the letter of the reference files are called out inline with "DEVIATION:".
const { pt2in, colSpan, colX, ZONE } = require('./geom');

const TITLE_SIZE = 40;   // talk: title >= 40 pt
const COVER_TITLE_SIZE = 50; // >=40*1.25: keeps the cover title a distinct step from the claim-title role
const BODY_SIZE = 24;    // talk: body/supporting text >= 24 pt
const FOOT_SIZE = 12;    // talk: footnote/source >= 12 pt
const KEY_NUMBER_SIZE = 96; // talk: "a key number of 60 pt or more is fine"
// DEVIATION: profiles.md gives no size floor for a "label" role (chart category/axis labels,
// timeline station tags). Applying the talk body floor (24 pt) literally to every chart category
// label would make a 4-bar chart's labels alone larger than the chart. We use 16 pt for these small
// labels, below the body floor and above the read floor (14 pt), and record this as a judgement call,
// not a measured pass. See REPORT.md.
const LABEL_SIZE = 16;

function ensureMasters(pptx, theme) {
  const g = theme.ground, t = theme.text;
  const titleOpts = (x, y, w, h) => ({
    name: 'title', type: 'title', x: pt2in(x), y: pt2in(y), w: pt2in(w), h: pt2in(h),
    fontFace: theme.titleFont, fontSize: TITLE_SIZE, bold: true, color: t, align: 'left', valign: 'top',
  });

  pptx.defineSlideMaster({
    title: 'P01 cover',
    background: { color: g },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: pt2in(96), y: pt2in(300), w: pt2in(700), h: pt2in(120), fontFace: theme.titleFont, fontSize: COVER_TITLE_SIZE, bold: true, color: t, align: 'left', valign: 'bottom' }, text: '' } },
      { placeholder: { options: { name: 'subtitle', type: 'body', x: pt2in(96), y: pt2in(430), w: pt2in(700), h: pt2in(40), fontFace: theme.bodyFont, fontSize: BODY_SIZE, color: t, align: 'left', valign: 'top' }, text: '' } },
    ],
  });

  pptx.defineSlideMaster({
    title: 'P05 chart-focus',
    background: { color: g },
    objects: [
      { placeholder: { options: titleOpts(ZONE.title.x, ZONE.title.y, ZONE.title.w, ZONE.title.h), text: '' } },
    ],
  });

  pptx.defineSlideMaster({
    title: 'P11 timeline',
    background: { color: g },
    objects: [
      { placeholder: { options: titleOpts(ZONE.title.x, ZONE.title.y, ZONE.title.w, ZONE.title.h), text: '' } },
    ],
  });

  pptx.defineSlideMaster({
    title: 'P13 key-numbers',
    background: { color: g },
    objects: [
      { placeholder: { options: titleOpts(ZONE.title.x, ZONE.title.y, ZONE.title.w, ZONE.title.h), text: '' } },
    ],
  });

  // P14 is exempt from the general Frame (patterns.md): its own layout is photo/graphic in the
  // upper band, statement below. DIAGRAM_ZONE (below) is the fixed area a P14 diagram may use; it is
  // kept clear of the title placeholder on purpose (see the slide-5 overlap fix in REPORT.md).
  pptx.defineSlideMaster({
    title: 'P14 statement',
    background: { color: g },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: pt2in(96), y: pt2in(322), w: pt2in(768), h: pt2in(168), fontFace: theme.titleFont, fontSize: COVER_TITLE_SIZE, bold: true, color: t, align: 'left', valign: 'top' }, text: '' } },
    ],
  });
}

function addSource(slide, theme, text) {
  slide.addText(text, {
    x: pt2in(ZONE.source.x), y: pt2in(ZONE.source.y), w: pt2in(ZONE.source.w), h: pt2in(ZONE.source.h),
    fontFace: theme.bodyFont, fontSize: FOOT_SIZE, color: theme.text, align: 'left', valign: 'top', isTextBox: true,
  });
}

function addRule(slide, theme, x, y, w) {
  slide.addShape('rect', { x: pt2in(x), y: pt2in(y), w: pt2in(w), h: pt2in(3), fill: { color: theme.accent }, line: { type: 'none' } });
}

// ---- P01 cover --------------------------------------------------------
function addCover(pptx, theme, { title, subtitle, notes }) {
  const slide = pptx.addSlide({ masterName: 'P01 cover' });
  slide.addText(title, { placeholder: 'title' });
  slide.addText(subtitle, { placeholder: 'subtitle' });
  addRule(slide, theme, 96, 478, 120);
  if (notes) slide.addNotes(notes);
  return slide;
}

// ---- P14 statement ------------------------------------------------------
function addStatement(pptx, theme, { title, diagram, notes }) {
  const slide = pptx.addSlide({ masterName: 'P14 statement' });
  slide.addText(title, { placeholder: 'title' });
  if (diagram) diagram(slide, theme);
  if (notes) slide.addNotes(notes);
  return slide;
}

// ---- P13 key-numbers ----------------------------------------------------
// exhibitSide: 'left' (number left, context right, direction A) | 'right' (context left, number right, direction B)
function addKeyNumber(pptx, theme, { title, number, context, source, exhibitSide, notes }) {
  const slide = pptx.addSlide({ masterName: 'P13 key-numbers' });
  slide.addText(title, { placeholder: 'title' });

  const numW = colSpan(5), ctxW = colSpan(6);
  const numX = exhibitSide === 'right' ? colX(8) : colX(1);
  const ctxX = exhibitSide === 'right' ? colX(1) : colX(7);
  const y = ZONE.body.y + 20;

  slide.addText(number, {
    x: pt2in(numX), y: pt2in(y), w: pt2in(numW), h: pt2in(170),
    fontFace: theme.titleFont, fontSize: KEY_NUMBER_SIZE, bold: true, color: theme.accent,
    align: 'left', valign: 'top', isTextBox: true,
  });
  slide.addText(context, {
    x: pt2in(ctxX), y: pt2in(y + 60), w: pt2in(ctxW), h: pt2in(140),
    fontFace: theme.bodyFont, fontSize: BODY_SIZE, color: theme.text,
    align: 'left', valign: 'top', isTextBox: true,
  });
  if (source) addSource(slide, theme, source);
  if (notes) slide.addNotes(notes);
  return slide;
}

// ---- P05 chart-focus ------------------------------------------------------
// bars: [{label, value, focus:boolean}], unit label string
function addChartFocus(pptx, theme, { title, bars, unit, valueSuffix, source, notes }) {
  const slide = pptx.addSlide({ masterName: 'P05 chart-focus' });
  slide.addText(title, { placeholder: 'title' });

  const colors = bars.map(b => (b.focus ? theme.accent : theme.neutral));
  const dataLabels = bars.map(b => `${b.value}${valueSuffix || ''}`);

  // DEVIATION: the series `name` is left empty on purpose. pptxgenjs writes it into the chart XML
  // even with the legend hidden, and check_deck.py's word/char counter reads it as slide text (found
  // by measuring: the unit text "Oberflächentemperatur, °C" pushed slide 8 over the talk profile's
  // 90-character ceiling). The unit now lives only in `altText` (screen-reader text, correctly not
  // counted as visible text) and in the plan; rules-core.md's "every exhibit has its measure and unit"
  // is met on-slide only through the alt text and the speaker notes, not through visible chart text.
  slide.addChart('bar', [{
    name: '',
    labels: bars.map(b => b.label),
    values: bars.map(b => b.value),
  }], {
    x: pt2in(ZONE.body.x), y: pt2in(ZONE.body.y + 10), w: pt2in(colSpan(12)), h: pt2in(260),
    barDir: 'col',
    chartColors: colors,
    showLegend: false,
    showTitle: false,
    showValAxisLine: false,
    valAxisHidden: true,
    catAxisLabelColor: theme.text,
    catAxisLabelFontSize: LABEL_SIZE,
    catAxisLabelFontFace: theme.bodyFont,
    catAxisLineColor: theme.neutral,
    valGridLine: { style: 'none' },
    catGridLine: { style: 'none' },
    showDataTable: false,
    dataLabelColor: theme.text,
    dataLabelFontSize: LABEL_SIZE,
    dataLabelFontFace: theme.bodyFont,
    showValue: true,
    dataLabelPosition: 'outEnd',
    barGapWidthPct: 35,
    plotArea: { fill: { color: theme.ground } },
    chartArea: { fill: { color: theme.ground } },
    altText: `Balkendiagramm: ${title}. Werte: ${bars.map(b => `${b.label} ${b.value}${valueSuffix || ''}`).join(', ')}. ${unit || ''}`.trim(),
  });

  if (source) addSource(slide, theme, source);
  if (notes) slide.addNotes(notes);
  return slide;
}

// ---- P11 timeline -----------------------------------------------------
// stations: [{year, tag}]
function addTimeline(pptx, theme, { title, stations, band, notes }) {
  const slide = pptx.addSlide({ masterName: 'P11 timeline' });
  slide.addText(title, { placeholder: 'title' });

  const axisY = ZONE.body.y + 60;
  const left = ZONE.body.x, right = ZONE.body.x + ZONE.body.w;
  slide.addShape('line', {
    x: pt2in(left), y: pt2in(axisY), w: pt2in(right - left), h: 0,
    line: { color: theme.neutral, width: 1.5 },
  });

  const n = stations.length;
  const markerInset = 7; // keeps the 12 pt marker circle itself inside the 48 pt margin at the ends
  const step = (right - markerInset - (left + markerInset)) / (n - 1);
  const boxW = 120;
  stations.forEach((s, i) => {
    const cx = left + markerInset + i * step;
    const isLast = i === n - 1;
    slide.addShape('ellipse', {
      x: pt2in(cx - 6), y: pt2in(axisY - 6), w: pt2in(12), h: pt2in(12),
      fill: { color: isLast ? theme.accent : theme.neutral }, line: { type: 'none' },
    });
    // Edge stations' label boxes are kept inside the 48 pt margin (left-aligned at the first
    // station, right-aligned at the last) instead of centred on cx, which would run the box off
    // the slide; interior stations stay centred on the axis marker.
    let boxX, align;
    if (i === 0) { boxX = cx; align = 'left'; }
    else if (isLast) { boxX = cx - boxW; align = 'right'; }
    else { boxX = cx - boxW / 2; align = 'center'; }
    slide.addText(String(s.year), {
      x: pt2in(boxX), y: pt2in(axisY + 16), w: pt2in(boxW), h: pt2in(26),
      fontFace: theme.bodyFont, fontSize: LABEL_SIZE, color: theme.text, align, isTextBox: true,
    });
    slide.addText(s.tag, {
      x: pt2in(boxX), y: pt2in(axisY + 44), w: pt2in(boxW), h: pt2in(40),
      fontFace: theme.bodyFont, fontSize: LABEL_SIZE, color: theme.text, align, isTextBox: true,
    });
  });

  if (band) {
    slide.addText(band, {
      x: pt2in(left), y: pt2in(axisY + 110), w: pt2in(right - left), h: pt2in(60),
      fontFace: theme.bodyFont, fontSize: BODY_SIZE, color: theme.text, align: 'left', isTextBox: true,
    });
  }
  if (notes) slide.addNotes(notes);
  return slide;
}

// Fixed upper-band area a P14 diagram may use, clear of the title placeholder at y=340+.
const P14_DIAGRAM_ZONE = { x: 96, y: 60, w: 768, h: 230 };

module.exports = {
  ensureMasters, addCover, addStatement, addKeyNumber, addChartFocus, addTimeline,
  TITLE_SIZE, COVER_TITLE_SIZE, BODY_SIZE, FOOT_SIZE, KEY_NUMBER_SIZE, LABEL_SIZE, P14_DIAGRAM_ZONE,
};
