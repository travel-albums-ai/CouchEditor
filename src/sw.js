importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (self.workbox) {
  const wb = self.workbox;

  wb.setConfig({ debug: false });

  wb.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  wb.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new wb.strategies.StaleWhileRevalidate()
  );

  wb.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new wb.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [new wb.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })],
    })
  );

  wb.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new wb.strategies.NetworkFirst({ cacheName: 'pages' })
  );

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
} else {
  console.log('Workbox failed to load.');
}
