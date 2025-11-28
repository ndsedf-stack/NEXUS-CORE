// Service Worker - NEON FIT V3.0
const CACHE_VERSION = 'v1764355499';

// Installation : vider les caches et prendre controle immédiat
self.addEventListener('install', event => {
  console.log('SW: Installing', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(names => 
      Promise.all(names.map(n => caches.delete(n)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activating', CACHE_VERSION);
  event.waitUntil(self.clients.claim());
});

// Network-first, pas de cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => caches.match(event.request))
  );
});
