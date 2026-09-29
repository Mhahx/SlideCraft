# Development

## Repository layout

```
.claude-plugin/marketplace.json     marketplace "slidecraft" (install from GitHub)
.claude/skills/slide-craft          symlink to the skill: Claude Code sessions on this repo load it as /slide-craft
plugin/                             the plugin: the only part that gets installed (about 75 KB)
  .claude-plugin/plugin.json        name, version, description
  skills/slide-craft/
    SKILL.md                        workflow, precedence, hard limits (always in context: keep it short)
    references/                     direction, patterns, profiles, rules-core, refuse, deck-plan, commands, tools
    scripts/                        check_deck.py (entry point), plan.py, detect.py, render.py
docs/                               documentation (not part of the skill)
tests/                              unit tests, test decks, trigger test
tools/package.py                    builds dist/slide-craft/ and dist/slide-craft.zip
.github/workflows/                  test on every push to main and every PR; release with ZIP
```

## Tests

```
python3 -m unittest discover -s tests       # 88 tests; 5 render tests skip without LibreOffice Impress
```

The test decks in `tests/fixtures/` are committed. To rebuild them (needs Node and pptxgenjs):

```
NODE_PATH=<dir with node_modules> node tests/make_fixtures.js tests/fixtures
```

| Deck | Purpose |
|---|---|
| `good.pptx` + `good-plan.md` | a clean deck and its plan: no fail expected |
| `bad.pptx` | exactly the deliberately built violations, no more and no less |
| `overflow.pptx`, `fonts.pptx` | render checks: stray words, title lines, a missing font |
| `slop.pptx` | typical AI patterns: every slide must fail the detector |

Changes to the check script are guarded by mutation tests: break the new code on purpose and confirm that at least one test fails.

## Trigger test

Checks whether Claude loads the skill for slide requests and leaves it out otherwise. Needs the Claude Code CLI, logged in:

```
bash tests/trigger/run.sh [work dir]
```

It builds the package, installs it as a project skill in a scratch folder, sends each of the 20 prompts in `tests/trigger/prompts.tsv` once (`claude -p`, 4 turns at most) and scores the result with `eval.py`. Results and history: [tests/trigger/RESULTS.md](../tests/trigger/RESULTS.md). Run it after every change to the `description` in `SKILL.md`.

## Packaging

```
python3 tools/package.py                    # dist/slide-craft/ and dist/slide-craft.zip
pip install skills-ref==0.1.1
agentskills validate dist/slide-craft       # official Agent Skills validator (PyPI names the command agentskills)
claude plugin validate . && claude plugin validate ./plugin
```

`package.py` copies only `SKILL.md`, `references/` and `scripts/`, checks name and description limits, that every file named in `SKILL.md` exists, and that the versions agree. The ZIP holds the skill folder at its top level (`slide-craft/SKILL.md`), as the Claude apps expect. Do not pack with a Windows ZIP tool: `Compress-Archive` writes backslashes into the paths.

## Versions and releases

Two version fields move together:

| File | Field | Example |
|---|---|---|
| `plugin/skills/slide-craft/SKILL.md` | `metadata.version` | `0.20-draft` |
| `plugin/.claude-plugin/plugin.json` | `version` | `0.20.0` |

Release: raise both, add a CHANGELOG entry, merge to `main`. Then either run **Actions > Release > Run workflow** (it creates the tag `v<version>` itself) or push the tag `v0.20.0`. The workflow runs the tests, builds the package, checks that tag and versions agree and attaches `slide-craft.zip` to a GitHub release. An existing release stops the run. Marketplace users get the update when `plugin.json` changes.

## Working rules

These rules keep the skill honest. They apply to every change, by a person or by Claude.

1. **Run every new or changed rule.** Build a minimal deck, render it and check that the rule can be met and measured by code. Note the result in the CHANGELOG. If no tools are available, say so there.
2. **Check combinations.** Every number must be satisfiable together with all other numbers of the same profile (title size × word limit × line limit × live area). Compute, do not estimate.
3. **Every rule has a provenance tag:** cited (source with page or section), practitioner, transferred (untested) or starting value. The table is in `docs/evidence.md` ("Provenance of the rules"), not in the skill: the model does not need project history at build time.
4. **Pass or fail only for what the file or a script measures.** Everything else is an observation or "not measured", never a threshold.
5. **Never write an instruction a model cannot carry out.** Where a capability may be missing (subagents, code execution), name the fallback honestly.
6. **Check consistency beyond text search.** After a change, put all thresholds in one table and compare them pairwise. Resolve cross-references (check numbers, pattern ids).
7. **Transfers from other domains** (web design to slides, for example from Impeccable) need one sentence on why they apply and one test case.
8. **Versions:** a minor version needs at least one new test result or a documented clean-up. Status in the frontmatter (`metadata.status`): `draft`, `tested` or `pilot`.
9. **Language:** skill files and project documents in English. The skill answers in the user's language.
10. **Read before claiming.** Read every file or skill slide-craft works with (for example the pptx skill) before making statements about it.
11. **Package** only with `tools/package.py` followed by `agentskills validate`. Release only through the release workflow.

## Key design decisions

| Decision | Why |
|---|---|
| No default look; the user picks from rendered drafts | a look is judged by seeing it, and every default converges on the same AI look |
| Story skeleton before the direction | drafts built from real titles and numbers show whether the look carries the argument |
| One deck plan before building, checked against the deck | consistency across slides is the most visible difference between a designed deck and a generated one |
| Pass or fail only from file, computation or script | render estimates and judgements are unreliable as thresholds; they would produce false confidence |
| Fill share is an observation | as a fail it pushed builds towards shrinking charts below the size real decks use |
| `read` allows 250 words per slide | real reading decks carry 130 to 300; the earlier 120 sat below every one of them |
| Waivers by rule id | a pinned style (Liquid Glass needs shadows) must be possible without switching off the rest of the checks |
| No builder library in the skill (a `patterns.js` that draws the 14 patterns was proposed and declined, 0.24) | it would run only where Node and pptxgenjs exist, not in the PowerPoint add-in or Claude Design, and it would turn a rulebook into a builder; the patterns stay zones and budgets that any building tool executes |
| Placeholders are a brief decision, not a default (`Placeholders: allowed`, form `[[type: label]]`) | confidential figures must be buildable without the real values, but an unmarked placeholder on a board slide is a defect |
| Only the skill folder is installed | examples and documents stay out of the user's context |

## Open points

- **PowerPoint add-in, two tries so far:** the add-in skipped the direction round even though the prompt asked for it, and replaced the existing deck with the new one instead of appending drafts at the end as `direction.md` expects. A second audit adds a likely explanation: it never created pattern-named layouts (`P03 summary`, …) — every slide sat on the generic "Titel und Inhalt" layout. That alone would break the P01/P02 exemption, the recurring-placeholder check, and the plan's "layouts match by name" comparison, all of which key off a layout's name. Whether the add-in's underlying API (Office.js manipulating an already-open presentation) can create or rename slide masters and layouts at all, or the skill just is not asking it to there, cannot be told from outside it. Needs a repeatable test with the exact prompt and a look at what the add-in actually sent the model.
- Test in the Claude apps: does the skill load, does the check script run, is LibreOffice available in the sandbox?
- Calibrate `talk`, `pitch` and `update` on real decks of those kinds.
- Check word budgets per pattern zone and the 8 pt spacing grid in the script.
- Move the pptxgenjs notes from `SKILL.md` into their own reference file.
- A license, if the project is ever shared beyond invited users.
