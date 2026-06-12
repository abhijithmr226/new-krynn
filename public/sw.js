// KRYNN SPORTS Service Worker v3 — cache bust (removes old popup cache)
const CACHE_VERSION = 'krynn-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_VERSION) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network-first: always serve fresh content
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Monetag push notifications
self.options = {
    "domain": "3nbf4.com",
    "zoneId": 11138495
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')
