# Slide Craft

Ein Claude-Skill für Präsentationsfolien: ein „Impeccable für Folien“. Er fragt, wie ein Deck wirken soll, zeigt gerenderte Entwürfe zur Wahl, baut aus 14 Folienmustern echter Beratungsdecks und prüft das Ergebnis mit einem Skript, das typische KI-Folien (Boxen in Boxen, Kartenraster, Icon-Kacheln) ebenso findet wie zu kleine Schrift, schwachen Kontrast und Abweichungen vom Plan. Er ergänzt den pptx-Skill: Für Gestaltung und Inhalt gilt Slide Craft, aus dem pptx-Skill nur die Technik.

**Stand: 0.19-draft.** Zwei komplette Läufe mit Max (`examples/nordmark/`, `examples/norra/`), ein Blindtest mit frischem Agenten und anderem Modell (`examples/blindtest-baeume/`), Auslösetest 20 von 20 (`tests/trigger/`). Die Werte für Lesedecks sind an 9 echten Beratungsdecks kalibriert, die für `talk`, `pitch` und `update` sind Startwerte. Änderungen: [CHANGELOG.md](CHANGELOG.md).

## Installieren

| Umgebung | Weg | Stand |
|---|---|---|
| Claude (claude.ai, Desktop) | **Aus GitHub:** Customize > Plugins > Add > Add marketplace, `https://github.com/Mhahx/SlideCraft` eintragen, Plugin „Slide Craft“ installieren. **Oder als Datei:** die ZIP aus dem [neuesten Release](https://github.com/Mhahx/SlideCraft/releases) unter Customize > Skills > Upload a skill hochladen. Code-Ausführung muss an sein | offiziell unterstützt; nicht in claude.ai selbst getestet. Ob die Sandbox LibreOffice hat, ist ungeprüft (sonst prüft der Skill ohne Rendering) |
| Claude for PowerPoint | Skills aus den Claude-Einstellungen sind im Add-in verfügbar, Aufruf mit `/` | offiziell unterstützt; ob das Add-in das Prüfskript ausführt und ob Plugin-Skills dort erscheinen, ist ungeprüft |
| Claude Code | `claude plugin marketplace add Mhahx/SlideCraft`, dann `claude plugin install slide-craft@slidecraft` | getestet (0.19, lokal): Plugin installiert, Skill lädt als `slide-craft:slide-craft` |
| Claude Design | nutzt laut Anthropic Design-Systeme, keine Skills | nicht offiziell unterstützt, ungeprüft |

Updates kommen über den Marketplace, sobald die Version in `plugin/.claude-plugin/plugin.json` steigt.

## Aufbau

```
.claude-plugin/marketplace.json   Marketplace „slidecraft“ (für die Installation aus GitHub)
plugin/                           das Plugin: nur das wird installiert (rund 75 KB)
  .claude-plugin/plugin.json      Name, Version, Beschreibung
  skills/slide-craft/             der Skill
    SKILL.md                      Ablauf und harte Grenzen
    references/                   Regeln: direction, patterns, profiles, rules-core, refuse, deck-plan, commands
    scripts/                      Prüfskript: check_deck.py mit plan.py, detect.py, render.py
docs/                             Projektdokumente (nicht Teil des Skills)
  BRIEF.md                        Ziel, Entscheidungen, Arbeitsregeln: für neue Sessions zuerst lesen
  audits/                         Audit 3 und 4, KI-Testdeck (slop-test)
  research/                       9 echte Beratungsdecks, gemessen und mit Seitenangaben
examples/                         Beispieldecks mit Plan, Bauskript, Prüfbericht und Renderings
  nordmark/  norra/  blindtest-baeume/  patterns/  e-flugzeuge/
tests/                            Unit-Tests, Testdecks, Auslösetest (trigger/)
tools/package.py                  baut dist/slide-craft.zip und prüft Namen, Beschreibung, Dateien, Versionen
.github/workflows/                Tests bei jedem Push und PR; Release mit ZIP bei jedem Versions-Tag
```

## Wie der Skill arbeitet

1. **Brief:** eine Fragerunde (Zweck, Situation, gewünschte Wirkung, Vorbilder, Grenzen).
2. **Profil:** `read` (Lesedokument, Vorbild McKinsey, BCG, Bain), `talk` (Vortrag), `pitch`, `update`.
3. **Story-Skelett:** alle Titel als Aussagesätze, je Folie ein Muster aus `references/patterns.md`. Der Titelstrang muss die Argumentation allein tragen.
4. **Richtung:** zwei bis drei Looks aus der Welt des Publikums, jeder als gerenderter Entwurf mit echtem Inhalt. Der Nutzer wählt oder mischt. Es gibt keinen Standard-Look.
5. **Deck-Plan:** Designsystem, Palette, Raster, Folientabelle, bevor eine Folie entsteht.
6. **Bauen, prüfen, nachführen:** Prüfskript, Sichtprüfung jedes Renderings, frischer Prüfer, Plan „as built“.

Grundsätze: Als bestanden oder nicht bestanden gilt nur, was aus der Datei gelesen, berechnet oder per Skript gemessen wird; alles andere ist Beobachtung. Was der Nutzer festlegt (Marke, Vorlage, Stil), gewinnt und steht im Plan als Waiver.

## Prüfskript

```
S=plugin/skills/slide-craft/scripts
python3 $S/check_deck.py deck.pptx --profile read|talk|pitch|update [--exempt 1,9] [--lang auto|en|de]
python3 $S/check_deck.py deck.pptx --plan deck-plan.md --render-dir render/ --out check.json
python3 $S/check_deck.py deck.pptx --profile read --derive-plan
```

Nur Python-Standardbibliothek; `--render` und `--render-dir` brauchen LibreOffice (Impress) und poppler. Ausgabe: JSON je Folie und für das Deck, jeder Prüfpunkt mit Nummer aus `references/rules-core.md`, Methode und Status (`pass`, `fail`, `observation`, `not_measured`, `waived`). Exit-Code 1 bei mindestens einem Fail. Der Detektor (`detect.py`) erkennt KI-Muster aus Geometrie, Füllung und Text der Formen; als PNG eingebettete Bilder sieht er nicht.

## Entwickeln

```
python3 -m unittest discover -s tests          # 88 Tests; Render-Tests laufen nur mit LibreOffice
python3 tools/package.py                       # baut dist/slide-craft.zip
skills-ref validate dist/slide-craft           # offizieller Validator (pip install skills-ref)
claude plugin validate . && claude plugin validate ./plugin
bash tests/trigger/run.sh                      # Auslösetest, braucht die Claude-Code-Kommandozeile
```

**Release:** Version in `plugin/skills/slide-craft/SKILL.md` (`metadata.version`, zum Beispiel `0.19-draft`) und `plugin/.claude-plugin/plugin.json` (`0.19.0`) anheben, Tag `v0.19.0` setzen und pushen. Der Workflow testet, baut, prüft, dass Tag und Versionen übereinstimmen, und hängt die ZIP an ein GitHub-Release.

Für eine neue Claude-Session: zuerst `docs/BRIEF.md` lesen, besonders §10 (nächste Schritte) und §11 (verbindliche Arbeitsregeln).

## Quellen

- Impeccable (craft-floor, typeset, critique, audit, polish, distill), auf Folien übertragen
- 9 öffentliche Decks von McKinsey, BCG, Bain und Roland Berger (`docs/research/beratungsdecks.md`)
- Consulting-Regeln nach Deckary: https://deckary.com/blog/consulting-slide-standards (Blog, keine offiziellen Firmenrichtlinien)
- Apple-/Jobs-Regeln nach Presentation Zen und Forbes (Sekundärquellen)

## Offen

- Test in claude.ai, im PowerPoint-Add-in und in Claude Design mit dem installierten Plugin
- Werte für `talk`, `pitch`, `update` an echten Decks dieser Art kalibrieren
- Prüfskript: Abstandsraster, Budgets je Zone
- Lizenz (Voraussetzung für eine Veröffentlichung im Anthropic-Verzeichnis)
