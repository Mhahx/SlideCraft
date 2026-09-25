# Context profiles

Pick exactly one profile before building. Key question: is the slide read, or does it accompany a speaker? Every value below is a **starting value** (unproven, to be calibrated on real decks). Counting rules (words, fill) are in the glossary of `rules-core.md`.

## Value table

| Value | `read` | `talk` | `pitch` | `update` |
|---|---|---|---|---|
| Title / statement size | 20-28 pt | at least 40 pt | 28-36 pt | 20-28 pt |
| Title length ceiling (words) | 15 | 8 | 10 | 15 |
| Title lines | at most 2 | at most 2 | at most 2 | at most 2 |
| Body minimum | 14 pt | 24 pt (supporting text) | 18 pt | 14 pt |
| Footnote / source minimum | 8 pt | 12 pt | 8 pt | 8 pt |
| Words per slide (max, incl. title) | 250 | 15 | 40 | 80 |
| Characters per slide (max, incl. spaces; use instead of words for German) | 1500 | 90 | 240 | 480 |
| Fill of the live area (reference, reported only) | 75 % | 30 % | 50 % | 60 % |

The title ceiling comes from a line-capacity estimate, not a measurement: over the live-area width of 873 pt, a bold sans title holds about 43 characters per line at 40 pt, about 47 at 36 pt and about 61 at 28 pt (average glyph width about 0.5 em). A title must fit its role in 2 lines; if it does not, shorten it, do not shrink it below the profile size. Serif titles (for example Cambria) are wider and hold fewer words.

Calibrated in 0.14 on nine real consulting decks (`docs/research/beratungsdecks.md`): `read` words 250 (decision by Max; the reading decks show 130 to 300), title 20-28 pt in `read` and `update` (medians 20 to 25 pt), footnote and source 8 pt in `read`, `update` and `pitch` (all decks set sources in 7 to 8 pt). `talk`, `pitch` and `update` word limits are unchanged: the corpus has no status report, and the presented Bain decks sit between `talk` and `pitch`.

The margin of 0.667 in leaves about 74 % of the slide as live area.

The fill values are reported, not enforced, until they are calibrated (decision Max, 2026-09-25): the pattern test build (`examples/patterns/`) showed that charts at the size real decks use exceed 75 % in `read`, and that the two-line 40 pt title field alone takes 23 % of the live area in `talk`. The zones of `patterns.md` decide exhibit size, not the fill value.

## read (decision paper, report, leave-behind)
Model: McKinsey, BCG, Bain. The slide must be understandable without a speaker.
- Claim title, answer first (pyramid principle).
- At most 3 to 5 supporting points, one central exhibit, or two views of the same claim side by side (`patterns.md` P06).
- Structure: title on top, the exhibit in the body, source and page number in the footer. Structured text is fine, no running paragraphs.
- A tracker (status or chapter marker) is allowed. A kicker is not. Colours come from the chosen direction, not from the profile.
- Explainable in about 60 seconds.

## talk (keynote, conference, live board presentation)
Model: Apple/Jobs, Presentation Zen. The slide accompanies, it does not replace the speaker.
- One idea per slide, understood in about 3 seconds. Title of 6 to 8 words at 40 pt or more, plus at most 7 further words on the slide.
- No bullets; use spacing. One highlighted number or one image per slide, a key number of 60 pt or more is fine. A single number without a label block, supporting stats and accent is not the banned hero-metric template.
- Prefer full-bleed images with a text panel or scrim for contrast. Full-bleed images are ground and do not count towards fill.
- Details go into speaker notes, not onto the slide.
- Dark background is fine for dimmed rooms. Compute the contrast anyway.

## pitch (investors, customers, persuading)
Model: Bain narrative, good founder decks. The story carries, the proof supports.
- Claim title of at most 10 words, one message. Arc visible: problem, solution, proof, market, model, team, ask. Adapt the order to the audience.
- Show the product instead of describing it (real screenshot, real number). No mockup clichés.
- Every figure with a source or marked as an assumption.
- A look derived from the brand or the topic, not from defaults.

## update (status, internal reporting, team sync)
Model: lean consulting style. Quick to grasp, little ceremony.
- Claim title ("Project is 2 weeks behind plan").
- Status colours are allowed as an exception to the colour count, always with a text label.
- Every status slide shows trend, deviation and next step. Avoid pure activity lists.
- One fixed status layout, identical across all issues.

## Combining profiles
A deck has one main profile. Single slides may quote another (for example a key-number slide in `talk` style inside a `pitch`), but fonts, colours and grid stay identical deck-wide.
