var CACHE_NAME = `my-web-app-push-sw`;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([]);
    })
  );
});

self.addEventListener('push', function (e) {
  console.log('Received push event');
  const payload = JSON.parse(e.data.text());
  const { title, body } = payload;
  var options = {
    body,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
