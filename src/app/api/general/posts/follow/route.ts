import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { createNotification } from '@/lib/notification-service'

export async function POST(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      console.log('❌ No UID in header')
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const following_uid = body?.following_uid?.trim()

    if (!following_uid) {
      console.log('❌ following_uid missing')
      return NextResponse.json(
        { success: false, message: 'following_uid is required' },
        { status: 400 }
      )
    }

    if (following_uid === uid) {
      return NextResponse.json(
        { success: false, message: 'You cannot follow yourself' },
        { status: 400 }
      )
    }

    // 🔎 Check if already following
    const { data: existingFollow, error: checkError } = await adminSupabase
      .from('follows')
      .select('id')
      .eq('follower_uid', uid)
      .eq('following_uid', following_uid)
      .maybeSingle()

    if (checkError) console.log('Check error:', checkError.message)

    // ✅ UNFOLLOW
    if (existingFollow) {

      const { error } = await adminSupabase
        .from('follows')
        .delete()
        .eq('follower_uid', uid)
        .eq('following_uid', following_uid)

      if (error) {
        console.log('❌ Unfollow error:', error.message)
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, following: false })
    }

    const { error: insertError } = await adminSupabase
      .from('follows')
      .insert([
        {
          follower_uid: uid,
          following_uid,
        },
      ])

    if (insertError) {
      console.log('❌ Follow insert error:', insertError.message)
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 }
      )
    }

    const { data: followerUser } = await adminSupabase
      .from('users')
      .select('displayName')
      .eq('uid', uid)
      .single()

    await createNotification({
      recipientUid: following_uid,
      actorUid: uid,
      type: 'follow',
      entityId: uid,
      entityType: 'user',
      title: 'New follower',
      message: `${followerUser?.displayName || 'Someone'} started following you`,
    })

    return NextResponse.json({ success: true, following: true })

  } catch (error) {
    console.error('💥 Follow POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}