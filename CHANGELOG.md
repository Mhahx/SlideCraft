# Changelog

Es gibt zwei statische Audits vom 2026-09-25, beide mit den IDs K1, H1 usw. Zur Unterscheidung heißen die IDs des ersten Audits **A1** (in den Abschnitten 0.2 und darunter ohne Präfix aufgeführt) und die des zweiten **A2-** (Präfix, ab 0.5). Die Prüfpunkt-Nummern in `rules-core.md` sind maßgeblich: Der Planabgleich war in 0.3 Punkt 10 und ist seit 0.5 Punkt 12.

## 0.18-draft (2026-09-25)

Befunde aus dem Blindtest (`examples/blindtest-baeume/`): ein frischer Agent mit einem anderen Modell (Sonnet 5) baute nur mit dem Skill-Paket einen Vortrag (`talk`, 10 Folien, 0 Fail). Alle vier Befunde des Agenten am Code nachgeprüft und bestätigt; dazu drei eigene aus der Durchsicht der Renderings. 88 Tests (5 neu), alle grün; jede Änderung am Skript durch einen Mutationstest abgesichert.

| Befund | Änderung |
|---|---|
| A: `plan.py` las von jeder Bezeichnung nur das erste Vorkommen, ohne Warnung. Eine „Palette:“ bei der Beschreibung einer Richtung verdrängte die echte Palette aus Abschnitt 4 | Designbezeichnungen (Palette, Fonts, Text roles …) kommen aus Abschnitt 4; jede Wiederholung meldet P0 (Beobachtung; Fehler, wenn eine andere Bezeichnung mehrdeutig ist); Abschnitt 7 „As built“ darf wiederholen. Nebenbefund: alle vier E-Flugzeug-Pläne wiederholen „Fonts:“ in „As built“, jetzt ausdrücklich erlaubt |
| B: Budgets je Zone in `patterns.md` widersprachen den Grenzen von `talk` (15 Wörter) und `pitch` (40) | `patterns.md`: Die Grenze des Profils gilt vor den Zonenbudgets; Tabelle mit Budgets für P01, P04, P05, P09, P11, P13, P14 in `talk` und `pitch`; P14 nennt die Zone für eine Grafik |
| C: dekorative Gitternetzlinien verboten (`rules-core.md` §6), aber nicht geprüft | Prüfung 7 „no decorative gridlines“: sichtbare Gitternetzlinien schlagen fehl, wenn die Werte am Diagramm beschriftet sind; ohne Beschriftung sind sie Lesehilfe. Fand sofort einen Fall im eigenen Nordmark-Deck (Folie 3), behoben |
| D: dass nur eine Zeile mit „Quelle:“ oder „Source:“ als Quelle zählt und aus der Wortzahl fällt, stand nirgends | `rules-core.md` §6 beschreibt die Regel und ihre Folgen |
| E: das Skript sah nicht: einen aus Formen gebauten Baum, Einheiten nur in der Quellzeile, dreimal dieselbe Komposition, eine Überlappung | Neuer Punkt 13 der Prüfliste (Sichtprüfung jedes Renderings mit vier Fragen), verankert in `direction.md` (Finish, Schritt 1); das Skript führt ihn als offenen Urteilspunkt im Bericht |

**Grenzen:** Blindtest mit einem Lauf, einem Thema und einem Profil.

## 0.17-draft (2026-09-25)

Installierbar gemacht, für die Ziele Claude (claude.ai), Claude for PowerPoint und Claude Design (Entscheidung Max).

