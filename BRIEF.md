# Projektbeschreibung: slide-craft

Stand: 2026-09-25, Entwurf. Dieses Dokument beschreibt Ziel, Umfang und Entscheidungen, damit die Arbeit auf einem anderen Gerät oder in einer neuen Claude-Session nahtlos weitergeht. Zum Einstieg: dieses Dokument lesen, dann `SKILL.md` und `references/`.

## 1. Problem

Claude erzeugt Präsentationsfolien, die sofort als KI-generiert erkennbar sind: gleiche Kartenraster mit Icon, Überschrift und Text, Verläufe, unbedachte Standardschriften, überladene Bullet-Listen, austauschbare Titel wie "Überblick", Buzzwords. Für Websites löst das Impeccable-Plugin dieses Problem (klare Designhaltung, Verbotsliste, Prüfschritte). Für Folien (.pptx) gibt es nichts Vergleichbares. Der vorhandene `pptx`-Skill regelt vor allem die Dateimechanik, enthält aber auch einen eigenen Abschnitt "Design Ideas", der teils das Gegenteil unserer Regeln empfiehlt (Icon-Zeilen, Kartenraster, große Kennzahl-Callouts, "jede Folie braucht ein Visual", Titel mit 36 bis 44 pt). Deshalb legt slide-craft ausdrücklich fest, dass für Gestaltung und Inhalt slide-craft gilt und aus dem pptx-Skill nur die Technik übernommen wird (Korrektur nach Audit K1).

## 2. Ziel

Ein "Impeccable für Folien": ein Claude-Skill, mit dem Max gute Decks mit weniger Aufwand bekommt. Er vermeidet zuverlässig die typischen KI-Muster und gibt positive Gestaltung nach dem Vorbild professioneller Beratungsdecks vor (Ziel abgestimmt mit Max, 2026-09-25, siehe `AUDIT.md` §0). Konkret:

1. **Der AI-Look verschwindet.** Keine Boxen in Boxen, keine Kartenraster mit Icons, keine Verläufe, keine austauschbaren Titel. Ein Detektor erkennt diese Muster in der Datei, wie Impeccable es für Websites tut.
2. **Die Folien sehen gut aus.** Nicht nur "nicht schlecht": Komposition, Exhibits und Typografie auf dem Niveau guter Beratungsdecks, im Look, den Max mit Claude vorher ausgewählt hat.
3. **Die Folien argumentieren.** Der Titelstrang aller Folien hintereinander gelesen erzählt die Geschichte (Aussagetitel, eine Botschaft pro Folie, Antwort zuerst).
4. **Es passt zur Situation.** Der Skill unterscheidet, ob eine Folie gelesen wird oder einen Redner begleitet, und wählt Textdichte, Schriftgrößen und Aufbau danach.
5. **Es gilt überall gleich.** Neues Deck in Claude, eine vorhandene Folie zum Verbessern, Claude in PowerPoint, LibreOffice oder Claude Design: dieselben Regeln. Wo kein Code laufen kann, wirken die Regeln ohne Prüfskript, und Befunde werden als Beurteilung gekennzeichnet.

Nutzer ist Max. Eine frühere Fassung nannte "etwa 600 Nutzer in einer Organisation"; das war eine Annahme und nie Max' Vorgabe (korrigiert 2026-09-25).

## 3. Was der Skill tut

