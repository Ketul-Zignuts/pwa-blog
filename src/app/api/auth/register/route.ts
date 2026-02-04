import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, adminStorage } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const userId = body.get('userId') as string
    const file = body.get('file') as File

    if (!file) return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
    if (!userId) return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 })

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.type.split('/')[1] || 'png'
    const filename = `temp/${userId}_${timestamp}.${ext}`

    // Upload to temp-images bucket
    const { error: uploadError } = await adminStorage.bucket('temp-images').upload(filename, buffer, {
      contentType: file.type,
      upsert: true
    })
    if (uploadError) throw uploadError

    // Insert into temp_images table
    const { data: tempData, error: dbError } = await adminSupabase
      .from('temp_images')
      .insert([{ user_id: userId, file_path: filename }])
      .select()
      .single()
    if (dbError) throw dbError

    // Get public URL correctly
    const { data } = adminStorage.bucket('temp-images').getPublicUrl(filename)
    const publicUrl = data.publicUrl

    return NextResponse.json({ success: true, url: publicUrl, tempId: tempData.id })
  } catch (error: any) {
    console.error('Temp image upload error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
