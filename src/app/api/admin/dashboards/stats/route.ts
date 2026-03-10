import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const [
      publishedRes,
      draftsRes,
      totalsRes
    ] = await Promise.all([
      adminSupabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),

      // 2. Count Drafts (The Pipeline)
      adminSupabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),

      // 3. Get Views & Comments for aggregation (Reach & Community)
      // We ONLY select these two columns to keep the response size very small
      adminSupabase
        .from('posts')
        .select('views, comments_count')
    ]);

    // Error handling
    if (publishedRes.error) throw publishedRes.error;
    if (draftsRes.error) throw draftsRes.error;
    if (totalsRes.error) throw totalsRes.error;

    // Aggregate data for Reach and Community
    const totals = (totalsRes.data || []).reduce(
      (acc, curr) => ({
        views: acc.views + (curr.views || 0),
        comments: acc.comments + (curr.comments_count || 0),
      }),
      { views: 0, comments: 0 }
    );

    // Your exact requested response format
    return NextResponse.json({
      archive: {
        label: "Total Posts",
        value: publishedRes.count || 0,
      },
      reach: {
        label: "Total Views",
        value: totals.views, // Using total views as "The Reach"
      },
      community: {
        label: "Engagement",
        value: totals.comments,
      },
      pipeline: {
        label: "Drafts",
        value: draftsRes.count || 0,
      }
    });

  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}