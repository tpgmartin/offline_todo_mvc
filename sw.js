var staticCacheName = 'todos-static-v1';
var filesToCache = [
                    '/',
                    '/index.html',
                    '/js/app.js',
                    '/js/controller.js',
                    '/js/helpers.js',
                    '/js/model.js',
                    '/js/store.js',
                    '/js/template.js',
                    '/js/view.js',
                    '/js/lib/base.js',
                    '/styles/base.css',
                    '/styles/index.css',
                  ];

self.addEventListener('install', function(event) {
  console.log('serviceWorker Install');
  // Remove skipWaiting after debugging
  self.skipWaiting();
  
  event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('serviceWorker Activate');
  
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== staticCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Later add support for data requests if needed
  console.log('Fetch', event.request.url);
  
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
