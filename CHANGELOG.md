# Changelog

Es gibt zwei statische Audits vom 2026-09-25, beide mit den IDs K1, H1 usw. Zur Unterscheidung heißen die IDs des ersten Audits **A1** (in den Abschnitten 0.2 und darunter ohne Präfix aufgeführt) und die des zweiten **A2-** (Präfix, ab 0.5). Die Prüfpunkt-Nummern in `rules-core.md` sind maßgeblich: Der Planabgleich war in 0.3 Punkt 10 und ist seit 0.5 Punkt 12.

## 0.8-draft (2026-09-25)

Renderprüfung im Prüfskript (BRIEF §10 Schritt 1). LibreOffice 26.8 und poppler sind auf dem Entwicklungsrechner jetzt installiert, das Werkzeug-Fehlen aus 0.5 bis 0.7 entfällt für diese Rechnung. Neues Testergebnis im Sinne von §11 Regel 9: 44 Tests (12 neu), davon 5 mit echtem LibreOffice-Lauf.

**Neu** (`scripts/render.py`, Aufruf `check_deck.py --render [--render-dir DIR]`): PDF-Export per LibreOffice mit eigenem Profilordner (kein Konflikt mit einem laufenden LibreOffice), Wortpositionen per `pdftotext -bbox`, Schriftliste per `pdffonts`, optional ein PNG je Folie für den frischen Reviewer. Ausgabe je Folie: Wörter, die in keinem Textfeld und nicht auf der Folie liegen (Überlauf), gerenderte Zeilenzahl des Titels, Text der in der Datei steht aber nicht im PDF. Deckweit: welche Schrift tatsächlich gezeichnet wurde und ob deren Zeichenbreiten gleich sind. Alles ist eine `observation` (Regel: Renderschätzung ist keine Schwelle) und ersetzt die 0,5-em-Schätzung, die ohne `--render` als Rückfall bleibt. Ohne LibreOffice meldet das Skript `not_measured` mit Grund.

| Befund | Änderung |
|---|---|
| T-6 | LibreOffice ersetzt Arial durch Liberation Sans, Calibri durch Carlito und Cambria durch Caladea. Diese Ersatzschriften haben dieselben Zeichenbreiten, Umbrüche und Überlauf stimmen also für diese drei (und Times New Roman, Courier New über Liberation Serif und Mono, nur die ersten drei wurden gelaufen). Für Bookman Old Style und Century Schoolbook der Safe-Liste gibt es keinen Ersatz im Paket: ungetestet, das Skript meldet sie als unzuverlässig, sobald die Schrift nicht gezeichnet wird. Das schließt eine offene Frage aus rules-core.md nicht, es zeigt nur, dass zwei der sieben Safe-Schriften nicht per Render prüfbar sind. |
| T-7 | Ein Wort mit Bindestrich wird am Zeilenende getrennt ("twenty-" und "six"). Der erste Vergleich "Text fehlt" meldete das fälschlich. Tokens werden jetzt an Leerraum und Bindestrichen getrennt. |
| T-8 | Titelzeilen ließen sich nicht messen, wenn der Titel Zeichen ohne Buchstaben enthielt (`12 %`), weil ich solche Tokens vorher verwarf. Behoben. |
| T-9 | Der Überlauf-Test zählt Wörter ohne Textfeld. Ein Textfeld mit `spAutoFit` wächst mit seinem Text, die gespeicherte Höhe ist veraltet. Solche Felder gelten deshalb bis zum Folienrand als Behälter. |

**Tests:** Auswertung an erfundenen Seitendaten ohne LibreOffice (Überlauf, Seitenrand, Skalierung, Bindestrichumbruch, fehlender Text, spAutoFit, Titelzeilen, Schriftbericht, fehlender Renderer) und Ende-zu-Ende mit echtem LibreOffice an vier Testdecks (gutes Deck ohne Überlauf, Überlauf-Deck mit 29 Streuwörtern und drei Titelzeilen, Deck mit nicht vorhandener Schrift, PNG-Export). Mutationsprüfung von Hand: neun gezielte Änderungen an `render.py` und `check_deck.py`. Zwei überlebten zunächst (der `spAutoFit`-Zweig und die Erkennung von Wörtern außerhalb der Folie), dafür kamen eigene Tests dazu, danach werden alle erkannt.

