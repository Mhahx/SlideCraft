# Projektbeschreibung: slide-craft

Stand: 2026-09-25, Entwurf. Dieses Dokument beschreibt Ziel, Umfang und Entscheidungen, damit die Arbeit auf einem anderen Gerät oder in einer neuen Claude-Session nahtlos weitergeht. Zum Einstieg: dieses Dokument lesen, dann `SKILL.md` und `references/`.

## 1. Problem

Claude erzeugt Präsentationsfolien, die sofort als KI-generiert erkennbar sind: gleiche Kartenraster mit Icon, Überschrift und Text, Verläufe, unbedachte Standardschriften, überladene Bullet-Listen, austauschbare Titel wie "Überblick", Buzzwords. Für Websites löst das Impeccable-Plugin dieses Problem (klare Designhaltung, Verbotsliste, Prüfschritte). Für Folien (.pptx) gibt es nichts Vergleichbares. Der vorhandene `pptx`-Skill regelt vor allem die Dateimechanik, enthält aber auch einen eigenen Abschnitt "Design Ideas", der teils das Gegenteil unserer Regeln empfiehlt (Icon-Zeilen, Kartenraster, große Kennzahl-Callouts, "jede Folie braucht ein Visual", Titel mit 36 bis 44 pt). Deshalb legt slide-craft ausdrücklich fest, dass für Gestaltung und Inhalt slide-craft gilt und aus dem pptx-Skill nur die Technik übernommen wird (Korrektur nach Audit K1).

## 2. Ziel

Ein Claude-Skill, der Claudes Standardergebnis bei Folien dauerhaft auf ein höheres Niveau hebt, ohne dass die Nutzer dafür Gestaltungswissen mitbringen oder Prompts optimieren müssen. Konkret:

1. **Der AI-Look verschwindet.** Folien wirken entschieden und auf das Thema zugeschnitten, nicht austauschbar.
2. **Die Folien argumentieren.** Der Titelstrang aller Folien hintereinander gelesen erzählt die Geschichte (Aussagetitel, eine Botschaft pro Folie, Antwort zuerst).
3. **Das Ergebnis ist verlässlich.** Es soll bei jedem Thema, jeder Person und jedem Lauf ähnlich gut sein. Messbare Regeln statt Geschmack, mit Prüfschritt.
4. **Es passt zur Situation.** Der Skill unterscheidet, ob eine Folie gelesen wird oder einen Redner begleitet, und wählt Textdichte, Schriftgrößen und Aufbau danach.
5. **Es ist nutzbar für einen großen Kreis** (Annahme: etwa 600 Nutzer in einer Organisation), also robust, nachvollziehbar und wartbar.

## 3. Was der Skill tut

- Legt vor dem Bauen den **Kontext** fest (Profil `read`, `talk`, `pitch`, `update`; entspricht Lesedokument, Vortrag, Pitch, Status) und klärt Zweck, Publikum, Dauer in einer Rückfragerunde.
- Zwingt zu **Story vor Design**: erst die Folientitel als Aussagesätze, dann das Layout.
- Leitet für neue Decks eine **Designrichtung** ab (`references/direction.md`): Szene-Satz, Mechanismus, visuelle Welt des Publikums, eine oder mehrere Richtungen (Quick/Choice), fester Ausgang, Richtungsvertrag. Danach ein Selbsttest gegen typische AI-Looks.
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
- Testdecks pro Profil bei einer Blindprüfung nicht als "typisch KI" erkannt werden, verglichen mit dem Standardergebnis ohne Skill.
- Der Prüfdurchgang besteht. Die Prüfpunkte und alle Schwellen stehen **nur** in `references/rules-core.md` (Prüfliste) und `references/profiles.md` (Wertetabelle), nicht hier. Als Pass/Fail zählen nur Punkte, die aus der Datei gelesen, berechnet oder per Skript gemessen werden. Renderschätzungen und Urteile sind Beobachtungen.
- Kein Bericht nennt einen Messwert, der nicht aus der Datei gelesen oder per Code berechnet wurde.
- Der Titelstrang ohne Folienkörper als Argumentation lesbar ist.
- Verschiedene Personen mit verschiedenen Themen ähnlich gute Ergebnisse bekommen (Streuung klein).
- Ein Nutzer ohne Designwissen ohne Nachbesserung ein präsentierbares Deck erhält.

