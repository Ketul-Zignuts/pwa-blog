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
    const page = Number(searchParams.get('page') || 1)
    const from = (page - 1) * limit
    const to = from + limit - 1 // Supabase range is inclusive

    // Build query
    const { data, error, count } = await adminSupabase
      .from('notifications')
      .select(
        `
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
      `,
        { count: 'exact' }
      )
      .eq('recipient_uid', uid)
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Determine if more pages exist
    const hasMore = (count || 0) > to + 1

    return NextResponse.json({
      success: true,
      data,
      page: page + 1, // next page number
      hasMore,
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { action, id, all_read } = body

    if (action === 'mark_read') {
      if (all_read) {
        const { error } = await adminSupabase
          .from('notifications')
          .update({ is_read: true })
          .eq('recipient_uid', uid)
          .eq('is_read', false)

        if (error) throw error

        return NextResponse.json({
          success: true,
          message: 'All notifications marked as read',
        })
      }

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'Notification id required' },
          { status: 400 }
        )
      }

      const { error } = await adminSupabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('recipient_uid', uid)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      })
    }

    if (action === 'delete') {
      if (all_read) {
        const { error } = await adminSupabase
          .from('notifications')
          .delete()
          .eq('recipient_uid', uid)
          .eq('is_read', true)

        if (error) throw error

        return NextResponse.json({
          success: true,
          message: 'All read notifications deleted',
        })
      }

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'Notification id required' },
          { status: 400 }
        )
      }

      const { error } = await adminSupabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('recipient_uid', uid)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Notification deleted',
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Notifications PATCH error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}