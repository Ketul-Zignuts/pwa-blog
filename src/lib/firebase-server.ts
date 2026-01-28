// lib/firebase-server.ts (FIXED)
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'  // ← ADD FieldValue
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  })
}

export const adminDb = getFirestore()
export const adminAuth = getAuth()
export const adminStorage = getStorage()

export { FieldValue }
