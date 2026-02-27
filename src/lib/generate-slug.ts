import slugify from 'slugify'
import { adminSupabase } from '@/lib/supabase-server'

export async function generateUniqueSlug(
  table: string,
  title: string,
  column: string = 'slug'
): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  })

  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data } = await adminSupabase
      .from(table)
      .select('id')
      .eq(column, slug)
      .maybeSingle()

    if (!data) break

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}