| Änderung | Warum |
|---|---|
| `tools/package.py` baut `dist/slide-craft/` und `dist/slide-craft.zip` mit nur `SKILL.md`, `references/`, `scripts/` (12 Dateien, 73 KB) und prüft Name, Beschreibung, genannte Dateien | das Repo enthält 24 MB Beispiele und Projektdokumente, die nicht in den Skill gehören; claude.ai verlangt den Skill-Ordner als oberste Ebene im ZIP |
| Beschreibung im YAML-Kopf in Anführungszeichen | der offizielle Validator (`skills-ref validate`) lehnte den Kopf ab: „: “ in der Beschreibung ist ungültiges YAML; das hätte den Upload scheitern lassen können. Jetzt: „Valid skill“ |
| `SKILL.md`: Pfad zum Prüfskript auch für claude.ai und die Office-Add-ins (Skill-Ordner wird in die Sandbox kopiert, Pfad relativ zu `SKILL.md`) | bisher nur für Claude Code beschrieben |
| `SKILL.md`: Pfade zu `research/`, `examples/`, `tests/` und BRIEF sind Herkunftsnachweise des Repos, nicht Teil des Skills | im Paket fehlen diese Dateien; ein Modell soll nicht danach suchen |
| README: Abschnitt „Installieren“ mit Stand je Umgebung | Claude Design nutzt laut Anthropic Design-Systeme statt Skills; offiziell unterstützt sind claude.ai, die Office-Add-ins und Claude Code |
| Beschreibung geschärft: lädt vor der ersten Rückfrage zum Deck; nennt Vortrag, Keynote, Vorlesung, Board-Update, Entscheidungsvorlage und das Prüfen einer bestehenden .pptx; schließt Zusammenfassen und Zählen aus. `SKILL.md` Schritt 1: bei schon gestellten Fragen nur die fehlenden Punkte aus Runde 1 nachfragen | Auslösetest (`tests/trigger/`, Claude Code headless, 20 Anfragen): vorher 15 von 20, das Modell stellte bei vier Deck-Anfragen eigene Rückfragen ohne die Frage nach dem Aussehen und lud den Skill nicht; danach in zwei Läufen je 20 von 20 |

## 0.16-draft (2026-09-25)

Zweiter Lauf des Ablaufs mit Max, diesmal mit einem gepinnten Stil: Pitch für ein fiktives Wasserstoffauto („Norra“), „Stil von Apple, hellblau, weiß“, dann „abgerundet Liquid Glass“ (`examples/norra/`). 14 Folien, Profil `pitch`, Deutsch, Musterzahlen. Ergebnis: 0 Fail, 13 waived. 83 Tests (3 neu), alle grün; jede der drei Änderungen durch einen Mutationstest abgesichert.

| Befund aus dem Lauf | Änderung |
|---|---|
| Ein gepinnter Stil (Glas mit Schatten) ließ sich nicht freigeben: die Verbotspunkte Verlauf, Schatten, 3D, Emoji hatten keine ID, das Skript las Waiver nur für Detektorregeln; 14 Fails für einen gewollten Stil | Jeder Verbotspunkt trägt eine ID (`gradient`, `shadow`, `glow`, `soft-edge`, `reflection`, `3d`, `emoji`); eine im Plan genannte ID wird „waived by brief“, alle anderen bleiben Fehler (`check_deck.py`, `refuse.md`) |
| Eine Farbfläche bis zum Folienrand (Band auf der Titelfolie) galt als Randverstoß | Textlose Flächen über die volle Breite oder Höhe, mindestens ein Sechstel tief, zählen als Grund und werden als „bleed“ beobachtet; dünne Balken und Flächen mit Text bleiben Fehler (`check_deck.py`, `rules-core.md` §3) |
| Glas kippt leicht ins Kartenraster | Neue Regel und Detektorregel `glass-stack`: höchstens eine durchscheinende Fläche pro Folie, für den Fokus; Licht dahinter als transparentes PNG mit ausgeblendeten Rändern; Kontrast auf Glas im ungünstigsten Fall (`refuse.md`, Abschnitt „Pinned styles“; `detect.py`); Zeile „Liquid Glass“ in der Tabelle der Stilwörter (`direction.md`) |

Beim Gegenlesen gefunden: Jede ID, die in der Waiver-Zeile vorkommt, gilt als freigegeben, auch in einem Satz wie „glass-stack stays active“. Der Norra-Plan ist umformuliert, `refuse.md` warnt davor.

**Grenzen:** Selbstprüfung desselben Modells; Rendering nur in LibreOffice; das Urteil von Max zum fertigen Deck steht aus.

## 0.15-draft (2026-09-25)

Schritt 5: erster kompletter Lauf des Ablaufs mit Max als Nutzer, fiktives Thema "Regionalbank Nordmark, Filialnetz 42 auf 28" (`examples/nordmark/`). Neues Testergebnis: Deck mit 9 Folien, 0 Fail in 136 Prüfungen einschließlich Planabgleich. 80 Tests (1 neu), alle grün.

