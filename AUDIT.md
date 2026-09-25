# Audit 3: Erreicht slide-craft das Ziel?

Stand: 2026-09-25. Gegenstand: Repo `slide-craft` in Version 0.10-draft, verglichen mit Impeccable im Original, mit bestehenden Skills für Beratungsfolien und mit dem Ziel, das Max in dieser Session formuliert hat. Das Audit ändert keinen Code. Neu sind nur diese Datei und `audit/`, dort liegen ein Testdeck und das Ergebnis des Prüfskripts.

## 0. Das Ziel (abgestimmt mit Max, 2026-09-25)

> Ein „Impeccable für Folien“: Der Skill vermeidet zuverlässig die typischen KI-Muster (Boxen in Boxen, Kartenraster mit Icons, Verläufe, austauschbare Titel). Dazu kommen positive Gestaltungsregeln nach dem Vorbild professioneller Beratungsdecks (McKinsey, BCG, Bain), damit das Ergebnis gut aussieht und nicht bloß „nicht schlecht“. Max bekommt damit **mit weniger Aufwand gute Decks**. Die Regeln gelten gleich, egal ob Claude ein Deck neu baut, eine vorhandene Folie verbessert, in PowerPoint (Add-in), in LibreOffice oder in Claude Design arbeitet.

Korrekturen gegenüber BRIEF.md:
- Es gibt **keine Zielgruppe von 600 Nutzern**. Die Zahl stand als „Annahme“ in BRIEF §2 Punkt 5 und im README und war nie Max' Vorgabe.
- Der **Feature-Stopp** (BRIEF §10 Schritt 0, §11 Regel 1) wird laut Max nicht mehr gebraucht.

## 1. Kurzantwort

**Nein, in der jetzigen Form erreicht das Repo das Ziel nicht.** Die Grundidee stimmt: Aussagetitel, Deck-Plan als Designsystem, Vermeidungsliste aus Impeccable und berechneter Kontrast. Drei Dinge fehlen aber, und ohne sie kommt weiter KI-Optik heraus:

1. **Das Prüfskript erkennt das Hauptproblem nicht.** Ein absichtlich gebautes KI-Deck mit Karten in Karten, Icon-Kacheln, Kennzahl-Karten und einem 2×2-Kartenraster besteht die Vermeidungsprüfung mit „none found“ (Befund K1).
2. **Die Regeln verbieten, sagen aber nicht, wie eine gute Folie aussieht.** Es gibt keine erprobten Folienmuster, keine Kompositionsregeln und keinen Umgang mit Bildern. Die eigenen Beispieldecks zeigen die Folgen (K2, K3).
3. **Der Aufwand liegt an der falschen Stelle.** Ein großer Teil des Repos dient Nachweisführung und Verlässlichkeit für viele Nutzer, also der falschen Annahme. Das eigentliche Werkzeug zur Gestaltung fehlt (H2).

Die Empfehlung in Abschnitt 5 lautet: Den Detektor nach dem Vorbild von Impeccable auf Folien übertragen, eine kleine Bibliothek von Beratungs-Folienmustern mit Textbudgets aufbauen, den Prozess entschlacken und den Ballast entfernen.

## 2. Was trägt (behalten)

| Element | Warum es trägt |
|---|---|
| Aussagetitel und Titelstrang (`rules-core.md` §1) | Das ist der Kern von Beratungsdecks, und alle Quellen in Abschnitt 6 stimmen darin überein. |
| Deck-Plan als deckweites Designsystem (`deck-plan.md`) | Entspricht Impeccables `DESIGN.md`. Er verhindert, dass jede Folie einzeln entschieden wird, und macht Abweichungen prüfbar. |
| Vermeidungsliste (`refuse.md`) | Inhaltlich weitgehend richtig aus Impeccables `craft-floor.md` übernommen. Das Problem ist die Durchsetzung, nicht die Liste (K1). |
| Refinement vs. Redesign, Modi `polish`, `distill`, `critique` usw. | Deckt den Fall „Max gibt mir eine fertige Folie“ bereits ab. |
| Prüfskript als Infrastruktur (`scripts/`, 51 Tests, alle grün, 5 übersprungen) | Solide Grundlage: OOXML lesen, Themefarben auflösen, WCAG-Kontrast, Planabgleich. Hier lässt sich ein Detektor anbauen. |
| Profile `read` / `talk` | Die Unterscheidung „wird gelesen“ gegen „begleitet einen Redner“ ist richtig. |
| Beispieldeck `read` | Kommt einem Beratungsdeck am nächsten: Tabelle plus Balken, Beschlussleiste, Quellenzeilen. |

