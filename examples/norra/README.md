# Testdeck Norra: Pitch mit gepinntem Stil „Liquid Glass“ (0.16)

Fiktives Unternehmen: Norra baut ein Wasserstoffauto, das aus Wechselkapseln tankt statt an der Säule. Series-A-Pitch für Investoren, Profil `pitch`, 14 Folien, Deutsch. Alle Zahlen sind erfunden und auf jeder Folie als „Beispieldaten“ markiert (Vorgabe von Max: „erfinde Musterzahlen“). Die Kapsel-Idee ist erfunden; ob sich 700-bar-Kapseln sicher und leicht genug tauschen lassen, ist technisch offen.

Gebaut nach `SKILL.md` mit Max als Nutzer:

| Schritt | Was passiert ist | Datei |
|---|---|---|
| 1 Brief | Max: „komplett an ein Investorpublikum“, „modern in so einem Stil von Apple“, „hellblau, weiß, futuristisch“, Musterzahlen | `plan.md` §1 |
| 2 Profil | `pitch` | `plan.md` §1 |
| 3 Story-Skelett | 14 Aussagetitel, je Folie ein Muster (8 Muster) | `plan.md` §3, §5 |
| 4 Richtung | drei gerenderte Richtungen (A Keynote, B Datenblatt, C Himmelblau); Max: „eine Mischung aus allem, aber ... abgerundet Liquid Glass“; Mischentwurf gerendert und mit „go“ freigegeben | `drafts/entwuerfe.png`, `drafts/entwurf-glas.png` |
| 5 Plan | Richtung, Waiver `shadow` mit Zitat, Designsystem mit 10 Rollen | `plan.md` §2, §4 |
| 6 Bau | 14 Folien, Brücke aus Formen, Licht als transparente PNGs | `build.js`, `assets/light.py`, `deck.pptx` |
| 7 Prüfung | Prüfskript mit Plan und Rendering, Selbstprüfung | `check.json`, `render/`, `uebersicht-1.png`, `uebersicht-2.png` |
| 8 As built | Plan nachgeführt | `plan.md` §7 |

Neu bauen: `python3 examples/norra/assets/light.py`, dann `NODE_PATH=<node_modules mit pptxgenjs> node examples/norra/build.js`. Entwürfe: `drafts.js` (A, B, C) und `drafts2.js` (Mischung). Prüfen: `python3 scripts/check_deck.py examples/norra/deck.pptx --plan examples/norra/plan.md --render-dir examples/norra/render`.

**Ergebnis mit 0.18:** 0 Fail, 13 waived (Schatten der Glasflächen, per Waiver `shadow` freigegeben), 207 pass.

## Was der Lauf über den Skill gezeigt hat

1. **Ein gepinnter Stil ließ sich nicht freigeben.** Glas braucht Schatten, die Verbotsliste verbietet sie, und das Skript las Waiver nur für Detektorregeln. Ergebnis im ersten Lauf: 14 Fails für einen gewollten Stil. Jetzt tragen alle Verbotspunkte eine ID (`shadow`, `gradient`, `glow`, `3d`, `emoji` …), und der Plan gibt genau die genannten frei.
2. **Eine Farbfläche bis zum Rand galt als Randverstoß.** Das Band auf der Titelfolie von Entwurf A wurde als Fehler gemeldet. Jetzt zählen textlose Flächen über die volle Breite oder Höhe, mindestens ein Sechstel tief, als Grund (Beobachtung „bleed“). Dünne Balken bleiben Fehler.
3. **Die Regel „eine Glasfläche pro Folie“ hat das Deck getragen.** Glas nur für den Fokus (Deutung, Norra-Zeile, Meilenstein 2029) hält es vom Kartenraster fern. Sie steht jetzt in `refuse.md` und wird als `glass-stack` geprüft.
4. **Beim Bau gefunden und behoben:** Blau auf Glas im ungünstigsten Fall 2,7:1 (Akzent abgedunkelt auf 125EA8, jetzt 3,1:1); deckende Lichtbilder schnitten die Summensäule an und zeigten Kanten (jetzt transparent mit Randausblendung); der Planabgleich fand eine fette 15-pt-Beschriftung ohne Rolle.
5. **Grenzen:** Echtes Liquid Glass (Brechung, Weichzeichnen des Hintergrunds) kann PowerPoint nicht; das Deck ahmt es mit Transparenz, Rand und Schatten nach. Arial ersetzt SF Pro. Produktbild und Teamfotos sind Platzhalter. Sieben der 14 Folien haben dieselbe Komposition (Diagramm links, Glas rechts). Die Entwurfs-Renderings zeigen noch die deckenden Lichtbilder des ersten Stands. Durchsicht: Selbstprüfung desselben Modells, gerendert nur in LibreOffice; im Rendering erscheinen Zahlen englisch formatiert (14,000), in deutschem PowerPoint deutsch.
