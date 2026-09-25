# Direction

Decide what the deck should look and feel like, from the audience's world and the deck's purpose, not from defaults. Adapted from Impeccable's new-work flow (visual work); the web-specific machinery (dice script, mock images, browser decision page) is left out.

## When to run this
- **New deck or redesign:** run the whole flow.
- **Refinement of an existing deck, or one added slide:** no direction round. Inherit the deck's look (derive the plan from the file). A local addition never becomes a new identity exercise.
- **Redesign:** keep facts, content and constraints, treat the old look as evidence, and replace it. Never polish the discarded look.

## What is already true (decide first)
- Established look in the deck or brand: inherit it and document it.
- Incomplete brand: keep confirmed assets, expand the system with the user.
- Nothing given: create a new direction.
A user- or brief-pinned choice (font, colour, tone words, a reference) always beats anything derived here. Vibe words the user volunteers ("calm, credible", "not like a consulting deck") are pinned constraints. Translate them with the table below.

## Ask what will change the work
This is the single question round of the whole workflow (SKILL.md step 1). Two or three related questions in one round. A precise brief needs only a short confirmation. A sparse brief needs at least one round. State the likely reading and invite correction instead of building a menu.
- Purpose and outcome: what should the audience decide, believe or do? What proves it?
- Situation: who sees it, where, on which medium, in what state of mind?
- Boundaries: what must stay untouched? What would make a polished result feel wrong?
Never ask for hex values, font names or a menu of style lanes, and do not open with a vibe questionnaire. If nobody can answer, mark the assumptions in the plan and continue with the recommended direction.

## Derive the direction
1. **Scene sentence:** who sees the deck, where, on what medium, under what light. It decides light or dark background and the size floor.
2. **Mechanism:** one sentence on what this deck must make believable or decidable that a generic deck could not.
3. **The audience's world:** list five to seven concrete visual systems, artifacts or traditions this audience knows by heart (for example annual reports, museum catalogues, scientific journals, timetables and signage, technical drawings, film title cards, trade press, dashboards), each with one line on why it can carry the mechanism, ordered by resonance. Near-duplicates count once. If more than three share one material family, dig until the list spans at least three families.
4. **Directions:** turn the strongest candidates into complete directions. Each joins a look (colour strategy, type character, grid character, image world) to what the title slide and one key data slide would look like.

## Quick or choice (how many directions to show)
**Choice is the default** (decision by Max, 2026-09-25): one extra message to pick a direction costs less than rebuilding a deck that missed the intended look. Show two or three directions and let the user pick before building.

**Quick** applies only when one of these holds:
- the user explicitly hands the decision over ("you decide", "mach du"), or
- the brief already pins the look enough (brand or template, tone words and profile) and the deck has at most 10 slides.

In Quick mode, commit to one recommended direction, show it with one alternative and the standing exit, then continue building. The user can always ask for options afterwards.

In Choice mode keep it to a single compact message: two or three directions, each with a one-line world, palette and type character, what the title slide looks like, and an honest risk line. If the brief is already clear enough to derive directions, put the questions of step 1 and the directions into the same message so there is only one round. Claude never pre-selects the safe option on the user's behalf.

## Standing exit
Always offer one quiet alternative: the category standard played straight, meaning the plain profile look (`read` or `update` as a clean consulting-style deck, `talk` as a clean keynote look). Claude never recommends it and never lets it soften the other directions. If the user takes it, execute it at full quality, without smuggling in quirks.

## Commit the look
- **Colour strategy first, then colours.** Restrained (neutrals plus one accent; default for `read` and `update`), Committed (one saturated colour carries 30 to 60 % of the surface), Drenched (the slide surface is the colour). The colour count rule in `rules-core.md` still applies. A multi-colour "full palette" is allowed only when the brief pins it.
- **Light or dark** follows from the scene sentence, never from the industry.
- **Fonts** come from the user or brand, otherwise from the safe list of `rules-core.md`. Differentiation then comes from deliberate pairing, size scale, weight contrast, alignment and layout, not from exotic fonts.
- **Layout character:** strict grid or asymmetric, generous or compact whitespace, rules or fields, image world (documentary photo, illustration, diagram, pure type).
- The first build is fully committed. Later passes make the committed look clearer, never blander. An unattended run's safe rendition is the known risk.

