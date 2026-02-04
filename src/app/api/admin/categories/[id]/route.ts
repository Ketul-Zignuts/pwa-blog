import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import slugify from 'slugify';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, slug, description, icon, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required.' },
        { status: 400 }
      );
    }

    let finalSlug = slug;
    if (!slug && name) {
      finalSlug = slugify(name, { lower: true, strict: true });
    }

    let uniqueSlug = finalSlug;
    if (finalSlug) {
      let counter = 1;
      let existing = await adminSupabase
        .from('categories')
        .select('id')
        .eq('slug', uniqueSlug)
        .neq('id', id)
        .maybeSingle();

      while (existing?.data) {
        uniqueSlug = `${finalSlug}-${counter}`;
        counter++;
        existing = await adminSupabase
          .from('categories')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', id)
          .maybeSingle();
      }
    }

    const { data, error } = await adminSupabase
      .from('categories')
      .update({
        name,
        slug: uniqueSlug,
        description: description ?? null,
        icon: icon ?? null,
        is_active: is_active ?? true,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message
    }, { status: 500 });
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
