# Testbau der Folienmuster (0.12)

Jedes Muster aus `references/patterns.md` als echte Folie, gebaut mit pptxgenjs, per LibreOffice gerendert und mit `scripts/check_deck.py` geprüft. Zweck: zeigen, dass die Muster baubar sind, keine KI-Muster auslösen und wo sie mit den heutigen Grenzwerten kollidieren. **Kein Look:** weiß, Tinte, ein blauer Akzent, Arial als neutrales Test-Rendering; im echten Einsatz kommt der Look aus den gerenderten Entwürfen (`references/direction.md`). Alle Zahlen sind erfunden und in sich stimmig (Werk Nord gegen Werk Süd).

| Datei | Inhalt |
|---|---|
| `build.js` | baut beide Decks: `NODE_PATH=<Ordner mit node_modules/pptxgenjs> node examples/patterns/build.js` |
| `read.pptx`, `render/read-*.png` | P01 bis P13, Profil `read` (13 Folien) |
| `talk.pptx`, `render/talk-*.png` | P01 mit Foto, P05, P13 als einzelne Zahl, P14, Profil `talk` (4 Folien) |
| `check-read.json`, `check-talk.json` | Bericht des Prüfskripts (`--profile read|talk --exempt 1,2 --render-dir render`) |
| `assets/` | beschriftete Foto-Platzhalter (kein echtes Bild vorhanden) |

## Ergebnis

**Detektor:** keine KI-Muster auf allen 17 Folien. Einzige Meldung: `stat-row` als Beobachtung auf P13, gewollt (drei Anteile eines Ganzen, wie BAIN-IABC S. 4).

**Rendering:** kein Text läuft über oder wird abgeschnitten; alle Titel passen in 1 bis 2 Zeilen.

**Fails, alle beim Füllgrad** (Boxen-Methode, 8-pt-Raster):

| Folie | Muster | Füllgrad | Limit |
|---|---|---|---|
| read 5 | P05 chart-focus | 82 % | 75 % |
| read 6 | P06 two-exhibits | 82 % | 75 % |
| talk 2 | P05 chart-focus | 80 % | 30 % |
| talk 3 | P13 key-numbers (eine Zahl) | 46 % | 30 % |
| talk 4 | P14 statement (Fotostreifen) | 64 % | 30 % |

Das ist kein Baufehler, sondern der Konflikt, den schon die E-Flugzeug-Decks gezeigt haben (`examples/e-flugzeuge/README.md`, Befund 1): Ein Diagramm in der Größe, wie es die echten Decks zeigen (BAIN-PE S. 5, 7, 9: ein Diagramm über fast die ganze Folie), überschreitet das Limit, weil der Füllgrad die umschließenden Rechtecke zählt. Beim Profil `talk` belegt allein das zweizeilige 40-pt-Titelfeld 23 % der Live-Fläche. Die Muster wurden nicht verkleinert, um das Limit zu erfüllen: Genau das hatte die schwachen ersten Beispieldecks erzeugt. Entscheidung in BRIEF §10, Schritt 4 (Werte kalibrieren), zusammen mit den Messwerten aus `research/beratungsdecks.md`.

**Beim Bau gefundene und behobene Fehler:** Grau 949494 auf dem hellen Band (F2F2F2) hat nur 2,71:1, dort gilt 858585 (3,3:1); zentrierte Beschriftungen und die letzte Zeitleisten-Station ragten über den Rand; Werte in blauen Balken waren schlecht lesbar (jetzt eine Reihe mit Farbe je Punkt und Wert über dem Balken); der P14-Titel lag auf dem Foto (eigenes Layout); ein Rechenfehler in den Beispielzahlen. Dazu zwei Korrekturen am Skript, siehe CHANGELOG 0.12.

**Grenzen:** Gerendert mit LibreOffice, nicht in PowerPoint geöffnet. Der Wasserfall (P08) ist aus Formen gebaut, weil pptxgenjs das native Wasserfalldiagramm von PowerPoint nicht schreiben kann. Kein echtes Foto; die Platzhalter sind beschriftet. Die Folien sind von demselben Modell gebaut und beurteilt, das die Muster geschrieben hat.
