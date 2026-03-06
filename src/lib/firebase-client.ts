import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

let messagingInstance: ReturnType<typeof getMessaging> | null = null

// Returns a Messaging instance if supported, otherwise null
export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) return null

  if (!messagingInstance) {
    messagingInstance = getMessaging(app)
  }

  return messagingInstance
}