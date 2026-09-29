---
name: slide-craft
description: 'Design and quality rules for presentation slides and decks: pitch decks, keynotes, talks, lectures, board and status updates, decision papers (Folien, Präsentation, Vortrag, Deck, Entscheidungsvorlage). Load it first, before asking the user any question about the deck, because it defines that question round (purpose, situation, look). Load when a presentation is created, restructured, reviewed or polished for design, including an existing .pptx whose design should be checked or improved, and even if the user only says make me 10 slides about X (mach mir Folien zu X) or gives no content yet. Do not load for only reading, extracting text from, summarising, counting or converting an existing file. This skill does not create files: also load the file-building tool (pptx skill, slides artifact type, PowerPoint add-in). Sets context profile, design direction, deck plan, story structure, typography, grid, colour, charts and a ban list against generic AI-looking slides.'
metadata:
  version: 0.25-draft
  status: draft
---

This skill decides HOW slides look and argue. The file-building tool (pptx skill, PowerPoint add-in, design tool) decides how the file is produced.

Deck codes such as MCK-DC p4 in the reference files name the public decks a rule was observed in. They are not files of this skill: do not look for them.

## Precedence (read first)

- For design, layout, colour, typography and content, **slide-craft wins**. If another skill loaded at the same time contains design advice (for example the "Design Ideas" section of the pptx skill: icon rows, 2x2 card grids, big stat callouts, "every slide needs a visual element", 36-44 pt titles, cards set apart with a drop shadow, "don't repeat the same layout", its named palettes), ignore that advice. Here a recurring pattern keeps its layout.
- From the file-building tool take only technique: API usage, gotchas, validation, rendering, file correctness.
- A brand, template or explicit instruction from the user beats the defaults of this skill and anything derived by the direction flow. Record every such item in the plan as a **waiver**: the pinned item and the rule it overrides (for example a brand font of Aptos, three brand colours, a header bar). Checks report waived items as "waived by brief", not as failures. The contrast and accessibility floors are waived only on the user's explicit instruction, quoted in the plan.
- **Explicit workflow wishes of the user** (approval before building, a summary first, one question at a time) go before the default pauses of the workflow below. The steps stay in their order; only the pauses change.
- There is no default look. For a new deck or a redesign the look is chosen with the user from rendered drafts (`references/direction.md`). Never fall back to an unexamined default.

## Workflow (always in this order)

1. **Brief.** One question round on purpose, situation, look and boundaries, following `references/direction.md` ("Round 1"). Ask only the Round 1 items that neither the brief nor earlier answers settle (most often the look); never the same question twice. Missing data is never invented: if figures are missing and cannot be shared (confidential, not yet available), ask in the same round whether placeholders are allowed (form: see Hard limits); if not, ask for the figure. If nobody can answer, mark assumptions and go on.
2. **Profile.** Pick exactly one from `references/profiles.md`: `read`, `talk`, `pitch`, `update`. Key question: is the slide read without a speaker, or does it accompany a speaker?
3. **Story skeleton.** Story before design: write the governing message and the slide titles as full-sentence claims, and give every slide one pattern from `references/patterns.md`. Read the titles in sequence: they must carry the argument alone. This is sections 3 and 5 of the deck plan in draft, without any look. Mark each title's basis: `sourced` (the user's or a named source's figure), `calculated`, `hypothesis` (no data behind it yet) or `placeholder`. A `hypothesis` title carries a status mark on its slide. If the governing message rests on figures the user did not supply, check what the tools at hand can tell you about it, and if the evidence contradicts the message, say so **before the direction round** and propose a reframing (a title that cannot be backed is the user's decision, not yours). Where no lookup is possible, say so in one line and mark the title `hypothesis`.
4. **Direction** (new deck or redesign only). Follow `references/direction.md`: two to three directions, each shown as **rendered draft slides** built from the skeleton and sent together with the skeleton; this is the second and last round before building. Skip the drafts only when the user explicitly hands the decision over ("mach du"). That hand-over covers the look, not the content: open content questions (purpose, audience, missing figures, whether placeholders are allowed) still stop the build at step 5. Then write the direction contract. Refinement of an existing deck inherits its look and skips this step.
5. **Deck plan.** Complete the deck plan from `references/deck-plan.md` (brief, direction with its pattern variants, story, one deck-wide design system, slide-by-slide table with one pattern per slide) and run its consistency checks. Show it to the user. Build without waiting, unless the user asked to review it, the user has not picked a draft yet, or the plan holds an assumption only the user can decide. No slide is built before the plan exists.
6. **Build** with the available slide tool, executing the plan with full commitment to the chosen direction. Build every slide from its pattern in `references/patterns.md` (zones and text budgets); the direction gives the look. Apply `references/rules-core.md` and the profile. Read `references/refuse.md` and the calibration section of `direction.md` before building. If a slide needs something the plan does not provide, extend the plan deck-wide first. Tool notes: last section of this file.
7. **Check and review** as described in `references/direction.md` (Finish): run the check script (section below) with the plan, validate the renders, work through the check list in `references/rules-core.md`, compare the deck against the plan, fix everything in one batch, at most one confirmation round. If an agent or subagent tool is available, the fresh reviewer without build history is mandatory, not optional; a self-check replaces it only where no such tool exists. The reviewer returns one disposition: `ship`, `fix`, `rebuild` or `recapture`. Report at the scope of the verdict.
8. **Plan as built.** Update the plan with the real values and deviations.

