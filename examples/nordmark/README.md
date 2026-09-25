# Testdeck Nordmark: erster kompletter Lauf des Ablaufs (0.15)

Fiktives Thema: Die Regionalbank Nordmark baut ihr Filialnetz von 42 auf 28 Filialen um, mit 6 SB-Ankern und zwei Beratungsbussen. Entscheidungsvorlage für den Vorstand, Profil `read`. Alle Zahlen sind erfunden und in sich stimmig.

Gebaut genau nach `SKILL.md` 0.14/0.15, mit Max als Nutzer:

| Schritt | Was passiert ist | Datei |
|---|---|---|
| 1 Brief | vier Fragen; Max: nüchtern und vertrauenswürdig mit Blick nach vorn, SB-Standorte als Vertrauensanker, dunkles Grün, Landschaftsfotos, keine Hausvorgaben | `plan.md` §1 |
| 2 Profil | `read` (Vorab-PDF, dann Sitzung) | `plan.md` §1 |
| 3 Story-Skelett | 9 Aussagetitel, je Folie ein Muster (8 Muster) | `plan.md` §3, §5 |
| 4 Richtung | drei Richtungen als gerenderte Entwürfe (A Geschäftsbericht, B Flurkarte, C Weitblick), zusammen mit dem Skelett in einer Nachricht; Max wählte "das Bild aus C, die rechte Seite von A" | `drafts/`, `drafts/entwuerfe.png` |
| 5 Plan | Richtung, Musterungsvarianten, Richtungsvertrag, Designsystem | `plan.md` §2, §4 |
| 6 Bau | 9 Folien | `build.js`, `deck.pptx` |
| 7 Prüfung | Prüfskript mit Plan und Rendering, Selbstprüfung | `check.json`, `render/` |
| 8 As built | Plan nachgeführt | `plan.md` §7 |

Neu bauen: `NODE_PATH=<node_modules mit pptxgenjs> node examples/nordmark/build.js` (Entwürfe: `drafts.js`). Prüfen: `python3 plugin/skills/slide-craft/scripts/check_deck.py examples/nordmark/deck.pptx --plan examples/nordmark/plan.md --render-dir examples/nordmark/render`.

Fotos: Wikimedia Commons, CC BY-SA 4.0, Nachweise in `assets/CREDITS.md` und auf den Folien.

## Was der Lauf über den Skill gezeigt hat

1. **Der Ablauf trägt.** Zwei Runden mit Max, dann ein fertiges Deck ohne Rückfrage. Das Skelett stand vor den Entwürfen, deshalb zeigten die Entwürfe echten Inhalt (Schlüsselfolie mit 42 Filialen).
2. **Mischungen sind der Normalfall.** Max wählte keine der drei Richtungen ganz, sondern kombinierte zwei. Das sieht `direction.md` vor ("a named change or a mix"). Die Musterungsvarianten machten die Mischung eindeutig beschreibbar.
3. **Der Planabgleich findet echte Fehler.** Er meldete drei Fehler im eigenen Designsystem (zu dichte Schriftgrößen, fette Texte ohne Rolle, fehlender Hintergrund der Titelfläche). Das hätte ohne Plan niemand gesehen.
4. **Fehler im Skill, beim Lauf gefunden und behoben (0.15):**
   - Die Vorlage in `deck-plan.md` zeigte die Rollen- und Folientabelle ohne führendes `|`. Das Skript liest aber nur Markdown-Tabellen. Ein Plan nach der alten Vorlage wurde nicht erkannt.
   - Das Skript kannte "Rand" nicht als Wort für den Rand.
   - Die Seitenzahl im unteren Rand (seit 0.14 erlaubt) ließ den Planabgleich des Rands fehlschlagen.
   - pptxgenjs zentriert Titel-Platzhalter, wenn `align` fehlt.
   - Ohne maßgleiche Ersatzschriften (Carlito, Caladea) rendert LibreOffice Calibri und Cambria deutlich breiter; die Titel wirkten zweizeilig, obwohl sie in PowerPoint einzeilig sind.
   - Es gab keine Regel, woher Fotos kommen. Jetzt steht sie in `rules-core.md` §5: freie Lizenz prüfen, Nachweis auf der Folie, Symbolbild benennen.
5. **Grenzen:** Die Durchsicht ist eine Selbstprüfung des Modells, das das Deck gebaut hat. Gerendert in LibreOffice, nicht in PowerPoint geöffnet. Das Foto auf Folie 7 ist ein Symbolbild.
