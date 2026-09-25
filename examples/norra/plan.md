# Deck plan: Norra Series-A-Pitch (fiktives Unternehmen)

## 1. Brief
Purpose:            Investoren beteiligen sich an Norras Series A über 40 Mio. €
Audience:           Investoren (Venture Capital, Mobilität); wollen Problem, Beleg, Markt, Geld sehen
Situation:          live präsentiert auf Bildschirm oder Beamer, danach als PDF verschickt (Annahme)
Duration / length:  14 Folien, etwa 12 Minuten
Language:           Deutsch
Pinned by user:     "komplett an ein Investorpublikum", "modern in so einem Stil von Apple",
                    "hellblau, weiß, also modern, futuristisch", "erfinde Musterzahlen",
                    "Mischung aus allem", "abgerundet Liquid Glass"; Wasserstoffauto, "etwas,
                    was es noch nicht gibt"
Waivers:            `shadow` (Max: "abgerundet Liquid Glass"): Liquid Glass overrides the refuse items
                    glass and soft shadows; at most one glass panel per slide (the detector rule
                    for glass stays on), lit from behind by soft light blue (transparent PNG), no grid.
                    Invented figures (Max: "erfinde Musterzahlen") override the rule that facts are
                    never invented: every figure is marked "Beispieldaten" in its source line.
Profile:            pitch

## 2. Direction
Scene sentence:     Investoren sitzen im Besprechungsraum vor einem großen Bildschirm, helles
                    Tageslicht; danach lesen sie das PDF am Laptop
Mechanism:          glaubhaft machen, dass Wasserstoff ohne Tankstellennetz alltagstauglich wird
Mode:               Drafts
Chosen direction:   "Glas": Mischung aus A Keynote, B Datenblatt und C Himmelblau, mit Liquid Glass
Drafts shown:       A Keynote (drafts/a-keynote.pptx, Risiko: leer ohne Produktbild);
                    B Datenblatt (drafts/b-datenblatt.pptx, Risiko: nüchtern); C Himmelblau
                    (drafts/c-himmelblau.pptx, Risiko: nah am KI-Look weiß plus Blau). Empfohlen: A.
                    Max: "eine Mischung aus allem ... abgerundet Liquid Glass". Mischentwurf
                    drafts/m-glas.pptx, freigegeben mit "go".
Colour strategy:    Restrained (helle Neutrale plus ein Blau), Licht nur hinter Glas
Pattern variants:   interpretation = light field (als Glasfläche); exhibit side = exhibit left, text
                    right; image world = type and exhibits, Produktbild als Platzhalter; density =
                    lower end; ground = light; title voice = sans bold, Titelfolie statement with a
                    bold key phrase; emphasis = accent on the focus element only; structure devices
                    = rules and space, eine Glasfläche als Fokus
Direction contract: THESIS: Tanken wie Einkaufen; eine Aussage pro Folie, Glas nur für den Fokus.
                    OWN-WORLD: Grund F5F9FC, Tinte 0A2A4A, Blau 125EA8 nur für den Fokus,
                    abgerundetes Weißglas mit weißem Rand und weichem Schatten, hellblaues Licht
                    dahinter, Arial fett und groß.
                    STORY: Netz fehlt, Kapsel löst es, 90 Sekunden, Markt, Geld, Ask.
                    FIRST SLIDES: Titel links unten mit fetter Schlüsselphrase, rechts Licht und
                    Glas mit vier Produktdaten; Schlüsselfolie mit Balken links und Glasdeutung rechts.
                    FORM: Mischung aus drei Entwürfen plus Liquid Glass, von Max gewählt.
                    FINISH: kein Foliensatz vor dem Plan; Abschluss mit Prüfung und Plan as built.
Rationale:          Arial als Ersatz für SF Pro (nicht einbettbar); Glas als einziger Schmuck,
                    damit Apple-Anmutung nicht in Kartenraster kippt
Self-check:         Weiß plus Blau liegt nah an Look 3 (weiß, Blau-Violett-Verlauf, Icon-Karten);
                    vermieden durch: kein Violett, kein Verlauf als Fläche, keine Icons, keine
                    Kartenraster, Glas höchstens einmal je Folie. Farbe ist vom Nutzer gesetzt.

