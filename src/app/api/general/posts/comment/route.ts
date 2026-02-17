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

    const body = await req.json()

    const post_id = body?.post_id?.trim()
    const content = body?.content?.trim()
    const parent_id = body?.parent_id ?? null

    if (!post_id || !content) {
      return NextResponse.json(
        { success: false, message: 'post_id and content are required' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, message: 'Comment is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    if (parent_id) {
      const { data: parentComment } = await adminSupabase
        .from('comments')
        .select('id')
        .eq('id', parent_id)
        .single()

      if (!parentComment) {
        return NextResponse.json(
          { success: false, message: 'Invalid parent comment' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await adminSupabase
      .from('comments')
      .insert([
        {
          post_id,
          user_uid: uid,
          content,
          parent_id
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
      { status: 201 }
    )

  } catch (error) {
    console.error('Comment POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}