- Legt vor dem Bauen den **Kontext** fest (Profil `read`, `talk`, `pitch`, `update`; entspricht Lesedokument, Vortrag, Pitch, Status) und klärt Zweck, Publikum, Dauer in einer Rückfragerunde.
- Zwingt zu **Story vor Design**: erst die Folientitel als Aussagesätze, dann das Layout.
- Erarbeitet für neue Decks den **Look mit dem Nutzer** (`references/direction.md`): Fragen zu Zweck, Situation, gewünschter Wirkung und Vorbildern, dann zwei bis drei Richtungen als **gerenderte Entwürfe** (Titelfolie und typische Inhaltsfolie mit echtem Inhalt), der Nutzer wählt. Es gibt keinen Standard-Look. Danach Richtungsvertrag und Selbsttest gegen typische AI-Looks.
- Erstellt vor dem Bauen einen **Deck-Plan** (`references/deck-plan.md`): Brief, Storyline, ein deck-weites Designsystem (Schriften, Textarten mit Größen, Palette mit berechnetem Kontrast, Raster, Layouttypen) und eine Folientabelle. Der Plan ist die einzige Quelle für Bauen, Prüfen und spätere Änderungen. Zu einem bestehenden Deck ohne Plan wird der Plan zuerst aus der Datei abgeleitet.
- Setzt **Kernregeln** durch: Typografie-Rollen, Raster und Ränder, Farbrollen und Kontrast, Bildregeln, Diagrammregeln, Quellenpflicht, Zugänglichkeit.
- Wendet eine **Verbotsliste** (typische AI-Reflexe) an, abgeleitet aus Impeccable.
- Bietet **Modi** für Bestehendes: `audit`, `critique`, `polish`, `distill`, `typeset`, `layout`, `clarify`, `bolder`, `quieter`.
- Schließt mit **einem gebündelten Prüfdurchgang** ab (rendern, alle Checks auf einmal, alles in einer Runde beheben, höchstens eine Bestätigungsrunde), danach ein frischer Reviewer ohne Bauverlauf (`ship`, `fix`, `rebuild`, `recapture`) und der Plan "as built".
- Arbeitet **zusammen mit dem pptx-Skill**, der die Datei erzeugt. Slide-craft entscheidet, wie die Folien aussehen und argumentieren.

## 4. Was der Skill nicht tut (Abgrenzung)

- Erzeugt selbst keine .pptx-Dateien (das macht der pptx-Skill).
- Erfindet keine Inhalte, Zahlen oder Quellen. Fehlende Daten werden als Platzhalter markiert.
- Gestaltet ein bestehendes Deck nicht ungefragt komplett um. Refinement bewahrt, Redesign ersetzt, beides nie gemischt.
- Übernimmt keine Web-Themen aus Impeccable (Responsive, Hover, Motion, Browser-Detektoren, `harden`, `optimize`, `adapt`, `live`, `overdrive`).
- Wählt nicht zwischen konkreten Stil-Themes (Swiss, Editorial usw.). Das ist bewusst zurückgestellt, siehe Entscheidungen.
- Setzt kein Corporate Design voraus. Der Skill ist unabhängig von einer Firmenvorlage anwendbar (Entscheidung 2026-09-25). Liefert ein Nutzer trotzdem Marke oder Vorlage, hat das Vorrang vor den Standardwerten, einen eigenen Ablaufzweig gibt es dafür nicht.

## 5. Erfolgskriterien

Der Skill gilt als gut, wenn:
- Max die Decks ohne Nachbesserung präsentieren würde und sie nicht als "typisch KI" wirken. Max' Urteil über Beispieldecks ist der Maßstab.
- Der Detektor die typischen KI-Muster findet: das Testdeck `audit/slop-test.js` fällt durch, gut gebaute Decks bestehen.
- Der Prüfdurchgang besteht. Die Prüfpunkte und alle Schwellen stehen **nur** in `references/rules-core.md` (Prüfliste) und `references/profiles.md` (Wertetabelle). Als Pass/Fail zählen nur Punkte, die aus der Datei gelesen, berechnet oder per Skript gemessen werden. Renderschätzungen und Urteile sind Beobachtungen.
- Kein Bericht einen Messwert nennt, der nicht aus der Datei gelesen oder per Code berechnet wurde.
- Der Titelstrang ohne Folienkörper als Argumentation lesbar ist.

Ein formales Evaluationsdesign mit Bewertergruppen und Wiederholungsläufen (Fassung bis 0.10) entfällt; es war für die 600-Nutzer-Annahme ausgelegt (Entscheidung Max, 2026-09-25).

## 6. Entscheidungen bisher (mit Begründung)