## 3. Story
Governing message:  Norra macht Wasserstoffautos alltagstauglich, weil man Kapseln in 90 Sekunden
                    im Supermarkt tauscht statt eine seltene Säule zu suchen; 40 Mio. € bringen
                    200 Prototypen auf die Straße.
Arc:                Problem (Netz), Lösung (Kapsel), Produkt, Beleg (90 Sekunden), Netz, Markt,
                    Wettbewerb, Geschäftsmodell, Traktion, Roadmap, Team, Finanzen, Ask

## 4. Design system (deck-wide)
Fonts:              Arial (eine Familie, regular und bold), Safe-Liste
Text roles:

| role | family | weight | size pt | colour | use |
|---|---|---|---|---|---|
| cover-title | Arial | regular | 44 | 0A2A4A | Titelfolie, Rest des Titels |
| cover-title-strong | Arial | bold | 44 | 0A2A4A | Schlüsselphrase Titelfolie, Schlüsselzahl im Ask |
| title | Arial | bold | 34 | 0A2A4A | Aussagetitel |
| key-value | Arial | bold | 26 | 0A2A4A | Produktwerte auf Glas, Schrittnummern (125EA8) |
| body | Arial | regular | 20 | 0A2A4A | Deutung, Spalten, Tabelle, Zeitleiste |
| body-strong | Arial | bold | 20 | 0A2A4A | Spaltenköpfe, Namen, Produktdaten, Hinweis im Diagramm (125EA8) |
| label | Arial | regular | 15 | 46607A | Messzeile, Untertitel, Rollen, Tabellenkopf, Platzhalter |
| chart-label | Arial | regular | 15 | 0A2A4A | Achsen und Werte in Diagrammen |
| glass-label | Arial | regular | 12 | 2F4760 | kleine Beschriftung auf Glas |
| footnote | Arial | regular | 9 | 46607A | Quelle, Seitenzahl |

Palette:            background F5F9FC | text 0A2A4A | accent 125EA8 | neutrals 46607A (Labels,
                    6,2:1 auf F5F9FC), 2F4760 (Labels auf Glas, 4,5:1 im schlechtesten Fall),
                    7A8A9A (Balken, 3,3:1), A9BED2 (Linien), EAF2F8 (Platzhalterfläche), FFFFFF
                    (Glas, 30 % durchsichtig); Licht in den PNGs 8FC9F2, BADEF7, 6EB6EC
Grid and spacing:   960 x 540 pt, margins 48 pt, 12 Spalten, Abstände in 8er-Schritten
Layout types:       P01 cover, P04 chart-rail, P07 table, P08 bridge, P09 before-after,
                    P10 numbered-rows, P11 timeline, P12 case
Images and icons:   keine Icons, keine Fotos; Licht-PNGs nur hinter Glas; Produktbild und
                    Teamfotos als markierte Platzhalter
Charts:             nativ (Balken, Säulen), Fokus in 125EA8, Rest 7A8A9A, Werte direkt beschriftet,
                    Brücke aus Formen (pptxgenjs hat keinen Wasserfall); Quelle mit Jahr auf jeder
                    Datenfolie

