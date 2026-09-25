# Slide patterns

Proven slide types from real consulting decks, each with zones on the grid and a text budget per zone. Build a slide by picking a pattern and filling its zones, instead of composing from scratch. The pattern fixes structure; the chosen direction (`direction.md`) fixes the look: colours, type, image world. The same pattern looks different in every deck.

Evidence: 9 public decks by McKinsey, BCG, Bain and Roland Berger, viewed page by page (`research/beratungsdecks.md`, codes like MCK-DC p4 = PDF page 4). Zone sizes and budgets are **starting values**, built, rendered and checked in `examples/patterns/` (no detector finding, no overflow; the fill limit fails on full-size charts and on the `talk` patterns, see there). Real reading decks are denser than those limits (about 200 to 300 words per slide); see the research notes before loosening anything.

## How to use
- In the deck plan, every slide row names its pattern (`Layout type` column: the pattern id, for example `P04 chart-rail`). A deck uses 4 to 8 patterns; each pattern is one layout, identical wherever it recurs. Name the slide layout (master) in the file after the pattern, for example `P04 chart-rail`: the plan comparison (check 12) matches layouts by name, and the recurring-position check compares positions within each layout.
- Pick by the job of the slide (table below), not by variety. Repetition of a pattern is recognition; a new pattern needs a new job.
- Text budgets are maxima per zone for `read` (words; for German use about 6 characters per word). `update` uses the same zones at about two thirds of the budget. `talk` and `pitch` use the patterns marked for them.
- If content does not fit the budget, split the slide or move detail to notes or the appendix. Never shrink type below the role size to make it fit.
- Boxes are allowed where the pattern names them (a panel, a callout, a takeaway band). Cards as a default container, cards in cards and grids of equal cards are not (`refuse.md`, detector check 9).

| Job of the slide | Pattern |
|---|---|
| open the deck | P01 cover |
| show where we are in the argument | P02 divider-agenda |
| give the whole answer on one page | P03 summary |
| prove one claim with one chart and say what it means | P04 chart-rail |
| show one trend or comparison, one value in focus | P05 chart-focus |
| prove one claim with two views of the evidence | P06 two-exhibits |
| compare many items on several measures | P07 table |
| explain how a total is built or changed | P08 bridge |
| contrast today and target, or two options | P09 before-after |
| structure a set of items (challenges, levers, imperatives) | P10 numbered-rows |
| show a sequence in time | P11 timeline |
| prove with a case, quotes or a photo | P12 case |
| make one to three numbers land | P13 key-numbers |
| make one statement land, with a picture | P14 statement |

## Frame (all patterns except P01, P02, P14)

Canvas 960 × 540 pt (13.33 × 7.5 in), margin 48 pt, 12 columns with 16 pt gutters (column 57.3 pt). Useful spans: 4 col = 277 pt, 5 = 351, 6 = 424, 7 = 497, 8 = 571, 12 = 864.

| Zone | Position (pt) | Content | Budget |
|---|---|---|---|
| Tracker (optional) | x 48, y 48, h 14 | chapter name or number, fixed position, small | 4 words |
| Status mark (optional) | right-aligned at x 912, y 48 | "Preliminary", "Illustrative", "Not exhaustive" | 3 words |
| Title | x 48, y 64, w 864, h 58 | claim sentence, 1 to 2 lines, left | profile ceiling (`read` 15 words) |
| Measure line (optional) | x 48, y 124, h 18 | what is measured, unit, period: "Buyout deal value, $ billions, 2005–2022" | 10 words |
| Body | x 48, y 156 to 436 (h 280) | the pattern's zones | per pattern |
| Footnotes and source | x 48, y 446, w 700, h 30 | numbered footnotes, then "Source: …, date" | not counted |
| Page number | right-aligned at x 912, y 462 | number | not counted |

Rules that hold in every pattern (seen in all nine decks):
- The title carries the claim; an exhibit headline inside the body names the evidence, not the claim again.
- Every exhibit has its measure and unit, either in the measure line or in its panel header.
- One focus colour marks what the title talks about (a bar, a row, a period); everything else is neutral.
- Annotations sit on the exhibit: a callout with a pointer, a dashed frame around a period with its growth figure, a multiplier bracket ("2x") between bars (MCK-DC p3, BCG-MEDIA p22, BAIN-RES p20).
- The takeaway, when the pattern has one, is a sentence with a number, not a label.

---

