import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

interface PostData {
  views: number;
  likes: number;
  comments_count: number;
}

interface CategoryWithPosts {
  name: string;
  slug: string;
  icon: string | null;
  posts: PostData[];
}

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await adminSupabase
      .from('categories')
      .select(`
        name,
        slug,
        icon,
        posts (
          views,
          likes,
          comments_count
        )
      `)
      .eq('is_active', true);

    if (error) throw error;

    const categoriesData = (data as unknown as CategoryWithPosts[]) || [];

    const categoriesStats = categoriesData.map((cat) => {
      const posts = cat.posts || [];
      
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalEngagement = posts.reduce((sum, p) => 
        sum + ((p.likes || 0) + (p.comments_count || 0)), 0
      );
      
      const trendValue = totalViews > 0 
        ? ((totalEngagement / totalViews) * 100).toFixed(1) 
        : "0";

      return {
        label: cat.name,
        subLabel: cat.slug,
        value: totalViews >= 1000 
          ? `${(totalViews / 1000).toFixed(1)}k` 
          : `${totalViews}`,
        secondaryValue: posts.length,
        // Helper for accurate sorting without parsing strings
        rawViews: totalViews, 
        trend: `${trendValue}%`,
        isUp: parseFloat(trendValue) > 2,
        icon: cat.icon || 'ri-file-line'
      };
    });

    // Sort by actual numeric views, then clean up the response
    const result = categoriesStats
      .sort((a, b) => b.rawViews - a.rawViews)
      .slice(0, 5)
      .map(({ rawViews, ...rest }) => rest); // Remove helper field before sending to FE

    return NextResponse.json(result);

  } catch (err) {
    console.error('Top Categories Error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}