## Vibe words to decisions
| Words | Decisions |
|---|---|
| calm, credible, cool | muted palette with a cool base, low saturation, quiet weight contrast, generous whitespace |
| energetic, bold | strong accent, large type, bleed, few elements per slide |
| warm, approachable | warm neutrals, softer weight contrast, human photography over icons |
| precise, technical | strict grid, small labels, direct chart annotation, restrained accent |
| dimmed room, projector | dark ground, larger type, contrast computed anyway |
| PDF or print | light ground, stays legible in greyscale |
| "not like X" | the plan lists X's typical devices under avoid |
Vibe moves decisions inside the core rules. Contrast, minimum sizes, the colour rule and the ban list stay the floor.

## Calibration against the AI look
Generated decks cluster around a few looks whatever the subject:
1. Near-black or dark navy ground with one neon or teal accent and glowing edges.
2. Warm cream ground, high-contrast serif titles and a terracotta or red accent.
3. White ground, blue-purple gradient, rounded cards with icons.
4. Editorial hairlines, italic serif titles and small tracked capitals as labels.
All are legitimate when the brief calls for them. Where the brief leaves the look free, landing in one of them means the self-check failed. Self-check: could someone guess the look from the category alone (a sustainability deck, so green and cream; a fintech pitch, so navy and neon)? Then rework until neither the category nor the category plus its obvious avoidance predicts it. Warm, bookish, sustainability and child-facing subjects are the strongest pull towards cream plus serif: treat that first palette as already spent. Energy is not the enemy of trust: a brief's negative constraints rule out devices, not exuberance.

## Direction contract
Before the plan is finished, write the chosen direction as six short blocks, about 150 words in total. A block that reads like a mood means the direction is not decided.
- **THESIS:** the one idea this deck owns and the default arrangement it refuses.
- **OWN-WORLD:** palette and component language, specific enough to be recognisable with all content removed.
- **STORY:** what the audience understands, believes and does.
- **FIRST SLIDES:** the exact composition of the title slide and one key data slide: what is where, at what scale.
- **FORM:** the chosen form, its position on the ordered list and the alternatives shown.
- **FINISH:** "no slide before the plan; this deck ends with the fresh review and the plan as built".
The contract lives in the plan only. Never put it into slide text, notes or file metadata.

## Finish
1. **Capture validity:** render every slide and open each image once. A blank, cut-off or half-loaded render is not evidence. Recapture before judging.
2. **Bounded passes:** build fully, inspect once in a batched round, fix everything found in one batch, confirm with at most one more round. Then stop polishing. Two rounds is the ceiling for an unattended run. In an attended session the ceiling belongs to the user.
3. **Fresh review:** where subagents are available, spawn a reviewer with no build history. Inputs: the request and confirmed answers, the deck plan with the direction contract, the file path, the render paths, and the check results with their methods. Without subagents, do a fresh pass after stepping out of the build context and say so in one line. The reviewer returns exactly one disposition:
   - **recapture:** the evidence failed, not the deck. Re-render, then review again in full.
   - **rebuild:** the direction failed wholesale. Re-derive the named parts and review in full again. Tell the user, do not ask permission.
   - **fix:** material fixes in one batch, rebuild once, re-render the same slides, send back for a verdict pass that scores only the listed fixes as resolved, partial or unresolved.
   - **ship:** nothing is owed.
4. **Report at the scope of the verdict.** "All three fixes resolved" is a claim a verdict pass supports. "No issues remain" is not. Never announce a table with open material findings as a pass.
5. **Plan as built:** update the plan with the real values (fonts, role sizes, hex colours, layouts used, margins) and note deviations. Later edits work from the as-built plan. Unreviewed and undocumented is unfinished.
