# Deck plan: E-Regionalflugzeuge, Entscheidungsvorlage (Profil read)

## 1. Brief
Purpose:            Der Vorstand entscheidet, ob ein Pilotbetrieb mit vier Elektro-Regionalflugzeugen freigegeben wird.
Audience:           Vorstand einer Regionalfluggesellschaft; kennt das Netz, nicht die Technik der E-Flugzeuge.
Situation:          Wird ohne Vortragende gelesen (Vorab-Versand, Bildschirm oder Ausdruck), hell.
Duration / length:  6 Folien, je etwa 60 Sekunden Lesezeit.
Language:           Deutsch
Pinned by user:     Thema E-Flugzeuge, alle Zahlen erfunden. Sonst nichts festgelegt.
Waivers:            keine
Profile:            read

## 2. Direction
Scene sentence:     Vorstandsmitglieder lesen das Papier am Schreibtisch, auf dem Bildschirm oder gedruckt, bei Tageslicht.
Mechanism:          Glaubhaft machen, dass der Kostenvorteil von 22 % real ist und zugleich an die Reichweite von 320 km gebunden bleibt.
Mode:               Quick (Übergabe durch den Nutzer: "erstelle")
Chosen direction:   Flugplanungs-Datenblatt: weißer Grund, tintenfarbener Text, ein Signalorange, Tabellen und direkt beschriftete Balken.
Alternatives:       Standing exit: sauberes Beratungsdeck ohne Akzentfarbe. Risiko der gewählten Richtung: das Orange wirkt im Ausdruck grau, deshalb steht jede Aussage auch im Text.
Colour strategy:    Restrained
Direction contract:
  THESIS: Jede Folie hat einen Fixpunkt (Karte, Zeichnung, Diagramm) und beide Foliehälften sind belegt; der Akzent markiert nur, was zur Entscheidung gehört.
  OWN-WORLD: Weiß, Tinte 1B2733, Orange C2410C nur für Hervorhebungen, Tabellen mit feinen Linien statt Flächen, keine Icons, Bilder nur als eigene Vektorgrafik im Stil eines technischen Datenblatts.
  STORY: Der Vorstand versteht, dass 14 von 30 Strecken passen, der Sitzkilometer 22 % günstiger wird, die Reichweite die Grenze ist, und gibt vier Flugzeuge frei.
  FIRST SLIDES: Titel: links Titel 40 pt auf weißer Platte, rechts das Flugzeug in Orange über hellgrauen Reichweitenringen (Vollfläche). Datenfolie: Aussagetitel oben, links Diagramm über 540 pt Breite, rechts drei kurze Sätze.
  FORM: Datenblatt-Form, Platz 1 der Liste (Flugplanung, Jahresbericht, Typenblatt, Fahrplan); Alternative: Standing exit.
  FINISH: Kein Folienbau vor dem Plan; das Deck endet mit dem Prüfskript, der Durchsicht der Renderings und dem Plan as built.
Rationale:          Orange: Signalfarbe der Luftfahrt, aber nur als Hervorhebung; Arial: Safe-Liste, klare Größenstufen statt Schriftmix.
Self-check:         Kategorie "Luftfahrt" führt zu Blau; hier Weiß mit Orange, nicht vorhersagbar. Keiner der vier Standard-Looks.

## 3. Story
Governing message:  Ein Pilotbetrieb mit vier E-Flugzeugen lohnt sich, weil 14 von 30 Strecken passen und der Sitzkilometer 22 % günstiger wird.
Title strand:
  1. E-Regionalflugzeuge: Entscheidungsvorlage für den Vorstand
  2. 14 von 30 Strecken liegen innerhalb von 320 Kilometern
  3. Mit E-Flugzeug wird der Sitzkilometer 22 % günstiger
  4. 320 Kilometer Reichweite bleiben die harte Grenze
  5. Die 137 Mio. € Investition amortisieren sich bis 2033
  6. Wir empfehlen einen Pilotbetrieb mit vier Flugzeugen
Arc:                Ausgangslage, Vorteil, Grenze, Wirtschaftlichkeit, Empfehlung.

## 4. Design system (deck-wide)
Fonts:              Arial für alles
Text roles:

| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| title | Arial | bold | 28 | 1B2733 | Aussagetitel |
| title-slide | Arial | bold | 40 | 1B2733 | Titel auf der Titelfolie |
| body | Arial | regular | 18 | 1B2733 | Sätze rechts neben Exhibit, Beschlusszeile in Akzentfarbe C2410C |
| label | Arial | regular | 14 | 1B2733 | Tabellenzellen, Diagrammbeschriftung |
| label-strong | Arial | bold | 14 | 1B2733 | Tabellenkopf und Summenzeile |
| body-strong | Arial | bold | 18 | FFFFFF | Beschlussleiste in weißer Schrift auf Orange |
| footnote | Arial | regular | 10 | 4A5866 | Quelle, Seitenzahl |

