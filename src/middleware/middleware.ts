import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-server'

const protectedRoutes = ['/dashboard', '/profile', '/posts', '/admin']
const publicRoutes = ['/login', '/api']

export async function middleware(request: NextRequest) {
  // Skip public routes
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from Authorization header OR cookie
  const token = request.headers
    .get('authorization')?.split('Bearer ')[1] ||
    request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify Firebase JWT token
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Add user info to headers (for API routes)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-uid', decodedToken.uid)
    requestHeaders.set('x-user-email', decodedToken.email || '')

    // Add token to cookies (refresh strategy)
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Middleware auth failed:', error)
    
    // Invalid token → redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // All routes except static
  ],
}
