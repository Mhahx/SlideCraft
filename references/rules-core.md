# Core rules (apply in every profile)

All numbers are starting values for 16:9 at 13.33 x 7.5 in (960 x 540 pt) and are to be calibrated on real decks (see the provenance table at the end). A profile may tighten a value, never loosen it, unless the profile says so explicitly. Thresholds live in this file and in `profiles.md` only.

## Glossary (counting rules)
- **Live area:** slide minus margins (13.33 x 7.5 in minus 0.667 in on every side; about 74 % of the slide).
- **Fill:** share of the live area covered by the bounding boxes of text blocks, tables, charts and non-background shapes. Full-bleed images and background fields are the ground and are not counted.
- **Words per slide:** all visible text on the slide: title, body, labels, chart and table text. Not counted: the source/footnote line, the page number, speaker notes. For German (long compounds) use the character limit in `profiles.md`.
- **Data slide:** any slide with a chart, a table, or numbers that come from outside the deck.
- **Signal colour:** the one colour with a fixed meaning (for example "negative" or "warning"). It is not the same as the accent. Status colours of the `update` profile are a documented exception. A chart highlight uses the accent.
- **Weights:** at most 2 weights per family (for example regular and bold). "One weight heavier" for light text on dark means choosing which two, not a third.
- **Exempt slide types** for the action-title rule: title slide, section divider, quote slide, appendix divider, and a contents slide (allowed only in decks of more than 15 slides). Appendix content slides are not exempt.
- **Tracker:** a small marker in one fixed position that shows status ("Draft", "Confidential") or the position in the argument (chapter marker) and carries information. A **kicker** is a decorative label above the title. Trackers are allowed in `read` and `update`, kickers are not.

## 1. Structure
- One claim per slide.
- Slide title = full sentence with a verb ("Revenue grows 12 %"), not a topic ("Revenue development"). It must fit in 2 lines at its role size (the word ceiling per profile is in `profiles.md`), active voice. Exempt slide types are excluded.
- Read together, all titles tell the argument. Answer first, then reasons.
- Section dividers only where they improve orientation.

## 2. Typography
- At most 2 font families and at most 2 weights per family. One family is often enough.
- Font choice, in this order: the user's or brand font; otherwise a safe-list font. Safe list: Arial, Calibri, Cambria, Times New Roman, Courier New, plus Bookman Old Style and Century Schoolbook (Windows Office; availability on Mac Office and on the target machines is to be verified). Recommended pairings: one sans family with strong size and weight contrast, or a serif title (Cambria, Century Schoolbook) with a sans body (Calibri, Arial). Do not default to a serif title: choose by the direction. Differentiate through size, grid and colour, not through the typeface. If a non-safe font is requested, use it but leave about 10 % slack in text containers.
- Fixed roles, identical on all slides: title, subtitle, body, label, footnote. Name roles by purpose, not by value.
- Steps between neighbouring sizes at least a factor of 1.25. Roles that cannot be told apart are a defect.
- Minimum sizes come from the profile table. Footnote and source never below 10 pt.
- Left-aligned by default. Centered running text is not allowed. No text shadow, outline, WordArt.
- Light text on dark background: slightly more line spacing, choose the heavier of the two weights.

## 3. Grid and spacing
- Margin 0.667 in (48 pt) on all sides. Nothing outside the margin except deliberately bled images.
- 12-column grid. Align elements to shared edges, optically and mathematically.
- Spacing in multiples of 8 pt (margin, gaps, sizes of spacers). Group related items tightly, separate groups generously. More space above a heading than below.
- Recurring elements (title, footer, page number) at exactly the same position.
- Fixed layout types: title, divider, text, image, chart, comparison, quote/key number. Build them as real layouts/placeholders, not one-off text boxes per slide.
- Whitespace is a rule, not a leftover. The fill limit is in the profile table.

## 4. Colour
- Count: **1 accent + at most 1 signal colour; neutrals (background, text, greys) are not counted.** Deck-wide.
- Colour carries meaning, not decoration. The same meaning has the same colour on every slide.
- The `update` profile may use status colours (red/amber/green) as a documented exception, always with a text label as well.
- Text contrast: normal text at least 4.5:1, large text (at least 18 pt, or at least 14 pt bold) at least 3:1 (WCAG 2.2 SC 1.4.3). The pt sizes of WCAG refer to screens; applying them to projected slides is an approximation. Secondary text on a coloured surface is derived from that surface's hue, not neutral grey.
- Non-text contrast: graphic elements that carry meaning (bars, lines, markers, icons needed to understand a slide) at least 3:1 against adjacent colours (WCAG 2.2 SC 1.4.11). This includes the neutral colour used for de-emphasised chart elements: on a white background the neutral must be as dark as `959595` (3.0:1) or darker. Decorative rules and gridlines are exempt.
- Text is never placed directly on photos, gradients or busy areas. Place a text panel or scrim with known colour and opacity behind it.
- Light or dark is chosen from the use scene (room, projector, screen, print), not from the industry.

## 5. Image and graphics
- One good image beats many. The image carries a point. Consistent crop. No stock clichés (handshake, light bulb, puzzle pieces).
- Icons only from one library with uniform stroke and size. No emoji or Unicode symbols as icons.
- Caption or credit where needed. Alt text for every image and chart.

