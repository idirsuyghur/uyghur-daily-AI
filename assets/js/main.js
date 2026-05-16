const state = { posts: [], page: 1, perPage: 9 };
const qs = (s) => document.querySelector(s);
const norm = (v) => (v || '').toString().toLowerCase();

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

qs('#themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

fetch(`data/index.json?v=${Date.now()}`, { cache: 'no-store' })
  .then((r) => r.json())
  .then((data) => {
    state.posts = Array.isArray(data.posts) ? data.posts : [];
    initFilters();
    render();
  })
  .catch(() => {
    qs('#resultsMeta').textContent = 'ماقالىلەرنى يۈكلەشتە مەسىلە كۆرۈلدى.';
  });

function initFilters() {
  const categorySel = qs('#categoryFilter');
  const tagSearch = qs('#tagSearchInput');
  const tagOptions = qs('#tagOptions');
  const popularTags = qs('#popularTags');

  [...new Set(state.posts.map((p) => p.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .forEach((c) => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      categorySel.appendChild(o);
    });

  const tagCounts = new Map();
  state.posts
    .flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))
    .filter(Boolean)
    .forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));

  [...tagCounts.keys()].sort((a, b) => a.localeCompare(b)).forEach((t) => {
    const o = document.createElement('option');
    o.value = `#${t}`;
    tagOptions?.appendChild(o);
  });

  [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .forEach(([tag]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = `#${tag}`;
      b.setAttribute('aria-label', `بەلگە بويىچە سۈزۈش: ${tag}`);
      b.className = 'tag-chip rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-950';
      b.addEventListener('click', () => {
        tagSearch.value = tagSearch.value === `#${tag}` ? '' : `#${tag}`;
        state.page = 1;
        render();
      });
      popularTags?.appendChild(b);
    });

  qs('#searchInput')?.addEventListener('input', () => {
    state.page = 1;
    render();
  });
  categorySel?.addEventListener('change', () => {
    state.page = 1;
    render();
  });
  tagSearch?.addEventListener('input', () => {
    state.page = 1;
    render();
  });
}

function filtered() {
  const q = norm(qs('#searchInput')?.value.trim());
  const c = qs('#categoryFilter')?.value;
  const t = (qs('#tagSearchInput')?.value || '').trim().replace(/^#/, '');

  return state.posts
    .filter((p) => {
      const inCategory = !c || p.category === c;
      const hasTag = !t || (Array.isArray(p.tags) && p.tags.some((tag) => tag === t || norm(tag).includes(norm(t))));
      const hay = norm(`${p.title || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`);
      const inSearch = !q || hay.includes(q);
      return inCategory && hasTag && inSearch;
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function postUrl(post) {
  return `p/${post.slug}/`;
}

function card(post, index = 0) {
  const loading = index < 3 ? 'eager' : 'lazy';
  return `<a href="${postUrl(post)}" class="group bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl overflow-hidden hover:-translate-y-1 transition duration-300">
    <div class="overflow-hidden">
      <img src="${post.featuredImage || 'assets/img/default-cover.svg'}" alt="${post.title}" loading="${loading}" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500"/>
    </div>
    <div class="p-4">
      <p class="text-xs text-slate-500 flex items-center gap-2"><span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">${post.category || ''}</span><span>${post.date || ''}</span></p>
      <h3 class="font-bold mt-2 leading-snug">${post.title || ''}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${post.description || ''}</p>
    </div>
  </a>`;
}

function render() {
  const posts = filtered();
  const start = (state.page - 1) * state.perPage;
  const pagePosts = posts.slice(start, start + state.perPage);
  const selectedTag = (qs('#tagSearchInput')?.value || '').trim();

  document.querySelectorAll('.tag-chip').forEach((chip) => {
    const active = chip.textContent === selectedTag;
    chip.classList.toggle('bg-sky-100', active);
    chip.classList.toggle('text-sky-900', active);
    chip.classList.toggle('border-sky-300', active);
    chip.classList.toggle('dark:bg-sky-950', active);
    chip.classList.toggle('dark:text-sky-100', active);
    chip.classList.toggle('dark:border-sky-700', active);
  });

  qs('#resultsMeta').textContent = `${posts.length} ماقالە تېپىلدى`;
  qs('#postsGrid').innerHTML = pagePosts.length
    ? pagePosts.map(card).join('')
    : '<div class="col-span-full text-center py-12 text-slate-500">ماس كېلىدىغان ماقالە تېپىلمىدى.</div>';

  const total = Math.ceil(posts.length / state.perPage);
  const pagination = qs('#pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    const b = document.createElement('button');
    b.textContent = i;
    b.setAttribute('aria-label', `${i}-بەت`);
    b.className =
      'px-3 py-1 rounded-lg transition border ' +
      (i === state.page
        ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
        : 'bg-slate-100 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700');
    b.onclick = () => {
      state.page = i;
      render();
    };
    pagination.appendChild(b);
  }
}
