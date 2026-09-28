# Changelog

All versions are drafts (`metadata.status: draft`). Skill version in `SKILL.md` / plugin version in `plugin.json`.

## 0.22 (0.22.0)

Findings from reading a real deck plan, checked against the code and fixed. 107 tests (7 new), all green.

| Finding | Change |
|---|---|
| The plan's "No." column was read by searching the cell for any digit, so "A1"/"A2" (an appendix numbering scheme) were read as slide 1 and 2, comparing an appendix row's title against the deck's real slide 1 and 2 and reporting a false title mismatch | A slide row is now matched to a deck slide by its position in the table, never by digits inside its "No." label; a label that is not a plain ordinal is reported once as an observation, naming the row, not silently misread |
| Two or three candidate directions each restating "Pattern variants:"/"Colour strategy:" (as direction.md's round 2 asks for) failed check P0 as an ambiguous repeated label; only section 4's design labels had that exemption | Direction labels are now read from section 2 the same way design labels are read from section 4: the last-write-wins rule extends there too |
| A "Palette:" line covering several candidate directions' accents in one line counted every hex under the sticky role word, correctly by the parser's own rule, but with no way to see why the count was wrong | P3's evidence now names every hex under "accent" and "signal" by value, not just the count; `deck-plan.md` gains a "Directions considered" table for section 2 so a direction's palette during comparison no longer needs to share the singular `Palette:` field with the others |
| A slide's own "text between footnote and body minimum" observation still said "role is only known from the deck plan" even when a plan was given and had already resolved it — the size correctly failed check 12 elsewhere, but the per-slide wording made it look like nothing had been checked | The per-slide note now points at check 12 by name when a plan exists, instead of repeating a disclaimer that plan makes false |
| Segoe UI (a pinned Microsoft brand font) had no metric-compatible substitute, so its render observations were always marked unreliable | Selawik (Microsoft's own substitute) added to the render font map, plus the fontconfig alias it needs, documented in `SKILL.md`. Verified by the user with an installed Selawik and alias; this environment has no network access to the font, so it is not independently re-tested here |
| A first try in the PowerPoint add-in skipped the direction round the prompt asked for and replaced the deck instead of appending drafts | Not fixed: cause unclear from outside the add-in (its own behaviour, or how it loads the skill). Logged in [development.md](docs/development.md) Open points as the next thing to reproduce and diagnose |

## 0.21 (0.21.0)

Findings from an audit run on a real deck, checked against the code and fixed. 101 tests (13 new), all green.

| Finding | Change |
|---|---|
| No placeholder detector: PLATZHALTER, TODO, Lorem ipsum passed silently | New detector rule `placeholder-text` (fail): PLATZHALTER, TODO, TBD, Lorem ipsum, a bare "XX", `[...]` |
| A kicker overlapping the title box was never flagged (check 3 promised it as a render estimate, but nothing implemented it) | Check 3 now compares every text-bearing shape's geometry directly from the file: two overlapping text shapes is a fail |
| "holistisch" (a common German loanword) was missing from the buzzword list, though "ganzheitlich" was in it | Added `holistisch` and `disruptiv` |
| Only a line starting with "Source:"/"Quelle:" counted as a source; "laut AESC, Stand 2024" did not | `laut`, `gemäß`, `nach Angaben von` recognised as source-line prefixes too |
| Check 7 produced the same boilerplate observation on every text-only slide, most of them without any number | Check 7 is silent on narrative slides with no number in the text; still an observation when a number appears without a chart or table |
| No detection of the same figure repeating across slides (a possible sign of a contradiction) | New deck-level check: the same number recurring on several slides is reported as an observation (a recurring milestone year is excluded, since that's normal) |
| No lesson for the JSON's own volume: a real deck produced 187 observations with no readable summary | The command line now always prints a compact rollup to stderr — fails grouped by slide, observations counted by check — the full JSON is unchanged |
| No check for whether a title is a claim, only for its word count | New observation-only heuristic (check 1): a fixed German/English verb list; deliberately never a fail, since the list is incomplete and would otherwise flag valid claims |
| A slide's own render observations (missing text, title line count) did not say when they ran on a font LibreOffice had to replace, only the deck-level "fonts drawn" entry did | Slides using an unreliable font substitute now carry that note on their own render observations |
| `audit`/`critique` required a fully written `deck-plan.md` even for a read-only judgement | Read-only modes may keep a condensed plan derivation in the report; the written file is required once a building or refining mode needs it |

**Checked and not changed:** Selawik as a metric-compatible substitute for Segoe UI could not be tested in this environment (no network access to the font, no package for it); Segoe UI stays off the safe font list until it is verified. Title-content contradiction and cross-checking whether an exhibit backs its title stay a judgement (render review, check list item 13), extended with two explicit questions; they are not mechanically decidable.

## 0.20 (0.20.0)

Documentation and clean-up for sharing. No rule change.

- Documentation in English: README with preview images and install guide per surface, [how it works](docs/how-it-works.md), [evidence](docs/evidence.md), [development](docs/development.md), this changelog, NOTICE for the parts adapted from Impeccable, issue template for feedback.
- Removed from the repository: example decks, audit reports, project brief and raw research notes. The research is kept in condensed form in `docs/evidence.md`; the removed files remain in the git history up to tag `v0.19.0`.
- Provenance notes in the skill now point to `docs/evidence.md`; internal decision notes were rephrased.
- Claude Code sessions on this repository load the skill as `/slide-craft` (`.claude/skills/slide-craft`, a symlink to the plugin's skill).

## 0.19 (0.19.0)

Installable from GitHub; release workflow. No rule change.

- The repository is a plugin marketplace (`.claude-plugin/marketplace.json`, plugin in `plugin/`). Install in Claude Code with `claude plugin marketplace add Mhahx/SlideCraft`; tested.
- GitHub workflows: tests, packaging and the official skill validator on every push to `main` and every PR; a release with `slide-craft.zip` on every version tag or by hand.
- `tools/package.py` checks that `SKILL.md`, `plugin.json` and the tag name the same version.

## 0.18

Findings from a blind run (a fresh agent on another model built a `talk` deck with only the installed skill; 0 fails).

- Plan parser: design labels are read from section 4 only; a repeated label is reported instead of being silently ignored.
- Word budgets per pattern zone for `talk` and `pitch`; the profile limit wins over the zone budget.
- New check: gridlines fail on charts whose values are labelled.
- The source-line rule ("Source:" / "Quelle:") is documented.
- New render review (check 13): pictures built from shapes, units only in the source line, the same composition on more than two slides, overlaps.

## 0.17

Packaging.

- `tools/package.py` builds `dist/slide-craft.zip` with only `SKILL.md`, `references/` and `scripts/`.
- The frontmatter description is quoted (unquoted, it was invalid YAML and failed the official validator).
- Script path for the Claude apps and the Office add-ins.
- Sharper description after a trigger test: from 15 of 20 to 20 of 20 correct decisions.

## 0.16

Second full run with a user: an investor pitch in a pinned "Liquid Glass" style (14 slides, 0 fails).

- Every banned effect has an id (`gradient`, `shadow`, `glow`, `soft-edge`, `reflection`, `3d`, `emoji`); the plan's waiver line releases exactly the named ids.
- Text-less colour fields across the full width or height count as ground (`bleed`), not as a margin violation.
- New rule and detector check `glass-stack`: at most one translucent panel per slide; contrast on glass computed over black and white.

## 0.15

First full run with a user: a board decision paper (`read`, 9 slides, three rendered directions, 0 fails in 136 checks).

- Fixed: plan template tables, the margin label, footer elements in the margin check, font substitutes needed for a trustworthy render.
- New rule on where photos may come from (own, named, or freely licensed with credit on the slide).

## 0.14

Calibration of the `read` profile on nine real consulting decks: 250 words per slide, titles 20–28 pt, footnotes 8 pt, footer below the margin, colour roles with one accent and a signal pair. See [evidence](docs/evidence.md).

## 0.13

- Story before look: the story skeleton comes before the rendered drafts.
- Eight axes a direction decides (interpretation, exhibit side, image world, density, ground, title voice, emphasis, structure devices).
- Fill share is an observation, not a fail.
- The check script is documented with paths, dependencies, exit code, .odp route and fallbacks; layouts named `P01 …`, `P02 …` are exempt from the title rules.
- Graphics that show the subject (a range ring, a route map) are welcome; decorative ones are not.

## 0.12

Pattern library: 14 slide patterns from nine public consulting decks, each with zones, grid position and word budget. Detector corrected against real decks (header bands, row labels, unboxed number rows).

## 0.11

- No default look any more: the user picks from two or three rendered drafts.
- Detector for AI patterns (`scripts/detect.py`): nested cards, card grid, icon tiles, stat row, stripes, kicker, buzzwords, text alignment and more. A deliberately built AI deck now fails on every slide.

## 0.10

Example decks rebuilt image-led; table cell fills are read for contrast; plan contrast per declared background.

## 0.9

First example decks (one per profile). Script fixes: table frame height, table cell margins, chart dash values, dates in sources, status colours.

## 0.8

Render check with LibreOffice: overflow, rendered title lines, missing text, fonts actually drawn, one PNG per slide.

## 0.7

Plan check: the plan against itself and the deck against the plan (fonts, role sizes, weights, palette, margins, layouts, titles). `--derive-plan` for decks without a plan.

## 0.6

First version of the check script: sizes, fonts and colours with inheritance, geometry, titles, words, fill, margins, WCAG contrast, chart colours, sources, alt text, reading order, banned effects.

## 0.5

Clean-up of the rules: pass or fail only for measured values; title word ceilings per profile; waivers for brands and templates; non-text contrast; accessibility check; provenance per rule.

## 0.4

Direction flow adapted from Impeccable: questions, scene, the audience's visual world, directions, direction contract, fresh review, plan as built.

## 0.3

Deck plan before building; the deck is checked against it.

## 0.2

Precedence over the pptx skill's design advice; checks labelled by method; fixed slide size; skill files in English; profile names `read`, `talk`, `pitch`, `update`.

## 0.1

First draft.
