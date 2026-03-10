import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    let { data: post, error } = await adminSupabase
      .from('posts')
      .select('title, slug, likes, comments_count')
      .eq('is_featured', true)
      .order('likes', { ascending: false })
      .limit(1)
      .single()

    if (error || !post) {
      const { data: fallbackPost, error: fallbackError } = await adminSupabase
        .from('posts')
        .select('title, slug, likes, comments_count')
        .eq('status', 'published')
        .order('likes', { ascending: false }) 
        .limit(1)
        .single()

      if (fallbackError) throw fallbackError
      post = fallbackPost
    }

    const engagementScore = (post.likes * 1) + (post.comments_count * 3)

    return NextResponse.json({
      title: post.title,
      slug: post.slug,
      likes: post.likes,
      comments: post.comments_count,
      engagementScore: engagementScore,
      message: "Showing your top performing content"
    })

  } catch (err) {
    console.error('Error fetching dashboard content:', err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}