**Grenzen:** (1) Die Prüfung ist nur so gut wie die Schriftübereinstimmung, siehe T-6. (2) Texte in Bildern und Diagrammen zählen nicht als Streuwörter, wenn sie in einem Diagramm-Rahmen liegen. (3) Ein Wort, das zufällig im Textfeld eines anderen Feldes landet, wird als "im Feld" gezählt. Das ist zu selten, um es auszuschließen, aber möglich. (4) Nur getestet an eigenen Decks. Echte PowerPoint-Decks mit Master-Platzhaltern, Tabellenstilen und eingebetteten Schriften fehlen weiterhin.

## 0.7-draft (2026-09-25)

Planabgleich im Prüfskript (BRIEF §10 Schritt 1, Prüfpunkt 12). Neues Testergebnis im Sinne von §11 Regel 9: 32 automatisierte Tests (11 neu). Kein neues Regelwerk und keine Änderung an `deck-plan.md`: Das Skript liest die bestehende Vorlage.

**Neu** (`scripts/plan.py`, Aufruf über `check_deck.py`):
- `--plan deck-plan.md`: liest den Plan und prüft (a) **den Plan gegen sich selbst** nach den Konsistenzprüfungen in `deck-plan.md` (Rollengrößen gegen Profilgrenzen, Faktor 1,25 zwischen Rollengrößen, höchstens 1 Akzent und 1 Signalfarbe, berechneter Kontrast Rollenfarbe gegen Hintergrund, Layouttypen der Folientabelle, Quelle in Datenfolien-Zeilen, Profil gleich Lauf) und (b) **das Deck gegen den Plan**: Folienzahl, Titelwortlaut, Schriftfamilien, jede Textgröße ist eine Rollengröße, Fettdruck gegen Rollengewicht, jede verwendete Farbe steht in der Palette, kleinster Randabstand gegen Planrand, Layoutname gegen Layouttyp. Verstöße sind Befunde. Waivers (Schriftname oder Hexwert im Waiver-Text) ergeben den Status `waived`.
- `--derive-plan`: schreibt aus einem Deck ohne Plan die messbaren Teile eines Plans (Schriften, Rollentabelle, Palette, Rand, Layouts, Titelstrang, Folientabelle). Rollennamen außer `title` und `footnote/source` sind Platzhalter (`text-18pt`), Direktion und Story bleiben leer. Das setzt die Regel in `deck-plan.md` um, dass ein bestehendes Deck zuerst einen abgeleiteten Plan bekommt.
- Nicht lesbare Planteile werden `not_measured` mit Grund gemeldet, nie geraten.

**Was beim Bauen auffiel:**

| Befund | Änderung |
|---|---|
| T-4 | Der Rundlauftest (aus Deck A einen Plan ableiten, Deck A dagegen prüfen) hat drei Fehler im Skript gezeigt: reine Buchstaben-Hexwerte wie `FFFFFF` wurden beim Einlesen der Palette verworfen, Diagrammtext fehlte im abgeleiteten Plan, und mein "gutes" Testdeck verletzte selbst den Faktor 1,25 (16 und 18 pt, Diagramm-Standard 12 pt neben 10 pt Quelle). Skript und Testdeck korrigiert. |
| T-5 | Ein Plan-Check meldete 16/18 pt und 10/12 pt zu Recht als Verstoß gegen die 1,25-Regel. Ohne Plan waren diese Werte nur Beobachtung, weil die Rollen fehlten. Mit Plan sind sie Pass/Fail. |

**Tests:** Parser (Vorlagenformat, fette Labels und Aufzählungen, unlesbarer Plan), Übereinstimmung ohne Befund, Rundlauf über die abgeleitete Datei (auch als committete Datei `tests/fixtures/good-plan.md`), sieben gezielte Abweichungen (Titel, Schrift, Größe, Gewicht, Palette, Rand, Folienzahl), sechs Selbstprüfungen, Waiver, Profilkonflikt. Mutationsprüfung von Hand: 15 gezielte Änderungen an `plan.py`, alle werden von mindestens einem Test erkannt.

