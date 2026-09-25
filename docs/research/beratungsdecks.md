# Recherche: echte Beratungsdecks (2026-09-25)

Grundlage für die Musterbibliothek (`references/patterns.md`) und für die spätere Kalibrierung der Werte (BRIEF §10, Schritt 4). Selbst geladen, gerendert und angesehen. Seitenangaben sind PDF-Seiten. Die Decks liegen nicht im Repo (fremde Inhalte); die Links reichen zum Nachprüfen.

## Quellen

| Kürzel | Firma, Titel, Jahr | Art | Format | Seiten | Quelle |
|---|---|---|---|---|---|
| MCK-DC | McKinsey, Transportation in DC, 2020 | Kundendeck (Federal City Council) | 16:9 | 40 | https://www.federalcitycouncil.org/wp-content/uploads/2020/12/McKinsey_Transportation.pdf |
| MCK-USPS | McKinsey, USPS Future Business Model, 2010 | Kundendeck (USPS) | 4:3 | 39 | https://about.usps.com/future-postal-service/mckinsey-usps-future-bus-model2.pdf |
| BCG-NYCHA | BCG, NYCHA Key Findings and Recommendations, 2012 | Kundendeck (NYC Housing Authority) | ca. 4:3 | 112 | https://www.nyc.gov/assets/nycha/downloads/pdf/BCG-report-NYCHA-Key-Findings-and-Recommendations-8-15-12vFinal.pdf |
| BCG-MEDIA | BCG, Media and Entertainment in NYC, 2015 | Kundendeck (NYC Mayor's Office) | 4:3 | 49 | https://www.nyc.gov/assets/mome/pdf/bcg-report-10.15.pdf |
| BCG-IRA | BCG-Folien in "Documents for the Record 5.23.23", US-Kongress, 2023 | Analyse (ab S. 10) | Folie auf Hochformat | 23 | https://www.congress.gov/118/meeting/house/116005/documents/HHRG-118-IF02-20230523-SD003.pdf |
| BAIN-PE | Bain, Global Private Equity Report 2023, Roadshow Deck | Vortragsdeck | 16:9 | 17 | https://www.bain.com/globalassets/about/2023-global-pe-report---roadshow-deck.pdf |
| BAIN-RES | Bain, Resilience (AmCham Dänemark), 2020 | Vortragsdeck | 16:9 | 27 | https://amcham.dk/wp-content/uploads/2021/04/20200412-Resilience-AmCham-presentation-vSHARED.pdf |
| BAIN-IABC | Bain, Change Communication (IABC Chicago), 2019 | Vortragsdeck | 16:9 | 17 | https://chicago.iabc.com/wp-content/uploads/2019/10/Bain-Presentation-Deck.pdf |
| RB-TREND | Roland Berger, Trend Compendium 2050: Technology and Innovation, 2025 | Lesedeck/Studie | 16:9 | 72 | https://www.rolandberger.com/publications/publication_pdf/roland_berger_trend_compendium_2050_trend_5_technology_and_innovation.pdf |

Gefunden über die Linklisten von slideworks.io. Nicht erreichbar: PDFs auf `web-assets.bcg.com` und `mckinsey.com` (Bot-Schutz der Server, "Access Denied" bzw. Verbindungsabbruch).

## Messwerte (per Code aus dem PDF, Methode unten)

Normiert auf eine 540 pt hohe Folie (16:9 = 960 × 540 pt, wie in slide-craft). Titel = größte Schrift im oberen Viertel der Seite.

| Deck | Titelgröße (Median) | Wörter im Titel (p25–p75) | Wörter je Folie (p25–p75) | kleinste Schrift (Median) | Quellenzeile auf | Titel links (pt) | Quellenzeile oben bei (pt von 540) |
|---|---|---|---|---|---|---|---|
| MCK-DC | 25 pt | 11–17 | 131–304 | 8 pt | 34 von 39 | 44 | 512 |
| MCK-USPS | 17 pt | 9–13 | 79–124 | 8,8 pt | 16 von 39 | 63 | 482 |
| BCG-NYCHA | 24 pt | 7–12 | 149–243 | 7 pt | 23 von 108 | 35 | 514 |
| BCG-MEDIA | 22 pt | 8–20 | 211–308 | 6,5 pt | 19 von 48 | (4:3) | (4:3) |
| BAIN-PE | 24 pt | 9–22 | 14–46 | 16 pt | 0 von 15 | 30 | – |
| BAIN-RES | 28 pt | 6–15 | 54–111 | 8 pt | 9 von 25 | 29 | 498 |
| BAIN-IABC | 26 pt | 7–17 | 49–112 | 8 pt | 6 von 16 | 29 | 508 |
| RB-TREND | 20 pt | 16–21 | 278–357 | (Diagrammtext) | 65 von 70 | 154 (Navigationsleiste links) | 528 |

Methode: PyMuPDF, Textspans mit Größe und Position; Skript im Arbeitsverzeichnis der Session (`measure.py`), nicht im Repo. Grenzen: Die Titelerkennung ist eine Heuristik (größte Schrift oben); Trennfolien und Deckblätter verzerren einzelne Werte; bei BCG-MEDIA passt die Normierung wegen 4:3 nur ungefähr.

## Was die Werte für slide-craft bedeuten (für Schritt 4, noch nicht umgesetzt)

1. **Wörter je Folie:** Alle Lesedecks (MCK-DC, BCG-NYCHA, BCG-MEDIA, RB-TREND) liegen im Median bei 190 bis 300 Wörtern. Das Limit von `read` (120) liegt unter dem Median jedes Lesedecks. Vortragsdecks (BAIN-PE) liegen bei 14 bis 46, passend zu `talk`/`pitch`.
2. **Kleinste Schrift:** Quellenzeilen und Fußnoten stehen in 7 bis 8 pt. slide-craft verlangt mindestens 10 pt.
3. **Fußzeile:** Quellenzeile und Seitenzahl sitzen 12 bis 42 pt über der Unterkante, also außerhalb des 48-pt-Rands. Der Rand gilt in echten Decks für den Inhalt, nicht für die Fußzeile.
4. **Titel:** 20 bis 28 pt, meist 1 bis 2 Zeilen, 7 bis 20 Wörter. Das Vortragsdeck BAIN-PE nutzt 24-pt-Einzeiler mit bis zu 22 Wörtern; die `talk`-Werte (mindestens 40 pt, höchstens 8 Wörter) entsprechen eher Keynotes als Beratungsvorträgen.
5. **Schriften:** Arial als Textschrift in allen McKinsey-, BCG- und Bain-Decks; MCK-DC setzt die Titel in Georgia Bold (Serifentitel, serifenlose Textschrift), BAIN-IABC nutzt zusätzlich Verdana, Roland Berger eine Hausschrift und Calibri. Die Safe-Liste passt; Georgia fehlt auf ihr.

## Beobachtungen (angesehen)

### Rahmen einer Folie (wiederkehrend)
- **Kopf:** Aussagetitel, links, 1 bis 2 Zeilen (alle Decks). Darunter oft eine Zeile mit Maß, Einheit, Zeitraum: "Employment, growth, and specialization by major industry" (MCK-DC S. 4), "Net profit/loss, $ billions" (MCK-USPS S. 3), "Global buyout deal value (excl. add-ons)" (BAIN-PE S. 5).
- **Tracker:** Kapitelname klein über dem Titel ("Recent Context", MCK-USPS S. 3, 5, 8; "MYTH 3: …", BAIN-RES S. 14), nummerierter Kapitelkreis oben rechts (BCG-MEDIA S. 10, 15, 22, 30), Nummer im Titel ("2a:", "4a:", MCK-DC S. 12, 16), Navigationsleiste links (RB-TREND, alle Inhaltsfolien).
- **Statusmarken** oben rechts: "Preliminary, proprietary, pre-decisional", "Non-exhaustive" (MCK-DC S. 8), "Not Exhaustive" (BCG-IRA S. 10), "Illustrative" (BAIN-IABC S. 9).
- **Fuß:** nummerierte Fußnoten, darunter "Source: …" links, Firma und Seitenzahl rechts (MCK-DC, MCK-USPS, BCG-NYCHA, RB-TREND).

### Wiederkehrende Folientypen
- **Diagramm plus Deutungsspalte**, etwa 60/40 bis 70/30: MCK-DC S. 3, 12, 16 (graue Fläche rechts), BCG-MEDIA S. 22, RB-TREND S. 11, MCK-USPS S. 3, 5 (zwei Panels).
- **Ein Diagramm über die volle Breite, ein Balken hervorgehoben:** BAIN-PE S. 5, 7, 9 (graue Balken, Fokuswert rot mit Wertlabel).
- **Zwei Exhibits nebeneinander oder übereinander**, jedes mit eigener Überschrift und Einheit: BCG-MEDIA S. 30, BAIN-RES S. 20, MCK-USPS S. 8, MCK-DC S. 12 (vier kleine Diagramme).
- **Tabelle über die volle Breite**, Zellen farblich skaliert, eine Zeile hervorgehoben, Kernaussage darunter: MCK-DC S. 4, 5, 6.
- **Wasserfall** mit Tabelle rechts: BCG-IRA S. 10.
- **Vorher/Nachher** mit Zeilenbeschriftung links und Pfeil zwischen den Spalten: BCG-NYCHA S. 35; zwei Spalten Chancen/Risiken: MCK-USPS S. 20.
- **Nummerierte Liste als Struktur** (Herausforderungen, Imperative), Nummer plus Zeilenbeschriftung plus Text in Spalten: MCK-DC S. 8, BCG-NYCHA S. 5.
- **Zeitleiste:** RB-TREND S. 20, 40.
- **Fallbeispiel** mit Foto: MCK-DC S. 25; Zitate als Beleg: BCG-MEDIA S. 10, 15.
- **Management Summary** als fette Kernsätze mit je 2 bis 4 Unterpunkten: BCG-MEDIA S. 3, BCG-NYCHA S. 10.
- **Agenda als Trenner**, aktuelles Kapitel hervorgehoben, andere grau: MCK-DC S. 2, 7, 30; BCG-NYCHA S. 50; BCG-MEDIA S. 6.
- **Kennzahlen:** drei Prozentzahlen, die zusammen 100 % ergeben, mit Einleitungssatz, Erklärung je Zahl und Quelle (BAIN-IABC S. 4); Einzelzahlen mit Linie darüber und Satz darunter (BAIN-RES S. 2).
- **Aussage auf Foto:** Titelfolie mit Vollbild und schwarzer Textplatte (BAIN-PE S. 1), Foto mit Platte und drei Textspalten, getrennt durch feine Linien (BAIN-PE S. 2), Fotostreifen plus Aussage (BAIN-RES S. 14).

### Hervorhebung und Annotation
- Eine Fokusfarbe auf neutralem Grau: BAIN-PE S. 5, 7 (Rot), MCK-DC S. 4 (orange Zeile in Blau-Tabelle), BCG-NYCHA S. 20 (Grün).
- Callout-Box mit Pfeil auf eine Diagrammstelle: MCK-DC S. 3 (dunkle Box), MCK-USPS S. 3 ("No rate increase 2003–2006").
- Gestrichelter Rahmen um einen Zeitraum plus Wachstumsblase ("+14 %"): BCG-MEDIA S. 22, 30.
- Multiplikator-Klammern ("2x") zwischen Balken: BAIN-RES S. 20.
- Kernaussage als Band unter dem Exhibit: BCG-MEDIA S. 15 (grünes Band), MCK-DC S. 4 (fette Zeile), BAIN-IABC S. 12 (rote Schlusszeilen).

### Befunde für den Detektor (in 0.12 umgesetzt)
- **Panels mit Kopfband** (hellblaues Band mit Paneltitel und Einheit, MCK-USPS S. 3, 5, 8, 20) sind Grammatik, keine Karte in der Karte. `nested-cards` nimmt bündige Kopf- und Fußbänder jetzt aus.
- **Zeilenbeschriftungen** in grauen Feldern (BCG-NYCHA S. 35) sind keine Karten. `card-grid` zählt nur Boxen mit mindestens zwei Textelementen (Überschrift und mehr).
- **Eine Reihe großer Zahlen ohne Karten** kommt in einem echten Bain-Deck vor (BAIN-IABC S. 4, Teile eines Ganzen). `stat-row` ist nur noch ein Fail, wenn die Zahlen in Boxen stehen; sonst eine Beobachtung.
- **Kästen sind nicht verboten:** Zwei gerahmte Panels (MCK-DC S. 25, MCK-USPS S. 20) und eine dunkle Callout-Box (MCK-DC S. 3) sind üblich. Das KI-Muster ist die Kartenfläche als Standardbehälter, nicht die einzelne Box mit Funktion.
- **Violett als Firmenfarbe:** RB-TREND nutzt Violett und Verläufe als Hausfarbe. `default-look` meldet das als Beobachtung; bei einer Marke ist das ein Waiver, kein Fehler.
