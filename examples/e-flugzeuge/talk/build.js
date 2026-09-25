// Deck "talk": Keynote Fliegen ohne Kerosin, image-led version. Executes talk/plan.md.
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source, ground, plate } = require('../lib');

const C = { bg: '4C2FBF', white: 'FFFFFF', soft: 'E4DEFA' };
const F = 'Arial';
const S = { titleSlide: 64, title: 40, number: 96, support: 28, foot: 12 };
const A = (n) => path.join(__dirname, '..', 'assets', `talk-${n}.png`);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Fliegen ohne Kerosin (Beispieldaten)';

const base = { font: F, bg: C.bg, titleColor: C.white, titleBold: false };
master(pres, 'title', { ...base, titleSize: S.titleSlide, title: [48, 160, 480, 160] });
master(pres, 'statement', { ...base, titleSize: S.title, title: [48, 48, 480, 104] });
master(pres, 'units', { ...base, titleSize: S.title, title: [48, 48, 480, 104] });

const text = (s, t, x, y, w, h, size, color, bold) => s.addText(t, { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: size, color, bold: !!bold, align: 'left', valign: 'top', margin: 0, isTextBox: true, fill: { color: C.bg } });
const src = (s) => { plate(s, pres, 48, 456, 216, 16, C.bg); source(s, 'Quelle: Beispieldaten (erfunden)', { font: F, size: S.foot, color: C.soft, w: 216, h: 16 }); };

function slide(layout, art, alt, title, number, label, notes, withSource = true, titleBox = [48, 48, 480, 104]) {
  const s = pres.addSlide({ masterName: layout });
  ground(s, A(art), alt);
  plate(s, pres, ...titleBox, C.bg);
  s.addText(title, { placeholder: 'title' });
  if (number) text(s, number, 48, 232, 352, 112, S.number, C.white, true);
  if (label) text(s, label, 48, number ? 360 : 232, 416, 40, S.support, C.soft, false);
  if (withSource) src(s);
  s.addNotes(notes);
  return s;
}

let s = pres.addSlide({ masterName: 'title' });
ground(s, A('title'), 'Illustration: Elektroflugzeug mit vier Propellern in der Draufsicht über Reichweitenringen');
plate(s, pres, 48, 160, 480, 160, C.bg);
s.addText('Fliegen ohne Kerosin', { placeholder: 'title' });
text(s, 'Keynote, Beispieldaten', 48, 336, 480, 40, S.support, C.soft, false);
s.addNotes('Begrüßung. Hinweis: Alle Zahlen dieser Keynote sind erfundene Beispieldaten.');

slide('statement', 's2', 'Punktraster aus 100 Quadraten, 34 davon weiß gefüllt', 'Jeder dritte Flug ist kürzer als 300 km', '34 %', 'aller Flüge unter 300 km',
  'Im Beispielnetz sind 34 % aller Flüge kürzer als 300 km. Das sind vor allem Regionalverbindungen zwischen Mittelstädten und Drehkreuzen. Das Raster zeigt 100 Flüge, 34 sind gefüllt. Erfundene Zahl.');
slide('statement', 's3', 'Flugprofil eines kurzen Flugs: steiler Steigflug in Weiß, Reiseflug und Sinkflug gepunktet', 'Kurze Flüge fressen das meiste Kerosin', '+38 %', 'Kerosin je Sitzkilometer',
  'Start und Steigflug verbrauchen den größten Teil der Energie. Auf kurzen Strecken verteilt sich dieser Anteil auf wenige Kilometer: im Beispiel 38 % mehr Kerosin je Sitzkilometer als auf mittlerer Strecke. Das Bild zeigt den Steigflug hervorgehoben. Erfundene Zahl.');
slide('statement', 's4', 'Zwei Säulen: Turboprop hoch, E-Flugzeug um 22 Prozent niedriger', 'Elektroantriebe sparen dort am meisten', '−22 %', 'Kosten je Sitzkilometer',
  'Beispielrechnung: 14,2 ct je Sitzkilometer beim Turboprop, 11,1 ct beim E-Flugzeug. Energie und Wartung sinken zusammen um 3,9 ct, das Kapital steigt um 0,8 ct. Erfundene Zahlen.');
slide('statement', 's5', 'Konzentrische Schallwellen um ein Flugzeug: weiß fünf Ringe für 67 Dezibel, gepunktet zwei weitere für 82 Dezibel', 'Der Startlärm sinkt um 15 Dezibel', '67 dB', 'statt 82 dB beim Turboprop',
  'Der Startlärm liegt beim E-Flugzeug bei 67 dB, beim Turboprop bei 82 dB. Die weißen Ringe zeigen die Reichweite des Lärms beim E-Flugzeug, die gepunkteten Ringe den zusätzlichen Bereich beim Turboprop. Erfundene Zahlen.');
slide('statement', 's6', 'Reichweitenring um einen Flughafen mit einem Flugzeug am Rand des weißen Rings', 'Die Batterie setzt die Grenze', '320 km', 'Reichweite inklusive Reserve',
  'Die Reichweite von 320 km enthält 45 Minuten Reserve. Jenseits davon bleibt der Turboprop das richtige Werkzeug. Erfundene Zahl.');
slide('units', 's7', 'Streckennetz mit 30 Strecken um einen Drehkreuz-Flughafen: 14 weiße Strecken liegen innerhalb des Rings von 320 Kilometern, 16 gepunktete außerhalb', 'Vierzehn von dreißig Strecken passen', null, 'Strecken im Netz',
  'Streckenkarte: 30 Strecken im Beispielnetz, 14 davon (weiß) liegen innerhalb von 320 km. Das sind 47 % der Strecken und 38 % der Passagiere. Erfundene Zahlen.');
slide('statement', 's8', 'Vier Flugzeuge in Formation über einem Ring', 'Wir starten 2028 mit dem Pilotbetrieb', '4', 'Flugzeuge auf drei Strecken',
  'Vorschlag: vier Flugzeuge, zwei Flughäfen mit Schnelllader, drei Strecken. Budget im Beispiel 49,2 Mio. Euro. Erfundene Zahlen. Danach Fragen.', false);

pres.writeFile({ fileName: path.join(__dirname, 'deck.pptx') }).then(() => console.log('written'));
