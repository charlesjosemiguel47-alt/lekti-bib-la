const CACHE = 'gid-lekti-bib-v12';
const CORE_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
const OPTIONAL_FILES = ['./kouveti-gid-lekti-bib-la.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE_FILES.map(async file => {
      try { await cache.add(file); } catch (error) { /* allow SW installation; retry on fetch */ }
    }));
    await Promise.all(OPTIONAL_FILES.map(async file => {
      try { await cache.add(file); } catch (error) { /* optional asset */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('gid-lekti-bib-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