**Lauf:** Brief (4 Fragen, Antworten von Max: nüchtern, vertrauenswürdig, Blick nach vorn, dunkles Grün, Landschaftsfotos), Profil `read`, Story-Skelett mit 9 Titeln und 8 Mustern, drei gerenderte Richtungen (A Geschäftsbericht, B Flurkarte, C Weitblick) zusammen mit dem Skelett, Wahl von Max: Titelfolie aus C, Inhaltsfolien aus A. Plan mit Musterungsvarianten und Richtungsvertrag, Bau, Prüfung, Selbstprüfung (ein Befund, behoben), Plan as built. Fotos von Wikimedia Commons (CC BY-SA 4.0) mit Nachweis.

**Fehler im Skill, die der Lauf gefunden hat, behoben:**

| Befund | Änderung |
|---|---|
| Vorlage in `deck-plan.md` zeigte Rollen- und Folientabelle ohne führendes `|`; das Skript liest nur Markdown-Tabellen, ein Plan nach der Vorlage wurde nicht erkannt | Vorlage zeigt jetzt Markdown-Tabellen und nennt das Format |
| Planabgleich fand "Rand 48 pt" nicht | `plan.py` liest auch "Rand" und "Ränder" (neuer Test) |
| Seitenzahl und Quelle im unteren Rand (seit 0.14 erlaubt) ließen "shapes keep the plan margin" fehlschlagen | Fußzeilen-Elemente zählen nicht für den kleinsten Randabstand |
| pptxgenjs zentriert Titel-Platzhalter ohne `align` | Werkzeughinweis in `SKILL.md` |
| Rendering ohne maßgleiche Ersatzschriften zeichnet Calibri und Cambria breiter; Titel wirkten zweizeilig | `SKILL.md`, Abschnitt Check script: Carlito, Caladea, Liberation nötig, sonst ist das Rendering unzuverlässig |
| keine Regel, woher Fotos kommen (AUDIT.md H4) | `rules-core.md` §5: eigene Fotos, genannte Fotos, frei lizenzierte Fotos mit geprüfter Lizenz und Nachweis auf der Folie; Symbolbild benennen; sonst Exhibit oder Typografie |

**Was der Planabgleich im Testdeck fand (Nachweis, dass er trägt):** zu dichte Schriftgrößen (12/14/16, jetzt 11/14/18), fette Texte ohne Rolle, Titelfläche nicht als Hintergrund in der Palette, verborgene Datenbeschriftungen in 12 pt.

**Grenzen:** Selbstprüfung desselben Modells; Rendering nur in LibreOffice; das Urteil von Max zum fertigen Deck steht aus.

## 0.14-draft (2026-09-25)

Schritt 4 aus BRIEF §10 (Werte kalibrieren) für die Lesedecks, freigegeben von Max. Grundlage: die Messwerte aus `research/beratungsdecks.md`. 79 Tests (5 neu), alle grün; alle Beispiel- und Musterdecks neu geprüft, kein Fail.

| Wert | vorher | jetzt | Beleg |
|---|---|---|---|
| Wörter je Folie `read` | 120 (720 Zeichen) | 250 (1.500 Zeichen) | Entscheidung Max; Lesedecks p25–p75 von 130 bis 300 Wörtern |
| Titel `read`, `update` | 24–28 pt | 20–28 pt | Median der Decks 20–25 pt |
| Fußnote und Quelle `read`, `update`, `pitch` | 10 pt | 8 pt | Quellen in allen Decks 7–8 pt |
| Fußzeile | innerhalb 48 pt | Fußnoten, Quelle, Seitenzahl bis 18 pt über der Unterkante | Quellenzeilen bei 482–514 von 540 pt |
| Farben | 1 Akzent + höchstens 1 Signalfarbe | Rollen: Neutrale, 1 Akzent, höchstens ein Signalpaar (positiv/negativ), Abstufungen einer Farbe zählen einmal; Skript erlaubt 3 Farbfamilien | MCK-DC S. 4 (Blauskala plus orange Fokuszeile), BAIN-PE (Rot auf Grau) |

Geändert: `profiles.md`, `rules-core.md` (Glossar, §2, §3, §4, Prüfliste, Provenienz), `deck-plan.md`, `commands.md`, `patterns.md` (Rahmen: Körper bis y 456, Fußzeile y 466–502; Budgets als schlankes Ende, bis 250 Wörter durch mehr Panels, nie durch kleinere Schrift), `check_deck.py` (Profilwerte, Fußzeilen-Rand, Farbrollen), `plan.py` (Plan-Palette mit Signalpaar), Testbau der Muster (Fußzeile neu positioniert).

