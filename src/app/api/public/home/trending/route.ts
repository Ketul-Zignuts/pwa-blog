import { NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

// Trending Posts (Always returns 5 posts)

export async function GET() {
  try {
    const { data, error } = await adminSupabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        hero_image,
        published_at,
        views,
        likes,
        tags,
        category:categories (
          id,
          name,
          slug
        ),
        user:users!posts_user_id_fkey (
          uid,
          displayName,
          email,
          photoURL
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      // Trending priority
      .order('likes', { ascending: false })
      .order('views', { ascending: false })
      // Fallback if all 0
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data ?? []
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
