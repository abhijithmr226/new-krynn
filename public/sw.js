// KRYNN SPORTS Service Worker v8
// Clean PWA service worker — no third-party scripts

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  // Clear ALL old caches on activate
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
