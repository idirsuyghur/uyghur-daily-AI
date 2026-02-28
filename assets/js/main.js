const state={posts:[],page:1,perPage:9};
const qs=(s)=>document.querySelector(s);
const toggle=()=>document.documentElement.classList.toggle('dark');
qs('#themeToggle')?.addEventListener('click',toggle);

fetch('data/index.json').then(r=>r.json()).then(data=>{state.posts=data.posts;initFilters();render();});
function initFilters(){
  const sel=qs('#categoryFilter');
  [...new Set(state.posts.map(p=>p.category))].forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o)});
  qs('#searchInput').addEventListener('input',()=>{state.page=1;render()});
  sel.addEventListener('change',()=>{state.page=1;render()});
}
function filtered(){
  const q=qs('#searchInput').value.trim(); const c=qs('#categoryFilter').value;
  return state.posts.filter(p=>(!c||p.category===c)&&(!q||(`${p.title} ${p.tags.join(' ')}`).includes(q))).sort((a,b)=>b.date.localeCompare(a.date));
}
function render(){
  const posts=filtered(), start=(state.page-1)*state.perPage;
  qs('#postsGrid').innerHTML=posts.slice(start,start+state.perPage).map(p=>`<a href="post.html?slug=${p.slug}" class="bg-white dark:bg-slate-900 rounded-2xl shadow overflow-hidden hover:-translate-y-1 transition"><img src="${p.featuredImage || 'assets/img/default-cover.svg'}" alt="${p.title}" class="w-full h-40 object-cover"/><div class="p-4"><p class="text-xs text-slate-500">${p.date} · ${p.category}</p><h3 class="font-bold mt-2">${p.title}</h3><p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${p.description}</p></div></a>`).join('');
  const total=Math.ceil(posts.length/state.perPage); qs('#pagination').innerHTML='';
  for(let i=1;i<=total;i++){const b=document.createElement('button'); b.textContent=i; b.className='px-3 py-1 rounded '+(i===state.page?'bg-slate-800 text-white':'bg-slate-200'); b.onclick=()=>{state.page=i;render()}; qs('#pagination').appendChild(b);} 
}
