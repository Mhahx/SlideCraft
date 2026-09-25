// Deck "talk": Keynote Fliegen ohne Kerosin. Executes talk/plan.md.
const pptxgen = require('pptxgenjs');
const path = require('path');
const { pt, master, source } = require('../lib');

const C = { bg: '4C2FBF', white: 'FFFFFF', soft: 'E4DEFA' };
const F = 'Arial';
const S = { titleSlide: 64, title: 40, number: 96, support: 28, foot: 12 };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Fliegen ohne Kerosin (Beispieldaten)';

const base = { font: F, bg: C.bg, titleColor: C.white, titleBold: false };
master(pres, 'title', { ...base, titleSize: S.titleSlide, title: [48, 160, 864, 80] });
master(pres, 'statement', { ...base, titleSize: S.title, title: [48, 48, 864, 56] });
master(pres, 'units', { ...base, titleSize: S.title, title: [48, 48, 864, 56] });

const text = (s, t, x, y, w, h, size, color, bold) => s.addText(t, { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fontFace: F, fontSize: size, color, bold: !!bold, align: 'left', valign: 'top', margin: 0, isTextBox: true });
const src = (s) => source(s, 'Quelle: Beispieldaten (erfunden)', { font: F, size: S.foot, color: C.soft });

function statement(title, number, label, notes, withSource = true) {
  const s = pres.addSlide({ masterName: 'statement' });
  s.addText(title, { placeholder: 'title' });
  text(s, number, 48, 192, 352, 120, S.number, C.white, true);
  text(s, label, 48, 328, 416, 40, S.support, C.soft, false);
  if (withSource) src(s);
  s.addNotes(notes);
}

let s = pres.addSlide({ masterName: 'title' });
s.addText('Fliegen ohne Kerosin', { placeholder: 'title' });
text(s, 'Keynote, Beispieldaten', 48, 264, 480, 40, S.support, C.soft, false);
s.addNotes('Begrüßung. Hinweis: Alle Zahlen dieser Keynote sind erfundene Beispieldaten.');

statement('Jeder dritte Flug ist kürzer als 300 km', '34 %', 'aller Flüge unter 300 km',
  'Im Beispielnetz sind 34 % aller Flüge kürzer als 300 km. Das sind vor allem Regionalverbindungen zwischen Mittelstädten und Drehkreuzen. Erfundene Zahl.');
statement('Kurze Flüge fressen das meiste Kerosin', '+38 %', 'Kerosin je Sitzkilometer',
  'Start und Steigflug verbrauchen den größten Teil der Energie. Auf kurzen Strecken verteilt sich dieser Anteil auf wenige Kilometer: im Beispiel 38 % mehr Kerosin je Sitzkilometer als auf mittlerer Strecke. Erfundene Zahl.');
statement('Elektroantriebe sparen dort am meisten', '−22 %', 'Kosten je Sitzkilometer',
  'Beispielrechnung: 14,2 ct je Sitzkilometer beim Turboprop, 11,1 ct beim E-Flugzeug. Energie und Wartung sinken zusammen um 3,9 ct, das Kapital steigt um 0,8 ct. Erfundene Zahlen.');
statement('Der Startlärm sinkt um 15 Dezibel', '67 dB', 'statt 82 dB beim Turboprop',
  'Der Startlärm liegt beim E-Flugzeug bei 67 dB, beim Turboprop bei 82 dB. Für Flughäfen in Stadtnähe ist das der zweite Vorteil neben den Kosten. Erfundene Zahlen.');
statement('Die Batterie setzt die Grenze', '320 km', 'Reichweite inklusive Reserve',
  'Die Reichweite von 320 km enthält 45 Minuten Reserve. Jenseits davon bleibt der Turboprop das richtige Werkzeug. Erfundene Zahl.');

// 7: unit chart, 30 routes, 14 within range
s = pres.addSlide({ masterName: 'units' });
s.addText('Vierzehn von dreißig Strecken passen', { placeholder: 'title' });
for (let i = 0; i < 30; i++) {
  const col = i % 10, row = Math.floor(i / 10);
  const filled = i < 14;
  s.addShape(pres.shapes.RECTANGLE, { x: pt(48 + col * 32), y: pt(192 + row * 32), w: pt(24), h: pt(24),
    fill: filled ? { color: C.white } : { type: 'none' }, line: { color: C.white, width: 1.5 } });
}
text(s, 'Strecken im Netz', 48, 312, 416, 40, S.support, C.soft, false);
src(s);
s.addNotes('Punktediagramm: 30 Strecken im Beispielnetz, 14 davon (gefüllt) liegen innerhalb von 320 km. Das sind 47 % der Strecken und 38 % der Passagiere. Erfundene Zahlen.');

statement('Wir starten 2028 mit dem Pilotbetrieb', '4', 'Flugzeuge auf drei Strecken',
  'Vorschlag: vier Flugzeuge, zwei Flughäfen mit Schnelllader, drei Strecken. Budget im Beispiel 49,2 Mio. Euro. Erfundene Zahlen. Danach Fragen.', false);

pres.writeFile({ fileName: path.join(__dirname, 'deck.pptx') }).then(() => console.log('written'));
