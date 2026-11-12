#!/usr/bin/env python3
"""Light restyle (copragym-like) of the FaceThis dc.html pages — FaceThis coding agent G1, 12 Nov 2026.

Rewrites inline styles in the markup and the state colours in the DCLogic script.
Dark sections (marked data-dark) and dark photo placeholders are left dark.
Run once on the dark export: python3 docs/tools/restyle_light.py index.html boeken.html
"""
import re
import sys

LIME = "#C4F82A"
LIME_INK = "#4C7A00"      # lime, darkened to be readable as text on white (contrast 5:1)
INK = "#0A0A0A"
GREY_BG = "#F2F2EF"
LINE = "#E2E2DC"
TINT = "#F4FBE0"           # pale lime for selected items

SIDE = "max(20px, calc((100% - 1240px) / 2))"

# property-aware colour map for light areas
TEXT = {
    "#f5f5f3": INK, "#ffffff": INK, "#eeeee9": "#26261F", "#e2e2dd": "#26261F",
    "#b9b9b4": "#55554F", "#a8a8a2": "#5C5C56", "#c9c9c4": "#3C3C38",
    "#8a8a84": "#75756E", "#6e6e68": "#8A8A84", "#5c5c56": "#75756E", "#4a4a44": "#B5B5AE",
    "#3c3c38": "#3C3C38",
}
SURF = {
    "#0a0a0a": "#FFFFFF", "#111110": "#FFFFFF", "#131311": GREY_BG, "#0f0f0e": GREY_BG,
    "#151513": GREY_BG, "#1c1c19": "#ECECE7", "#1a1a16": TINT, "#16170f": TINT,
}
BORDER = {c: LINE for c in ["#21211d", "#1e1e1c", "#2c2c26", "#23231f", "#2a2a26", "#35352f", "#252520"]}


def is_darkish_style(s):
    return bool(re.search(r"background:\s*(#0a0a0a|rgba\(10,10,10|rgba\(0,0,0)", s, re.I)) or "repeating-linear-gradient" in s


def light_style(s, tag):
    if "repeating-linear-gradient" in s:      # dark photo placeholder: keep dark, square it
        s = re.sub(r"border:\s*1px solid #[0-9a-f]{6};?\s*", "", s, flags=re.I)
        return square(s)
    dark_bg = is_darkish_style(s)
    lime_bg = re.search(r"background:\s*#C4F82A", s, re.I)

    def col(m):
        prop, val = m.group(1), m.group(2)
        low = val.lower()
        if prop == "color":
            if low == LIME.lower():
                return m.group(0) if (dark_bg or lime_bg) else f"color: {LIME_INK}"
            if low == "#0a0a0a":
                return m.group(0)
            if dark_bg:
                return m.group(0)
            return f"color: {TEXT.get(low, val)}"
        if prop == "background":
            if low == "#0a0a0a" and "color: #C4F82A" in s:   # ink button with lime text stays
                return m.group(0)
            return f"background: {SURF.get(low, val)}"
        return m.group(0)

    s = re.sub(r"\b(color|background):\s*(#[0-9a-fA-F]{6})", col, s)
    for k, v in BORDER.items():
        s = re.sub(re.escape(k), v, s, flags=re.I)
    s = s.replace("rgba(196,248,42,.08)", TINT).replace("rgba(196,248,42,.35)", LIME)
    s = s.replace("box-shadow: 0 12px 34px rgba(196,248,42,.22);", "")
    s = s.replace("box-shadow: 0 18px 40px rgba(0,0,0,.5);", "box-shadow: 0 10px 30px rgba(0,0,0,.08);")
    s = s.replace("box-shadow: 0 14px 38px rgba(0,0,0,.55);", "box-shadow: 0 10px 30px rgba(0,0,0,.18);")
    return square(s)


def square(s):
    """copragym: square corners on boxes and buttons; dots, bars and avatars stay round."""
    def rad(m):
        val = m.group(1).strip()
        if val == "999px":
            return m.group(0) if "padding" not in s else "border-radius: 0"
        return "border-radius: 0"
    return re.sub(r"border-radius:\s*([^;\"]+)", rad, s)


