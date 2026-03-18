/**
 * Supabase Middleware Client
 * For Next.js middleware (auth refresh)
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      response.headers.set('x-user-id', user.id);
    }
  } catch {
    // Auth fetch failed (network blip, DNS issue, etc.) — continue without auth
  }

  return response;
}

/**
 * Protected routes configuration
 */
export const protectedRoutes = [
  '/dashboard',
  '/admin',
];

export const authRoutes = ['/login', '/signup', '/forgot-password'];

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}
