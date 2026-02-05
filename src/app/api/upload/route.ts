import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, adminStorage } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    console.log('userId: ', userId);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 405 }
      )
    }
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      )
    }
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Image must be under 5MB' },
        { status: 400 }
      )
    }
    const extFromName = file.name.split('.').pop()?.toLowerCase() || 'png'
    const safeExt = extFromName.replace(/[^a-z0-9]/g, '')

    const filePath = `temp/${userId}_${Date.now()}.${safeExt}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await adminStorage
      .bucket('temp-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: record, error: dbError } = await adminSupabase
      .from('temp_images')
      .insert([
        {
          user_id: userId,
          file_path: filePath
        }
      ])
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    const { data } = adminStorage
      .bucket('temp-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      tempId: record.id
    })
  } catch (error: any) {
    console.error('Temp image upload error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Image upload failed'
      },
      { status: 500 }
    )
  }
}
