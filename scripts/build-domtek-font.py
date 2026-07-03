#!/usr/bin/env python3
"""Build DOMTEKNIKA's patched 42dot Sans webfont.

Requires:
  python -m pip install fonttools brotli

The upstream 42dot Sans Latin subset does not include several French accented
glyphs. This script instantiates static weights, adds the missing French glyphs
as composites made from native 42dot components, then subsets each weight to the
Latin punctuation and French characters used by the site.
"""

from __future__ import annotations

from pathlib import Path
from urllib.request import urlretrieve

from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[1]
OUTDIR = ROOT / "src/app/fonts"
TMPDIR = ROOT / ".font-build"
TMPDIR.mkdir(exist_ok=True)
OUTDIR.mkdir(parents=True, exist_ok=True)

SOURCE_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/42dotsans/"
    "42dotSans%5Bwght%5D.ttf"
)
LICENSE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/42dotsans/OFL.txt"
SOURCE_FONT = TMPDIR / "42dotSans[wght].ttf"
SOURCE_LICENSE = TMPDIR / "OFL-42dot-Sans.txt"

ACCENTED = {
    "grave": [
        ("A", "À"),
        ("a", "à"),
        ("E", "È"),
        ("e", "è"),
        ("I", "Ì"),
        ("i", "ì"),
        ("O", "Ò"),
        ("o", "ò"),
        ("U", "Ù"),
        ("u", "ù"),
    ],
    "acute": [
        ("A", "Á"),
        ("a", "á"),
        ("E", "É"),
        ("e", "é"),
        ("I", "Í"),
        ("i", "í"),
        ("O", "Ó"),
        ("o", "ó"),
        ("U", "Ú"),
        ("u", "ú"),
        ("Y", "Ý"),
        ("y", "ý"),
    ],
    "circumflex": [
        ("A", "Â"),
        ("a", "â"),
        ("E", "Ê"),
        ("e", "ê"),
        ("I", "Î"),
        ("i", "î"),
        ("O", "Ô"),
        ("o", "ô"),
        ("U", "Û"),
        ("u", "û"),
    ],
    "dieresis": [
        ("A", "Ä"),
        ("a", "ä"),
        ("E", "Ë"),
        ("e", "ë"),
        ("I", "Ï"),
        ("i", "ï"),
        ("O", "Ö"),
        ("o", "ö"),
        ("U", "Ü"),
        ("u", "ü"),
        ("Y", "Ÿ"),
        ("y", "ÿ"),
    ],
    "cedilla": [("C", "Ç"), ("c", "ç")],
}

UNICODE_TEXT = "".join(chr(cp) for cp in range(0x20, 0x7F))
UNICODE_TEXT += "".join(chr(cp) for cp in range(0xA0, 0x100))
UNICODE_TEXT += "Œœ€–—’‘“”…«»‹›°"


def ensure_sources() -> None:
    if not SOURCE_FONT.exists():
        urlretrieve(SOURCE_URL, SOURCE_FONT)
    if not SOURCE_LICENSE.exists():
        urlretrieve(LICENSE_URL, SOURCE_LICENSE)
    (OUTDIR / "OFL-42dot-Sans.txt").write_bytes(SOURCE_LICENSE.read_bytes())


def glyph_bounds(font: TTFont, glyph_name: str) -> tuple[int, int, int, int]:
    glyph = font["glyf"][glyph_name]
    glyph.recalcBounds(font["glyf"])
    return glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax


def transformed_bounds(
    bounds: tuple[int, int, int, int],
    transform: tuple[float, float, float, float, int, int],
) -> tuple[float, float, float, float]:
    x_min, y_min, x_max, y_max = bounds
    xx, xy, yx, yy, dx, dy = transform
    points = [(x_min, y_min), (x_min, y_max), (x_max, y_min), (x_max, y_max)]
    xs = [xx * x + yx * y + dx for x, y in points]
    ys = [xy * x + yy * y + dy for x, y in points]
    return min(xs), min(ys), max(xs), max(ys)


def center_transform(
    font: TTFont,
    base: str,
    mark: str,
    transform: tuple[float, float, float, float, int, int] = (1, 0, 0, 1, 0, 0),
    y: int = 0,
    x_adjust: int = 0,
) -> tuple[float, float, float, float, int, int]:
    advance_width, _ = font["hmtx"].metrics[base]
    mark_bounds = glyph_bounds(font, mark)
    transformed = transformed_bounds(mark_bounds, transform)
    mark_width = transformed[2] - transformed[0]
    dx = (advance_width - mark_width) / 2 - transformed[0] + x_adjust
    xx, xy, yx, yy, _, _ = transform
    return xx, xy, yx, yy, round(dx), round(y)


