# Trigger test of the skill description (0.17)

Question: does Claude load the skill for slide requests, and leave it out for other tasks? Measured with Claude Code in headless mode (`claude -p`, version 2.1.282), skill installed as a project skill, each prompt once, at most 3 or 4 turns. Other skills were available at the same time, among them `anthropic-skills:pptx`, `slides` and `design`. Procedure: `bash tests/trigger/run.sh`.

20 prompts in `prompts.tsv`: 10 should load the skill (new decks in German and English, pitch, keynote, lecture, board paper, redesigning or checking the design of an existing .pptx), 10 should not (extract text, convert, count slides, summarise, email, Excel, Word, landing page, code, a knowledge question).

| Run | Description | Should load | Should not load | Total |
|---|---|---|---|---|
| 1 (3 turns) | 0.17 before the change | 5 of 10 | 10 of 10 | 15 of 20 |
| 2 (4 turns) | sharpened | 10 of 10 | 10 of 10 | 20 of 20 |
| 3 (4 turns, `run.sh`) | sharpened | 10 of 10 | 10 of 10 | 20 of 20 |

**Finding from run 1:** for four prompts ("board update", "keynote", "decision paper", "customer survey") the model first asked its own questions about content and numbers and never loaded the skill. Those questions left out the look, which is exactly what the skill's first round asks for. Two more misses (redesigning or checking an existing .pptx) ended at the turn limit while the model searched for the file; they are not conclusive.

**Change:** the description now says that the skill loads before the first question about the deck, because it defines that question round; it names talk, keynote, lecture, board and status update, decision paper and checking the design of an existing .pptx; and it explicitly excludes summarising and counting. `SKILL.md` step 1: if questions were already asked, ask only the missing Round 1 items.

**After loading,** the model asked about purpose, situation and look and offered rendered directions (prompts 06 and 07 read).

**Limits:** each prompt ran once per run; small sample; measured only in Claude Code with the CLI's default model, not in the Claude apps, the PowerPoint add-in or with other models. Run 1 had one turn fewer than runs 2 and 3.