Palette:            background FFFFFF, C2410C (Fläche der Beschlussleiste) | text 1B2733, 4A5866 | accent C2410C | neutrals 7B8794, D0D5DB
Grid and spacing:   13.33 x 7.5 in, margins 0.667 in (48 pt), 12 columns, Abstände in Vielfachen von 8 pt; Titelband 48 bis 88 pt (einzeilig), Inhalt ab 120 pt
Layout types:       title, map, table, chart, timeline
Images and icons:   Vektorillustrationen (SVG, examples/e-flugzeuge/art.js): Streckenkarte, Flugzeug-Draufsicht als technische Zeichnung, Titelmotiv; eine Bildwelt, Orange als einzige Farbe
Charts:             Balken und Linie nativ; Akzent nur für die hervorgehobenen Werte, Rest Grau 7B8794 (3,7:1); Quellzeile 10 pt unten links

## 5. Slide plan
| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | title | E-Regionalflugzeuge: Entscheidungsvorlage für den Vorstand | Untertitel | - | - | |
| 2 | map | 14 von 30 Strecken liegen innerhalb von 320 Kilometern | Balken, 3 Sätze | chart | Quelle: Streckennetz der Beispielairline, Stand 2026 | |
| 3 | table | Mit E-Flugzeug wird der Sitzkilometer 22 % günstiger | Kostentabelle, 1 Satz | table | Quelle: Kostenmodell Flottenplanung, 2026 | |
| 4 | table | 320 Kilometer Reichweite bleiben die harte Grenze | Vergleichstabelle, 2 Sätze | table | Quelle: Herstellerangaben Modell EV-19, 2026 | |
| 5 | chart | Die 137 Mio. € Investition amortisieren sich bis 2033 | Linie, 3 Sätze | chart | Quelle: Investitionsplanung, Annahmen 2026 | |
| 6 | timeline | Wir empfehlen einen Pilotbetrieb mit vier Flugzeugen | Schrittplan, Beschlussvorschlag | table | Quelle: Investitionsplanung, Annahmen 2026 | |

## 6. Avoid list check and assumptions
Gefährdet: Kartenraster (vermieden: Tabellen), Hero-Metrik (vermieden: keine große Zahl), Akzentlinie unter dem Titel (keine), Icons (keine), Füllwörter (Titel enthalten Zahlen).
Alle Zahlen sind erfundene Beispieldaten und in jeder Quellzeile so markiert (Zusatz "erfundene Daten"). Keine echten Quellen.

## 7. As built
Fonts: Arial. Rollengrößen: 40 (Titelfolie), 28 (Titel), 18 (Text, Beschlussleiste fett), 14 (Tabellen, Diagramm, Zeitleiste), 10 (Quelle, Seitenzahl). Farben: FFFFFF, 1B2733, 4A5866, C2410C, 7B8794, D0D5DB. Rand 48 pt. Layouts: title, map, table, chart, timeline. Größter Füllgrad 74 % (Limit 75 %). Bildmaterial: drei Vektorillustrationen (Titelmotiv, Streckenkarte, Flugzeug-Zeichnung), Quelle `examples/e-flugzeuge/art.js`.
Abweichungen vom Plan und Gründe (zweite Runde, nach der Rückmeldung "linkslastig, keine Bilder"): (1) Die erste Fassung hatte keine Bilder, Diagramme klein, Textspalte links. Jetzt Karte, Zeichnung, größere Diagramme, Zeitleiste mit Beschlusstafel. (2) Vier Titel gekürzt, damit das Titelband einzeilig bleibt (Füllgrad). (3) Die Rolle body-strong (weiß auf Orange) kam dazu. (4) Text in der Beschlussleiste saß zu tief, weil pptxgenjs `margin` bei Textfeldern als [links, rechts, unten, oben] liest, nicht wie dokumentiert.
Beobachtungen ohne Befund: Die Titelfolie hat drei Titelzeilen (ausgenommene Foliensorte). Die Diagramme sind weiter nüchtern; ohne Foto bleibt die Bildwelt abstrakt.
Review: keine unabhängige Prüfung. Es lief kein Subagent, die Durchsicht der Renderings und der Prüfskript-Berichte stammt aus derselben Sitzung wie der Bau (Selbstprüfung des gleichen Modells). Disposition: ship mit den genannten Beobachtungen. Geltungsbereich: die Prüfpunkte des Skripts (check.json) und die Durchsicht aller Renderings (render/); Urteilspunkte 10 und 11 sind Einschätzung, nicht gemessen.
