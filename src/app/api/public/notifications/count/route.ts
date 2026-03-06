import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { getPublicUserUid } from '@/utils/getPublicUserUid'

export async function GET(req: NextRequest) {
  try {
    const uid = await getPublicUserUid(req)
    
    if (!uid) {
      return NextResponse.json({ success: false }, { status: 200 })
    }

    const { count, error } = await adminSupabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_uid', uid)
      .eq('is_read', false)

    if (error) {
      console.error('Count error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      unreadCount: count || 0
    })
  } catch (error) {
    console.error('Count API error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
