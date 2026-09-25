const PptxGenJS = require('pptxgenjs');
const { directionA } = require('./theme');
const P = require('./patterns');
const { pt2in, ZONE } = require('./geom');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
const theme = directionA;
P.ensureMasters(pptx, theme);

const QUELLE = 'Quelle: Beispieldaten zur Illustration, nicht real erhoben · 2026';

// 1. Cover ---------------------------------------------------------------
P.addCover(pptx, theme, {
  title: '5.000 neue Bäume für kühlere Straßen',
  subtitle: 'Klimakonferenz der Stadt · Vorschlag für 2026–2030',
  notes: 'Begrüßung. Anlass benennen: Klimakonferenz der Stadt. Eine Zeile zum Thema: Warum Stadtbäume die Straßen kühlen, und warum wir 5.000 neue brauchen.',
});

// 2. Problem (P14 statement, no diagram) ----------------------------------
P.addStatement(pptx, theme, {
  title: 'Asphalt ohne Bäume heizt unsere Straßen auf',
  notes: 'Bild aufbauen: Mittagshitze auf blanker Straße, kein Schatten, kein Grün. Überleitung: was, wenn hier Bäume stünden? Genau das zeigen die nächsten Folien: ein messbarer Effekt, keine Stimmung.',
});

// 3. Key number: cooling effect (P13) --------------------------------------
P.addKeyNumber(pptx, theme, {
  title: 'Baumkronen kühlen die Straße um 10 Grad',
  number: '10 °C',
  context: 'Unterschied Oberfläche: beschattet – offen',
  source: QUELLE,
  exhibitSide: 'left',
  notes: 'Beispielmessung, Mittagszeit im Hochsommer: Oberflächentemperatur unter Baumkronen gegen offene, unbeschattete Straße. Ausdrücklich als Beispielwert kennzeichnen, keine reale Messreihe dieser Stadt. Zwei Effekte stecken dahinter, dazu gleich mehr.',
});

// 4. Comparison chart (P05) -------------------------------------------------
P.addChartFocus(pptx, theme, {
  title: 'Beschattete Straßen bleiben deutlich kühler',
  bars: [
    { label: 'kahl', value: 38, focus: false },
    { label: 'wenig', value: 34, focus: false },
    { label: 'mittel', value: 31, focus: false },
    { label: 'dicht', value: 28, focus: true },
  ],
  unit: 'Oberflächentemperatur, °C',
  valueSuffix: '°',
  source: 'Quelle: Beispieldaten (Oberflächentemperatur, °C), nicht real erhoben · 2026',
  notes: 'Vier Straßentypen nach Kronendachdeckung: kahl, wenig, mittel, dicht bepflanzt (Beispielwerte, Mittagszeit Hochsommer). Je dichter das Kronendach, desto kühler die Oberfläche — daher der fokussierte Balken rechts.',
});

// 5. Mechanism (P14 statement + diagram) ------------------------------------
// Uses P.P14_DIAGRAM_ZONE (a fixed upper band, y 60-310) so the diagram never overlaps the P14
// title placeholder, which starts at y=340 (see the master definition and REPORT.md: the first
// version of this diagram used the general-pattern ZONE.body coordinates, which overlap P14's own
// title position, since P14 is exempt from the general Frame and has its own geometry).
function mechanismDiagram(slide, theme) {
  const z = P.P14_DIAGRAM_ZONE;
  const groundY = z.y + z.h - 40;      // the street line, near the bottom of the band
  const left = z.x, right = z.x + z.w;
  const treeX = left + z.w * 0.28;     // canopy sits over the left third of the street

  // street line, full width of the band: bare on the right, shaded under the canopy on the left
  slide.addShape('line', { x: pt2in(left), y: pt2in(groundY), w: pt2in(right - left), h: 0, line: { color: theme.neutral, width: 2 } });
  // canopy + trunk
  slide.addShape('ellipse', { x: pt2in(treeX - 70), y: pt2in(groundY - 130), w: pt2in(140), h: pt2in(80), fill: { color: theme.positive }, line: { type: 'none' } });
  slide.addShape('rect', { x: pt2in(treeX - 6), y: pt2in(groundY - 55), w: pt2in(12), h: pt2in(55), fill: { color: theme.neutral }, line: { type: 'none' } });
  // evapotranspiration: an upward arrow out of the canopy
  slide.addShape('rightArrow', { x: pt2in(treeX - 8), y: pt2in(groundY - 180), w: pt2in(16), h: pt2in(40), rotate: -90, fill: { color: theme.positive }, line: { type: 'none' } });
  // sun rays: blocked above the canopy (short, stop at the canopy top), reaching all the way to the
  // bare street on the right (long) — the visual contrast the diagram exists to make.
  slide.addShape('line', { x: pt2in(treeX - 30), y: pt2in(z.y), w: pt2in(-16), h: pt2in(groundY - 130 - z.y), line: { color: theme.negative, width: 2, dashType: 'dash' } });
  for (let i = 0; i < 3; i++) {
    const rx = right - 130 + i * 40;
    slide.addShape('line', { x: pt2in(rx), y: pt2in(z.y), w: pt2in(-22), h: pt2in(groundY - z.y), line: { color: theme.negative, width: 2, dashType: 'dash' } });
  }
  // No on-slide labels: talk profile keeps this to shapes only (the deck-wide 90-character ceiling
  // has no room left after the title for label strings; see REPORT.md). The diagram is explained
  // verbally and in the speaker notes instead.
}
P.addStatement(pptx, theme, {
  title: 'Schatten und Verdunstung kühlen die Luft',
  diagram: mechanismDiagram,
  notes: 'Zwei physikalische Effekte, keine Metapher: (1) das Kronendach blockt einen Teil der Sonnenstrahlung, bevor sie den Asphalt erreicht; (2) Bäume verdunsten Wasser über die Blätter (Evapotranspiration) und entziehen der Umgebungsluft dabei Wärme, wie Schwitzen. Beides zusammen erklärt die 10 Grad von vorhin. Grafik ist ein Schema, keine reale Messgrafik, daher ohne Alt-Text-Pflicht wie ein Foto — Beschreibung hier in den Notizen: links ein Baum blockt Strahlung und verdunstet Wasser nach oben, rechts trifft die Sonne ungehindert auf die kahle Fläche.',
});

