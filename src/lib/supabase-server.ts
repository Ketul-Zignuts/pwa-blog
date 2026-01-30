// cSpell:disable
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')

export const authSupabase = createClient(supabaseUrl, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export const adminAuth = {
  createUser: (data: any) =>
    adminSupabase.auth.admin.createUser(data),

  getUserByToken: async (token: string) => {
    const { data, error } = await adminSupabase.auth.getUser(token)
    if (error || !data.user) {
      throw new Error('Invalid or expired token')
    }
    return data.user
  }
}

export const adminDb = {
  from: (table: string) => adminSupabase.from(table)
}

export const adminStorage = {
  bucket: (name: string) => ({
    upload: (path: string, data: Buffer, options?: any) =>
      adminSupabase.storage.from(name).upload(path, data, options),
    getPublicUrl: (path: string) =>
      adminSupabase.storage.from(name).getPublicUrl(path)
  })
}

export const FieldValue = {
  serverTimestamp: () => new Date().toISOString()
}
