// Service worker del sitio: avisos (push) de la tarjeta Lady Lovers y permite instalar el POS como app.
// No guarda nada en caché: todo se pide siempre a internet para que nunca quede una versión vieja.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Lady Fresa', {
    body: d.body || '', icon: 'img/marca/icono-192.png', badge: 'img/marca/icono-192.png',
    data: { url: d.url || './' }, tag: 'lady-lovers', renotify: true
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if (w.url.includes('club.html') && 'focus' in w) { w.navigate(url); return w.focus(); } }
    return self.clients.openWindow(url);
  }));
});

// Necesario para que Android ofrezca "Instalar app". Pasa directo a la red, sin caché.
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request));
});