def add_composite(
    font: TTFont,
    name: str,
    codepoint: int,
    base: str,
    components: list[tuple[str, tuple[float, float, float, float, int, int]]],
) -> None:
    glyph_order = font.getGlyphOrder()
    if name not in glyph_order:
        glyph_order.append(name)
        font.setGlyphOrder(glyph_order)
        font["glyf"].glyphOrder = glyph_order

    pen = TTGlyphPen(font.getGlyphSet())
    pen.addComponent(base, (1, 0, 0, 1, 0, 0))
    for mark, transform in components:
        pen.addComponent(mark, transform)

    font["glyf"][name] = pen.glyph()
    font["hmtx"].metrics[name] = tuple(font["hmtx"].metrics[base])
    if "vmtx" in font:
        font["vmtx"].metrics[name] = tuple(font["vmtx"].metrics.get(base, (1000, 0)))

    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[codepoint] = name


def patch_french_accents(font: TTFont) -> None:
    cmap = font.getBestCmap()
    dotless_i = cmap.get(0x0131, "dotlessi")

    for accent_kind, pairs in ACCENTED.items():
        for base_char, accented_char in pairs:
            base = cmap[ord(base_char)]
            if base_char == "i" and accent_kind in {
                "grave",
                "acute",
                "circumflex",
                "dieresis",
            }:
                base = dotless_i

            codepoint = ord(accented_char)
            glyph_name = f"uni{codepoint:04X}"
            is_upper = base_char.isupper()
            components = []

            if accent_kind == "grave":
                components.append(
                    ("grave", center_transform(font, base, "grave", y=150 if is_upper else 0))
                )
            elif accent_kind == "acute":
                # Mirror the native grave accent to preserve 42dot stroke/weight.
                mirrored_grave = (-1, 0, 0, 1, 0, 0)
                components.append(
                    (
                        "grave",
                        center_transform(
                            font,
                            base,
                            "grave",
                            transform=mirrored_grave,
                            y=150 if is_upper else 0,
                        ),
                    )
                )
            elif accent_kind == "circumflex":
                components.append(
                    (
                        "asciicircum",
                        center_transform(
                            font,
                            base,
                            "asciicircum",
                            y=300 if is_upper else 165,
                        ),
                    )
                )
            elif accent_kind == "dieresis":
                advance_width, _ = font["hmtx"].metrics[base]
                dot_bounds = glyph_bounds(font, "dotaccent")
                dot_width = dot_bounds[2] - dot_bounds[0]
                gap = 72
                left = (advance_width - (dot_width * 2 + gap)) / 2
                y = 150 if is_upper else 0
                components.append(
                    ("dotaccent", (1, 0, 0, 1, round(left - dot_bounds[0]), y))
                )
                components.append(
                    (
                        "dotaccent",
                        (1, 0, 0, 1, round(left + dot_width + gap - dot_bounds[0]), y),
                    )
                )
            elif accent_kind == "cedilla":
                components.append(("comma", center_transform(font, base, "comma", y=-45)))

            add_composite(font, glyph_name, codepoint, base, components)


def subset_to_woff2(font: TTFont, output: Path) -> None:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.recalc_average_width = True
    options.recalc_bounds = True

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=UNICODE_TEXT)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(output)


def main() -> None:
    ensure_sources()

    for weight in [300, 400, 500, 600, 700, 800]:
        font = TTFont(SOURCE_FONT)
        font = instancer.instantiateVariableFont(font, {"wght": weight}, inplace=False)
        patch_french_accents(font)

        for record in font["name"].names:
            try:
                text = record.toUnicode()
            except UnicodeDecodeError:
                continue
            text = text.replace("42dot Sans", "42dot Sans DOMTEKNIKA")
            text = text.replace("42dotSans", "42dotSansDOMTEKNIKA")
            record.string = text.encode(record.getEncoding())

        merged_order = list(dict.fromkeys(font.getGlyphOrder() + font["glyf"].glyphOrder))
        font.setGlyphOrder(merged_order)
        font["glyf"].glyphOrder = merged_order
        for glyph_name in merged_order:
            if glyph_name not in font["hmtx"].metrics:
                font["hmtx"].metrics[glyph_name] = (0, 0)
            if "vmtx" in font and glyph_name not in font["vmtx"].metrics:
                font["vmtx"].metrics[glyph_name] = (1000, 0)

        output = OUTDIR / f"42dot-domteknika-{weight}.woff2"
        subset_to_woff2(font, output)
        print(f"{weight}: {output.relative_to(ROOT)} ({output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