## 3. Befunde

Schwere: **K** = verhindert das Ziel, **H** = schwächt das Ziel deutlich, **M** = Aufräumen.

### K1: Der Detektor erkennt die typischen KI-Muster nicht

**Befund:** Die Vermeidungsprüfung (Prüfpunkt 9, `scripts/check_deck.py:1211-1240`) erkennt nur Verläufe, Schatten, Leuchteffekte, 3D und Emoji. Dazu kommen heuristisch dünne Linien unter Titeln und Seitenstreifen, beides nur als „observation“. Das Skript liest die Formgeometrie (`prstGeom`, etwa `roundRect`) gar nicht. Karten in Karten, Kartenraster, Icon-Kacheln, das Kennzahl-Template, Kicker, 01/02-Nummern und Buzzwords stehen in `refuse.md` unter „Judgement“ und werden nicht gemessen.

**Test:** `audit/slop-test.js` baut drei Folien, die ein Mensch sofort als KI-Folien erkennt:
1. drei abgerundete Karten mit Icon-Kachel in einem abgerundeten Rahmen,
2. drei Kennzahl-Karten mit Akzentstreifen,
3. ein 2×2-Kartenraster mit Seitenstreifen und den Nummern „01“ bis „04“.

Ergebnis (`audit/slop-test-result.json`, Profil `read`): 34 pass, 2 fail, 18 observation. Die Vermeidungsprüfung meldet auf allen drei Folien „none found“. Die Seitenstreifen erscheinen nur als Beobachtung. Beide Fails betreffen den **Füllgrad** der Folien 1 und 3, also die Größe der Karten und nicht ihre Art. Folie 2 (Kennzahl-Karten) besteht vollständig. Mit etwas kleineren Karten bestünde das ganze Deck.

**Warum das zählt:** Genau dieses Muster ist Max' Hauptärgernis. Impeccable löst es mit **61 deterministischen Detektorregeln** (`crates/live/assets/antipatterns.json` im Impeccable-Repo). Ein Hook führt sie nach jeder Änderung automatisch aus und legt die Befunde Claude vor (`plugin/hooks/hooks.json`, `skill/reference/hooks.md`). Claude muss sich also nicht selbst daran erinnern, zu prüfen.

**Übertragbar auf Folien** (aus den 61 Regeln ausgewählt, alle aus OOXML lesbar):

| Impeccable-Regel | Auf Folien messbar als |
|---|---|
| `nested-cards` | gefüllte oder umrandete Form, die vollständig in einer anderen gefüllten oder umrandeten Form liegt, und darin Text |
| `icon-tile-stack` | kleines, annähernd quadratisches, abgerundetes Feld direkt über einer Überschrift, wiederholt |
| identische Kartenraster (`skill-ban-identical-card-grids`) | drei oder mehr gleich große Formen in Reihe oder Raster, jede mit Überschrift und Text |
| `side-tab`, `border-accent-on-rounded` | schmales Rechteck an der Kante einer Form, oder dicker Rand an einer `roundRect` |
| Kennzahl-Template (`skill-ban-hero-metric`) | wiederholte Gruppe aus großer Zahl ≥ 40 pt, kleinem Label und Kartenfläche |
| `kicker-above-heading`, `numbered-section-labels` | kurzer Text in Großbuchstaben oder mit Sperrung direkt über dem Titel; „01“ bis „0n“ als eigene Textfelder |
| `ai-color-palette`, `cream-palette` | Violett-Blau als Akzent oder Fläche; Creme oder Beige als Hintergrund (bei freier Richtung) |
| `marketing-buzzword`, `em-dash-overuse`, `aphoristic-cadence` | Wortliste Deutsch und Englisch, Gedankenstrich-Häufung, „Nicht X. Sondern Y.“ |
| `shape-assembled-illustration` | viele einfache Formen, die zusammen ein Bild ergeben (trifft die eigenen Beispieldecks, siehe K2) |
| `flat-type-hierarchy`, `tight-leading`, `justified-text`, `all-caps-body`, `wide-tracking`, `gray-on-color`, `cramped-padding` | Größen, Zeilenabstand, Ausrichtung, Großschreibung, Sperrung, Farbe auf Fläche, Innenabstand |

