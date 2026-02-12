import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

async function uploadProfileImage(
  buffer: Buffer,
  email: string,
  contentType: string
): Promise<string> {
  const timestamp = Date.now()
  const ext = contentType.split('/')[1] || 'jpg'
  const filename = `profiles/${email.replace(/[@.]/g, '_')}_${timestamp}.${ext}`

  const { error } = await adminSupabase.storage
    .from('profile-images')
    .upload(filename, buffer, {
      contentType,
      upsert: true
    })

  if (error) throw error

  const { data } = adminSupabase.storage
    .from('profile-images')
    .getPublicUrl(filename)

  return data.publicUrl
}

function extractStoragePath(publicUrl: string): string | null {
  const marker = '/storage/v1/object/public/profile-images/'
  const index = publicUrl.indexOf(marker)

  if (index === -1) return null

  return publicUrl.substring(index + marker.length)
}

export async function PUT(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('photo') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({
        success: false,
        message: 'Image file required'
      })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        message: 'Only image files allowed'
      })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'Max 2MB allowed'
      })
    }

    const { data: existingUser, error: fetchError } =
      await adminSupabase
        .from('users')
        .select('photoURL,email')
        .eq('uid', uid)
        .single()

    if (fetchError || !existingUser) {
      throw new Error('User not found')
    }

    if (existingUser.photoURL) {
      const oldPath = extractStoragePath(existingUser.photoURL)
      if (oldPath) {
        await adminSupabase.storage
          .from('profile-images')
          .remove([oldPath])
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const newPhotoURL = await uploadProfileImage(
      buffer,
      existingUser.email,
      file.type
    )

    const { error: updateError } = await adminSupabase
      .from('users')
      .update({ photoURL: newPhotoURL })
      .eq('uid', uid)

    if (updateError) throw updateError

    await adminSupabase.auth.admin.updateUserById(uid, {
      user_metadata: { photoURL: newPhotoURL }
    })

    return NextResponse.json({
      success: true,
      photoURL: newPhotoURL
    })
  } catch (error: any) {
    console.error('Change profile pic error:', error)

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}