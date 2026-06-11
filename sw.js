var CACHE_NAME = 'sleep-dashboard-v2';
var URLS_TO_CACHE = [
  './',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('chart.js') > -1) {
    e.respondWith(
      caches.match(e.request).then(function(resp) {
        return resp || fetch(e.request).then(function(netResp) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, netResp.clone());
            return netResp;
          });
        });
      })
    );
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
});
