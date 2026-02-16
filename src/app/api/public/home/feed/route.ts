import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') ?? 1)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit

    let query = adminSupabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        hero_image,
        published_at,
        views,
        likes,
        tags,
        comments_count,
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
      .order('published_at', { ascending: false })
      .range(from, to)

    // Category filter
    if (category && category !== '') {
      query = query.eq('category_id', category)
    }

    // 🔥 Search filter (title + excerpt + tags)
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim()

      query = query.or(
        `
        title.ilike.%${cleanSearch}%,
        excerpt.ilike.%${cleanSearch}%,
        tags.cs.{${cleanSearch}}
        `
      )
    }

    const { data, error } = await query

    if (error) throw error

    const hasMore = data.length > limit
    const trimmedData = hasMore ? data.slice(0, limit) : data

    return NextResponse.json({
      success: true,
      data: trimmedData,
      hasMore
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
