## Turn 1

**Was ich vorhabe:** 6 Folien, die begründen, warum euer Team von Excel auf ein BI-Tool wechseln sollte. Vorgehen: (1) kurze Klärung, (2) Story-Gerüst mit 6 Titeln als ganze Aussagesätze, (3) zwei bis drei gerenderte Look-Entwürfe zur Auswahl, (4) Bau der 6 Folien als .pptx, (5) Prüfung. Erfundene Zahlen gibt es nicht: Wo Belege fehlen, kommen nur gekennzeichnete Platzhalter oder Hypothesen rein, und nur wenn du das erlaubst.

**Meine ehrliche Einschätzung vorab:** „Warum wechseln?“ als reine Pro-Argumentation ist schwach. Ein Publikum, das mit Excel arbeitet, hört „BI ist besser“ als Kritik an seiner Arbeit. Stärker ist ein Deck, das ein konkretes Problem zeigt, das Excel bei euch verursacht, und dann die Entscheidung anbietet.

**Vier Fragen (eine Antwort pro Zeile reicht):**
1. **Ziel:** Was soll nach den 6 Folien passieren: Budget freigeben, einen Pilot starten, oder nur Zustimmung im Team? Woran erkennst du, dass es gewirkt hat?
2. **Situation:** Wer sieht es (Team, Chef, Geschäftsführung), präsentierst du live oder wird es allein gelesen, und wie skeptisch ist das Publikum?
3. **Belege:** Welche echten Zahlen oder Vorfälle habt ihr (z. B. Stunden pro Monatsreport, Fehler durch Copy-Paste, Versionschaos)? Falls keine: Sind gekennzeichnete Platzhalter erlaubt? Und ist ein bestimmtes BI-Tool (Power BI, Tableau, …) gesetzt?
4. **Look:** Gibt es Template, Marke oder Schrift? Wie soll es im Raum wirken, und was darf es auf keinen Fall sein? Oder sag „mach du“, dann wähle ich den Look selbst (Inhaltsfragen bleiben trotzdem bei dir).

Zur Modellwahl: Für die reine Textarbeit reicht dieses Modell. Für die visuelle Endkontrolle könnte ein stärkeres Modell (Opus) sinnvoll sein.

Sag mir mit deinen Antworten „go“, dann starte ich mit dem Story-Gerüst.

## Turn 2

Du hast „Go“ gesagt, aber die vier Fragen noch nicht beantwortet. Ich starte deshalb wie angekündigt mit dem Story-Gerüst und markiere, was ich annehme. Gebaut wird noch nichts.

**Annahmen (bitte korrigieren):** Profil `talk` (du präsentierst live vor dem Team), Ziel: Zustimmung zu einem Pilot. Keine Zahlen von dir, also ist alles unten `hypothesis`. Ich erfinde keine.

**Governing Message:** Excel reicht für unsere Standardberichte nicht mehr; ein BI-Tool übernimmt sie, Excel bleibt für Ad-hoc-Analysen, und ein Pilot klärt das Risiko vor dem Rollout.

| # | Muster | Titel (Aussage) | Basis |
|---|---|---|---|
| 1 | P01 cover | Von Excel zu BI: Vorschlag für einen Pilot | hypothesis |
| 2 | P03 summary | Standardberichte gehören in ein BI-Tool, Ad-hoc-Analysen bleiben in Excel | hypothesis |
| 3 | P10 numbered-rows | Excel kostet uns heute Zeit, Verlässlichkeit und Überblick | hypothesis (braucht eure Vorfälle) |
| 4 | P09 before-after | Im BI-Tool entsteht der Bericht aus einer Datenquelle statt aus Kopieren und Einfügen | hypothesis |
| 5 | P07 table | Excel und BI ergänzen sich: jedes Werkzeug bekommt die Aufgaben, die es am besten kann | hypothesis |
| 6 | P11 timeline | Ein begrenzter Pilot zeigt vor dem Rollout, ob sich der Wechsel lohnt | hypothesis |

