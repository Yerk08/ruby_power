const cacheName = "ruby_power_cache-v1.1";
const appShellFiles = [
  "index.html",
  "cache_saver.js",
  "animation_game.js",
  "field_lib.js",
  "style.css",
  "images/",
  "images/bomb.jpg",
  "images/bonus_1.png",
  "images/bonus_2.png",
  "images/bonus_3.png",
  "images/empty.jpg",
  "images/gem0.png",
  "images/gem1.png",
  "images/gem2.png",
  "images/gem3.png",
  "images/gem4.png",
  "images/gem_black_diamond.png",
  "images/gem_gold.png",
  "images/gem.png",
  "images/gem_silver.png",
  "images/ruby.png",
  "images/shield_0.jpg",
  "images/shield_1.jpg",
  "images/shield_2.jpg",
  "images/shield_3.jpg",
  "images/stone.jpg"
];

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
      (async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })(),
    );
});