| Entscheidung | Grund |
|---|---|
| Regeln und Standards statt Stil-Themes | Bei vielen Nutzern zählt Verlässlichkeit. Stile können später als optionale Themes auf denselben Regeln aufsetzen. |
| Vier Kontextprofile statt eines Standards | McKinsey-Folien sind zum Lesen gebaut, Apple-Folien zum Begleiten eines Vortrags. Ein Regelsatz für beides passt nirgends richtig. |
| Anti-AI-Regeln aus Impeccable übernehmen | Impeccable löst dasselbe Problem für Web schon gut. Refuse-Liste, "der Brief gewinnt", Rollen-Denken und gebündelte Prüfrunden sind übertragbar. |
| Prüfen in einem gebündelten Durchgang | Impeccables Erfahrung: endloses Nachpolieren kostet mehr, als es bringt. |
| Skill-Dateien auf Englisch, Projektdokumente auf Deutsch | Modelle folgen englischen Anweisungen verlässlicher, die Description ist zweisprachig, damit auch deutsche Anfragen auslösen. Profilnamen daher englisch (`read`, `talk`, `pitch`, `update`). Folien folgen der Sprache des Nutzers. |
| Deck-Plan vor dem Bauen (Vorschlag Max, 2026-09-25) | Alles, was über Folien hinweg konsistent sein muss, wird einmal entschieden. Der Plan macht `audit` prüfbar (Abweichung vom Plan = Befund) und verhindert Einzelentscheidungen pro Folie. Standard: Plan zeigen und weiterbauen; warten nur bei Wunsch des Nutzers, im Modus "Choice" der Richtungsrunde oder bei einer echten Entscheidung des Nutzers. |
| Claude gestaltet die Richtung aktiv mit, abgeleitet statt abgefragt (Vorschlag Max, nach Impeccable-Vorbild `new-work.md`, `shape.md`, `init.md`) | Szene-Satz, Mechanismus und die visuelle Welt des Publikums statt Standardwerten oder Vibe-Fragebogen. Vom Nutzer genannte Stimmungswörter gelten als festgelegt und werden per Tabelle in Entscheidungen übersetzt. Fragen: 2 bis 3 in einer Runde, keine Hex-Werte, Schriftnamen oder Stil-Menüs. |
| Kein Standard-Look; der Look wird mit dem Nutzer erarbeitet, gewählt aus gerenderten Entwürfen | Entscheidung Max, 2026-09-25 (ersetzt "Choice ist Standard, Quick als Ausnahme"): Claude fragt nach Zweck, Situation, Wirkung und Vorbildern und zeigt zwei bis drei Richtungen als echte Folien. Aus Bildern wählt es sich besser als aus Beschreibungen, und eine Runde mehr ist billiger als ein neu gebautes Deck. Ohne Entwürfe nur, wenn der Nutzer ausdrücklich übergibt ("mach du"). |
| Fester Ausgang "Kategorie-Standard sauber gespielt" entfällt | Entscheidung Max, 2026-09-25: Es gibt keinen Standard-Look, auch nicht als Ausweichoption. |
| Selbsttest gegen vier Standard-Looks, Richtungsvertrag mit sechs Blöcken, frischer Reviewer, Plan "as built" | Aus Impeccable übernommen und für Folien angepasst. Nicht übernommen: Zufallsskript, Mock-Bilder, Browser-Entscheidungsseite, Build-Phasen-Skripte (Web-Infrastruktur). |
| Kein Corporate Design vorausgesetzt | Der Skill soll unabhängig anwendbar sein (Entscheidung Max, 2026-09-25). |
| Vorrangregel gegenüber dem pptx-Skill | Beide Skills liegen gleichzeitig im Kontext. Ohne Vorrang streut das Ergebnis (Audit K1). |
| Prüfungen mit Herkunft kennzeichnen, keine erfundenen Messwerte | Ein LLM kann Kontrast oder Füllgrad aus einem Bild nicht verlässlich messen (Audit K2). Werte kommen aus der Datei oder aus Code. |
| Farbzählung: 1 Akzent + höchstens 1 Signalfarbe, Neutrale zählen nicht | Vorher dreifach unterschiedlich definiert und mit Statusampeln unvereinbar (Audit H5). |
| Schriften: Nutzer-/Markenschrift, sonst Safe-Liste mit bewusster Paarung | Fremdrechner und verlässliche Überlaufprüfung (Audit H2). |
| Prüfskript vor den Testdecks | Ohne Skript sind die Testdecks nicht messbar auszuwerten (Audit K2). |
| Detektor für KI-Muster nach Impeccable-Vorbild | Audit 3 (`AUDIT.md`, K1): Ein absichtlich gebautes KI-Deck bestand die Vermeidungsprüfung. Impeccable setzt seine Verbotsliste mit deterministischen Detektorregeln durch; das wird auf OOXML übertragen (`scripts/detect.py`). |
| Feature-Stopp aufgehoben | Entscheidung Max, 2026-09-25: Er blockierte genau die fehlenden Teile (Detektor, Komposition, Muster). Die Qualitätsregeln in §11 gelten weiter. |
| Zielgruppe ist Max, nicht 600 Nutzer | Korrektur Max, 2026-09-25. Nachweis- und Verteilungsaufwand für viele Nutzer entfällt. |

