/**
 * Supabase Server Client
 * For server components, API routes, and server actions
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle cookie errors in server components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle cookie errors in server components
          }
        },
      },
    }
  );
}

/**
 * Get current user (convenience helper)
 * Uses getUser() for security - validates with Supabase Auth server
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    if (error) console.error('Auth error:', error);
    return null;
  }

  // Return a session-like object for backwards compatibility
  return { user };
}

/**
 * Get current user with profile
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    ...session.user,
    profile,
  };
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}