Gelesen nur als Titelfolge trägt das Argument: Problem (3), Lösung (4), Einwand „Excel verschwindet“ (5), kleiner nächster Schritt (6). Folie 5 ist bewusst da, weil die häufigste Gegenwehr „ihr nehmt uns Excel weg“ ist.

**Was ich für den nächsten Schritt von dir brauche** (Look-Entwürfe und Bau hängen daran):
1. **Zahlen/Vorfälle:** Habt ihr echte Werte für Folie 3 und 4 (z. B. Stunden pro Bericht, konkrete Fehlerfälle)? Wenn nein: Sind Platzhalter erlaubt? Sie wären als `[[Zahl: …]]` markiert, und die Folien trügen den Vermerk „Entwurf“.
2. **Publikum und Ziel:** Stimmt „Team, live, Ziel Pilot“? Wie skeptisch ist das Publikum?
3. **Look:** Template, Marke oder Schrift? Sonst: Wie soll es wirken, und was auf keinen Fall? Oder „mach du“ für den Look.

Frage zum Nachdenken: Welcher Einwand deines Teams gegen den Wechsel wiegt am schwersten? Davon hängt ab, ob Folie 5 oder Folie 3 das Deck tragen muss.

## Turn 3

Die 6 Folien sind gebaut: `test-runs/a2/excel-zu-bi.pptx` (Plan: `deck-plan.md`, Renders: `render/`).

**Zu den Belegzahlen:** Ich habe sie nicht ausgedacht. Erfundene Zahlen würde dein Team in einer Entscheidungsvorlage als echt lesen. Folie 3 trägt stattdessen den Platzhalter `[[Zahl: Std./Bericht]]` und den Vermerk „Entwurf“. Trag vor dem Termin einen echten Wert ein, zum Beispiel aus einer Woche Zeitmessung im Team, und lösche den Vermerk.

**Die Folien** (Profil `talk`, Look: Signalorange und Schwarz in Arial, dazu eine Linie mit Haltepunkten als wiederkehrendes Zeichen, ohne Karten, Icons oder Excel-Grün):
1. Von Excel zu BI: Vorschlag für einen Pilot
2. Unsere Berichte entstehen von Hand
3. Excel-Berichte kosten Arbeitszeit (Platzhalter, Entwurf)
4. BI baut Berichte aus einer Quelle (Heute: viele Dateien per Mail, mit BI: eine Quelle)
5. Excel bleibt für schnelle Ad-hoc-Analysen
6. Wir starten heute den Pilot (vier Stationen: Bericht wählen, Aufbauen, Vergleichen, Entscheiden)

Details und Sprechhinweise stehen in den Notizen. Auf den Folien steht bewusst kaum Text.

**Prüfung:** Das Check-Skript meldet 0 Fehler (Schriftgrößen, Kontraste, Wortgrenze, Überlauf). Ein frischer Reviewer ohne Bauhistorie kam auf „fix“. Ich habe die Punkte umgesetzt: die Bitte steht jetzt im Titel von Folie 6, das Linien-Zeichen kommt auch auf Folie 1 und 4 vor, und ich habe „Live“ und „Jeden Monat“ gestrichen, weil es dafür keine Belege gab. Die Korrekturen habe ich selbst an den neuen Renders und mit dem Skript geprüft. Einen zweiten unabhängigen Durchgang gab es nicht.

**Was du wissen musst:**
- Ich habe angenommen, dass Berichte bei euch von Hand entstehen (Folie 2). Stimmt das nicht, ändern wir Folie 2 und 4.
- Für Folie 4 (P09) gilt ein Waiver: Die Skill-Regeln führen P09 nicht für `talk`. Ich habe es trotzdem genommen, weil das Vorher-Nachher der Kern des Arguments ist.
- Der Pilotplan enthält bewusst keine Wochenzahlen, denn Dauer und Umfang wären erfunden.

Frage zum Nachdenken: Welchen konkreten Bericht würdest du auf Folie 4 als Beispiel zeigen, und wie lange dauert er heute wirklich?