### K2: Keine positive Gestaltung, und die Beispieldecks zeigen es

**Befund:** Die Regeln enthalten Verbote und Grenzwerte, aber keine Aussage darüber, wie eine gute Folie aufgebaut ist. Das Repo stellt das selbst fest: `examples/e-flugzeuge/README.md` Befund 2 und CHANGELOG 0.10 sagen, ein Deck könne alle Prüfungen bestehen und trotzdem linkslastig und bildlos wirken.

**Eigene Durchsicht aller 27 Renderbilder** (Beobachtung, kein Messwert):
- **Alle vier Titelfolien haben dieselbe Komposition:** Titel links, Flugzeug-Silhouette rechts, gestrichelte Kreise. Nur die Farbe wechselt (Orange, Magenta, Violett, Blau). Die Richtungsableitung sollte vier verschiedene Welten erzeugen. Herausgekommen ist ein einziges Template.
- **`talk`:** Sieben von acht Folien folgen demselben Schema: Titel oben links, große Zahl, Grafik rechts auf voller Violettfläche. Violett-Blau als Hauptfläche ist ein Muster, das Impeccable als KI-Signal führt (`ai-color-palette`). Die Grafiken sind aus einfachen Formen gebaut, also genau das, was Impeccable als `shape-assembled-illustration` meldet.
- **`pitch`, `update`, `read`:** Auf den meisten Inhaltsfolien bleibt das untere Drittel leer, weil Exhibits klein oben rechts sitzen. Das kleine Flugzeug in der Fortschrittsleiste von `pitch` ist Dekoration.
- **`read`** ist am besten. Im Vergleich zu Beratungsdecks fehlen aber Abschnittsmarker und die Unterzeile mit Maß und Einheit unter dem Titel, und die Exhibits sind zu klein für die Folie.

**Ursache:** Ohne Muster muss Claude jede Folie frei komponieren. Die Grenzwerte, vor allem der Füllgrad, drücken dabei in Richtung „klein und leer“. Das beschreibt das Beispiel-README selbst in Befund 1.

### K3: Es fehlt eine Bibliothek erprobter Folienmuster

**Befund:** BRIEF §6 entscheidet „Regeln und Standards statt Stil-Themes“. Folienmuster, also Layouts mit festen Zonen und Textbudgets, sind aber etwas anderes als Stil-Themes. Und genau hier setzen die bestehenden Projekte mit demselben Ziel an:
- `appautomaton/presentation`: 21 Folienmuster für PPTX auf einem gemeinsamen Raster, **„Slot budgets as the overflow defense“**. Jedes Muster hat eine Datei mit Zeichenbudgets je Zone, zum Beispiel `p03-evidence.slots.md`: Titel ≤ 120 Zeichen, bis zu 3 Callouts ≤ 140 Zeichen, Kernaussage ≤ 180 Zeichen, natives Diagramm.
- `seulee26/mckinsey-pptx`: 40 Folienvorlagen und ein Subagent, der die Vorlage wählt.
- `96imranahmed/professional-slides`: Komponenten mit Geometrie-Verträgen und einem Referenzsatz fertiger Beispiele zum Abgleich.

**Warum das zählt:** Für „weniger Aufwand, gute Folien“ ist ein Muster mit Budgets der kürzeste Weg. Claude wählt ein erprobtes Layout (etwa „Diagramm 65 % plus Deutungsspalte 35 %“) und füllt die Zonen, statt unter Verboten eine Komposition zu erfinden. Das füllt auch die Folie sinnvoll (K2) und verhindert Überlauf ohne Nachbesserungsrunden.

### H1: Einige Regeln widersprechen professioneller Beratungspraxis

Die Quellen sind Sekundärstudien anderer Projekte (siehe Abschnitt 6). Die Originaldecks konnte ich nicht selbst prüfen (Abschnitt 7).

