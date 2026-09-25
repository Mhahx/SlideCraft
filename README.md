# slide-craft

Regelwerk und Qualitätsprozess für Präsentationsfolien (pptx), gedacht als Claude-Skill neben dem pptx-Skill.

**Stand: Entwurf 0.16 (status: draft), zwei komplette Läufe des Ablaufs mit Max (`examples/nordmark/`, `examples/norra/` mit gepinntem Stil Liquid Glass), Verbotspunkte per Plan freigebbar, Grenzwerte für Lesedecks an 9 echten Decks kalibriert, Ablauf mit Story-Skelett vor den Entwürfen, Prüfskript mit Planabgleich, Renderprüfung und Detektor für KI-Muster, Look-Auswahl über gerenderte Entwürfe, Musterbibliothek mit 14 Folienmustern aus echten Beratungsdecks. Grenzwerte noch nicht an echten Decks kalibriert.** Alle Zahlenwerte sind Startwerte und müssen an echten Decks kalibriert werden. Änderungen seit 0.1: siehe [CHANGELOG.md](CHANGELOG.md). Skill-Dateien sind englisch, Projektdokumente deutsch.

Ziel, Umfang, Entscheidungen, nächste Schritte und die verbindlichen Arbeitsregeln (§11) stehen in [BRIEF.md](BRIEF.md). Dort zuerst lesen.

## Worum es geht

**Problem:** Von Claude erzeugte Folien (.pptx) sind sofort als KI erkennbar: Kartenraster mit Icons, Verläufe, unbedachte Standardschriften, überladene Bullet-Listen, austauschbare Titel wie "Überblick". Für Websites löst das Impeccable-Plugin dieses Problem. Für Folien gibt es nichts Vergleichbares. Der pptx-Skill regelt vor allem die Dateimechanik, und sein Abschnitt "Design Ideas" empfiehlt teils genau die Muster, die wir vermeiden wollen.

**Idee:** Ein "Impeccable für Folien": ein Claude-Skill (`slide-craft`), mit dem Max gute Decks mit weniger Aufwand bekommt. Er vermeidet die typischen KI-Muster und gibt Gestaltung nach dem Vorbild professioneller Beratungsdecks vor, egal ob in Claude, PowerPoint, LibreOffice oder Claude Design. Er ergänzt den pptx-Skill und ersetzt ihn nicht. Für Gestaltung und Inhalt gilt slide-craft, aus dem pptx-Skill nur die Technik.

**Wie er arbeitet:**
1. Eine Rückfragerunde (Zweck, Situation, gewünschte Wirkung, Vorbilder, was würde falsch wirken).
2. Ein Profil wählen: `read` (Lesedokument, Vorbild McKinsey/BCG/Bain), `talk` (Vortrag, Vorbild Apple/Jobs), `pitch`, `update`.
3. Story-Skelett: alle Folientitel als Aussagesätze, je Folie ein Muster aus `references/patterns.md`. Der Titelstrang muss die Argumentation allein tragen (Story vor Design).
4. Look mit dem Nutzer erarbeiten: 2 bis 3 Richtungen aus der Welt des Publikums, jede als gerenderter Entwurf aus dem Skelett (Titelfolie und Schlüsselfolie mit echtem Inhalt), die Richtungen unterscheiden sich in den Musterungsvarianten, nicht nur in der Farbe. Der Nutzer wählt und prüft dabei das Skelett. Kein Standard-Look. Selbsttest gegen typische AI-Looks (aus Impeccable übertragen).
5. Deck-Plan vervollständigen (Richtung mit Musterungsvarianten, Designsystem mit Textarten, Palette, Raster, Folientabelle), bevor eine Folie gebaut wird.
6. Bauen, dann in einem gebündelten Durchgang prüfen, mit Detektor für KI-Muster. Danach ein frischer Reviewer ohne Bauverlauf und der Plan "as built".

