var staticCacheName = 'restaurant-cache-v3';

/* Store  assets in cache */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        'sw.js',
        '/css/styles.css',
        '/js/idb.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/js/dbhelper.js',
        '/img/',
        '/img270/'
      ]).then(() => self.skipWaiting()); 
    })
  );
});

/* Check for old cache and remove */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant-cache-') &&
                 cacheName != staticCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/* Fetch from network and store in cache */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open(staticCacheName).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        })
      });
    }).catch(() => { 
      console.log('Problem with network. Try again.');
    })
  );
});