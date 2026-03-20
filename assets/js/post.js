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

function bindShareButtons(title) {
  const url = window.location.href;
  const tg = document.getElementById('shareTelegram');
  const x = document.getElementById('shareX');
  const copy = document.getElementById('copyLink');

  if (tg) tg.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  if (x) x.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        copy.textContent = 'ئۇلىنىش كۆچۈرۈلدى ✅';
        setTimeout(() => (copy.textContent = 'ئۇلىنىشنى كۆچۈرۈش'), 1500);
      } catch {
        copy.textContent = 'كۆچۈرۈش مەغلۇپ بولدى';
      }
    });
  }
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
      <img src="${p.featuredImage || 'assets/img/default-cover.svg'}" alt="${p.title}" class="w-full rounded-2xl mb-5 max-h-[460px] object-cover border border-slate-200 dark:border-slate-800"/>

      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">${p.category || 'بۆلەك'}</span>
        <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">${p.date || ''}</span>
        <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">${readingTime} مىنۇت ئوقۇش</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-extrabold mt-4 mb-4 leading-tight">${p.title || ''}</h1>

      <div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
        ${p.author ? `<p><strong>ئاپتور:</strong> ${p.author}</p>` : ''}
        ${p.sourceUrl ? `<p><strong>مەنبە:</strong> <a class="underline" target="_blank" rel="noopener noreferrer" href="${p.sourceUrl}">Original link</a></p>` : ''}
      </div>

      <div class="article-body">${p.contentHtml || ''}</div>

      <div class="mt-7 text-sm flex flex-wrap gap-2">${(p.tags || []).map((t) => `<span class='px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700'>#${t}</span>`).join('')}</div>

      <div class="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <span class="text-sm text-slate-500 ml-2">ھەمبەھىرلەش:</span>
        <a id="shareTelegram" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">Telegram</a>
        <a id="shareX" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700">X</a>
        <button id="copyLink" class="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">ئۇلىنىشنى كۆچۈرۈش</button>
      </div>
    `;

    bindShareButtons(p.title || 'Post', new URL(staticUrl, window.location.href).href);

    const related = relatedPosts(meta, all, 4);
    const relatedEl = document.getElementById('relatedPosts');
    const wrap = document.getElementById('relatedWrap');

    if (!related.length) {
      wrap.style.display = 'none';
      return;
    }

    relatedEl.innerHTML = related.map((r) => `
      <a href="post.html?slug=${r.slug}" class="group bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition duration-300">
        <p class="text-xs text-slate-500">${r.date || ''} · ${r.category || ''}</p>
        <h3 class="font-bold mt-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-300">${r.title || ''}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${r.description || ''}</p>
      </a>
    `).join('');
  })
  .catch(() => {
    document.getElementById('article').innerHTML = '<h1>ماقالە تېپىلمىدى</h1>';
    const wrap = document.getElementById('relatedWrap');
    if (wrap) wrap.style.display = 'none';
  });