// 6. Health impact (P13) ----------------------------------------------------
P.addKeyNumber(pptx, theme, {
  title: 'Hitzetage erhöhen Notaufnahmen um ein Drittel',
  number: '+33 %',
  context: 'Hitzetage vs. milde Tage',
  source: QUELLE,
  exhibitSide: 'left',
  notes: 'Beispielrechnung, keine Studie dieser Stadt: an Hitzetagen mehr Notaufnahmen wegen Kreislaufproblemen, besonders bei älteren Menschen und kleinen Kindern. Kühlere Straßen sind auch ein Gesundheitsthema, nicht nur ein Komfortthema.',
});

// 7. Timeline (P11) ---------------------------------------------------------
P.addTimeline(pptx, theme, {
  title: '5.000 Bäume entstehen in vier Bauphasen',
  stations: [
    { year: 2026, tag: 'Priorität' },
    { year: 2027, tag: 'Pflanzung' },
    { year: 2029, tag: 'Ausbau' },
    { year: 2030, tag: 'Ziel' },
  ],
  notes: 'Vorschlag des Referenten, kein extern erhobener Wert: 2026 Priorisierung der heißesten Straßenzüge, ab 2027 erste Pflanzungen, 2028-29 Hauptphase mit dem Gros der 5.000 Bäume, 2030 Abschluss und Kontrolle des Anwuchserfolgs.',
});

// 8. Priority districts (P05) ------------------------------------------------
P.addChartFocus(pptx, theme, {
  title: 'Die heißesten Straßen bekommen zuerst Bäume',
  bars: [
    { label: 'Zentrum', value: 42, focus: true },
    { label: 'Ostend', value: 35, focus: false },
    { label: 'Vorstadt', value: 27, focus: false },
    { label: 'Ring', value: 19, focus: false },
  ],
  unit: 'Wärmebelastungstage pro Jahr',
  source: 'Quelle: Beispieldaten (Wärmebelastungstage/Jahr), nicht real erhoben · 2026',
  notes: 'Beispielwerte je Stadtteil: Anzahl der Tage mit hoher Wärmebelastung pro Jahr. Priorisierung folgt der Belastung, nicht dem Zufall oder der Verfügbarkeit von Flächen — das am stärksten betroffene Zentrum zuerst (fokussierter Balken).',
});

// 9. Cost comparison (P13) --------------------------------------------------
P.addKeyNumber(pptx, theme, {
  title: 'Ein Straßenbaum kostet weniger als Kühlung',
  number: '4×',
  context: 'Weniger Folgekosten als anteilige Kühltechnik',
  source: QUELLE,
  exhibitSide: 'left',
  notes: 'Beispielrechnung über die Lebensdauer eines Straßenbaums (Pflanzung, Pflege, ca. 25 Jahre) gegen die anteiligen Mehrkosten für Klimaanlagen und Kühlung in angrenzenden Gebäuden an Hitzetagen. Als Beispielrechnung kennzeichnen, keine Kostenstudie dieser Stadt.',
});

// 10. Call to action (P14) --------------------------------------------------
P.addStatement(pptx, theme, {
  title: 'Beschließen Sie heute 5.000 neue Bäume',
  notes: 'Appell: Beschlussvorlage liegt vor, Zeitplan beginnt 2026 mit der Priorisierung. Bitte um Zustimmung des Stadtrats. Dank an das Publikum, Angebot für Rückfragen im Anschluss.',
});

pptx.writeFile({ fileName: 'deck.pptx' }).then(() => console.log('deck written'));
