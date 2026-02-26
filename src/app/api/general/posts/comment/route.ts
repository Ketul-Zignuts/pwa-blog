import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { createNotification } from '@/lib/notification-service'

export async function POST(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')
    if (!uid) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const post_id = body?.post_id?.trim()
    const content = body?.content?.trim()
    const parent_id = body?.parent_id ?? null

    if (!post_id || !content) return NextResponse.json({ success: false, message: 'post_id and content required' }, { status: 400 })
    if (content.length > 1000) return NextResponse.json({ success: false, message: 'Comment too long (max 1000 chars)' }, { status: 400 })

    // Validate parent comment if reply
    if (parent_id) {
      const { data: parentComment } = await adminSupabase.from('comments').select('id').eq('id', parent_id).single()
      if (!parentComment) return NextResponse.json({ success: false, message: 'Invalid parent comment' }, { status: 400 })
    }

    // Insert comment
    const { data, error } = await adminSupabase.from('comments')
      .insert([{ post_id, user_uid: uid, content, parent_id }])
      .select('*, user:users(uid, displayName, photoURL)')
      .single()
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })

    // Determine recipient for notification
    let recipientUid: string | null = null
    let notificationTitle = ''
    let notificationMessage = ''

    if (parent_id) {
      const { data: parent } = await adminSupabase.from('comments').select('user_uid').eq('id', parent_id).single()
      if (parent) {
        recipientUid = parent.user_uid
        notificationTitle = 'New reply to your comment'
        notificationMessage = `${data.user.displayName} replied to your comment`
      }
    } else {
      const { data: post } = await adminSupabase.from('posts').select('user_id, title').eq('id', post_id).single()
      if (post) {
        recipientUid = post.user_id
        notificationTitle = `New comment on your post`
        notificationMessage = `${data.user.displayName} commented on "${post.title}"`
      }
    }

    // Create notification via RPC
    if (recipientUid) {
      await createNotification({
        recipientUid,
        actorUid: uid,
        type: 'comment',
        entityId: post_id,
        entityType: 'post',
        title: notificationTitle,
        message: notificationMessage,
      })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })

  } catch (error) {
    console.error('Comment POST error:', error)
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 })
  }
}