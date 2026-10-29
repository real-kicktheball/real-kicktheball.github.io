// Retire the previous Chirpy cache-first worker at its original URL.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('chirpy-')).map(name => caches.delete(name)));
    await self.clients.claim();
    await self.registration.unregister();
    const windows = await self.clients.matchAll({type: 'window'});
    await Promise.all(windows.map(client => client.navigate(client.url)));
  })());
});
