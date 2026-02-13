const CACHE_NAME = "focus-guard-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/app.js",
  "./src/config.js",
  "./src/notification.js",
  "./src/timer.js",
  "./src/detector.js",
  "./src/ui.js",
  "./icon.svg",
  "./sound.mp3",
  "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js",
  "https://unpkg.com/ml5@0.12.2/dist/ml5.min.js",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((r) => {
      console.log("[Service Worker] Fetching resource: " + event.request.url);
      return (
        r ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            console.log(
              "[Service Worker] Caching new resource: " + event.request.url,
            );
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
});