**Tests:** Der Test mit den absichtlichen Verstößen (`bad.pptx`) erwartet die 8-pt-Fußnote, die 150 Wörter und die drei Farbfamilien nicht mehr als Fehler; dafür prüfen neue Tests die neuen Schwellen (251 Wörter, 7 pt, Fußzeile unter 18 pt, vierte Farbfamilie, Titel ab 20 pt).

**Unverändert, mangels Belegen:** Werte für `talk`, `pitch`, `update` (kein Statusbericht im Korpus, die Bain-Vortragsdecks liegen zwischen `talk` und `pitch`), Füllgrad (bleibt Beobachtung), Körperschrift-Minima.

## 0.13-draft (2026-09-25)

Umsetzung von Audit 4 (`AUDIT-4.md`, IDs hier mit Präfix **A4-**), Empfehlungen 1 bis 3 und A4-H1, freigegeben von Max. 74 Tests (2 neu), alle grün. Alle Beispiel- und Musterdecks neu geprüft: kein Fail.

| Befund | Änderung |
|---|---|
| A4-K1 Look vor Story | Neuer Ablauf in `SKILL.md`: Brief, Profil, **Story-Skelett** (Titel als Aussagen, ein Muster je Folie), dann Richtung mit Entwürfen aus dem Skelett (Titelfolie und Schlüsselfolie mit echtem Titel und echten Zahlen), dann Plan. Entwürfe und Skelett gehen in einer Nachricht an den Nutzer; es bleibt bei zwei Runden. `direction.md`, `deck-plan.md`, README angepasst. |
| A4-K2 Muster gegen Richtungen | `patterns.md`, neuer Abschnitt "What a direction decides": 8 Achsen (Deutung als Linie oder Fläche, Exhibit-Seite, Bildwelt, Dichte, Grund, Titelstimme, Hervorhebung, Strukturmittel), jede mit Belegen aus den echten Decks. Zwei Richtungen unterscheiden sich in mindestens zwei Achsen. Zonen dürfen gespiegelt und um eine Spalte verschoben werden. Plan-Feld `Pattern variants` (auch im Parser). |
| A4-K3 Prüfskript nicht aufrufbar | `SKILL.md`, neuer Abschnitt "Check script": Befehle mit Skill-Pfad, Abhängigkeiten (Python 3; LibreOffice mit Impress und poppler fürs Rendern), Exit-Code, .odp-Weg, Fallback ohne LibreOffice und ohne Codeausführung. Im Skript: Folienvorlagen mit Namen `P01 …` und `P02 …` sind automatisch von den Titelregeln ausgenommen. |
| A4-H1 Füllgrad drängt zum Verkleinern | Füllgrad ist bis zur Kalibrierung eine Beobachtung, kein Fail, mit dem Hinweis, nie ein Exhibit unter seine Musterzone zu verkleinern (`check_deck.py`, `profiles.md`, `rules-core.md`). Entscheidung Max auf Empfehlung. |
| A4-H2 Widersprüche aus 0.12 | `read` erlaubt zwei Ansichten desselben Befunds (P06); Trenner mit Agenda ab 10 Folien, eigenständige Inhaltsfolie ab 15 (`rules-core.md`, `refuse.md`, `patterns.md` einheitlich); Tracker nur `read`/`update`, Statusmarke in jedem Profil; wiederkehrende Positionen gelten je Folienvorlage; native Diagramme, "unless the building tool cannot write the native form". |
| A4-H3 Statusmarke als Kicker | Detektor nimmt Statusmarken aus (rechts oben oder mit Statuswort: Preliminary, Draft, Confidential, Illustrative, Not exhaustive, Vorläufig, Entwurf, Vertraulich u. a.). |
| A4-H4 Grafiken | `refuse.md`: Grafiken, die den Sachverhalt zeigen (Reichweitenring, Streckenkarte, Steigflugprofil wie im von Max gelobten `talk`-Deck), sind erwünscht; nur schmückende Grafiken (Maskottchen, Ornament, Fahrzeug auf der Fortschrittsleiste) werden vermieden. Test: Trägt die Grafik eine Tatsache der Folie? |
| A4-H5 pptxgenjs-Fallen | `SKILL.md`, Werkzeughinweise: eine Folienvorlage je Muster, Hervorhebung über eine Reihe mit Farbe je Punkt, Einheiten und Reihenfolge von `margin`, `lineDash`, Datenbeschriftungen, Grenzen des Validators. |
| A4-M2 Nachvollziehbarkeit | `research/measure.py` (Messskript der Recherche) im Repo; `check.json` aller Beispieldecks mit dem aktuellen Skript neu erzeugt. |