**Grenzen:** (1) Layouts werden nur über den Namen verglichen, und Dateien aus pptxgenjs nennen ihre Layouts nicht wie die Plantypen, daher ist das nur eine Beobachtung. (2) Die Zeile `Fonts:` im Plan ist Freitext und wird nicht gelesen, Schriften kommen aus der Rollentabelle. (3) Rollengewichte kennt PowerPoint nur als fett oder nicht fett, "medium" und "light" zählen als nicht fett. (4) Größenbereiche in der Rollentabelle ("24-28") werden nicht ausgewertet, es zählt die erste Zahl. (5) Getestet an Plänen, die ich nach der Vorlage geschrieben habe, und an abgeleiteten Plänen, nicht an Plänen, die ein anderes Modell in einer echten Sitzung schreibt. Das Format, in dem Claude die Vorlage ausfüllt, ist der wahrscheinlichste Bruchpunkt. (6) Es gab weiterhin keine echten Decks der Zielgruppe.

## 0.6-draft (2026-09-25)

Prüfskript in erster Fassung (BRIEF §10 Schritt 1). Neues Testergebnis im Sinne von §11 Regel 9: 21 automatisierte Tests, davon zwei gebaute Testdecks (pptxgenjs) und handgebautes OOXML. Kein neues Regelwerk, nur ein Fehler korrigiert (siehe unten).

**Was das Skript misst** (`scripts/check_deck.py`, nur Python-Standardbibliothek, JSON pro Folie und Deck, jeder Wert mit Methode und Herkunft): Schriftgrößen, -familien und Farben mit Vererbung (Lauf, Shape, Layout, Master, Standardstil, Theme, `normAutofit`-Skalierung), Geometrie mit Platzhalter-Vererbung und Gruppentransformation, Titel und Wortgrenze, Wörter und Zeichen je Folie (ohne Quellzeile, Seitenzahl), Füllgrad (Vereinigung der Bounding-Boxen), Ränder, Kontrast nach WCAG mit aufgelösten Themefarben, Diagrammfarben (1.4.11), Farbregel (Farbtonfamilien), Quelle und Jahr auf Datenfolien, Alt-Text, Lesereihenfolge, erkennbare Refuse-Punkte (Verlauf, Schatten, 3D, Emoji), Position wiederkehrender Platzhalter.

**Was es nicht misst** (wird als `not_measured` oder `observation` ausgegeben, nie als Pass/Fail): Rendern und Überlauf (nur Schätzung mit 0,5 em, auf diesem Rechner fehlt LibreOffice), optische Ausrichtung, Abstandsraster 8 pt, Planabgleich (Prüfpunkt 12), Urteilspunkte 10 und 11, Rollen (Body gegen Label sind ohne Plan nicht unterscheidbar, deshalb sind Größen zwischen Footnote- und Body-Minimum nur Beobachtung), Theme-Füllstile (`bgRef`, `fillRef`).

| Befund | Datei | Änderung |
|---|---|---|
| T-1 | rules-core.md | **Fehlerkorrektur:** `959595` auf Weiß ist 2,995:1 und erreicht 3:1 nicht (WCAG erlaubt kein Runden). Das hellste Grau, das besteht, ist `949494` (3,03:1). Regel und Prüfung nennen jetzt `949494`. Der Wert stand als "959595 (3,0:1)" in 0.5 und in A2-H6. |
| T-2 | scripts/check_deck.py | pptxgenjs schreibt bei Bildern ohne `altText` den Dateipfad als Alt-Text. Ein Test auf "nicht leer" würde das als bestanden werten. Dateinamen und generische Bezeichnungen ("Image 1", "Bild 2") gelten deshalb als fehlender Alt-Text. Ob ein vorhandener Alt-Text den Inhalt beschreibt, bleibt ein Urteil. |
| T-3 | rules-core.md | Prüfpunkt-Tabelle: Füllgrad ist jetzt `script`, optische Ausrichtung weiter "nicht gemessen". |

**Tests** (`python3 tests/test_check_deck.py`): Kontrast gegen bekannte Werte (D9D9D9, BFBFBF, A6A6A6, 949494), Themefarben gegen die veröffentlichten Office-Farbfelder (Akzent 1 mit lumMod 75 % = 2F5597, 60/40 = 8FAADC, 20/80 = DAE3F3), Vererbung aus dem Master, keine erfundenen Größen bei fehlenden Angaben, Gruppentransformation, Rand- und Grundfläche, Textschwellen 4,5 und 3:1 (14 pt fett zählt als groß), deutsches Zeichenlimit, Ausnahmefolien, Profil ändert Schwellen. Das schlechte Testdeck muss **genau** die absichtlich eingebauten elf Verstöße melden, das gute keinen. Mutationsprüfung von Hand: 13 gezielte Änderungen am Skript, alle bis auf eine (äquivalent, doppelt abgesicherter Bildzweig) lassen mindestens einen Test scheitern. Zwei Lücken, die dabei sichtbar wurden (Randgrenze, Textschwelle 4,5), sind mit eigenen Tests geschlossen.

