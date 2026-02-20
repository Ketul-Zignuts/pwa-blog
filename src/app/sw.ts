/// <reference lib="webworker" />

import { Serwist } from 'serwist'
import { CacheFirst, NetworkFirst } from 'serwist'
import type { PrecacheEntry } from 'serwist'

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: [
    ...(self.__SW_MANIFEST || []),
    { url: '/offline', revision: null },
  ],

  skipWaiting: true,
  clientsClaim: true,

  runtimeCaching: [
    {
      matcher: ({ request }) => request.mode === 'navigate',
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
      }),
    },

    {
      matcher: /vsooosecrets\.supabase\.co\/storage\/v1\/object\/public/,
      handler: new CacheFirst({
        cacheName: 'supabase-images',
      }),
    },

    {
      matcher: /^https?:\/\/.*\/api/,
      handler: new NetworkFirst({
        cacheName: 'api-cache',
      }),
    },

    {
      matcher: /\.(?:png|jpg|jpeg|svg|ico|webp)$/,
      handler: new CacheFirst({
        cacheName: 'static-images',
      }),
    },
  ],

  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.mode === 'navigate',
      },
    ],
  },
})

serwist.addEventListeners()
