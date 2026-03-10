import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { UserProfile } from '@/types/userTypes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid, email, displayName, photoURL, provider, refresh_token, access_token } = body

    if (!uid || !email) {
      return NextResponse.json({ success: false, message: 'UID and email are required' }, { status: 400 })
    }

    // Check if user exists in users table
    const { data: existingUser, error: profileError } = await adminSupabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .maybeSingle()

    if (profileError) {
      console.error('User lookup error:', profileError)
    }

    // Insert if not exists
    if (!existingUser) {
      const { error: insertError } = await adminSupabase.from('users').insert({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || '',
        phoneNumber: '',
        isadmin: false,
        isroadmin: false,
        provider: provider || 'google',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (insertError) {
        console.error('Profile insert error:', insertError)
      }
    }

    // Prepare response object
    const user = existingUser || {
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: photoURL || '',
      phoneNumber: '',
      isadmin: false,
      isroadmin: false
    }

    const response = NextResponse.json({
      success: true,
      user,
      token: access_token
    } as UserProfile)

    // Set refresh token as httpOnly cookie
    if (refresh_token) {
      response.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    return response
  } catch (error: any) {
    console.error('OAuth login error:', error)
    return NextResponse.json({ success: false, message: 'OAuth login failed' }, { status: 500 })
  }
}