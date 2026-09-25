// Shared helpers for the e-aircraft example decks. All geometry is written in pt (multiples of 8)
// on the 960 x 540 pt canvas and converted to inches for pptxgenjs.
const pt = (v) => v / 72;

// One slide master per layout type. The title is a real placeholder; the source line and the slide
// number sit at fixed positions (rules-core: recurring elements at exactly the same position).
function master(pres, name, o) {
  const objects = [
    { placeholder: { options: { name: 'title', type: 'title', x: pt(o.title[0]), y: pt(o.title[1]), w: pt(o.title[2]), h: pt(o.title[3]),
        fontFace: o.font, fontSize: o.titleSize, bold: !!o.titleBold, color: o.titleColor, align: 'left', valign: o.titleValign || 'top', margin: 0 }, text: '' } },
  ];
  const def = { title: name, background: { color: o.bg }, objects };
  if (o.number) def.slideNumber = { x: pt(864), y: pt(456), w: pt(48), h: pt(24), fontFace: o.font, fontSize: o.number.size, color: o.number.color, align: 'right' };
  pres.defineSlideMaster(def);
}

function source(slide, text, o) {
  slide.addText(text, { x: pt(48), y: pt(456), w: pt(o.w || 768), h: pt(o.h || 24), fontFace: o.font, fontSize: o.size, color: o.color, align: 'left', valign: 'top', margin: 0, isTextBox: true });
}

// Full-bleed picture used as the slide ground (rules-core: a full-bleed image is ground and not counted as fill).
function ground(slide, file, alt) {
  slide.addImage({ path: file, x: 0, y: 0, w: 960 / 72, h: 540 / 72, altText: alt });
}
// Solid plate behind text that sits over a picture (rules-core: text is never placed directly on a picture).
function plate(slide, pres, x, y, w, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x: pt(x), y: pt(y), w: pt(w), h: pt(h), fill: { color }, line: { type: 'none' } });
}

module.exports = { pt, master, source, ground, plate };
