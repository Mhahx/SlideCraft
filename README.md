# slide-craft

Regelwerk und Qualitätsprozess für Präsentationsfolien (pptx), gedacht als Claude-Skill neben dem pptx-Skill.

**Stand: Entwurf 0.10 (status: draft), Prüfskript mit Planabgleich und Renderprüfung, vier bildgeführte Beispieldecks, Regeln weiter ungetestet an echten Decks.** Alle Zahlenwerte sind Startwerte und müssen an echten Decks kalibriert werden. Änderungen seit 0.1: siehe [CHANGELOG.md](CHANGELOG.md). Skill-Dateien sind englisch, Projektdokumente deutsch.

Ziel, Umfang, Entscheidungen, nächste Schritte und die verbindlichen Arbeitsregeln (§11) stehen in [BRIEF.md](BRIEF.md). Dort zuerst lesen.

## Worum es geht

**Problem:** Von Claude erzeugte Folien (.pptx) sind sofort als KI erkennbar: Kartenraster mit Icons, Verläufe, unbedachte Standardschriften, überladene Bullet-Listen, austauschbare Titel wie "Überblick". Für Websites löst das Impeccable-Plugin dieses Problem. Für Folien gibt es nichts Vergleichbares. Der pptx-Skill regelt vor allem die Dateimechanik, und sein Abschnitt "Design Ideas" empfiehlt teils genau die Muster, die wir vermeiden wollen.

**Idee:** Ein Claude-Skill (`slide-craft`), der das Standardergebnis bei Folien dauerhaft anhebt, ohne dass Nutzer Gestaltungswissen brauchen (Zielgruppe: etwa 600 Nutzer). Er ergänzt den pptx-Skill und ersetzt ihn nicht. Für Gestaltung und Inhalt gilt slide-craft, aus dem pptx-Skill nur die Technik.

**Wie er arbeitet:**
1. Eine Rückfragerunde (Zweck, Situation, was würde falsch wirken).
2. Ein Profil wählen: `read` (Lesedokument, Vorbild McKinsey/BCG/Bain), `talk` (Vortrag, Vorbild Apple/Jobs), `pitch`, `update`.
3. Designrichtung aus der Welt des Publikums ableiten: standardmäßig 2 bis 3 Richtungen zur Auswahl, mit Selbsttest gegen typische AI-Looks (aus Impeccable übertragen).
4. Story: alle Folientitel als Aussagesätze. Der Titelstrang muss die Argumentation allein tragen.
5. Deck-Plan schreiben (Brief, Richtung, Story, Designsystem mit Textarten, Palette, Raster, Layouttypen, Folientabelle), bevor eine Folie gebaut wird.
6. Bauen, dann in einem gebündelten Durchgang prüfen. Danach ein frischer Reviewer ohne Bauverlauf und der Plan "as built".

**Kernprinzipien:** Regeln statt Stil-Themes. Messbarkeit: Als bestanden oder nicht bestanden gilt nur, was aus der Datei gelesen, berechnet oder per Skript gemessen wird. Vom Nutzer Festgelegtes (Marke, Vorlage) gewinnt und wird im Plan als Waiver geführt.

## Stand (Version 0.5, status: draft)

Konzept und Regelwerk stehen, aber **nichts davon ist getestet**. Alle Zahlenwerte sind Startwerte. Das Prüfskript `scripts/check_deck.py` existiert seit 0.6, der Planabgleich seit 0.7, die Renderprüfung seit 0.8 (siehe unten), es wurde aber noch kein Deck mit dem Skill gebaut. Der Skill wurde zweimal statisch auditiert. Die Änderungen stehen im CHANGELOG, die Audit-IDs heißen A1 und A2.

**Nächster Schritt:** Kalibrierung an echten Decks (bisher nur vier selbst gebaute Beispieldecks in `examples/e-flugzeuge/`, siehe dort die Befunde zu Grenzwerten und fehlenden Kompositionsregeln) nach dem Evaluationsdesign in BRIEF §5, Kalibrierung, Validierung und Verpackung mit `quick_validate.py` und `package_skill.py`.