## 6. Data and charts
- The slide title or the chart title carries the claim, not both duplicating each other.
- Chart type follows task: comparison = bars, trend = line, share = stacked bar or few segments.
- Label directly instead of a legend where possible. One highlight colour (the accent), everything else neutral and at least 3:1 (see section 4).
- Several series: tell them apart by direct labels plus position, line style or marker shape, never by colour alone. More than 4 series: split into small multiples or reduce.
- No 3D, shadows, gradients or decorative gridlines. Honest axes, bars start at zero.
- Every data slide: source and date in the footer area.
- Tables: numbers right-aligned, tabular figures, rules instead of zebra stripes where enough.

## 7. Accessibility
- Reading order of objects correct (title first). A title is set on every slide.
- Never convey information by colour alone. Alt text on every image and chart.

## Checks: how each one is verified

Every check in a report carries its method. Only items with a method of *file*, *computed* or *script* are reported as pass or fail. Items with *render estimate* or *judgement* are reported as observations, never as thresholds. Never report a measured value that was not read from the file or computed by code. Until a script in `scripts/` provides fixed output per slide (planned), state which method you used for each value.

| Check | Method |
|---|---|
| Font sizes, font families, colour count, positions, margins, words per slide, alt text, reading order, titles set | file (read from XML or object properties) |
| Contrast of text and of graphic elements on a solid surface or scrim | computed (relative luminance per WCAG from file colours) |
| Fill share, optical alignment | script (until it exists: "not measured") |
| Overflow, text density, overall impression | render estimate (unreliable for non-safe fonts) |
| Title strand reads as a story, look not guessable, direction contract held | judgement |

Contrast rules:
1. Compute, do not estimate. Without code execution the value is marked as an estimate.
2. Resolve theme colours (for example `schemeClr` with `lumMod`, `lumOff`, `tint`, `shade`, inherited from master or layout) to the real hex value before computing.
3. For a semi-transparent scrim, blend its colour once over pure white and once over pure black, compute the contrast for both, and take the worse value.

Environments (source of values):

| Environment | Source |
|---|---|
| .pptx file (pptx skill) | OOXML for sizes, families, colours, positions; render only for overflow and impression |
| Slides artifact type (claude.ai) | the artifact's source data (sizes and colours); **to verify** what the type exposes |
| Claude in PowerPoint | object properties of the open deck; **to verify:** whether code can run there. If not, computed values count as estimates |
| Claude Design | the design's source code (colours and sizes are in the code) |

## Check list (one bundled pass after rendering)

Name evidence for each item (slide number, value, method). A bare "ok" is not evidence. Rules waived by the brief (see the plan's waiver list) are reported as "waived by brief", except contrast and accessibility, which are waived only on explicit user instruction.

1. Every non-exempt title is a claim sentence, at most 2 lines. [file, render estimate for line count]
2. Font families at most 2, sizes match the roles, body and footnote at or above the profile minimum. [file]
3. No text overflows, is cut off, or overlaps. Margins respected. [render estimate; margins: file]
4. Alignment on shared edges, recurring elements at the same position. [file; optical alignment: script]
5. Colour rule respected (1 accent + at most 1 signal). Text contrast and non-text contrast computed. [file, computed]
6. Words per slide within the profile limit [file]; fill within the profile limit [script].
7. Every data slide has source and date; charts labelled directly. [file]
8. Accessibility: every slide has a title, reading order correct, every picture and chart has alt text. [file]
9. No detectable item from `refuse.md` (gradient, shadow, 3D, emoji icons, edge stripes, accent lines under titles). [file]
10. The title strand reads as a story. [judgement]
11. The deck holds its direction contract (thesis, own-world), and the look is not guessable from the category alone (see `direction.md`). [judgement]
12. The deck matches its deck plan: fonts, role sizes, palette, margins and layout types are those of the plan. Every deviation is a finding, or the plan is extended deck-wide. [file]

## Provenance of the rules

Every rule group carries a tag. `Practitioner` means a practitioner source, not primary literature. `Transferred` means taken from another domain without a test on slides. `Starting value` means unproven and to be calibrated.

| Rule group | Tag | Source / note |
|---|---|---|
| Action titles, one claim per slide, source line | Practitioner | Deckary blog (vendor of an AI slide tool), Highbridge Academy; primary source to add: Minto, *The Pyramid Principle* (pages open) |
| Title word ceilings, words per slide, fill limits, 60-second and 3-second rules | Starting value | Consulting rule of "about 15 words" is practitioner only; 3-second rule: Gallo / Forbes |
| Text contrast 4.5:1 and 3:1 thresholds | Cited | W3C WCAG 2.2 SC 1.4.3 (pt sizes approximated for projection) |
| Non-text contrast 3:1 | Cited | W3C WCAG 2.2 SC 1.4.11 |
| Margins, 12 columns, 8 pt spacing, factor 1.25 | Starting value | Calibrate on real decks |
| Safe fonts, `LAYOUT_WIDE`, native charts, alt text | Cited | pptx skill (read locally) |
| Refuse list, calibration against AI looks, direction flow, fresh review | Transferred | Impeccable (`craft-floor.md`, `new-work.md`), untested on slides |
| Profile values | Starting value | `profiles.md` |
