import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // pagination
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const from = (page - 1) * limit
    const to = from + limit - 1

    // search & filters
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let query = adminSupabase
      .from('categories')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order(sortBy, { ascending: sortOrder === 'asc' })

    // 🔍 search (name + description)
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    // ✅ active / inactive filter
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
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
        totalPages: Math.ceil((count ?? 0) / limit)
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, slug, description, icon, color, is_active } = body

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required.' },
        { status: 400 }
      )
    }

    // Insert new category
    const { data, error } = await adminSupabase
      .from('categories')
      .insert([
        {
          name,
          slug,
          description: description || null,
          icon: icon || null,
          color: color || '#3B82F6',
          is_active: is_active ?? true
        }
      ])
      .select()
      .single() // return the inserted row

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}