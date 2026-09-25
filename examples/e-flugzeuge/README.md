# Beispieldecks: E-Flugzeuge (alle Zahlen erfunden)

Vier Decks zum selben Thema, je eines pro Profil, gebaut nach dem Ablauf von `slide-craft` (Brief, Profil, Richtung im Modus Quick, Story, Plan, Bau, Prüfung, Plan as built). Sie dienen dazu, das Prüfskript (`scripts/check_deck.py`) und den Planablauf an realistischen Decks zu erproben, solange keine echten Decks der Zielgruppe vorliegen. Alle Zahlen, die Firma Voltair und die Personen sind erfunden und in den Quellzeilen so markiert.

**Stand: zweite Fassung.** Die erste Fassung (nur Typografie, alles links, keine Bilder) wurde von Max als gestalterisch schwach beurteilt und bildgeführt neu gebaut, siehe unten.

| Deck | Profil | Folien | Richtung | Prüfskript (`--plan --render`) | Größter Füllgrad (Limit) | Größte Wortzahl (Limit) |
|---|---|---|---|---|---|---|
| `read/` Entscheidungsvorlage | read | 6 | weiß, Tinte, ein Signalorange, Streckenkarte, technische Zeichnung | 0 Fails, 25 Beobachtungen | 74 % (75 %) | 47 (120) |
| `talk/` Keynote | talk | 8 | volle Violettfläche, links Zahl, rechts eine Grafik je Folie | 0 Fails, 35 Beobachtungen | 29 % (30 %) | 14 (15) |
| `pitch/` Seed-Runde | pitch | 8 | Typenblatt in Magenta, Text links, Exhibit rechts, Fortschrittsleiste | 0 Fails, 29 Beobachtungen | 49 % (50 %) | 39 (40) |
| `update/` Statusbericht | update | 5 | Kategorie-Standard, Status als farbige Fläche mit Wort | 0 Fails, 21 Beobachtungen | 57 % (60 %) | 54 (80) |

In jedem Ordner: `plan.md` (Deck-Plan mit Abschnitt 7 "as built"), `build.js` (pptxgenjs), `deck.pptx`, `check.json` (Bericht des Prüfskripts), `render/` (ein PNG je Folie). Gemeinsam: `lib.js` (Hilfen), `art.js` (erzeugt alle Illustrationen als SVG und PNG nach `assets/`, Rasterizer: sharp).

Neu bauen (Bilder, dann Deck): `NODE_PATH=<Ordner mit node_modules, darin pptxgenjs und sharp> node examples/e-flugzeuge/art.js` und `... node examples/e-flugzeuge/read/build.js`. Prüfen: `python3 scripts/check_deck.py examples/e-flugzeuge/read/deck.pptx --plan examples/e-flugzeuge/read/plan.md --exempt 1 --render`.

## Zweite Runde: Rückmeldung und Umbau

Rückmeldung von Max zur ersten Fassung: linkslastig, keine Bilder. Die Selbstkritik als Profi: keine Komposition (nur eine Textkante bei x = 48 pt, rechte Hälfte und unteres Drittel leer), kein Bildmaterial, Diagramme zu klein und zu neutral (ich hatte sie verkleinert, damit der Füllgrad passt), kein Rhythmus (bei `talk` sechs von acht Folien gleich), Titelfolien ohne Identität.

Was sich geändert hat:
- **Bilder als Vektorgrafik**, von mir erzeugt (`art.js`): Flugzeug-Draufsicht mit vier Propellern, Streckenkarte des Beispielnetzes (30 Strecken, 14 innerhalb von 320 km), Reichweitenringe, Punktraster, Steigflugprofil, Schallwellen, Formation. Sie sind editierbar und lassen sich durch Fotos ersetzen.
- **`talk`:** Jede Folie hat links Titel, Zahl und Erklärung, rechts eine Grafik. Die Grafik ist der Bildgrund (Vollfläche), der Text steht auf Platten in der Grundfarbe.
- **`read`:** Streckenkarte als Hauptbild, Flugzeug als technische Zeichnung, größere Diagramme, Zeitleiste mit Beschlusstafel.
- **`pitch`:** Titel- und Problemfolie mit Vollflächenbild, sonst Text links und Exhibit rechts, dazu eine Fortschrittsleiste mit einem kleinen Flugzeug, das von Folie zu Folie weiterrückt.
- **`update`:** Status als farbige Fläche mit weißem Wort, Titelfolie mit Flugzeug.

