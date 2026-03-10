import { adminSupabase } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") ?? 1)
    const limit = Number(searchParams.get("limit") ?? 10)

    const from = (page - 1) * limit
    const to = from + limit - 1

    const search = searchParams.get("search")

    let query = adminSupabase
      .from("follows")
      .select(
        `
        id,
        created_at,
        follower:users!follows_follower_uid_fkey (
          uid,
          email,
          displayName,
          photoURL,
          bio,
          followers,
          following,
          totalposts
        )
        `,
        { count: "exact" }
      )
      .eq("following_uid", userId) // 🔥 my followers
      .range(from, to)
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("follower.displayName", `%${search}%`)
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


export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Follow id is required" },
        { status: 400 }
      )
    }

    // 🔥 Delete follower relation
    const { error } = await adminSupabase
      .from("follows")
      .delete()
      .eq("id", id)
      .eq("following_uid", userId)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Follower removed successfully"
    })

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}