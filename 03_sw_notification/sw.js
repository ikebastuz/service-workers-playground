var CACHE_NAME = `my-web-app-notification-sw`;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([]);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  const { notification, action } = event;
  const { data: payload } = notification;

  console.log(`Notificationclick action: ${action}`);
  console.log(`Payload: ${JSON.stringify(payload)}`);

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});

self.addEventListener('notificationclose', () => {
  console.log(`Notificationclose action`);
});
