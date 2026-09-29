const pptxgen = require('pptxgenjs');
const P = v => v / 72;
const ACC = '0F5C5C', TXT = '1F2933', GREY = '595959', RULE = 'BFBFBF', WHITE = 'FFFFFF';
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Von Excel zum BI-Tool';
pres.author = 'Team';

const titleOpts = (color, size, y, w, h) => ({ name: 'title', type: 'title', x: P(48), y: P(y), w: P(w), h: P(h),
  fontFace: 'Cambria', fontSize: size, bold: true, color, align: 'left', valign: 'top', margin: 0 });
const pageNo = { x: P(852), y: P(486), w: P(60), h: P(20), fontFace: 'Calibri', fontSize: 9, color: GREY, align: 'right' };

['P10 numbered-rows', 'P09 before-after', 'P07 table', 'P11 timeline'].forEach(n =>
  pres.defineSlideMaster({ title: n, background: { color: WHITE },
    objects: [{ placeholder: { options: titleOpts(ACC, 28, 64, 864, 72), text: '' } }], slideNumber: pageNo }));
['P01 cover', 'P14 statement'].forEach(n =>
  pres.defineSlideMaster({ title: n, background: { color: ACC },
    objects: [{ placeholder: { options: titleOpts(WHITE, 36, 176, 571, 120), text: '' } }] }));

const txt = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, fontFace: 'Calibri', fontSize: 18, color: TXT, align: 'left', valign: 'middle', margin: 0 }, o));
const status = (s, t) => txt(s, t, { x: P(612), y: P(48), w: P(300), h: P(14), fontSize: 12, bold: true, color: GREY, align: 'right', valign: 'top' });
const rule = (s, y, x = 48, w = 864) => s.addShape(pres.ShapeType.line, { x: P(x), y: P(y), w: P(w), h: 0, line: { color: RULE, width: 0.75 } });

// 1 cover
let s = pres.addSlide({ masterName: 'P01 cover' });
s.addText('Von Excel zum BI-Tool: Warum wir wechseln sollten', { placeholder: 'title' });
txt(s, 'Entscheidungsvorschlag für das Team · Entwurf', { x: P(48), y: P(312), w: P(571), h: P(28), color: WHITE, valign: 'top' });
s.addNotes('Einstieg: Entscheidungsvorschlag. Der Entwurf enthält bewusst keine Zahlen; eigene Beispiele des Teams ergänzen.');

// 2 numbered rows
s = pres.addSlide({ masterName: 'P10 numbered-rows' });
s.addText('Excel kostet uns Zeit und Vertrauen in Zahlen', { placeholder: 'title' });
status(s, 'Ohne Belege');
const rows = [['Versionen', 'Mehrere Dateien, mehrere Wahrheiten'], ['Aktualisierung', 'Jeden Monat von Hand kopiert'],
  ['Fehler', 'Formelfehler fallen erst spät auf'], ['Wachstum', 'Große Dateien werden langsam']];
rows.forEach((r, i) => {
  const y = 156 + i * 64;
  rule(s, y);
  txt(s, String(i + 1), { x: P(48), y: P(y), w: P(40), h: P(64), bold: true, color: ACC });
  txt(s, r[0], { x: P(96), y: P(y), w: P(260), h: P(64), bold: true });
  txt(s, r[1], { x: P(400), y: P(y), w: P(512), h: P(64) });
});
rule(s, 156 + 4 * 64);
s.addNotes('Zu jeder Zeile ein eigenes Beispiel aus dem Team nennen. Die Zeilen sind Hypothesen, keine gemessenen Befunde.');

// 3 before-after
s = pres.addSlide({ masterName: 'P09 before-after' });
s.addText('Ein BI-Tool schafft eine gemeinsame Datenbasis', { placeholder: 'title' });
status(s, 'Ohne Belege');
const LX = 194.7, RX = 561, CW = 351;
txt(s, 'Heute in Excel', { x: P(LX), y: P(156), w: P(CW), h: P(28), bold: true, color: GREY });
txt(s, 'Mit BI-Tool', { x: P(RX), y: P(156), w: P(CW), h: P(28), bold: true, color: ACC });
const ba = [['Daten', 'Dateien per Mail', 'Eine zentrale Quelle'], ['Stand', 'Manuell aktualisiert', 'Automatisch aktuell'],
  ['Prüfung', 'Formeln im Verborgenen', 'Nachvollziehbare Logik']];
