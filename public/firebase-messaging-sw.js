// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC17i-QEqhO0H62zVjjTseJzYKZUY-vsmU",
  projectId: "pwa-blog-d6518",
  messagingSenderId: "544060156952",
  appId: "1:544060156952:web:d4b86a6ab51774755ca76d"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title = 'Notification', body = '' } = payload.notification || {};
  self.registration.showNotification(title, { body, icon: '/icon-192x192.png' });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});