## P01 cover
**Use:** first slide. **Profiles:** all. **Evidence:** BAIN-PE p1 (full-bleed photo, solid text panel), MCK-DC p1 (dark ground, title left, photos in a strip on the right), BCG-NYCHA p1 and MCK-USPS p1 (typographic: title, subtitle, date, client mark).
```
┌──────────────────────────────────────────┐      ┌──────────────────────────────────────────┐
│ (photo, full bleed)                      │      │                                          │
│                                          │  or  │  Title of the deck, up to 2 lines        │
│ ┌──────────────┐                         │      │  Subtitle: audience, occasion, date      │
│ │ Title        │                         │      │                                          │
│ │ Sub · date   │                         │      │  ────                                    │
│ └──────────────┘                         │      │                                          │
└──────────────────────────────────────────┘      └──────────────────────────────────────────┘
```
- **Zones:** title block in cols 1–6, vertically in the lower half or the optical centre; subtitle directly under it; optional photo as ground with a solid panel behind the text (never text on the photo).
- **Budget:** title 10 words, subtitle 12 words.
- **Avoid:** a decorative illustration built from shapes; the same cover composition in every deck regardless of direction.

## P02 divider-agenda
**Use:** section start in decks over 10 slides; shows the whole structure with the current section marked. **Profiles:** read, update, pitch. **Evidence:** MCK-DC p2, p7, p30 (coloured ground, current item framed), BCG-NYCHA p50 and BCG-MEDIA p6 (others greyed).
```
┌──────────────────────────────────────────┐
│                                          │
│   1  Baseline conditions   (grey)        │
│ ▶ 2  Challenges and trends (full colour) │
│   3  Opportunities         (grey)        │
│   4  Appendix              (grey)        │
└──────────────────────────────────────────┘
```
- **Zones:** list in cols 1–7 (or 6–12), vertically centred; the current section in full contrast, the others at reduced contrast (still at least 3:1 against the ground).
- **Budget:** 3 to 6 sections, 6 words each.
- **Note:** this is an exempt slide type (no claim title). A contents slide is allowed only in decks over 15 slides (`refuse.md`); the divider version is allowed from 10.

## P03 summary
**Use:** the whole answer on one page, usually slide 2. **Profiles:** read, update. **Evidence:** BCG-MEDIA p3, BCG-NYCHA p10 (bold lead sentences, bullets under each).
```
┌──────────────────────────────────────────┐
│ Title: the governing message             │
│                                          │
│ Lead sentence 1 (bold claim)             │
│   · support   · support                  │
│ Lead sentence 2 (bold claim)             │
│   · support   · support                  │
│ Lead sentence 3 (bold claim)             │
│   · support                              │
└──────────────────────────────────────────┘
```
- **Zones:** one text column, cols 1–10 (never full 12: the line would be too long); lead sentences in the body role bold, supports in body regular with more space above each lead than below it.
- **Budget:** 3 to 4 lead sentences of 15 words, 1 to 2 supports of 12 words each; slide total within the profile limit.
- **Rule:** read the lead sentences alone: they are the title strand of the deck in short.

## P04 chart-rail
**Use:** one claim, one chart, and what it means. The most frequent pattern in the reading decks. **Profiles:** read, update, pitch. **Evidence:** MCK-DC p3, p12, p16 (grey rail), BCG-MEDIA p22, RB-TREND p11, MCK-USPS p3, p5 (two panels).
```
┌──────────────────────────────────────────┐
│ Title (claim)                            │
│ Measure line                             │
│ ┌───────────────────────────┐ ┌────────┐ │
│ │ chart (8 col)             │ │ rail   │ │
│ │  focus bar in accent,     │ │ 2–4    │ │
│ │  callout on the chart     │ │ points │ │
│ └───────────────────────────┘ └────────┘ │
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** chart cols 1–8, rail cols 9–12. The rail is either plain text with a rule on its left, or a light neutral field (not a card with shadow or stripe).
- **Budget:** rail heading 6 words, 2 to 4 points of up to 18 words; chart labels short (category names up to 3 words).
- **Rules:** the rail says what the chart means (so what), not what it shows. One callout at most on the chart.

## P05 chart-focus
**Use:** one trend or comparison, one value in focus; the presentation form of P04. **Profiles:** talk, pitch, read. **Evidence:** BAIN-PE p5, p7, p9 (grey bars, focus bar and its value in the accent colour, one-line title).
```
┌──────────────────────────────────────────┐
│ Title (claim with the number)            │
│ Measure line                             │
│  ▂ ▃ ▂ ▅ ▆ ▅ ▇ ▆ ▅ ▇  █ ← $654B          │
│  (all neutral)        (accent)           │
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** chart cols 1–12 (or 1–10 with the focus label in the free columns).
- **Budget:** chart labels only; the focus value repeats the number from the title.
- **Rules:** neutral series at least 3:1 against the ground (`rules-core.md` §4); no legend when one series; direct value label on the focus bar only.

