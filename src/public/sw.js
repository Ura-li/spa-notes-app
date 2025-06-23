import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';


self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request: networkRequest }) => networkRequest.mode === 'navigate',
  new CacheFirst({
    cacheName: 'app-html-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

registerRoute(
  ({ request: networkRequest }) => networkRequest.destination === 'image',
  new CacheFirst({
    cacheName: 'app-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ request: networkRequest }) =>
    networkRequest.destination === 'script' || networkRequest.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'app-static-resources-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

registerRoute(
  ({ url: requestUrl }) => requestUrl.origin === 'https://your-api-domain.com',
  new StaleWhileRevalidate({
    cacheName: 'generic-api-cache',
  })
);

registerRoute(
  ({ url: requestUrl }) => requestUrl.origin === 'https://story-api.dicoding.dev',
  new StaleWhileRevalidate({
    cacheName: 'dicoding-story-api-cache',
  })
);

// Push Notification Handler
self.addEventListener('push', pushEvent => {
  let notificationData = {
    title: 'Pesan Baru',
    body: 'Anda punya cerita baru!',
    senderClientId: null,
  };

  if (pushEvent.data) {
    try {
      notificationData = pushEvent.data.json();
    } catch {
      notificationData.body = pushEvent.data.text();
    }
  }

  pushEvent.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

      allClients.forEach(clientItem => {
        clientItem.postMessage({
          type: 'NEW_STORY',
          title: notificationData.title,
          body: notificationData.body,
          senderClientId: notificationData.senderClientId || null,
        });
      });

      return new Promise((resolveNotification) => {
        let notificationHandled = false;
        const pushMessageChannel = new BroadcastChannel('push_channel');

        pushMessageChannel.addEventListener('message', (messageFromClientEvent) => {
          if (messageFromClientEvent.data?.type === 'CLIENT_ID') {
            const currentClientId = messageFromClientEvent.data.clientId;

            if (currentClientId !== notificationData.senderClientId) {
              self.registration.showNotification(notificationData.title, {
                body: notificationData.body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
              });
            }

            if (!notificationHandled) {
              notificationHandled = true;
              resolveNotification();
              pushMessageChannel.close();
            }
          }
        });

        if (allClients.length > 0) {
          allClients.forEach(clientItem => clientItem.postMessage({ type: 'GET_CLIENT_ID' }));
        } else {
          self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
          });
          resolveNotification();
        }

        setTimeout(() => {
          if (!notificationHandled) {
            self.registration.showNotification(notificationData.title, {
              body: notificationData.body,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
            });
            pushMessageChannel.close();
            resolveNotification();
          }
        }, 1000);
      });
    })()
  );
});


self.addEventListener('notificationclick', notificationClickEvent => {
  notificationClickEvent.notification.close();
  notificationClickEvent.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(browserClientList => {
      for (const singleClient of browserClientList) {
        if (singleClient.url.includes('/') && 'focus' in singleClient) return singleClient.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});