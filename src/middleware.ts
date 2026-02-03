import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/supabase-server';

const protectedPaths = ['/api/admin', '/api/general'];

export async function middleware(req: NextRequest) {  
  const { pathname } = req.nextUrl;
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json(
          { success: false, message: 'No authorization header' },
          { status: 401 }
        );
      }
      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'No token in header' },
          { status: 401 }
        );
      }

      const user = await adminAuth.getUserByToken(token);

      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      
      return response;
      
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/general/:path*'],
};
