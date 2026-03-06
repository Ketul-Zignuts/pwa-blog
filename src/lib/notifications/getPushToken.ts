'use client'

import { getToken } from 'firebase/messaging'
import { getFirebaseMessaging } from '@/lib/firebase-client'

export const getPushToken = async () => {
  try {
    if (typeof window === 'undefined') return null

    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    const messaging = await getFirebaseMessaging()

    if (!messaging) return null

    const registration = await navigator.serviceWorker.ready

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    })

    return token
  } catch (error) {
    console.error('Push token error', error)
    return null
  }
}