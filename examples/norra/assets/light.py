"""Soft light-blue light behind the glass panels (transparent PNG, fading out at every edge).
Usage: python3 examples/norra/assets/light.py  (needs Pillow)"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.dirname(os.path.abspath(__file__))


def light(w, h, blobs, name, edge=0.18):
    s = 2
    W, H = w * s, h * s
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    for (cx, cy, r, col) in blobs:
        m = Image.new('L', (W, H), 0)
        ImageDraw.Draw(m).ellipse([(cx - r) * s, (cy - r) * s, (cx + r) * s, (cy + r) * s], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(r * s * 0.45))
        layer = Image.new('RGBA', (W, H), col + (0,))
        layer.putalpha(m)
        img = Image.alpha_composite(img, layer)
    e = int(min(W, H) * edge)              # fade to zero towards every edge: no visible image border
    fade = Image.new('L', (W, H), 0)
    ImageDraw.Draw(fade).rectangle([e, e, W - e, H - e], fill=255)
    fade = fade.filter(ImageFilter.GaussianBlur(e * 0.6))
    img.putalpha(ImageChops.multiply(img.getchannel('A'), fade))
    img.save(os.path.join(OUT, name + '.png'))


A, B, C = (143, 201, 242), (186, 222, 247), (110, 182, 236)
light(480, 540, [(330, 170, 150, A), (260, 410, 135, B), (440, 330, 130, C)], 'light-cover', 0.12)
light(288, 320, [(170, 110, 85, A), (110, 220, 80, B)], 'light-rail')
light(320, 360, [(200, 120, 95, A), (120, 250, 90, B)], 'light-tall')
light(960, 160, [(250, 80, 70, A), (700, 80, 70, B), (480, 90, 55, C)], 'light-wide')
light(480, 320, [(320, 110, 90, A), (150, 210, 90, B), (400, 240, 70, C)], 'light-mid')
