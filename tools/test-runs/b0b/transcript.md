## Turn 1

**Was ich vorhabe (bitte um dein Go):**

Ich baue eine 8-seitige Beiratsvorlage im Querformat (16:9) als PDF. Sie ist ohne Vorlage und ohne Marke gestaltet, damit der Beirat sie vorab lesen kann. Die Folien tragen deshalb ganze Sätze als Titel und sind etwas dichter als bei einer Live-Präsentation. Ich rendere sie aus HTML mit Chromium zu PDF. Die Diagramme sind inline als SVG gezeichnet, mit direkter Beschriftung und ohne Legenden.

| # | Folie | Kernaussage |
|---|---|---|
| 1 | Entscheidungsfrage | 2,4 Mio. € für Linie 2 freigeben und bis dahin das Rahmenschweißen auslagern |
| 2 | Lage in Zahlen | Umsatz +26 % (3,1 → 3,9 Mio. €), Marge −4,3 Pp, Auftragsbestand ×2,3, Lieferzeit 6 → 12 Wochen |
| 3 | Wachstum | Umsatz und Auftragsbestand steigen, Linie 1 läuft mit 97 % Auslastung (1.120 von 1.150 Stück) |
| 4 | Marge | Rückgang von 38,2 % auf 33,9 %, als Wasserfall: Batterien −2,1, Überstunden −1,4, Fracht −0,5, Mix −0,3 |
| 5 | Kosten des Wartens | Lieferzeit 12 Wochen, Stornos 64 → 118, rund 0,39 Mio. € entgangener Umsatz in Q3 |
| 6 | Linie 2 | 2,4 Mio. € Invest, +900 Stück ab Q2/27, Amortisation 3,1 Jahre (Basis) bzw. 4,6 Jahre (stagnierende Nachfrage) |
| 7 | Überbrückung und Liquidität | Auslagerung bringt +300 Stück/Quartal nach 8 Wochen, Mehrkosten 180 € je Rad, Kasse 5,1 Mio. € plus 2,0 Mio. € ungenutzte Kreditlinie |
| 8 | Beschlussvorschlag | Beschlusstext, Risiken, Quellen |

**Was mir an den Daten aufgefallen ist:**

1. **Quellendatum:** Zwei Quellen tragen den Stand 06.10.2026, heute ist aber der 29.09.2026. Auch Q3/26 ist noch nicht abgeschlossen. Sind das Prognosewerte, oder stimmt das Datum nicht? Ein Beirat stolpert genau darüber.
2. **Auslagerungskosten:** Die Mehrkosten von 180 € je Rad ergeben bei 300 Rädern rund 54.000 € pro Quartal. Über die Überbrückung bis Q2/27 sind das grob 0,16 Mio. €, wenn man 3 Quartale ansetzt. Sind sie im Nettobeitrag von 0,78 Mio. € pro Jahr enthalten? Ich würde sie sonst getrennt ausweisen, damit die Amortisation nicht schöngerechnet wirkt.
3. **Kapazität nach Linie 2:** Der Auftragsbestand liegt bei 1.380 Stück, die Kapazität wächst auf 1.150 + 900. Die Bedarfsentwicklung ab Q4/26 ist nicht belegt. Das Szenario "stagnierende Nachfrage" ist dafür die ehrliche Absicherung. Ich zeige es gleichberechtigt neben dem Basisszenario und nicht im Kleingedruckten.
4. **Stornoquote:** Der Wert von 0,39 Mio. € gilt nur für Q3. Eine Hochrechnung aufs Jahr wäre eine Annahme, die deine Daten nicht hergeben, also lasse ich sie weg.

**Meine Rückfragen:**
- Soll ich zur Quellenfrage einen Hinweis auf der Folie setzen, oder klärst du das vorher?
- Soll der Beschlusstext auf Folie 8 eine Bedingung enthalten, etwa Freigabe in Tranchen oder Neubewertung bei stagnierender Nachfrage? Oder formuliere ich ihn neutral als reine Freigabe?

Sag "Go", dann lege ich los. Antworte gern auch nur auf die zwei Rückfragen.

## Turn 2

Die Beiratsvorlage ist fertig: 8 Folien im Querformat als PDF, ohne Vorlage und ohne Marke. Die Datei liegt auf dem Branch `claude/slide-craft-test-b0b`.

Ich habe alle 8 Folien als Screenshot geprüft, das fertige PDF selbst aber nicht Seite für Seite angesehen. Es hat 8 Seiten. Den Beschlusstext habe ich neutral formuliert, weil du die zweite Rückfrage offen gelassen hast. Er ist eine reine Freigabe ohne Bedingung.

**Ablauf:** Die Folien sind so aufgebaut:
1. Entscheidung und drei Kernzahlen
2. Lage in Zahlen
3. Nachfrage und Kapazität, mit Auslastungsbalken (97 %)
4. Marge, mit Verlauf und Treibern (Batteriepreise und Überstunden erklären 81 % des Rückgangs)
5. Kosten des Wartens (118 Stornos × 3.300 € = 389.400 €)
6. Linie 2, beide Szenarien gleichberechtigt
7. Überbrückung und Liquidität (54.000 € Mehrkosten je Quartal)
8. Beschluss, Abwägungen und Quellen

Die Titel sind ganze Sätze mit der jeweiligen Aussage. Alle Zahlen habe ich nachgerechnet: Die vier Treiber ergeben −4,3, die Amortisationen 3,1 und 4,6 Jahre, und die 97 % Auslastung stimmen.

**Was du prüfen solltest:**
- **Datenstand 06.10.2026:** Ich habe ihn wie gewünscht übernommen, ohne Hinweis. Heute ist der 29.09.2026, ein Beirat kann darüber stolpern.
- **Auslagerungskosten:** Ich weiß nicht, ob der Nettobeitrag von 0,78 Mio. € die Mehrkosten enthält. Auf Folie 7 stehen die 54.000 € je Quartal getrennt. Kläre das mit dem Controlling, sonst fragt der Beirat danach.
- **Eigene Aussagen, nicht aus deinen Daten:** Ich habe zwei Formulierungen selbst gesetzt. Auf Folie 8 steht, Linie 2 setze "voraussichtlich" bei Überstunden und Fracht an, nicht bei den Batteriepreisen. Auf Folie 2 steht ein Satz zur Kernaussage. Streich beides, wenn du es nicht so vertreten willst.
- **Kein Hover im PDF:** Alle Werte sind direkt an den Balken beschriftet. Die Achse des Margen-Liniendiagramms beginnt bei 32 %, das steht auf der Folie.

Falls du eine Bedingung im Beschluss willst, etwa Freigabe in Tranchen oder Neubewertung bei stagnierender Nachfrage, ändere ich Folie 8.

Dateien in `tools/test-runs/b0b/`:
- Beiratsvorlage_Q3_2026.pdf
- vorlage.html
- render.js
