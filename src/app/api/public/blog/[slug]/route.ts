import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const postId = req.nextUrl.searchParams.get('post_id')

    let query = adminSupabase
      .from('posts')
      .select(`
        *,
        category:categories(id,name,slug),
        user:users!posts_user_id_fkey(uid,displayName,bio,photoURL)
      `)
    if (postId) {
      query = query.eq('id', postId)
    } else {
      query = query.eq('slug', slug)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
