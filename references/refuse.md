# Avoid: typical AI reflexes

Derived from the refuse list of the Impeccable design skill (`craft-floor.md`), adapted to slides (**transferred, untested on slides**). The user's brief can release any item; a release is recorded as a waiver in the plan. Reaching for an item without the brief asking means no decision was made. Then rewrite the element, do not soften it.

The list has two parts, which the check list treats differently:
- **Detectable** items can be found in the file by code. They are reported as findings (pass or fail); a few, where the file cannot tell a legitimate use from the reflex, as observations with the reason.
- **Judgement** items need reading the slide. They are reported as observations, never as thresholds.

## Detectable (checked from the file)
`scripts/check_deck.py` reports these under check 9 with the rule id in brackets (`scripts/detect.py`, transferred from Impeccable's detector rules). A rule id quoted in the plan's Waivers line turns the finding into "waived".
- Gradient fills or gradient text. Glass and blur effects as decoration.
- Shadows and glow effects without function, especially hard offset shadows. 3D effects.
- Emoji or Unicode symbols as icons.
- `nested-cards`: a box inside a box, the inner one with text. Nested cards are always wrong.
- `card-grid`: three or more equal-sized boxes with heading and text as slide structure. Short header bars (under 48 pt) are not cards.
- `icon-tile-stack`: a small square tile or icon (20 to 72 pt) right above a heading, repeated.
- `stat-row`: two or more big numbers (40 pt and up) in one row, each with a small label: the hero-metric template. `number-card` (observation): a single big number boxed in a card. A single number with context in `talk` is fine.
- `side-stripe`: a thin coloured bar flush with the edge of a box. `border-on-rounded`: an outline of 2 pt or more on a rounded box. Header or footer bars and accent lines under titles are reported by the heuristic of check 9 as observations.
- `kicker`: a short label (up to 5 words, capitals, tracked or small) directly above the title. Fail in `talk` and `pitch`; observation in `read` and `update`, where a tracker (status or chapter, fixed position) is allowed.
- `numbered-labels` (observation): 01 / 02 / 03 as labels. Allowed when the sequence carries information (steps), then without the leading zero.
- `buzzword`: filler vocabulary from the language list below (except "leverage", which is a normal word in finance).
- `question-title` (check 1): a title that is a question is not a claim.
- `justified-text`, `centered-running-text`, `all-caps-body`: running text (8, 12 or 5 words and more) justified, centered or in capitals. `wide-tracking` (observation): letter spacing above 0.05 em on running text.
- `shape-illustration` (observation): twelve or more small text-less shapes clustered in one region, a picture built from primitives. Diagrams and charts built from shapes are fine. Pictures embedded as PNG are not seen by the detector.
- More than 2 font families (check 2). Text on a photo without a text panel or scrim (check 5, contrast not computable).

## Judgement (observed while reading)
Structure:
- Cards as the default container for any content, even when not in a grid or nested.
- Topic-only filler slides ("Overview", "Outlook", "Agenda") without a claim. A contents slide is allowed only in decks of more than 15 slides.
- Bullet lists of bold keyword, colon and half-sentence as default content.
- Closing or "Thank you" slides without content.
- The same composition on every slide, or on every title slide across decks: a template, not a direction.

Surface:
- Rounded boxes with soft shadows standing in for content.
- Mixed icon styles (different libraries or stroke widths).
- Monospace as a costume for "technical" instead of code, data or measurements.
- Geometric shapes (circle, polygon) standing in for a real image cut-out, and decorative illustrations built from simple shapes. Real image, the exhibit itself, or pure type.
- Sparklines, progress rings and decorative charts without data behind them.
- A font used by unexamined default, with no deliberate roles or hierarchy. Font families themselves are not banned: Arial or Calibri with clear roles are fine.
- Purple-blue gradients as a colour scheme.

Language:
- Filler vocabulary: "seamless", "powerful", "holistic", "synergies", "leverage", "game changer", "cutting-edge", "next-generation", "world-class", "best-in-class", "revolutionary", "market-leading", "empower", "supercharge", "streamline", "enterprise-grade" (and German equivalents: "nahtlos", "leistungsstark", "ganzheitlich", "Synergien", "hebeln", "bahnbrechend", "revolutionär", "marktführend", "zukunftsweisend", "Gamechanger"). Detected, see above.
- Reflex triads: three adjectives with no content, for example "fast, secure, scalable". A deliberate three-part structure that carries content is fine.
- Dash cascades and rhetorical questions as titles (questions are detected).
- Claims without evidence ("market leading", "revolutionary").

## Default looks
Four whole-deck looks that generated decks converge on (dark navy with neon accent, cream with serif and terracotta, white with blue-purple gradient and icon cards, editorial hairlines with italic serif and tracked labels) are listed with their self-check in `direction.md`. They are legitimate only when the brief calls for them. The check script reports a violet-blue, cream or dark navy ground on at least half the slides as an observation (`default-look`, check 11).

## Rule of thumb
Could this slide stand unchanged in a deck on a completely different topic? Then it is too generic. Rethink it. (Judgement.)
