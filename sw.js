/* Conexión Local — Service Worker */
const CACHE_NAME = 'conexion-local-v8'; // ← sube la versión para forzar actualización
const APP_SHELL = [
  './',
  './index.html',
  './estilo.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'imagen/SalonBelleza.jpg',
  'imagen/Caucaser.png',
  'imagen/LocalTri.jpeg',
  'imagen/HotelImagen.jpg'
];

// ── INSTALL: guarda el app shell ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpia cachés viejos ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // HTML / navegación → Network First + avisa al cliente si hay versión nueva
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match('./index.html');

        const networkFetch = fetch(request).then(response => {
          if (response.ok) {
            cache.put('./index.html', response.clone());

            // Si ya había caché, notifica al cliente que hay versión nueva
            if (cached) {
              self.clients.matchAll().then(clients => {
                clients.forEach(client =>
                  client.postMessage({ type: 'NEW_VERSION_AVAILABLE' })
                );
              });
            }
          }
          return response;
        }).catch(() => cached);

        // Muestra el caché inmediatamente si existe, si no espera la red
        return cached || networkFetch;
      })
    );
    return;
  }

  // Archivos propios (CSS, imágenes, JS) → Stale-While-Revalidate
  if (isSameOrigin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);

        const networkFetch = fetch(request).then(response => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  // Recursos externos (fonts, CDN) → Cache First, red como fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok || response.type === 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return response;
      });
    })
  );
});