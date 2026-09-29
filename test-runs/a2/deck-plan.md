# Deck plan: Von Excel zu BI (6 Folien)

## 1. Brief
Purpose:            Das Team stimmt einem Pilot fuer ein BI-Tool zu.
Audience:           Eigenes Team, Excel-Alltag, Skepsis unbekannt (Annahme: gemischt).
Situation:          Gruppenpraesentation live, Meetingraum, Bildschirm oder Beamer.
Duration / length:  6 Folien, etwa 6 bis 8 Minuten (Annahme).
Language:           Deutsch
Pinned by user:     kein Template; Look ueberlassen ("mach du"); Belegzahlen sollten "ausgedacht" werden.
Waivers:            P09 (user: "mach du", Look- und Layoutwahl uebergeben; patterns.md nennt zwar ein talk-Budget fuer P09, fuehrt talk aber nicht in der Profiles-Zeile)
Profile:            talk
Placeholders:       allowed (Belegzahlen fehlen; ausgedachte Zahlen waeren erfundene Fakten, daher nur [[Zahl: ...]] mit Vermerk Entwurf)

## 2. Direction
Scene sentence:     Ein Team sitzt im hellen Meetingraum vor einem Bildschirm und entscheidet gemeinsam, ob es einen Pilot startet.
Mechanism:          Aus einem Gewirr von Dateien wird eine erkennbare Route mit klarem naechsten Halt: dem Pilot.
Mode:               Quick (explizite Uebergabe "mach du"; Inhaltsfragen vom Nutzer beantwortet)

Directions considered: keine (Quick).

Chosen direction:   Wegweiser-Beschilderung: Signalorange-Flaeche, schwarze Arial-Schrift, eine durchgezogene Linie mit Haltepunkten wie ein Liniennetz.
Drafts shown:       none (Quick)
Colour strategy:    Committed (Signalorange traegt Cover und Aussagefolien, Inhaltsfolien weiss)
Pattern variants:   Interpretation n/a; Exhibit side n/a; Image world: nur Schrift und Exponate; Density: unteres Ende, ein Gedanke pro Folie; Ground: Farbflaeche auf Cover und einer Aussagefolie, sonst hell; Title voice: sans bold mit hervorgehobener Schluesselphrase; Emphasis: Akzent nur auf dem Fokuselement; Structure: Regeln und Raum
Direction contract:
- THESIS: Das Deck besitzt die Idee "eine Route statt vieler Dateien" und verweigert das Standard-Deck aus Karten, Icons und Excel-Gruen mit Tabellenraster.
- OWN-WORLD: Signalorange E8491D als Flaeche und Fokus, fast schwarze Arial-Bold-Titel bei 44 pt, weisse Inhaltsflaechen, eine 3-pt-Linie mit kleinen runden Haltepunkten als einziges wiederkehrendes Zeichen, keine Bilder, keine Icons.
- FIRST SLIDES: Cover: Orange-Flaeche vollflaechig, Titel schwarz 44 pt bold links in Spalte 1 bis 8 ab y 2,6 in, darunter Untertitel 24 pt. Key-Slide (Folie 3): weisser Grund, Titel oben links, darunter Kennzahl-Platzhalter 60 pt bold in Orange, Label 24 pt schwarz.
Rationale:          Orange/Schwarz statt Excel-Gruen und Tabellenraster; Beschilderung passt zum Bild "Route mit Haltepunkten"; Orange erreicht 3,9:1 auf Weiss (Grosstext, Grafik) und Schwarz erreicht 4,7:1 auf Orange.
Self-check:         Kategorie "Excel zu BI" wuerde Gruen, Blau und Tabellen vorhersagen; Orange/Schwarz-Beschilderung ist nicht daraus ableitbar.

## 3. Story
Governing message:  Berichte von Hand kosten uns Zeit; ein BI-Tool baut sie aus einer Quelle, Excel bleibt fuer Ad-hoc-Analysen, und ein Pilot testet das zuerst.
Title strand:       Von Excel zu BI: Vorschlag fuer einen Pilot / Unsere Berichte entstehen von Hand / Excel-Berichte kosten Arbeitszeit / BI baut Berichte aus einer Quelle / Excel bleibt fuer schnelle Ad-hoc-Analysen / Wir starten heute den Pilot
Arc:                Problem (2, 3), Loesung (4), Einwand entkraeftet (5), naechster Schritt (6).

