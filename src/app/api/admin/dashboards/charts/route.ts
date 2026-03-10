import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import dayjs from 'dayjs'

export async function GET(req: NextRequest) {
  try {
    // 1. Define time ranges using dayjs
    const today = dayjs().startOf('day');
    const sevenDaysAgo = today.subtract(7, 'day');
    const thirtyDaysAgo = today.subtract(30, 'day');

    // 2. Fetch all published posts from the last 30 days
    const { data: posts, error } = await adminSupabase
      .from('posts')
      .select('published_at, views, likes, comments_count, seo_title, seo_description')
      .eq('status', 'published')
      .gte('published_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    // --- BAR CHART LOGIC (Last 7 Days) ---
    const weeklyData: Record<string, { day: string, postCount: number, buzz: number }> = {};
    
    // Initialize the last 7 days with zero values
    for (let i = 6; i >= 0; i--) {
      const d = today.subtract(i, 'day').format('ddd'); // 'Mon', 'Tue', etc.
      weeklyData[d] = { day: d, postCount: 0, buzz: 0 };
    }

    posts?.forEach(post => {
      if (!post.published_at) return;
      
      const postDate = dayjs(post.published_at);
      
      // Check if post was within the last 7 days
      if (postDate.isAfter(sevenDaysAgo) || postDate.isSame(sevenDaysAgo)) {
        const dayName = postDate.format('ddd');
        if (weeklyData[dayName]) {
          weeklyData[dayName].postCount += 1;
          weeklyData[dayName].buzz += (post.likes + post.comments_count);
        }
      }
    });

    // --- RADAR CHART LOGIC (Quality Matrix) ---
    const total = posts?.length || 0;
    const stats = posts?.reduce((acc, p) => {
      acc.views += p.views || 0;
      acc.likes += p.likes || 0;
      acc.comments += p.comments_count || 0;
      if (p.seo_title && p.seo_description) acc.seoOptimized += 1;
      return acc;
    }, { views: 0, likes: 0, comments: 0, seoOptimized: 0 });

    // We normalize these values to a 0-100 scale for the radar chart
    const radarData = [
      { subject: 'Engagement', value: total ? Math.min((stats.likes / (stats.views || 1)) * 500, 100) : 0 }, // Weighted for visibility
      { subject: 'Discussion', value: total ? Math.min((stats.comments / (stats.views || 1)) * 1000, 100) : 0 }, 
      { subject: 'SEO', value: total ? (stats.seoOptimized / total) * 100 : 0 },
      { subject: 'Consistency', value: Math.min((total / 12) * 100, 100) }, // Goal: 12 posts/month
      { subject: 'Reach', value: Math.min(((stats.views / (total || 1)) / 1000) * 100, 100) }
    ];

    return NextResponse.json({
      barChart: Object.values(weeklyData),
      radarChart: radarData
    });

  } catch (err) {
    console.error('Charts API Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}