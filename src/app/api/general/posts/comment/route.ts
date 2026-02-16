import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { post_id, content, parent_id } = await req.json()

    if (!post_id || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing fields' },
        { status: 400 }
      )
    }

    const { data, error } = await adminSupabase
      .from('comments')
      .insert([
        {
          post_id,
          user_uid: uid,
          content,
          parent_id: parent_id ?? null
        }
      ])
      .select(`
        *,
        user:users (
          uid,
          displayName,
          photoURL
        )
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Comment error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const post_id = searchParams.get('post_id')
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)

    if (!post_id) {
      return NextResponse.json(
        { success: false, message: 'post_id is required' },
        { status: 400 }
      )
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await adminSupabase
      .from('comments')
      .select(`
        *,
        user:users (
          uid,
          displayName,
          photoURL
        )
      `, { count: 'exact' })
      .eq('post_id', post_id)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        hasMore: to + 1 < (count || 0)
      }
    })

  } catch (error: any) {
    console.error('Fetch comments error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}