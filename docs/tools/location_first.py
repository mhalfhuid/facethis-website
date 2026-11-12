#!/usr/bin/env python3
"""Booking: location first and always clear (Malcolm, 12 Nov: on the phone the location was barely visible).

Moves the location choice above date & time, shows the chosen one in black with a lime bar and "✓ Gekozen",
puts a lime "Tijden voor <locatie>" band above the dates, and turns the side panel into "Jouw keuze".
FaceThis coding agent G1, 12 Nov 2026. Run once: python3 docs/tools/location_first.py index.html boeken.html
"""
import re
import sys

LOC_MAP_OLD = re.compile(r'return \{ \.\.\.l, priceLabel: "€ " \+ l\.price \+ ",-", bg: a \? "#F4FBE0" : "#FFFFFF", ring: a \? on : "#E2E2DC", tagC: a \? "#4C7A00" : "#8A8A84",')
LOC_MAP_NEW = ('return { ...l, priceLabel: "€ " + l.price + ",-", bg: a ? "#0A0A0A" : "#FFFFFF", ring: a ? "#0A0A0A" : "#E2E2DC", '
               'bar: a ? on : "#FFFFFF", nameC: a ? "#FFFFFF" : "#0A0A0A", subC: a ? "#D6D6D0" : "#5C5C56", '
               'tagC: a ? on : "#75756E", mark: a ? "✓ Gekozen" : l.tag, pressed: a ? "true" : "false",')

PICKER = '''{H}1 · Kies locatie</{T}>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 10px; margin-top: 14px;">
              <sc-for list="{{{{ locations }}}}" as="l" hint-placeholder-count="2">
                <button onClick="{{{{ l.select }}}}" aria-pressed="{{{{ l.pressed }}}}" style="text-align: left; padding: 16px 16px 16px 22px; border-radius: 0; border: 2px solid {{{{ l.ring }}}}; background: {{{{ l.bg }}}}; box-shadow: inset 6px 0 0 {{{{ l.bar }}}}; color: {{{{ l.nameC }}}}; cursor: pointer;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <span style="font-size: 16px; font-weight: 800; color: {{{{ l.nameC }}}};">{{{{ l.name }}}}</span>
                    <span style="flex: none; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: {{{{ l.tagC }}}};">{{{{ l.mark }}}}</span>
                  </div>
                  <div style="margin-top: 6px; font-size: 13px; line-height: 1.5; color: {{{{ l.subC }}}};">{{{{ l.address }}}}</div>
                  <div style="margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: {{{{ l.subC }}}};">{{{{ l.detail }}}} · {{{{ l.priceLabel }}}}</div>
                </button>
              </sc-for>
            </div>
            {H2}2 · Kies datum &amp; tijd</{T}>
            <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; margin-top: 12px; padding: 10px 14px; background: #C4F82A; color: #0A0A0A;">
              <span style="font-family: Anton, Impact, sans-serif; font-size: 14px; letter-spacing: .1em; text-transform: uppercase;">Tijden voor</span>
              <span style="font-size: 15px; font-weight: 800;">{{{{ sumLoc }}}}</span>
            </div>'''

SUMMARY = '''{H}Jouw keuze</{T}>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
              <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 14px;"><span style="color: #75756E;">Locatie</span><span style="font-weight: 700; text-align: right;">{{{{ sumLoc }}}}<br /><span style="font-weight: 400; font-size: 13px; color: #5C5C56;">{{{{ sumAddress }}}}</span></span></div>
            </div>'''


def patch(path):
    src = open(path, encoding="utf-8").read()
    # 1. left column: heading + "Beschikbaarheid" line → location picker, then the date heading and a lime band
    m = re.search(r'(<(h[23]) style="([^"]*)">)Kies datum &amp; tijd</h[23]>\s*\n\s*<div[^>]*>Beschikbaarheid van \{\{ sumLoc \}\}</div>', src)
    assert m, path + ": agenda heading not found"
    tag, style = m.group(2), m.group(3)
    style = re.sub(r"font-size: [^;]+;", "font-size: clamp(22px, 2.6vw, 28px);", style)
    h = f'<{tag} style="{style}">'
    h2 = f'<{tag} style="{style.replace("margin: 0;", "margin: 30px 0 0;")}">'
    src = src[:m.start()] + PICKER.format(H=h, H2=h2, T=tag) + src[m.end():]
    # 2. side panel: the location list → "Jouw keuze" with the location and its address
    m = re.search(r'<(h[23]) style="([^"]*)">Locatie</h[23]>\s*\n\s*<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">\s*\n\s*<sc-for list="\{\{ locations \}\}".*?</sc-for>\s*\n\s*</div>', src, re.S)
    assert m, path + ": side location list not found"
    tag, style = m.group(1), re.sub(r"font-size: [^;]+;", "font-size: clamp(20px, 2.2vw, 24px);", m.group(2))
    src = src[:m.start()] + SUMMARY.format(H=f'<{tag} style="{style}">', T=tag) + src[m.end():]
    # 3. state: colours for the chosen location, and its address for the summary
    src, n = LOC_MAP_OLD.subn(LOC_MAP_NEW, src)
    assert n == 1, path + ": locations map not found"
    src = src.replace("sumLoc: loc.name, sumDuration", "sumLoc: loc.name, sumAddress: loc.address, sumDuration", 1)
    assert "sumAddress: loc.address" in src
    open(path, "w", encoding="utf-8").write(src)
    print(path, "ok")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        patch(p)
