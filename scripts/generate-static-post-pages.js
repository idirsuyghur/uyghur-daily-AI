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

function removeDuplicateTitle(contentHtml = '', title = '') {
  const escapedTitle = escapeHtml(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return String(contentHtml)
    .replace(new RegExp(`^\\s*<h1[^>]*>\\s*${escapedTitle}\\s*</h1>\\s*`, 'i'), '')
    .trim();
}

function articlePage(post) {
  const title = post.title || 'ئۇيغۇر AI بىلوگى';
  const desc = post.description || 'ئۇيغۇرچە ماقالە';
  const image = absUrl(post.featuredImage || 'assets/og-cover.png');
  const url = `${siteUrl}/p/${post.slug}/`;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const tagHtml = tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
  const articleHtml = removeDuplicateTitle(post.contentHtml || '', title);

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
  <script>
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  </script>
  <style>
    body{font-family:"Lateef",system-ui,sans-serif;margin:0;background:#f8fafc;color:#1e293b;line-height:1.8;background-image:radial-gradient(circle at top left,rgba(56,189,248,.10),transparent 35%)}
    html.dark body{background:#020617;color:#e5e7eb;background-image:radial-gradient(circle at top left,rgba(56,189,248,.08),transparent 35%)}
    .wrap{max-width:900px;margin:0 auto;padding:22px}
    .card{background:rgba(255,255,255,.96);border:1px solid rgba(203,213,225,.85);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,.12)}
    html.dark .card{background:#0f172a;border-color:rgba(255,255,255,.08);box-shadow:0 20px 60px rgba(0,0,0,.35)}
    .cover{width:100%;max-height:460px;object-fit:cover;display:block}
    .content{padding:24px 24px 32px}
    .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;color:#475569;font-size:20px}
    html.dark .meta{color:#cbd5e1}
    .pill,.tag{display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 12px;border-radius:999px}
    html.dark .pill,html.dark .tag{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.08)}
    h1{font-size:clamp(2.1rem,5vw,3.6rem);line-height:1.2;margin:0 0 10px}
    .desc{color:#475569;font-size:1.2rem;margin:0 0 20px}
    html.dark .desc{color:#cbd5e1}
    .article-body{font-size:1.35rem;color:#334155}
    html.dark .article-body{color:#e2e8f0}
    .article-body h2,.article-body h3{color:#0f172a}
    html.dark .article-body h2,html.dark .article-body h3{color:#fff}
    .article-body img{max-width:100%;border-radius:16px}
    .tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
    .topbar,.back{color:#2563eb;text-decoration:none}
    html.dark .topbar,html.dark .back{color:#93c5fd}
    .topbar{display:inline-block;margin-bottom:16px;font-size:1.1rem}
    .share{margin-top:24px;padding-top:18px;border-top:1px solid #e2e8f0;display:flex;gap:12px;flex-wrap:wrap}
    html.dark .share{border-top-color:rgba(255,255,255,.08)}
    .btn{display:inline-block;padding:10px 14px;border-radius:14px;background:#e2e8f0;color:#0f172a;text-decoration:none;border:1px solid #cbd5e1}
    html.dark .btn{background:#1e293b;color:#fff;border-color:rgba(255,255,255,.08)}
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
        <div class="article-body">${articleHtml}</div>
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
