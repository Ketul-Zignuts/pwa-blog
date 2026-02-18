import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { post_id, rating, review } = body

    if (!post_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid post_id or rating (1-5 required)' },
        { status: 400 }
      )
    }

    const { data: existingReview, error: checkError } = await adminSupabase
      .from('post_reviews')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_uid', uid)
      .maybeSingle()

    if (checkError) {
      return NextResponse.json(
        { success: false, message: checkError.message },
        { status: 500 }
      )
    }

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this post' },
        { status: 409 }
      )
    }

    const { data, error } = await adminSupabase
      .from('post_reviews')
      .insert({
        post_id,
        user_uid: uid,
        rating,
        review: review || null
      })
      .select('id, rating, review, created_at')
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, rating, review } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID required in body' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating (1-5) required' },
        { status: 400 }
      )
    }

    const { data, error } = await adminSupabase
      .from('post_reviews')
      .update({
        rating,
        review: review || null
      })
      .eq('id', id)
      .eq('user_uid', uid)
      .select('id, rating, review, updated_at')
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Review not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID required as ?id=uuid' },
        { status: 400 }
      )
    }

    const { error } = await adminSupabase
      .from('post_reviews')
      .delete()
      .eq('id', id)
      .eq('user_uid', uid)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Review deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
