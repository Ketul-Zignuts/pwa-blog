import { NextRequest, NextResponse } from 'next/server'
import { authSupabase, adminSupabase } from '@/lib/supabase-server'
import { UserProfile } from '@/types/userTypes'

export async function POST(req: NextRequest) {
  try {

    const { email, password, type } = await req.json()

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
        { status: 403 }
      )
    }

    const { user, session } = data

    const { data: existingUser, error: profileError } = await adminSupabase
      .from('users')
      .select('*')
      .eq('uid', user.id)
      .maybeSingle()

    if (type === 'admin') {
      if (!existingUser?.isadmin) {
        return NextResponse.json(
          { success: false, message: 'Admin access denied' },
          { status: 403 }
        )
      }
    }

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
          isroadmin:false,
          isadmin:false,
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
        bio: existingUser?.bio || '',
        isroadmin:existingUser?.isroadmin || false,
        isadmin:existingUser.isadmin || false,
      },
      token: session.access_token
    } as UserProfile)

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
