const SHELL='shell-v9',TILES='tiles-v1',MAPS='maps-v1',MAXT=8000;
const HOSTS=['cdnjs.cloudflare.com','cdn.jsdelivr.net','protomaps.github.io'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>Promise.all(['./','index.html','famille.html','famille.webmanifest','lieux.enc.json','connus.json','infos.json','activites.json','fond-accueil.svg','manifest.webmanifest','icon-192.png','icon-512.png'].map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(ks=>Promise.all(ks.filter(k=>![SHELL,TILES,MAPS].includes(k)).map(k=>caches.delete(k))))]))});
self.addEventListener('fetch',e=>{
const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.pathname.endsWith('.pmtiles'))return;
if(u.hostname==='tile.openstreetmap.org'){
e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(r);if(hit)return hit;
try{const res=await fetch(r);if(res.ok){c.put(r,res.clone());if(Math.random()<0.02)c.keys().then(k=>{if(k.length>MAXT)k.slice(0,500).forEach(x=>c.delete(x))})}return res}catch(err){return Response.error()}}));return}
if(u.origin===location.origin||HOSTS.includes(u.hostname)){
e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))))}
});