**Geprüft (Arbeitsregel 1):** .odp-Weg ausgeführt (Musterdeck nach .odp und zurück nach .pptx, LibreOffice 24.2): Folienvorlagen-Namen bleiben erhalten, die Alt-Texte der Diagramme gehen verloren; das steht jetzt in `SKILL.md`. Automatische Ausnahme und Statusmarken mit neuen Tests abgesichert, die Ausnahme zusätzlich per Mutation (Test schlägt ohne sie fehl).

**Offen:** Übrige Werte (Wörter je Folie, Fußnoten ab 8 pt, Fußzeile, Farbrollen) nach den Antworten von Max (`AUDIT-4.md` §7, Fragen 1 und 3); ein ganzes Deck nach dem neuen Ablauf mit echten Entwürfen; Detektor prüft Zonenbudgets noch nicht; Zuordnung von Firmenvorlagen-Namen zu Mustern im Plan (A4-M3).

## 0.12-draft (2026-09-25)

Schritt 3 aus BRIEF §10 (Musterbibliothek), freigegeben von Max. Neues Testergebnis: 14 Muster als 17 Folien gebaut, gerendert und geprüft. 72 Tests (3 neu), alle grün.

**Recherche (`research/beratungsdecks.md`):** 9 öffentliche Decks selbst geladen und angesehen, darunter 5 Kundendecks: McKinsey (Transportation in DC 2020, USPS 2010), BCG (NYCHA 2012, NYC Media 2015, Kongress-Unterlagen 2023), Bain (PE Roadshow 2023, Resilience 2020, IABC 2019), Roland Berger (Trend Compendium 2025). Zusammen rund 400 Seiten; per Code gemessen (Titelgröße, Wörter, kleinste Schrift, Quellenzeilen, Positionen), rund 60 Seiten angesehen. Nicht erreichbar: PDFs von `web-assets.bcg.com` und `mckinsey.com` (Bot-Schutz der Server).

**Musterbibliothek (`references/patterns.md`):** P01 cover, P02 divider-agenda, P03 summary, P04 chart-rail, P05 chart-focus, P06 two-exhibits, P07 table, P08 bridge, P09 before-after, P10 numbered-rows, P11 timeline, P12 case, P13 key-numbers, P14 statement. Jedes Muster mit Einsatz, Profilen, Belegen (Deck und Seite), Skizze, Zonen auf dem 12-Spalten-Raster, Textbudget je Zone und Regeln. Dazu der gemeinsame Rahmen (Tracker, Statusmarke, Titel, Messzeile, Körper, Fußnoten und Quelle, Seitenzahl). Eingebunden in `SKILL.md` (Schritte 5 und 6), `deck-plan.md` (Layout type = Muster-ID), `rules-core.md` §3 und `commands.md`.

**Testbau (`examples/patterns/`, Arbeitsregel 1):** `read.pptx` (P01 bis P13) und `talk.pptx` (P01, P05, P13, P14), eine Folienvorlage je Muster, gerendert per LibreOffice. Ergebnis: kein Detektor-Befund außer der gewollten Beobachtung `stat-row` auf P13, kein Textüberlauf. Fails nur beim Füllgrad: `read` P05 und P06 (82 % bei 75 %), `talk` P05, P13, P14 (80, 46, 64 % bei 30 %). Nicht durch Verkleinern umgangen; Entscheidung in Schritt 4.

**Detektor, korrigiert an echten Decks:**

| Befund | Änderung |
|---|---|
| Panels mit Kopfband (MCK-USPS S. 3, 5, 8, 20) wurden als `nested-cards` gemeldet | bündige Kopf- und Fußbänder (volle Breite, höchstens 35 % der Höhe) sind ausgenommen |
| Zeilenbeschriftungen in grauen Feldern (BCG-NYCHA S. 35) hätten `card-grid` ausgelöst | eine Karte braucht mindestens zwei Textelemente |
| Eine ungerahmte Reihe großer Zahlen steht in einem echten Bain-Deck (BAIN-IABC S. 4) | `stat-row` ist nur noch ein Fail, wenn die Zahlen in Boxen stehen, sonst eine Beobachtung |