## P06 two-exhibits
**Use:** one claim proved by two views (two measures, two periods, two groups). **Profiles:** read, update. **Evidence:** BCG-MEDIA p30, BAIN-RES p20 (two charts on one light band), MCK-USPS p8 (stacked), MCK-DC p12 (small multiples).
```
┌──────────────────────────────────────────┐
│ Title (claim that needs both views)      │
│ ┌──────────────────┐ ┌──────────────────┐│
│ │ Exhibit A header │ │ Exhibit B header ││
│ │ unit             │ │ unit             ││
│ │ chart            │ │ chart            ││
│ └──────────────────┘ └──────────────────┘│
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** A in cols 1–6, B in cols 7–12; each with a header of up to 8 words and its unit. Optional shared light band behind both (one band, not two cards).
- **Budget:** two headers of 8 words, two units, chart labels.
- **Rules:** the same scale where the measures are the same; the same focus colour meaning in both.

## P07 table
**Use:** many items on several measures, where every row matters. **Profiles:** read, update. **Evidence:** MCK-DC p4, p5, p6 (full width, cells coloured by value, one row highlighted, bold takeaway under the table).
```
┌──────────────────────────────────────────┐
│ Title (claim about the highlighted row)  │
│ Measure line                             │
│ Item            A      B      C          │
│ ─────────────────────────────────────    │
│ row                                      │
│ ▶ focus row (accent)                     │
│ row                                      │
│ Takeaway sentence with a number          │
│ Footnotes · Source                       │
└──────────────────────────────────────────┘
```
- **Zones:** table cols 1–12, takeaway line under it.
- **Budget:** up to 8 rows × 5 columns in `read`; cell text 3 words; takeaway 18 words.
- **Rules:** numbers right-aligned with tabular figures; rules instead of zebra stripes; value-coloured cells only with a legend in the header and a neutral scale plus one accent.

## P08 bridge
**Use:** how a total is built or how it changed from A to B (waterfall). **Profiles:** read, update, pitch. **Evidence:** BCG-IRA p10 (waterfall with a table of drivers to its right); variance bars with pointers MCK-USPS p3.
```
┌──────────────────────────────────────────┐
│ Title (claim: what drives the change)    │
│ Measure line                             │
│ █ ▀▀▄ ▄▄ ▀▄ █        │ driver  · note    │
│ start +a  +b  -c end │ driver  · note    │
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** bridge cols 1–8, driver notes cols 9–12 aligned with the bars' order; or bridge cols 1–12 with notes under the bars.
- **Budget:** 4 to 7 steps; notes up to 12 words each.
- **Rules:** start and end bars neutral dark, increases and decreases in two fixed colours (the signal colour for the negative), every step labelled with its value.

## P09 before-after
**Use:** today versus target, or two options, along the same rows. **Profiles:** read, update, pitch. **Evidence:** BCG-NYCHA p35 (row labels left, current state and future state, chevron between), MCK-USPS p20 (upside and downside as two panels).
```
┌──────────────────────────────────────────┐
│ Title (claim about the change)           │
│          Today            Target         │
│ Row A │ · point        ▶ │ · point       │
│ Row B │ · point        ▶ │ · point       │
│ Row C │ · point        ▶ │ · point       │
└──────────────────────────────────────────┘
```
- **Zones:** row labels cols 1–2, left column cols 3–7, arrow in the gutter, right column cols 8–12. Column headers in the label role; rows separated by rules.
- **Budget:** 2 to 4 rows; up to 20 words per cell.
- **Rules:** row labels are text on a rule or a light field, one text each (not cards); the arrow or chevron is one shape per row or one for the whole slide.