**Grenzen der Tests:** Die Decks stammen aus pptxgenjs und aus handgebautem OOXML. Sie wurden nicht in PowerPoint geöffnet. Es fehlen echte Decks mit komplexen Themes, Folienmastern, Tabellenstilen und eingebetteten Diagrammen, daher ist die Kalibrierung an echten Decks (BRIEF §10 Schritt 3) der nächste echte Test. Die Schwellen im Skript sind eine Kopie aus `profiles.md` und `rules-core.md` (Konsistenz nur per Test der Beispiele, nicht automatisch).

## 0.5-draft (2026-09-25)

Bereinigung nach Audit A2. Kein neues Feature. Es konnte auf diesem Rechner kein Testdeck gebaut werden (kein Node, Python nur als Store-Platzhalter). Belegt wurde durch Rechnung: Grautöne-Kontrast (D9D9D9 1,41:1, BFBFBF 1,84:1, A6A6A6 2,43:1, 959595 3,0:1), Satzspiegel bei 0,667 in Rand (74 %), Zeilenkapazität der Titel (Schätzung, nicht gemessen).

| ID | Datei | Änderung |
|---|---|---|
| A2-K1 | rules-core.md, commands.md, SKILL.md, BRIEF.md | Nur aus Datei gelesene, berechnete oder per Skript gemessene Punkte sind Pass/Fail. Renderschätzungen und Urteile sind Beobachtungen, fehlende Skriptmessungen "nicht gemessen". Jeder Prüfpunkt trägt seine Methode. Das Prüfskript gehört nach `scripts/` (offen). |
| A2-H1 | profiles.md, rules-core.md | Titel-Wortgrenze pro Profil (`talk` 8, `pitch` 10, `read`/`update` 15), gekoppelt an "höchstens 2 Zeilen" per Zeilenkapazitäts-Schätzung. "Words per slide" und "Fill" im Glossar definiert (Titel zählt mit, Quellzeile, Seitenzahl und Notizen nicht, Vollbild-Bilder sind Grund). Zeichenlimit für deutsche Texte (N2). |
| A2-H2 | direction.md, SKILL.md, BRIEF.md | Entschieden (Max): Choice bleibt Standard, Quick nicht. Quick nur bei ausdrücklicher Übergabe oder gut festgelegtem Brief mit höchstens 10 Folien. Vorher unscharfe Schwellen ("long", "high stakes") ersetzt. Fragen und Richtungen werden in einer Nachricht gebündelt, wenn der Brief es zulässt. Kosten (Rückfragen, Tokens, Zeit) stehen im Evaluationsdesign. |
| A2-H3 | SKILL.md, BRIEF.md | Fallback ohne Subagents als Selbstprüfung benannt, Urteilspunkte nicht als Pass/Fail. Unabhängigkeit in die Evaluation verlagert. |
| A2-H4 | SKILL.md, rules-core.md | Description eingegrenzt: Erstellen, Umbauen, Gestaltungsprüfung. Lesen, Extrahieren und Konvertieren ausgeschlossen, Datei-Werkzeug muss mitgeladen werden. Slides-Artefakttyp in der Umgebungstabelle (mit "to verify"). |
| A2-H5 | SKILL.md, deck-plan.md, rules-core.md | Waivers: vorgegebene Marken- und Vorlagenwerte werden im Plan festgehalten, Checks berichten "waived by brief". Kontrast- und Barrierefreiheitsminimum nur auf ausdrückliche Anweisung. |
| A2-H6 | rules-core.md | Nicht-Text-Kontrast (WCAG 1.4.11): Diagrammelemente mit Bedeutung mindestens 3:1, Neutralgrau auf Weiß mindestens 959595. Regel für mehrere Datenreihen. |
| A2-H7 | BRIEF.md §5 | Evaluationsdesign geschärft: 5 Läufe, mindestens 3 Bewerter, "KI erkannt", "präsentierbar" und Präferenz getrennt, Streuungskennzahl, Modi-, Vorlagen- und Sprachfälle, Kosten (Rückfragen, Tokens, Zeit). |
| A2-M1 | rules-core.md, profiles.md | Rand 0,667 in (48 pt, Vielfaches von 8), Satzspiegel 74 %. Schwellen nur in rules-core.md und profiles.md, BRIEF verweist. |
| A2-M2 | rules-core.md | Provenance-Tabelle: jede Regelgruppe mit Tag (belegt, Praktiker, übertragen, Startwert). Minto als Primärquelle vorgemerkt, Seiten offen. |
| A2-M3 | rules-core.md | Neuer Prüfpunkt 8: Barrierefreiheit (Titel, Lesereihenfolge, Alt-Text), aus der Datei lesbar. |
| A2-M4 | SKILL.md, direction.md | Rückfragerunde nur an einer Stelle beschrieben. Standardwerte benannt (Restrained für `read`/`update`, Standing exit), sonst keine unbedachten Defaults. |
| A2-M5 | refuse.md | Liste in "Detectable" (Pass/Fail) und "Judgement" (Beobachtung) getrennt. Tracker (Status oder Kapitelposition) erlaubt, Kicker verboten, beides im Glossar definiert. |
| A2-M6 | rules-core.md | Glossar: Fill, Words per slide, Signalfarbe (nicht Akzent, nicht Statusfarbe), Schriftstärken, Ausnahmefolien (Inhaltsfolie nur ab 15 Folien, Anhang-Inhalt nicht ausgenommen). |
| A2-M7 | rules-core.md | Serifen-Titel nicht mehr als Default. Differenzierung über Größe, Raster, Farbe. Verfügbarkeit von Bookman und Century Schoolbook auf Mac und Zielrechnern als "zu verifizieren". |
| A2-M8 | CHANGELOG.md, BRIEF.md | ID-Kollision der beiden Audits aufgelöst (A1 und A2), Prüfpunkt-Nummer geklärt. |
| A2-N1 | rules-core.md | WCAG 2.2 zitiert, Übertragung der pt-Werte auf Projektion als Näherung benannt. |
| A2-N2 | profiles.md | Zeichenlimits pro Profil für deutsche Texte. |
| Status | SKILL.md | `metadata.status: draft` eingeführt (draft, tested, pilot). |

