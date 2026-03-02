// Basic Service Worker for PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline");
    })
  );
});
