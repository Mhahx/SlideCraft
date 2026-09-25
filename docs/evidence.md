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
