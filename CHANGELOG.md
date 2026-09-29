# Changelog

All versions are drafts (`metadata.status: draft`). Skill version in `SKILL.md` / plugin version in `plugin.json`.

## Unreleased

Slimming review: what must always be in context (`SKILL.md`), what is loaded on demand (references), what is duplicated or does nothing. No rule was dropped that prevents a specific AI pattern or error; only duplicates, project history and a ritual block. No script logic changed.

| Change | Why |
|---|---|
| `SKILL.md` tool notes and check-script setup (font substitutes, Segoe UI, .odp) moved to the new `references/tools.md`; `SKILL.md` keeps the 13.33 x 7.5 in canvas and a pointer | They were always in context but only needed when building with pptxgenjs or setting up the render. Safe fonts, native charts, `isTextBox` and validation were duplicates of `rules-core.md` §2 or the pptx skill's own gotchas and are gone from the notes |
| Duplicates removed from `SKILL.md`: placeholder details in step 1 (kept in Hard limits), step 4 details (in `direction.md`), the fresh-review fallback and "contract lives in the plan" (both in `direction.md`); "Invocation without a task" moved to `commands.md` | Always-loaded text said the same thing twice |
| Precedence names three more pptx-skill design ideas to ignore: cards set apart with a drop shadow, "don't repeat the same layout", its named palettes | They contradict `refuse.md` and `patterns.md`; two of the palettes are default looks 1 and 2 of `direction.md` |
| Round 1 offers "mach du" for short requests | Quick mode existed but the user never learned about it |
| Direction contract: three blocks (THESIS, OWN-WORLD, FIRST SLIDES) instead of six | STORY duplicated plan section 3, FORM the "Drafts shown" field, FINISH was the same sentence in every deck |
| `refuse.md`: every detectable item names what to build instead; "purple-blue gradients" removed from the judgement list | A ban without a replacement leaves the model to improvise; gradients are already detected, and the look is default look 3 |
| Provenance table moved from `rules-core.md` to `docs/evidence.md`; version notes, Impeccable mentions and pointers to `docs/` removed from the references | Project history, not needed at build time; the installed skill could not resolve the repository paths |
| `rules-core.md` check 4 said optical alignment is measured by script; the method table and the script say it is not | Marked "not measured" together with the 8 pt spacing scale |
| `rules-core.md` check 7 listed fewer source-line forms than §6; §4 stated "same meaning, same colour" twice | Check 7 points to §6; the duplicate sentence is gone |

**Test run A** (Sonnet 5.5, fresh cloud session on the slimmed skill, prompt "Mach mir 6 Folien, warum unser Team von Excel auf ein BI-Tool wechseln sollte", answer "mach du"). Round 1, the hand-over offer, the three-block contract, `LAYOUT_WIDE`, pattern-named masters and 0 script fails all held. Findings and changes:

| Finding | Change |
|---|---|
| Slides 2 to 4 all looked like tables (P10, P09, P07: label column, rows, hairlines); the render review passed them because the pattern ids differ | `patterns.md`: composition family "rows" (P07, P09, P10), at most two slides of it in `talk` and `pitch`; check 13(c) says different pattern ids are not different compositions. `plan.py` reports more than two as an observation |
| P07 table (a `read`/`update` pattern) in a `pitch` deck, unreported | `plan.py` check P4: every pattern must be meant for the profile (Profiles line of `patterns.md`), fail unless the pattern id is waived |
| "mach du" was taken to hand over the content too: the model set `Placeholders: not allowed` itself and built a pitch without a single figure, though its plan listed assumptions only the user can decide | `SKILL.md` step 4 and `direction.md` Quick: the hand-over covers the look only; open content questions are asked once, bundled, before the build |
| The agent tool was available, the fresh review was still a self-check | `SKILL.md` step 7: with an agent or subagent tool the fresh reviewer is mandatory |
| Self-check against the default looks used the genus "business deck", so the green table look of an Excel deck passed | `direction.md`: the category is the topic as the user named it |

**Test run A2** (same prompt, fresh Sonnet 5.5 session on the fixes above). The user's answers differed from the script (among them a request to make up figures), which made the run harder, not easier. All five fixes held: content questions stayed with the user after the hand-over, the made-up figures were refused in favour of `[[Zahl: Std./Bericht]]` with a draft mark, one slide of the rows family, a fresh reviewer subagent (disposition `fix`, five of seven findings applied), a self-check against the topic, 0 script fails. The session also carried the user's personal preferences (announce, wait for "go", guiding questions), so A's "builds only after your go" was the preference, not the skill.

| Finding | Change |
|---|---|
| P09 had a `talk` budget in `patterns.md` but no `talk` in its Profiles line; the new plan check enforced the Profiles line, so the model waived P09 to use it | P09's Profiles line and `plan.py` include `talk` |
| The waiver line quoted "mach du" as the user's words for P09 | `direction.md` Quick: the hand-over is not a waiver; a waiver quotes what the user said about that very item |

Measured with `wc -w` before the test-run fixes: `SKILL.md` 2,294 → 1,718 words (−25 %). References 13,318 → 13,152 words including the new `tools.md` (346); `rules-core.md` −633, `refuse.md` +168 for the replacement actions. 125 tests green, `tools/package.py` and `agentskills validate` pass.

