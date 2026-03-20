#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const siteUrl = 'https://idirsuyghur.github.io/uyghur-daily-AI';
const indexPath = path.join(repoRoot, 'data', 'index.json');
const outDir = path.join(repoRoot, 'p');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absUrl(input = '') {
  if (!input) return `${siteUrl}/assets/og-cover.png`;
  if (/^https?:\/\//i.test(input)) return input;
  return `${siteUrl}/${input.replace(/^\/+/, '')}`;
}

function articlePage(post) {
  const title = post.title || 'ئۇيغۇر AI بىلوگى';
  const desc = post.description || 'ئۇيغۇرچە ماقالە';
  const image = absUrl(post.featuredImage || 'assets/og-cover.png');
  const url = `${siteUrl}/p/${post.slug}/`;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const tagHtml = tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('');

  return `<!doctype html>
<html lang="ug" dir="rtl" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)} | ئۇيغۇر AI بىلوگى</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="ئۇيغۇر AI بىلوگى" />
  <meta property="article:published_time" content="${escapeHtml(post.date || '')}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${image}" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lateef:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body{font-family:"Lateef",system-ui,sans-serif;margin:0;background:#020617;color:#e5e7eb;line-height:1.8}
    .wrap{max-width:900px;margin:0 auto;padding:24px}
    .card{background:#0f172a;border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.35)}
    .cover{width:100%;max-height:460px;object-fit:cover;display:block}
    .content{padding:24px 24px 32px}
    .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;color:#cbd5e1;font-size:20px}
    .pill,.tag{display:inline-block;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);padding:4px 12px;border-radius:999px}
    h1{font-size:clamp(2.2rem,5vw,3.8rem);line-height:1.2;margin:0 0 10px}
    .desc{color:#cbd5e1;font-size:1.2rem;margin:0 0 20px}
    .article-body{font-size:1.35rem;color:#e2e8f0}
    .article-body h2,.article-body h3{color:#fff}
    .article-body img{max-width:100%;border-radius:16px}
    .tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
    .topbar,.back{color:#93c5fd;text-decoration:none}
    .topbar{display:inline-block;margin-bottom:16px;font-size:1.1rem}
    .share{margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:12px;flex-wrap:wrap}
    .btn{display:inline-block;padding:10px 14px;border-radius:14px;background:#1e293b;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.08)}
  </style>
</head>
<body>
  <div class="wrap">
    <a class="topbar" href="${siteUrl}/index.html">← باش بەتكە قايتىش</a>
    <article class="card">
      <img class="cover" src="${image}" alt="${escapeHtml(title)}" />
      <div class="content">
        <div class="meta">
          ${post.category ? `<span class="pill">${escapeHtml(post.category)}</span>` : ''}
          ${post.date ? `<span class="pill">${escapeHtml(post.date)}</span>` : ''}
        </div>
        <h1>${escapeHtml(title)}</h1>
        <p class="desc">${escapeHtml(desc)}</p>
        <div class="article-body">${post.contentHtml || ''}</div>
        <div class="tags">${tagHtml}</div>
        <div class="share">
          <a class="btn" href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a class="btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">X</a>
          <a class="btn" href="${siteUrl}/post.html?slug=${encodeURIComponent(post.slug)}">Dynamic view</a>
        </div>
      </div>
    </article>
  </div>
</body>
</html>`;
}

const idx = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
for (const meta of idx.posts || []) {
  if (!meta.file) continue;
  const postPath = path.join(repoRoot, 'data', 'posts', meta.file);
  if (!fs.existsSync(postPath)) continue;
  const post = JSON.parse(fs.readFileSync(postPath, 'utf8'));
  const dir = path.join(outDir, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), articlePage(post));
}
console.log(`Generated static pages for ${(idx.posts || []).length} posts in /p`);