## Für eine neue Claude-Session

Zuerst `BRIEF.md` lesen, besonders §11 (verbindliche Arbeitsregeln, unter anderem Feature-Stopp bis das Prüfskript existiert), dann `SKILL.md` und `references/`. Für die Arbeit am Skript den pptx-Skill (`anthropic-skills:pptx`) und bei Bedarf das Impeccable-Plugin installieren. Einstiegsprompt:

> Lies BRIEF.md, besonders §11, und arbeite am Prüfskript aus §10 Schritt 1. Beachte den Feature-Stopp.

Liegen die Dateien im Repo nicht im Wurzelverzeichnis, den Pfad ergänzen.

## Prüfskript

```
python3 scripts/check_deck.py deck.pptx --profile read|talk|pitch|update [--exempt 1,9] [--lang auto|en|de] [--compact]
python3 scripts/check_deck.py deck.pptx --plan deck-plan.md          # Plan gegen sich selbst und Deck gegen Plan (Prüfpunkt 12)
python3 scripts/check_deck.py deck.pptx --profile read --derive-plan  # Plan aus einem Deck ohne Plan ableiten
python3 scripts/check_deck.py deck.pptx --profile read --render [--render-dir out/]  # LibreOffice: Überlauf, Titelzeilen, fehlender Text, PNG je Folie
python3 tests/test_check_deck.py
```

Nur Python-Standardbibliothek. Ausgabe: JSON pro Folie und für das Deck, jeder Prüfpunkt mit Nummer aus `rules-core.md`, Methode, Status (`pass`, `fail`, `observation`, `not_measured`) und Herkunft des Werts. Exit-Code 1 bei mindestens einem `fail`. **Planabgleich:** `--plan` liest `deck-plan.md` nach der Vorlage in `references/deck-plan.md` (Zeilen `Label: Wert`, Rollentabelle `role | family | weight | size pt | colour | use`, Folientabelle `No. | Layout type | Claim title | ... | Exhibit | Source | ...`, Hexwerte mit Rollenwort in der Palette-Zeile, Rand in `Grid and spacing`). Was sich nicht lesen lässt, wird `not_measured` mit Grund. Waivers werden erkannt, wenn Schriftname oder Hexwert im Waiver-Text vorkommt (Status `waived`). **Renderprüfung** (`--render`, braucht LibreOffice und poppler): exportiert per LibreOffice als PDF und liest die Wortpositionen. Meldet Wörter außerhalb ihres Textfelds oder der Folie, die gerenderte Zeilenzahl der Titel, Text der in der Datei steht aber nicht im PDF, und welche Schriften tatsächlich gezeichnet wurden. Ergebnisse sind Beobachtungen, nie Pass/Fail. Grenzen: kein Abstandsraster, Farbtransformationen `tint`, `shade`, `satMod` nur genähert, Darstellung nur so gut wie die Schriftübereinstimmung (Arial, Calibri, Cambria, Times New Roman, Courier New sind in LibreOffice metrisch gleich ersetzt, Bookman Old Style und Century Schoolbook sind ungetestet).

## Inhalt
- `scripts/check_deck.py`, `scripts/plan.py`, `scripts/render.py`: Prüfskript, Plan- und Render-Modul
- `examples/e-flugzeuge/`: vier Beispieldecks (je Profil eines) mit Plan, Bauskript, Bericht und Renderings
- `tests/`: Tests (`test_check_deck.py`), Testdecks (`fixtures/`, gebaut mit `make_fixtures.js` und pptxgenjs)
- `BRIEF.md`: Projektbeschreibung und Übergabedokument
- `SKILL.md`: Ablauf und harte Grenzen
- `references/direction.md`: Ableitung der Designrichtung (Szene, Mechanismus, Quick/Choice, Selbsttest gegen AI-Looks, Abschlussprüfung)
- `references/deck-plan.md`: Vorlage für den Deck-Plan, der vor dem Bauen entsteht
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
- Prüfskript: Abstandsraster, Test an echten Decks
- Testdecks pro Profil
- Lizenz