## Was die Decks über Skript und Werte gezeigt haben

Geordnet nach Folgen für das Regelwerk. Werte wurden nicht geändert (Feature-Stopp, BRIEF §11).

1. **Der Füllgrad-Grenzwert kollidiert mit den Größenwerten (Kombinationsprüfung, §11 Regel 3).** Der Füllgrad zählt Bounding-Boxen. Ein zweizeiliges Titelband (864 x 88 pt) belegt allein 20 % der Live-Fläche, bei 40 pt (`talk`) allein etwa 27 % des Limits von 30 %. Mit einem Diagramm normaler Größe kommt `pitch` (Limit 50 %) auf 60 bis 71 %. Das war der Grund für die kleinen Exhibits und die leeren Flächen der ersten Fassung, also für einen Teil der berechtigten Kritik. Der Ausweg der zweiten Fassung: Vollflächen-Bilder zählen als Grund und nicht als Fläche, und Textplatten haben die Größe der Textfelder. Das funktioniert, ist aber ein Umweg. Entweder sind die Grenzen für `talk` und `pitch` zu niedrig, oder die Messung (Box statt Tinte) ist zu streng. Zu entscheiden nach der Kalibrierung.
2. **Die Regeln sagen nichts Positives zur Komposition.** Sie verbieten (Karten, Icons, Verläufe) und messen (Füllgrad, Wörter, Kontrast). Ein Deck kann alle Prüfungen bestehen und trotzdem linkslastig und bildlos wirken, genau das ist passiert. Es fehlen Regeln für Fixpunkt, Balance beider Foliehälften, bildgeführte Layouts und einen Schritt für Bildmaterial im Ablauf. Das wären neue Regeln und sind damit vom Feature-Stopp betroffen.
3. **"Linksbündig als Standard" wurde von mir zu wörtlich genommen.** Die Regel meint Fließtext, nicht den Folienaufbau. Klarstellung wäre sinnvoll.
4. **Einzeilige Titel sind praktisch Pflicht für `talk` und `pitch`.** Die Titellängen-Grenze in Wörtern sagt nichts darüber, ob der Titel in eine Zeile passt (etwa 50 Zeichen bei 32 pt, 43 bei 40 pt).
5. **Dateiprüfungen sehen nicht alles, das Rendern ist nötig.** Tabellen-Zellenränder von acht Zoll statt Punkt fielen nur im Rendering auf. Dafür gibt es jetzt eine Dateiprüfung.
6. **Der Validator des pptx-Skills reicht nicht.** Er ließ den ungültigen Strichwert `dash,solid` in einem Diagramm durch. Das Prüfskript meldet ihn jetzt.
7. **pptxgenjs-Fallen, die der Skill kennen sollte:** Tabellenzellen-`margin` in Zoll als [oben, rechts, unten, links], Textfeld-`margin` in Punkt als [links, rechts, unten, oben] (Reihenfolge weicht von der Dokumentation ab), `lineDash` nur ein Wert für alle Reihen, Standardgröße 12 pt für Datenbeschriftungen auch wenn sie verborgen sind, Alt-Text als Dateipfad bei Bildern.
8. **Der Plan als Format funktioniert, mit Lücken.** Mehrfach fehlten im ersten Plan Rollen (Titelfolie, Tabellenkopf fett, weiß auf Fläche), die der Abgleich gemeldet hat. Ein Plan, den ein anderes Modell in einer echten Sitzung schreibt, ist damit noch nicht getestet.
9. **Skriptfehler, die erst an echten Decks sichtbar wurden:** Tabellenrahmen hatten die gespeicherte Höhe statt der Zeilenhöhen, "Quelle und Datum" akzeptierte nur Jahreszahlen, Zellfüllungen in Tabellen wurden nicht gelesen ("Weiß auf Weiß" bei weißer Schrift auf Statusfarbe), der Plan-Kontrast nahm an, jede Rollenfarbe stehe auf jedem Hintergrund.

## Grenzen dieser Decks

Die Durchsicht war eine Selbstprüfung des Modells, das die Decks gebaut hat, kein unabhängiger Reviewer und keine menschliche Bewertung außer der einen Rückmeldung zur ersten Fassung. Ob die überarbeiteten Decks "nicht nach KI aussehen", ist nicht belegt. Die Grafiken sind flach und geometrisch, Fotos würden `talk` und `pitch` wärmer machen. Die Decks wurden in LibreOffice gerendert, nicht in PowerPoint geöffnet.
