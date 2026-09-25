# Audit 4: Stand 0.12 gegen das Ziel

Stand: 2026-09-25. Gegenstand: Branch `claude/github-audit-slides-1bkz9p` mit Version 0.12-draft (Pull Request #2 offen), also Audit 3 und seine Umsetzung (0.11), die Musterbibliothek (0.12) und alle Beispieldecks. Das Audit ändert keinen Code und keine Regel.

Ziel (unverändert aus `AUDIT.md` §0): Max bekommt mit wenig Aufwand gute Decks. Typische KI-Muster werden verlässlich vermieden, die Gestaltung folgt professionellen Beratungsdecks, und das gilt gleich in Claude, PowerPoint, LibreOffice und Claude Design.

**Umsetzung (Nachtrag, 0.13):** Empfehlung 1 bis 3 aus §6 und der Füllgrad als Beobachtung (H1) sind umgesetzt, siehe CHANGELOG 0.13. Offen sind Empfehlung 4 (übrige Werte) und 5 (ganzes Deck nach neuem Ablauf) sowie die Fragen 1 und 3 in §7.

## 1. Kurzantwort

Der Stand ist deutlich näher am Ziel als bei Audit 3:
- Der Detektor erkennt die KI-Muster.
- Der Look wird aus gerenderten Entwürfen gewählt.
- Es gibt 14 belegte Folienmuster.

Aber **die Teile greifen noch nicht sauber ineinander.** Drei Punkte verhindern, dass ein neues Deck ohne Reibung entsteht:

1. **Die Reihenfolge stimmt nicht (K1).** Der Look wird gewählt, bevor die Story steht. Die Entwürfe brauchen aber echten Inhalt, und BRIEF §3 verlangt „Story vor Design“.
2. **Muster und Designrichtungen widersprechen sich (K2).** Die Muster legen den Aufbau fest. Die Richtungen sollen sich aber „in der Komposition, nicht nur in der Farbe“ unterscheiden.
3. **Das Prüfskript ist aus dem Skill heraus kaum aufrufbar (K3).** Es fehlen Befehl, Pfad, Abhängigkeiten und ein Fallback.

Dazu kommt: Wer den Ablauf heute befolgt, bekommt bei Diagrammen in normaler Größe und bei allen Vortragsmustern einen Füllgrad-Fehler. Die Regel „alles in einer Runde beheben“ drängt Claude dann dazu, Exhibits zu verkleinern. Genau das hat die schwachen ersten Beispieldecks erzeugt (H1).

## 2. Was seit Audit 3 trägt

| Punkt aus Audit 3 | Stand |
|---|---|
| K1 Detektor erkennt KI-Muster nicht | behoben (0.11): 16 Regeln, Testdeck fällt auf jeder Folie durch, an echten Decks nachkorrigiert (0.12) |
| K2 keine positive Gestaltung | teilweise: 14 Muster mit Zonen und Budgets (0.12); Kompositionsregeln innerhalb der Muster fehlen noch (K2 unten) |
| K3 keine Musterbibliothek | behoben (0.12), belegt mit 9 echten Decks |
| H1 Regeln gegen Beratungspraxis | gemessen (`research/beratungsdecks.md`), noch nicht umgesetzt (Schritt 4) |
| H2 zu viel Prozess | teilweise: Feature-Stopp, Evaluationsdesign und 600-Nutzer-Annahme weg; Ablauf selbst unverändert lang (Abschnitt 5) |
| H3 Werkzeugunabhängigkeit | Rendern je Umgebung beschrieben; Skript nur für .pptx, Werkzeughinweise weiter in `SKILL.md` |
| H4 kein Bildweg | offen: nur Platzhalter, keine Regel, woher Fotos kommen |
| M1 Aufräumen | erledigt |

## 3. Befunde

Schwere: **K** = verhindert einen reibungslosen Ablauf, **H** = führt zu schwächeren Decks oder Fehlalarmen, **M** = Aufräumen.

### K1: Look vor Story, Entwürfe ohne Inhalt
`SKILL.md` Schritt 3 (Richtung mit gerenderten Entwürfen) kommt vor Schritt 4 (Story) und Schritt 5 (Plan mit Muster je Folie). `direction.md` verlangt aber für jeden Entwurf „the deck's real content“ und „the most typical content slide (the key chart, the key comparison)“. Welche Folie typisch ist und welches Diagramm das Schlüsseldiagramm wird, ergibt sich erst aus Titelstrang und Muster-Auswahl.

**Folge:** Claude muss für die Entwürfe Inhalt raten oder vorziehen. Das widerspricht BRIEF §3 („Zwingt zu Story vor Design: erst die Folientitel als Aussagesätze, dann das Layout“).

**Vorschlag:** Brief → Profil → **Story-Skelett** (Titelstrang plus ein Muster je Folie) → Entwürfe (Titelfolie plus die häufigste oder wichtigste Musterfolie aus dem Skelett, mit echtem Titel und echten Zahlen) → vollständiger Plan → Bau. Für Max bleibt es bei zwei Runden. Das Story-Skelett kann er in der Entwurfsnachricht gleich mit prüfen.

### K2: Muster legen den Aufbau fest, Richtungen sollen ihn variieren
- `patterns.md`: „The pattern fixes structure; the chosen direction fixes the look: colours, type, image world.“
- `direction.md`, Derive 4: „The directions must differ in composition, not only in colour: the same layout in three palettes is one direction.“

Beides kann nicht gleichzeitig gelten, sobald die Entwürfe aus Mustern gebaut werden.

**Vorschlag:** Festlegen, was eine Richtung **innerhalb** der Muster wählen darf, also Musterungsvarianten. Zum Beispiel:
- Deutungsspalte als feine Linie oder als Fläche
- Diagramm links oder rechts
- bildgeführt (P12/P14 häufig, Fotos) oder typografisch
- dicht oder luftig (Budget am oberen oder unteren Ende)
- heller oder dunkler Grund
- wo der Akzent sitzt (Balken, Zeile, Band)
- Titel serif oder serifenlos

Regel: Zwei Richtungen unterscheiden sich in mindestens zwei dieser Entscheidungen, nicht nur in der Farbe. Die echten Decks zeigen genau das: Bain (Foto, schwarze Platten, Rot auf Grau) und McKinsey DC (Georgia-Titel, graue Deutungsfläche, Blautöne) nutzen dieselben Folientypen und sehen völlig verschieden aus.

### K3: Das Prüfskript wird vom Skill nicht konkret aufgerufen
Die Regeldateien nennen `scripts/check_deck.py`, aber nirgends:
- den Befehl mit Profil, Plan, Rendern und Ausnahmen (der steht nur im README, das der Skill nicht lädt),
- den Pfad relativ zum installierten Skill (Impeccable nutzt dafür `${CLAUDE_SKILL_DIR}`),
- die Abhängigkeiten (Python 3; fürs Rendern LibreOffice mit Impress und poppler; in dieser Umgebung fehlten beide, bis ich sie nachinstalliert habe),
- was zu tun ist, wenn etwas fehlt.

Titelfolie und Trenner müssen außerdem per `--exempt` von Hand ausgenommen werden, obwohl die Folienvorlagen seit 0.12 nach Mustern benannt sind (`P01 cover`, `P02 divider-agenda`) und das Skript sie selbst erkennen könnte.

**Folge:** Claude prüft unter Umständen gar nicht oder nur „nach Gefühl“. Das ist genau das, was der Detektor verhindern soll.

**Vorschlag:** In `SKILL.md`, Schritt 7, ein fester Befehlsblock, dazu Abhängigkeiten und Fallback: „Skript nicht ausführbar → sagen, Prüfliste manuell, alle Werte als Beurteilung markieren“. Im Skript automatisch ausnehmen: Vorlagen, deren Name mit `P01` oder `P02` beginnt.

### H1: Füllgrad-Fehler drängen zum Verkleinern
Der Testbau (`examples/patterns/README.md`) zeigt Füllgrad-Fehler bei P05 und P06 in `read` (82 % bei 75 %) und bei allen `talk`-Mustern (46–80 % bei 30 %). Das zweizeilige 40-pt-Titelfeld belegt allein 23 % der Live-Fläche. Solange das ein Fail ist, schreibt der Ablauf (Schritt 7: „fix everything in one batch“) vor, ihn zu beheben. Der einfachste Weg dahin ist, Diagramme zu verkleinern.

**Vorschlag bis zur Kalibrierung:** Den Füllgrad als Beobachtung melden statt als Fail. Oder einen Musterwert je Muster statt je Profil festlegen. Das entscheidest du, siehe Frage 2.

### H2: Widersprüche, die ich mit 0.12 selbst eingeführt habe
- `profiles.md` (`read`): „one central exhibit“ und „one exhibit in the body“ gegen P06 two-exhibits. Die Belege für P06 kommen aus Lesedecks (BCG-MEDIA S. 30, MCK-USPS S. 8).
- `refuse.md` und `rules-core.md`: Inhaltsfolie erst ab 15 Folien, gegen `patterns.md` P02: „the divider version is allowed from 10“.
- `patterns.md`, Rahmen: Der Tracker ist für alle Muster erlaubt, `profiles.md` und `rules-core.md` erlauben ihn nur in `read` und `update`.
- `rules-core.md` §3: „Recurring elements … at exactly the same position“. Das Skript prüft seit 0.12 je Folienvorlage, der Regeltext sagt das noch nicht.
- `SKILL.md`, Werkzeughinweise: „Charts stay native … unless PowerPoint has no native form“. PowerPoint hat einen nativen Wasserfall, pptxgenjs kann ihn aber nicht schreiben. P08 ist deshalb aus Formen gebaut. Die Regel sollte sagen: „unless the building tool cannot write the native form“.

### H3: Fehlalarme des Detektors bei Musterelementen
- **Statusmarke als Kicker:** Eine Statusmarke oben rechts („Preliminary“, 10 pt, direkt über dem Titel), wie sie der Rahmen in `patterns.md` vorsieht und wie sie MCK-DC S. 8 zeigt, meldet der Detektor als `kicker`: Fail in `talk` und `pitch`, Beobachtung in `read`. Nachgeprüft mit einem synthetischen Deck. Der Tracker links oben („Recent context“) wird ebenso gemeldet. Laut Glossar (`rules-core.md`) sind beide Tracker, keine Kicker.
- **Spiegelungen:** P04 sieht das Diagramm links vor. Die Pitch-Beispieldecks und einige Bain-Folien setzen den Text links. Das ist kein Detektor-Fall, sollte aber in `patterns.md` als erlaubte Variante stehen (siehe K2).

**Vorschlag:** Den Kicker-Test auf mittig oder links über dem Titel sitzende dekorative Labels beschränken. Rechtsbündige Statusmarken und Labels mit Kapitel- oder Statuswort nimmt er aus.

### H4: Dein Urteil über die E-Flugzeug-Decks gegen mein Urteil und die Regeln
Dir gefallen `talk`, `pitch` und `update` (Rückmeldung vom 2026-09-25). In Audit 3 (K2) habe ich dieselben Decks kritisiert:
- gleicher Aufbau aller Titelfolien,
- Violett als KI-typische Farbe,
- aus Formen gebaute Grafiken,
- leeres unteres Drittel.

Seit 0.11 meldet der Detektor den violetten Grund von `talk` als Beobachtung (`default-look`), und `refuse.md` rät von „decorative illustrations built from simple shapes“ ab.

Laut BRIEF §5 ist dein Urteil der Maßstab. Dass du die Decks magst, heißt:
- Entweder waren meine Kritikpunkte zu streng.
- Oder sie betreffen etwas anderes als das, was dir gefällt, zum Beispiel ruhige Fläche, eine große Zahl pro Folie und Grafiken, die das Thema zeigen.

Beides ist mit den Regeln vereinbar, wenn eine Unterscheidung schärfer wird:
- **Grafiken, die den Sachverhalt zeigen, bleiben erwünscht.** Beispiele: Reichweitenringe, Streckenkarte, Steigflugprofil in `talk`.
- **Grafiken, die nur schmücken, werden vermieden.** Beispiel: das Flugzeug in der Fortschrittsleiste von `pitch`.

Das klärt Frage 1.

Wichtig: Nichts in 0.12 blockiert diese Decks. Sie bestehen weiter ohne Fail. Violett und die Grafiken erscheinen nur als Beobachtung und sind erlaubt, wenn die gewählte Richtung sie vorsieht.

### H5: Bekannte pptxgenjs-Fallen fehlen in den Werkzeughinweisen
Beim Bau der Beispieldecks (`examples/e-flugzeuge/README.md`, Befund 7) und beim Testbau der Muster gefunden, aber nicht in `SKILL.md` übernommen:
- Textfeld-`margin` in Punkt als [links, rechts, unten, oben], Tabellenzellen-`margin` in Zoll
- `lineDash` gilt nur als ein Wert für alle Reihen
- Hervorhebung eines Balkens: eine Reihe mit Farbe je Punkt (`chartColors` je Punkt), nicht zwei gestapelte Reihen, denn `dataLabelPosition` wirkt bei gestapelten Diagrammen nicht
- Position und Größe eines Platzhalters lassen sich pro Folie nicht überschreiben, dafür braucht es eine eigene Folienvorlage je Muster
- kein natives Wasserfalldiagramm

Jede dieser Fallen hat beim Bau eine Korrekturrunde gekostet.

### M1: Umfang der Anweisungen
`SKILL.md` plus `references/` sind rund 11.000 Wörter. Für ein neues Deck verweist der Ablauf auf fast alles: `direction.md`, `profiles.md`, `deck-plan.md`, `patterns.md`, `rules-core.md`, `refuse.md`. Nur `commands.md` braucht es ausschließlich für Modi. Die Menge ist tragbar, aber es fehlt eine Ladereihenfolge: was wann gelesen werden muss. Impeccable lädt `craft-floor.md` ausdrücklich erst direkt vor dem Bau.

### M2: Veraltetes und Nachvollziehbarkeit
- `examples/e-flugzeuge/*/check.json` stammt noch aus 0.10 und enthält keine Detektor-Ergebnisse (nachgeprüft).
- Das Messskript der Recherche (`measure.py`) liegt nicht im Repo. Die Messwerte in `research/beratungsdecks.md` lassen sich deshalb nicht erneut erzeugen.
- `AUDIT.md` (Audit 3) beschreibt teilweise einen überholten Stand. Der Nachtrag oben weist darauf hin, die Befundliste selbst ist aber nicht aktualisiert.
- Der Detektor prüft die Textbudgets je Zone noch nicht (bekannt, BRIEF §10 Schritt 3).

### M3: Firmenvorlagen im PowerPoint-Add-in
`patterns.md` verlangt, die Folienvorlagen nach dem Muster zu benennen, weil Prüfpunkt 12 Vorlagen über den Namen abgleicht. Eine Firmenvorlage im Add-in hat aber feste Vorlagennamen. Dann meldet Prüfpunkt 12 Abweichungen, obwohl alles richtig ist. Es fehlt eine Zuordnung im Plan („P04 chart-rail = Vorlage ‚Titel und Inhalt 2‘“).

## 4. Decks im Vergleich

| Deck | Stärke | Schwäche | Detektor 0.12 |
|---|---|---|---|
| E-Flugzeug `talk` (0.10) | eine Zahl pro Folie, ruhige Fläche, Grafiken zeigen das Thema; **gefällt Max** | sieben von acht Folien gleich aufgebaut; Violett-Grund | kein Fail, Beobachtung `default-look` |
| E-Flugzeug `pitch` (0.10) | klarer Bogen, Tabellen und Balken sauber; **gefällt Max** | Exhibits klein oben rechts, unteres Drittel leer; Flugzeug in der Fortschrittsleiste | kein Fail |
| E-Flugzeug `update` (0.10) | Status als Fläche mit Wort, Trend und nächster Schritt je Folie; **gefällt Max** | unteres Drittel leer | kein Fail |
| E-Flugzeug `read` (0.10) | am nächsten an McKinsey: Tabelle plus Balken, Beschlussleiste | Diagramme klein, Titelfolie wie die anderen | kein Fail |
| Mustertest `read` (0.12) | Aufbau wie die echten Lesedecks, Fläche genutzt, Belege je Muster | bewusst ohne Look (neutral), wirkt dadurch nüchtern; Füllgrad-Fehler P05, P06 | kein Fail, `stat-row` gewollt |
| Mustertest `talk` (0.12) | klare Statements, eine Zahl | nur Platzhalterfotos; Füllgrad-Fehler auf allen Mustern | kein Fail |
| Echte Decks (9) | dichter, Annotationen am Exhibit, Tracker und Statusmarken, Quelle auf fast jeder Datenfolie | Lesedecks sehr textlastig (190–300 Wörter), 7–8-pt-Fußnoten | nicht prüfbar (PDF) |

Mein Schluss: Die Mustertests liefern den **Aufbau**, die E-Flugzeug-Decks den **Charakter**, der dir gefällt. Ein gutes Deck nach dem nächsten Umbau sollte beides verbinden. Das ist genau der Punkt aus K2: Muster plus Richtung, die innerhalb der Muster echte Gestaltungsentscheidungen trifft.

## 5. Ablauf durchgespielt

Beispielanfrage: „Mach mir 8 Folien für den Vorstand zur Umstellung auf E-Flugzeuge.“ Gegangen nach `SKILL.md` 0.12, Schritt für Schritt.

| Schritt | Was passiert | Runde mit Max | Problem |
|---|---|---|---|
| 1 Brief | 3–4 Fragen: Zweck, Situation, Wirkung/Vorbilder, Grenzen | 1 | keins |
| 2 Profil | `read` oder `update` aus den Antworten | – | keins |
| 3 Richtung | Szene, Mechanismus, 5–7 Welten, 2–3 Richtungen, je 2 Folien bauen, rendern, Detektor | 2 | Inhalt der typischen Folie muss geraten werden (K1); Richtungen dürfen den Aufbau nicht ändern (K2); Befehl fürs Rendern fehlt im Skill (K3) |
| 4 Story | Titelstrang | – | kommt zu spät (K1) |
| 5 Plan | Plan mit Muster je Folie, zeigen, weiterbauen | (3) | bei offenen Annahmen noch eine Runde |
| 6 Bau | 8 Folien aus Mustern | – | pptxgenjs-Fallen (H5) |
| 7 Prüfen | Skript, eine Korrekturrunde, frischer Prüfer | – | Befehl fehlt (K3); Füllgrad-Fehler drängen zum Verkleinern (H1); Statusmarke als Kicker (H3) |
| 8 As built | Plan nachführen | – | keins |

Aufwand für dich: zwei Runden, in Ausnahmen drei. Das ist angemessen. Der Aufwand für Claude ist hoch, aber vertretbar: 3 Entwurfsdecks, 1 Deck, 2 Render- und Prüfläufe, 1 Prüfer. Die Reibung liegt nicht in der Zahl der Schritte, sondern in K1 bis K3.

## 6. Empfehlung und Reihenfolge

1. **Kleine Korrekturen** (H2, H3, H5, M2): Widersprüche aus 0.12 bereinigen, Kicker-Test für Statusmarken und Tracker korrigieren, pptxgenjs-Fallen in die Werkzeughinweise, `check.json` der Beispieldecks neu erzeugen, Messskript nach `research/`.
2. **Prüfskript aufrufbar machen** (K3): Befehlsblock, Pfad, Abhängigkeiten und Fallback in `SKILL.md`; automatische Ausnahme für `P01`/`P02`.
3. **Ablauf neu ordnen** (K1) und **Richtungen innerhalb der Muster** definieren (K2).
4. **Werte kalibrieren** (H1, BRIEF §10 Schritt 4): Wörter je Folie, Füllgrad, Fußnoten, Fußzeile, Farbrollen.
5. **Ein Deck komplett nach dem neuen Ablauf bauen**, mit echten Entwürfen zur Auswahl, und du urteilst.

## 7. Fragen an Max

1. **Was genau gefällt dir an `talk`, `pitch` und `update`?** Zum Beispiel die großen Zahlen, die ruhige Fläche, die Farben, die Grafiken oder wenig Text. Und stört dich an den Mustertests etwas, abgesehen vom neutralen Test-Look?
2. **Füllgrad bis zur Kalibrierung:** nur noch als Hinweis (Beobachtung), damit Claude Diagramme nicht verkleinert? Oder als Fehler lassen?
3. **Dichte für Lesedecks:** Sollen `read`-Folien so dicht werden wie bei McKinsey (bis etwa 250 Wörter), oder bewusst schlanker bleiben (etwa 120–150)?

## 8. Grenzen dieses Audits

- Der Ablauf ist gedanklich durchgespielt, nicht mit echten Entwürfen in einer neuen Sitzung.
- Die Bewertung der Decks ist mein Urteil, außer wo deins ausdrücklich genannt ist.
- Das Audit stammt von demselben Modell, das 0.11 und 0.12 gebaut hat, und ist daher keine unabhängige Prüfung.
- Geprüft sind nur .pptx-Wege. PowerPoint-Add-in und Claude Design sind nicht ausprobiert.
