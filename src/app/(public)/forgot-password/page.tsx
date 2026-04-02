'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggleSimple />
      </div>
      <Card className="w-full max-w-md dark:bg-secondary-800">
        {emailSent ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Mail className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-secondary-600 dark:text-secondary-400">
              <p>Click the link in the email to reset your password. The link expires in 1 hour.</p>
              <p className="mt-4">
                Didn't receive the email?{' '}
                <button
                  type="button"
                  onClick={() => setEmailSent(false)}
                  className="text-primary-500 hover:underline font-medium"
                >
                  Try again
                </button>
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Link
                href="/login"
                className="text-sm text-primary-500 hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Forgot password?</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <Link
                href="/login"
                className="text-sm text-primary-500 hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
