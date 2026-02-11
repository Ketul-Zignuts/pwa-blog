import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/supabase-server'
import { createRefreshClient } from '@/lib/supabase-refresh'

const protectedPaths = ['/api/admin', '/api/general', '/api/upload']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '').trim()

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No access token' },
      { status: 401 }
    )
  }

  try {
    // 1️⃣ Try normal validation
    const user = await adminAuth.getUserByToken(token)

    const res = NextResponse.next()
    res.headers.set('x-user-id', user.id)
    return res

  } catch (err: any) {
    // 2️⃣ Try refresh
    const refreshToken = req.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Session expired' },
        { status: 401 }
      )
    }

    try {
      const supabase = createRefreshClient(refreshToken)

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error || !data.session) {
        throw error
      }

      const newAccessToken = data.session.access_token
      const userId = data.session.user.id

      const res = NextResponse.next()
      res.headers.set('x-user-id', userId)

      // 🔥 send new token to FE
      res.headers.set('x-new-access-token', newAccessToken)

      return res
    } catch {
      return NextResponse.json(
        { success: false, message: 'Session expired' },
        { status: 401 }
      )
    }
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/general/:path*', '/api/upload/:path*']
}