**Kernprinzipien:** Regeln statt Stil-Themes. Messbarkeit: Als bestanden oder nicht bestanden gilt nur, was aus der Datei gelesen, berechnet oder per Skript gemessen wird. Vom Nutzer Festgelegtes (Marke, Vorlage) gewinnt und wird im Plan als Waiver geführt.

## Stand

Konzept, Regelwerk, Prüfskript (seit 0.6), Planabgleich (0.7), Renderprüfung (0.8), Detektor für KI-Muster (0.11) und Musterbibliothek (0.12, abgeleitet aus 9 echten Decks von McKinsey, BCG, Bain und Roland Berger, `research/beratungsdecks.md`) stehen. Alle Zahlenwerte sind Startwerte. Erprobt nur an selbst gebauten Decks (`examples/e-flugzeuge/`, `audit/slop-test.js`), nicht an echten Decks. Drei Audits: A1 und A2 im CHANGELOG, Audit 3 in [AUDIT.md](AUDIT.md).

**Nächster Schritt:** Urteil von Max zu den Testdecks `examples/nordmark/` und `examples/norra/`; danach Vortragsdeck (`talk`) nach demselben Ablauf und Test im PowerPoint-Add-in.

## Für eine neue Claude-Session

Zuerst `BRIEF.md` lesen, besonders §10 (nächste Schritte) und §11 (verbindliche Arbeitsregeln), dann `AUDIT.md`, `SKILL.md` und `references/`. Für die Arbeit am Skript den pptx-Skill (`anthropic-skills:pptx`) und bei Bedarf das Impeccable-Plugin installieren. Einstiegsprompt:

> Lies BRIEF.md, besonders §10 und §11, und AUDIT.md. Arbeite am nächsten offenen Schritt aus BRIEF §10.

Liegen die Dateien im Repo nicht im Wurzelverzeichnis, den Pfad ergänzen.

## Prüfskript

```
python3 scripts/check_deck.py deck.pptx --profile read|talk|pitch|update [--exempt 1,9] [--lang auto|en|de] [--compact]
python3 scripts/check_deck.py deck.pptx --plan deck-plan.md          # Plan gegen sich selbst und Deck gegen Plan (Prüfpunkt 12)
python3 scripts/check_deck.py deck.pptx --profile read --derive-plan  # Plan aus einem Deck ohne Plan ableiten
python3 scripts/check_deck.py deck.pptx --profile read --render [--render-dir out/]  # LibreOffice: Überlauf, Titelzeilen, fehlender Text, PNG je Folie
python3 tests/test_check_deck.py
```

Nur Python-Standardbibliothek. Ausgabe: JSON pro Folie und für das Deck, jeder Prüfpunkt mit Nummer aus `rules-core.md`, Methode, Status (`pass`, `fail`, `observation`, `not_measured`) und Herkunft des Werts. Exit-Code 1 bei mindestens einem `fail`. **Planabgleich:** `--plan` liest `deck-plan.md` nach der Vorlage in `references/deck-plan.md` (Zeilen `Label: Wert`, Rollentabelle `role | family | weight | size pt | colour | use`, Folientabelle `No. | Layout type | Claim title | ... | Exhibit | Source | ...`, Hexwerte mit Rollenwort in der Palette-Zeile, Rand in `Grid and spacing`). Was sich nicht lesen lässt, wird `not_measured` mit Grund. Waivers werden erkannt, wenn Schriftname oder Hexwert im Waiver-Text vorkommt (Status `waived`). **Renderprüfung** (`--render`, braucht LibreOffice und poppler): exportiert per LibreOffice als PDF und liest die Wortpositionen. Meldet Wörter außerhalb ihres Textfelds oder der Folie, die gerenderte Zeilenzahl der Titel, Text der in der Datei steht aber nicht im PDF, und welche Schriften tatsächlich gezeichnet wurden. Ergebnisse sind Beobachtungen, nie Pass/Fail. **Detektor** (`scripts/detect.py`, Prüfpunkt 9, seit 0.11): erkennt typische KI-Muster aus Geometrie, Füllung, Umriss und Text der Formen, übertragen von Impeccables Detektorregeln: Karten in Karten, Kartenraster, Icon-Kacheln über Überschriften, Kennzahl-Reihen, Randstreifen, dicke Ränder an abgerundeten Boxen, Kicker, 01/02-Nummern, Buzzwords, Fragetitel, Blocksatz, zentrierter oder versaler Fließtext, gesperrter Fließtext, Bilder aus vielen Einzelformen, dazu auf Deckebene ein Grund in Violett-Blau, Creme oder Dunkelnavy. Jeder Befund nennt die Regel-ID in eckigen Klammern; steht die ID im Waivers-Feld des Plans, wird er `waived`. Als PNG eingebettete Bilder sieht der Detektor nicht. Grenzen: kein Abstandsraster, Farbtransformationen `tint`, `shade`, `satMod` nur genähert, Darstellung nur so gut wie die Schriftübereinstimmung (Arial, Calibri, Cambria, Times New Roman, Courier New sind in LibreOffice metrisch gleich ersetzt, Bookman Old Style und Century Schoolbook sind ungetestet).

