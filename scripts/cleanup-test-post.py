import json, os, shutil
root = '/home/idirs/.openclaw/workspace/uyghur-daily-AI'
index_path = os.path.join(root, 'data', 'index.json')
with open(index_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
data['posts'] = [p for p in data['posts'] if p.get('slug') != 'test-post-do-not-keep']
with open(index_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')
for path in [
    os.path.join(root, 'data', 'posts', 'post-test-post-do-not-keep.json'),
    os.path.join(root, 'p', 'test-post-do-not-keep')
]:
    if os.path.isdir(path):
        shutil.rmtree(path)
    elif os.path.exists(path):
        os.remove(path)
