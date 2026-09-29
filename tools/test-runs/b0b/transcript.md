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

Beiratsvorlage als PDF erstellt: tools/test-runs/b0b/Beiratsvorlage_Q3_2026.pdf (8 Folien, Quelle vorlage.html, Rendering render.js). Datenstand 06.10.2026 wie vorgegeben übernommen, Beschlusstext neutral formuliert.

