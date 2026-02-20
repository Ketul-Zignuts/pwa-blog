import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const logInUserUid = await getPublicUserUid(req)
    const { slug } = params
    const postId = req.nextUrl.searchParams.get('post_id')

    // Step 1: Get post data (your existing query)
    let query = adminSupabase
      .from('posts')
      .select(`
        *,
        category:categories(id,name,slug),
        user:users!posts_user_id_fkey(uid,displayName,bio,photoURL)
      `)

    if (postId) {
      query = query.eq('id', postId)
    } else {
      query = query.eq('slug', slug)
    }

    const { data, error } = await query.single()

    if (error || !data || !data.user) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // Step 2: Check if logged-in user follows this author (simple query)
    let isFollowing = false
    if (logInUserUid && data.user.uid !== logInUserUid) {
      const { count } = await adminSupabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_uid', logInUserUid)
        .eq('following_uid', data.user.uid)
      
      isFollowing = (count || 0) > 0
    }

    // ✅ No spread issues - direct assignment
    const cleanedData = {
      ...data,
      user: {
        ...data.user,
        is_following: isFollowing
      }
    }

    return NextResponse.json({
      success: true,
      data: cleanedData
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}