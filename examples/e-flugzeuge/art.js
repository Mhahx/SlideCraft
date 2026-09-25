// Illustrations for the e-aircraft example decks, written as SVG (editable) and rasterised with sharp.
// No text inside the SVGs (system fonts would differ); labels are set as slide text.
// Canvas: 1920 x 1080 px = 2 px per pt on the 960 x 540 pt slide.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1920, H = 1080;
const doc = (bg, body, w = W, h = H) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>';

// Plan view of a four-propeller electric commuter, nose up, drawn in a 400 x 500 box.
function aircraft(fill) {
  const nac = (x) => `<rect x="${x}" y="196" width="14" height="66" rx="7"/><ellipse cx="${x + 7}" cy="190" rx="3" ry="30"/>`;
  const mir = (x) => 400 - x - 14;
  return `<g fill="${fill}"><rect x="184" y="20" width="32" height="420" rx="16"/>` +
    `<path d="M184 200 L8 228 L8 258 L184 264 Z"/><path d="M216 200 L392 228 L392 258 L216 264 Z"/>` +
    `<path d="M186 396 L106 424 L106 442 L186 434 Z"/><path d="M214 396 L294 424 L294 442 L214 434 Z"/>` +
    nac(62) + nac(126) + nac(mir(62)) + nac(mir(126)) + '</g>';
}
const place = (inner, x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(-200 -250)">${inner}</g>`;
const ring = (cx, cy, r, stroke, w, dash) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

// The 30 routes of the example network: 5 up to 150 km, 9 up to 320 km, 8 up to 500 km, 8 beyond. Deterministic.
function routes() {
  const cls = [[5, 70, 145], [9, 165, 310], [8, 335, 495], [8, 520, 640]];
  const out = [];
  let j = 0;
  cls.forEach(([n, a, b], c) => { for (let i = 0; i < n; i++) { out.push({ km: a + (b - a) * (n === 1 ? 0 : i / (n - 1)), inRange: c < 2, ang: (j * 137.508) % 360 }); j++; } });
  return out;
}
function routeMap(cx, cy, k, c) {
  let s = '';
  for (const r of [150, 320, 500]) s += ring(cx, cy, r * k, r === 320 ? c.hi : c.faint, r === 320 ? 4 : 2.5, r === 320 ? '' : '10 12');
  const R = routes();
  for (const r of R.filter((x) => !x.inRange)) {
    const x = cx + Math.cos(r.ang * Math.PI / 180) * r.km * k, y = cy + Math.sin(r.ang * Math.PI / 180) * r.km * k;
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c.lo}" stroke-width="2.5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${c.bg}" stroke="${c.lo}" stroke-width="3"/>`;
  }
  for (const r of R.filter((x) => x.inRange)) {
    const x = cx + Math.cos(r.ang * Math.PI / 180) * r.km * k, y = cy + Math.sin(r.ang * Math.PI / 180) * r.km * k;
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c.hi}" stroke-width="5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${c.hi}"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="24" fill="${c.hub}"/>`;
}
function waffle(x0, y0, cell, gap, filled, fill, stroke, total = 100, cols = 10) {
  let s = '';
  for (let i = 0; i < total; i++) {
    const x = x0 + (i % cols) * (cell + gap), y = y0 + Math.floor(i / cols) * (cell + gap);
    s += i < filled ? `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}"/>` : `<rect x="${x + 2}" y="${y + 2}" width="${cell - 4}" height="${cell - 4}" fill="none" stroke="${stroke}" stroke-width="4"/>`;
  }
  return s;
}

