# Direction

Decide with the user what the deck should look like, from the audience's world and the deck's purpose, never from a default. There is no default look (decision by Max, 2026-09-25). Adapted from Impeccable's new-work flow; its decision comps become rendered draft slides here, its web machinery (dice script, browser decision page) is left out.

## When to run this
- **New deck or redesign:** run the whole flow.
- **Refinement of an existing deck, or one added slide:** no direction round. Inherit the deck's look (derive the plan from the file). A local addition never becomes a new identity exercise.
- **Redesign:** keep facts, content and constraints, treat the old look as evidence, and replace it. Never polish the discarded look.

## What is already true (decide first)
- Established look in the deck or brand: inherit it and document it.
- Incomplete brand: keep confirmed assets, expand the system with the user.
- Nothing given: create a new direction with the user.
A user- or brief-pinned choice (font, colour, tone words, a reference) always beats anything derived here. Vibe words the user volunteers ("calm, credible", "not like a consulting deck") are pinned constraints. Translate them with the table below.

## Round 1: ask what will change the work
This is the first of the two rounds before building (SKILL.md step 1). Three or four related questions in one message. A precise brief needs only a short confirmation. State the likely reading and invite correction.
- Purpose and outcome: what should the audience decide, believe or do? What proves it?
- Situation: who sees it, where, on which medium, in what state of mind?
- Look: is there a brand, template or font that must be used? What effect should the deck have, in the user's own words? Is there a deck, a publication or a brand they like, or one it must not resemble?
- Boundaries: what must stay untouched? What would make a polished result feel wrong?
Ask for the effect and for references, not for design decisions: never ask for hex values or font names, and never offer a menu of style lanes. "Modern and clean" is not an answer to build from; ask once what it should feel like in the room or what it must not look like. If nobody can answer, mark the assumptions in the plan and derive the drafts from the scene and the audience's world.

## Derive the direction
1. **Scene sentence:** who sees the deck, where, on what medium, under what light. It decides light or dark background and the size floor.
2. **Mechanism:** one sentence on what this deck must make believable or decidable that a generic deck could not.
3. **The audience's world:** list five to seven concrete visual systems, artifacts or traditions this audience knows by heart (for example annual reports, museum catalogues, scientific journals, timetables and signage, technical drawings, film title cards, trade press, dashboards), each with one line on why it can carry the mechanism, ordered by resonance. Near-duplicates count once. If more than three share one material family, dig until the list spans at least three families.
4. **Directions:** turn the two or three strongest candidates into complete directions. Each joins a look (colour strategy, type character, grid character, image world) to the exact composition of the title slide and of the deck's most typical content slide. The directions must differ in composition, not only in colour: the same layout in three palettes is one direction.

## Round 2: rendered drafts, the user picks
Always, for a new deck or a redesign (decision by Max, 2026-09-25): the user chooses the look from rendered drafts before the deck is built. Descriptions alone are not enough, because a look is judged by seeing it.
- **Drafts:** for each direction build two real slides with the deck's real content from the brief: the title slide and the most typical content slide (for example the key chart, the key comparison, the key number). Same effort and finish for every draft; no deliberately weak option. Run the detectable checks (`scripts/check_deck.py`, check 9) on the drafts and fix findings before showing them.
- **Show:** one compact message with the rendered images side by side, and per direction a one-line world, palette and type character, and an honest risk line. Recommend one and say why. Never pre-select the safe option on the user's behalf.
- **Pick:** the user picks one, or asks for a named change or a mix (state the mix back in one line). Record the pick, the drafts shown and their paths in the plan. The picked drafts become the title slide and the pattern for the content slides of the full deck.
- **Quick** (no drafts) only when the user explicitly hands the decision over ("you decide", "mach du"). Then commit to one direction, say which in one line, and build. The user can always ask for drafts afterwards.

How to render the drafts, by environment:
| Environment | Drafts |
|---|---|
| pptx skill (Claude app, Claude Code) | one small .pptx per direction (`drafts/<direction>.pptx`), rendered to one PNG per slide (`check_deck.py --render-dir`, or the pptx skill's rendering), images shown to the user |
| PowerPoint add-in | add the draft slides at the end of the open deck, name the direction in the speaker notes, ask the user to look at them; after the pick delete the drafts not chosen |
| Claude Design, HTML | render the two slides per direction natively and show them |
| no rendering available | say so in one line, then describe each draft precisely (what is where, at what scale, which colour on which surface) and mark it as not rendered |

## Commit the look
- **Colour strategy first, then colours.** Restrained (neutrals plus one accent), Committed (one saturated colour carries 30 to 60 % of the surface), Drenched (the slide surface is the colour). None is a default; the direction decides. The colour count rule in `rules-core.md` still applies. A multi-colour "full palette" is allowed only when the brief pins it.
- **Light or dark** follows from the scene sentence, never from the industry.
- **Fonts** come from the user or brand, otherwise from the safe list of `rules-core.md`. Differentiation then comes from deliberate pairing, size scale, weight contrast, alignment and layout, not from exotic fonts.
- **Layout character:** strict grid or asymmetric, generous or compact whitespace, rules or fields, image world (documentary photo, illustration, diagram, pure type).
- The full build is fully committed to the picked drafts. Later passes make the committed look clearer, never blander.

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
- **FORM:** the chosen form, the drafts shown and why this one was picked.
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
