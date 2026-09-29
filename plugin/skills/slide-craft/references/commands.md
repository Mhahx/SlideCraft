# Modes

Every mode works against the deck plan (`deck-plan.md`). Without a plan, derive one from the deck first, in full and in writing, before building, refining or redesigning anything. `audit` and `critique` are the exception: they change nothing, so a condensed derivation held in the report is enough — write the full `deck-plan.md` only when a later mode will build against it. `audit` and `critique` report deviations from the plan as findings, `polish` restores the plan's system, refinement modes keep the plan, redesign modes replace it.

Refinement modes inherit the deck's look. Redesign modes run the direction flow in `direction.md` first. `critique` and the final review follow the fresh-review rules there.

Each mode is a working instruction and is labelled **read-only**, **refinement** (keeps the existing look and content) or **redesign** (replaces it). Never mix refinement and redesign in one pass. Clarify brief and profile first (SKILL.md).

Every change to wording, cuts or number format is listed for the user. Facts and values are never changed.

## audit — read-only
Report only, no changes. Render the deck and run the check list in `rules-core.md`, each item with slide number, value and method (file / computed / script / render estimate / judgement). Items measured from the file, computed or run by script are reported as pass or fail. Render estimates and judgements are reported as observations. Items that need a script that does not exist yet are listed as "not measured". Score each area 0 to 4 using the anchors below. Keep measured defects and judgement apart.

| Area | 0 | 2 | 4 |
|---|---|---|---|
| Story | titles are topics, no argument | most titles are claims, argument has gaps | title strand alone tells the argument, answer first |
| Typography | more than 2 families, no clear roles, sizes below minimum | roles exist but drift between slides | fixed roles, identical everywhere, all minimums met |
| Layout and grid | elements floating, overflow, uneven margins | grid mostly kept, some drift | shared edges, fixed positions, layouts as real placeholders |
| Colour and contrast | many colours, unmeasured contrast, text on photos | colour count ok, some contrast unchecked | 1 accent + at most a signal pair, contrast computed and passing |
| Data and charts | no sources, 3D or legends only | sources mostly present, some default styling | claim in title, direct labels, source and date on every data slide |
| Accessibility | no titles, colour-only meaning, no alt text | titles and alt text partly present | reading order correct, alt text everywhere, no colour-only meaning |

## critique — read-only
Design judgement as a design director. Questions: does the title strand tell a story? Is each slide specific to this topic or interchangeable? Does the profile fit the situation? Hierarchy, eye path, text density. At most 3 to 5 prioritised problems and 2 to 3 strengths. Order: first the judgement without measured values, then the measurement from `audit`, so numbers do not steer the judgement. Where subagents are available, run the two as separate passes. Otherwise state that this is a sequence, not independence.

Independence protocol: (1) judge from the renders and the request only; do not read the build script or the plan's rationale. (2) Write down the problems before opening any check output. (3) Then run `audit`, and keep measured values apart from the judgement. (4) Try to falsify every `pass` and every "kept" in the plan: title against exhibit, figure against source, comparison against definition, contrast against the surface it sits on. (5) Report one disposition (`ship | fix | rebuild | recapture`) with its scope, and one line on what was independent and what was not.

## polish — refinement
Preserves look and content. Order: (1) defects that hinder understanding (cut-off text, wrong figure, missing source), (2) consistency (roles, spacing, positions), (3) alignment and rhythm, (4) small things (spelling, number format, alt text). Never redesign secretly. If the concept is wrong, say so and propose `bolder` or a redesign.

## distill — refinement (cuts content; list every cut)
Fewer slides, less text. Questions: what is the one message of this slide? What is redundant? What belongs into notes or an appendix? Goal: every slide passes the title test and fits the profile's time limit.

## typeset — refinement (redesign if the font family changes; then confirm)
Roles, size steps, font pairing, line spacing, contrast. Name roles first (title, body, label, footnote), then apply identically on all slides. Check font availability.

## layout — refinement (redesign if masters are rebuilt; then confirm)
Grid, spacing, alignment, layout types (the patterns in `patterns.md`), masters and placeholders. Related items tight, separate groups wide. Result: fewer one-off constructions.

## clarify — refinement (changes wording; list every change)
Rewrite titles as claim sentences, remove filler words and buzzwords, make numbers and units consistent, make labels precise. Values themselves stay unchanged.

## bolder / quieter — refinement (redesign if the identity changes; then confirm)
`bolder`: make a safe, interchangeable slide braver (size, contrast, bleed, key number) without breaking core rules. `quieter`: calm an overloaded slide (fewer colours, fewer elements). Both change intensity, not the message.

## Not offered
`animate`: only a simple transition in `talk`, nothing more.

## Without a task
If the skill is called without a deck task ("what can you do?"), answer in five lines and ask for the task: it decides how slides look and argue (profile, look from rendered drafts, story of claim titles, one deck plan); it checks a finished .pptx with a script (contrast, sizes, margins, sources, AI patterns, plan deviations); modes for an existing deck are `audit`, `critique`, `polish`, `distill`, `typeset`, `layout`, `clarify`, `bolder`, `quieter`; it does not create the file itself, the building tool does.
