// Feldcheck Service Worker
// Bei jeder Änderung an App-Dateien VERSION hochzählen, damit Geräte die neue Version laden.
const VERSION = 'v1.3.0';
const APP_CACHE = `feldcheck-app-${VERSION}`;
const RUNTIME_CACHE = 'feldcheck-runtime';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// Installation: App-Shell vorab in den Cache legen
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((c) => c.addAll(APP_SHELL)));
});

// Aktivierung: alte App-Caches entfernen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k.startsWith('feldcheck-app-') && k !== APP_CACHE)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Die Seite kann ein wartendes Update sofort aktivieren lassen
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Seitenaufrufe: zuerst Netz (frische Version), offline aus dem Cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Google Fonts: aus dem Cache, im Hintergrund aktualisieren
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Eigene Dateien: Cache zuerst, sonst Netz
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
});
