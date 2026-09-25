# Deck plan: Status Pilotprojekt E-Regionalflug, KW 39 (Profil update)

## 1. Brief
Purpose:            Das Projektteam und der Lenkungskreis sehen in fünf Minuten, wo das Pilotprojekt steht, was hakt und was als Nächstes passiert.
Audience:           Lenkungskreis (vier Personen) und Teamleiter; kennen das Projekt.
Situation:          Wöchentliches Statusmeeting am Bildschirm, wird danach per Mail versendet; hell.
Duration / length:  5 Folien, etwa 5 Minuten.
Language:           Deutsch
Pinned by user:     Thema E-Flugzeuge, alle Zahlen erfunden. Sonst nichts festgelegt.
Waivers:            Statusfarben Rot, Gelb, Grün sind im Profil update als Ausnahme von der Farbzählung erlaubt und stehen immer mit einem Textwort (Rot, Gelb, Grün).
Profile:            update

## 2. Direction
Scene sentence:     Vier Personen sitzen vor einem Bildschirm, kennen das Projekt und wollen nur die Abweichungen.
Mechanism:          Abweichung, Trend und nächster Schritt je Arbeitspaket in einem festen Format entscheidbar machen.
Mode:               Quick (Übergabe durch den Nutzer: "erstelle"; Standing exit ist hier die gewählte Richtung)
Chosen direction:   Kategorie-Standard sauber gespielt: weißer Grund, Tinte, ein Stahlblau für die Ist-Linie, Statusfarben mit Textwort.
Alternatives:       Keine weitere gezeigt, weil das Profil update ausdrücklich schlicht und wiederholbar sein soll.
Colour strategy:    Restrained
Direction contract:
  THESIS: Jede Statusfolie sieht gleich aus, damit nur der Inhalt auffällt.
  OWN-WORLD: Weiß, Tinte 1B2733, Stahlblau 1F4E79 nur für die Ist-Linie, Status als farbige Fläche in Rot, Gelb, Grün mit weißem Wort, Calibri, keine Icons.
  STORY: Gesamtbild in einer Tabelle, dann drei Arbeitspakete im gleichen Format.
  FIRST SLIDES: Titel: links Titel auf weißer Platte, rechts blaues Flugzeug über grauen Ringen (Vollfläche). Statusfolie: Titel mit Aussage, links Statusfläche, Trend, Abweichung und nächster Schritt, rechts Plan gegen Ist als Linien.
  FORM: Kategorie-Standard (Standing exit gewählt).
  FINISH: Kein Folienbau vor dem Plan; das Deck endet mit dem Prüfskript, der Durchsicht der Renderings und dem Plan as built.
Rationale:          Calibri: Safe-Liste, sachlich. Plan gestrichelt grau, Ist durchgezogen blau: unterscheidbar ohne Farbe.
Self-check:         Bewusst der Standard; Wiedererkennbarkeit ist das Ziel, kein Look von den vier KI-Standards.

## 3. Story
Governing message:  Das Projekt liegt zwei Wochen zurück, verursacht durch den Batterienachweis, alles andere ist im Rahmen.
Title strand:
  1. Status Pilotprojekt E-Regionalflug, KW 39
  2. Das Projekt liegt zwei Wochen hinter dem Plan
  3. Zulassung: Batterienachweis verzögert sich um zwei Wochen
  4. Prototyp: Der Dauerlauf-Test startet planmäßig
  5. Budget: Die Prognose liegt 0,4 Mio. € unter Plan
Arc:                Gesamtbild, dann Abweichung, dann zwei Punkte im Plan.

## 4. Design system (deck-wide)
Fonts:              Calibri für alles
Text roles:

| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| title-slide | Calibri | bold | 40 | 1B2733 | Titel auf der ersten Folie |
| title | Calibri | bold | 28 | 1B2733 | Aussagetitel, einzeilig |
| status-block | Calibri | bold | 28 | FFFFFF | Statusfläche auf den Statusfolien, weiße Schrift auf Statusfarbe |
| body | Calibri | regular | 18 | 1B2733 | Trend, Abweichung, nächster Schritt |
| body-strong | Calibri | bold | 18 | 1B2733 | Statuswort, Status in Farbe |
| label | Calibri | regular | 14 | 1B2733 | Tabellenzellen, Diagrammbeschriftung |
| label-strong | Calibri | bold | 14 | 1B2733 | Tabellenkopf, Statuswort in der Tabelle (weiß auf Statusfarbe) |
| footnote | Calibri | regular | 10 | 4A5866 | Quelle, Seitenzahl |

