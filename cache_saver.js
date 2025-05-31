if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("cache_saver.js");
}

const cacheName = "ruby_power_cache-v1.94";
const appShellFiles = [
  "index.html",
  "animation_game.js",
  "field_lib.js",
  "style.css",

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
  "images/stone.jpg",

  "images/restart_button.png",
  "images/arrow_right.png",
  "images/arrow_left.png",

  "images/edit_button.png",
  "images/edit_button_enabled.png",
  "images/card_add.png",
  
  "images/help_button.png",
  "help.html",
  "images/help/help_image_1.png",
  "images/help/help_image_2.png",
  "images/help/help_image_3.png",
  "images/help/help_image_4.png",
  "images/help/help_image_5.png"
];

caches.keys().then((thiscacheNames) =>
	Promise.all(
		thiscacheNames.map((thiscacheName) => {
			if (cacheName != thiscacheName) {
				return caches.delete(thiscacheName);
			}
		}),
	),
)

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles);
    })()
  );
});

self.addEventListener("fetch", (event) => {
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