**Prüfskript:** Prüfpunkt 4 ("wiederkehrende Platzhalter an derselben Position") vergleicht jetzt je Folienvorlage statt über das ganze Deck; vorher meldete er das Statement-Muster (Titel unter dem Fotostreifen) als Abweichung.

**Beim Testbau gefundene eigene Fehler, behoben:** Grau 949494 auf hellem Band 2,71:1 (jetzt 858585, 3,3:1), zwei Elemente über dem Rand, Werte in farbigen Balken schlecht lesbar (jetzt eine Reihe mit Farbe je Punkt, Wert über dem Balken), P14-Titel auf dem Foto, Rechenfehler in den Beispielzahlen (0,54 statt 3,9 Mio. €).

**Grenzen:** Muster und Budgets sind Startwerte; die Budgets sind an die heutigen Profilgrenzen angepasst, echte Lesedecks sind dichter. Der Detektor prüft die Budgets je Zone noch nicht. Rendering nur in LibreOffice. P08 aus Formen gebaut (pptxgenjs schreibt kein natives Wasserfalldiagramm). Beurteilung der Testfolien durch dasselbe Modell, keine unabhängige Prüfung.

## 0.11-draft (2026-09-25)

Umsetzung von Schritt 1 und 2 aus Audit 3 (`AUDIT.md`, IDs hier mit Präfix **A3-**), freigegeben von Max. Neues Testergebnis: Das absichtlich gebaute KI-Deck fällt jetzt auf jeder Folie durch, vorher bestand es die Vermeidungsprüfung. 69 Tests (18 neu), alle grün, auch die 5 Rendertests, die bisher mangels LibreOffice Impress übersprungen wurden.

**Entscheidungen von Max (2026-09-25):**

| Befund | Änderung |
|---|---|
| A3-Ziel | Zielgruppe ist Max, nicht "etwa 600 Nutzer" (war eine Annahme). Ziel neu gefasst: "Impeccable für Folien", gute Decks mit weniger Aufwand, gleiche Regeln in Claude, PowerPoint, LibreOffice und Claude Design (BRIEF §2, README). |
| A3-H2 | Feature-Stopp aufgehoben (BRIEF §10, §11 alte Regel 1 gestrichen, übrige Regeln neu nummeriert). Formales Evaluationsdesign (12 Aufgaben × 5 Läufe × 3 Bewerter, Trigger-Tests) entfällt; Maßstab ist Max' Urteil plus Detektor (BRIEF §5). |
| Look | Kein Standard-Look mehr. "Standing exit" und "Restrained als Standard für read/update" gestrichen (`direction.md`, `SKILL.md`, `profiles.md`). Claude fragt in Runde 1 nach Zweck, Situation, gewünschter Wirkung und Vorbildern, zeigt in Runde 2 zwei bis drei Richtungen als **gerenderte Entwürfe** (Titelfolie und typische Inhaltsfolie mit echtem Inhalt), der Nutzer wählt. Quick nur auf ausdrückliche Übergabe. Wege zum Rendern je Umgebung (pptx-Skill, PowerPoint-Add-in, Claude Design, ohne Rendern) in `direction.md`. Plan-Feld `Drafts shown` (auch im Parser). |

**Detektor (A3-K1), neues Modul `scripts/detect.py`, gemeldet unter Prüfpunkt 9 mit Regel-ID:**

| Regel | Status | Was gemessen wird |
|---|---|---|
| `nested-cards` | fail | sichtbare Box (Füllung oder Umriss auf ihrer Fläche) mit Text in einer anderen sichtbaren Box |
| `card-grid` | fail | drei oder mehr gleich große Boxen (±5 %) mit Text, mindestens 72 × 48 pt, in Reihe oder Spalte |
| `icon-tile-stack` | fail | zwei oder mehr fast quadratische Kacheln (20 bis 72 pt) direkt über einer Überschrift |
| `stat-row` / `number-card` | fail / observation | zwei oder mehr große Zahlen (ab 40 pt) in einer Reihe / eine große Zahl in einer Box |
| `side-stripe`, `border-on-rounded` | fail | dünner Farbbalken bündig an einer Box / Umriss ab 2 pt an abgerundeter Box |
| `kicker` | fail in talk/pitch, observation in read/update | kurzes Label (bis 5 Wörter, Versalien, gesperrt oder klein) direkt über dem Titel |
| `numbered-labels` | observation | zwei oder mehr Labels "01", "02" |
| `buzzword` | fail | Wortliste Deutsch und Englisch (aus `refuse.md`, ergänzt um Impeccables Liste; "leverage" ausgenommen) |
| `question-title` | fail (Prüfpunkt 1) | Titel endet mit Fragezeichen |
| `justified-text`, `centered-running-text`, `all-caps-body`, `wide-tracking` | fail, fail, fail, observation | Absatzausrichtung, Versalien, Sperrung aus der Datei |
| `shape-illustration` | observation | zwölf oder mehr kleine Formen ohne Text in einer Region |
| `default-look` (Deck) | observation, Prüfpunkt 11 | Grund in Violett-Blau, Creme oder Dunkelnavy auf mindestens der Hälfte der Folien |

