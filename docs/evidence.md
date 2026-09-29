# Evidence: real consulting decks

The pattern library (`references/patterns.md`) and the `read` profile values are based on nine public decks by McKinsey, BCG, Bain and Roland Berger. They were downloaded, rendered and viewed page by page, and measured by code. The decks themselves are not in this repository (third-party content); the links are enough to check every reference.

Deck codes such as **MCK-DC p4** in the skill's reference files mean: deck MCK-DC, PDF page 4.

## Decks

| Code | Firm, title, year | Kind | Format | Pages | Source |
|---|---|---|---|---|---|
| MCK-DC | McKinsey, Transportation in DC, 2020 | client deck (Federal City Council) | 16:9 | 40 | https://www.federalcitycouncil.org/wp-content/uploads/2020/12/McKinsey_Transportation.pdf |
| MCK-USPS | McKinsey, USPS Future Business Model, 2010 | client deck (USPS) | 4:3 | 39 | https://about.usps.com/future-postal-service/mckinsey-usps-future-bus-model2.pdf |
| BCG-NYCHA | BCG, NYCHA Key Findings and Recommendations, 2012 | client deck (NYC Housing Authority) | about 4:3 | 112 | https://www.nyc.gov/assets/nycha/downloads/pdf/BCG-report-NYCHA-Key-Findings-and-Recommendations-8-15-12vFinal.pdf |
| BCG-MEDIA | BCG, Media and Entertainment in NYC, 2015 | client deck (NYC Mayor's Office) | 4:3 | 49 | https://www.nyc.gov/assets/mome/pdf/bcg-report-10.15.pdf |
| BCG-IRA | BCG slides in "Documents for the Record 5.23.23", US Congress, 2023 | analysis (from p10) | slide on portrait page | 23 | https://www.congress.gov/118/meeting/house/116005/documents/HHRG-118-IF02-20230523-SD003.pdf |
| BAIN-PE | Bain, Global Private Equity Report 2023, roadshow deck | presented deck | 16:9 | 17 | https://www.bain.com/globalassets/about/2023-global-pe-report---roadshow-deck.pdf |
| BAIN-RES | Bain, Resilience (AmCham Denmark), 2020 | presented deck | 16:9 | 27 | https://amcham.dk/wp-content/uploads/2021/04/20200412-Resilience-AmCham-presentation-vSHARED.pdf |
| BAIN-IABC | Bain, Change Communication (IABC Chicago), 2019 | presented deck | 16:9 | 17 | https://chicago.iabc.com/wp-content/uploads/2019/10/Bain-Presentation-Deck.pdf |
| RB-TREND | Roland Berger, Trend Compendium 2050: Technology and Innovation, 2025 | reading deck / study | 16:9 | 72 | https://www.rolandberger.com/publications/publication_pdf/roland_berger_trend_compendium_2050_trend_5_technology_and_innovation.pdf |

Found through the link lists of slideworks.io. PDFs on `web-assets.bcg.com` and `mckinsey.com` could not be fetched (bot protection).

## Measurements

Measured by code from the PDFs (PyMuPDF text spans with size and position), normalised to a slide height of 540 pt (16:9 = 960 × 540 pt, as in the skill). Title = largest text in the top quarter of the page.

| Deck | Title size (median) | Words in title (p25–p75) | Words per slide (p25–p75) | Smallest text (median) | Source line on | Title left (pt) | Source line top (pt of 540) |
|---|---|---|---|---|---|---|---|
| MCK-DC | 25 pt | 11–17 | 131–304 | 8 pt | 34 of 39 | 44 | 512 |
| MCK-USPS | 17 pt | 9–13 | 79–124 | 8.8 pt | 16 of 39 | 63 | 482 |
| BCG-NYCHA | 24 pt | 7–12 | 149–243 | 7 pt | 23 of 108 | 35 | 514 |
| BCG-MEDIA | 22 pt | 8–20 | 211–308 | 6.5 pt | 19 of 48 | (4:3) | (4:3) |
| BAIN-PE | 24 pt | 9–22 | 14–46 | 16 pt | 0 of 15 | 30 | – |
| BAIN-RES | 28 pt | 6–15 | 54–111 | 8 pt | 9 of 25 | 29 | 498 |
| BAIN-IABC | 26 pt | 7–17 | 49–112 | 8 pt | 6 of 16 | 29 | 508 |
| RB-TREND | 20 pt | 16–21 | 278–357 | (chart text) | 65 of 70 | 154 (navigation bar left) | 528 |

Limits: title detection is a heuristic (largest text at the top); dividers and cover pages skew single values; for BCG-MEDIA the normalisation is approximate because of 4:3.

## What the skill took from the measurements (0.14)

| Value | Before | Now | Evidence |
|---|---|---|---|
| Words per slide, `read` | 120 | 250 | reading decks p25–p75 from 130 to 300 words; 250 is a project decision |
| Title size, `read` and `update` | 24–28 pt | 20–28 pt | medians 20 to 25 pt |
| Footnote and source, `read`, `update`, `pitch` | 10 pt | 8 pt | sources in all decks at 7 to 8 pt |
| Footer | inside the 48 pt margin | footnotes, source and page number down to 18 pt above the bottom edge | source lines at 482 to 514 of 540 pt |
| Colour | 1 accent + at most 1 signal colour | neutrals, 1 accent, at most one signal pair; tints of one colour count once | MCK-DC p4 (blue scale plus an orange focus row), BAIN-PE (red on grey) |

Not calibrated: `talk`, `pitch` and `update` word limits (the corpus has no status report; the presented Bain decks sit between `talk` and `pitch`), fill share (reported, not enforced), body text minimums.

## Observations the patterns rely on

### Slide frame
- **Head:** claim title, left-aligned, 1 to 2 lines (all decks). Often a measure line below it: "Net profit/loss, $ billions" (MCK-USPS p3), "Global buyout deal value (excl. add-ons)" (BAIN-PE p5).
- **Tracker:** chapter name above the title (MCK-USPS p3, p5, p8; BAIN-RES p14), numbered chapter circle top right (BCG-MEDIA p10, p15, p22, p30), number in the title (MCK-DC p12, p16), navigation bar on the left (RB-TREND).
- **Status marks** top right: "Preliminary, proprietary, pre-decisional", "Non-exhaustive" (MCK-DC p8), "Not Exhaustive" (BCG-IRA p10), "Illustrative" (BAIN-IABC p9).
- **Foot:** numbered footnotes, then "Source: …" left, firm and page number right (MCK-DC, MCK-USPS, BCG-NYCHA, RB-TREND).

### Recurring slide types (→ pattern)
- Chart plus interpretation column, about 60/40 to 70/30: MCK-DC p3, p12, p16; BCG-MEDIA p22; RB-TREND p11; MCK-USPS p3, p5 (→ P04 chart-rail).
- One full-width chart with one bar highlighted: BAIN-PE p5, p7, p9 (→ P05 chart-focus).
- Two exhibits side by side or stacked, each with its own heading and unit: BCG-MEDIA p30, BAIN-RES p20, MCK-USPS p8, MCK-DC p12 (→ P06 two-exhibits).
- Full-width table, one row highlighted, key message below: MCK-DC p4–p6 (→ P07 table).
- Waterfall with a table beside it: BCG-IRA p10 (→ P08 bridge).
- Before/after with row labels and an arrow between the columns: BCG-NYCHA p35; opportunities/risks: MCK-USPS p20 (→ P09 before-after).
- Numbered list as structure: MCK-DC p8, BCG-NYCHA p5 (→ P10 numbered-rows).
- Timeline: RB-TREND p20, p40 (→ P11 timeline).
- Case with photo: MCK-DC p25; quotes as evidence: BCG-MEDIA p10, p15 (→ P12 case).
- Executive summary as bold key sentences with 2 to 4 sub-points each: BCG-MEDIA p3, BCG-NYCHA p10 (→ P03 summary).
- Agenda as divider, current chapter highlighted: MCK-DC p2, p7, p30; BCG-NYCHA p50; BCG-MEDIA p6 (→ P02 divider-agenda).
- Key numbers: three percentages that add up to 100 % with an intro sentence (BAIN-IABC p4); single numbers with a rule above and a sentence below (BAIN-RES p2) (→ P13 key-numbers).
- Statement on a photo: cover with full-bleed photo and a black text panel (BAIN-PE p1), photo strip plus statement (BAIN-RES p14) (→ P01 cover, P14 statement).

### Highlighting and annotation
- One focus colour on neutral grey: BAIN-PE p5, p7 (red), MCK-DC p4 (orange row in a blue table), BCG-NYCHA p20 (green).
- Callout box pointing at a chart position: MCK-DC p3, MCK-USPS p3.
- Dashed frame around a period plus a growth bubble ("+14 %"): BCG-MEDIA p22, p30.
- Multiplier brackets ("2x") between bars: BAIN-RES p20.
- Key message as a band below the exhibit: BCG-MEDIA p15, MCK-DC p4, BAIN-IABC p12.

### Corrections to the detector (0.12)
- Panels with a header band (MCK-USPS p3, p5, p8, p20) are grammar, not a card in a card: `nested-cards` ignores flush header and footer bands.
- Row labels in grey fields (BCG-NYCHA p35) are not cards: `card-grid` counts only boxes with at least two text elements.
- A row of big numbers without boxes appears in a real Bain deck (BAIN-IABC p4): `stat-row` fails only when the numbers sit in boxes.
- Boxes are not banned: two framed panels (MCK-DC p25, MCK-USPS p20) and one dark callout box (MCK-DC p3) are common. The AI pattern is the card as the default container, not a single box with a function.
- Violet as a brand colour (RB-TREND): `default-look` is an observation; with a brand it is a waiver, not a finding.

## Provenance of the rules

Moved here from the end of `references/rules-core.md` in 0.25: project history, not needed by the model at build time. Every rule group carries a tag. `Practitioner` means a practitioner source, not primary literature. `Transferred` means taken from another domain without a test on slides. `Starting value` means unproven and to be calibrated.

| Rule group | Tag | Source / note |
|---|---|---|
| Action titles, one claim per slide, source line | Practitioner | Deckary blog (vendor of an AI slide tool), Highbridge Academy; primary source to add: Minto, *The Pyramid Principle* (pages open) |
| Title word ceilings, words per slide, fill limits, 60-second and 3-second rules | Starting value | Consulting rule of "about 15 words" is practitioner only; 3-second rule: Gallo / Forbes |
| Text contrast 4.5:1 and 3:1 thresholds | Cited | W3C WCAG 2.2 SC 1.4.3 (pt sizes approximated for projection) |
| Non-text contrast 3:1 | Cited | W3C WCAG 2.2 SC 1.4.11 |
| Margins, 12 columns, 8 pt spacing, factor 1.25 | Starting value | Calibrate on real decks; footer in the bottom margin measured (this file) |
| `read` words 250, title 20-28 pt, footnote 8 pt, colour roles | Measured (0.14) | nine real decks, this file; 250 words is a project decision (the reading decks show 130 to 300); titles: medians 20 to 25 pt; all decks set sources in 7 to 8 pt. `talk`, `pitch` and `update` word limits unchanged: the corpus has no status report, and the presented Bain decks sit between `talk` and `pitch` |
| Fill values reported, not enforced | Project decision (0.13) | the pattern test build showed charts at real-deck size exceed 75 % in `read` |
| Safe fonts, `LAYOUT_WIDE`, native charts, alt text | Cited | pptx skill (read locally) |
| Refuse list, calibration against AI looks, direction flow, fresh review, modes | Transferred | Impeccable (`craft-floor.md`, `new-work.md`, its commands), untested on slides; not adopted: `harden`, `optimize`, `adapt`, `onboard`, `live`, `overdrive` and the web detectors (HTML, CSS, responsive behaviour, interaction) |
| Direction contract, three blocks (0.25) | Transferred, shortened | Impeccable's six blocks; STORY, FORM and FINISH dropped because the deck plan already holds them (story section, drafts shown, workflow steps 7 and 8) |
| Detector rules and their thresholds (equal size within 5 %, tile 20 to 72 pt, big number 40 pt, gaps up to 24 pt) | Transferred, starting value | Impeccable detector (`antipatterns.json`), transferred to OOXML geometry; tested on a synthetic AI-style deck (`tests/fixtures/slop.pptx`) and four example decks only |
| Placeholder-text detector (`platzhalter`, `todo`, `tbd`, `lorem ipsum`, a bare `xx`, bracketed stand-ins) | Practitioner, starting value | own fixed list; a placeholder is always a fail (0.21) |
| Text-shape overlap as a file check (was render estimate only) | Starting value | bounding-box geometry from the file; found by an audit run (0.21) |
| Claim-title heuristic (finite verb list) | Starting value, low recall by design | own fixed German/English verb list; never more than an observation, since many valid claims use a verb outside the list (0.21) |
| Extended source-line prefixes (`laut`, `gemäß`, `nach Angaben von`) and the same-number-recurs check | Starting value | found by an audit run (0.21); the prefixes widen check 7, the recurrence check is new at deck level |
| Overlap check reads layout and master graphics (a logo counts) | Starting value | found by an audit run on a real deck (0.23); direct children of the layout/master spTree only, groups out of scope |
| A plan role of kind "other" (cover, divider, quote, display) is not held to the profile's title-size range in check 2 | Starting value | found by an audit run (0.23); resolves a contradiction with plan.py's own P2 check, which already excludes these kinds |
| Placeholder-text deck-level total | Starting value | found by an audit run (0.23); the per-slide count already existed (0.21); follows the waiver since 0.24 |
| Intentional placeholders `[[type: label]]` and the brief field `Placeholders:` | Starting value | found by a review run (0.24): "missing data becomes a placeholder" and "a placeholder is always a fail" contradicted each other |
| Text boxes that overlap while their estimated text does not are an observation, not a fail | Starting value | found by a review run (0.24); estimate is 0.5 em (0.55 bold) per character, as for the line estimate |
| Basis per title (`sourced \| calculated \| hypothesis \| placeholder`), comparisons name their definition | Practitioner | found by a review run (0.24); a claim title was contradicted by the figures once they were looked up |
| Pattern fits its profile (plan check P4) | Rule check | the Profiles line of each pattern in `references/patterns.md`; found by test run A (0.25), a P07 table in a `pitch` deck |
| Composition family "rows" (P07, P09, P10), at most two in `talk` and `pitch` | Starting value, observation | found by test run A (0.25): three row slides back to back passed the render review because their pattern ids differed |
| Detector rules `thank-you-slide`, `bold-colon-list`, `photo-count`, `heading-spacing`, `grey-on-colour` | Starting value, observation | judgement items of `refuse.md` and `rules-core.md` made measurable (pass 2, 0.25); thresholds are own guesses (3 bold-colon paragraphs, photo at 5 % of the slide, 96 pt reach, grey = saturation under 0.15); quiet on the five fixtures and on the decks of test runs A and A2, not calibrated on real decks |
| Profile values | Starting value | `references/profiles.md` |
