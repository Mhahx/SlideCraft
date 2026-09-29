## Turn 1

**Was ich vorhabe:** Ein 6-Folien-Deck, das dein Team überzeugt, von Excel auf ein BI-Tool zu wechseln. Ich baue erst ein Story-Skelett (jeder Folientitel ein vollständiger Aussagesatz, Titel zusammen tragen das Argument), zeige dir dazu zwei bis drei gerenderte Look-Entwürfe, und baue das .pptx erst nach deiner Wahl und deinem Go. Ich erfinde keine Zahlen: Alles ohne Beleg markiere ich als Hypothese oder (falls erlaubt) als Platzhalter.

**Vorab ehrlich:** „Excel ist schlecht, BI ist besser“ überzeugt ein Team nicht. Ohne euren konkreten Schmerz (Fehler, Zeitverlust, Versionschaos) wird das Deck generisch. Und ein Tool-Wechsel ist oft kein Tool-Problem, sondern ein Datenqualitäts- und Prozessproblem. Das Deck sollte das ehrlich adressieren.

**Fünf Fragen, bevor ich weitermache:**
1. **Ziel:** Was soll das Team am Ende tun oder entscheiden (Pilot freigeben, Budget, Tool wählen)? Woran merkt man, dass die Präsentation gewirkt hat?
2. **Publikum und Situation:** Wer sitzt drin (Fachbereich, Führung, IT)? Live im Meeting oder zum Selbstlesen? Sind sie eher skeptisch oder offen?
3. **Belege:** Welche echten Zahlen oder Beispiele habt ihr (Stunden für Reporting, Fehlerfälle, Anzahl Excel-Dateien)? Falls keine: Sind Platzhalter wie `[[Zahl: Stunden pro Monat]]` mit Status „Entwurf“ okay? Ist schon ein BI-Tool im Gespräch (Power BI, Tableau, …)?
4. **Look:** Gibt es ein Corporate Design, eine Vorlage oder Schriftvorgabe? Und wie soll es im Raum wirken, bzw. was darf es auf keinen Fall sein? Eine Referenz (Deck, Publikation, Marke) hilft mehr als „modern und clean“.
5. **Grenzen:** Was muss unangetastet bleiben (Firmenname, Kennzahlen, bestimmter Tonfall)?

Wenn du keine Lust auf die Runde hast: Sag „mach du“, dann wähle ich den Look selbst und baue direkt. Das Ergebnis wird dann aber generischer.

## Turn 2

Das Deck ist fertig: `test-runs/a/deck.pptx` (6 Folien, Deutsch). Der Plan liegt in `test-runs/a/deck-plan.md`, die Renders in `test-runs/a/render/`.

**Story (Titel allein tragen das Argument):**
1. Von Excel zum BI-Tool: Warum wir wechseln sollten
2. Excel kostet uns Zeit und Vertrauen in Zahlen
3. Ein BI-Tool schafft eine gemeinsame Datenbasis
4. Excel bleibt für Ad-hoc-Analysen, BI übernimmt Standardreports
5. Ein kleiner Pilot senkt das Wechselrisiko
6. Wir starten mit einem Pilot auf einem Report

**Look:** Weil du "mach du" gesagt hast, habe ich ohne Entwürfe einen Look festgelegt. Er ist ruhig wie ein Kontenblatt: weißer Grund, Haarlinien zwischen den Zeilen, ein tiefes Petrol-Grün als einzige Akzentfarbe, Cambria für Titel und Calibri für den Inhalt. Cover und Schlussfolie stehen auf einem Farbfeld. Es gibt keine Karten und keine Icons. Falls dir der Look nicht gefällt, sag es. Dann zeige ich dir zwei Alternativen als Bilder.

**Wo das Deck schwach ist:**
- **Keine Zahlen.** Du hast keine geliefert, und ich erfinde keine. Die Folien 2 bis 5 tragen deshalb die Marke "Ohne Belege". Das Deck überzeugt erst richtig, wenn ihr eure echten Schmerzpunkte einsetzt (Stunden pro Monat, konkrete Fehlerfälle).
- **Meine Annahmen:** Ziel ist die Freigabe eines Piloten, das Publikum ist euer Team, und ihr präsentiert live. Die vier Schmerzpunkte auf Folie 2 und die Aufgabenverteilung auf Folie 4 sind Vermutungen.
- **Bewusste Gegenposition:** Folie 4 sagt, dass Excel bleibt, und Folie 5 nennt einheitliche Kennzahlen-Definitionen als Voraussetzung. Ohne beides würde das Deck nach Tool-Werbung klingen, und ein Tool behebt schlechte Daten nicht.

**Prüfung:** Das Check-Skript meldet 0 Fehler. Alle 6 Folien habe ich gerendert und angesehen, dabei einen Pfeil auf Folie 3 korrigiert. Ein unabhängiger Reviewer hat nicht geprüft. Die Schriften wurden im Render durch metrisch gleiche Ersatzschriften dargestellt.

Welche Zahlen oder Beispiele aus eurem Alltag kann ich einbauen?