Von Max freigegeben und in BRIEF.md §11 festgehalten: die Arbeitsregeln aus Audit A2 (Evidenz vor Features, Herkunft je Regel, Pass/Fail nur bei Skriptmessung, Konsistenzprüfung, Versionierung). Entscheidung 2 (`talk`-Titel bis 8 Wörter) ist in profiles.md umgesetzt.

Hinweis zur Versionierung: 0.5 ist eine Bereinigungsversion ohne neues Testergebnis (Regel 9, Bereinigungsfall). Das Testergebnis ist nur die Rechnung oben, kein gebautes Deck. Die Audit-Texte liegen dem Paket nicht bei.

## 0.4-draft (2026-09-25)

Claude gestaltet die Designrichtung aktiv mit, nach Impeccables Vorbild (`new-work.md`, `shape.md`, `init.md`).

| Datei | Änderung |
|---|---|
| references/direction.md (neu) | Ablauf: Was ist schon wahr, Rückfragen (2 bis 3, eine Runde, keine Hex-/Font-/Stil-Menü-Fragen), Szene-Satz, Mechanismus, 5 bis 7 visuelle Welten des Publikums, Richtungen, Quick/Choice, fester Ausgang, Farbstrategie, Tabelle Vibe-Wörter zu Entscheidungen, Selbsttest gegen vier Standard-Looks, Richtungsvertrag mit sechs Blöcken, Abschluss (Capture-Validität, begrenzte Runden, frischer Reviewer mit vier Urteilen, Bericht im Umfang des Urteils, Plan "as built"). |
| references/deck-plan.md | Neuer Abschnitt "Direction", Abschnitt "As built". Plan-Konsistenzprüfung um Richtungsvertrag ergänzt. Warten auf den Nutzer auch im Modus Choice. |
| SKILL.md | Workflow auf acht Schritte: Brief (Kadenz nach Impeccable), Profil, Direction, Story, Plan, Build, Check und Review, Plan as built. Vorrang für vom Nutzer Festgelegtes auch gegenüber der abgeleiteten Richtung. Richtungsvertrag nur im Plan. |
| references/rules-core.md | Prüfpunkt 10: Richtungsvertrag gehalten, Look nicht aus der Kategorie erratbar. |
| references/refuse.md | Verweis auf die vier Standard-Looks. |
| references/commands.md | Refinement erbt den Look, Redesign startet den Richtungsablauf. |
| BRIEF.md | Leistungsumfang, Entscheidungen, Impeccable-Quellen. |

