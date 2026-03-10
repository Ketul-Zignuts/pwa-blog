// cSpell:disable
'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

/**
 * Google OAuth Login
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error

  return data
}

/**
 * Get Current Session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  return data.session
}

/**
 * Get Current User
 */
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  return data.user
}

/**
 * Logout
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}