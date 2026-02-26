import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit')) || 10
    const cursor = searchParams.get('cursor')

    // Build query
    let query = adminSupabase
      .from('notifications')
      .select(`
        id,
        recipient_uid,
        actor_uid,
        type,
        entity_id,
        entity_type,
        title,
        message,
        is_read,
        created_at,
        actor:users!notifications_actor_uid_fkey (
          uid,
          displayName,
          photoURL
        )
      `)
      .eq('recipient_uid', uid)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      console.log('Applying cursor filter:', cursor)
      query = query.lt('created_at', cursor)
    }

    let data, error
    try {
      ({ data, error } = await query)
    } catch (err) {
      console.error('Supabase query threw exception:', err)
      return NextResponse.json(
        { success: false, message: 'Supabase query threw exception' },
        { status: 500 }
      )
    }

    if (error) {
      console.error('Supabase query error object:', error)
      return NextResponse.json(
        { success: false, message: error.message || 'Supabase query error' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.log('No notifications found')
      return NextResponse.json({
        success: true,
        data: [],
        nextCursor: null,
        hasMore: false,
      })
    }

    const nextCursor =
      data.length === limit
        ? data[data.length - 1].created_at
        : null

    return NextResponse.json({
      success: true,
      data,
      nextCursor,
      hasMore: !!nextCursor,
    })
  } catch (error) {
    console.error('Notifications GET catch error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
