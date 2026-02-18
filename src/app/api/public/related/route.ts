import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const post_id = req.nextUrl.searchParams.get('post_id')
    const author_id = req.nextUrl.searchParams.get('author_id')

    if (!post_id || !author_id) {
      return NextResponse.json(
        { success: false, message: 'Missing post_id or author_id' },
        { status: 400 }
      )
    }

    const { data, error } = await adminSupabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        hero_image,
        excerpt,
        read_time,
        published_at,
        category:categories(id,name,slug)
      `)
      .eq('user_id', author_id)
      .neq('id', post_id)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
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
