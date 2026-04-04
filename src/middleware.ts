/**
 * Next.js Middleware
 * Handles auth refresh, protected routes, and API CORS
 */

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession, isProtectedRoute, isAuthRoute } from '@/lib/supabase/middleware';
import { checkGate, BYPASS_COOKIE_NAME, BYPASS_COOKIE_MAX_AGE } from '@/lib/maintenance-gate';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance / coming-soon gate
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip');
  const gate = checkGate(pathname, {
    ip,
    hasBypassCookie: request.cookies.get(BYPASS_COOKIE_NAME)?.value === 'true',
    hasBypassParam: request.nextUrl.searchParams.get('i') === 'true',
  });
  if (gate.active) {
    return NextResponse.rewrite(new URL(gate.destination, request.url));
  }
  if (!gate.active && gate.setCookie) {
    // Strip the ?i=true param and redirect, setting the bypass cookie
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete('i');
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(BYPASS_COOKIE_NAME, 'true', {
      maxAge: BYPASS_COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  }

  // Handle API routes - add CORS headers + refresh session
  if (pathname.startsWith('/api/')) {
    // Skip CORS for internal API routes
    if (pathname.startsWith('/api/stripe/webhook')) {
      return NextResponse.next();
    }

    // Add CORS headers for external API access
    if (request.method === 'OPTIONS') {
      // Public widget/chat endpoints allow any origin
      const isPublicRoute = pathname.startsWith('/api/widget/') || pathname.startsWith('/api/chat/');
      const reqOrigin = request.headers.get('origin');
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const corsOrigin = isPublicRoute ? '*' : (reqOrigin && appUrl && reqOrigin === appUrl ? reqOrigin : '');

      return new NextResponse(null, {
        status: 204,
        headers: {
          ...(corsOrigin ? { 'Access-Control-Allow-Origin': corsOrigin } : {}),
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-Request-ID',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Public widget/chat endpoints don't use cookie-based auth — skip the
    // Supabase session refresh to avoid a wasted 30-80ms round-trip.
    if (pathname.startsWith('/api/widget/') || pathname.startsWith('/api/chat/')) {
      const response = NextResponse.next();
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      return response;
    }

    // Refresh Supabase session so API route handlers see valid tokens
    // Authenticated API routes: restrict CORS to same-origin (no wildcard)
    const response = await updateSession(request);
    const origin = request.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (origin && appUrl && origin === appUrl) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    return response;
  }

  // Handle embed routes and agent console - allow framing
  if (pathname.startsWith('/embed/') || pathname.startsWith('/agent-console/') || pathname.startsWith('/widget/')) {
    const response = NextResponse.next();
    // Remove X-Frame-Options to allow embedding
    response.headers.delete('X-Frame-Options');
    response.headers.set('Content-Security-Policy', "frame-ancestors *");
    return response;
  }

  // Update Supabase session
  const response = await updateSession(request);

  // Check auth status from response header
  const isAuthenticated = response.headers.get('x-user-id') !== null;

  // Check if trying to access protected route without auth
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // New-user onboarding redirect: when an authenticated user hits /dashboard
  // for the first time, check whether they have completed onboarding. If not,
  // send them to the wizard. We only do this on the exact /dashboard entry
  // point (not sub-pages) to keep the middleware fast.
  if (pathname === '/dashboard' && isAuthenticated) {
    const userId = response.headers.get('x-user-id');
    if (userId) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceRoleKey) {
          // Check profiles.onboarding_completed_at in a single lightweight query
          const profileRes = await fetch(
            `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=onboarding_completed_at`,
            {
              headers: {
                apikey: serviceRoleKey,
                Authorization: `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (profileRes.ok) {
            const profiles = await profileRes.json();
            const profile = profiles?.[0];
            // Only redirect if onboarding has never been completed
            if (profile && profile.onboarding_completed_at === null) {
              // Check if they have any chatbots already (pre-wizard users should not be redirected)
              const chatbotsRes = await fetch(
                `${supabaseUrl}/rest/v1/chatbots?user_id=eq.${userId}&select=id&limit=1`,
                {
                  headers: {
                    apikey: serviceRoleKey,
                    Authorization: `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'count=exact',
                  },
                }
              );
              const countHeader = chatbotsRes.headers.get('content-range');
              const total = countHeader ? parseInt(countHeader.split('/')[1] ?? '0', 10) : 0;
              if (total === 0) {
                return NextResponse.redirect(new URL('/onboarding', request.url));
              }
            }
          }
        }
      } catch {
        // If the check fails (network, env vars missing), fall through to dashboard
      }
    }
  }

  // Redirect /signup to /login?mode=signup (preserving query params like ?plan=)
  // Handled here in middleware to avoid RSC round-trip and client-side navigation issues
  if (pathname === '/signup') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('mode', 'signup');
    // Preserve plan param if present
    const plan = request.nextUrl.searchParams.get('plan');
    if (plan) {
      loginUrl.searchParams.set('plan', plan);
    }
    return NextResponse.redirect(loginUrl);
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
