const C='yaniv-v55',F=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* 自分のサイトのファイルは毎回サーバーに確認して最新を使う(GitHub Pagesの10分キャッシュを避ける)。圏外のときだけ保存済みを使う */
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||/firebasedatabase\.app|firebaseio\.com/.test(q.url))return;const same=new URL(q.url).origin===self.location.origin,req=same?new Request(q.url,{cache:'no-cache',credentials:'same-origin'}):q;
 e.respondWith(fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r}).catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match('index.html'):Response.error()))))});
