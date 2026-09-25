// Grid geometry from patterns.md "Frame" (960 x 540 pt, margin 48 pt, 12 columns, 16 pt gutters).
// All helper functions return POINTS; convert with pt2in() when passing to pptxgenjs (inches).
const MARGIN = 48;
const COL = 57.333;
const GUT = 16;

function pt2in(pt) { return pt / 72; }

function colSpan(n) { return n * COL + (n - 1) * GUT; }
function colX(startCol) { return MARGIN + (startCol - 1) * (COL + GUT); }

// Standard zones (pt), per patterns.md "Frame"
const ZONE = {
  title: { x: 48, y: 64, w: 864, h: 58 },
  measure: { x: 48, y: 124, w: 864, h: 18 },
  body: { x: 48, y: 156, w: 864, h: 300 }, // to y=456
  source: { x: 48, y: 466, w: 700, h: 36 },
  pageNum: { x: 912, y: 488, w: 40, h: 18 },
  status: { x: 700, y: 48, w: 212, h: 16 },
};

function box(z) { return { x: pt2in(z.x), y: pt2in(z.y), w: pt2in(z.w), h: pt2in(z.h) }; }

module.exports = { MARGIN, COL, GUT, pt2in, colSpan, colX, ZONE, box };