## 4. Design system (deck-wide)
Fonts:              Arial (Titel und Text), Fallback Liberation Sans
Text roles:
| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| title | Arial | bold | 44 | 141414 | claim titles, statements |
| keynumber | Arial | bold | 60 | E8491D | one key number |
| lead | Arial | bold | 32 | 141414 | cell text before-after |
| body | Arial | regular | 24 | 141414 | subtitle, labels, supporting text |
| label | Arial | bold | 24 | 141414 | station names |
| footnote | Arial | regular | 12 | 595959 | source and status line |
Palette: background FFFFFF | text 141414, 595959 | accent E8491D | neutrals D9D9D9
Colour notes:       Orange E8491D ist Akzent und zugleich Flaechenfarbe auf Cover und Folie 5; Text darauf 141414 (4,7:1). Auf Weiss: Orange 3,9:1 (nur Grosstext und Grafik), 595959 7,0:1.
Grid and spacing:   13.33 x 7.5 in, margins 48 pt, 12 Spalten, Abstaende in Vielfachen von 8 pt
Layout types:       P01 cover, P14 statement, P13 key-numbers, P09 before-after, P11 timeline
Images and icons:   keine
Charts:             keine

## 5. Slide plan
| No. | Layout type | Claim title | Content (roles used) | Exhibit | Source | Basis | Speaker notes |
|---|---|---|---|---|---|---|---|
| 1 | P01 cover | Von Excel zu BI: Vorschlag für einen Pilot | subtitle (body) | none | none | hypothesis | Ziel nennen: heute Zustimmung zum Pilot. |
| 2 | P14 statement | Unsere Berichte entstehen von Hand | further text (body) | none | none | hypothesis | Eigene Beispiele aus dem Alltag ergaenzen. |
| 3 | P13 key-numbers | Excel-Berichte kosten Arbeitszeit | key number placeholder (keynumber), label (body) | one key number | Quelle: Entwurf, Zahl noch offen, Stand 29.09.2026; Vermerk Entwurf | placeholder | Echten Wert vor dem Termin eintragen. |
| 4 | P09 before-after | BI baut Berichte aus einer Quelle | column headers, cells (lead) | before/after | none | hypothesis | Ein konkreten Bericht als Beispiel zeigen. |
| 5 | P14 statement | Excel bleibt für schnelle Ad-hoc-Analysen | further text (body) | none | none | hypothesis | Einwand "ihr nehmt uns Excel weg" direkt ansprechen. |
| 6 | P11 timeline | Wir starten heute den Pilot | 4 stations (label) | route | none | hypothesis | Ask: Zustimmung heute; Umfang und Dauer gemeinsam festlegen. |

## 6. Avoid list check and assumptions
Risiko: Excel-Gruen und Tabellenraster (Kategorie-Look), Karten/Icons, Kennzahl-Reihe. Vermieden: Orange/Schwarz, keine Karten, eine Kennzahl allein.
Reihen-Familie (P07/P09/P10): nur Folie 4.
Platzhalter-Hinweis: Folie 3 traegt [[Zahl: Std./Bericht]] und den Vermerk Entwurf. Der Nutzer wollte ausgedachte Zahlen; das wird nicht getan, weil erfundene Belege in einer Entscheidungsvorlage als echt gelesen wuerden.
Annahmen: Publikum, Dauer, Zeitraum des Pilots sind offen; der Pilotplan enthaelt bewusst keine Wochenzahlen.

## 7. As built
Fonts: Arial. Rollen wie Abschnitt 4 (title 44 bold, keynumber 60, lead 32, body 24, label 24 bold, footnote 12). Palette wie geplant. Margins 48 pt. Layouts: P01 cover, P14 statement (Folien 2, 5), P13 key-numbers, P09 before-after (Waiver P09), P11 timeline.
Abweichungen nach dem Review: Cover hat unten die Routenlinie mit vier Punkten (Wiedererkennungszeichen, andere Komposition als Folie 2 und 5); Folie 4 nutzt Linie mit zwei Punkten statt Pfeil; Folie 4 "Viele Dateien per Mail" / "Eine Quelle" (kein unbelegtes "Live"); Folie 2 ohne "Jeden Monat" (unbestaetigte Behauptung); Folie 6 Titel ist die Bitte "Wir starten heute den Pilot".
Review: frischer Reviewer (Subagent) Disposition fix, 7 Befunde; Befunde 1, 2, 4, 5, 6 eingearbeitet, 3 (Platzhalter) und 7 im Abschluss benannt. Verdict-Pass der Korrekturen: siehe Abschlussbericht.
