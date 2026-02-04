import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)

    const from = (page - 1) * limit
    const to = from + limit - 1

    const search = searchParams.get('search')

    let query = adminSupabase
      .from('posts')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, slug, description, icon, is_active } = body

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



const keep_all = [
    "id = uuid (unique post ID)",
    "user_id = author ID", 
    "category_id = category ID",
    "title = post title",
    "slug = URL slug",
    "content = WYSIWYG HTML content",
    "excerpt = short preview",
    "hero_image = main image URL",
    "post_images = gallery images array",
    "status = draft/published/archived",
    "is_featured = homepage feature flag",
    "read_time = reading minutes",
    "views = page view counter",
    "likes = like counter",
    "word_count = content word count",
    "tags = keywords array",
    "seo_title = SEO title",
    "seo_description = meta description",
    "published_at = publish date",
    "created_at = created timestamp",
    "updated_at = last modified"
  ];
