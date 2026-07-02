// Регистрация Service Worker с учетом подпапки репозитория GitHub Pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ruby_power/cache_saver.js')
      .then((reg) => console.log('[App] Service Worker успешно зарегистрирован для области:', reg.scope))
      .catch((err) => console.error('[App] Ошибка регистрации Service Worker:', err));
  });
}

const cacheName = 'ruby_power_cache-v1.97';
const REPO_NAME = '/ruby_power';

// Массив путей, адаптированный под GitHub Pages
const appShellFiles = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/animation_game.js`,
  `${REPO_NAME}/field_lib.js`,
  `${REPO_NAME}/style.css`,
  `${REPO_NAME}/images/bomb.jpg`,
  `${REPO_NAME}/images/bonus_1.png`,
  `${REPO_NAME}/images/bonus_2.png`,
  `${REPO_NAME}/images/bonus_3.png`,
  `${REPO_NAME}/images/empty.jpg`,
  `${REPO_NAME}/images/gem0.png`,
  `${REPO_NAME}/images/gem1.png`,
  `${REPO_NAME}/images/gem2.png`,
  `${REPO_NAME}/images/gem3.png`,
  `${REPO_NAME}/images/gem4.png`,
  `${REPO_NAME}/images/gem_black_diamond.png`,
  `${REPO_NAME}/images/gem_gold.png`,
  `${REPO_NAME}/images/gem.png`,
  `${REPO_NAME}/images/gem_silver.png`,
  `${REPO_NAME}/images/ruby.png`,
  `${REPO_NAME}/images/shield_0.jpg`,
  `${REPO_NAME}/images/shield_1.jpg`,
  `${REPO_NAME}/images/shield_2.jpg`,
  `${REPO_NAME}/images/shield_3.jpg`,
  `${REPO_NAME}/images/stone.jpg`,
  `${REPO_NAME}/images/restart_button.png`,
  `${REPO_NAME}/images/arrow_right.png`,
  `${REPO_NAME}/images/arrow_left.png`,
  `${REPO_NAME}/images/edit_button.png`,
  `${REPO_NAME}/images/edit_button_enabled.png`,
  `${REPO_NAME}/images/card_add.png`,
  `${REPO_NAME}/images/help_button.png`,
  `${REPO_NAME}/help.html`,
  `${REPO_NAME}/images/help/help_image_1.png`,
  `${REPO_NAME}/images/help/help_image_2.png`,
  `${REPO_NAME}/images/help/help_image_3.png`,
  `${REPO_NAME}/images/help/help_image_4.png`,
  `${REPO_NAME}/images/help/help_image_5.png`,
  `${REPO_NAME}/manifest.html` 
];

// Событие установки: кэшируем файлы
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles);
    })()
  );
});

// Событие активации: безопасно удаляем старые версии кэша
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((thiscacheNames) => {
      return Promise.all(
        thiscacheNames.map((thiscacheName) => {
          if (cacheName !== thiscacheName) {
            console.log('[Service Worker] Удаление старого кэша:', thiscacheName);
            return caches.delete(thiscacheName);
          }
        })
      );
    })
  );
});

// Событие перехвата запросов: сначала смотрим в кэш, если нет — берем из сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const r = await caches.match(event.request);
      if (r) {
        return r;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(cacheName);
      cache.put(event.request, response.clone());
      return response;
    })()
  );
});

