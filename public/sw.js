/**
 * DEAD HOURS — Service Worker de Sobrevivência Offline
 * Permite a consulta ao Manual e Arquivos do Mundo mesmo em conexões de 3G/4G instáveis em campo.
 */

const CACHE_NAME = 'dead-hours-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/manual',
  '/cadastro',
  '/arquivos',
  '/busca',
  '/icon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[DEAD HOURS SW] Falha parcial no pre-cache inicial:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de outros esquemas (como chrome-extension)
  if (!event.request.url.startsWith('http')) return;

  // Estratégia Network First com Fallback para Cache para navegação e páginas HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback para página inicial se a rota offline não estiver salva
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Estratégia Stale-While-Revalidate para imagens e fontes estáticas
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
