# Deck plan: Fliegen ohne Kerosin, Keynote (Profil talk)

## 1. Brief
Purpose:            Das Publikum soll verstehen, warum Elektroflug gerade auf Kurzstrecken Sinn ergibt, und den Pilotbetrieb als nächsten Schritt akzeptieren.
Audience:           Konferenzpublikum aus der Luftfahrtbranche, etwa 600 Personen, gemischtes Vorwissen.
Situation:          Live auf der Bühne, großer Saal, Beamer, gedimmtes Licht, Lesedistanz weit.
Duration / length:  8 Folien, etwa 6 Minuten.
Language:           Deutsch
Pinned by user:     Thema E-Flugzeuge, alle Zahlen erfunden. Sonst nichts festgelegt.
Waivers:            keine
Profile:            talk

## 2. Direction
Scene sentence:     600 Menschen sitzen in einem abgedunkelten Saal und lesen die Folie aus 20 Metern Entfernung, während jemand spricht.
Mechanism:          In drei Sekunden je Folie glaubhaft machen: kurze Flüge sind häufig, teuer im Kerosin und der Elektroantrieb löst genau dieses Stück.
Mode:               Quick (Übergabe durch den Nutzer: "erstelle")
Chosen direction:   Eine Farbe, eine Zahl: durchgehend violette Fläche, weiße Schrift, je Folie eine riesige Zahl.
Alternatives:       Standing exit: saubere Keynote-Optik in Schwarz-Weiß. Risiko: das Violett ist ungewöhnlich für Luftfahrt und kann bei schlechten Beamern ins Blaue kippen.
Colour strategy:    Drenched
Direction contract:
  THESIS: Eine Zahl und ein Bild je Folie. Der Redner trägt die Erklärung, die Folie zeigt nur den Beweis, links als Zahl, rechts als Grafik.
  OWN-WORLD: Voll gesättigte Fläche 4C2FBF, Text in Weiß und hellem Lavendel E4DEFA, eine Bildwelt: weiße Vektorgrafiken der Flugzeug-Draufsicht, Punktraster, Ringe und Linien auf der Violettfläche; keine Fotos, keine Verläufe.
  STORY: Jeder dritte Flug ist kurz, Kurzstrecken sind ineffizient, Elektro spart 22 %, leiser, Reichweite 320 km, 14 von 30 Strecken passen, Start 2028.
  FIRST SLIDES: Titel: Titel 64 pt links, Untertitel 28 pt darunter, rechts das weiße Flugzeug über Reichweitenringen (Vollfläche). Zahlenfolie: links zweizeiliger Aussagetitel 40 pt, Zahl 96 pt fett, Erklärung 28 pt; rechts füllt eine Grafik die Fläche.
  FORM: Zahl-auf-Fläche, Platz 2 der Liste (Konferenzbühne, Fahrplan-Anzeigetafel, Tachometer); Alternative: Standing exit.
  FINISH: Kein Folienbau vor dem Plan; das Deck endet mit dem Prüfskript, der Durchsicht der Renderings und dem Plan as built.
Rationale:          Violett: nicht die Farbe der Kategorie (Blau, Grün), gut kontrastreich zu Weiß (8,5:1). Arial in großen Graden: verlässlich auch auf fremden Rechnern.
Self-check:         Kategorie "Elektroflug" führt zu Grün oder Blau mit Neon auf Dunkel; hier volle Violettfläche mit Weiß. Keiner der vier Standard-Looks, kein Verlauf.

## 3. Story
Governing message:  Elektroflug lohnt sich auf Kurzstrecken, darum starten wir 2028 mit vier Flugzeugen.
Title strand:
  1. Fliegen ohne Kerosin
  2. Jeder dritte Flug ist kürzer als 300 km
  3. Kurze Flüge fressen das meiste Kerosin
  4. Elektroantriebe sparen dort am meisten
  5. Der Startlärm sinkt um 15 Dezibel
  6. Die Batterie setzt die Grenze
  7. Vierzehn von dreißig Strecken passen
  8. Wir starten 2028 mit dem Pilotbetrieb
Arc:                Beobachtung, Problem, Lösung, Nebeneffekt, Grenze, Nutzen im Netz, Aufruf.

## 4. Design system (deck-wide)
Fonts:              Arial für alles
Text roles:

| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| title-slide | Arial | regular | 64 | FFFFFF | Titel auf der ersten Folie |
| title | Arial | regular | 40 | FFFFFF | Aussagetitel, einzeilig |
| key number | Arial | bold | 96 | FFFFFF | die eine Zahl je Folie |
| supporting | Arial | regular | 28 | E4DEFA | Erklärung unter der Zahl, Untertitel |
| footnote | Arial | regular | 12 | E4DEFA | Quellzeile |

