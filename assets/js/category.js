const c=new URLSearchParams(location.search).get('name')||'';
document.getElementById('title').textContent=`كاتېگورىيە: ${c}`;
fetch('/data/index.json').then(r=>r.json()).then(d=>{document.getElementById('list').innerHTML=d.posts.filter(p=>p.category===c).map(p=>`<a href='/post.html?slug=${p.slug}' class='p-4 rounded-xl shadow bg-white'>${p.title}</a>`).join('')||'ماقالە يوق';});