## 0.24 (0.24.0)

Findings of a review run on a real 4-slide board deck (a deck built in the same session as the review), checked against the code: everything that could be reproduced was. 125 tests (11 new), all green.

| Finding | Change |
|---|---|
| `SKILL.md` said "missing data becomes a placeholder", `refuse.md` said a placeholder is "always a fail" (the second sentence was mine, 0.21) | New brief field `Placeholders: allowed \| not allowed`. Intentional placeholders have one form, `[[type: label]]`: an observation, listed in the report under `placeholders`, when allowed; a fail otherwise. Their slide needs a status mark, else the observation says so. New rule id `placeholder-intentional` |
| Only `[XX]` of seven spellings was detected; the proposed `[[...]]` form passed silently | Also detected as unintended: `<<value>>`, `___`, `[insert ..]`, `[.. einfügen]`, "to be added", "noch zu ergänzen", TBC. "noch zu klären" is deliberately not (ordinary wording on an open-points slide) |
| A waiver on `placeholder-text` turned the per-slide finding into "waived" but the deck-level total stayed `fail` (my 0.23 bug), so the exit code stayed 1 | The total follows the waiver and the mode; `--placeholders allowed\|not-allowed` sets the mode without a plan |
| Two 250 pt boxes around 130 pt and 57 pt of text were a `fail` for overlap | Boxes that overlap while their estimated text does not are an observation; overlapping words stay a fail |
| `shape-illustration` counted rules and arrows | Lines, connectors, arrows and shapes thinner than 2.5 pt no longer count |
| A plan role with weight "regular, bold" was read as bold only, so every regular run failed | A role listing both weights constrains neither |
| `plan.py` had no command line, so the plan could not be checked before the build | `python3 plan.py deck-plan.md [--profile ..] [--json]` |
| No place for the user's own workflow wishes, no answer to "what can you do?", no independence protocol for `critique`, no basis per title, no comparison rule, "pitch" in the request led to the wrong profile | Rule texts in `SKILL.md`, `profiles.md`, `commands.md`, `deck-plan.md`, `direction.md` (accent 3:1 on every surface it sits on, checked before the drafts) |

**Declined, with reasons (see [development.md](docs/development.md)):** a `patterns.js` builder (needs Node and pptxgenjs, so absent in the add-in and in Claude Design; turns a rulebook into a builder), `fill_placeholders.py` and `placeholders.csv` (scripts here use only the standard library; `chart.replace_data` is untested), `review_bundle.py` (a reviewer not reading the build script cannot be enforced without a subagent), a fifth profile `decide` (`read` is already the decision-paper profile; the word-to-question table fixes the actual problem), numeric recipes for dark grounds (no source; the 3:1 rule is WCAG). The evidence pass is a conditional step in the story skeleton, not a fixed step: whether a lookup is possible depends on the surface.

## 0.23 (0.23.0)

Findings from a full audit of a real 26-slide deck (rebuild via the PowerPoint add-in), checked against the code and fixed. 114 tests (7 new), all green.

| Finding | Change |
|---|---|
| A logo placed only on the layout or master (not a placeholder) overlapped the title in the rebuild; check 3 never saw it, since it is not in the slide's own XML at all | Check 3 now also reads non-placeholder pictures and shapes on the layout and on the master, and checks them against the slide's text shapes for overlap; a slide with `showMasterSp="0"` is correctly left out |
| "Netzwerkangaben laut AESC, Stand August 2026." is a valid source but was not recognised: the 0.21 fix for `laut`/`gemäß` required the word at position 0, not after a lead-in phrase | The keyword is now searched for within the first 40 characters, not anchored at the very start |
| With a plan given but its role table not parsing (an empty role table), the per-slide note still claimed "see check 12", which had nothing to say either in that case | The note distinguishes "no plan" from "plan given, but no roles resolved" and only points at check 12 when it actually resolved something |
| A cover title at 32 pt, declared in the plan as its own role ("cover title"), failed check 2's profile title range (20–28 for `read`) — a real contradiction, since the plan's own role check (P2) already excludes cover/divider/quote/display roles from that range | Check 2 now recognises the same role kinds as not held to the profile's title range, when a plan declares the role |
| The placeholder-text detector reported a count per slide, but no deck-wide total | Added: a deck-level fail summing every slide's count |
| The Palette line's "one role word, sticky until the next" convention had no worked example in the template, only abstract role names | `deck-plan.md` gains a concrete example under the Palette field |
| A first PowerPoint add-in try never created pattern-named layouts; every slide sat on the generic "Titel und Inhalt" layout | Not fixed, still unclear whether this is a limit of the add-in's own API. Logged in `development.md` with this as the likely explanation for several of the add-in's other symptoms (the P01/P02 exemption, the recurring-placeholder check and the plan's layout-name comparison all key off the layout's name) |

**Checked and confirmed as already correct, not a bug:** unplanned run sizes (14 pt, 12 pt) do fail check 12 "text sizes are role sizes of the plan" when the role table parses; "holistisch"/"Holistischer" and kicker-over-title overlap were already fixed in 0.21; the A1/A2 numbering bug and "Pattern variants appears 2 times" were already fixed in 0.22; Selawik already reports as a close substitute, not "unreliable".

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
