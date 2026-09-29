# Pictograms

A pictogram is a small symbol that stands for one thing (a plane, a house, a tick). This file holds firm rules only. The skill never adds pictograms on its own initiative: they appear when the user asks for them or the brief says so (`Pictograms: allowed (source: ...)` in the deck plan). The default is `Pictograms: none`.

## When a pictogram is allowed

Take the pictogram away and look at the slide. If a word or a fact is lost, it is allowed. If the slide reads the same, it is decoration and stays out.

1. **Label replacement.** The pictogram stands in for a noun the audience would otherwise have to read: a plane instead of the word "plane". Only in `talk` and `pitch`, where the slide accompanies a speaker and reading competes with listening. Only for a concrete thing (plane, house, truck, person, battery). Never for an abstract idea (strategy, innovation, synergy): the audience has to guess, and guessing is the distraction this rule avoids. A symbol with more than one plausible reading (a plane can mean aviation, travel or one airline) needs the title or the speaker to name the idea.
2. **Fact carrier.** A status mark in a table or legend (tick, cross, warning), the unit symbol of a quantity chart where one symbol stands for a stated number, a map or wayfinding sign. Allowed in every profile. The unit or the meaning is stated on the slide.

A pictogram next to a line that already says the same in words (an icon beside "Mobility") is neither. It is the decorative pattern this skill exists to prevent.

## Form

- One set per deck: one source, one style (line or filled, never mixed), one stroke weight, one size per role, one colour role (text colour or the accent).
- Beside or in place of its word, never in a tile, circle or coloured box, never as a bullet marker, never as a row of symbols above headings (`icon-tile-stack`).
- Not larger than the slide's title in visual weight. Starting value for `talk` and `pitch`: at least 36 pt (0.5 in) on a 13.33 in wide slide, so a stroke survives a projector.
- A real vector or picture object, never built from ellipses and rectangles (check list item 13a). Emoji and Unicode symbols are not pictograms (`emoji`).
- Alt text is the word or the fact the pictogram carries ("Plane"), not a file name.

## Where the artwork comes from

In this order; the plan names the source in the field `Pictograms`.

1. The user's or the brand's own set.
2. The icon library of the building tool, where it can insert one (for example PowerPoint's Insert > Icons). Whether the PowerPoint add-in can do this is not verified (`docs/development.md`, open points).
3. An open set as SVG, with its licence named in the plan. Check the licence file of the package; do not rely on memory.
4. Newly drawn, only when the user asks for it. Then one style for the whole set, fixed before the second symbol is drawn: one grid, one stroke weight thick enough to hold at 36 pt, one kind of ends and corners, one colour. Render the set at its use size and let the user approve the first row before the rest.

Building notes: pptxgenjs `addImage` with an `.svg` file keeps the vector (a PowerPoint SVG picture with a small PNG fallback). LibreOffice renders it sharply (tested in 0.25). Do not convert symbols to native freeforms; that path was not built.

## What the check script measures

The script cannot know what a picture means. It treats a non-placeholder picture with both sides between 14 and 115 pt (aspect 0.5 to 2, not named or described as a logo) as a pictogram candidate and reports, at deck level and always as an observation (check 14):

- how many there are and on which slides, against what the plan allows (`none` by default, or `allowed`, and whether a source is named);
- whether the sizes agree within 25 %;
- for `talk` and `pitch`, candidates under 36 pt.

Alt text is checked for every picture (check 8, a fail). Whether a symbol is a concrete noun, unambiguous, of one style and not decoration is a judgement for the render review (item 14 of the check list).

## Provenance

| Rule | Tag | Note |
|---|---|---|
| A symbol may not say more than the statement needs; a set must look like one system | Transferred | Isotype (Neurath, Arntz), read only in a secondary source; used as a test, not a measurement |
| Label replacement only in `talk` and `pitch`, concrete nouns only | Practitioner | the project owner's experience with spoken decks; untested here |
| Fact carriers in every profile | Transferred | status marks and unit symbols are how real decks and Isotype charts use them |
| At least 36 pt for `talk` and `pitch` | Starting value | not calibrated |
| Sizes agree within 25 % | Starting value | not calibrated |