def type_style(s, tag):
    # Section headings: Archivo 800, sentence case, like copragym's 40/52 H2
    if tag in ("h1", "h2") and "Anton" in s and "uppercase" in s:
        s = re.sub(r"font-family: Anton, Impact, sans-serif; font-weight: 400;",
                   "font-family: Archivo, Helvetica, Arial, sans-serif; font-weight: 800;", s)
        s = s.replace("text-transform: uppercase;", "letter-spacing: -.015em;")
        s = re.sub(r"line-height: (1|\.9\d?|0?\.9\d?);", "line-height: 1.15;", s)
        s = re.sub(r"font-size: clamp\(\d+px, [\d.]+vw, (\d+)px\)",
                   lambda m: f"font-size: clamp(28px, 3.6vw, {min(int(m.group(1)), 46)}px)", s)
    # Eyebrows: mono lime labels become Anton labels with letter-spacing (copragym's Bebas eyebrows)
    if "IBM Plex Mono" in s and "letter-spacing: .14em" in s and "uppercase" in s:
        s = s.replace("font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .14em;",
                      "font-family: Anton, Impact, sans-serif; font-size: 16px; letter-spacing: .14em;")
    # Section rhythm: 100 px top/bottom, 1240 px column
    s = s.replace("padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 48px);", f"padding: clamp(64px, 8vw, 100px) {SIDE};")
    s = s.replace("padding: clamp(40px, 6vw, 84px) clamp(16px, 4vw, 48px);", f"padding: clamp(64px, 8vw, 100px) {SIDE};")
    s = s.replace("padding: clamp(40px, 6vw, 80px) clamp(16px, 4vw, 48px);", f"padding: clamp(64px, 8vw, 100px) {SIDE};")
    return s


def restyle_markup(html):
    out, pos = [], 0
    # skip regions marked data-dark="1" … <!-- /dark -->
    dark_spans = [(m.start(), html.index("<!-- /dark -->", m.start())) for m in re.finditer(r'data-dark="1"', html)]

    def in_dark(i):
        return any(a <= i <= b for a, b in dark_spans)

    def tag_sub(m):
        tag, style = m.group(1).lower(), m.group(2)
        style = type_style(style, tag)
        style = square(style) if in_dark(m.start()) else light_style(style, tag)
        return m.group(0).replace(m.group(2), style, 1)

    return re.sub(r'<([a-zA-Z0-9-]+)\b[^>]*?\sstyle="([^"]*)"', tag_sub, html)


SCRIPT_MAP = [
    ('bg: a ? "#1a1a16" : "transparent"', f'bg: a ? "{TINT}" : "#FFFFFF"'),
    ('ring: a ? on : "#21211d"', f'ring: a ? on : "{LINE}"'),
    ('tagC: a ? on : "#6e6e68"', f'tagC: a ? "{LIME_INK}" : "#8A8A84"'),
    ('noteC: a ? on : "#6e6e68"', f'noteC: a ? "{LIME_INK}" : "#8A8A84"'),
    ('fg: a ? "#0a0a0a" : "#e2e2dd", ring: a ? on : "#2c2c26"', f'fg: a ? "#0a0a0a" : "#26261F", ring: a ? on : "{LINE}"'),
    ('fg: full ? "#4a4a44" : a ? "#0a0a0a" : "#e2e2dd", ring: a ? on : "#252520"', f'fg: full ? "#B5B5AE" : a ? "#0a0a0a" : "#26261F", ring: a ? on : "{LINE}"'),
    ('bg: dis ? "#1c1c19" : on, fg: dis ? "#5c5c56" : "#0a0a0a"', 'bg: dis ? "#ECECE7" : on, fg: dis ? "#A3A39C" : "#0a0a0a"'),
    ('bar: done ? on : "#252520", numC: done ? on : "#5c5c56", labelC: done ? "#f5f5f3" : "#5c5c56"',
     f'bar: done ? on : "{LINE}", numC: done ? "{LIME_INK}" : "#A3A39C", labelC: done ? "#0A0A0A" : "#A3A39C"'),
    ('bg: b.isNew ? "#16170f" : "#111110"', f'bg: b.isNew ? "{TINT}" : "#FFFFFF"'),
    ('ring: b.isNew ? on : "#21211d"', f'ring: b.isNew ? on : "{LINE}"'),
    ('dateC: b.isNew ? on : "#f5f5f3"', f'dateC: b.isNew ? "{LIME_INK}" : "#0A0A0A"'),
    ('statusBg: b.isNew ? on : "#1c1c19"', 'statusBg: b.isNew ? on : "#ECECE7"'),
    ('statusFg: b.isNew ? "#0a0a0a" : "#C4F82A"', f'statusFg: b.isNew ? "#0a0a0a" : "{LIME_INK}"'),
    ('fg: active ? "#0a0a0a" : "#c9c9c4"', 'fg: active ? "#0a0a0a" : "#3C3C38"'),
]


def main(paths):
    for p in paths:
        src = open(p, encoding="utf-8").read()
        cut = src.index('<script type="text/x-dc"')
        markup, script = src[:cut], src[cut:]
        markup = restyle_markup(markup)
        n = 0
        for a, b in SCRIPT_MAP:
            if a in script:
                script = script.replace(a, b); n += 1
        open(p, "w", encoding="utf-8").write(markup + script)
        print(p, "script replacements:", n)


if __name__ == "__main__":
    main(sys.argv[1:])