- **Dichte:** `profiles.md` begrenzt `read` auf „one central exhibit“ und 75 % Füllgrad. Die Designstudie von `kgraph57` (9 öffentliche Dokumente von 6 Beratungen) hält fest, dass dichte Vergleichsmatrizen, gemischte Text-Diagramm-Seiten und mehrteilige Exhibits in mehreren Publikationen zentral sind. `appautomaton` nennt für McKinsey zehn mehrteilige Kompositionen, darunter „Chart + Right Sidebar, 65/35“ als häufigste.
- **Farbe:** `rules-core.md` §4 erlaubt „1 accent + at most 1 signal“. `appautomaton/…/mckinsey.md` §6 beschreibt Farb*rollen*: Primärdaten, positiv, negativ, Fokus, Navigation, gedämpft. Grün für gut und Rot für schlecht gehören dort zur Lesbarkeit, nicht zur Dekoration.
- **Kästen:** `refuse.md` verbietet Seitenstreifen und Kopf- oder Fußleisten pauschal. In Beratungsdecks ist eine einzelne Deutungs-Box unter dem Exhibit üblich; `appautomaton` beschreibt sie für McKinsey mit „light accent fill or left-border stripe“. Das Problem ist nicht die einzelne Box mit Funktion. Das Problem sind Karten als Folienstruktur. Die Regel muss das trennen.
- **Titelzeile:** Beratungsdecks nutzen eine zweistufige Kopfzone: Abschnittsmarker, Aussagetitel, Unterzeile mit Maß, Einheit und Zeitraum. Diese Beschreibung stammt von `appautomaton` und findet sich im Kern auch in der `kgraph57`-Studie („assertion headline, measure definition, plot, notes and source“). slide-craft erlaubt den Tracker, kennt aber die Unterzeile nicht als Rolle.

### H2: Zu viel Prozess und Nachweis, zu wenig Werkzeug

- **Evaluationsdesign** (BRIEF §5): 12 Aufgaben, 5 Läufe, mindestens 3 Bewerter, Trigger-Tests. Das war für 600 Nutzer ausgelegt. Für Max reicht: Er beurteilt Decks, und die Befunde gehen in die Regeln ein.
- **Herkunftstags pro Regel, Audit-ID-System, Versionsregeln** (BRIEF §11 Regeln 4, 7, 9): Das schafft viel Text rund um wenige Regeln. Die Versionen 0.1 bis 0.10 entstanden alle am 2026-09-25.
- **Ablauf pro Deck:** Rückfragerunde, Richtungswahl (Choice als Standard), Plan zeigen, Bau, gebündelte Prüfung, frischer Reviewer, Plan „as built“. Choice als Standard ist Max' Entscheidung und bleibt. Offen ist, ob der Rest bei jedem Deck nötig ist. Siehe die Fragen in Abschnitt 5.
- **Feature-Stopp:** Er blockiert K1 bis K3. Laut Max ist er nicht mehr nötig.

### H3: Die Werkzeugunabhängigkeit ist nur halb umgesetzt

| Umgebung | Stand (geprüft 2026-09-25) | Folge für slide-craft |
|---|---|---|
| Claude (App, Claude Code) mit pptx-Skill | Skills und Codeausführung vorhanden | Voller Weg: Regeln, Muster, Detektor. |
| Claude for PowerPoint (Add-in) | Laut Anthropic-Doku „Connectors and Skills“: „Skills you've enabled in your Claude settings are available in all Claude for M365 add-ins.“ Das Add-in liest „slide master, layouts, fonts, and color scheme“. **Ob Skripte laufen, sagt die Doku nicht.** | Die Regeln müssen ohne Skript wirken. Der Detektor ist dort vermutlich nicht verfügbar, also Befunde als Beurteilung kennzeichnen. Ungeprüft. |
| LibreOffice (.odp) | Das Skript liest nur OOXML | Vorher `soffice --convert-to pptx` einbauen, oder als .pptx speichern lassen. |
| Claude Design | Laut Anthropic-Ankündigung und Tutorials: Design-System-Integration, Export nach PPTX, PDF und HTML. **Ob eigene Skills geladen werden, habe ich nicht verifiziert.** | Regeln als Design-System-Beschreibung bereitstellen. Für die HTML-Ausgabe könnte Impeccables Detektor direkt laufen. |
| Screenshot einer Folie | Nur Bild | Nur Beurteilung möglich, und das so sagen. |

Dazu: `SKILL.md` enthält pptxgenjs-Hinweise direkt im Hauptteil. Die gehören in eine eigene Werkzeug-Referenz, damit der Hauptteil werkzeugneutral bleibt.

### H4: Bilder haben keinen Weg in den Ablauf