ba.forEach((r, i) => {
  const y = 192 + i * 72;
  rule(s, y);
  txt(s, r[0], { x: P(48), y: P(y), w: P(140), h: P(72), bold: true });
  txt(s, r[1], { x: P(LX), y: P(y), w: P(CW), h: P(72) });
  s.addShape(pres.ShapeType.chevron, { x: P(536), y: P(y + 28), w: P(10), h: P(16), fill: { color: GREY }, line: { type: 'none' } });
  txt(s, r[2], { x: P(RX), y: P(y), w: P(CW), h: P(72), bold: true, color: ACC });
});
rule(s, 192 + 3 * 72);
s.addNotes('Bewusst toolneutral: welches Produkt, klärt der Pilot. Kein Produktversprechen.');

// 4 table
s = pres.addSlide({ masterName: 'P07 table' });
s.addText('Excel bleibt für Ad-hoc-Analysen, BI übernimmt Standardreports', { placeholder: 'title' });
status(s, 'Ohne Belege');
const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: 'Calibri', fontSize: 18, color: TXT, valign: 'middle', align: 'left',
  border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: RULE }, { type: 'none' }] }, o) });
s.addTable([
  [cell('Aufgabe', { bold: true, color: GREY }), cell('Künftig in', { bold: true, color: GREY })],
  [cell('Einmalige Analysen'), cell('Excel', { color: GREY })],
  [cell('Monatsreporting'), cell('BI-Tool', { bold: true, color: ACC })],
  [cell('Team-Dashboards'), cell('BI-Tool', { bold: true, color: ACC })],
  [cell('Prototypen für Kennzahlen'), cell('Excel', { color: GREY })],
], { x: P(48), y: P(156), w: P(864), colW: [P(520), P(344)], rowH: P(48), margin: [0, 0, 0, 0] });
txt(s, 'Quelle: eigene Einschätzung, Stand 29.09.2026', { x: P(48), y: P(466), w: P(700), h: P(16), fontSize: 9, color: GREY, valign: 'top' });
s.addNotes('Ehrlich bleiben: Excel wird nicht abgeschafft, es verliert nur das Standardreporting.');

// 5 timeline
s = pres.addSlide({ masterName: 'P11 timeline' });
s.addText('Ein kleiner Pilot senkt das Wechselrisiko', { placeholder: 'title' });
status(s, 'Ohne Belege');
s.addShape(pres.ShapeType.line, { x: P(48), y: P(250), w: P(864), h: 0, line: { color: GREY, width: 1.5, endArrowType: 'triangle' } });
const ph = [['Phase 1', 'Einen Report auswählen'], ['Phase 2', 'Dashboard im BI-Tool bauen'], ['Phase 3', 'Team testet und bewertet'], ['Phase 4', 'Entscheidung über Rollout']];
ph.forEach((p, i) => {
  const x = 48 + i * 216, last = i === 3, c = last ? ACC : TXT;
  txt(s, p[0], { x: P(x), y: P(196), w: P(200), h: P(28), bold: true, color: c });
  s.addShape(pres.ShapeType.ellipse, { x: P(x), y: P(243), w: P(14), h: P(14), fill: { color: last ? ACC : GREY }, line: { type: 'none' } });
  txt(s, p[1], { x: P(x), y: P(274), w: P(190), h: P(64), valign: 'top', bold: last, color: c });
});
s.addShape(pres.ShapeType.rect, { x: P(48), y: P(384), w: P(864), h: P(56), fill: { color: 'F2F2F2' }, line: { type: 'none' } });
txt(s, 'Voraussetzung: einheitliche Kennzahlen-Definitionen', { x: P(64), y: P(384), w: P(832), h: P(56), bold: true });
s.addNotes('Ehrlicher Hinweis: Ohne geklärte Kennzahlen-Definitionen hilft kein Tool. Das Tool löst kein Datenqualitätsproblem.');

// 6 statement
s = pres.addSlide({ masterName: 'P14 statement' });
s.addText('Wir starten mit einem Pilot auf einem Report', { placeholder: 'title' });
txt(s, 'Heute entscheiden: welcher Report, wer leitet den Pilot', { x: P(48), y: P(312), w: P(571), h: P(56), color: WHITE, valign: 'top' });
s.addNotes('Entscheidung heute: Report wählen, Verantwortliche benennen.');

pres.writeFile({ fileName: 'deck.pptx' }).then(() => console.log('ok'));
