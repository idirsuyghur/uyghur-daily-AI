const slug = new URLSearchParams(location.search).get('slug');

function estimateReadingTime(html = '') {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}

function relatedPosts(current, all, limit = 4) {
  const currentTags = new Set(Array.isArray(current.tags) ? current.tags : []);

  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const overlap = tags.filter((t) => currentTags.has(t)).length;
      const categoryBoost = p.category && p.category === current.category ? 1 : 0;
      return { ...p, _score: overlap * 3 + categoryBoost };
    })
    .sort((a, b) => (b._score - a._score) || (b.date || '').localeCompare(a.date || ''))
    .slice(0, limit);
}

fetch('data/index.json')
  .then((r) => r.json())
  .then(async (idx) => {
    const all = Array.isArray(idx.posts) ? idx.posts : [];
    const meta = all.find((p) => p.slug === slug);
    if (!meta) throw new Error('404');

    const p = await fetch(`data/posts/${meta.file}`).then((r) => r.json());
    const readingTime = estimateReadingTime(p.contentHtml || '');

    document.title = `${p.title} | ئۇيغۇر AI بىلوگى`;
    document.getElementById('article').innerHTML = `
      <img src="${p.featuredImage || 'assets/img/default-cover.svg'}" alt="${p.title}" class="w-full rounded-xl mb-4 max-h-[420px] object-cover"/>
      <p class="text-sm text-slate-500">${p.date || ''} · ${p.category || ''} · ${readingTime} مىنۇت ئوقۇش</p>
      <h1 class="text-3xl font-bold my-4">${p.title || ''}</h1>
      ${p.author ? `<p class="text-sm mb-1"><strong>ئاپتور:</strong> ${p.author}</p>` : ''}
      ${p.sourceUrl ? `<p class="text-sm mb-4"><strong>مەنبە:</strong> <a class="underline" target="_blank" rel="noopener noreferrer" href="${p.sourceUrl}">${p.sourceUrl}</a></p>` : ''}
      ${p.contentHtml || ''}
      <div class="mt-8 text-sm">${(p.tags || []).map((t) => `<span class='px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 mr-1'>#${t}</span>`).join('')}</div>
    `;

    const related = relatedPosts(meta, all, 4);
    const relatedEl = document.getElementById('relatedPosts');
    const wrap = document.getElementById('relatedWrap');

    if (!related.length) {
      wrap.style.display = 'none';
      return;
    }

    relatedEl.innerHTML = related.map((r) => `
      <a href="post.html?slug=${r.slug}" class="bg-white dark:bg-slate-900 rounded-xl shadow p-4 hover:-translate-y-1 transition">
        <p class="text-xs text-slate-500">${r.date || ''} · ${r.category || ''}</p>
        <h3 class="font-bold mt-2">${r.title || ''}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${r.description || ''}</p>
      </a>
    `).join('');
  })
  .catch(() => {
    document.getElementById('article').innerHTML = '<h1>ماقالە تېپىلمىدى</h1>';
    const wrap = document.getElementById('relatedWrap');
    if (wrap) wrap.style.display = 'none';
  });
