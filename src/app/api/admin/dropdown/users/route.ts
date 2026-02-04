import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search')?.trim() || ''
    const limit = Number(searchParams.get('limit') || 10)

    if (!search) {
      return NextResponse.json([], { status: 200 })
    }

    let query = adminSupabase
      .from('users')
      .select(`
        id,
        email,
        displayName,
        photoURL
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.or(`displayName.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[USER_DROPDOWN_ERROR]', error)
      return NextResponse.json(
        { message: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    const users = (data || []).map(user => ({
      value: user.id,
      label: user.displayName || user.email,
      email: user.email,
      avatar: user.photoURL
    }))

    return NextResponse.json(users, { status: 200 })
  } catch (err) {
    console.error('[USER_DROPDOWN_EXCEPTION]', err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