`rules-core.md` §5 sagt „One good image beats many“, aber kein Schritt beschafft Bilder. Die Beispieldecks behelfen sich mit selbst gezeichneten Vektorgrafiken aus einfachen Formen. Impeccable verbietet genau das („Real illustration or none“, Regel `shape-assembled-illustration`) und hat dafür eigens einen Agenten zur Bildproduktion (`plugin/agents/impeccable-asset-producer.md`). Für Folien realistisch sind drei Wege:
1. Bilder oder Fotos des Nutzers anfordern.
2. Das Exhibit selbst zum Bild machen: Diagramm, Karte, Tabelle, Prozess. Das ist der Beratungsweg.
3. Rein typografische Folien.

Dekorative Illustrationen aus einfachen Formen sollten auf die Vermeidungsliste.

### M1: Aufräumen

- `examples/e-flugzeuge/.DS_Store` ist eingecheckt, und `.gitignore` fängt `.DS_Store` nicht ab.
- `README.md`: Der Abschnitt „Stand (Version 0.5, status: draft)“ widerspricht dem Kopf mit 0.10. Die Zielgruppe mit „etwa 600 Nutzern“ steht noch drin.
- `BRIEF.md` §2 Punkt 5, §5, §10 Schritt 0 und §11 Regel 1 folgen noch der alten Annahme bzw. dem Feature-Stopp.
- `rules-core.md` Provenienz: Die Consulting-Regeln stützen sich auf den Blog eines Anbieters von KI-Folienwerkzeugen (Deckary). Das Repo sagt das selbst (BRIEF §7). Mit Abschnitt 6 und echten Decks lässt sich das verbessern.

## 4. Abgleich mit Impeccable: was fehlt strukturell

| Impeccable | slide-craft heute | Lücke |
|---|---|---|
| 61 deterministische Detektorregeln, eigene CLI | 1 Sammelprüfung mit 5 Mustern, plus Heuristik | K1 |
| Hook: Detektor läuft nach jeder Änderung automatisch, Tiefenprüfung beim Beenden | Das Skript muss von Hand aufgerufen werden | Ein Hook für `.pptx` wäre in Claude Code möglich, im Add-in nicht |
| `craft-floor.md`: kurz, direkt vor jeder Bearbeitung geladen, Prüfen plus Vermeiden | `rules-core.md` und `refuse.md`, dazu viel Nachweistext | kürzen |
| „The floor holds the mechanics; it never picks the direction.“ | Richtungsfluss vorhanden, erzeugt in den Beispielen aber ein Template | K2 und K3 |
| Asset-Agent für echte Bilder | kein Bildweg | H4 |
| `layout.md`: Lesereihenfolge, Squint-Test, Rhythmus aus engen und weiten Abständen | nur Rand, Raster, 8-pt-Abstände | positive Layoutregeln fehlen |

## 5. Empfehlung und Reihenfolge

1. **Ballast entfernen** (klein, sofort): 600-Nutzer-Annahme, Feature-Stopp und das übergroße Evaluationsdesign aus BRIEF und README streichen, `.DS_Store` entfernen, README-Stand korrigieren. BRIEF §11 auf die Regeln kürzen, die Qualität sichern: keine erfundenen Messwerte, Regeln an einem Minimaldeck ausführen, Kombinationsprüfung.
2. **Folien-Detektor** (größter Hebel gegen die KI-Optik): Prüfpunkt 9 um die Regeln aus der Tabelle in K1 erweitern, mit `audit/slop-test.js` als erstem Testfall. Ziel: Das Deck fällt durch, die Beispieldecks `read` und `update` bestehen. Danach optional ein Hook in Claude Code, der das Skript nach jeder .pptx-Änderung ausführt.
3. **Musterbibliothek** (größter Hebel für „gut aussehen“): 10 bis 14 Folienmuster aus der Beratungspraxis, jedes mit Zonen, Rasterposition, Textbudget je Zone und Beispiel. Zum Beispiel: Titel, Kapiteltrenner, Executive Summary, Diagramm plus Deutungsspalte (65/35), zwei Exhibits nebeneinander, Wasserfall, Tabelle über die ganze Breite, 2×2-Matrix, Prozess plus Seitenspalte, Zeitplan, Statusübersicht, Empfehlung/Beschluss, eine Zahl (`talk`), Vollbild mit Textplatte (`talk`). Werkzeugneutral beschrieben, dazu eine pptxgenjs-Umsetzung. Der Detektor prüft die Budgets.
4. **Regeln an Beratungspraxis anpassen** (H1): Farbrollen statt „1 + 1“, mehrteilige Exhibits in `read`, Deutungs-Box erlaubt und Kartenstruktur verboten, Unterzeile als Rolle.
5. **Werkzeugunabhängigkeit** (H3): `SKILL.md` neutral halten, Werkzeughinweise in `references/tools/`. Eingang für .odp per Konvertierung. Im PowerPoint-Add-in testen, ob der Skill lädt und ob Skripte laufen.
6. **Beispieldecks neu bauen** mit Mustern und Detektor, und Max urteilt. Das ersetzt das formale Evaluationsdesign.

