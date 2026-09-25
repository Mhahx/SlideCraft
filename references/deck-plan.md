# Deck plan

A deck plan is written BEFORE any slide is built. It is the single source of truth for building, checking and later edits. Everything that must stay consistent across slides is decided here once: story, direction, text roles, colours, grid, layout types. The build step only executes the plan.

## Rules for the plan
- Write it as a file next to the deck (`deck-plan.md`), or in the chat if no file system is available (for example inside an office add-in). Keep it short: one screen per section.
- Show the plan to the user. Then continue building without waiting, unless (a) the user asked to review the plan first, (b) the user has not picked a draft yet (see `direction.md`, round 2; once the user has picked, show the plan and keep building), or (c) the plan contains an assumption only the user can decide (audience, message, missing data). In cases (b) and (c) ask once, bundled.
- Changes during the build are made in the plan first, then in the deck. If a slide needs something the plan does not provide (a new layout type, a new colour), extend the plan deck-wide instead of improvising on one slide.
- For an existing deck without a plan, derive the plan from the file first (read fonts, sizes, colours, layouts), then work against it. Refinement modes keep the derived plan, redesign modes replace it and run `direction.md`.
- `audit`, `polish` and `critique` check the deck against the plan. A deviation from the plan is a finding.
- After the fresh review, update the plan to "as built" (section 7).

## Template

```
# Deck plan: <working title>

## 1. Brief
Purpose:            what the audience should decide, do or understand
Audience:           who, prior knowledge, what they care about
Situation:          read alone / presented live / both; room, screen, print
Duration / length:  minutes or page budget
Language:           of the slides
Pinned by user:     brand, template, fonts, colours, tone words, references, anti-references
Waivers:            each pinned item and the rule it overrides (for example "brand font Aptos
                    overrides safe-list rule"). Contrast and accessibility waivers only with
                    the user's explicit words, quoted here. Checks report waived items as
                    "waived by brief".
Profile:            read | talk | pitch | update  (values from profiles.md)

## 2. Direction  (new deck or redesign; see direction.md)
Scene sentence:     who sees it, where, on which medium, under what light
Mechanism:          what this deck must make believable or decidable
Mode:               Drafts | Quick (Quick only on explicit hand-over)
Chosen direction:   name and one-line world
Drafts shown:       each direction with its rendered draft paths and honest risk; which one
                    the user picked, and any change or mix the user asked for
Colour strategy:    Restrained | Committed | Drenched (pinned: Full palette)
Direction contract: THESIS / OWN-WORLD / STORY / FIRST SLIDES / FORM / FINISH
Rationale:          one line per major decision (why this palette, why this type pairing)
Self-check:         could the look be guessed from the category alone? result

## 3. Story
Governing message:  one sentence, the answer first
Title strand:       all slide titles in order, as claim sentences
                    (exempt: title, divider, quote, appendix)
Arc:                how the strand builds (for example problem, evidence, decision)

## 4. Design system (deck-wide)
Fonts:              title family, body family, fallback (safe-list rule)
Text roles:         role | family | weight | size pt | colour | use
                    title, subtitle, body, label, footnote/source, key number
                    (sizes at or above the profile minimums)
Palette:            background | text | accent | signal (max 1) | neutrals
                    each with hex and role; contrast pairs with computed ratio
Grid and spacing:   slide size, margins, 12 columns, spacing scale
Layout types:       the layouts this deck uses (title, divider, text, image,
                    chart, comparison, quote/key number), each with its placeholders
Images and icons:   style, crop, icon library and stroke
Charts:             types used, highlight colour, labelling rule, source line

## 5. Slide plan
No. | Layout type | Claim title | Content (roles used) | Exhibit | Source | Speaker notes
Every slide is one row. Word count per slide stays under the profile limit.

## 6. Avoid list check and assumptions
Which items from refuse.md were at risk in this deck and how the plan avoids them.
Facts, numbers or sources that are missing and marked as placeholders. Assumptions the user has not confirmed.

## 7. As built (filled after the fresh review)
Real fonts, role sizes, hex colours, margins and layout types as shipped. Deviations from sections 2 to 5 and why. Review disposition and its scope.
```

## Consistency checks on the plan itself (before building)
1. Title strand read alone tells the argument; every non-exempt title is a claim.
2. Each text role has one size and one colour; sizes are at or above the profile minimums; neighbouring sizes differ by at least a factor of 1.25.
3. Palette follows the colour rule (1 accent + at most 1 signal colour); every text and background pair has a computed contrast at or above the threshold.
4. Every slide row uses a layout type defined in section 4 and a role defined in the role table.
5. Every data slide has a source and date.
6. Word counts fit the profile limit.
7. The direction contract has six blocks and none reads like a mood. The self-check against the AI-default looks was done.
