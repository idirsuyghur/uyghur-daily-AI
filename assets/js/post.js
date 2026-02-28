const slug=new URLSearchParams(location.search).get('slug');
fetch('data/index.json').then(r=>r.json()).then(async idx=>{
  const meta=idx.posts.find(p=>p.slug===slug); if(!meta) throw new Error('404');
  const p=await fetch(`data/posts/${meta.file}`).then(r=>r.json());
  document.title=p.title+' | ئۇيغۇر AI بىلوگى';
  document.getElementById('article').innerHTML=`<img src="${p.featuredImage || 'assets/img/default-cover.svg'}" alt="${p.title}" class="w-full rounded-xl mb-4 max-h-[420px] object-cover"/><p class="text-sm text-slate-500">${p.date} · ${p.category}</p><h1 class="text-3xl font-bold my-4">${p.title}</h1>${p.contentHtml}<div class="mt-8 text-sm">${p.tags.map(t=>`<span class='px-2 py-1 rounded bg-slate-200 mr-1'>#${t}</span>`).join('')}</div>`;
}).catch(()=>document.getElementById('article').innerHTML='<h1>ماقالە تېپىلمىدى</h1>');