Palette:            background FFFFFF, 2E7D32, B45309, B71C1C (Statusflächen) | text 1B2733, 4A5866, FFFFFF | accent 1F4E79 | status 2E7D32, B45309, B71C1C | neutrals 7A808A, D0D5DB
Grid and spacing:   13.33 x 7.5 in, margins 0.667 in (48 pt), 12 columns, Abstände in Vielfachen von 8 pt; Titelband 48 bis 88 pt (einzeilig), Inhalt ab 120 pt
Layout types:       title, overview, status
Images and icons:   Titelfolie mit Vektorillustration (SVG, examples/e-flugzeuge/art.js), sonst keine; Status als farbige Fläche mit Wort
Charts:             Linien nativ, Plan grau gestrichelt, Ist blau durchgezogen; Legende unten; Quellzeile 10 pt unten links

## 5. Slide plan
| No. | Layout type | Claim title | Content | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | title | Status Pilotprojekt E-Regionalflug, KW 39 | Untertitel | - | - | |
| 2 | overview | Das Projekt liegt zwei Wochen hinter dem Plan | Statustabelle, 5 Arbeitspakete | table | Quelle: Projektcontrolling, KW 39 | |
| 3 | status | Zulassung: Batterienachweis verzögert sich um zwei Wochen | Status, Trend, Abweichung, nächster Schritt | chart | Quelle: Projektcontrolling, KW 39 | |
| 4 | status | Prototyp: Der Dauerlauf-Test startet planmäßig | Status, Trend, Abweichung, nächster Schritt | chart | Quelle: Projektcontrolling, KW 39 | |
| 5 | status | Budget: Die Prognose liegt 0,4 Mio. € unter Plan | Status, Trend, Abweichung, nächster Schritt | chart | Quelle: Projektcontrolling, KW 39 | |

## 6. Avoid list check and assumptions
Gefährdet: reine Aktivitätslisten (vermieden: jede Zeile hat Status, Trend, Abweichung, nächsten Schritt), Ampel ohne Wort (immer mit Wort), Kartenraster (Tabelle).
Kombinationsprüfung: Titelband einzeilig (864 x 40 pt), Tabellenzeilen 32 pt; damit bleibt der Füllgrad unter dem Limit von 60 %.
Alle Zahlen sind erfundene Beispieldaten und in den Quellzeilen so markiert.

## 7. As built
Fonts: Calibri (im Render als Carlito). Rollengrößen: 40 (Titelfolie), 28 (Titel und Statusfläche fett), 18 (Text), 14 (Tabelle, Diagramm), 10 (Quelle). Farben: FFFFFF, 1B2733, 4A5866, 1F4E79, 2E7D32, B45309, B71C1C, 7A808A, D0D5DB. Rand 48 pt. Layouts: title, overview, status. Größter Füllgrad 57 % (Limit 60 %). Bildmaterial: Titelillustration (Flugzeug in Stahlblau über grauen Ringen), sonst Statusflächen und Diagramme.
Abweichungen vom Plan und Gründe (zweite Runde): (1) Status ist jetzt eine farbige Fläche mit weißem Wort, in der Tabelle als Zellfüllung, auf den Statusfolien als Block. Vorher nur farbiges Wort. (2) Diagramme etwas größer. (3) pptxgenjs schrieb für `lineDash` mit zwei Werten den ungültigen Wert `dash,solid`; der Plan gestrichelt wird per Nachbearbeitung des XML gesetzt (aus der ersten Runde). (4) Das Prüfskript hat Zellfüllungen zunächst nicht gelesen und "Weiß auf Weiß" gemeldet; Skript korrigiert.
Beobachtungen ohne Befund: Die Farbregel meldet vier Farbtonfamilien, das ist die dokumentierte Ausnahme für Statusfarben. Unter den Diagrammen der Statusfolien bleibt Fläche frei.
Review: keine unabhängige Prüfung. Es lief kein Subagent, die Durchsicht der Renderings und der Prüfskript-Berichte stammt aus derselben Sitzung wie der Bau (Selbstprüfung des gleichen Modells). Disposition: ship mit den genannten Beobachtungen. Geltungsbereich: die Prüfpunkte des Skripts (check.json) und die Durchsicht aller Renderings (render/); Urteilspunkte 10 und 11 sind Einschätzung, nicht gemessen.
