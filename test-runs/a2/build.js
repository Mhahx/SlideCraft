const pptxgen = require('/tmp/claude-0/-home-user-slidecraft/d0639775-d66a-54ad-9c24-82927bdee3d4/scratchpad/node_modules/pptxgenjs');
const OR = 'E8491D', INK = '141414', GREY = '595959', W = 'FFFFFF', F = 'Arial';
const M = 0.667, CW = 12.0;
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Von Excel zu BI: Vorschlag für einen Pilot';

const titleOpts = (x, y, w, h) => ({ placeholder: { options: { name: 'title', type: 'title', x, y, w, h, fontFace: F, fontSize: 44, bold: true, color: INK, align: 'left', valign: 'top', margin: 0 }, text: '' } });
pres.defineSlideMaster({ title: 'P01 cover', background: { color: OR }, objects: [titleOpts(M, 2.6, 9.4, 1.8)] });
pres.defineSlideMaster({ title: 'P14 statement', background: { color: W }, objects: [titleOpts(M, 2.3, 8.0, 2.3)] });
pres.defineSlideMaster({ title: 'P13 key-numbers', background: { color: W }, objects: [titleOpts(M, M, 11.0, 1.5)] });
pres.defineSlideMaster({ title: 'P09 before-after', background: { color: W }, objects: [titleOpts(M, M, 11.0, 1.5)] });
pres.defineSlideMaster({ title: 'P11 timeline', background: { color: W }, objects: [titleOpts(M, M, 11.0, 1.5)] });

const txt = (s, t, o) => s.addText(t, Object.assign({ isTextBox: true, fontFace: F, margin: 0, align: 'left', valign: 'top', color: INK }, o));

// 1 cover
let s = pres.addSlide({ masterName: 'P01 cover' });
s.addText('Von Excel zu BI: Vorschlag für einen Pilot', { placeholder: 'title' });
txt(s, 'Team-Meeting · September 2026', { x: M, y: 4.6, w: 9.4, h: 0.5, fontSize: 24 });
s.addShape(pres.ShapeType.line, { x: M, y: 6.3, w: CW, h: 0, line: { color: INK, width: 3 } });
[0, 3, 6, 9].forEach(i => s.addShape(pres.ShapeType.ellipse, { x: M + i, y: 6.175, w: 0.25, h: 0.25, fill: { color: INK }, line: { color: INK, width: 0 } }));
s.addNotes('Ziel nennen: Heute geht es um die Zustimmung zu einem Pilot, nicht um den kompletten Wechsel.');

// 2 statement (white)
s = pres.addSlide({ masterName: 'P14 statement' });
s.addText([{ text: 'Unsere Berichte entstehen ', options: { color: INK } }, { text: 'von Hand', options: { color: OR } }], { placeholder: 'title' });
txt(s, 'Kopieren, einfügen, prüfen.', { x: M, y: 4.8, w: 8.0, h: 0.6, fontSize: 24 });
s.addNotes('Eigene Beispiele aus dem Alltag nennen: welcher Bericht, wie oft, wie viele Dateien. Nur Erlebtes erzählen, keine Zahlen behaupten, die nicht belegt sind.');

// 3 key number
s = pres.addSlide({ masterName: 'P13 key-numbers' });
s.addText('Excel-Berichte kosten Arbeitszeit', { placeholder: 'title' });
txt(s, '[[Zahl: Std./Bericht]]', { x: M, y: 2.9, w: CW, h: 1.1, fontSize: 60, bold: true, color: OR });
txt(s, 'Stunden je Monatsbericht', { x: M, y: 4.2, w: CW, h: 0.5, fontSize: 24 });
txt(s, 'Quelle: Entwurf, Zahl noch offen, Stand 29.09.2026', { x: M, y: 6.95, w: 10.0, h: 0.3, fontSize: 12, color: GREY });
txt(s, 'Entwurf', { x: 11.667, y: 6.95, w: 1.0, h: 0.3, fontSize: 12, color: GREY });
s.addNotes('Entwurf: Hier gehört der echte Wert hin, z. B. aus einer einwöchigen Zeitmessung im Team. Vor dem Termin eintragen und die Quelle in der Fußzeile anpassen.');

// 4 before-after
s = pres.addSlide({ masterName: 'P09 before-after' });
s.addText('BI baut Berichte aus einer Quelle', { placeholder: 'title' });
txt(s, 'Heute', { x: M, y: 2.7, w: 5.2, h: 0.5, fontSize: 24, color: GREY });
txt(s, 'Mit BI', { x: 7.467, y: 2.7, w: 5.2, h: 0.5, fontSize: 24, color: INK });
txt(s, 'Viele Dateien per Mail', { x: M, y: 3.4, w: 5.2, h: 2.0, valign: 'middle', fontSize: 32, bold: true, color: GREY });
s.addShape(pres.ShapeType.line, { x: 5.9, y: 4.4, w: 1.4, h: 0, line: { color: INK, width: 3 } });
[5.9, 7.3].forEach(x => s.addShape(pres.ShapeType.ellipse, { x: x - 0.125, y: 4.275, w: 0.25, h: 0.25, fill: { color: INK }, line: { color: INK, width: 0 } }));
s.addText('Eine Quelle', { shape: pres.ShapeType.rect, x: 7.467, y: 3.4, w: 5.2, h: 2.0, fill: { color: OR }, line: { color: OR, width: 0 }, fontFace: F, fontSize: 32, bold: true, color: INK, align: 'left', valign: 'middle', margin: [24, 24, 24, 24] });
s.addNotes('Einen konkreten Bericht als Beispiel zeigen: heute die Kette aus Export, Kopieren und Mail; mit BI liest der Bericht direkt aus der Quelle. Details zum Werkzeug bewusst weglassen.');

// 5 statement (orange)
s = pres.addSlide({ masterName: 'P14 statement' });
s.background = { color: OR };
s.addText('Excel bleibt für schnelle Ad-hoc-Analysen', { placeholder: 'title' });
txt(s, 'BI übernimmt die Standardberichte.', { x: M, y: 4.8, w: 8.0, h: 0.6, fontSize: 24 });
s.addNotes('Den Einwand „ihr nehmt uns Excel weg“ direkt ansprechen: Excel bleibt das Werkzeug für die schnelle eigene Auswertung.');

// 6 timeline
s = pres.addSlide({ masterName: 'P11 timeline' });
s.addText('Wir starten heute den Pilot', { placeholder: 'title' });
s.addShape(pres.ShapeType.line, { x: M, y: 4.2, w: CW, h: 0, line: { color: INK, width: 3 } });
const st = ['Bericht wählen', 'Aufbauen', 'Vergleichen', 'Entscheiden'];
st.forEach((t, i) => {
  const x = M + i * 3.0, last = i === 3;
  s.addShape(pres.ShapeType.ellipse, { x, y: 4.2 - 0.125, w: 0.25, h: 0.25, fill: { color: last ? OR : INK }, line: { color: last ? OR : INK, width: 0 } });
  txt(s, t, { x, y: 4.65, w: 2.8, h: 0.6, fontSize: 24, bold: true });
});
s.addNotes('Die Bitte an das Team: Zustimmung zum Pilot heute. Umfang, Dauer und Erfolgskriterium gemeinsam festlegen; hier bewusst keine Wochenzahlen.');

pres.writeFile({ fileName: 'excel-zu-bi.pptx' }).then(() => console.log('written'));
