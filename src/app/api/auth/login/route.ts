import { NextRequest, NextResponse } from 'next/server'
import { authSupabase, adminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      )
    }

    const { data, error } = await authSupabase.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const { user, session } = data

    const { data: existingUser, error: profileError } = await adminSupabase
      .from('users')
      .select('*')
      .eq('uid', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile lookup error:', profileError)
    }

    if (!existingUser) {
      const { error: insertError } = await adminSupabase
        .from('users')
        .insert({
          uid: user.id,
          email: user.email,
          displayName:
            user.user_metadata?.displayName ||
            user.email?.split('@')[0],
          photoURL: user.user_metadata?.photoURL || '',
          phoneNumber: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Profile insert error:', insertError)
      }
    }

    const response = NextResponse.json({
      success: true,
      user: {
        uid: user.id,
        email: user.email,
        displayName: existingUser?.displayName || user.user_metadata?.displayName || '',
        photoURL: existingUser?.photoURL || '',
        phoneNumber: existingUser?.phoneNumber || '',
        bio: existingUser?.bio || ''
      },
      token: session.access_token
    })

    response.cookies.set('refresh_token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
