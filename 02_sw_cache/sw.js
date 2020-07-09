const VERSION = 3;
const CACHE_NAME = `my-web-app-cache-v${VERSION}`;
const urlsToCache = [
  'http://127.0.0.1:5500/02/index.html',
  'http://127.0.0.1:5500/02/cached.png',
];
const cacheWhitelist = ['page-1', 'page-2'];

self.addEventListener('activate', (event) => {
  console.log('activating...');

  event.waitUntil(
    // Получение всех ключей из кэша.
    caches.keys().then((keyList) => {
      return Promise.all(
        // Прохождение по всем кэшированным файлам.
        keyList.map((key) => {
          // Если файл из кэша не находится в белом списке,
          // его следует удалить.
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('install', (event) => {
  console.log(`installing SW ${CACHE_NAME}...`);

  // event.waitUntil принимает промис для того, чтобы узнать,
  // сколько времени займёт установка, и успешно
  // или нет она завершилась.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log(
    `%cRequested file: ${event.request.url}. Cache - ${CACHE_NAME}`,
    'color: yellow'
  );

  event.respondWith(
    // Этот метод анализирует запрос и
    // ищет кэшированные результаты для этого запроса в любом из
    // созданных сервис-воркером кэшей.

    caches.match(event.request).then((response) => {
      // если в кэше найдено то, что нужно, мы можем тут же вернуть ответ.
      if (response) {
        console.log(
          `%cFound file: ${event.request.url}, returning object. Cache - ${CACHE_NAME}`,
          'color: #A9DC76'
        );
        return response;
      }

      // Клонируем запрос. Так как объект запроса - это поток,
      // обратиться к нему можно лишь один раз.
      // При этом один раз мы обрабатываем его для нужд кэширования,
      // ещё один раз он обрабатывается браузером, для запроса ресурсов,
      // поэтому объект запроса нужно клонировать.
      var fetchRequest = event.request.clone();

      // В кэше ничего не нашлось, поэтому нужно выполнить загрузку материалов,
      // что заключается в выполнении сетевого запроса и в возврате данных, если
      // то, что нужно, может быть получено из сети.
      return fetch(fetchRequest)
        .then((response) => {
          // Проверка того, получили ли мы правильный ответ
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          if (urlsToCache.includes(event.request.url)) {
            // Клонирование объекта ответа, так как он тоже является потоком.
            // Так как нам надо, чтобы ответ был обработан браузером,
            // а так же кэшем, его нужно клонировать,
            // поэтому в итоге у нас будет два потока.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              console.log(
                `%cAdding file to cache: ${event.request.url}. Cache - ${CACHE_NAME}`,
                'color: #78DCE8'
              );
              // Добавляем ответ в кэш для последующего использования.
              cache.put(event.request, responseToCache);
            });
            return response;
          } else {
            console.log(
              `%cReturning fetched file: ${event.request.url}. Cache - ${CACHE_NAME}`,
              'color: #2b85fd'
            );
            return response;
          }
        })
        .catch((_) => {
          console.log(
            `%cError fetching file: ${event.request.url}. Cache - ${CACHE_NAME}`,
            'color: #ff8c9a'
          );
          return response;
        });
    })
  );
});
