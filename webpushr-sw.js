// Gid Lekti Bib la — cache v16
// Network-first pou nouvo fichye aplikasyon yo parèt san efase cache manyèlman.
const CACHE = 'gid-lekti-bib-v17';
const AUDIO_CACHE = 'kreyol-podcasts-audio-v1';
const CORE_FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const OPTIONAL_FILES = ['./kouveti-gid-lekti-bib-la.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all([...CORE_FILES, ...OPTIONAL_FILES].map(async file => {
      try {
        const response = await fetch(new Request(file, { cache: 'reload' }));
        if (response.ok) await cache.put(file, response);
      } catch (error) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith('gid-lekti-bib-') && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cachedPodcastResponse(request) {
  const cache = await caches.open(AUDIO_CACHE);
  const full = await cache.match(request.url);
  if (!full) {
    const network = await fetch(request);
    if (network.ok && request.headers.get('range') === null) {
      try { await cache.put(request.url, network.clone()); } catch (error) {}
    }
    return network;
  }
  const range = request.headers.get('range');
  if (!range) return full;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return new Response(null, { status: 416 });
  const buffer = await full.clone().arrayBuffer();
  const size = buffer.byteLength;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!match[1] && match[2]) {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  }
  if (start >= size || end < start) {
    return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  }
  end = Math.min(end, size - 1);
  const headers = new Headers(full.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'audio/mp4');
  return new Response(buffer.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
}

// Odyo Bib la gen pwòp cache pa li; li dwe disponib menm san entènèt.
const BIBLE_AUDIO_CACHE = 'lekiti-bib-la-daily-audio-v1';

async function cachedBibleAudioResponse(request) {
  const cache = await caches.open(BIBLE_AUDIO_CACHE);
  const full = await cache.match(request.url);
  if (!full) {
    // Telechaje fichye konplè a sou entènèt; pa mete yon repons Range pasyèl nan cache.
    const network = await fetch(request);
    if (network.ok && network.status === 200 && request.headers.get('range') === null) {
      try { await cache.put(request.url, network.clone()); } catch (error) {}
    }
    return network;
  }
  const range = request.headers.get('range');
  if (!range) return full;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return new Response(null, { status: 416 });
  const buffer = await full.clone().arrayBuffer();
  const size = buffer.byteLength;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!match[1] && match[2]) { start = Math.max(0, size - Number(match[2])); end = size - 1; }
  if (start >= size || end < start) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  end = Math.min(end, size - 1);
  const headers = new Headers(full.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'audio/mpeg');
  return new Response(buffer.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.toLowerCase().endsWith('.mp3') &&
      (url.pathname.includes('/bible-audio/') || url.pathname.includes('/bible-audio-2/'))) {
    event.respondWith(cachedBibleAudioResponse(request).catch(() =>
      new Response('Odyo Bib sa a poko telechaje pou mòd offline.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    ));
    return;
  }

  if (url.pathname.toLowerCase().endsWith('.m4a') && url.pathname.includes('/podcasts/')) {
    event.respondWith(cachedPodcastResponse(request).catch(() =>
      new Response('Odyo sa a poko telechaje pou mòd offline.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    ));
    return;
  }

  event.respondWith((async () => {
    try {
      const freshRequest = new Request(request, { cache: 'no-store' });
      const response = await fetch(freshRequest);
      if (response && response.ok && response.status === 200) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
