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

    const { displayName, phoneNumber, bio } = await req.json()

    let formattedPhoneNumber: string | undefined

    if (phoneNumber !== undefined) {
      if (phoneNumber === '') {
        formattedPhoneNumber = ''
      } else {
        const cleaned = phoneNumber.replace(/\D/g, '')

        if (cleaned.length === 10) {
          formattedPhoneNumber = `+91${cleaned}`
        } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
          formattedPhoneNumber = `+${cleaned}`
        } else if (phoneNumber.startsWith('+')) {
          formattedPhoneNumber = phoneNumber
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid phone number format' },
            { status: 400 }
          )
        }
      }
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString()
    }

    if (displayName !== undefined)
      updatePayload.displayName = displayName

    if (formattedPhoneNumber !== undefined)
      updatePayload.phoneNumber = formattedPhoneNumber

    if (bio !== undefined) updatePayload.bio = bio

    const { data, error } = await adminSupabase
      .from('users')
      .update(updatePayload)
      .eq('uid', uid)
      .select('bio, displayName, phoneNumber')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }

    await adminSupabase.auth.admin.updateUserById(uid, {
      user_metadata: {
        ...(displayName !== undefined && { displayName }),
        ...(formattedPhoneNumber !== undefined && {
          phoneNumber: formattedPhoneNumber
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      bio: data?.bio ?? '',
      displayName: data?.displayName ?? '',
      phoneNumber: data?.phoneNumber ?? ''
    })
  } catch (error: any) {
    console.error('Update error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Update failed' },
      { status: 500 }
    )
  }
}