Offene Fragen an Max, bevor Schritt 3 beginnt:
- Soll der Standardlook **nah am Beratungsstil** sein (weiß, Aussagetitel, Exhibits) und nur `talk` und `pitch` freier? Oder soll jedes Deck eine eigene Richtung bekommen?
- Soll ein Deck unter 10 Folien ohne Richtungsrunde gebaut werden dürfen (Quick), damit es schneller geht? Choice als Standard war deine Entscheidung, ich ändere das nur auf dein Wort.
- Hast du zwei oder drei Decks, die du gut findest, als Vorbild für die Muster?

## 6. Quellen

Selbst gelesen (Repo geklont, 2026-09-25):
- Impeccable, `pbakaus/impeccable` (Version 4.4.0 laut `plugin/skills/impeccable/SKILL.md`): `README.md`, `plugin/skills/impeccable/SKILL.md`, `skill/reference/craft-floor.md`, `skill/reference/layout.md`, `skill/reference/hooks.md`, `plugin/hooks/hooks.json`, `plugin/agents/impeccable-asset-producer.md`, `crates/live/assets/antipatterns.json`.
- `kgraph57/mckinsey-style-visualization-skill`: `references/consulting-design-study.md` (Designstudie vom 2026-09-08 über neun öffentliche Dokumente von McKinsey, BCG, Bain, Strategy&, Roland Berger und Oliver Wyman) und `references/public-reference-corpus.md`.
- `appautomaton/presentation`: `README.md`, `deck-design-ppt/references/mckinsey.md` (nach eigener Angabe aus sechs McKinsey-Decks abgeleitet, u. a. USPS 2010, NCDOT 2019, Transportation DC 2020) und `deck-design-ppt/masters/patterns/p03-evidence.slots.md`.
- `96imranahmed/professional-slides`: `README.md`.
- `seulee26/mckinsey-pptx`: nur die Beschreibung aus dem Suchergebnis („40 slide templates + subagent“).

Selbst abgerufen (Web):
- Anthropic-Doku „Use Claude for PowerPoint“ (`claude.com/docs/office-agents/powerpoint`) und „Connectors and Skills“ (`claude.com/docs/office-agents/connectors-and-skills`).

Nur als Suchergebnis gesehen, nicht selbst gelesen:
- Anthropic „Introducing Claude Design by Anthropic Labs“ (`anthropic.com/news/claude-design-anthropic-labs`) und Tutorials Dritter zu den Exportformaten von Claude Design.

## 7. Grenzen dieses Audits

- **Keine Originaldecks von McKinsey, BCG oder Bain selbst angesehen.** Die Netzwerkrichtlinie dieser Umgebung sperrt `mckinsey.com`, `bcg.com`, `bain.com`, `slideworks.io`, `deckary.com` und ähnliche Seiten. Erlaubt waren nur GitHub und Paketquellen. Die Aussagen über Beratungspraxis in H1 stammen deshalb aus zwei Sekundärstudien anderer Projekte. Deren Beobachtungen konnte ich nicht an den Originalseiten nachprüfen. Freigeben lässt sich das in den Umgebungseinstellungen unter Network access.
- **Kein Rendering des Testdecks.** LibreOffice in dieser Umgebung konnte keine .pptx öffnen („source file could not be loaded“, auch bei den Beispieldecks). Die Aussage, das Testdeck sehe nach KI aus, ist mein Urteil über den Bauplan in `audit/slop-test.js`, nicht über ein Renderbild. Die Prüfergebnisse stammen aus dem Skript und sind davon unabhängig.
- **Die Bewertung der Beispieldecks ist meine Beurteilung** der vorhandenen Renderbilder in `examples/e-flugzeuge/*/render/`, keine Messung und keine menschliche Blindprüfung.
- Ob eigene Skills im PowerPoint-Add-in Skripte ausführen und ob Claude Design eigene Skills lädt, ist **nicht verifiziert**.