## 7. Recherchestand und Quellen

Regeln der Consulting-Häuser (McKinsey, BCG, Bain) nach einer Praktiker-Quelle, [Deckary](https://deckary.com/blog/consulting-slide-standards). Das ist ein Blog des Anbieters eines KI-Folienwerkzeugs, keine offizielle Firmenrichtlinie und kein Konsens mehrerer Quellen. Bestätigt sind die Grundsätze (Aussagetitel, eine Botschaft pro Folie, Quellenzeile). Die Zahlenwerte (15 Wörter, 60 Sekunden) sind nicht unabhängig verifiziert. Als Primärliteratur ergänzen: Barbara Minto, "The Pyramid Principle" (Seitenzahlen noch offen). Aussagetitel bis 15 Wörter und 2 Zeilen, eine Aussage pro Folie, höchstens 2 Schriften, 3 bis 4 Farben, Quelle auf jeder Datenfolie, Titel oben, ein Exhibit, Quelle und Seitenzahl unten, 60-Sekunden-Regel. Unterschiede: McKinsey textlastiger und strukturierter, BCG visueller, Bain mit stärkerem Erzählbogen (Answer-first).

Apple/Jobs (Sekundärquellen: [Presentation Zen](https://presentationzen.com/blog/steve-jobs-and-visual-presentation), [Forbes 3-Sekunden-Regel](https://www.forbes.com/sites/carminegallo/2025/10/29/why-steve-jobs-followed-the-3-second-slide-rule-for-better-presentations/)): eine Idee pro Folie, keine Bullets, eine große Zahl, 60 pt und mehr, Folie in drei Sekunden erfasst.

Impeccable (lokal gelesen): `craft-floor.md` (Refuse-Liste, Prüfungen), `typeset.md`, `critique.md`, `audit.md`, `polish.md`, `distill.md`, `SKILL.md`, `new-work.md` (Richtungsableitung, Selbsttest gegen Standard-Looks, Richtungsvertrag, Abschluss mit frischem Reviewer), `shape.md` (Rückfragekadenz), `init.md` (Trennung von Produktwahrheit und Optik).

Weitere Fundstellen: Figma-Community "Top 50 Startup Pitch Decks" und "All Apple Event Summary Slides 2019-2026" (per Figma-MCP nur lesbar, wenn eine eigene Kopie in Figma liegt und ihr Link mit Datei-Key bereitgestellt wird), `nghiahsgs/skills-slides` (HTML-Decks mit Anti-Slop-Ansatz), `maxsoweski/claude-design-skills` (unter anderem ein Müller-Brockmann-Skill), `proyecto26/slides-ai-plugin`.

## 8. Wichtige Einschränkungen des Entwurfs

- **Alle Zahlenwerte sind Startwerte** (Rand 0,667 in, Wort- und Zeichenlimits pro Profil, Titel-Wortgrenzen, Schriftgrößen). Sie sind an den recherchierten Regeln orientiert, aber nicht belegt und noch an keinem echten Deck getestet. Die Titel-Wortgrenzen beruhen auf einer Zeilenkapazitäts-Schätzung (durchschnittliche Zeichenbreite etwa 0,5 em), nicht auf einer Messung.
- Das **Prüfskript** `scripts/check_deck.py` (seit 0.6, Planabgleich in `scripts/plan.py` seit 0.7) liest die .pptx aus dem OOXML und misst alles, was aus der Datei lesbar oder berechenbar ist. Mit `--render` (seit 0.8, `scripts/render.py`) rendert es per LibreOffice als PDF und wertet die Wortpositionen aus (Überlauf, Titelzeilen, fehlender Text, tatsächlich gezeichnete Schriften). Das bleibt eine Beobachtung, weil es nur so genau ist wie die Schriftübereinstimmung, und ohne `--render` bleibt Überlauf eine Schätzung (0,5 em Zeichenbreite). Optische Ausrichtung und Abstandsraster (8 pt) sind nicht implementiert und werden als "not_measured" gemeldet. Der Planabgleich (Prüfpunkt 12) vergleicht Folienzahl, Titel, Schriften, Größen, Gewichte, Palette und Rand mit `deck-plan.md`, prüft den Plan gegen seine eigenen Konsistenzregeln und kann für ein Deck ohne Plan einen Plan aus der Datei ableiten (`--derive-plan`). Layouts werden nur über den Namen verglichen. Seit 0.9 gibt es vier Beispieldecks (`examples/e-flugzeuge/`, Thema E-Flugzeuge, erfundene Zahlen, je Profil eines) als erste Erprobung; sie ersetzen keine echten Decks. Getestet ist es an pptxgenjs-Decks und an handgebautem OOXML, nicht an echten PowerPoint-Decks.
- Der Fallback ohne Subagents beim frischen Review ist eine **Selbstprüfung desselben Modells**, keine unabhängige Prüfung.
- Jede Regelgruppe trägt eine Herkunftskennzeichnung (belegt, Praktiker, übertragen, Startwert), siehe Tabelle am Ende von `references/rules-core.md`.
- Der **Detektor** (`scripts/detect.py`, seit 0.11) erkennt KI-Muster an Geometrie, Füllung, Rändern und Text in der Datei. Die Schwellen (gleiche Größe innerhalb 5 %, Abstände, Mindestgrößen) sind Startwerte, geprüft an einem absichtlichen KI-Deck und den vier Beispieldecks, nicht an echten Decks. Gerenderte Bilder, die als PNG eingebettet sind, sieht er nicht.
- Audit 3 (`AUDIT.md`) verwendet eigene IDs (K1 bis K3, H1 bis H4, M1); im CHANGELOG mit dem Präfix "A3-".
- Die ersten beiden Audits verwenden dieselben IDs (K1, H1 usw.). Das erste ist im CHANGELOG als "A1-…" aufgelöst, das zweite dort als "A2-…". IDs mit dem Zusatz "Audit K1" in diesem Dokument beziehen sich auf das erste Audit (A1).
- Die **Vorbild-Regeln stammen aus Sekundärquellen**. Für Apple gibt es keine offizielle Anleitung, für die Consulting-Häuser nur Blogs.

## 9. Offene Fragen

Beantwortet (2026-09-25): Corporate Design: nein, der Skill ist unabhängig anwendbar. Sprache: Skill englisch, Folien in der Sprache des Nutzers. Evaluationsdesign: entfällt, siehe §5. Zielgruppe: Max (korrigiert 2026-09-25).

Offen:
1. Sind die Einsatzfälle intern, Kunden, Vorträge oder gemischt? Passen die vier Profile?
2. Reicht **.pptx** als Ausgabe, oder auch PDF und HTML? (Der Ablauf ist inzwischen werkzeugneutral formuliert, die pptx-Details stehen in einem eigenen Abschnitt.)
3. Gilt der Skill auch in **Claude in PowerPoint** und **Claude Design**? Dort ist zu verifizieren, ob Code ausgeführt werden kann (bestimmt, woher die Messwerte kommen).
4. Sollen später optionale **Stil-Themes** (Swiss, Editorial, Consulting/Daten, Tech, Poster) ergänzt werden?
5. **Lizenz** und Verteilung an die Nutzer (Plugin, Skill-Upload, Repo).

## 10. Nächste Schritte

Reihenfolge nach `AUDIT.md` §5 (Audit 3, 2026-09-25):
1. **Aufräumen** (erledigt in 0.11): 600-Nutzer-Annahme, Feature-Stopp, Evaluationsdesign, Standard-Look entfernt; gerenderte Entwürfe in der Richtungsrunde.
2. **Folien-Detektor** (erste Fassung in 0.11, `scripts/detect.py`): KI-Muster aus der Datei erkennen. Weiter ausbauen, sobald neue Muster auffallen.
3. **Musterbibliothek:** 10 bis 14 Folienmuster aus der Beratungspraxis, jedes mit Zonen, Rasterposition und Textbudget je Zone, werkzeugneutral beschrieben, mit pptxgenjs-Umsetzung. Der Detektor prüft die Budgets.
4. **Regeln an Beratungspraxis anpassen** (`AUDIT.md` H1): Farbrollen, mehrteilige Exhibits in `read`, Deutungs-Box erlaubt, Unterzeile mit Maß und Einheit als Rolle. Vorher echte Decks ansehen (Netzwerkfreigabe nötig, siehe `AUDIT.md` §7).
5. **Werkzeugunabhängigkeit:** Werkzeughinweise aus `SKILL.md` in eine eigene Referenz, Eingang für .odp, Test im PowerPoint-Add-in (lädt der Skill, laufen Skripte).
6. **Beispieldecks neu bauen** mit Entwürfen, Mustern und Detektor; Max urteilt.
7. **Verpacken** mit `skill-creator` (`quick_validate.py`, `package_skill.py`). Nicht mit einem Windows-ZIP-Werkzeug packen: `Compress-Archive` erzeugt Pfade mit Backslashes.

## 11. Arbeitsregeln für dieses Projekt (verbindlich, Freigabe Max 2026-09-25)

Diese Regeln gelten für jede Claude-Session, die an slide-craft arbeitet, auch auf einem anderen Gerät. Sie stammen aus Audit A2 und wurden von Max freigegeben.

1. **Jede neue oder geänderte Regel ausführen.** Wo Werkzeuge verfügbar sind (Node mit pptxgenjs, Python, LibreOffice): ein Minimaldeck bauen, rendern und prüfen, ob die Regel erfüllbar und per Code messbar ist. Ergebnis im CHANGELOG notieren. Wo keine Werkzeuge vorhanden sind, das ausdrücklich im CHANGELOG festhalten.
2. **Kombinationsprüfung.** Bei jeder Zahl prüfen, ob sie mit allen anderen Zahlen desselben Profils gleichzeitig erfüllbar ist (Titelgröße × Wortzahl × Zeilenlimit × Satzspiegel). Rechnen, nicht schätzen.
3. **Jede Regel bekommt eine Herkunft:** belegt (Quelle mit Seite oder Abschnitt), Praktiker, übertragen (ungetestet) oder Startwert. Keine Regel ohne Tag (Tabelle am Ende von `references/rules-core.md`).
4. **Pass/Fail nur, was ein Skript oder die Datei misst.** Alles andere wird als Beobachtung oder "nicht gemessen" berichtet, nie als Schwelle.
5. **Keine Anweisung schreiben, die ein Modell nicht ausführen kann.** Fehlt eine Fähigkeit (Subagents, Codeausführung), den Fallback ehrlich benennen.
6. **Konsistenzprüfung nach Änderungen nicht nur per Textsuche.** Alle Schwellen in eine Tabelle ziehen und paarweise auf Widersprüche prüfen. Querverweise (Prüfpunkt-Nummern, Audit-IDs) auflösen.
7. **Übertragungen aus anderen Domänen** (Web zu Folien, zum Beispiel aus Impeccable) nur mit einem Satz, warum sie gelten, und einem Testfall.
8. **Versionen:** Eine Minor-Version nur mit mindestens einem neuen Testergebnis oder einer belegten Bereinigung. Status im Frontmatter (`metadata.status`): draft, tested oder pilot. Wo der Bereinigungsfall gilt (wie 0.5), das im CHANGELOG ausdrücklich sagen.
9. **Sprache:** Skill-Dateien auf Englisch, Projektdokumente (BRIEF, README, CHANGELOG) auf Deutsch.
10. **Fakten prüfen, bevor Aussagen über Abhängigkeiten gemacht werden:** Jede Datei oder jeden Skill, mit dem slide-craft zusammen läuft (zum Beispiel den pptx-Skill), vorher lesen.
11. **Verpacken** nur mit `package_skill.py` und vorher `quick_validate.py` (auf dem Rechner mit Python), nicht mit einem Windows-ZIP-Werkzeug.

## 12. Weiterarbeiten auf einem anderen Gerät

1. Repo klonen, dieses Dokument (besonders §11, die Arbeitsregeln) und `SKILL.md` lesen.
2. In einer neuen Claude-Session als Kontext angeben: "Lies BRIEF.md und arbeite an Schritt 1 der nächsten Schritte."
3. Für Recherche von Impeccable: Plugin `impeccable` installieren, dann liegen `craft-floor.md`, `typeset.md`, `critique.md` usw. unter dem Plugin-Ordner in `reference/`.
4. Der pptx-Skill (`anthropic-skills:pptx`) muss vorhanden sein, damit Testdecks gebaut werden können.
