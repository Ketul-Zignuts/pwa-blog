import { NextRequest, NextResponse } from 'next/server'
import { authSupabase } from '@/lib/supabase-server'

export async function PUT(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '').trim()

    if (!uid || !token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword, email } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const { error: loginError } =
      await authSupabase.auth.signInWithPassword({
        email,
        password: currentPassword
      })

    if (loginError) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 403 }
      )
    }

    const { error: updateError } =
      await authSupabase.auth.updateUser({
        password: newPassword
      })

    if (updateError) {
      throw new Error(updateError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error: any) {
    console.error('Change password error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Password change failed'
      },
      { status: 500 }
    )
  }
}
