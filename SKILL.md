---
name: slide-craft
description: 'Design and quality rules for presentation slides and decks (Folien, Präsentationen, Slides, Deck, Pitch, Keynote). Load when a presentation is created, restructured, or reviewed and polished for design, even if the user only says "make me 10 slides about X" (mach mir Folien zu X). Do not load for reading, extracting text from, or converting an existing file. This skill does not create files: always load the file-building tool as well (pptx skill, slides artifact type, PowerPoint add-in). Sets context profile, design direction, deck plan, story structure, typography, grid, colour, charts and a ban list against generic AI-looking slides.'
metadata:
  version: 0.17-draft
  status: draft
---

This skill decides HOW slides look and argue. The file-building tool (pptx skill, PowerPoint add-in, design tool) decides how the file is produced.

Paths under `research/`, `examples/`, `tests/` and the name BRIEF in the reference files are provenance notes from the project repository (github.com/Mhahx/SlideCraft). They are not part of the installed skill: do not look for them.

## Precedence (read first)

- For design, layout, colour, typography and content, **slide-craft wins**. If another skill loaded at the same time contains design advice (for example the "Design Ideas" section of the pptx skill: icon rows, 2x2 card grids, big stat callouts, "every slide needs a visual element", 36-44 pt titles), ignore that advice.
- From the file-building tool take only technique: API usage, gotchas, validation, rendering, file correctness.
- A brand, template or explicit instruction from the user beats the defaults of this skill and anything derived by the direction flow. Record every such item in the plan as a **waiver**: the pinned item and the rule it overrides (for example a brand font of Aptos, three brand colours, a header bar). Checks report waived items as "waived by brief", not as failures. The contrast and accessibility floors are waived only on the user's explicit instruction, quoted in the plan.
- There is no default look. For a new deck or a redesign the look is chosen with the user from rendered drafts (`references/direction.md`). Never fall back to an unexamined default.

## Workflow (always in this order)

1. **Brief.** One question round on purpose, situation, look and boundaries, following `references/direction.md` ("Round 1"). Missing data becomes a placeholder, never an invention. If nobody can answer, mark assumptions and go on.
2. **Profile.** Pick exactly one from `references/profiles.md`: `read`, `talk`, `pitch`, `update`. Key question: is the slide read without a speaker, or does it accompany a speaker?
3. **Story skeleton.** Story before design: write the governing message and the slide titles as full-sentence claims, and give every slide one pattern from `references/patterns.md`. Read the titles in sequence: they must carry the argument alone. This is sections 3 and 5 of the deck plan in draft, without any look.
4. **Direction** (new deck or redesign only). Follow `references/direction.md`: scene sentence, mechanism, the audience's visual world, then two to three directions, each shown as **rendered draft slides** built from the skeleton: the title slide and the deck's key content slide with its real title and numbers. Send the drafts and the skeleton in one message, so the user checks story and look in one round; this is the second and last round before building. Skip the drafts only when the user explicitly hands the decision over ("mach du"). Then write the six-block direction contract. Anything the user pinned (fonts, colours, tone words, references) stays as given. Refinement of an existing deck inherits its look and skips this step.
5. **Deck plan.** Complete the deck plan from `references/deck-plan.md` (brief, direction with its pattern variants, story, one deck-wide design system, slide-by-slide table with one pattern per slide) and run its consistency checks. Show it to the user. Build without waiting, unless the user asked to review it, the user has not picked a draft yet, or the plan holds an assumption only the user can decide. No slide is built before the plan exists.
6. **Build** with the available slide tool, executing the plan with full commitment to the chosen direction. Build every slide from its pattern in `references/patterns.md` (zones and text budgets); the direction gives the look. Apply `references/rules-core.md` and the profile. Read `references/refuse.md` and the calibration section of `direction.md` before building. If a slide needs something the plan does not provide, extend the plan deck-wide first. Tool-specific notes are in the last section of this file.
7. **Check and review** as described in `references/direction.md` (Finish): run the check script (section below) with the plan, validate the renders, work through the check list in `references/rules-core.md`, compare the deck against the plan, fix everything in one batch, at most one confirmation round. Where subagents exist, a fresh reviewer without build history returns one disposition: `ship`, `fix`, `rebuild` or `recapture`. Report at the scope of the verdict.
8. **Plan as built.** Update the plan with the real values and deviations.

## Check script

Run it on the drafts (step 4), on the finished deck (step 7) and in the modes `audit`, `critique` and `polish`. `<skill dir>` is the directory that contains this SKILL.md (in Claude Code: `${CLAUDE_SKILL_DIR}`; in claude.ai chat and the Office add-ins the skill folder is copied into the code-execution sandbox, so use the path relative to this file, `scripts/check_deck.py`, from the skill folder).

