import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { addUpdatePostSchema } from '@/constants/schema/admin/postSchema'
import { JSDOM } from 'jsdom'
import { generateUniqueSlug } from '@/lib/generate-slug'

function getFinalPublishedAt(publishedAt: any, status: string): string | null {
  if (status !== 'published') return null

  if (publishedAt instanceof Date) {
    return publishedAt.toISOString()
  }

  if (typeof publishedAt === 'string' && publishedAt) {
    const date = new Date(publishedAt)
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
  }

  return new Date().toISOString()
}

function extractTempImageUrls(html: string): string[] {
  const dom = new JSDOM(html)
  return [...dom.window.document.querySelectorAll('img')]
    .map(img => img.getAttribute('src'))
    .filter((src): src is string => !!src && src.includes('/temp-images/'))
}

async function moveTempImageToPermanent(
  tempUrl: string,
  postId: string
): Promise<{ permanentUrl: string; tempPath: string }> {
  const url = new URL(tempUrl)
  const tempPath = decodeURIComponent(url.pathname.split('/temp-images/')[1])
  const fileName = tempPath.split('/').pop()!
  const permanentPath = `posts/${postId}/${Date.now()}-${fileName}`

  const { data, error: downloadError } = await adminSupabase.storage
    .from('temp-images')
    .download(tempPath)

  if (downloadError || !data) {
    throw new Error(`Failed to download temp image: ${tempPath}`)
  }

  const buffer = Buffer.from(await data.arrayBuffer())
  const { error: uploadError, data: uploadData } = await adminSupabase.storage
    .from('post-images')
    .upload(permanentPath, buffer, {
      upsert: true,
      contentType: data.type as string || 'image/jpeg'
    })

  if (uploadError || !uploadData?.path) {
    console.error('Upload error:', uploadError)
    throw new Error(`Failed to upload permanent image: ${permanentPath}`)
  }

  const { data: publicUrlData } = adminSupabase.storage
    .from('post-images')
    .getPublicUrl(permanentPath)

  return {
    permanentUrl: publicUrlData.publicUrl,
    tempPath
  }
}

async function finalizePostContent(
  html: string,
  postId: string
): Promise<{ finalHtml: string; tempPaths: string[] }> {
  const tempImages = extractTempImageUrls(html)
  let finalHtml = html
  const cleanedTempPaths: string[] = []

  for (const tempUrl of tempImages) {
    try {
      const { permanentUrl, tempPath } = await moveTempImageToPermanent(tempUrl, postId)
      finalHtml = finalHtml.replaceAll(tempUrl, permanentUrl)
      cleanedTempPaths.push(tempPath)
    } catch (error) {
      console.error(`❌ Failed to process image ${tempUrl}:`, error)
    }
  }

  return { finalHtml, tempPaths: cleanedTempPaths }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data, error } = await adminSupabase
      .from('posts')
      .select(`
        id, title, slug, content, excerpt, status, hero_image, 
        category_id, user_id, is_featured, read_time, tags, 
        seo_title, seo_description, published_at, created_at, updated_at
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data  // Returns your actual post data!
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = req.headers.get('x-user-id')
    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // 🔒 1. Fetch existing post
    const { data: existingPost, error: fetchError } = await adminSupabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // 🔒 2. Ownership check
    if (existingPost.user_id !== uid) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }

    const contentType = req.headers.get('content-type') || ''
    let payload: any

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      payload = {}

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          payload[key] = value
        } else if (key === 'tags') {
          payload[key] = JSON.parse(value as string || '[]')
        } else if (key === 'published_at') {
          const dateStr = (value as string).replace(/^"|"$/g, '').trim()
          payload[key] = dateStr ? new Date(dateStr) : null
        } else if (key === 'read_time') {
          payload[key] = value ? Number(value) : null
        } else if (key === 'is_featured') {
          payload[key] = value === 'true'
        } else {
          payload[key] = value || null
        }
      }

      // validate after parsing
      payload = await addUpdatePostSchema.validate({
        ...payload,
        user_id: uid
      }, {
        abortEarly: false,
        stripUnknown: true
      })
    } else {
      const body = await req.json()
      const fullPayloadBody = {
        ...body,
        user_id: uid
      }
      payload = await addUpdatePostSchema.validate(fullPayloadBody, {
        abortEarly: false,
        stripUnknown: true
      })
    }

    const {
      content,
      status,
      category_id,
      title,
      excerpt,
      hero_image,
      tags,
      read_time,
      published_at
    } = payload

    // 🖼 3. Handle hero image
    let finalHeroImage = existingPost.hero_image

    if (hero_image && hero_image instanceof File) {
      const timestamp = Date.now()
      const ext =
        hero_image.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
      const fileName = `hero/${id}/${timestamp}.${ext}`

      const buffer = Buffer.from(await hero_image.arrayBuffer())
      const { error: uploadError } = await adminSupabase.storage
        .from('post-images')
        .upload(fileName, buffer, {
          upsert: true,
          contentType: hero_image.type
        })

      if (!uploadError) {
        finalHeroImage = fileName
      }
    }

    // 📝 4. Finalize content if publishing
    let finalContent = content ?? existingPost.content
    let tempPathsToCleanup: string[] = []

    if (status === 'published' && content) {
      const result = await finalizePostContent(content, id)
      finalContent = result.finalHtml
      tempPathsToCleanup = result.tempPaths
    }

    // 🔗 5. Slug handling (only regenerate if title changed)
    let finalSlug = existingPost.slug

    if (title && title.trim() !== existingPost.title) {
      finalSlug = await generateUniqueSlug('posts', title)
    }

    const updateData: any = {
      user_id: existingPost.user_id,
      category_id: category_id ?? existingPost.category_id,
      title: title?.trim() ?? existingPost.title,
      slug: finalSlug,
      content: finalContent,
      excerpt: excerpt ?? existingPost.excerpt,
      hero_image: finalHeroImage,
      status: status ?? existingPost.status,
      read_time: read_time ?? existingPost.read_time,
      tags: tags?.filter(Boolean) ?? existingPost.tags,
      seo_title: title?.trim() ?? existingPost.seo_title,
      seo_description: excerpt ?? existingPost.seo_description,
      published_at: getFinalPublishedAt(
        published_at ?? existingPost.published_at,
        status ?? existingPost.status
      ),
      updated_at: new Date().toISOString()
    }

    // ✅ 6. Proper update (NOT upsert)
    const { data: postData, error: updateError } = await adminSupabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Title or slug already exists' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 500 }
      )
    }

    // 🧹 7. Cleanup temp images
    if (status === 'published' && tempPathsToCleanup.length > 0) {
      try {
        await adminSupabase.storage
          .from('temp-images')
          .remove(tempPathsToCleanup)

        await adminSupabase
          .from('temp_images')
          .delete()
          .in('file_path', tempPathsToCleanup)
      } catch (err) {
        console.error('Cleanup failed (non-critical):', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: postData,
        message:
          status === 'published'
            ? 'Post published successfully'
            : 'Post updated successfully'
      },
      { status: 200 }
    )
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: err.errors
        },
        { status: 422 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to update post'
      },
      { status: 400 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: postData } = await adminSupabase
      .from('posts')
      .select('hero_image')
      .eq('id', id)
      .single()

    const { error: deleteError } = await adminSupabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete post' },
        { status: 500 }
      )
    }

    if (postData?.hero_image) {
      try {
        await adminSupabase.storage
          .from('post-images')
          .remove([postData.hero_image])
      } catch (storageError) {
        console.warn('⚠️ Failed to delete hero image from storage:', storageError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