Palette:            background 4C2FBF | text FFFFFF, E4DEFA
Grid and spacing:   13.33 x 7.5 in, margins 0.667 in (48 pt), 12 columns, Abstände in Vielfachen von 8 pt
Layout types:       title, statement, units (alle mit Bildgrund)
Images and icons:   acht Vollflächen-Illustrationen als Bildgrund (Vektor, SVG in examples/e-flugzeuge/assets, erzeugt von art.js); Text auf Platten in der Grundfarbe 4C2FBF
Charts:             kein natives Diagramm; Punktraster, Säulen und Karte sind Teil der Bildgrund-Illustration, Alt-Text am Bild, Werte in den Notizen

## 5. Slide plan
| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | title | Fliegen ohne Kerosin | Untertitel | - | - | ja |
| 2 | statement | Jeder dritte Flug ist kürzer als 300 km | 34 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 3 | statement | Kurze Flüge fressen das meiste Kerosin | +38 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 4 | statement | Elektroantriebe sparen dort am meisten | −22 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 5 | statement | Der Startlärm sinkt um 15 Dezibel | 67 dB | - | Quelle: Beispieldaten (erfunden) | ja |
| 6 | statement | Die Batterie setzt die Grenze | 320 km | - | Quelle: Beispieldaten (erfunden) | ja |
| 7 | units | Vierzehn von dreißig Strecken passen | Streckenkarte | - | Quelle: Beispieldaten (erfunden) | ja |
| 8 | statement | Wir starten 2028 mit dem Pilotbetrieb | 4 | - | - | ja |

## 6. Avoid list check and assumptions
Gefährdet: Hero-Metrik-Vorlage (erlaubt in talk: eine Zahl ohne Kennzahlenblock, ohne Akzent), Füllwörter (keine), Dunkel-Neon-Look (vermieden), Fill-Grenze 30 %: einzeilige Titel eingeplant, weil ein zweizeiliger Titel bei 40 pt allein etwa 27 % der Live-Fläche belegt.
Alle Zahlen sind erfundene Beispieldaten. Details und Herleitungen stehen in den Sprechernotizen.

## 7. As built
Fonts: Arial. Rollengrößen: 64 (Titelfolie), 40 (Titel), 96 fett (Zahl), 28 (Erklärung), 12 (Quelle). Farben: 4C2FBF (Grund und Platten), FFFFFF, E4DEFA, dazu Linienfarbe 7E66DD nur in der Illustration. Rand 48 pt. Layouts: title, statement, units. Größter Füllgrad 29 % (Limit 30 %). Bildmaterial: acht Vollflächen-Illustrationen als Bildgrund (Flugzeug-Draufsicht, Punktraster 34/100, Steigflugprofil, zwei Säulen, Schallwellen 67/82 dB, Reichweitenring, Streckenkarte mit 30 Strecken, Formation aus vier Flugzeugen), Quelle `examples/e-flugzeuge/art.js`.
Abweichungen vom Plan und Gründe (zweite Runde): (1) Die erste Fassung war reine Typografie, sechs von acht Folien gleich aufgebaut, rechte Hälfte leer. Jetzt trägt jede Folie eine eigene Grafik auf der rechten Hälfte, der Text steht links. (2) Titel sind zweizeilig in einer 480 pt breiten Spalte statt einzeilig über die ganze Breite, damit die Grafik rechts frei bleibt; die Fläche bleibt gleich groß. (3) Text auf Bildgrund steht auf Platten in der Grundfarbe (Regel: kein Text direkt auf Bildern), die Platten haben die Größe der Textfelder und vergrößern den Füllgrad nicht.
Beobachtungen ohne Befund: Die Quellzeile (12 pt) ist aus der Ferne nicht lesbar, sie ist zum Nachlesen gedacht. Die Grafiken sind flach und geometrisch; Fotos würden die Keynote wärmer machen.
Review: keine unabhängige Prüfung. Es lief kein Subagent, die Durchsicht der Renderings und der Prüfskript-Berichte stammt aus derselben Sitzung wie der Bau (Selbstprüfung des gleichen Modells). Disposition: ship mit den genannten Beobachtungen. Geltungsbereich: die Prüfpunkte des Skripts (check.json) und die Durchsicht aller Renderings (render/); Urteilspunkte 10 und 11 sind Einschätzung, nicht gemessen.
