import json, sys
out = sys.argv[1]
import os
rows = [l.rstrip('\n').split('\t') for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prompts.tsv'))]
ok = 0
for id_, exp, text in rows:
    skills = []; tools = []; res = None
    for line in open(f'{out}/{id_}.jsonl'):
        try: o = json.loads(line)
        except Exception: continue
        if o.get('type') == 'assistant':
            for c in o['message'].get('content', []):
                if c.get('type') == 'tool_use':
                    tools.append(c['name'])
                    if c['name'] == 'Skill': skills.append(c['input'].get('skill') or c['input'].get('command'))
        if o.get('type') == 'result': res = o.get('subtype')
    hit = any(s and 'slide-craft' in s for s in skills)
    good = hit == (exp == 'yes'); ok += good
    print(id_, exp, 'LOADED' if hit else '-     ', 'OK  ' if good else 'MISS', res, skills, tools[:4], text[:50])
print('correct', ok, 'of', len(rows))
