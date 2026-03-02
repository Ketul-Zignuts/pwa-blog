import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { createNotification } from '@/lib/notification-service'

type LikeInsertResponse = {
  id: string
  post: {
    id: string
    title: string
    user_id: string
  }
  user: {
    uid: string
    displayName: string | null
    photoURL: string | null
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const post_id = body?.post_id?.trim()

    if (!post_id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      )
    }

    // 🔍 Check if already liked
    const { data: existingLike, error: checkError } = await adminSupabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_uid', uid)
      .maybeSingle()

    if (checkError) {
      return NextResponse.json(
        { success: false, message: checkError.message },
        { status: 500 }
      )
    }

    // ✅ UNLIKE
    if (existingLike) {
      const { error: deleteError } = await adminSupabase
        .from('post_likes')
        .delete()
        .eq('post_id', post_id)
        .eq('user_uid', uid)

      if (deleteError) {
        return NextResponse.json(
          { success: false, message: deleteError.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          action: 'unliked',
          message: 'Post un-liked successfully'
        },
        { status: 200 }
      )
    }

    // ✅ LIKE
    const { data, error: insertError } = await adminSupabase
      .from('post_likes')
      .insert([
        {
          post_id,
          user_uid: uid
        }
      ])
      .select(`
        id,
        post:posts (
          id,
          title,
          user_id
        ),
        user:users (
          uid,
          displayName,
          photoURL
        )
      `)
      .single()

    if (insertError) {
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 }
      )
    }

    // 🧠 Proper Type Casting (Fixes TS issue cleanly)
    const typedData = data as any

    const postOwnerUid = typedData?.post?.user_id
    const likerName = typedData?.user?.displayName

    // 🛡 Prevent self notification
    if (postOwnerUid && postOwnerUid !== uid) {
      await createNotification({
        recipientUid: postOwnerUid,
        actorUid: uid,
        type: 'like',
        entityId: post_id,
        entityType: 'post',
        title: 'New like',
        message: `${likerName || 'Someone'} liked your post`,
      })
    }

    return NextResponse.json(
      {
        success: true,
        action: 'liked',
        data: typedData,
        message: 'Post liked successfully'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Likes POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}