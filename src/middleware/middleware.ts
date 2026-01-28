import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-server'

const protectedRoutes = ['/dashboard', '/profile', '/posts', '/admin']
const publicRoutes = ['/login', '/api', '/']
const apiRoutes = ['/api']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public routes completely
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For API routes: just verify token, no redirects
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
  
  // Get token from Authorization header OR cookie
  const token = request.headers
    .get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('auth-token')?.value

  if (!token) {
    if (isApiRoute) {
      // API: return 401 JSON (no redirect)
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
    // Pages: redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify Firebase JWT token
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-uid', decodedToken.uid)
    requestHeaders.set('x-user-email', decodedToken.email || '')
    requestHeaders.set('x-user-roles', JSON.stringify(decodedToken.admin || []))

    const response = NextResponse.next({
      request: { headers: requestHeaders }
    })

    // Refresh cookie (7 days)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  } catch (error) {
    console.error('Auth failed:', error)
    
    if (isApiRoute) {
      // API: return 401 JSON
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      )
    }
    
    // Pages: redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', 
  ],
}
