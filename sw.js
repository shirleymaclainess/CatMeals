const CACHE_NAME = "CatMeals";
const URLS = ["/", "index.html", "manifest.json"]; // Adicionei "/" no lugar da string vazia, é mais seguro

self.addEventListener("install", (event) => {
  // O skipWaiting força a atualização imediata do Service Worker
  self.skipWaiting(); 
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)));
});

self.addEventListener("activate", (event) => {
  // O claim garante que o SW assuma o controle do app na mesma hora
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});

// Ouve o clique na notificação para reabrir o app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
