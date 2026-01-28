// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb, adminStorage, FieldValue } from '@/lib/firebase-server'

interface RegisterBody {
  email: string
  password?: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterBody = await req.json()
    
    const { email, password, displayName, photoURL, phoneNumber } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    try {
      await adminAuth.getUserByEmail(email)
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    } catch (error) {
      // User doesn't exist - good!
      console.log(error)
    }

    let finalPhotoURL = ''

    // Handle profile image upload (base64 or Google OAuth URL)
    if (photoURL) {
      if (photoURL.startsWith('data:image/')) {
        // Base64 image upload to Storage
        finalPhotoURL = await uploadProfileImage(photoURL, email)
      } else {
        // Google OAuth profile URL (already public)
        finalPhotoURL = photoURL
      }
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password: password || undefined,  // Skip for Google OAuth
      displayName: displayName || email.split('@')[0],
      photoURL: finalPhotoURL || undefined,
      phoneNumber: phoneNumber || undefined,
    })

    // Create user profile in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName!,
      photoURL: userRecord.photoURL || '',
      phoneNumber: userRecord.phoneNumber || '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      bio: '',
      totalPosts: 0,
      followers: 0,
      following: 0,
      isAdmin: false,
    })

    // Generate session cookie
    const customToken = await adminAuth.createCustomToken(userRecord.uid)
    const idToken = await adminAuth.createSessionCookie(customToken, { 
      expiresIn: 60 * 60 * 24 * 7 
    })

    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      }
    })

    response.cookies.set('auth-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  } catch (error: any) {
    console.error('Register error:', error)
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Registration failed', details: error.message }, 
      { status: 500 }
    )
  }
}

// Helper: Upload base64 image to Firebase Storage
async function uploadProfileImage(base64Image: string, email: string): Promise<string> {
  try {
    // Extract image buffer from base64
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64')
    
    // Generate unique filename
    const filename = `profiles/${email.replace(/[@.]/g, '_')}_${Date.now()}.jpg`
    
    // Upload to Storage
    const bucket = adminStorage.bucket()
    const file = bucket.file(filename)
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          uploadedBy: email,
          cacheControl: 'public, max-age=31536000', // 1 year
        }
      }
    })

    // Make public and get download URL
    await file.makePublic()
    const [url] = await file.publicUrl()
    
    return url
  } catch (error) {
    console.error('Image upload failed:', error)
    throw new Error('Failed to upload profile image')
  }
}
