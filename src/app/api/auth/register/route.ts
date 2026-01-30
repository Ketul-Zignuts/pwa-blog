import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase, adminStorage } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()

    const email = body.get('email') as string
    const password = body.get('password') as string
    const displayName = body.get('displayName') as string
    const phoneNumber = body.get('phoneNumber') as string
    const photoURLFile = body.get('photoURL') as File | null

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' })
    }

    if (!password || password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    // 🔎 Check if user already exists
    const { data: existing } = await adminSupabase.auth.admin.listUsers()
    const userExists = existing?.users?.some((u) => u.email === email)

    if (userExists) {
      return NextResponse.json({
        success: false,
        message: 'User already exists'
      })
    }

    // 📸 Upload profile image (optional)
    let finalPhotoURL = ''

    if (photoURLFile && photoURLFile.size > 0) {
      const buffer = Buffer.from(await photoURLFile.arrayBuffer())
      finalPhotoURL = await uploadProfileImage(
        buffer,
        email,
        photoURLFile.type
      )
    }

    // 📞 Format phone number
    let formattedPhoneNumber: string | undefined

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

    // 👤 Create auth user
    const { data: userRecord, error: createError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          displayName: displayName || email.split('@')[0],
          photoURL: finalPhotoURL,
          phoneNumber: formattedPhoneNumber
        }
      })

    if (createError || !userRecord?.user) {
      throw new Error(createError?.message || 'Failed to create user')
    }

    // 🧾 Insert user profile (DB handles timestamps)
    const { error: insertError } = await adminSupabase.from('users').insert({
      uid: userRecord.user.id,
      email: userRecord.user.email!,
      displayName:
        userRecord.user.user_metadata?.displayName ||
        displayName ||
        email.split('@')[0],
      photoURL: finalPhotoURL,
      phoneNumber: formattedPhoneNumber || ''
    })

    if (insertError) {
      console.error('Profile insert error:', insertError)
      throw new Error('Failed to create user profile')
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully! Please log in.'
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Registration failed'
    })
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

  const { error } = await adminStorage.bucket('profile-images').upload(filename, buffer, {
    contentType,
    upsert: true
  })

  if (error) throw error

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${filename}`
}
