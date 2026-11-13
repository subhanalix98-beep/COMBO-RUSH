const C='combo-rush-v2';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
function netFirst(r){return new Promise(res=>{let done=0;
const fin=v=>{if(!done){done=1;res(v)}};
const t=setTimeout(()=>caches.match(r).then(h=>{if(h)fin(h)}),2500);
fetch(r).then(n=>{clearTimeout(t);if(n&&n.ok){const cp=n.clone();caches.open(C).then(c=>c.put(r,cp))}fin(n)})
.catch(()=>{clearTimeout(t);caches.match(r).then(h=>fin(h||caches.match('index.html')))})})}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(netFirst(e.request))});
