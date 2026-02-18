import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const post_id = searchParams.get('post_id')
    const uid = await getPublicUserUid(req)

    if (!post_id) {
      return NextResponse.json(
        { success: false, message: 'post_id is required' },
        { status: 400 }
      )
    }

    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await adminSupabase
      .from('post_reviews')
      .select(`
        *,
        users (
          displayName,
          photoURL
        )
      `, { count: 'exact' })
      .eq('post_id', post_id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    const hasMore = to + 1 < (count || 0)
    let user_review = null

    if (uid && data) {
      user_review = data.find((r: any) => r.user_uid === uid) || null
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        hasMore
      },
      user_review
    })
  } catch (error: any) {
    console.error('Fetch reviews error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