## Check script

Run it on the drafts (step 4), on the finished deck (step 7) and in the modes `audit`, `critique` and `polish`. `<skill dir>` is the directory that contains this SKILL.md (in Claude Code: `${CLAUDE_SKILL_DIR}`; in claude.ai chat and the Office add-ins the skill folder is copied into the code-execution sandbox, so use the path relative to this file, `scripts/check_deck.py`, from the skill folder).

```
python3 "<skill dir>/scripts/check_deck.py" deck.pptx --plan deck-plan.md --render-dir render/ --out check.json
python3 "<skill dir>/scripts/check_deck.py" drafts/<direction>.pptx --profile read|talk|pitch|update --render-dir drafts/render/
```

- Needs Python 3 (standard library only). `--render-dir` also needs LibreOffice with Impress (`soffice`) and poppler (`pdftotext`, `pdffonts`, `pdftoppm`); it writes one PNG per slide, which is also how drafts are shown to the user. A render is only as trustworthy as its font match: the script reports which fonts were drawn. Font substitutes to install, and .odp input: `references/tools.md`.
- The plan can be checked before anything is built: `python3 "<skill dir>/scripts/plan.py" deck-plan.md` (its own consistency checks, no deck needed). `--placeholders allowed|not-allowed` sets the placeholder mode on the command line when there is no plan.
- Exit code 1 means at least one fail. Every finding carries its check number, method and evidence; detector findings carry a rule id in brackets (`refuse.md`).
- Slides on layouts named `P01 …` or `P02 …` are exempt from the claim-title checks automatically; name other exempt slides with `--exempt 3,9`.
- **Fallback:** without LibreOffice, run without `--render-dir` and say that overflow is estimated and the drafts are not rendered. Without code execution (possible in the PowerPoint add-in, not verified), say so in one line, go through the check list of `rules-core.md` by reading the slides, and report every item as a judgement, never as pass or fail.

## Modes for existing decks

`audit`, `critique`, `polish`, `distill`, `typeset`, `layout`, `clarify`, `bolder`, `quieter` — see `references/commands.md`. If a deck exists and no mode is named, run `critique` first and propose next steps. Never redesign an existing deck unasked. Every mode works against a deck plan; for an existing deck without one, derive it from the file first (`commands.md`). Called without any task ("what can you do?"): answer as in `commands.md`, "Without a task".

## Hard limits

- **Comparisons** name their definition on the slide (basis, period, source). Figures with different bases (revenue vs gross profit, EBIT on revenue vs on net revenue) are never compared in one bar or one sentence.
- **Placeholders** only when the brief allows them (`Placeholders: allowed`), only as `[[type: label]]` (for example `[[Zahl: Umsatz 2025, EUR Mio.]]`), and their slide carries a status mark (Illustrative or Draft). Any other placeholder-like text (`[XX]`, `TBD`, `<<..>>`, `___`, `[insert ..]`, "to be added") is a defect, and so is an intentional one when the brief does not allow them.
- **Facts and values** (numbers, names, claims, sources) are never invented and never changed. Wording, shortening and number formatting may change only inside a mode that allows it, and every such change is listed for the user.
- Every data slide has a source and date. A data slide is any slide showing a chart, a table, or numbers that come from outside the deck.
- **Refinement preserves, redesign replaces.** Each mode in `commands.md` is labelled. Never mix the two in one pass. Rebuilding masters or changing font families is redesign and needs confirmation.
- **Never report a measured value that was not read from the file or computed by code.** Mark every check by how it was obtained (see the check table in `rules-core.md`). Only checks measured from the file, computed or run by script are reported as pass or fail. Render estimates and judgements are reported as observations. If a value cannot be measured in the current environment, say "not measured" instead of estimating silently.

## Output language

Slides follow the language of the user's request or brief. Do not translate content unasked.

## Tool notes

- All absolute measures in this skill assume a 13.33 x 7.5 in slide. With pptxgenjs, set `pres.layout = 'LAYOUT_WIDE'` before adding slides.
- Building .pptx with the pptx skill: read the pptxgenjs section of `references/tools.md` before the build (one master per pattern, chart highlighting, units, values the pptx validator misses).
