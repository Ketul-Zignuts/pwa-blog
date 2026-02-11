import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, adminStorage } from '@/lib/supabase-server'

export async function PUT(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.formData()

    const displayName = body.get('displayName') as string | null
    const phoneNumber = body.get('phoneNumber') as string | null
    const bio = body.get('bio') as string | null
    const photoURLFile = body.get('photoURL') as File | null

    const { data: userData, error: userError } =
      await adminSupabase.auth.admin.getUserById(uid)

    if (userError || !userData?.user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const email = userData.user.email!
    const currentMetadata = userData.user.user_metadata || {}

    let finalPhotoURL = currentMetadata.photoURL || ''

    if (photoURLFile && photoURLFile.size > 0) {
      const buffer = Buffer.from(await photoURLFile.arrayBuffer())
      finalPhotoURL = await uploadProfileImage(
        buffer,
        email,
        photoURLFile.type
      )
    }

    let formattedPhoneNumber = currentMetadata.phoneNumber || ''

    if (phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, '')

      if (cleaned.length === 10) {
        formattedPhoneNumber = `+91${cleaned}`
      } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        formattedPhoneNumber = `+${cleaned}`
      } else if (phoneNumber.startsWith('+')) {
        formattedPhoneNumber = phoneNumber
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid phone number format'
        })
      }
    }

    const { error: updateAuthError } =
      await adminSupabase.auth.admin.updateUserById(uid, {
        user_metadata: {
          ...currentMetadata,
          displayName:
            displayName ?? currentMetadata.displayName,
          phoneNumber: formattedPhoneNumber,
          photoURL: finalPhotoURL,
          bio: bio ?? currentMetadata.bio ?? ''
        }
      })

    if (updateAuthError) {
      throw new Error(updateAuthError.message)
    }

    const { error: updateProfileError } = await adminSupabase
      .from('users')
      .update({
        displayName:
          displayName ?? currentMetadata.displayName,
        phoneNumber: formattedPhoneNumber,
        photoURL: finalPhotoURL,
        bio: bio ?? ''
      })
      .eq('uid', uid)

    if (updateProfileError) {
      throw new Error(updateProfileError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })
  } catch (error: any) {
    console.error('Profile update error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Profile update failed'
      },
      { status: 500 }
    )
  }
}

async function uploadProfileImage(
  buffer: Buffer,
  email: string,
  contentType: string
): Promise<string> {
  const timestamp = Date.now()
  const ext = contentType.split('/')[1] || 'jpg'
  const filename = `profiles/${email.replace(/[@.]/g, '_')}_${timestamp}.${ext}`

  const { error } = await adminStorage
    .bucket('profile-images')
    .upload(filename, buffer, {
      contentType,
      upsert: true
    })

  if (error) throw error

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${filename}`
}
