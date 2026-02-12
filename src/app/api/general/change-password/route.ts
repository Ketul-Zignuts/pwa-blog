import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function PUT(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const { data: userData, error: userError } =
      await adminSupabase.auth.admin.getUserById(uid)

    if (userError || !userData.user?.email) {
      throw new Error('User not found')
    }

    const email = userData.user.email

    const { error: loginError } =
      await adminSupabase.auth.signInWithPassword({
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
      await adminSupabase.auth.admin.updateUserById(uid, {
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