## Inhalt
- `scripts/check_deck.py`, `scripts/plan.py`, `scripts/render.py`, `scripts/detect.py`: Prüfskript, Plan-, Render- und Detektor-Modul
- `AUDIT.md`, `audit/`: Audit 3 (Ziel, Befunde, Empfehlungen) und das absichtlich gebaute KI-Testdeck
- `examples/e-flugzeuge/`: vier Beispieldecks (je Profil eines) mit Plan, Bauskript, Bericht und Renderings
- `tests/`: Tests (`test_check_deck.py`), Testdecks (`fixtures/`, gebaut mit `make_fixtures.js` und pptxgenjs, darunter `slop.pptx` mit KI-Mustern)
- `BRIEF.md`: Projektbeschreibung und Übergabedokument
- `SKILL.md`: Ablauf und harte Grenzen
- `references/direction.md`: Look mit dem Nutzer erarbeiten (Fragen, Szene, Mechanismus, gerenderte Entwürfe zur Auswahl, Selbsttest gegen AI-Looks, Abschlussprüfung)
- `references/deck-plan.md`: Vorlage für den Deck-Plan, der vor dem Bauen entsteht
- `references/patterns.md`: 14 Folienmuster (Zonen, Raster, Textbudget je Zone), belegt mit echten Beratungsdecks
- `research/beratungsdecks.md`: Recherche zu 9 echten Decks (Quellen, Messwerte, Beobachtungen mit Seitenangaben)
- `examples/patterns/`: Testbau aller Muster (gerendert und geprüft)
- `examples/nordmark/`: erster kompletter Lauf des Ablaufs (Brief, Skelett, drei Entwürfe, Wahl, Deck, Prüfung, Plan as built)
- `examples/norra/`: Pitch mit gepinntem Stil „Liquid Glass“ (drei Entwürfe, Mischung, Waiver, 14 Folien)
- `references/rules-core.md`: Kernregeln und Prüfliste
- `references/profiles.md`: Kontextprofile `read`, `talk`, `pitch`, `update` mit Werte-Tabelle
- `CHANGELOG.md`: Änderungen je Audit-Befund
- `references/refuse.md`: typische AI-Reflexe, die vermieden werden
- `references/commands.md`: Modi (audit, critique, polish, distill, typeset, layout, clarify, bolder, quieter)

## Quellen
- Impeccable (craft-floor, typeset, critique, audit, polish, distill), auf Folien übertragen
- Consulting-Regeln nach Deckary: https://deckary.com/blog/consulting-slide-standards (Blog, keine offiziellen Firmenrichtlinien)
- Apple-/Jobs-Regeln nach Presentation Zen und Forbes (Sekundärquellen)

## Offen
- Füllgrad und Werte für `talk`, `pitch`, `update` an echten Decks dieser Art kalibrieren
- Prüfskript: Abstandsraster, Test an echten Decks
- Lizenz