Dafür liest `check_deck.py` jetzt zusätzlich Formgeometrie (`prstGeom`), Umriss (`a:ln`, `lnRef`), Absatzausrichtung (`algn`, auch vererbt), Versalien (`cap`) und Sperrung (`spc`). Eine Regel-ID im Waivers-Feld des Plans macht den Befund `waived`. `refuse.md` und `rules-core.md` (Prüfpunkt 9, Methodentabelle, Provenienz) entsprechend angepasst.

**Geprüft (Arbeitsregel 1):** `tests/fixtures/slop.pptx` (neu in `make_fixtures.js`) fällt auf Folie 1 mit `nested-cards`, `card-grid`, `icon-tile-stack` durch, auf Folie 2 mit `card-grid`, `stat-row`, `side-stripe`, auf Folie 3 mit `card-grid`, `side-stripe`. Gerendert per LibreOffice (`audit/slop-test-render.png`). Die vier Beispieldecks bestehen ohne Fail (`talk`: Beobachtung `default-look`). Ein Fehlalarm wurde dabei gefunden und behoben: Zeitleistenpunkte (16 pt) im `read`-Deck galten als Icon-Kacheln, deshalb Untergrenze 20 pt. Mutationsprüfung: 13 absichtlich eingebaute Fehler in `detect.py`, alle von den Tests erkannt.

**Aufräumen (A3-M1):** `.DS_Store` entfernt und in `.gitignore`. README-Stand korrigiert (stand noch auf 0.5).

**Grenzen:** Alle Schwellen des Detektors sind Startwerte, geprüft nur an selbst gebauten Decks. Als PNG eingebettete Bilder sieht er nicht (die Flugzeuge der Beispieldecks). Gleiche Kompositionen über mehrere Folien oder Decks (A3-K2) erkennt er nicht. Der Entwurfsschritt ist beschrieben und der Renderweg (`check_deck.py --render-dir`) hier ausgeführt, aber noch nicht in einer echten Deck-Sitzung mit Nutzerwahl erprobt.

## 0.10-draft (2026-09-25)

Die vier Beispieldecks (`examples/e-flugzeuge/`) wurden nach der Rückmeldung von Max ("linkslastig, keine Bilder") bildgeführt neu gebaut. Bildmaterial: Vektorgrafiken, erzeugt von `examples/e-flugzeuge/art.js` (SVG, mit sharp als PNG gerastert). Alle vier bestehen das Prüfskript ohne Fail. 51 Tests (2 neu). Kein Regelwerk geändert (Feature-Stopp).

**Änderungen am Skript, ausgelöst durch den Umbau:**

| Befund | Änderung |
|---|---|
| T-15 | Zellfüllungen in Tabellen wurden nicht gelesen: weiße Schrift in einer farbigen Statuszelle wurde als "Weiß auf Weiß" gemeldet. Text in einer gefüllten Zelle wird jetzt gegen die Zelle gemessen, die Füllfarben zählen als verwendete Farben (Palette, Farbregel). |
| T-16 | Plan-Kontrast: Der Plan kennt keine Flächenzuordnung. Jede Rollenfarbe muss jetzt auf mindestens einem deklarierten Hintergrund lesbar sein (Flächen wie eine orange Beschlussleiste als weitere `background`-Einträge schreiben), statt auf allen. Die tatsächliche Fläche misst der Deck-Check je Textfeld. |