### Evaluationsdesign (festgelegt 2026-09-25, geschärft nach Audit A2-H7)

- **Testset Neuerstellung:** 3 Themen × 4 Profile = 12 Aufgaben. Themen bewusst verschieden (z. B. Datenanalyse, Strategie, Produkt). Zwei Themen auf Deutsch, eines auf Englisch.
- **Zusatzfälle:** (a) drei Bestandsdecks für die Modi `audit`, `polish` und `distill`, (b) ein Fall mit vorgegebener Marke oder Vorlage (prüft die Waiver-Logik), (c) Trigger-Tests, siehe unten.
- **Läufe:** 5 pro Variante und Aufgabe (Startwert; 3 Läufe erlauben keine belastbare Streuungsschätzung). Varianten: mit slide-craft, ohne slide-craft (nur Dateiwerkzeug).
- **Bewerter:** mindestens 3, paarweise Blindprüfung. Pro Deck getrennt abgefragt: (1) "Wirkt KI-generiert: ja/nein", (2) "Würdest du es so präsentieren: ja/nein", (3) Rubrik-Score 0 bis 4 je Bereich der `audit`-Rubrik in `references/commands.md`. Die Präferenz im Paarvergleich wird separat erhoben.
- **Kennzahlen:** Anteil "KI-generiert" je Variante. Anteil "präsentierbar ohne Nachbesserung". Streuung als Standardabweichung des Rubrik-Scores über die 5 Läufe je Aufgabe. Prüfskript-Fehler pro Folie (sobald das Skript existiert). Zusätzlich Kosten: Anzahl Rückfragen, Tokens und Laufzeit pro Deck.
- **Schwellen (Startwerte, unbelegt):** mindestens 70 % der Paare bevorzugen die Variante mit Skill. Anteil "KI-generiert" mit Skill deutlich unter dem ohne Skill. Streuung mit Skill kleiner als ohne. Skriptfehler pro Folie mit Skill klar unter dem Wert ohne Skill.
- **Unabhängigkeit:** Das Urteil "ship" des frischen Reviewers ist nur dann unabhängig, wenn ein Subagent lief. Für die Bewertung des Skills zählen ausschließlich die menschlichen Bewerter.
- **Trigger-Tests:** je 8 bis 10 Anfragen, die den Skill auslösen sollen (formell, umgangssprachlich, deutsch, englisch, "10 Slides zu X") und 8 bis 10 Beinahe-Treffer, die ihn nicht auslösen sollen, darunter reine Extraktion ("Text aus dieser pptx ziehen"), Konvertierung und Lesen. Mit der Infrastruktur von skill-creator (Evals, Description-Optimierung).

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
| Richtungsrunde: Choice ist Standard, Quick nur als Ausnahme | Entscheidung Max, 2026-09-25: Eine zusätzliche Nachricht spart Zeit, wenn sonst ein Deck neu gebaut werden muss. Quick nur bei ausdrücklicher Übergabe ("mach du") oder bei gut festgelegtem Brief und höchstens 10 Folien. In Choice werden Fragen und Richtungen möglichst in einer Nachricht gebündelt. |
| Fester Ausgang "Kategorie-Standard sauber gespielt" | Aus Impeccable übernommen. Bei uns das schlichte Profil `read`/`update` bzw. saubere Keynote-Optik für `talk`. |
| Selbsttest gegen vier Standard-Looks, Richtungsvertrag mit sechs Blöcken, frischer Reviewer, Plan "as built" | Aus Impeccable übernommen und für Folien angepasst. Nicht übernommen: Zufallsskript, Mock-Bilder, Browser-Entscheidungsseite, Build-Phasen-Skripte (Web-Infrastruktur). |
| Kein Corporate Design vorausgesetzt | Der Skill soll unabhängig anwendbar sein (Entscheidung Max, 2026-09-25). |
| Vorrangregel gegenüber dem pptx-Skill | Beide Skills liegen gleichzeitig im Kontext. Ohne Vorrang streut das Ergebnis (Audit K1). |
| Prüfungen mit Herkunft kennzeichnen, keine erfundenen Messwerte | Ein LLM kann Kontrast oder Füllgrad aus einem Bild nicht verlässlich messen (Audit K2). Werte kommen aus der Datei oder aus Code. |
| Farbzählung: 1 Akzent + höchstens 1 Signalfarbe, Neutrale zählen nicht | Vorher dreifach unterschiedlich definiert und mit Statusampeln unvereinbar (Audit H5). |
| Schriften: Nutzer-/Markenschrift, sonst Safe-Liste mit bewusster Paarung | Fremdrechner und verlässliche Überlaufprüfung (Audit H2). |
| Prüfskript vor den Testdecks | Ohne Skript sind die Testdecks nicht messbar auszuwerten (Audit K2). |

