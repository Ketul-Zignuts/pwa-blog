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

    // ✅ STEP 1: INCREMENT VIEW BY SLUG (always first)
    const { data: slugData } = await adminSupabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (slugData?.id) {
      // Increment view count
      await adminSupabase.rpc('increment_post_views', { 
        post_id_param: slugData.id 
      })
    }

    // ✅ STEP 2: Get full post data
    const { data, error } = await adminSupabase
      .from('posts')
      .select(`
        *,
        category:categories(id,name,slug),
        user:users!posts_user_id_fkey(uid,displayName,bio,photoURL)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data || !data.user) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    // ✅ STEP 3: Check if logged-in user follows author
    let isFollowing = false
    if (logInUserUid && data.user.uid !== logInUserUid) {
      const { count } = await adminSupabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_uid', logInUserUid)
        .eq('following_uid', data.user.uid)
      
      isFollowing = (count || 0) > 0
    }

    // ✅ STEP 4: Clean data
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
    console.error('Post detail error:', err)
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
