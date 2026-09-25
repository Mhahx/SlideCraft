// Audit 2026-09-25: baut ein typisches KI-Deck (Karten in Karten, Icon-Kacheln, Kennzahl-Karten, 2x2-Kartenraster mit Seitenstreifen und 01/02-Nummern)
// und prüft, ob scripts/check_deck.py die Muster erkennt. Aufruf: NODE_PATH=<node_modules mit pptxgenjs> node audit/slop-test.js
// dann: python3 scripts/check_deck.py slop2.pptx --profile read
const P = require('pptxgenjs');
const p = new P(); p.layout = 'LAYOUT_WIDE'; p.defineSlideMaster({ title: 'M', objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 0.667, y: 0.667, w: 12, h: 0.8, fontFace: 'Arial', fontSize: 28, bold: true, color: '1F2937' }, text: '' } }] });
const F = 'Arial', INK = '1F2937', MUTED = '4B5563', ACC = '2563EB', CARD = 'F3F4F6', LINE='D1D5DB';
function title(s, t) {
  s.addText(t, { placeholder: 'title' });
}
// Slide 1: outer rounded panel containing three rounded cards, each with an icon tile + heading + text
let s = p.addSlide({ masterName: 'M' });
title(s, 'Drei Hebel senken die Betriebskosten um 18 Prozent');
s.addShape('roundRect', { x: 0.667, y: 1.7, w: 12, h: 4.9, fill: { color: 'F9FAFB' }, line: { color: LINE, width: 1 }, rectRadius: 0.2 });
const cards = [['Energie', 'Strompreise sinken durch langfristige Verträge.'], ['Wartung', 'Weniger bewegliche Teile senken die Wartungskosten.'], ['Personal', 'Kleinere Crews auf kurzen Strecken.']];
cards.forEach((c, i) => {
  const x = 1.0 + i * 3.9;
  s.addShape('roundRect', { x, y: 2.0, w: 3.6, h: 4.3, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 1 }, rectRadius: 0.15 });
  s.addShape('roundRect', { x: x + 0.3, y: 2.3, w: 0.7, h: 0.7, fill: { color: 'DBEAFE' }, line: { type: 'none' }, rectRadius: 0.12 });
  s.addShape('ellipse', { x: x + 0.47, y: 2.47, w: 0.36, h: 0.36, fill: { color: ACC }, line: { type: 'none' } });
  s.addText(c[0], { x: x + 0.3, y: 3.2, w: 3.0, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: INK, isTextBox: true });
  s.addText(c[1], { x: x + 0.3, y: 3.75, w: 3.0, h: 1.2, fontFace: F, fontSize: 14, color: MUTED, isTextBox: true });
});
// Slide 2: hero metric template, three stat cards with accent top bars
s = p.addSlide({ masterName: 'M' });
title(s, 'Die Flotte fliegt günstiger, leiser und sauberer');
[['-18 %', 'Betriebskosten'], ['-60 %', 'Lärm'], ['0 g', 'CO2 im Flug']].forEach((m, i) => {
  const x = 0.667 + i * 4.1;
  s.addShape('roundRect', { x, y: 2.0, w: 3.8, h: 3.2, fill: { color: CARD }, line: { type: 'none' }, rectRadius: 0.15 });
  s.addShape('rect', { x, y: 2.0, w: 0.08, h: 3.2, fill: { color: ACC }, line: { type: 'none' } });
  s.addText(m[0], { x: x + 0.3, y: 2.4, w: 3.3, h: 1.3, fontFace: F, fontSize: 54, bold: true, color: ACC, isTextBox: true });
  s.addText(m[1], { x: x + 0.3, y: 3.8, w: 3.3, h: 0.6, fontFace: F, fontSize: 16, color: MUTED, isTextBox: true });
});
s.addText('Quelle: Beispieldaten, 2026', { x: 0.667, y: 6.4, w: 6, h: 0.3, fontFace: F, fontSize: 10, color: MUTED, isTextBox: true });
// Slide 3: 2x2 grid of cards with left side stripes and numbered labels
s = p.addSlide({ masterName: 'M' });
title(s, 'Vier Schritte führen bis 2028 zum Linienbetrieb');
['Zulassung', 'Pilotstrecke', 'Ladeinfrastruktur', 'Flottenausbau'].forEach((t, i) => {
  const x = 0.667 + (i % 2) * 6.1, y = 1.8 + Math.floor(i / 2) * 2.5;
  s.addShape('roundRect', { x, y, w: 5.9, h: 2.2, fill: { color: CARD }, line: { type: 'none' }, rectRadius: 0.12 });
  s.addShape('rect', { x, y, w: 0.1, h: 2.2, fill: { color: ACC }, line: { type: 'none' } });
  s.addText('0' + (i + 1), { x: x + 0.35, y: y + 0.25, w: 1, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: ACC, isTextBox: true });
  s.addText(t, { x: x + 0.35, y: y + 0.7, w: 5.2, h: 0.5, fontFace: F, fontSize: 20, bold: true, color: INK, isTextBox: true });
  s.addText('Kurzbeschreibung des Schritts in einem Satz.', { x: x + 0.35, y: y + 1.25, w: 5.2, h: 0.6, fontFace: F, fontSize: 14, color: MUTED, isTextBox: true });
});
p.writeFile({ fileName: 'slop2.pptx' }).then(() => console.log('ok'));
