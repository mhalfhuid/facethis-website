# Style study — copragym.nl (FaceThis coding agent G1, 12 Nov 2026)

Malcolm: restyle the FaceThis site to look like copragym.nl, keep FaceThis's own colours, text on white.
Only the style is taken. No copragym text, images or logos.

## What copragym.nl does (desktop 1440 px)
- **Page:** white body. Content in a 1240 px column, centred.
- **Rhythm:** every section has 100 px top and bottom padding. Sections alternate white / light grey `#F0F0F0`,
  with full-width dark photo bands (photo + dark overlay) between them. Footer near-black `#16171E`.
- **Hero:** full-screen photo (about 965 px high), black-and-white with a dark overlay, centred white headline,
  one short paragraph, one text-link button. The header (logo left, two links right) floats over the photo.
  A diagonal band of gold stripes cuts across the bottom-right corner.
- **Type:** Montserrat for everything. H1 60/72 px weight 800, H2 40/52 px weight 600, body 15/24 px grey `#777679`,
  lead text 20/34 px. Small labels ("eyebrows") above each H2: Bebas Neue, 19 px, letter-spacing 2 px, gold,
  uppercase. Card titles Bebas Neue 30 px, letter-spacing 2 px, white.
- **Colour:** ink `#16171E` for headings, grey for body text, one accent (gold `#E7C55A`) used sparingly:
  eyebrows, link underlines, form panel, stripes.
- **Buttons:** no pills or boxes. A text link, 15 px weight 600, with a 2 px accent underline, 10 px below,
  and a small arrow →.
- **About block:** two columns: text left (eyebrow, H2, two paragraphs, link), a tall photo right (535×669, square corners).
- **Service cards:** 2×2 grid of large photos (about 600×330), dark gradient at the bottom, title + one line + link
  in white over the photo. Square corners, small gaps (about 12 px).
- **Contact:** grey section, text and contact lines with small accent icons left, a solid accent-coloured form panel right.
- **Footer:** dark, four columns (logo, address, links, social), thin line, centred copyright.
- **Corners:** square everywhere (0 px radius). No shadows. Generous white space.
- **Phone:** single column; hero stays a full-screen photo; header collapses to logo + menu button;
  cards stack full width; 100 px section padding shrinks.

## How it maps onto FaceThis
- Background white `#FFFFFF`, alternate sections `#F2F2EF` (the FaceThis off-white, slightly warm).
- Ink `#0A0A0A` (FaceThis black) for headings; body grey `#5C5C56`.
- Accent: FaceThis lime `#C4F82A`. Lime is unreadable as text on white, so it is used as a **fill or line**:
  underlines of links, eyebrow marker bars, buttons with black text, the form panel, the stripe band, highlights
  behind words. On dark bands (hero, film, footer) lime may be text, as before.
- Fonts: keep FaceThis's Anton (display) and Archivo (text): Anton plays the role of Bebas, Archivo of Montserrat.
  Headings switch to sentence-weight Archivo 800 like copragym; Anton stays for eyebrows and card titles.
- Pills (999 px radius) become square corners; cards lose their rounded dark boxes.
- Photo placeholders stay placeholders (there are no real photos yet), but get copragym's size and dark-overlay look.
