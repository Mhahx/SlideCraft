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
  THESIS: Eine Zahl je Folie, sonst nichts. Der Redner trägt die Erklärung, die Folie zeigt nur den Beweis.
  OWN-WORLD: Voll gesättigte Fläche 4C2FBF, Text in Weiß und hellem Lavendel E4DEFA, keine Bilder, keine Formen außer dem Punktediagramm mit 30 Quadraten.
  STORY: Jeder dritte Flug ist kurz, Kurzstrecken sind ineffizient, Elektro spart 22 %, leiser, Reichweite 320 km, 14 von 30 Strecken passen, Start 2028.
  FIRST SLIDES: Titel: Titel 64 pt links, Untertitel 28 pt darunter. Zahlenfolie: Aussagetitel 40 pt oben, darunter Zahl 96 pt fett, darunter Erklärung 28 pt, sonst Leere.
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
Layout types:       title, statement, units
Images and icons:   keine; Punktediagramm aus 30 Quadraten (24 pt, Abstand 8 pt), 14 weiß gefüllt, 16 nur weiße Kontur
Charts:             kein natives Diagramm; das Punktediagramm ist aus Formen gebaut, Alt-Text am Titel: siehe Notizen

## 5. Slide plan
| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | title | Fliegen ohne Kerosin | Untertitel | - | - | ja |
| 2 | statement | Jeder dritte Flug ist kürzer als 300 km | 34 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 3 | statement | Kurze Flüge fressen das meiste Kerosin | +38 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 4 | statement | Elektroantriebe sparen dort am meisten | −22 % | - | Quelle: Beispieldaten (erfunden) | ja |
| 5 | statement | Der Startlärm sinkt um 15 Dezibel | 67 dB | - | Quelle: Beispieldaten (erfunden) | ja |
| 6 | statement | Die Batterie setzt die Grenze | 320 km | - | Quelle: Beispieldaten (erfunden) | ja |
| 7 | units | Vierzehn von dreißig Strecken passen | 30 Quadrate | - | Quelle: Beispieldaten (erfunden) | ja |
| 8 | statement | Wir starten 2028 mit dem Pilotbetrieb | 4 | - | - | ja |

## 6. Avoid list check and assumptions
Gefährdet: Hero-Metrik-Vorlage (erlaubt in talk: eine Zahl ohne Kennzahlenblock, ohne Akzent), Füllwörter (keine), Dunkel-Neon-Look (vermieden), Fill-Grenze 30 %: einzeilige Titel eingeplant, weil ein zweizeiliger Titel bei 40 pt allein etwa 27 % der Live-Fläche belegt.
Alle Zahlen sind erfundene Beispieldaten. Details und Herleitungen stehen in den Sprechernotizen.

## 7. As built
Fonts: Arial. Rollengrößen: 64 (Titelfolie), 40 (Titel), 96 fett (Zahl), 28 (Erklärung), 12 (Quelle). Farben: 4C2FBF (Grund), FFFFFF, E4DEFA. Rand 48 pt. Layouts: title, statement, units. Größter Füllgrad 28 % (Limit 30 %).
Abweichungen vom Plan: keine. Die einzeiligen Titel waren schon im Plan, weil ein zweizeiliger 40-pt-Titel allein etwa 27 % der Live-Fläche belegt.
Beobachtungen ohne Befund: Sechs von acht Folien haben dasselbe Layout (Aussagetitel, Zahl, Erklärung); das ist die Absicht der Richtung, kann in der Praxis monoton wirken. Die Quellzeile ist mit 12 pt aus 20 Metern nicht lesbar, sie ist für das Nachlesen gedacht.
Review: keine unabhängige Prüfung. Es lief kein Subagent, die Durchsicht der Renderings und der Prüfskript-Berichte stammt aus derselben Sitzung wie der Bau (Selbstprüfung des gleichen Modells). Disposition: ship mit den unten genannten Beobachtungen. Geltungsbereich: die Prüfpunkte des Skripts (check.json) und die Durchsicht aller Renderings (render/); Urteilspunkte 10 und 11 sind Einschätzung, nicht gemessen.
