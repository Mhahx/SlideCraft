# Auslösetest der Skill-Beschreibung (0.17, 2026-09-25)

Frage: Lädt Claude den Skill bei Anfragen nach Folien, und lässt es ihn bei anderen Aufgaben weg? Gemessen mit Claude Code im Headless-Modus (`claude -p`, Version 2.1.282), Skill als Projekt-Skill installiert, jede Anfrage einmal, höchstens 3 bzw. 4 Züge. Andere Skills waren gleichzeitig verfügbar, darunter `anthropic-skills:pptx`, `slides` und `design`. Ablauf: `bash tests/trigger/run.sh`.

20 Anfragen in `prompts.tsv`: 10 sollen laden (neue Decks auf Deutsch und Englisch, Pitch, Keynote, Vorlesung, Vorstandsvorlage, Design eines bestehenden .pptx überarbeiten oder prüfen), 10 nicht (Text auslesen, konvertieren, Folien zählen, zusammenfassen, E-Mail, Excel, Word, Landingpage, Code, Wissensfrage).

| Lauf | Beschreibung | soll laden | soll nicht laden | gesamt |
|---|---|---|---|---|
| 1 (3 Züge) | Stand 0.17 vor der Änderung | 5 von 10 | 10 von 10 | 15 von 20 |
| 2 (4 Züge) | geschärft | 10 von 10 | 10 von 10 | 20 von 20 |
| 3 (4 Züge, `run.sh`) | geschärft | 10 von 10 | 10 von 10 | 20 von 20 |

**Befund aus Lauf 1:** Bei vier Anfragen („board update“, „keynote“, „Entscheidungsvorlage“, „Kundenumfrage“) stellte das Modell zuerst eigene Rückfragen zu Inhalt und Zahlen und lud den Skill gar nicht. Die Frage nach dem Aussehen fehlte in diesen Rückfragen; genau sie verlangt Runde 1 des Skills. Zwei weitere Fehlschläge (Design eines bestehenden .pptx überarbeiten oder prüfen) endeten an der Zugbegrenzung, während das Modell nach der Datei suchte; sie sind nicht eindeutig.

**Änderung:** Die Beschreibung sagt jetzt, dass der Skill vor der ersten Rückfrage zum Deck lädt, weil er die Fragerunde festlegt, nennt Vortrag, Keynote, Vorlesung, Board- und Status-Update, Entscheidungsvorlage und das gestalterische Prüfen einer bestehenden .pptx, und schließt Zusammenfassen und Zählen ausdrücklich aus. `SKILL.md` Schritt 1: Wurden schon Fragen gestellt, nur die fehlenden Punkte aus Runde 1 nachfragen.

**Nach dem Laden** fragte das Modell nach Zweck, Situation und Aussehen und bot gerenderte Richtungen an (Anfragen 06 und 07 gelesen).

**Grenzen:** Jede Anfrage lief nur einmal pro Lauf; Stichprobe klein; gemessen nur in Claude Code mit dem Standardmodell der Kommandozeile, nicht in claude.ai, im PowerPoint-Add-in oder mit anderen Modellen. Lauf 1 hatte einen Zug weniger als die Läufe 2 und 3.
