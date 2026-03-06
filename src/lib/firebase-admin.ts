// firebase-admin.ts
import admin from 'firebase-admin'

const firebaseAdmin =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
      })

// Export the Messaging instance directly
export const pushMessaging = admin.messaging(firebaseAdmin)