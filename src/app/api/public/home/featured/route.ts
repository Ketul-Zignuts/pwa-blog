import { NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

// GET /api/featured
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
        views,
        likes,
        published_at,
        category:categories (
          id,
          name,
          slug
        ),
        user:users!posts_user_id_fkey (
          id,
          displayName,
          photoURL,
          bio
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      // 🔥 Priority sorting
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data ?? null
    })
  } catch (error: any) {
    console.error('Error getting featured post:', error)

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
