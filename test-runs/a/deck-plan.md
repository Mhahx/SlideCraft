# Deck plan: Von Excel zum BI-Tool

## 1. Brief
Purpose:            Das Team soll einen Pilot für den Wechsel von Excel auf ein BI-Tool freigeben (Annahme, vom Nutzer nicht bestätigt).
Audience:           Eigenes Team, kennt Excel gut, BI-Tool nicht; skeptisch bis offen (Annahme).
Situation:          Live im Teammeeting, projiziert, helles Büro (Annahme).
Duration / length:  6 Folien
Language:           Deutsch
Pinned by user:     nichts (Nutzer: "Mach du")
Waivers:            keine
Profile:            pitch
Placeholders:       not allowed (keine Zahlen geliefert; das Deck kommt ohne Zahlen aus, Behauptungen ohne Beleg tragen die Statusmarke "Ohne Belege")

## 2. Direction
Scene sentence:     Ein Team sitzt in einem hellen Meetingraum vor einem Beamer und soll sich von vertrauten Tabellen lösen.
Mechanism:          Den Sprung von verstreuten Dateien zu einer gemeinsamen Datenbasis greifbar und das Risiko klein machen.
Mode:               Quick (Nutzer: "Mach du")

Directions considered (Quick: nur die gewählte):
| Direction | World | Colour strategy | Accent | Interpretation | Exhibit side | Image world | Density | Ground | Title voice | Emphasis | Structure |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Kontenblatt | Buchhaltungs- und Tabellenblatt: Haarlinien, Zeilen, Zahlenkolonnen | Restrained | 0F5C5C | rule | left | type | sparse | light, colour field on cover and statement | serif bold | accent only | rules |

Chosen direction:   Kontenblatt: das Deck sieht aus wie ein sauber geführtes Tabellenblatt, nur ruhiger und mit einer Farbe.
Drafts shown:       keine (Quick)
Colour strategy:    Restrained
Pattern variants:   Interpretation rule · Exhibit links · Image world type only · Density niedrig · Ground hell, Farbfeld auf Cover und Schluss · Title voice Serif fett · Emphasis nur Akzent · Structure Linien und Raum
Direction contract:
THESIS: Excel-Nutzer erkennen ihre eigene Welt (Zeilen, Linien, Kolonnen) und sehen, dass BI diese Ordnung teilt statt bricht.
OWN-WORLD: Haarlinien wie im Kontenblatt trennen Zeilen; Zeilenlabels links, Inhalt in Kolonnen; keine Karten, keine Icons.
FIRST SLIDES: Cover als tiefgrünes Farbfeld mit weißem Serif-Titel; Folie 2 als nummerierte Zeilen auf Weiß mit Haarlinien.
Rationale:          Grün-Petrol statt Excel-Grün: verwandt, aber eigenständig. Cambria für Titel (Ernst), Calibri für Inhalt (Excel-Nähe).
Self-check:         Look nicht allein aus der Kategorie "Business-Deck" erratbar (keine Navy/Neon, keine Karten); Ergebnis: bestanden (Urteil).

## 3. Story
Governing message:  Wir sollten mit einem kleinen Pilot von Excel auf ein BI-Tool wechseln, weil Excel uns Zeit und Vertrauen in Zahlen kostet.
Title strand:
1. Von Excel zum BI-Tool: Warum wir wechseln sollten
2. Excel kostet uns Zeit und Vertrauen in Zahlen
3. Ein BI-Tool schafft eine gemeinsame Datenbasis
4. Excel bleibt für Ad-hoc-Analysen, BI übernimmt Standardreports
5. Ein kleiner Pilot senkt das Wechselrisiko
6. Wir starten mit einem Pilot auf einem Report
Arc:                Problem, Lösung, Abgrenzung (Excel bleibt), Risikoarmer Weg, Entscheidung.

