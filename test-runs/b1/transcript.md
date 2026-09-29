## Turn 1

**Das habe ich vor (bitte prüfen, dann gib mir ein „Go“):**

**Profil:** `read`. Die Vorlage geht vorab als PDF an den Beirat und muss ohne Sprecher verständlich sein. Die 20 Minuten sind Diskussion, keine Präsentation. Also Aussagetitel, eine zentrale Grafik je Folie, Quelle und Stand in der Fußzeile.

**Rohgerüst (8 Folien, Titel als Aussage):**
1. Entscheidungsvorlage: 2,4 Mio. € für Linie 2 freigeben, Rahmenschweißen bis dahin auslagern
2. Zusammenfassung: Nachfrage wächst, Linie 1 ist voll, jede Woche Lieferzeit kostet Kunden
3. Umsatz wächst um 26 %, der Auftragsbestand hat sich seit Q3/25 mehr als verdoppelt (610 → 1.380)
4. Linie 1 läuft mit 97 % Auslastung, die Lieferzeit hat sich auf 12 Wochen verdoppelt
5. Stornos wegen Lieferzeit haben sich fast verdoppelt (64 → 118), das sind rund 0,39 Mio. € Umsatz im Q3
6. Die Marge fiel um 4,3 Punkte, davon gehen 3,5 auf Batteriepreise und Überstunden
7. Linie 2 amortisiert sich in 3,1 Jahren, selbst bei stagnierender Nachfrage in 4,6
8. Beschlussvorschlag mit Überbrückung (+300 Stück, 54 T€ Mehrkosten je Quartal) und Liquidität (5,1 Mio. € Kasse, 2,0 Mio. € Kreditlinie)

**Rechenprüfung:** Ich habe deine Zahlen nachgerechnet. Die Margenbausteine ergeben 4,3, 118 × 3.300 € ergeben rund 0,39 Mio. €, 1.120/1.150 sind 97 % und 2,4/0,78 sind 3,1 Jahre. Alles stimmt. Neu gerechnet (nicht von dir geliefert) sind nur der Umsatzzuwachs von 26 % und die 54 T€ (300 × 180 € je Quartal). Beides kennzeichne ich als „berechnet“.

**Zwei ehrliche Einwände:**
- Die Überstunden (−1,4 Punkte) sind der Preis für die volle Linie 1. Linie 2 löst sie erst ab Q2/27. Das sollte auf Folie 6 stehen, sonst fragt der Beirat danach.
- Zwischen Auslagerung (Wirkung nach 8 Wochen, +300) und Linie 2 (ab Q2/27) bleibt der Bestand von 1.380 Stück trotzdem größer als die Kapazität. Ich würde das offen zeigen und nicht behaupten, die Überbrückung löse es.

**Vier Fragen vor dem Bau (Look statt Bauchgefühl):**
1. Gibt es eine Schrift, Farbe oder ein Erscheinungsbild der Kessler Lastenräder, das ich beachten muss? Du sagtest „keine Vorlage oder Marke“, ich lese das als frei gestalten.
2. Welche Wirkung soll die Vorlage beim Beirat haben, in deinen Worten (z. B. nüchtern, dringlich, vorsichtig)? Und welche Unterlagen kennt der Beirat, denen sie nicht ähneln soll?
3. Wird gedruckt oder am Bildschirm gelesen (Graustufen-Tauglichkeit)?
4. Ist der Beschluss unstrittig als 2,4 Mio. € plus Auslagerung zu formulieren, oder soll auch die Alternative „nur Auslagerung, Linie 2 später“ als Option auftauchen?

Danach zeige ich dir zwei bis drei Looks als gerenderte Musterfolien (Titelfolie + Folie 7) samt diesem Gerüst. Sagst du „mach du“, wähle ich den Look selbst, die Inhaltsfragen (v. a. 4) bleiben trotzdem offen.

## Turn 2

Das ist der Name des Branches, auf den ich pushe. Das Gerüst und meine Fragen von eben liegen dort in `test-runs/b1/transcript.md`. Gebaut habe ich noch nichts.

