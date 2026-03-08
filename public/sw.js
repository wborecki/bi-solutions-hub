const SW_VERSION = "v1";
const STATIC_CACHE = `static-${SW_VERSION}`;
const IMAGE_CACHE = `images-${SW_VERSION}`;
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/solucoes",
  "/sobre",
  "/blog",
  "/contato",
  "/portal/login",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, IMAGE_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // HTML/navigation: network first, fallback to cache and offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/offline.html");
        })
    );
    return;
  }

  // Images: cache first
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) return cached;
        const response = await fetch(request);
        const copy = response.clone();
        caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
    );
    return;
  }

  // JS/CSS/fonts: stale-while-revalidate
  if (["style", "script", "font"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        const networkPromise = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);

        return cached || networkPromise;
      })
    );
  }
});
