import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const { name, slug, description, icon, color, is_active } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required.' },
        { status: 400 }
      )
    }

    // Update category
    const { data, error } = await adminSupabase
      .from('categories')
      .update({
        name,
        slug,
        description: description ?? null,
        icon: icon ?? null,
        color: color ?? '#3B82F6',
        is_active: is_active ?? true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required.' },
        { status: 400 }
      )
    }

    const { data, error } = await adminSupabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
