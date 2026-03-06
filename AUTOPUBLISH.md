# Autopublish (one command)

## Command

```bash
node scripts/autopublish-post.js \
  --title "YOUR TITLE" \
  --category "تېخنىكا" \
  --description "SHORT DESCRIPTION" \
  --tags "تېخنىكا,ئۇيغۇرچە,AI" \
  --content-file /tmp/post.html
```

This will automatically:
1. Create `data/posts/post-<slug>.json`
2. Update `data/index.json`
3. Commit changes
4. Push to `origin` (GitHub Pages updates after push)

## Minimal command

```bash
node scripts/autopublish-post.js --title "My New Post"
```

## Optional args

- `--date 2026-03-05`
- `--slug custom-slug`
- `--featured-image assets/img/default-cover.svg`
- `--featured-image-prompt "minimalist cover art..."`
- `--content-html "<h1>...</h1><p>...</p>"`
