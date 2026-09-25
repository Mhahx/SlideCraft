# Blindtest: Vortrag „5.000 neue Bäume für kühlere Straßen“ (0.17)

Unabhängige Prüfung des Skills (Wunsch von Max): Ein frischer Agent mit einem anderen Modell (Sonnet 5) bekam nur das installierte Skill-Paket (`dist/slide-craft/`) und eine Aufgabe, ohne Zugriff auf das Repo, die Beispiele oder den Verlauf. Aufgabe: Vortrag für die Klimakonferenz der Stadt, Profil `talk`, Deutsch, Musterzahlen erlaubt, „ruhig und klar, bitte nicht grün“. Die Antworten auf die Fragerunde waren vorgegeben; nach den Entwürfen: „Nimm deine Empfehlung.“

Dateien: `REPORT.md` (Bericht des Agenten, englisch), `deck-plan.md`, `deck.pptx`, `render/`, `drafts/` (zwei Richtungen), `build/` (pptxgenjs), `check.json`. Pfade im Bericht sind bereinigt.

**Ergebnis:** kompletter Ablauf ohne Rückfrage an uns (Brief, Skelett, zwei gerenderte Richtungen, Plan, Bau, Prüfung, Selbstprüfung, Plan as built), 10 Folien, Prüfskript 0 Fail.

**Urteil nach Durchsicht der Renderings (Claude, Hauptsitzung):** solide Argumentation mit Aussagetiteln und Beschlussfolie, dunkler Grund passend zum abgedunkelten Saal, eine Akzentfarbe nur für den Fokus, „nicht grün“ eingehalten. Nicht vom Skript gesehen: Folie 5 zeigt einen aus Formen gebauten Baum (Verbotsliste), die Diagramme auf Folie 4 und 8 zeigen ihre Einheit nur in der Quellzeile, die Zeitleiste auf Folie 7 ist dünn, drei Folien haben dieselbe Komposition (große Zahl links, Erklärung rechts).

**Befunde des Agenten, am Code nachgeprüft und in 0.18 behoben:**

| Befund | Behebung (0.18) |
|---|---|
| `plan.py` las von jeder Bezeichnung nur das erste Vorkommen, still; eine „Palette:“ bei der Beschreibung einer Richtung verdrängte die echte Palette aus Abschnitt 4 | Designbezeichnungen kommen aus Abschnitt 4; jede Wiederholung wird gemeldet (P0: Beobachtung, bei mehrdeutigen Bezeichnungen Fehler); Abschnitt 7 „As built“ darf wiederholen |
| Budgets je Zone in `patterns.md` widersprachen der 15-Wort-Grenze von `talk` | Tabelle mit Budgets für `talk` und `pitch`; die Grenze des Profils gilt vor den Zonenbudgets |
| Dekorative Gitternetzlinien verboten, aber nicht geprüft | Prüfung 7: Gitternetzlinien schlagen fehl, wenn die Werte beschriftet sind |
| Nur eine Quellzeile mit „Quelle:“ oder „Source:“ zählt als Quelle, nirgends beschrieben | `rules-core.md` §6 beschreibt es |
| P14 hatte keinen Platz für eine Grafik; Überlappung nur im Rendering sichtbar | P14 nennt die Zone für eine Grafik; neue Sichtprüfung (Punkt 13) fragt nach Formen-Bildern, Einheiten, gleicher Komposition und Überlappung |

**Grenzen:** ein Lauf, ein Thema, ein Profil; der Agent konnte keinen weiteren Agenten als frischen Prüfer starten und prüfte sich selbst, wie der Skill es als Ersatz vorsieht. Gerendert nur in LibreOffice.
