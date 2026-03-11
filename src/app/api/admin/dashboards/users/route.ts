import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)
    const search = searchParams.get('search')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = adminSupabase
      .from('users')
      .select(
        `
        uid,
        displayName,
        email,
        photoURL,
        followers,
        createdAt,
        posts:posts(count),
        comments:comments(count),
        likes:post_likes(count)
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to)

    if (search) {
      query = query.or(`displayName.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, count, error } = await query

    if (error) throw error

    const formattedData = (data || []).map((user: any) => ({
      photoURL: user.photoURL,
      displayName: user.displayName || 'Anonymous',
      email: user.email,

      totalPosts: user.posts?.[0]?.count ?? 0,
      totalComments: user.comments?.[0]?.count ?? 0,
      totalLikes: user.likes?.[0]?.count ?? 0,
      followers: user.followers ?? 0
    }))

    return NextResponse.json({
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit)
      }
    })
  } catch (err: any) {
    console.error('User Fetch Error:', err)

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}