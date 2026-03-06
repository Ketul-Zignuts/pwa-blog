// /// <reference lib="webworker" />

// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

// declare const firebase: any

// import { Serwist } from 'serwist'
// import { CacheFirst, NetworkFirst } from 'serwist'
// import type { PrecacheEntry } from 'serwist'
// import type { MessagePayload } from 'firebase/messaging'

// declare global {
//   interface WorkerGlobalScope {
//     __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
//   }
// }

// declare const self: ServiceWorkerGlobalScope

// /* ---------------- FIREBASE SETUP ---------------- */

// firebase.initializeApp({
//   apiKey: "aoikeysecret-vsmU",
//   projectId: "pwa-blog-secret",
//   messagingSenderId: "secretnum",
//   appId: "1:secretnum:web:number"
// })

// const messaging = firebase.messaging()

// /* -------- Background Push Notification -------- */

// messaging.onBackgroundMessage((payload: MessagePayload) => {
//   const { title = "Notification", body = "" } = payload.notification ?? {}

//   self.registration.showNotification(title, {
//     body,
//     icon: "/icon-192x192.png"
//   })
// })

// /* -------- Notification Click Handling -------- */

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close()

//   event.waitUntil(
//     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
//       for (const client of clients) {
//         if ("focus" in client) {
//           return client.focus()
//         }
//       }

//       if (self.clients.openWindow) {
//         return self.clients.openWindow("/")
//       }
//     })
//   )
// })

// /* ---------------- SERWIST CACHE ---------------- */

// const serwist = new Serwist({
//   precacheEntries: [
//     ...(self.__SW_MANIFEST || []),
//     { url: '/offline', revision: null }
//   ],

//   skipWaiting: true,
//   clientsClaim: true,

//   runtimeCaching: [
//     {
//       matcher: ({ request }) => request.mode === 'navigate',
//       handler: new NetworkFirst({
//         cacheName: 'pages',
//         networkTimeoutSeconds: 3
//       })
//     },

//     {
//       matcher: /vsoosecrets\.supabase\.co\/storage\/v1\/object\/public/,
//       handler: new CacheFirst({
//         cacheName: 'supabase-images'
//       })
//     },

//     {
//       matcher: /^https?:\/\/.*\/api/,
//       handler: new NetworkFirst({
//         cacheName: 'api-cache'
//       })
//     },

//     {
//       matcher: /\.(?:png|jpg|jpeg|svg|ico|webp)$/,
//       handler: new CacheFirst({
//         cacheName: 'static-images'
//       })
//     }
//   ],

//   fallbacks: {
//     entries: [
//       {
//         url: '/offline',
//         matcher: ({ request }) => request.mode === 'navigate'
//       }
//     ]
//   }
// })

// serwist.addEventListeners()