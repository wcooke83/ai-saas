import { redirect } from 'next/navigation';

/**
 * Signup page — redirects to /login?mode=signup.
 *
 * The primary redirect happens in middleware (faster, avoids RSC round-trip).
 * This server component acts as a fallback in case middleware is bypassed.
 */
export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  // Middleware handles this redirect, but keep as fallback
  redirect('/login?mode=signup');
}