Meintest du damit etwas Bestimmtes, etwa einen anderen Branch oder ein „Go“? Ein „Go“ lese ich das nicht, weil du meine vier Fragen (Marke, Wirkung, Druck oder Bildschirm, Optionen im Beschluss) noch nicht beantwortet hast. Antworte kurz darauf, oder sag „mach du“, dann wähle ich den Look selbst. Frage 4 bleibt in beiden Fällen offen.

## Turn 3

Go verstanden. Ich habe zwei Looks als echte Folien gebaut (Titelfolie und Folie 7, die Amortisation) und mit dem Check-Skript geprüft (Profil `read`): keine Fehler, nur Beobachtungen. Die Bilder liegen in `test-runs/b1/drafts/` (A-werkstatt-1/2.png, B-jahresbericht-1/2.png, dazu die .pptx).

**A · Werkstatt-Datenblatt.** Weißer Grund, Arial, Graphit und ein einziges Signalorange (C2410C) nur für das, worüber der Titel spricht. Diagramm links, rechts eine Randspalte mit dünner Linie, viel Luft. Risiko: nüchtern bis unscheinbar, Orange auf Grau ist ein häufiger Look.

**B · Jahresbericht in Gelb.** Titelfolie als volle Signalgelb-Fläche (FFC629), Cambria-Titel, Calibri-Text. Inhaltsfolien weiß, Text links auf grauem Feld, Diagramm rechts, Fokus in Schwarz statt Farbe. Risiko: Auf Inhaltsfolien trägt nur Schwarz gegen Grau, die Hervorhebung ist leiser. Gelb funktioniert nur als Fläche, nie als Schrift oder Linie auf Weiß.

**Empfehlung: A.** Der Beirat liest am PDF und entscheidet. Der Akzent zeigt sofort, was der Titel meint, und A lässt sich auf allen acht Folien gleich streng halten. B ist wiedererkennbarer, aber die Diagramm-Hervorhebung ist schwächer. Mischung möglich, etwa B-Layout mit A-Akzent, sag es einfach.

**Gerüst (Titel = Aussage, Muster, Basis):**
1. Titelfolie: „Linie 2 freigeben, Rahmenschweißen auslagern“ · P01 · gegeben
2. Zusammenfassung: Nachfrage wächst, Linie 1 ist voll, jede Lieferwoche kostet Aufträge · P03 · gegeben/berechnet
3. Umsatz wächst um 26 %, der Auftragsbestand mehr als verdoppelt sich (610 → 1.380) · P06 · gegeben/berechnet
4. Linie 1 läuft mit 97 % Auslastung, die Lieferzeit hat sich auf 12 Wochen verdoppelt · P04 · gegeben
5. Stornos wegen Lieferzeit haben sich fast verdoppelt (64 → 118): rund 0,39 Mio. € Umsatz im Q3 · P13 · gegeben
6. Die Marge fiel um 4,3 Punkte, davon 3,5 durch Batteriepreise und Überstunden · P08 · gegeben/berechnet
7. Linie 2 amortisiert sich in 3,1 Jahren, bei stagnierender Nachfrage in 4,6 · P04 · gegeben/berechnet (Verlauf linear gerechnet)
8. Beschlussvorschlag: Linie 2 freigeben, Schweißen auslagern (+300 Stück, 54 T€ Mehrkosten je Quartal) · P09 · gegeben/berechnet

**Offen von dir:**
1. Welcher Look (A, B oder Mischung)?
2. Frage 4 von vorhin: Soll die Alternative „nur Auslagerung, Linie 2 später“ als Option auf Folie 8 stehen? Ich habe dafür keine Zahlen, sie wäre ohne Zahlen eine reine Aussage. Ohne Antwort bleibt Folie 8 beim Beschluss wie von dir formuliert.
3. Zur Folie 7: Für die Kurve habe ich einen linearen Verlauf ab Produktionsstart unterstellt (Invest minus Jahresbeitrag mal Jahre). Das ist meine Vereinfachung, sie steht auf der Folie. Ist das für den Beirat vertretbar, oder soll ich nur die beiden Amortisationszeiten als Balken zeigen?

Nach deiner Wahl schreibe ich den Deckplan und baue alle acht Folien.
