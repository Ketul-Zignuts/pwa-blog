import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') ?? 1)
    const search = searchParams.get('search')

    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let selectFields = `
      id,
      title,
      slug,
      excerpt,
      hero_image,
      published_at,
      views,
      average_rating,
      category:categories(id,name,slug),
      user:users!posts_user_id_fkey(uid,displayName)
    `

    let query = adminSupabase
      .from('posts')
      .select(selectFields, { count: 'exact' })
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(from, to)

    // search filter
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim().replace(/[,{}]/g, '')

      query = query.or(
        `title.ilike.%${cleanSearch}%,excerpt.ilike.%${cleanSearch}%,tags.cs.{${cleanSearch}}`
      )
    }

    const { data, error, count } = await query

    if (error) throw error

    const hasMore = (count || 0) > page * limit

    return NextResponse.json({
      success: true,
      data,
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