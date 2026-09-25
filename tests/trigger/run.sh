#!/bin/bash
# Trigger test: does headless Claude Code load slide-craft for slide requests, and not for other tasks?
# Needs the claude CLI (logged in). Builds the package, installs it as a project skill in a scratch folder,
# sends every prompt of prompts.tsv once (4 turns max) and writes stream-json per prompt; then scores.
# Usage: bash tests/trigger/run.sh [work dir]   (default: /tmp/slide-craft-trigger)
set -e
HERE=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$HERE/../.." && pwd)
W=${1:-/tmp/slide-craft-trigger}
python3 "$ROOT/tools/package.py"
rm -rf "$W"; mkdir -p "$W/proj/.claude/skills" "$W/out"
cp -r "$ROOT/dist/slide-craft" "$W/proj/.claude/skills/"
one() {
  cd "$W/proj" && timeout 240 claude -p "$3" --max-turns 4 --output-format stream-json --verbose --allowedTools "Skill" > "$W/out/$1.jsonl" 2>"$W/out/$1.err" || true
}
export -f one; export W
while IFS=$'\t' read -r id exp text; do printf '%s\0%s\0%s\0' "$id" "$exp" "$text"; done < "$HERE/prompts.tsv" | xargs -0 -n3 -P5 bash -c 'one "$@"' _
cd "$HERE" && python3 eval.py "$W/out"
