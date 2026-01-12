import { redirect } from 'next/navigation';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  // Redirect to login page with signup mode
  const params = await searchParams;
  const plan = params.plan;
  const redirectUrl = plan ? `/login?mode=signup&plan=${plan}` : '/login?mode=signup';
  redirect(redirectUrl);
}