const assets = {};
// ---------------------------------------------------------------- talk (violet ground)
{
  const bg = '4C2FBF', soft = 'E4DEFA', mid = '7E66DD', white = 'FFFFFF';
  const t = {};
  t.title = doc(bg, ring(1500, 560, 380, mid, 4, '14 16') + ring(1500, 560, 560, mid, 3, '14 16') + ring(1500, 560, 740, mid, 3, '14 16') + place(aircraft(white), 1500, 560, 1.55, 38));
  t.s2 = doc(bg, waffle(1070, 170, 64, 12, 34, white, mid));
  const px = (x) => 1000 + x, py = (y) => y;
  t.s3 = doc(bg, `<line x1="${px(0)}" y1="800" x2="${px(860)}" y2="800" stroke="${mid}" stroke-width="4"/>` +
    `<polyline points="${px(0)},800 ${px(60)},780" fill="none" stroke="${white}" stroke-width="16" stroke-linecap="round"/>` +
    `<polyline points="${px(60)},780 ${px(360)},330" fill="none" stroke="${white}" stroke-width="16" stroke-linecap="round"/>` +
    `<polyline points="${px(360)},330 ${px(440)},330" fill="none" stroke="${soft}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 14"/>` +
    `<polyline points="${px(440)},330 ${px(800)},790" fill="none" stroke="${soft}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 14"/>` +
    place(aircraft(white), px(360), 330, 0.62, 56));
  t.s4 = doc(bg, `<rect x="1090" y="200" width="250" height="600" fill="${mid}"/><rect x="1440" y="${200 + 600 * 0.22}" width="250" height="${600 * 0.78}" fill="${white}"/><line x1="1040" y1="800" x2="1740" y2="800" stroke="${soft}" stroke-width="6"/>`);
  let arcs = '';
  for (let i = 1; i <= 4; i++) arcs += `<path d="M ${1240 + i * 0} ${540 - i * 100} A ${i * 100} ${i * 100} 0 0 1 ${1240} ${540 + i * 100}" fill="none" stroke="${mid}" stroke-width="6" stroke-dasharray="4 16" transform="translate(${i * 0} 0)"/>`;
  let arcs2 = '';
  for (let i = 1; i <= 7; i++) arcs2 += `<path d="M 1160 ${540 - i * 92} A ${i * 92} ${i * 92} 0 0 1 1160 ${540 + i * 92}" fill="none" stroke="${i <= 5 ? white : mid}" stroke-width="${i <= 5 ? 9 : 5}" ${i <= 5 ? '' : 'stroke-dasharray="4 16"'}/>`;
  t.s5 = doc(bg, arcs2 + place(aircraft(soft), 1160, 540, 0.42, 90));
  t.s6 = doc(bg, ring(1420, 540, 200, mid, 4, '14 16') + ring(1420, 540, 400, white, 8) + ring(1420, 540, 620, mid, 4, '14 16') + `<circle cx="1420" cy="540" r="26" fill="${white}"/>` + place(aircraft(white), 1420 + 400 * Math.cos(-0.7), 540 + 400 * Math.sin(-0.7), 0.42, 55));
  t.s7 = doc(bg, routeMap(1420, 540, 0.9, { hi: white, lo: mid, faint: mid, bg, hub: white }));
  let form = '';
  [[1500, 300, 0.7], [1240, 540, 0.7], [1740, 540, 0.7], [1500, 780, 0.7]].forEach(([x, y, s]) => { form += place(aircraft(white), x, y, s, 40); });
  t.s8 = doc(bg, ring(1500, 540, 480, mid, 3, '14 16') + form);
  assets.talk = t;
}
// ---------------------------------------------------------------- read (white ground, orange)
{
  const ink = '1B2733', acc = 'C2410C', gr = '7B8794', lt = 'D0D5DB';
  const r = {};
  r.map = doc(null, routeMap(600, 450, 0.66, { hi: acc, lo: gr, faint: lt, bg: 'FFFFFF', hub: ink }), 1200, 900);
  r.title = doc(null, ring(1420, 560, 300, lt, 3, '12 14') + ring(1420, 560, 470, lt, 3, '12 14') + ring(1420, 560, 640, lt, 3, '12 14') + place(aircraft(acc), 1420, 560, 1.35, 35));
  r.plane = doc(null, place(aircraft(ink), 480, 500, 1.28, 0) +
    // dimension lines: span and length
    `<line x1="${480 - 256}" y1="930" x2="${480 + 256}" y2="930" stroke="${gr}" stroke-width="3"/><line x1="${480 - 256}" y1="915" x2="${480 - 256}" y2="945" stroke="${gr}" stroke-width="3"/><line x1="${480 + 256}" y1="915" x2="${480 + 256}" y2="945" stroke="${gr}" stroke-width="3"/>`, 960, 1000);
  assets.read = r;
}
// ---------------------------------------------------------------- pitch: title art, problem art, and a small aircraft that advances along a progress track
{
  const mg = 'B0175F', gr = '7A808A', lt = 'E6E8EC';
  const pitch = {};
  let arcs = '';
  for (let i = 1; i <= 6; i++) arcs += `<path d="M 1330 ${520 - i * 82} A ${i * 82} ${i * 82} 0 0 1 1330 ${520 + i * 82}" fill="none" stroke="${gr}" stroke-width="${8 - i * 0.6}" opacity="${1 - i * 0.13}"/>`;
  pitch.problem = doc(null, arcs + place(aircraft(gr), 1330, 520, 0.5, 90) +
    `<path d="M 1330 520 C 1500 440 1600 620 1780 520 C 1860 470 1900 560 1920 520" fill="none" stroke="${lt}" stroke-width="46" stroke-linecap="round"/>`);
  pitch.title = doc(null, ring(1420, 560, 330, lt, 4, '12 16') + ring(1420, 560, 520, lt, 4, '12 16') + place(aircraft(mg), 1420, 560, 1.5, 38));
  pitch.mark = doc(null, place(aircraft(mg), 100, 100, 0.32, 90), 200, 200);
  assets.pitch = pitch;
}
// ---------------------------------------------------------------- update: quiet title art only
{
  const ac = '1F4E79', lt = 'D0D5DB';
  assets.update = { title: doc(null, ring(1500, 560, 260, lt, 3, '12 14') + ring(1500, 560, 420, lt, 3, '12 14') + place(aircraft(ac), 1500, 560, 1.1, 38)) };
}

(async () => {
  const dir = path.join(__dirname, 'assets');
  for (const [deck, set] of Object.entries(assets)) {
    for (const [name, svg] of Object.entries(set)) {
      const base = path.join(dir, `${deck}-${name}`);
      const fixed = svg.replace(/(fill|stroke)="([0-9A-Fa-f]{6})"/g, '$1="#$2"');   // colours are written without # above
      fs.writeFileSync(base + '.svg', fixed);
      await sharp(Buffer.from(fixed), { density: 72 }).png().toFile(base + '.png');
    }
  }
  console.log('assets written');
})();