## 4. Design system (deck-wide)
Fonts:              Titel Cambria, Inhalt Calibri, Fallback Georgia/Arial
Text roles:
| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| cover title | Cambria | bold | 36 | FFFFFF | Titel Cover |
| title | Cambria | bold | 28 | 0F5C5C | Claim-Titel |
| body | Calibri | regular, bold für Zeilenlabels | 18 | 1F2933 | Inhalt, Tabellenkopf fett |
| status | Calibri | bold | 12 | 595959 | Statusmarke |
| footnote | Calibri | regular | 9 | 595959 | Quelle, Seitenzahl |
Palette: background FFFFFF, 0F5C5C | text 1F2933 | accent 0F5C5C | neutrals 595959, F2F2F2
  Kontraste (berechnet): Weiß auf 0F5C5C 7.8:1; 1F2933 auf Weiß >14:1; 595959 auf Weiß 7.0:1. Haarlinien BFBFBF nur dekorativ.
Grid and spacing:   13.33 x 7.5 in, margins 48 pt, 12 Spalten, Abstände in Vielfachen von 8 pt
Layout types:       P01 cover, P10 numbered-rows, P09 before-after, P07 table, P11 timeline, P14 statement
Images and icons:   keine
Charts:             keine

## 5. Slide plan
| No. | Layout type | Claim title | Content (roles used) | Exhibit | Source | Basis | Speaker notes |
|---|---|---|---|---|---|---|---|
| 1 | P01 | Von Excel zum BI-Tool: Warum wir wechseln sollten | cover title, body | keine | keine | hypothesis | Einstieg: Entscheidungsvorschlag, keine Zahlen im Entwurf |
| 2 | P10 | Excel kostet uns Zeit und Vertrauen in Zahlen | title, body, status | nummerierte Zeilen | keine | hypothesis | Eigene Beispiele des Teams pro Zeile ergänzen |
| 3 | P09 | Ein BI-Tool schafft eine gemeinsame Datenbasis | title, body, status | Vorher-nachher-Zeilen | keine | hypothesis | Tool-neutral, kein Produktversprechen |
| 4 | P07 | Excel bleibt für Ad-hoc-Analysen, BI übernimmt Standardreports | title, body, status, footnote | Tabelle Aufgabe zu Ort | Quelle: eigene Einschätzung, Stand 29.09.2026 | hypothesis | Ehrlich sein: Excel wird nicht abgeschafft |
| 5 | P11 | Ein kleiner Pilot senkt das Wechselrisiko | title, body, status | Zeitachse in vier Phasen | keine | hypothesis | Voraussetzung: einheitliche Kennzahlen-Definitionen, sonst hilft kein Tool |
| 6 | P14 | Wir starten mit einem Pilot auf einem Report | cover title, body | Farbfeld | keine | hypothesis | Entscheidung heute: Report wählen, Verantwortliche benennen |

## 6. Avoid list check and assumptions
Risiken: Karten-Raster (vermieden: Zeilen mit Linien), generisches Business-Deck (vermieden durch Kontenblatt-Look), erfundene Zahlen (keine Zahlen im Deck).
Annahmen, die nur der Nutzer entscheiden kann: Ziel (Pilot-Freigabe), Publikum, Live-Präsentation, konkrete Schmerzpunkte auf Folie 2, Zielort-Zuordnung auf Folie 4.

## 7. As built
(wird nach dem Build ergänzt)

Gebaut wie geplant: Cambria 36/28 und Calibri 18/12/9, Ränder 48 pt, Layouts P01, P10, P09, P07, P11, P14 als eigene Master. Abweichungen: Body-Rolle nutzt auch Fett für Zeilenlabels (Plan angepasst); Neutral F2F2F2 für das Voraussetzungs-Feld ergänzt. Check-Skript: 0 Fails, 43 Beobachtungen (u.a. Titel-Verb-Heuristik, Wortzahl). Render geprüft, Pfeil auf Folie 3 verschoben. Review: eigener Durchgang, kein unabhängiger Reviewer (Disposition: ship, mit Annahmen aus Abschnitt 6).
