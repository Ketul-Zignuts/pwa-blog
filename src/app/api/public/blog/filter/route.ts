import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const uid = await getPublicUserUid(req)

    const page = Number(searchParams.get('page') ?? 1)
    const category = searchParams.get('category_id')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort_by')
    const rating = searchParams.get('rating')

    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Dynamic select
    let selectFields = `
      id,
      title,
      slug,
      excerpt,
      hero_image,
      published_at,
      views,
      likes,
      comments_count,
      average_rating,
      category:categories(id,name,slug),
      user:users!posts_user_id_fkey(uid,displayName,email,photoURL)
    `

    if (uid) {
      selectFields += `,user_like:post_likes(id)!post_likes_post_id_fkey`
    }

    let query = adminSupabase
      .from('posts')
      .select(selectFields, { count: 'exact' })
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .range(from, to)

    // Filter by liked posts for current user
    if (uid) {
      query = query.eq('post_likes.user_uid', uid)
    }

    // Category filter
    if (category && category !== '') {
      query = query.eq('category_id', category)
    }

    // Search filter
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim().replace(/[,{}]/g, '')
      query = query.or(
        `title.ilike.%${cleanSearch}%,excerpt.ilike.%${cleanSearch}%,tags.cs.{${cleanSearch}}`
      )
    }

    // Rating filter
    if (rating) {
      const ratingValue = Number(rating)
      if (!isNaN(ratingValue)) {
        query = query.gte('average_rating', ratingValue)
      }
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        query = query.order('published_at', { ascending: true })
        break

      case 'most_views':
        query = query.order('views', { ascending: false })
        break

      case 'most_liked':
        query = query.order('likes', { ascending: false })
        break

      case 'most_commented':
        query = query.order('comments_count', { ascending: false })
        break

      default:
        query = query.order('published_at', { ascending: false }) // newest
    }

    const { data, error, count } = await query

    if (error) throw error

    const hasMore = (count || 0) > page * limit

    return NextResponse.json({
      success: true,
      data: data,
      hasMore,
      total: count
    })
  } catch (error: any) {
    console.error('Posts GET error:', error)

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}