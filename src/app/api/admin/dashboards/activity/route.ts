import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    // Fetch recent comments and reviews in parallel
    const [commentsRes, reviewsRes] = await Promise.all([
      adminSupabase.from('comments').select('content, created_at, users(displayName)').order('created_at', { ascending: false }).limit(5),
      adminSupabase.from('post_reviews').select('review, rating, created_at, users(displayName)').order('created_at', { ascending: false }).limit(5)
    ]);

    return NextResponse.json({
      recentComments: commentsRes.data,
      recentReviews: reviewsRes.data
    });
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}