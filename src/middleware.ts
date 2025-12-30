/**
 * Next.js Middleware
 * Handles auth refresh, protected routes, and API CORS
 */

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession, isProtectedRoute, isAuthRoute } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes - add CORS headers
  if (pathname.startsWith('/api/')) {
    // Skip CORS for internal API routes
    if (pathname.startsWith('/api/stripe/webhook')) {
      return NextResponse.next();
    }

    // Add CORS headers for external API access
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-Request-ID',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Continue with CORS headers for actual request
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    return response;
  }

  // Handle embed routes - allow framing
  if (pathname.startsWith('/embed/')) {
    const response = NextResponse.next();
    // Remove X-Frame-Options to allow embedding
    response.headers.delete('X-Frame-Options');
    response.headers.set('Content-Security-Policy', "frame-ancestors *");
    return response;
  }

  // Update Supabase session
  const response = await updateSession(request);

  // Check if trying to access protected route without auth
  if (isProtectedRoute(pathname)) {
    const supabaseResponse = response.headers.get('x-supabase-auth');

    // If no session and trying to access protected route, redirect to login
    // Note: This is a simplified check. In production, parse the session properly.
    if (!request.cookies.get('sb-access-token')?.value) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute(pathname)) {
    if (request.cookies.get('sb-access-token')?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
