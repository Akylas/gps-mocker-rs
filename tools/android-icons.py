"""Regenerate the Android launcher icons from src-tauri/icons/icon.png.

`tauri android init` leaves Tauri's own logo behind, and `tauri icon` would
overwrite the hand-made desktop .icns as well, so the Android side is generated
here on its own. Run it from the repository root after changing icon.png:

    python3 tools/android-icons.py

It writes the adaptive layers (which is all anything running minSdk 26 draws),
a monochrome layer for themed icons, and the legacy rasters.
"""

from PIL import Image, ImageDraw
import os

SRC = 'src-tauri/icons/icon.png'
RES = 'src-tauri/gen/android/app/src/main/res'

# dp -> px multiplier per density bucket
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

im = Image.open(SRC).convert('RGBA')
W, H = im.size

# the art is a rounded square with a transparent margin
alpha = im.getchannel('A')
box = alpha.point(lambda a: 255 if a > 200 else 0).getbbox()
print('art box', box)
left, top, right, bottom = box

print('gradient', im.getpixel((W // 2, top + 2)), im.getpixel((W // 2, bottom - 3)))

# The signposts are white on orange, so the darkest channel separates them:
# white is 255 everywhere, the orange background never gets past ~180 in blue.
LO, HI = 150, 245
mask = Image.new('L', (W, H), 0)
mask_px = mask.load()
src_px = im.load()
for y in range(H):
    for x in range(W):
        r, g, b, a = src_px[x, y]
        if a < 250:
            continue
        v = min(r, g, b)
        if v <= LO:
            continue
        mask_px[x, y] = 255 if v >= HI else int((v - LO) * 255 / (HI - LO))

signs = mask.crop(mask.getbbox())
print('signs', signs.size)


def layer(size, art, fraction):
    """Centres `art` on a transparent square, filling `fraction` of it."""
    canvas = Image.new('L', (size, size), 0)
    limit = size * fraction
    scale = min(limit / art.width, limit / art.height)
    scaled = art.resize((max(1, round(art.width * scale)), max(1, round(art.height * scale))), Image.LANCZOS)
    canvas.paste(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
    return canvas


def white(mask_layer):
    out = Image.new('RGBA', mask_layer.size, (255, 255, 255, 0))
    out.putalpha(mask_layer)
    out.paste((253, 253, 253, 255), (0, 0), mask_layer)
    out.putalpha(mask_layer)
    return out


def black(mask_layer):
    out = Image.new('RGBA', mask_layer.size, (0, 0, 0, 0))
    out.paste((0, 0, 0, 255), (0, 0), mask_layer)
    out.putalpha(mask_layer)
    return out


def gradient_circle(size):
    top_rgb = im.getpixel((W // 2, top + 2))[:3]
    bottom_rgb = im.getpixel((W // 2, bottom - 3))[:3]
    grad = Image.new('RGBA', (size, size))
    px = grad.load()
    for y in range(size):
        t = y / (size - 1)
        px_row = tuple(round(top_rgb[i] + (bottom_rgb[i] - top_rgb[i]) * t) for i in range(3))
        for x in range(size):
            px[x, y] = px_row + (255,)
    circle = Image.new('L', (size, size), 0)
    ImageDraw.Draw(circle).ellipse((0, 0, size - 1, size - 1), fill=255)
    grad.putalpha(circle)
    return grad


for bucket, factor in DENSITIES.items():
    out_dir = os.path.join(RES, 'mipmap-' + bucket)
    os.makedirs(out_dir, exist_ok=True)

    # adaptive icon layers are 108dp, with everything that matters inside the
    # central 66dp the launcher is allowed to mask down to
    adaptive = round(108 * factor)
    fraction = 60 / 108
    white(layer(adaptive, signs, fraction)).save(os.path.join(out_dir, 'ic_launcher_foreground.png'))
    black(layer(adaptive, signs, fraction)).save(os.path.join(out_dir, 'ic_launcher_monochrome.png'))

    # the legacy raster, for launchers that never ask for the adaptive one
    legacy = round(48 * factor)
    im.resize((legacy, legacy), Image.LANCZOS).save(os.path.join(out_dir, 'ic_launcher.png'))

    round_icon = gradient_circle(legacy)
    round_icon.alpha_composite(white(layer(legacy, signs, 0.56)))
    round_icon.save(os.path.join(out_dir, 'ic_launcher_round.png'))

    print(bucket, 'adaptive', adaptive, 'legacy', legacy)
