'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // MFA state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerifying, setMfaVerifying] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const mfaInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        checkMfaRequirement();
      }
    });

    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const tokenHash = params.get('token_hash');
      const type = params.get('type');

      // Handle token_hash flow (works across browsers)
      if (tokenHash && type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });
        if (!error) {
          window.history.replaceState({}, '', '/reset-password');
          await checkMfaRequirement();
          return;
        }
      }

      // Handle PKCE code flow (same browser only)
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          window.history.replaceState({}, '', '/reset-password');
          await checkMfaRequirement();
          return;
        }
      }

      // Check for hash fragments (implicit flow)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if there's already an active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkMfaRequirement();
      } else {
        setCheckingSession(false);
      }
    };

    handleAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkMfaRequirement = async () => {
    // Check if user has MFA enrolled
    const { data: factorsData } = await supabase.auth.mfa.listFactors();

    if (factorsData?.totp && factorsData.totp.length > 0) {
      const verifiedFactor = factorsData.totp.find((f: any) => f.status === 'verified');
      if (verifiedFactor) {
        // Check current AAL level
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (aalData?.currentLevel === 'aal1') {
          // Need MFA verification to reach AAL2
          setMfaFactorId(verifiedFactor.id);
          setMfaRequired(true);
          setSessionReady(true);
          setCheckingSession(false);
          setTimeout(() => mfaInputRef.current?.focus(), 100);
          return;
        }
      }
    }

    // No MFA or already AAL2
    setSessionReady(true);
    setCheckingSession(false);
    setTimeout(() => passwordInputRef.current?.focus(), 100);
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaVerifying(true);

    try {
      if (!mfaFactorId) {
        throw new Error('MFA factor not found');
      }

      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaFactorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: mfaCode,
      });

      if (verifyError) throw verifyError;

      // MFA verified, now can set password
      setMfaRequired(false);
      toast.success('MFA verified');
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setMfaVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      await supabase.auth.signOut();

      setSuccess(true);
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
        <Card className="w-full max-w-md dark:bg-secondary-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
            <p className="text-secondary-600 dark:text-secondary-400">Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid/expired link
  if (!sessionReady && !checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggleSimple />
        </div>
        <Card className="w-full max-w-md dark:bg-secondary-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invalid or expired link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/forgot-password">
              <Button>Request a new reset link</Button>
            </Link>
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
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(var(--page-bg))' }}>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggleSimple />
      </div>
      <Card className="w-full max-w-md dark:bg-secondary-800">
        {success ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-2xl">Password reset</CardTitle>
              <CardDescription>
                Your password has been successfully updated
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.push('/login')}>
                Sign in with new password
              </Button>
            </CardContent>
          </>
        ) : mfaRequired ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/50">
                  <ShieldCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMfaVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mfaCode">Verification Code</Label>
                  <Input
                    ref={mfaInputRef}
                    id="mfaCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={mfaVerifying || mfaCode.length !== 6}>
                  {mfaVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
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
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Set new password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Updating...
                    </>
                  ) : (
                    'Reset password'
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