Bewusste Abweichung von Impeccable: Die Farbregel des Kernregelwerks (1 Akzent + höchstens 1 Signalfarbe) gilt weiter. Die Impeccable-Farbstrategie "Full palette" ist deshalb nur bei ausdrücklichem Brief erlaubt.

## 0.3-draft (2026-09-25)

Auf Vorschlag von Max: Vor dem Bauen entsteht ein kohärentes Design-Dokument.

| Datei | Änderung |
|---|---|
| references/deck-plan.md (neu) | Vorlage und Regeln für den Deck-Plan: Brief, Story, deck-weites Designsystem (Schriften, Textarten mit Größen, Palette mit Kontrast, Raster, Layouttypen), Folientabelle, Avoid-Check, Annahmen. Plan-eigene Konsistenzprüfung. |
| SKILL.md | Neuer Workflow-Schritt 4 "Deck plan" vor dem Bauen. Kein Slide vor dem Plan. Plan zeigen und weiterbauen, außer bei Reviewwunsch oder offener Nutzerentscheidung. Bestehende Decks: Plan zuerst aus der Datei ableiten. |
| rules-core.md | Prüfpunkt 10: Deck entspricht dem Plan. |
| commands.md | Alle Modi arbeiten gegen den Plan. Abweichung vom Plan ist ein Befund. |
| BRIEF.md | Plan im Leistungsumfang, als Entscheidung und im Prüfskript-Auftrag. |

## 0.2-draft (2026-09-25)

Alle Befunde wurden vor der Umsetzung geprüft. Bestätigt gegen die Quellen: K1 (pptx-Skill gelesen), H1 (`quick_validate.py`, erlaubte Schlüssel), M1 (W3C WCAG 1.4.3), M2 (pptx-Skill, `LAYOUT_WIDE`), M8 (Deckary ist Anbieter eines KI-Folienwerkzeugs), N3 (Satzspiegel 76 %), N6 (ZIP mit Backslashes). Nicht einzeln nachgeprüft, aber plausibel und umgesetzt: die übrigen.

