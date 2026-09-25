# Avoid: typical AI reflexes

Derived from the refuse list of the Impeccable design skill (`craft-floor.md`), adapted to slides (**transferred, untested on slides**). The user's brief can release any item; a release is recorded as a waiver in the plan. Reaching for an item without the brief asking means no decision was made. Then rewrite the element, do not soften it.

The list has two parts, which the check list treats differently:
- **Detectable** items can be found in the file by code. They are reported as findings (pass or fail).
- **Judgement** items need reading the slide. They are reported as observations, never as thresholds.

## Detectable (checked from the file)
- Gradient fills or gradient text. Glass and blur effects as decoration.
- Shadows and glow effects without function, especially hard offset shadows. 3D effects.
- Thick coloured edge stripes on boxes and quotes, header or footer bars, and accent lines under titles.
- Emoji or Unicode symbols as icons. Mixed icon styles (different libraries or stroke widths).
- Text on a photo without a text panel or scrim.
- Centered running text. More than 2 font families.
- A kicker above the title (a decorative label; a tracker that shows status or chapter position is not a kicker and is allowed in `read` and `update`).
- Numbering like 01 / 02 / 03 as decoration (allowed when the sequence carries information, for example steps).

## Judgement (observed while reading)
Structure:
- Grids of equal-sized cards, each icon plus heading plus text, as slide structure. Nested cards are always wrong.
- The hero-metric template: big number, small label, supporting stats and an accent, repeated as page structure. A single number with context in a `talk` slide is fine.
- Topic-only filler slides ("Overview", "Outlook", "Agenda") without a claim. A contents slide is allowed only in decks of more than 15 slides.
- Bullet lists of bold keyword, colon and half-sentence as default content.
- Closing or "Thank you" slides without content.

Surface:
- Rounded boxes with soft shadows standing in for content.
- Monospace as a costume for "technical" instead of code, data or measurements.
- Geometric shapes (circle, polygon) standing in for a real image cut-out.
- Sparklines, progress rings and decorative charts without data behind them.
- A font used by unexamined default, with no deliberate roles or hierarchy. Font families themselves are not banned: Arial or Calibri with clear roles are fine.
- Purple-blue gradients as a colour scheme.

Language:
- Filler vocabulary: "seamless", "powerful", "holistic", "synergies", "leverage", "game changer" (and German equivalents: "nahtlos", "leistungsstark", "ganzheitlich", "Synergien", "hebeln").
- Reflex triads: three adjectives with no content, for example "fast, secure, scalable". A deliberate three-part structure that carries content is fine.
- Dash cascades and rhetorical questions as titles.
- Claims without evidence ("market leading", "revolutionary").

## Default looks
Four whole-deck looks that generated decks converge on (dark navy with neon accent, cream with serif and terracotta, white with blue-purple gradient and icon cards, editorial hairlines with italic serif and tracked labels) are listed with their self-check in `direction.md`. They are legitimate only when the brief calls for them.

## Rule of thumb
Could this slide stand unchanged in a deck on a completely different topic? Then it is too generic. Rethink it. (Judgement.)
