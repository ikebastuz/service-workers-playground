importScripts('./lib.js');

var CACHE_NAME = `my-web-app-calc-sw`;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([]);
    })
  );
});

self.addEventListener('message', (event) => {
  let message;
  if (!event.data) return;

  const { cmd, data } = event.data;
  switch (cmd) {
    case 'fib':
      var result = fib(data);
      message = { cmd, result };
      break;
    case 'bubble':
      var result = bubbleSort();
      message = { cmd, result };
      break;
    default:
  }

  self.clients
    .matchAll({
      includeUncontrolled: true,
      type: 'window',
    })
    .then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage(message);
      }
    });
});
