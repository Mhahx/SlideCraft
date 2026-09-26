# Changelog

All versions are drafts (`metadata.status: draft`). Skill version in `SKILL.md` / plugin version in `plugin.json`.

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
