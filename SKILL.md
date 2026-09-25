---
name: slide-craft
description: Design and quality rules for presentation slides and decks (Folien, Präsentationen, Slides, Deck, Pitch, Keynote). Load when a presentation is created, restructured, or reviewed and polished for design, even if the user only says "make me 10 slides about X" (mach mir Folien zu X). Do not load for reading, extracting text from, or converting an existing file. This skill does not create files: always load the file-building tool as well (pptx skill, slides artifact type, PowerPoint add-in). Sets context profile, design direction, deck plan, story structure, typography, grid, colour, charts and a ban list against generic AI-looking slides.
metadata:
  version: 0.11-draft
  status: draft
---

This skill decides HOW slides look and argue. The file-building tool (pptx skill, PowerPoint add-in, design tool) decides how the file is produced.

## Precedence (read first)

- For design, layout, colour, typography and content, **slide-craft wins**. If another skill loaded at the same time contains design advice (for example the "Design Ideas" section of the pptx skill: icon rows, 2x2 card grids, big stat callouts, "every slide needs a visual element", 36-44 pt titles), ignore that advice.
- From the file-building tool take only technique: API usage, gotchas, validation, rendering, file correctness.
- A brand, template or explicit instruction from the user beats the defaults of this skill and anything derived by the direction flow. Record every such item in the plan as a **waiver**: the pinned item and the rule it overrides (for example a brand font of Aptos, three brand colours, a header bar). Checks report waived items as "waived by brief", not as failures. The contrast and accessibility floors are waived only on the user's explicit instruction, quoted in the plan.
- There is no default look. For a new deck or a redesign the look is chosen with the user from rendered drafts (`references/direction.md`). Never fall back to an unexamined default.

## Workflow (always in this order)

1. **Brief.** One question round on purpose, situation, look and boundaries, following `references/direction.md` ("Round 1"). Missing data becomes a placeholder, never an invention. If nobody can answer, mark assumptions and go on.
2. **Profile.** Pick exactly one from `references/profiles.md`: `read`, `talk`, `pitch`, `update`. Key question: is the slide read without a speaker, or does it accompany a speaker?
3. **Direction** (new deck or redesign only). Follow `references/direction.md`: scene sentence, mechanism, the audience's visual world, then two to three directions shown as **rendered draft slides** (title slide plus the most typical content slide, real content). The user picks; this is the second and last round before building. Skip the drafts only when the user explicitly hands the decision over ("mach du"). Then write the six-block direction contract. Anything the user pinned (fonts, colours, tone words, references) stays as given. Refinement of an existing deck inherits its look and skips this step.
4. **Story.** Write the slide titles as full-sentence claims. Read them in sequence: they must carry the argument alone.
5. **Deck plan.** Write the deck plan from `references/deck-plan.md` (brief, direction, story, one deck-wide design system, slide-by-slide table) and run its consistency checks. Show it to the user. Build without waiting, unless the user asked to review it, the user has not picked a draft yet, or the plan holds an assumption only the user can decide. No slide is built before the plan exists.
6. **Build** with the available slide tool, executing the plan with full commitment to the chosen direction. Apply `references/rules-core.md` and the profile. Read `references/refuse.md` and the calibration section of `direction.md` before building. If a slide needs something the plan does not provide, extend the plan deck-wide first. Tool-specific notes are in the last section of this file.
7. **Check and review** as described in `references/direction.md` (Finish): validate the renders, run the check list in `references/rules-core.md`, compare the deck against the plan, fix everything in one batch, at most one confirmation round. Where subagents exist, a fresh reviewer without build history returns one disposition: `ship`, `fix`, `rebuild` or `recapture`. Report at the scope of the verdict.
8. **Plan as built.** Update the plan with the real values and deviations.

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
- Use real slide layouts/placeholders where the tool allows it, not loose text boxes.
- Give every picture and chart alt text. Set text boxes as text boxes (`isTextBox: true`).
- Charts stay native (`addChart`), never a rendered image, unless PowerPoint has no native form.
- Follow the validation and rendering steps of the pptx skill for file correctness.
