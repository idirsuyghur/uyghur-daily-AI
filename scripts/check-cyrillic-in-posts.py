#!/usr/bin/env python3
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
POSTS_DIR = os.path.join(ROOT, 'data', 'posts')

bad = []
for fn in sorted(os.listdir(POSTS_DIR)):
    if not fn.endswith('.json'):
        continue
    path = os.path.join(POSTS_DIR, fn)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        bad.append((fn, f'JSON parse error: {e}'))
        continue

    text = json.dumps(data, ensure_ascii=False)
    matches = sorted(set(re.findall(r'\S*[\u0400-\u04FF]\S*', text)))
    if matches:
        bad.append((fn, ', '.join(matches[:10])))

if bad:
    print('Cyrillic characters found in post data:')
    for fn, sample in bad:
        print(f'- {fn}: {sample}')
    sys.exit(1)

print('OK: no Cyrillic characters found in post data.')
