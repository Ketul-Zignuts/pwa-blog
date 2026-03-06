'use client'

import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAppSelector } from '@/store'
import { storeFcmToken } from '@/constants/api/notification'
import { getFirebaseMessaging } from '@/lib/firebase-client'
import { getToken as fcmGetToken } from 'firebase/messaging'

// Detect device platform
const getPlatform = () => {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  return 'web'
}

export default function FirebaseNotification() {
  const user = useAppSelector((store) => store?.auth?.user)

  const storeFcmTokenMutation = useMutation({
    mutationFn: (data: { fcm_token: string; platform: string }) => storeFcmToken(data),
  })

  useEffect(() => {
    if (!user || storeFcmTokenMutation?.isPending) return

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return
        
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        
        const messaging = await getFirebaseMessaging()
        if (!messaging) return
        
        const token = await fcmGetToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })

        if (!token) return
        
        storeFcmTokenMutation.mutate({
          fcm_token: token,
          platform: getPlatform(),
        })
      } catch (error) {
        console.error('FCM token error:', error)
      }
    }

    requestPermission()
  }, [user?.uid]) // ✅ re-run only if `user` changes

  return null
}