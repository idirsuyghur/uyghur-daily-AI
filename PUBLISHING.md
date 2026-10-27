# Safe article publishing

## Requirements
- Write all visible article text in natural Arabic-script Uyghur: title, excerpt, headings, body, category, tags, image alt/caption and disclosures. Avoid English template labels on the article page.
- Include a real cover asset. Disclose generated illustrations in Uyghur; never describe them as documentary photographs. Do not invent testimony, history, or statistics.

## Procedure
1. Inspect git status, AUTOPUBLISH.md, data/index.json, source JSON, scripts/generate-static-post-pages.js and .github/workflows before editing. Preserve unrelated changes. The daily-post workflow is disabled; do not enable it as part of an article.
2. Check github_identity_status and run GIT_TERMINAL_PROMPT=0 git push --dry-run origin HEAD. Copilot login does not establish Git write access. If unavailable, reconnect GitHub in Settings → Agents → Tools with write access to idirsuyghur/uyghur-daily-AI, and configure the intended Git author. Never dump credentials. If the operator supplied a repository-scoped temporary Git credential cache, use `git -c credential.helper="cache --timeout=3600" -c credential.useHttpPath=true` for dry-run and actual pushes; do not print credential-helper output or persist the token. A missing OpenClaw identity does not invalidate a separately verified Git cache. Verify the repository account against the public GitHub user API before using its numeric-ID noreply author address, and disclose that author choice.
3. Create data/posts/post-<slug>.json with title, slug, date, category, tags, description, featuredImage, featuredImageAlt, featuredImageCaption, contentHtml and file. Keep the body out of the index. Preserve existing index entries; prepend the new metadata once.
4. Generate one original cover via image_generate if available; call once and follow its completion event. Never restart a pending generation. Inspect the image and place it under assets/img/. Verify format and dimensions.
5. Render only p/<slug>/index.html using the existing static page design. The existing generator rewrites all pages and includes English branding/share labels; do not run it across the repository for a one-article change. Localize this article's title suffix and controls, use its descriptive alt/caption, and omit the legacy dynamic-view link. Keep lang=ug, dir=rtl, canonical and social image URLs. Homepage links already use p/<slug>/.
6. Add only this article to rss.xml and sitemap.xml, preserving old entries. Do not repair unrelated stale feed history.
7. Validate JSON, HTML nesting, visible text for Latin/Cyrillic leakage, cover existence/dimensions, canonical/local links and XML parsing. Review Uyghur prose manually; automated script checks cannot certify fluency. Preview desktop/mobile if browser tools are available, otherwise disclose the limitation.
8. Review git diff --check and git diff --stat. Stage exact article JSON, static page, cover, index, feed, sitemap and requested procedure docs only. Inspect git diff --cached --name-only before committing. Use the configured author; do not invent a user identity.
9. Commit and git push origin HEAD. Require a successful exit, compare git rev-parse HEAD with git ls-remote origin HEAD, then verify the deployed article, asset, index and feed over HTTP. A push alone does not prove deployment. Wait for Pages propagation with bounded checks; report pending deployment honestly.
10. Return the live URL, title, commit, checks and any limitations. Save private continuity notes outside this repository, never copy agent/user context into public source.

## Unsafe legacy helper
Do not run scripts/autopublish-post.js for publication without a separately reviewed fix. It creates placeholder content when body is missing, stages all p/ pages, and prints Published even if push fails. Use the explicit staged workflow above instead.

## Prepared article
- Slug: aile-turmushida-uyghur-tili-we-medeniyiti
- Source: data/posts/post-aile-turmushida-uyghur-tili-we-medeniyiti.json
- Static page: p/aile-turmushida-uyghur-tili-we-medeniyiti/index.html
- Cover: assets/img/aile-turmushida-uyghur-tili-we-medeniyiti.png
