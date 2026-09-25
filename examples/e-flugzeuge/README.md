# Beispieldecks: E-Flugzeuge (alle Zahlen erfunden)

Vier Decks zum selben Thema, je eines pro Profil, gebaut nach dem Ablauf von `slide-craft` (Brief, Profil, Richtung im Modus Quick, Story, Plan, Bau, Prüfung, Plan as built). Sie dienen dazu, das Prüfskript (`scripts/check_deck.py`) und den Planablauf an realistischen Decks zu erproben, solange keine echten Decks der Zielgruppe vorliegen. Alle Zahlen, die Firma Voltair und die Personen sind erfunden und in den Quellzeilen so markiert.

| Deck | Profil | Folien | Richtung | Ergebnis Prüfskript (`--plan --render`) | Größter Füllgrad | Größte Wortzahl |
|---|---|---|---|---|---|---|
| `read/` Entscheidungsvorlage | read | 6 | weiß, Tinte, ein Signalorange | 0 Fails, 26 Beobachtungen | 71 % (75 %) | 51 (120) |
| `talk/` Keynote | talk | 8 | volle Violettfläche, eine Zahl je Folie | 0 Fails, 43 Beobachtungen | 28 % (30 %) | 14 (15) |
| `pitch/` Seed-Runde | pitch | 8 | Typenblatt, ein Magenta | 0 Fails, 34 Beobachtungen | 49 % (50 %) | 34 (40) |
| `update/` Statusbericht | update | 5 | Kategorie-Standard, Statusfarben mit Wort | 0 Fails, 22 Beobachtungen | 54 % (60 %) | 54 (80) |

In jedem Ordner: `plan.md` (Deck-Plan mit Abschnitt 7 "as built"), `build.js` (pptxgenjs), `deck.pptx`, `check.json` (Bericht des Prüfskripts), `render/` (ein PNG je Folie). Gemeinsame Hilfen in `lib.js`.

Neu bauen: `NODE_PATH=<Ordner mit node_modules und pptxgenjs> node examples/e-flugzeuge/read/build.js`, Prüfen: `python3 scripts/check_deck.py examples/e-flugzeuge/read/deck.pptx --plan examples/e-flugzeuge/read/plan.md --exempt 1 --render`.

## Was die Decks über Skript und Werte gezeigt haben

Geordnet nach Folgen für das Regelwerk. Werte wurden nicht geändert (Feature-Stopp, BRIEF §11).

1. **Der Füllgrad-Grenzwert kollidiert mit den Größenwerten (Kombinationsprüfung, §11 Regel 3).** Der Füllgrad zählt Bounding-Boxen. Ein zweizeiliges Titelband (864 x 88 pt) belegt allein 20 % der Live-Fläche, bei 40 pt (`talk`) allein etwa 27 % des Limits von 30 %. Mit einem Diagramm normaler Größe kommt `pitch` (Limit 50 %) auf 60 bis 71 %. Erst einzeilige Titel und kompakte Exhibits hielten die Grenzen. Das ist entweder ein Hinweis, dass die Grenzen für `talk` und `pitch` zu niedrig gesetzt sind, oder dass die Messung (Box statt Text) zu streng ist. Zu entscheiden nach der Kalibrierung an echten Decks.
2. **Einzeilige Titel sind praktisch Pflicht für `talk` und `pitch`.** Die Titellängen-Grenze in Wörtern (8 und 10) sagt nichts darüber, ob der Titel in eine Zeile passt. Bei 32 pt sind das etwa 50 Zeichen, bei 40 pt etwa 43.
3. **Dateiprüfungen sehen nicht alles, das Rendern ist nötig.** Tabellen-Zellenränder von acht Zoll statt Punkt (pptxgenjs-Falle) fielen nur im Rendering auf. Dafür gibt es jetzt eine Dateiprüfung.
4. **Der Validator des pptx-Skills reicht nicht.** Er ließ den ungültigen Strichwert `dash,solid` in einem Diagramm durch. Das Prüfskript meldet ihn jetzt.
5. **pptxgenjs-Fallen, die der Skill kennen sollte:** Tabellenzellen-`margin` in Zoll, `lineDash` nur ein Wert für alle Reihen, Standardgröße 12 pt für Datenbeschriftungen auch wenn sie verborgen sind, Alt-Text als Dateipfad bei Bildern.
6. **Der Plan als Format funktioniert, mit Lücken.** Zweimal fehlten im ersten Plan Rollen (Titelfolie, Tabellenkopf fett), die der Abgleich gemeldet hat. Ein Plan, den ein anderes Modell in einer echten Sitzung schreibt, ist damit noch nicht getestet.
7. **Zwei Skriptfehler zeigten sich erst an echten Decks:** Tabellenrahmen hatten die gespeicherte Höhe statt der Zeilenhöhen (falsche Überlaufmeldungen), und "Quelle und Datum" akzeptierte nur Jahreszahlen, nicht "KW 39".

## Grenzen dieser Decks

Die Durchsicht war eine Selbstprüfung des Modells, das die Decks gebaut hat, kein unabhängiger Reviewer und keine menschliche Bewertung. Ob die Decks "nicht nach KI aussehen", ist damit nicht belegt. Sie sind sauber und regelkonform, wirken aber teils schlicht (kein Bildmaterial). Die Decks wurden in LibreOffice gerendert, nicht in PowerPoint geöffnet.
