import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() || ''

    let query = adminSupabase
      .from('categories')
      .select('id, name, icon')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (search) {
      query = query.or(`name.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[CATEGORIES_FETCH_ERROR]', error)
      return NextResponse.json(
        { message: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    const categories =
      data?.map(category => ({
        value: category.id,
        name: category.name,
        icon: category.icon
      })) || []

    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.error('[CATEGORIES_FETCH_EXCEPTION]', err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
