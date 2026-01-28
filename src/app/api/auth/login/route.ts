import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb, FieldValue } from '@/lib/firebase-server'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid
    
    const userDoc = await adminDb.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      await adminDb.collection('users').doc(uid).set({
        uid,
        email: decodedToken.email,
        displayName: decodedToken.displayName,
        photoURL: decodedToken.picture,
        createdAt: FieldValue.serverTimestamp()
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      uid, 
      email: decodedToken.email 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 })
  }
}