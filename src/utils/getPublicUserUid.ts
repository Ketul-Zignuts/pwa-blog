import { NextRequest } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export const getPublicUserUid = async (req: NextRequest): Promise<string | null> => {
  let uid = req.headers.get('x-user-id')
  if (uid) return uid
  
  const token = req.cookies.get('access_token')?.value || req.cookies.get('sb-access-token')?.value || req.cookies.get('sb-access-token')?.value

  if (token) {
    try {
      const { data: { user }, error } = await adminSupabase.auth.getUser(token)
      if (user && !error) return user.id
    } catch {
    }
  }

  // Method 3: Check Authorization header
  const authHeader = req.headers.get('authorization')
  const authToken = authHeader?.replace('Bearer ', '').trim()
  
  if (authToken) {
    try {
      const { data: { user }, error } = await adminSupabase.auth.getUser(authToken)
      if (user && !error) return user.id
    } catch {
      // Token invalid, continue
    }
  }

  return null // No valid user found
}
