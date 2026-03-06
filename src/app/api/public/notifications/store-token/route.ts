'use server'

import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fcm_token = body?.fcm_token?.trim()
    const platform = body?.platform?.trim() || 'web'

    if (!fcm_token) {
      return NextResponse.json(
        { success: false, message: 'FCM token is required' },
        { status: 400 }
      )
    }

    const uid = await getPublicUserUid(req)
    if (!uid) {
      console.log('FCM token received but no UID:', fcm_token)
      return NextResponse.json({ success: true, message: 'No UID, token not stored' })
    }

    // ✅ Upsert into user_devices table
    const { error: deviceError } = await adminSupabase
      .from('user_devices')
      .upsert(
        [
          {
            uid,
            fcm_token,
            platform,
            last_active: new Date(),
          }
        ],
        { onConflict: 'uid,fcm_token' } // <-- single string
      )

    if (deviceError) {
      console.error('Error storing FCM token in user_devices:', deviceError.message)
      return NextResponse.json({ success: false, message: deviceError.message }, { status: 500 })
    }

    // ✅ Optionally update users.fcm_token (latest token)
    const { error: userError } = await adminSupabase
      .from('users')
      .update({ fcm_token })
      .eq('uid', uid)

    if (userError) {
      console.error('Error updating users.fcm_token:', userError.message)
    }

    return NextResponse.json({ success: true, message: 'FCM token stored successfully for device' })
  } catch (error: any) {
    console.error('FCM token store error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}