**Befunde zu Regeln und Ablauf** (nicht umgesetzt, Feature-Stopp, Details in `examples/e-flugzeuge/README.md`): (1) Die Regeln enthalten nichts Positives zur Komposition (Fixpunkt, Balance, bildgeführtes Layout) und keinen Schritt für Bildmaterial; die erste Fassung bestand alle Prüfungen und war trotzdem linkslastig und bildlos. (2) Der Füllgrad-Grenzwert hat die erste Fassung mit kleinen Exhibits erzwungen; Vollflächen-Bilder als Grund und Platten in Textfeldgröße umgehen ihn. (3) "Linksbündig" gilt für Fließtext, nicht für den Folienaufbau. (4) pptxgenjs: Textfeld-`margin` ist [links, rechts, unten, oben] in Punkt, abweichend von der Dokumentation.

**Grenzen:** Selbstprüfung des Modells, das die Decks gebaut hat, keine unabhängige Prüfung. Ob die überarbeiteten Decks besser gefallen, ist offen (Rückmeldung von Max steht aus). Grafiken sind flach und geometrisch.

## 0.9-draft (2026-09-25)

Vier Beispieldecks zum Thema E-Flugzeuge (`examples/e-flugzeuge/`, je Profil eines, erfundene Zahlen), gebaut nach dem Ablauf von `slide-craft` (Modus Quick auf ausdrückliche Übergabe), jeweils mit Plan, Bau, Prüfskript und Plan as built. Sie sind die erste Erprobung von Skript und Planablauf an Decks, die nicht für die Tests gebaut wurden. Sie ersetzen weder die Testdecks nach BRIEF §5 noch echte Decks. Ergebnis: alle vier ohne Fail im Prüfskript, nach mehreren Korrekturrunden. 49 Tests (5 neu), Mutationsprüfung der neuen Skriptteile: alle 6 Änderungen erkannt.

**Änderungen am Skript, ausgelöst durch die Decks:**

| Befund | Änderung |
|---|---|
| T-10 | Tabellenrahmen: pptxgenjs schreibt nur die Zeilenhöhen, nicht die Rahmenhöhe. Das Skript nahm die gespeicherte Höhe und meldete Überlauf zu Unrecht. Der Rahmen ist jetzt so hoch wie die Zeilen und so breit wie die Spalten. |
| T-11 | Neue Dateiprüfung "Tabellenzellenränder lassen Platz für den Text" (Ränder mindestens 60 % der Zellbreite ist ein Fail). Anlass: pptxgenjs liest `margin` in Tabellenzellen in Zoll, nicht in Punkt, acht Punkt wurden acht Zoll und der Text brach Buchstabe für Buchstabe um. Nur das Rendern hatte das gefunden. |
| T-12 | Neue Dateiprüfung "Strichwerte in Diagrammen sind gültig". pptxgenjs schrieb bei `lineDash` mit zwei Werten `dash,solid`. Der Validator des pptx-Skills meldete "PASSED", das Skript meldet den Fail. |
| T-13 | "Quelle und Datum" erkannte nur Jahreszahlen. Jetzt auch Kalenderwoche (KW, CW), Quartal und Monatsnamen. |
| T-14 | Plan-Parser: Rollenwort `status` (Statusfarben des Profils update zählen nicht als Signalfarbe). Rollen für Titelfolie, Trennfolie und Zitat (`title-slide`, `divider`, `quote`, `display`, `cover`) sind nicht an den Titelgrößenbereich des Profils gebunden. |

**Befunde zu Regelwerten** (nicht geändert, Feature-Stopp; Details in `examples/e-flugzeuge/README.md`): (1) Der Füllgrad-Grenzwert (Bounding-Boxen) kollidiert mit den Größenwerten: Ein zweizeiliges Titelband belegt bei `talk` (40 pt) etwa 27 % des Limits von 30 %, bei `pitch` kamen Titel plus normal großes Diagramm auf 60 bis 71 % (Limit 50 %). Erst einzeilige Titel und kompakte Exhibits hielten die Grenzen. (2) Die Titellängen-Grenzen in Wörtern sagen nichts darüber, ob der Titel in eine Zeile passt (etwa 50 Zeichen bei 32 pt, 43 bei 40 pt). (3) Zwei Rollen fehlten im ersten Plan (Titelfolie, Tabellenkopf fett), der Planabgleich hat sie gemeldet.

**Grenzen:** Die Durchsicht der Decks war eine Selbstprüfung desselben Modells (kein Subagent, kein Mensch). Ob die Decks "nicht nach KI aussehen", ist nicht belegt. LibreOffice-Renderings, nicht in PowerPoint geöffnet. Ein Plan, den ein anderes Modell in einer echten Sitzung schreibt, ist weiter ungetestet.

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