## 7. Recherchestand und Quellen

Regeln der Consulting-Häuser (McKinsey, BCG, Bain) nach einer Praktiker-Quelle, [Deckary](https://deckary.com/blog/consulting-slide-standards). Das ist ein Blog des Anbieters eines KI-Folienwerkzeugs, keine offizielle Firmenrichtlinie und kein Konsens mehrerer Quellen. Bestätigt sind die Grundsätze (Aussagetitel, eine Botschaft pro Folie, Quellenzeile). Die Zahlenwerte (15 Wörter, 60 Sekunden) sind nicht unabhängig verifiziert. Als Primärliteratur ergänzen: Barbara Minto, "The Pyramid Principle" (Seitenzahlen noch offen). Aussagetitel bis 15 Wörter und 2 Zeilen, eine Aussage pro Folie, höchstens 2 Schriften, 3 bis 4 Farben, Quelle auf jeder Datenfolie, Titel oben, ein Exhibit, Quelle und Seitenzahl unten, 60-Sekunden-Regel. Unterschiede: McKinsey textlastiger und strukturierter, BCG visueller, Bain mit stärkerem Erzählbogen (Answer-first).

Apple/Jobs (Sekundärquellen: [Presentation Zen](https://presentationzen.com/blog/steve-jobs-and-visual-presentation), [Forbes 3-Sekunden-Regel](https://www.forbes.com/sites/carminegallo/2025/10/29/why-steve-jobs-followed-the-3-second-slide-rule-for-better-presentations/)): eine Idee pro Folie, keine Bullets, eine große Zahl, 60 pt und mehr, Folie in drei Sekunden erfasst.

Impeccable (lokal gelesen): `craft-floor.md` (Refuse-Liste, Prüfungen), `typeset.md`, `critique.md`, `audit.md`, `polish.md`, `distill.md`, `SKILL.md`, `new-work.md` (Richtungsableitung, Selbsttest gegen Standard-Looks, Richtungsvertrag, Abschluss mit frischem Reviewer), `shape.md` (Rückfragekadenz), `init.md` (Trennung von Produktwahrheit und Optik).

Weitere Fundstellen: Figma-Community "Top 50 Startup Pitch Decks" und "All Apple Event Summary Slides 2019-2026" (per Figma-MCP nur lesbar, wenn eine eigene Kopie in Figma liegt und ihr Link mit Datei-Key bereitgestellt wird), `nghiahsgs/skills-slides` (HTML-Decks mit Anti-Slop-Ansatz), `maxsoweski/claude-design-skills` (unter anderem ein Müller-Brockmann-Skill), `proyecto26/slides-ai-plugin`.

## 8. Wichtige Einschränkungen des Entwurfs

- **Alle Zahlenwerte sind Startwerte** (Rand 0,667 in, Wort- und Zeichenlimits pro Profil, Titel-Wortgrenzen, Schriftgrößen). Sie sind an den recherchierten Regeln orientiert, aber nicht belegt und noch an keinem echten Deck getestet. Die Titel-Wortgrenzen beruhen auf einer Zeilenkapazitäts-Schätzung (durchschnittliche Zeichenbreite etwa 0,5 em), nicht auf einer Messung.
- Das **Prüfskript** `scripts/check_deck.py` (seit 0.6, Planabgleich in `scripts/plan.py` seit 0.7) liest die .pptx aus dem OOXML und misst alles, was aus der Datei lesbar oder berechenbar ist. Es **rendert nicht** (auf dem Entwicklungsrechner fehlt LibreOffice): Überlauf ist nur eine Schätzung (0,5 em Zeichenbreite), optische Ausrichtung und Abstandsraster (8 pt) sind nicht implementiert und werden als "not_measured" gemeldet. Der Planabgleich (Prüfpunkt 12) vergleicht Folienzahl, Titel, Schriften, Größen, Gewichte, Palette und Rand mit `deck-plan.md`, prüft den Plan gegen seine eigenen Konsistenzregeln und kann für ein Deck ohne Plan einen Plan aus der Datei ableiten (`--derive-plan`). Layouts werden nur über den Namen verglichen. Getestet ist es an zwei pptxgenjs-Decks und an handgebautem OOXML, nicht an echten PowerPoint-Decks der Zielgruppe.
- Der Fallback ohne Subagents beim frischen Review ist eine **Selbstprüfung desselben Modells**, keine unabhängige Prüfung.
- Jede Regelgruppe trägt eine Herkunftskennzeichnung (belegt, Praktiker, übertragen, Startwert), siehe Tabelle am Ende von `references/rules-core.md`.
- Beide bisherigen Audits verwenden dieselben IDs (K1, H1 usw.). Das erste ist im CHANGELOG als "A1-…" aufgelöst, das zweite dort als "A2-…". IDs mit dem Zusatz "Audit K1" in diesem Dokument beziehen sich auf das erste Audit (A1).
- Die **Vorbild-Regeln stammen aus Sekundärquellen**. Für Apple gibt es keine offizielle Anleitung, für die Consulting-Häuser nur Blogs.

## 9. Offene Fragen

Beantwortet (2026-09-25): Corporate Design: nein, der Skill ist unabhängig anwendbar. Sprache: Skill englisch, Folien in der Sprache des Nutzers. Evaluationsdesign: siehe §5.

Offen:
1. Sind die Einsatzfälle intern, Kunden, Vorträge oder gemischt? Passen die vier Profile?
2. Reicht **.pptx** als Ausgabe, oder auch PDF und HTML? (Der Ablauf ist inzwischen werkzeugneutral formuliert, die pptx-Details stehen in einem eigenen Abschnitt.)
3. Gilt der Skill auch in **Claude in PowerPoint** und **Claude Design**? Dort ist zu verifizieren, ob Code ausgeführt werden kann (bestimmt, woher die Messwerte kommen).
4. Sollen später optionale **Stil-Themes** (Swiss, Editorial, Consulting/Daten, Tech, Poster) ergänzt werden?
5. **Lizenz** und Verteilung an die Nutzer (Plugin, Skill-Upload, Repo).

## 10. Nächste Schritte

0. **Feature-Stopp** (Freigabe Max, 2026-09-25, siehe §11). Das Prüfskript existiert seit 0.6, der Planabgleich seit 0.7. Der Stopp gilt weiter, bis es eine Renderprüfung hat und an echten Decks kalibriert ist (Schritte 1 und 3), sonst wären neue Regeln wieder ungeprüft. Freigabe zum Aufheben liegt bei Max.
1. **Prüfskript** (erste Fassung steht in `scripts/check_deck.py`, Rest offen: Renderprüfung mit LibreOffice, Abstandsraster, Test an echten Decks; Planabgleich seit 0.7 vorhanden) — Ausgangsbeschreibung (Priorität vor den Testdecks, gehört nach `scripts/` im Skill, feste JSON-Ausgabe pro Folie mit Wert und Herkunft): .pptx aus dem OOXML auslesen (Schriftgrößen, Familien, Farben, Positionen, Ränder), Designfarben auflösen, Kontrast per WCAG-Formel berechnen, Füllgrad und Textmenge zählen. Rendern nur für Überlauf und Gesamteindruck. Pro Folie berichten, jeder Wert mit Herkunft. Das Skript liest auch den Deck-Plan (`deck-plan.md`) und meldet Abweichungen von dessen Schriften, Rollengrößen, Palette, Rändern und Layouttypen.
2. **Testdecks** nach dem Evaluationsdesign in §5 bauen (12 Aufgaben, mit und ohne Skill) und mit dem Prüfskript auswerten. Regeln und Zahlenwerte anpassen.
3. **Kalibrierung** an echten Decks der Zielgruppe (Beispiele sammeln, gute und schlechte).
4. **Validieren und Verpacken** mit `skill-creator` (`quick_validate.py`, `package_skill.py`) auf dem privaten Rechner. Nicht mit einem Windows-ZIP-Werkzeug packen: `Compress-Archive` erzeugt Pfade mit Backslashes. Trigger-Beschreibung mit Trigger-Evals testen, Einsatz bei einer kleinen Pilotgruppe, dann breiter.
5. Optional: Stil-Themes, englische Fassung.

## 11. Arbeitsregeln für dieses Projekt (verbindlich, Freigabe Max 2026-09-25)

Diese Regeln gelten für jede Claude-Session, die an slide-craft arbeitet, auch auf einem anderen Gerät. Sie stammen aus Audit A2 und wurden von Max freigegeben.

1. **Evidenz vor Features.** Keine neue Regel und kein neuer Ablaufschritt, solange das Prüfskript (§10, Schritt 1) nicht existiert. Bereinigung, Fehlerkorrektur und das Skript selbst sind erlaubt. Weicht ein Vorschlag davon ab, sage es und frage nach.
2. **Jede neue oder geänderte Regel ausführen.** Wo Werkzeuge verfügbar sind (Node mit pptxgenjs, Python, LibreOffice): ein Minimaldeck bauen, rendern und prüfen, ob die Regel erfüllbar und per Code messbar ist. Ergebnis im CHANGELOG notieren. Wo keine Werkzeuge vorhanden sind, das ausdrücklich im CHANGELOG festhalten.
3. **Kombinationsprüfung.** Bei jeder Zahl prüfen, ob sie mit allen anderen Zahlen desselben Profils gleichzeitig erfüllbar ist (Titelgröße × Wortzahl × Zeilenlimit × Satzspiegel). Rechnen, nicht schätzen.
4. **Jede Regel bekommt eine Herkunft:** belegt (Quelle mit Seite oder Abschnitt), Praktiker, übertragen (ungetestet) oder Startwert. Keine Regel ohne Tag (Tabelle am Ende von `references/rules-core.md`).
5. **Pass/Fail nur, was ein Skript oder die Datei misst.** Alles andere wird als Beobachtung oder "nicht gemessen" berichtet, nie als Schwelle.
6. **Keine Anweisung schreiben, die ein Modell nicht ausführen kann.** Fehlt eine Fähigkeit (Subagents, Codeausführung), den Fallback ehrlich benennen.
7. **Konsistenzprüfung nach Änderungen nicht nur per Textsuche.** Alle Schwellen in eine Tabelle ziehen und paarweise auf Widersprüche prüfen. Querverweise (Prüfpunkt-Nummern, Audit-IDs) auflösen.
8. **Übertragungen aus anderen Domänen** (Web zu Folien, zum Beispiel aus Impeccable) nur mit einem Satz, warum sie gelten, und einem Testfall.
9. **Versionen:** Eine Minor-Version nur mit mindestens einem neuen Testergebnis oder einer belegten Bereinigung. Status im Frontmatter (`metadata.status`): draft, tested oder pilot. Wo der Bereinigungsfall gilt (wie 0.5), das im CHANGELOG ausdrücklich sagen.
10. **Sprache:** Skill-Dateien auf Englisch, Projektdokumente (BRIEF, README, CHANGELOG) auf Deutsch.
11. **Fakten prüfen, bevor Aussagen über Abhängigkeiten gemacht werden:** Jede Datei oder jeden Skill, mit dem slide-craft zusammen läuft (zum Beispiel den pptx-Skill), vorher lesen.
12. **Verpacken** nur mit `package_skill.py` und vorher `quick_validate.py` (auf dem Rechner mit Python), nicht mit einem Windows-ZIP-Werkzeug.

## 12. Weiterarbeiten auf einem anderen Gerät

1. Repo klonen, dieses Dokument (besonders §11, die Arbeitsregeln) und `SKILL.md` lesen.
2. In einer neuen Claude-Session als Kontext angeben: "Lies BRIEF.md und arbeite an Schritt 1 der nächsten Schritte."
3. Für Recherche von Impeccable: Plugin `impeccable` installieren, dann liegen `craft-floor.md`, `typeset.md`, `critique.md` usw. unter dem Plugin-Ordner in `reference/`.
4. Der pptx-Skill (`anthropic-skills:pptx`) muss vorhanden sein, damit Testdecks gebaut werden können.
