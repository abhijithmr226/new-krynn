// KRYNN SPORTS Service Worker v4
// Clears old caches (which had the popup), then hands off to Monetag SW

// Step 1: Force activate immediately so cache clearing happens right away
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  // Clear ALL old caches so no stale popup HTML remains
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Step 2: Hand control to Monetag push notification SW
self.options = {
    "domain": "3nbf4.com",
    "zoneId": 11138495
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')
