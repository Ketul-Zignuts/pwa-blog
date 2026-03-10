import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase-server';
import dayjs from 'dayjs';

export async function GET(req: NextRequest) {
  try {
    const [postsRes, commentsRes, reviewsRes] = await Promise.all([
      adminSupabase.from('posts').select('id, status, views, average_rating, created_at'),
      adminSupabase.from('comments').select('id, content, created_at, users (displayName, photoURL)').order('created_at', { ascending: false }).limit(5),
      adminSupabase.from('post_reviews').select('id, rating, review, created_at, users (displayName)').order('created_at', { ascending: false }).limit(5)
    ]);

    if (postsRes.error) throw postsRes.error;

    const posts = postsRes.data || [];

    // 1. Content Velocity (KPIs)
    const weeklyGrowth = posts.filter(p => dayjs(p.created_at).isAfter(dayjs().subtract(7, 'day'))).length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    const velocity = {
      totalPosts: posts.length,
      pendingReviews: posts.filter(p => p.status === 'draft').length,
      avgRating: (posts.reduce((acc, p) => acc + (p.average_rating || 0), 0) / (posts.length || 1)).toFixed(1),
      publishedThisMonth: posts.filter(p => p.status === 'published').length,
      weeklyGrowth,
      totalViews
    };

    // 2. Community Pulse (Engagement)
    const pulse = {
      recentComments: commentsRes.data,
      recentReviews: reviewsRes.data
    };

    // 3. Activity Inbox (Recent Action Items)
    const activityFeed = [
      ...(commentsRes.data?.map(c => ({ 
        type: 'comment', 
        content: c.content, 
        user: (c.users as any)?.displayName || 'Unknown', 
        date: c.created_at 
      })) || []),
      ...(reviewsRes.data?.map(r => ({ 
        type: 'review', 
        content: r.review, 
        user: (r.users as any)?.displayName || 'Unknown', 
        date: r.created_at 
      })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return NextResponse.json({
      velocity,
      pulse,
      activityFeed
    });

  } catch (err) {
    console.error('Dashboard Summary Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}