// Simple service worker for offline support
const CACHE = 'binman-cache-v1';
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.babylonjs.com/babylon.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(resp => {
      // Cache new requests (ignore opaque cross-origin for simplicity)
      try { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } catch(e){}
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
