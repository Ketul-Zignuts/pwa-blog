import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { addUpdatePostSchema } from '@/constants/schema/admin/postSchema'
import { JSDOM } from 'jsdom'

/* ---------------- HELPERS ---------------- */

function extractTempImageUrls(html: string): string[] {
  const dom = new JSDOM(html)
  return [...dom.window.document.querySelectorAll('img')]
    .map(img => img.getAttribute('src'))
    .filter(
      (src): src is string =>
        !!src && src.includes('/temp-images/')
    )
}

async function moveTempImageToPermanent(
  tempUrl: string,
  postId: string
): Promise<string> {
  // extract file path after bucket name
  const tempPath = tempUrl.split('/temp-images/')[1]

  const fileName = tempPath.split('/').pop()
  const permanentPath = `posts/${postId}/${Date.now()}-${fileName}`

  // download temp image
  const { data, error: downloadError } =
    await adminSupabase.storage
      .from('temp-images')
      .download(tempPath)

  if (downloadError || !data) {
    throw new Error('Failed to download temp image')
  }

  // upload to permanent bucket
  const buffer = Buffer.from(await data.arrayBuffer())

  const { error: uploadError } =
    await adminSupabase.storage
      .from('post-images')
      .upload(permanentPath, buffer, { upsert: true })

  if (uploadError) {
    throw uploadError
  }

  // get permanent public URL
  const { data: publicUrl } =
    adminSupabase.storage
      .from('post-images')
      .getPublicUrl(permanentPath)

  return publicUrl.publicUrl
}

async function finalizePostContent(
  html: string,
  postId: string
): Promise<string> {
  const tempImages = extractTempImageUrls(html)

  let finalHtml = html

  for (const tempUrl of tempImages) {
    const permanentUrl =
      await moveTempImageToPermanent(tempUrl, postId)

    finalHtml = finalHtml.replaceAll(tempUrl, permanentUrl)
  }

  return finalHtml
}

/* ---------------- API ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1️⃣ validate payload
    const payload = await addUpdatePostSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const {
      id,
      content,
      status,
      ...rest
    } = payload

    const postId = id ?? crypto.randomUUID()

    // 2️⃣ move temp images ONLY when saving/publishing
    const finalContent =
      status === 'published'
        ? await finalizePostContent(content, postId)
        : content

    // 3️⃣ upsert post
    const { data, error } = await adminSupabase
      .from('posts')
      .upsert(
        {
          id: postId,
          content: finalContent,
          status,
          ...rest,
          published_at:
            status === 'published'
              ? new Date().toISOString()
              : null,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.errors ?? err.message
      },
      { status: 400 }
    )
  }
}


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