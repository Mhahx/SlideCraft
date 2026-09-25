# How SlideCraft works

This page explains the skill for users and maintainers. The binding text is the skill itself: [`SKILL.md`](../plugin/skills/slide-craft/SKILL.md) and the files in [`references/`](../plugin/skills/slide-craft/references/).

## Principles

1. **No default look.** The look comes from the audience's world and the deck's purpose, and the user chooses it from rendered drafts.
2. **Story before design.** Titles are full-sentence claims; read in order, they carry the argument alone.
3. **One plan, then the build.** A deck plan fixes one design system for the whole deck before the first slide exists.
4. **Measured or said to be a judgement.** Only what is read from the file, computed or measured by the script is reported as pass or fail. Render estimates and design judgements are observations. A value that cannot be measured is reported as "not measured", never guessed.
5. **The user's pins win.** A brand, template, font or style the user asks for beats the skill's defaults and is recorded in the plan as a waiver. Contrast and accessibility floors are waived only on explicit instruction.
6. **Facts are never changed.** Numbers, names, claims and sources are never invented or altered. Missing data becomes a visible placeholder.

## Workflow

| Step | What happens | Reference |
|---|---|---|
| 1 Brief | One round of three or four questions: purpose and outcome, situation, look (brand, desired effect, references, what it must not resemble), boundaries. No questions about hex values or font names. | `direction.md` |
| 2 Profile | Exactly one of `read`, `talk`, `pitch`, `update`. Key question: is the slide read alone, or does it accompany a speaker? | `profiles.md` |
| 3 Story skeleton | Governing message, every slide title as a claim, one pattern per slide. | `patterns.md` |
| 4 Direction | Two or three directions from the audience's visual world, each rendered as a title slide and the key content slide with real titles and numbers. Sent together with the skeleton: the second and last round before building. | `direction.md` |
| 5 Deck plan | Brief, direction contract, story, design system (fonts, text roles, palette with contrast, grid, pattern variants), slide table, waivers. Consistency checks on the plan itself. | `deck-plan.md` |
| 6 Build | Every slide from its pattern's zones and word budget, in the chosen look, with the file-building tool. | `patterns.md`, `rules-core.md`, `refuse.md` |
| 7 Check and review | Check script with plan and render, render review of every slide, one batch of fixes, at most one confirmation round. A fresh reviewer (a subagent without build history, where available) returns `ship`, `fix`, `rebuild` or `recapture`. | `direction.md` (Finish), `rules-core.md` |
| 8 Plan as built | The plan is updated with the real values and deviations; later edits start from it. | `deck-plan.md` |

Existing decks skip steps 1 to 4 unless a redesign is asked for: the skill derives a plan from the file first and then runs one of the modes below.

## Profiles

| Value | `read` | `talk` | `pitch` | `update` |
|---|---|---|---|---|
| Typical use | decision paper, report, leave-behind | keynote, conference, live board talk | investor or sales pitch | status report |
| Title size | 20–28 pt | at least 40 pt | 28–36 pt | 20–28 pt |
| Title length (words) | 15 | 8 | 10 | 15 |
| Body minimum | 14 pt | 24 pt | 18 pt | 14 pt |
| Footnote and source minimum | 8 pt | 12 pt | 8 pt | 8 pt |
| Words per slide (incl. title) | 250 | 15 | 40 | 80 |
| Characters per slide (German) | 1500 | 90 | 240 | 480 |

The `read` values are calibrated on real consulting decks ([evidence](evidence.md)); the others are starting values. Fill share of the live area is reported, not enforced.

## Patterns

Fourteen slide patterns, each with its use, profiles, evidence (deck and page), a sketch, zones on a 12-column grid and a word budget per zone:

| | | | |
|---|---|---|---|
| P01 cover | P02 divider-agenda | P03 summary | P04 chart-rail |
| P05 chart-focus | P06 two-exhibits | P07 table | P08 bridge |
| P09 before-after | P10 numbered-rows | P11 timeline | P12 case |
| P13 key-numbers | P14 statement | | |

All patterns except P01, P02 and P14 share one frame: optional tracker or status mark, claim title, measure line, body, footnotes and source, page number.

The patterns fix structure, not look. A direction sets one value on each of eight axes deck-wide: interpretation as a rule or a field, exhibit side, image world, density, ground, title voice, emphasis, structure devices. Two directions differ on at least two axes, not only in colour.

## Directions

A direction is derived, not picked from a menu: a scene sentence (who sees the deck, where, in what state), the mechanism the deck must work by, and five to seven things from the audience's own visual world. The skill then checks each direction against four looks that generated decks drift to (dark navy with neon, cream with serif and terracotta, white with a blue-purple gradient and icon cards, editorial hairlines with italic serif). If the look could be guessed from the topic alone, it is reworked.

The chosen direction is written down as a six-block contract in the plan (thesis, own world, story, first slides, form, finish). It never appears on the slides.

## Pinned styles

A style the user asks for can need something the refuse list bans, for example shadows for "Liquid Glass". The plan's waiver line names the released items by id together with the user's words:

```
Waivers: `shadow` (user: "rounded, Liquid Glass")
```

The check script then reports exactly those items as "waived by brief". Structural rules keep applying: a waiver releases the material, not the card grid. Glass has its own rule (`glass-stack`: at most one translucent panel per slide, for the focus).

## Modes for existing decks