## P10 numbered-rows
**Use:** a set of items that structure the argument (challenges, levers, imperatives), each with two or three attributes. **Profiles:** read, update, pitch. **Evidence:** MCK-DC p8 (five numbered challenges, two attribute columns), BCG-NYCHA p5 (ten imperatives, the one in focus highlighted).
```
┌──────────────────────────────────────────┐
│ Title (claim about the set)              │
│     Item          Attribute A  Attr. B   │
│ 1   Health        · point      · point   │
│ 2   Congestion    · point      · point   │
│ 3   Curbside      · point      · point   │
└──────────────────────────────────────────┘
```
- **Zones:** number col 1, item name cols 2–3, attributes cols 4–8 and 9–12; rows separated by rules.
- **Budget:** 3 to 6 rows; item name 4 words; up to 15 words per attribute cell.
- **Rules:** the numbers carry the order the text refers to (no leading zero); the focus row in the accent; rows, not cards.

## P11 timeline
**Use:** a sequence of dated steps (roadmap, history, milestones). **Profiles:** all. **Evidence:** RB-TREND p20, p40.
```
┌──────────────────────────────────────────┐
│ Title (claim about the sequence)         │
│ ●────────●────────●────────●──────▶      │
│ 2027     2028     2029     2030          │
│ step     step     step     step          │
│ Decision or next step (band)             │
└──────────────────────────────────────────┘
```
- **Zones:** axis across cols 1–12; 3 to 6 stations at even spacing or true time scale; optional decision band under it.
- **Budget:** date 3 words, step text up to 15 words per station; band 15 words.
- **Rules:** markers small (under 20 pt) on the axis line; the current or decisive station in the accent.

## P12 case
**Use:** evidence from one case, quotes or a place; makes an abstract claim concrete. **Profiles:** read, pitch, talk (photo variant). **Evidence:** MCK-DC p25 (description left, case with photo right), BCG-MEDIA p10, p15 (interview quotes as evidence), MCK-USPS p14 (map with photos of the network).
```
┌──────────────────────────────────────────┐
│ Title (claim the case proves)            │
│ Description        │ Case: name, place   │
│ · what it is       │ [photo]  · facts    │
│ · how it works     │          · result   │
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** description cols 1–5, case cols 6–12 with photo (real, credited) and 3 to 5 facts; quote variant: 2 to 4 quotes, each with its speaker's role.
- **Budget:** description 40 words, case facts 50 words; quotes up to 25 words each.
- **Rules:** a real photo or none (no stock cliché, no illustration built from shapes); a quote names who said it.

## P13 key-numbers
**Use:** one to three numbers that must land. **Profiles:** talk (one number), pitch, read (two to three parts of one measure). **Evidence:** BAIN-IABC p4 (three percentages that add up to 100 %, lead-in sentence, one explanation per number, source), BAIN-RES p2 (numbers with a short rule above and a sentence below).
```
┌──────────────────────────────────────────┐
│ Title (claim)                            │
│ Lead-in: "In a study of 400 programmes…" │
│   20 %          68 %          12 %       │
│   …failed       …settled      …achieved  │
│ Source                                   │
└──────────────────────────────────────────┘
```
- **Zones:** lead-in cols 1–12; numbers in cols 1–4, 5–8, 9–12 (or one number in cols 1–6 with its context in 7–12).
- **Budget:** lead-in 15 words; per number one sentence of up to 15 words.
- **Rules:** the numbers are parts of one measure or one comparison, never unrelated metrics; no boxes around them (the detector fails boxed number rows); a source line even for a single number.

## P14 statement
**Use:** one idea for a live audience: a statement, a question for the room, a chapter opener. **Profiles:** talk, pitch. **Evidence:** BAIN-RES p14 (photo strip over the top half, statement below), BAIN-RES p10 (numbered list on a dark panel over a photo), BAIN-PE p2 (photo with a panel holding three short texts divided by fine rules).
```
┌──────────────────────────────────────────┐
│ (photo, top half or full bleed)          │
│                                          │
│ ┌───────────────────────┐                │
│ │ Statement, 6–12 words │                │
│ └───────────────────────┘                │
└──────────────────────────────────────────┘
```
- **Zones:** photo as ground (full bleed or the upper half), statement on a solid panel or on the plain half, cols 1–8.
- **Budget:** `talk` limits apply: the statement is the title (up to 8 words at 40 pt and more), up to 7 further words.
- **Rules:** the photo shows the subject, not a metaphor; text never directly on the photo.

---

## What the patterns do not cover
- The look: colours, type pairing, image style and whether panels are fields or rules come from the chosen direction.
- Appendix and backup slides: use P07 or P04 at the denser end of the budget.
- Values that the research found in conflict with the profile limits (words per slide, footnote size, footer position) are listed in `research/beratungsdecks.md` and decided in BRIEF §10, step 4.