```
python3 "<skill dir>/scripts/check_deck.py" deck.pptx --plan deck-plan.md --render-dir render/ --out check.json
python3 "<skill dir>/scripts/check_deck.py" drafts/<direction>.pptx --profile read|talk|pitch|update --render-dir drafts/render/
```

- Needs Python 3 (standard library only). `--render-dir` also needs LibreOffice with Impress (`soffice`) and poppler (`pdftotext`, `pdffonts`, `pdftoppm`); it writes one PNG per slide, which is also how drafts are shown to the user. For a trustworthy render the deck fonts need metric-compatible substitutes: Carlito for Calibri, Caladea for Cambria, Liberation for Arial, Times New Roman and Courier New (Debian/Ubuntu: `fonts-crosextra-carlito fonts-crosextra-caladea fonts-liberation`). The script reports which fonts were drawn; with a wider substitute, line breaks and overflow in the render are wrong and titles look longer than they are.
- Exit code 1 means at least one fail. Every finding carries its check number, method and evidence; detector findings carry a rule id in brackets (`refuse.md`).
- Slides on layouts named `P01 …` or `P02 …` are exempt from the claim-title checks automatically; name other exempt slides with `--exempt 3,9`.
- A LibreOffice deck (.odp): convert first (`soffice --headless --convert-to pptx deck.odp`), check the .pptx. The conversion keeps layout names but drops the alt text of charts (tested with LibreOffice 24.2): report those alt-text findings as caused by the conversion and check the alt text in the .odp itself.
- **Fallback:** without LibreOffice, run without `--render-dir` and say that overflow is estimated and the drafts are not rendered. Without code execution (possible in the PowerPoint add-in, not verified), say so in one line, go through the check list of `rules-core.md` by reading the slides, and report every item as a judgement, never as pass or fail.

## Modes for existing decks

`audit`, `critique`, `polish`, `distill`, `typeset`, `layout`, `clarify`, `bolder`, `quieter` — see `references/commands.md`. If a deck exists and no mode is named, run `critique` first and propose next steps. Never redesign an existing deck unasked. Every mode works against a deck plan: for an existing deck without one, derive the plan from the file first (`references/deck-plan.md`).

## Hard limits

- **Facts and values** (numbers, names, claims, sources) are never invented and never changed. Wording, shortening and number formatting may change only inside a mode that allows it, and every such change is listed for the user.
- Every data slide has a source and date. A data slide is any slide showing a chart, a table, or numbers that come from outside the deck.
- **Refinement preserves, redesign replaces.** Each mode in `commands.md` is labelled. Never mix the two in one pass. Rebuilding masters or changing font families is redesign and needs confirmation.
- **Never report a measured value that was not read from the file or computed by code.** Mark every check by how it was obtained (see the check table in `rules-core.md`). Only checks measured from the file, computed or run by script are reported as pass or fail. Render estimates and judgements are reported as observations. If a value cannot be measured in the current environment, say "not measured" instead of estimating silently.
- **Fallback for the fresh review:** where no subagent exists, the review is a self-check by the same model, not an independent review. Say so in one line and report it as such.
- The direction contract lives in the plan only, never in slide text, notes or file metadata.

## Output language

Slides follow the language of the user's request or brief. Do not translate content unasked.

## Tool notes: pptx / pptxgenjs

Only relevant when building .pptx with the pptx skill.

- Set `pres.layout = 'LAYOUT_WIDE'` (13.33 x 7.5 in) before adding slides. The library default is 10 x 5.625 in and coordinates outside the canvas are silently written off-slide.
- All absolute measures in this skill assume 13.33 x 7.5 in.
- Fonts: use a safe font so the QA rendering is trustworthy. Safe list: Arial, Calibri, Cambria, Times New Roman, Courier New, Bookman Old Style, Century Schoolbook. Avoid Aptos as default.
- Set `align: 'left'` in every placeholder definition: pptxgenjs otherwise centres the title. Use real slide layouts/placeholders where the tool allows it, not loose text boxes. Define one slide master per pattern and name it after the pattern (`P04 chart-rail`): placeholder position and size cannot be overridden per slide, and the plan comparison matches layouts by name.
- Give every picture and chart alt text. Set text boxes as text boxes (`isTextBox: true`).
- Charts stay native (`addChart`), never a rendered image, unless the building tool cannot write the native form (pptxgenjs has no waterfall: build P08 from shapes and say so in the plan).
- Highlight one bar with one series and one colour per point (`chartColors: [grey, grey, …, accent]`), not with two stacked series: `dataLabelPosition` has no effect on stacked charts.
- Units: text box `margin` is in points, ordered [left, right, bottom, top]; table cell `margin` is in inches, ordered [top, right, bottom, left]. `lineDash` takes one value for all series. Data labels default to 12 pt even when hidden.
- Follow the validation and rendering steps of the pptx skill for file correctness. The pptx skill's validator does not catch every invalid value (for example a two-value `lineDash`); `check_deck.py` does.