## 5. Slide plan
| No. | Layout type | Claim title | Content (roles used) | Exhibit | Source | Speaker notes |
|---|---|---|---|---|---|---|
| 1 | P01 cover | Norra: Wasserstoff tanken ohne Wasserstofftankstelle | cover-title, label, Glas mit 4 Produktdaten | - | - | - |
| 2 | P04 chart-rail | Wasserstoffautos scheitern an fehlenden Tankstellen | Balken, Glasdeutung | Balken | Norra-Recherche 2026 | - |
| 3 | P09 before-after | Norra tankt aus Wechselkapseln statt an der Säule | Heute / Mit Norra, Norra auf Glas | - | Norra 2026 | - |
| 4 | P12 case | Zwei Kapseln reichen für 600 km | Produktbild-Platzhalter, Glas mit 3 Werten | Platzhalter | Norra 2026 | Produktbild fehlt |
| 5 | P04 chart-rail | 500 km nachladen dauert 90 Sekunden statt 35 Minuten | Balken, Hinweis, Glasdeutung | Balken | Norra-Messreihe 2026 | Schlüsselfolie |
| 6 | P10 numbered-rows | Kapseln kommen über 2.000 Supermärkte, nicht über neue Säulen | 3 Schritte, Schritt 3 auf Glas | - | Norra 2026 | - |
| 7 | P04 chart-rail | Europas Flotten kaufen 2031 1,5 Mio. emissionsfreie Autos | Säulen, Glasdeutung | Säulen | Norra-Marktmodell 2026 | - |
| 8 | P07 table | Nur Norra verbindet schnelles Tanken mit dichtem Netz | Tabelle, Norra-Zeile auf Glas | Tabelle | Norra-Recherche 2026 | - |
| 9 | P08 bridge | Jedes Auto bringt über acht Jahre 50.000 € Umsatz | Brücke, Glasdeutung | Brücke | Norra-Businessplan 2026 | - |
| 10 | P04 chart-rail | Flottenkunden haben in sechs Monaten 450 Autos vorbestellt | Säulen, Glasdeutung | Säulen | Norra-Vertrieb 2026 | - |
| 11 | P11 timeline | Serienstart 2029, erst Flotten, dann Privatkunden | Zeitleiste, 2029 auf Glas | Zeitleiste | Norra-Plan 2026 | - |
| 12 | P12 case | Drei Gründer bringen Brennstoffzelle, Fahrzeugbau und Handel zusammen | 3 Personen mit Platzhaltern | - | - | Namen fehlen |
| 13 | P04 chart-rail | Norra erreicht 2031 den Break-even bei 40.000 Autos | Säulen EBIT, Glasdeutung | Säulen | Norra-Businessplan 2026 | - |
| 14 | P04 chart-rail | 40 Mio. € bringen 200 Prototypen auf die Straße | Balken Mittelverwendung, Glas mit Schlüsselzahl | Balken | Norra-Businessplan 2026 | - |

## 6. Avoid list check and assumptions
At risk: Look 3 (weiß plus Blau mit Karten), Kartenraster aus Glasflächen, Hero-Metric-Reihe.
Vermieden durch höchstens eine Glasfläche je Folie, Zahlen nur in Diagrammen oder einzeln auf Glas.
Assumptions not confirmed by Max: Kapsel-Idee als Kern, Situation, Deutsch, alle Zahlen erfunden,
Team-Namen und Produktbild als Platzhalter. Technisch offen: Sicherheit und Gewicht tauschbarer
700-bar-Kapseln.

## 7. As built
Gebaut mit build.js (pptxgenjs), geprüft mit check_deck.py --plan plan.md --render-dir render (check.json).
Erster Lauf mit Skill 0.15: 200 pass, 14 fail; alle 14 Fails waren der Schatten der Glasflächen, gewollt,
aber nicht per Waiver freigebbar (Lücke, in 0.16 behoben: `shadow` im Waiver). Ergebnis mit 0.16 siehe README.
Abweichungen und Korrekturen im Bau: Akzent 1668B8 auf 125EA8 abgedunkelt (Blau auf Glas im schlechtesten
Fall 2,7:1, jetzt 3,1:1 für große Schrift); Lichtbilder von deckend auf transparent mit Randausblendung
(deckende Bilder schnitten die Summensäule auf Folie 9 an und zeigten Kanten); Tabelle auf Folie 8 mit
16 pt Innenabstand statt Glas über den Rand; EBIT-Achse mit Luft, damit Minuswerte nicht an die Jahre stoßen.
Rendering: LibreOffice mit Liberation Sans für Arial (maßgleich); Zahlenformate im Rendering englisch
(14,000 / 1.5), in deutschem PowerPoint deutsch.
Review: Selbstprüfung desselben Modells, kein unabhängiger Prüfer. Befund: sieben der 14 Folien haben
dieselbe Komposition (Diagramm links, Glas rechts); gewollt durch das Muster, wirkt aber gleichförmig.
Produktbild und Teamfotos fehlen. Disposition: ship im Umfang dieser Selbstprüfung; Urteil von Max steht aus.
