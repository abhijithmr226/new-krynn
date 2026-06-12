const CACHE_NAME = 'krynn-sports-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/krynn_logo.png',
  '/worldcup_logo.png',
  '/worldcup_banner.png',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell Assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('[Service Worker] Active & Ready.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Cleaning old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  const requestUrl = event.request.url;

  // IMPORTANT: Bypassing stream manifests (.mpd, .m3u8), DRM keys, and video segments (.ts, .m4s) from caching
  if (
    requestUrl.includes('/api/play') || 
    requestUrl.includes('.mpd') || 
    requestUrl.includes('.m3u8') || 
    requestUrl.includes('.ts') || 
    requestUrl.includes('.m4s') ||
    requestUrl.includes('/api/widget') ||
    requestUrl.includes('sportscore.com')
  ) {
    return; // Pass through to network
  }

  // Respond with cache first, fall back to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(networkResponse => {
          // Cache newly requested static assets if they are from the same origin
          if (
            event.request.method === 'GET' && 
            networkResponse.status === 200 &&
            requestUrl.startsWith(self.location.origin)
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      }).catch(() => {
        // Fallback for offline mode if shell resource is missing
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