| Mode | Kind | Does |
|---|---|---|
| `audit` | read-only | measures the deck against the rules and the plan, scored per area |
| `critique` | read-only | design judgement first, measurement second: 3 to 5 problems, 2 to 3 strengths |
| `polish` | refinement | restores the plan's system (alignment, sizes, spacing, colours) |
| `distill` | refinement | cuts content; every cut is listed |
| `typeset` | refinement | type roles and hierarchy; a font family change is a redesign and needs confirmation |
| `layout` | refinement | grid and zones; rebuilding masters is a redesign |
| `clarify` | refinement | wording of titles and labels; every change is listed |
| `bolder` / `quieter` | refinement | more or less contrast and emphasis within the identity |

Without a named mode, the skill runs `critique` and proposes next steps. It never redesigns a deck unasked.

## The check script

`scripts/check_deck.py` reads a .pptx directly (it is a ZIP of XML files) and resolves inheritance from layouts, masters and themes. It needs Python 3 and nothing else; rendering needs LibreOffice and poppler.

```
check_deck.py DECK [--profile read|talk|pitch|update] [--plan deck-plan.md]
              [--render | --render-dir DIR] [--exempt 1,9] [--lang auto|en|de]
              [--derive-plan] [--out check.json] [--compact]
```

| Option | Effect |
|---|---|
| `--profile` | the limits to check against (required unless the plan names a profile) |
| `--plan` | checks the plan against itself and the deck against the plan (check 12); reads waivers |
| `--render` | renders with LibreOffice and reports overflow, title lines, missing text and the fonts actually drawn |
| `--render-dir` | also writes one PNG per slide (used for drafts and for the render review) |
| `--exempt` | slide numbers exempt from the claim-title rule (layouts named `P01 …`, `P02 …` are exempt automatically) |
| `--derive-plan` | prints the measurable parts of a plan (fonts, roles, palette, margins, titles) for a deck without one |

The output is JSON per slide and per deck. Every check carries its number from the check list in `rules-core.md`, its method (`file`, `computed`, `script`, `render estimate`, `judgement`) and a status: `pass`, `fail`, `observation`, `not_measured` or `waived`. Exit code 1 means at least one fail.

What it checks:

| # | Check | Method |
|---|---|---|
| 0 | slide size 13.33 × 7.5 in, valid chart line values | file |
| 1 | title present, claim titles, word ceiling, at most 2 lines | file; render for line count |
| 2 | at most 2 font families on the safe list, title size, size steps of at least 1.25, minimums | file |
| 3 | margins, bleed fields, table cell margins; overflow and missing text | file; render estimate |
| 4 | recurring placeholders at the same position per layout; left edges (observation) | file |
| 5 | colour roles, text contrast and non-text contrast (WCAG 2.2), glass computed over black and white | computed |
| 6 | words or characters per slide; fill share (observation) | file; script |
| 7 | source and date on data slides, no gridlines on charts whose values are labelled | file |
| 8 | title set, reading order with the title first, alt text on pictures and charts | file |
| 9 | banned effects (`gradient`, `shadow`, `glow`, `soft-edge`, `reflection`, `3d`, `emoji`) and the detector rules | file |
| 12 | deck against plan: fonts, role sizes, weights, palette, margins, layouts, titles, slide count | file |
| 10, 11, 13 | title strand as a story, direction contract (a default-look ground is reported as an observation), render review | judgement, listed as open items |

### Detector rules

`scripts/detect.py` looks at the geometry, fill, outline and text of every shape:

| Rule | Status | Finds |
|---|---|---|
| `nested-cards` | fail | a visible box with text inside another visible box |
| `card-grid` | fail | three or more equal boxes (±5 %) with heading and text in a row or column |
| `icon-tile-stack` | fail | small square tiles (20–72 pt) right above headings, repeated |
| `stat-row` / `number-card` | fail / observation | two or more big numbers (40 pt and up) in boxes in a row / one big number in a card |
| `side-stripe`, `border-on-rounded` | fail | a thin colour bar flush with a box edge / a 2 pt outline on a rounded box |
| `glass-stack` | fail | more than one translucent panel on a slide |
| `kicker` | fail in `talk`/`pitch`, observation otherwise | a short capitalised or tracked label directly above the title |
| `numbered-labels` | observation | labels 01, 02, 03 |
| `buzzword` | fail | filler words from a German and English list |
| `question-title` | fail | a title ending in a question mark |
| `justified-text`, `centered-running-text`, `all-caps-body` | fail | running text justified, centered or in capitals |
| `wide-tracking` | observation | letter spacing above 0.05 em on running text |
| `shape-illustration` | observation | twelve or more small text-less shapes clustered: a picture built from primitives |
| `default-look` | observation | a violet-blue, cream or dark navy ground on at least half the slides |

Panels with header bands, row labels in grey fields, status marks ("Preliminary", "Draft") and single functional boxes are deliberately not flagged; these were corrected against real consulting decks.

### Known limits of the script

- It reads shapes, not pixels: text and pictures inside embedded images are invisible to it.
- Rendering is only as good as the font match. LibreOffice replaces Arial, Calibri and Cambria with metric-compatible fonts; Bookman Old Style and Century Schoolbook have no such substitute. The script reports which fonts were drawn.
- Optical alignment and the 8 pt spacing grid are not measured. Word budgets per pattern zone are not checked yet.
- Thresholds are starting values tested on our own decks and on nine real consulting decks, not on a large corpus.
