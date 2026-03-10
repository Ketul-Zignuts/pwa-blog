import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const search = searchParams.get('search');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1. Build the base query
    let query = adminSupabase
      .from('users')
      .select('displayName, email, isadmin, isroadmin, created_at, bio', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // 2. Add search functionality (Optional, but very useful for user tables)
    if (search) {
      query = query.or(`displayName.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    // 3. Format the data to match your UI requirements
    const formattedData = (data || []).map((user) => ({
      name: user.displayName || 'Anonymous',
      email: user.email,
      role: user.isadmin ? 'Admin' : user.isroadmin ? 'Editor' : 'Author',
      status: new Date(user.created_at).getTime() > Date.now() - 604800000 
        ? 'Pending' 
        : 'Active'
    }));

    // 4. Return identical response structure to your categories route
    return NextResponse.json({
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (err: any) {
    console.error('User Fetch Error:', err);
    return NextResponse.json(
      { success: false, message: err.message }, 
      { status: 500 }
    );
  }
}