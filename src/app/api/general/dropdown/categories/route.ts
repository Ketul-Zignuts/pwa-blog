import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search')?.trim() || ''

    let query = adminSupabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        icon,
        post_count,
        is_active
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[CATEGORIES_DROPDOWN_ERROR]', error)
      return NextResponse.json(
        { message: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    const categories = (data || []).map(category => ({
      value: category.id,
      label: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      postCount: category.post_count
    }))

    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.error('[CATEGORIES_DROPDOWN_EXCEPTION]', err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
