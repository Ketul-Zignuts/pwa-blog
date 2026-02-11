import { adminSupabase } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // 🔥 1️⃣ Get user id from middleware header
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)

    const from = (page - 1) * limit
    const to = from + limit - 1

    const search = searchParams.get('search')

    let query = adminSupabase
      .from('posts')
      .select(
        `
          id,
          title,
          slug,
          hero_image,
          status,
          category:categories (
            id,
            name,
            slug
          )
        `,
        { count: 'exact' }
      )
      // ✅ FILTER BY LOGGED IN USER
      .eq('user_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (search) {
      const normalized = search.toLowerCase()

      query = query.or(
        `title.ilike.%${normalized}%,tags.cs.{${normalized}}`
      )
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
