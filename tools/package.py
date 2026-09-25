"""Build the installable skill: dist/slide-craft/ and dist/slide-craft.zip.

Only what the skill needs goes in: SKILL.md, references/, scripts/. Project documents (audits, brief,
research, examples, tests) stay in the repository. The ZIP holds the skill folder as its top level,
as claude.ai expects (<name>/SKILL.md). Usage: python3 tools/package.py
"""
import os
import re
import shutil
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
PARTS = ['SKILL.md', 'references', 'scripts']
SKIP = re.compile(r'(__pycache__|\.pyc$|\.DS_Store$)')


def frontmatter(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    if not m:
        sys.exit('SKILL.md has no YAML frontmatter')
    fm = {}
    for line in m.group(1).splitlines():
        k = re.match(r'([a-z_]+):\s*(.*)', line)
        if k and not line.startswith(' '):
            fm[k.group(1)] = k.group(2).strip()
    return fm


def check(skill_md):
    text = open(skill_md, encoding='utf-8').read()
    fm = frontmatter(text)
    name, desc = fm.get('name', ''), fm.get('description', '')
    problems = []
    if not re.fullmatch(r'[a-z0-9-]{1,64}', name):
        problems.append('name must be lowercase letters, digits and hyphens, up to 64 characters: %r' % name)
    if not desc or len(desc) > 1024:
        problems.append('description must be 1 to 1024 characters (has %d)' % len(desc))
    if '<' in desc or '>' in desc:
        problems.append('description must not contain angle brackets')
    lines = text.count('\n')
    if lines > 500:
        problems.append('SKILL.md has %d lines; keep it under 500' % lines)
    # every file SKILL.md names under references/ or scripts/ must exist
    for ref in sorted(set(re.findall(r'`((?:references|scripts)/[\w./-]+\.(?:md|py))`', text))):
        if not os.path.exists(os.path.join(ROOT, ref)):
            problems.append('SKILL.md names %s, which does not exist' % ref)
    return name, problems


def main():
    name, problems = check(os.path.join(ROOT, 'SKILL.md'))
    if problems:
        sys.exit('not packaged:\n- ' + '\n- '.join(problems))
    out = os.path.join(DIST, name)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    for part in PARTS:
        src = os.path.join(ROOT, part)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(out, part), ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '.DS_Store'))
        else:
            shutil.copy2(src, out)
    zpath = os.path.join(DIST, name + '.zip')
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for base, _, files in os.walk(out):
            for f in sorted(files):
                full = os.path.join(base, f)
                if not SKIP.search(full):
                    z.write(full, os.path.relpath(full, DIST))
    with zipfile.ZipFile(zpath) as z:
        names = z.namelist()
    assert all(n.startswith(name + '/') for n in names), 'ZIP entries must start with the skill folder'
    print('%s: %d files, %.0f KB' % (os.path.relpath(zpath, ROOT), len(names), os.path.getsize(zpath) / 1024))


if __name__ == '__main__':
    main()