| ID | Datei | Änderung |
|---|---|---|
| K1 | SKILL.md, BRIEF.md §1 | Vorrangregel gegenüber dem pptx-Skill an den Anfang. Aussage in BRIEF §1 korrigiert. |
| K2 | SKILL.md, rules-core.md | Checks nach Herkunft gekennzeichnet (aus Datei gelesen / berechnet / geschätzt / braucht Skript / Urteil). Harte Regel: nie einen Messwert nennen, der nicht gelesen oder berechnet wurde. Umgebungstabelle (pptx, Claude in PowerPoint, Claude Design). Kontrastmethode (Designfarben auflösen, Scrim-Worst-Case). |
| H1 | SKILL.md | `version` aus dem Frontmatter nach `metadata:` verschoben. |
| H2 | rules-core.md, refuse.md, SKILL.md | Schrifthierarchie: Nutzer-/Markenschrift, sonst Safe-Liste mit bewusster Paarung. Arial-Eintrag in refuse.md auf "ohne bewusste Rollen und Hierarchie" umformuliert. |
| H3 | BRIEF.md | Entschieden: kein Corporate Design vorausgesetzt. Kein Ablaufzweig "mit Vorlage". Vorrang für Nutzervorgaben bleibt als allgemeine Regel. |
| H4 | BRIEF.md §5 | Evaluationsdesign festgelegt (12 Aufgaben, mit/ohne Skill, Blindpaare, Schwellen, Trigger-Tests). |
| H5 | rules-core.md, profiles.md, BRIEF.md | Farbzählung eindeutig: 1 Akzent + höchstens 1 Signalfarbe, Neutrale zählen nicht. Statusfarben als Ausnahme im Profil `update`. |
| H6 | rules-core.md | Ausgenommene Folientypen (Titel, Kapitel, Zitat, Anhang) und Definition "Datenfolie". |
| M1 | rules-core.md | WCAG-Schwelle korrigiert: ab 18 pt oder 14 pt fett, Quelle W3C SC 1.4.3. |
| M2 | SKILL.md, rules-core.md | `LAYOUT_WIDE` (13,33 x 7,5 in) festgelegt, im Abschnitt zu pptx-Werkzeugen. |
| M3 | SKILL.md, commands.md | Harte Grenze präzisiert: Fakten und Werte nie ändern, Formulierung/Kürzung/Format nur im Modus und mit Änderungsliste. |
| M4 | commands.md, SKILL.md | Jeder Modus als read-only, Refinement oder Redesign gekennzeichnet. Umbau von Mastern oder Schriftfamilie = Redesign mit Bestätigung. |
| M5 | profiles.md | Werte-Tabelle mit identischen Spalten für alle vier Profile (Titel, Body, Fußnote, Wortlimit, Füllgrad, Titellänge). |
| M6 | commands.md | critique als Reihenfolge formuliert, getrennter Durchgang nur mit Subagents. |
| M7 | commands.md | Rubrik mit Ankern 0/2/4 für sechs audit-Bereiche. |
| M8 | BRIEF.md §7 | "Konsens" ersetzt durch "nach einer Praktiker-Quelle", Anbieterinteresse genannt, Minto als Primärliteratur vorgemerkt. |
| M9 | SKILL.md, BRIEF.md | Description zweisprachig und offensiver (auch bei "10 Slides zu X" oder nur Dateiname). Trigger-Evals im Evaluationsdesign. Hinweis: Die Warnung von skill-creator vor zu seltenem Auslösen habe ich in der lokalen Version nicht wörtlich gefunden, das Trigger-Eval-Verfahren ist bestätigt. |
| M10 | SKILL.md | Ablauf werkzeugneutral ("with the available slide tool"), pptx-Details in eigenem Abschnitt am Ende. |
| N1 | refuse.md, profiles.md | Status-Marker ("Draft") vs. Kicker abgegrenzt. |
| N2 | profiles.md, refuse.md | Einzelne Kernzahl in `talk` erlaubt, verboten ist das wiederholte Kennzahl-Template mit Label, Nebenzahlen und Akzent. |
| N3 | rules-core.md, profiles.md | Füllgrad auf den Satzspiegel bezogen (Folie minus Ränder, etwa 76 % der Folie), Grenze pro Profil. |
| N4 | rules-core.md | Folien- oder Diagrammtitel trägt die Aussage, nicht beide doppelt. |
| N5 | SKILL.md | Rückfragen in einer Runde gebündelt. |
| N6 | BRIEF.md §10 | Hinweis: nicht mit Windows-Zip packen, sondern mit `package_skill.py`. Das ZIP in dieser Lieferung ist mit Schrägstrichen gebaut. |
| N7 | SKILL.md | Ausgabesprache der Folien folgt dem Nutzer. Vorlage-Fall entschieden (H3). |
| N8 | refuse.md | "Reflex-Dreierlisten" präzisiert, bewusste Dreierstruktur mit Inhalt erlaubt. |
| Sprache | alle Skill-Dateien | Auf Englisch übertragen, Profilnamen englisch (`read`, `talk`, `pitch`, `update`, vorher `lesen`, `vortrag`, `pitch`, `update`). BRIEF und README bleiben deutsch. |

## Offen
- H3 Ablaufzweig "mit Vorlage": nicht nötig (kein Corporate Design vorausgesetzt).
- Validierung und Verpackung: auf dem privaten Rechner (`quick_validate.py`, `package_skill.py`).
- Prüfskript, Testdecks, Kalibrierung der Startwerte.
- Konsistenz: nach der Umsetzung per Textsuche über alle Dateien geprüft (alte Profilnamen, 24-pt-Schwelle, alte Farbzählung, "Konsens"). Treffer korrigiert. Eine inhaltliche Gegenlesung durch ein anderes Modell steht aus.

## 0.1-draft (2026-09-25)
Erster Entwurf.
