// FaceThis: network first, so updates show at once; the last copy is used when offline.
var C = 'ft-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || r.headers.has('range')) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res.ok && res.status === 200) { var copy = res.clone(); caches.open(C).then(function (c) { c.put(r, copy); }); }
    return res;
  }).catch(function () { return caches.match(r); }));
});
