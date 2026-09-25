const PptxGenJS = require('pptxgenjs');
const { directionB } = require('./theme');
const P = require('./patterns');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
const theme = directionB;
P.ensureMasters(pptx, theme);

P.addCover(pptx, theme, {
  title: '5.000 neue Bäume für kühlere Straßen',
  subtitle: 'Klimakonferenz der Stadt · Vorschlag für 2026–2030',
  notes: 'Begrüßung, Anlass benennen (Klimakonferenz der Stadt), eine Zeile zum Thema.',
});

P.addKeyNumber(pptx, theme, {
  title: 'Baumkronen kühlen die Straße um 10 Grad',
  number: '10 °C',
  context: 'Unterschied Oberfläche: beschattet – offen',
  source: 'Quelle: Beispieldaten zur Illustration, nicht real erhoben · 2026',
  exhibitSide: 'right',
  notes: 'Beispielmessung Mittagszeit Hochsommer, Oberflächentemperatur beschattete vs. offene Straße. Zahl ausdrücklich als Beispielwert kennzeichnen, keine reale Messreihe.',
});

pptx.writeFile({ fileName: 'drafts/direction-b.pptx' }).then(() => console.log('draft B written'));
