import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const uid = await getPublicUserUid(req)

    const page = Number(searchParams.get('page') ?? 1)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit

    // Dynamic select
    let selectFields = `
      id,title,slug,excerpt,content,hero_image,published_at,views,likes,tags,comments_count,
      category:categories(id,name,slug),
      user:users!posts_user_id_fkey(uid,displayName,email,photoURL)
    `
    if (uid) selectFields += `,user_like:post_likes(id)!post_likes_post_id_fkey`

    let query = adminSupabase
      .from('posts')
      .select(selectFields, { count: 'exact' })
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(from, to)

    if (uid) query = query.eq('post_likes.user_uid', uid)
    if (category && category !== '') query = query.eq('category_id', category)
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim()
      query = query.or(`title.ilike.%${cleanSearch}%,excerpt.ilike.%${cleanSearch}%,tags.cs.{${cleanSearch}}`)
    }

    const { data, error, count } = await query
    if (error) throw error

    const transformedData = data.map((post: any) => ({
      ...post,
      isLiked: uid && !!post.user_like?.length
    }))

    const hasMore = (count || 0) > limit
    const trimmedData = hasMore ? transformedData.slice(0, limit) : transformedData

    return NextResponse.json({
      success: true,
      data: trimmedData,
      hasMore,
      total: count
    })
  } catch (error: any) {
    console.error('Posts GET error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
