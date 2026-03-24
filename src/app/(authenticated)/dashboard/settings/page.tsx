'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  CreditCard,
  Shield,
  Bell,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
  Crown,
  Zap,
  ShieldCheck,
  Smartphone,
  Copy,
  CheckCircle2,
  Mail,
  FileText,
  MessageSquare,
  Megaphone,
  PenTool,
  ClipboardList,
  Send,
  Bot,
  Settings,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { H1 } from '@/components/ui/heading';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
import { ModelSelector } from '@/components/settings/ModelSelector';

// Tool display configuration
const toolConfig: Record<string, { name: string; icon: typeof Mail }> = {
  email_writer: { name: 'Email Writer', icon: Mail },
  proposal_generator: { name: 'Proposal Generator', icon: FileText },
  social_post: { name: 'Social Post Generator', icon: MessageSquare },
  ad_copy: { name: 'Ad Copy Generator', icon: Megaphone },
  blog_writer: { name: 'Blog Writer', icon: PenTool },
  meeting_notes: { name: 'Meeting Notes', icon: ClipboardList },
  email_sequence: { name: 'Email Sequence Builder', icon: Send },
  custom_chatbots: { name: 'Custom Chatbots', icon: Bot },
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [planData, setPlanData] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 2FA Modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'intro' | 'qr' | 'verify' | 'success'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [backupCodesCopied, setBackupCodesCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Real MFA state from Supabase
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [totpUri, setTotpUri] = useState<string>('');
  const [totpSecret, setTotpSecret] = useState<string>('');

  const router = useRouter();
  const supabase = createClient() as any;

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [profileResult, subscriptionResult, mfaResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
        supabase.auth.mfa.listFactors(),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
        setFullName(profileResult.data.full_name || '');
        setEmail(profileResult.data.email);
      }

      if (subscriptionResult.data) {
        setSubscription(subscriptionResult.data);

        // Fetch the plan details to get features
        if (subscriptionResult.data.plan) {
          const { data: plan } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('slug', subscriptionResult.data.plan)
            .single();

          if (plan) {
            setPlanData(plan);
          }
        }
      }

      // Check if user has verified TOTP factors
      if (mfaResult.data?.totp && mfaResult.data.totp.length > 0) {
        const hasVerifiedFactor = mfaResult.data.totp.some(
          (factor: any) => factor.status === 'verified'
        );
        setTwoFAEnabled(hasVerifiedFactor);
      }

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    // In a real app, this would redirect to Stripe Customer Portal
    window.open('https://billing.stripe.com/p/login/test', '_blank');
  };

  const handleOpenPasswordDialog = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordDialogOpen(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    // Validation
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordSaving(true);

    try {
      // First, verify current password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('User email not found');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setPasswordDialogOpen(false);
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleOpen2FAModal = () => {
    setTwoFAStep('intro');
    setVerificationCode('');
    setVerificationError(null);
    setBackupCodesCopied(false);
    setMfaFactorId(null);
    setTotpUri('');
    setTotpSecret('');
    setShow2FAModal(true);
  };

  const handleStartEnrollment = async () => {
    setEnrolling(true);
    setVerificationError(null);

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) {
        setVerificationError(error.message);
        return;
      }

      if (data) {
        setMfaFactorId(data.id);
        setTotpUri(data.totp.uri);
        setTotpSecret(data.totp.secret);
        setTwoFAStep('qr');
      }
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : 'Failed to start enrollment');
    } finally {
      setEnrolling(false);
    }
  };

  const handleVerify2FA = async () => {
    setVerificationError(null);

    if (verificationCode.length !== 6) {
      setVerificationError('Please enter a 6-digit code');
      return;
    }

    if (!mfaFactorId) {
      setVerificationError('No enrollment in progress');
      return;
    }

    setVerifying(true);

    try {
      // First create a challenge for the enrolled factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaFactorId,
      });

      if (challengeError) {
        setVerificationError(challengeError.message);
        setVerifying(false);
        return;
      }

      // Then verify the code
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) {
        setVerificationError(verifyError.message || 'Invalid verification code. Please try again.');
        setVerifying(false);
        return;
      }

      // Success!
      setTwoFAStep('success');
      setTwoFAEnabled(true);
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopySecret = () => {
    if (totpSecret) {
      navigator.clipboard.writeText(totpSecret);
      setBackupCodesCopied(true);
      setTimeout(() => setBackupCodesCopied(false), 2000);
    }
  };

  const handleClose2FAModal = () => {
    setShow2FAModal(false);
    if (twoFAStep === 'success') {
      toast.success('Two-factor authentication has been enabled');
    }
  };

  const handleDisable2FA = async () => {
    try {
      // Get list of factors to find the one to unenroll
      const { data: factorsData } = await supabase.auth.mfa.listFactors();

      if (factorsData?.totp && factorsData.totp.length > 0) {
        const verifiedFactor = factorsData.totp.find((f: any) => f.status === 'verified');
        if (verifiedFactor) {
          const { error } = await supabase.auth.mfa.unenroll({
            factorId: verifiedFactor.id,
          });

          if (error) {
            toast.error(error.message);
            return;
          }
        }
      }

      setTwoFAEnabled(false);
      toast.success('Two-factor authentication has been disabled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disable 2FA');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 rounded animate-pulse" />
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-secondary-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 bg-secondary-100 rounded animate-pulse" />
                  <div className="h-10 bg-secondary-100 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Settings</H1>
          <p className="text-secondary-600 dark:text-secondary-400">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-secondary-50 dark:bg-secondary-800"
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Contact support to change your email</p>
                </div>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Model Preference */}
        <ModelSelector />

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  subscription?.plan === 'pro' ? 'bg-primary-100 dark:bg-primary-900/50' :
                  subscription?.plan === 'enterprise' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                  subscription?.plan === 'base' ? 'bg-emerald-100 dark:bg-emerald-900/50' :
                  'bg-secondary-100 dark:bg-secondary-700'
                }`}>
                  {subscription?.plan === 'pro' ? (
                    <Zap className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  ) : subscription?.plan === 'enterprise' ? (
                    <Crown className="w-6 h-6 text-yellow-600" aria-hidden="true" />
                  ) : subscription?.plan === 'base' ? (
                    <Zap className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <User className="w-6 h-6 text-secondary-600" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {planData?.name || subscription?.plan || 'Free'} Plan
                    </p>
                    <Badge variant={subscription?.status === 'active' ? 'success' : 'secondary'}>
                      {subscription?.status || 'Active'}
                    </Badge>
                  </div>
                  {subscription?.current_period_end && (
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {subscription.cancel_at_period_end
                        ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                        : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {subscription?.plan !== 'enterprise' && (
                  <Button asChild variant="outline">
                    <a href="/dashboard/upgrade">Upgrade</a>
                  </Button>
                )}
                <Button variant="outline" onClick={handleManageBilling}>
                  Manage Billing
                  <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Your plan includes:</p>
              <div className="space-y-4">
                {/* Credits and API keys */}
                <ul className="grid gap-2 sm:grid-cols-2">
                  <li className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                    {planData?.credits_monthly === -1 ? 'Unlimited' : (planData?.credits_monthly || 100).toLocaleString()} credits/month
                  </li>
                  <li className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                    {planData?.api_keys_limit === -1 ? 'Unlimited' : (planData?.api_keys_limit || 2)} API keys
                  </li>
                </ul>

                {/* Included Tools */}
                {planData?.features && typeof planData.features === 'object' && (
                  <div>
                    <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Included Tools</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(planData.features as Record<string, boolean | string>)
                        .filter(([key, value]) => toolConfig[key] && (value === true || typeof value === 'string'))
                        .map(([key, value]) => {
                          const tool = toolConfig[key];
                          const ToolIcon = tool.icon;
                          return (
                            <li key={key} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                              <ToolIcon className="w-4 h-4 text-primary-500" aria-hidden="true" />
                              {typeof value === 'string' ? `${tool.name} (${value})` : tool.name}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}

                {/* Other features */}
                {planData?.features && typeof planData.features === 'object' && (
                  (() => {
                    const otherFeatures = Object.entries(planData.features as Record<string, boolean | string>)
                      .filter(([key, value]) => !toolConfig[key] && (value === true || typeof value === 'string'))
                      .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

                    return otherFeatures.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Additional Features</p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {otherFeatures.map(feature => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                              <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">Password</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Change your password</p>
              </div>
              <Button variant="outline" onClick={handleOpenPasswordDialog}>Change Password</Button>
            </div>
            <div className={`flex items-center justify-between p-4 border-2 rounded-lg ${
              twoFAEnabled
                ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20'
                : 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  twoFAEnabled
                    ? 'bg-green-100 dark:bg-green-900/50'
                    : 'bg-primary-100 dark:bg-primary-900/50'
                }`}>
                  <ShieldCheck className={`w-5 h-5 ${
                    twoFAEnabled
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-primary-600 dark:text-primary-400'
                  }`} aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">Two-Factor Authentication</p>
                    {twoFAEnabled ? (
                      <Badge variant="success" className="text-xs">
                        <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {twoFAEnabled
                      ? 'Your account is protected with two-factor authentication'
                      : 'Add an extra layer of security to protect your account'
                    }
                  </p>
                </div>
              </div>
              {twoFAEnabled ? (
                <Button
                  variant="outline"
                  onClick={handleDisable2FA}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  Disable 2FA
                </Button>
              ) : (
                <Button
                  onClick={handleOpen2FAModal}
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                >
                  <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                  Enable 2FA
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'product', label: 'Product updates', description: 'News about new features and improvements' },
                { id: 'usage', label: 'Usage alerts', description: 'Get notified when approaching credit limits' },
                { id: 'marketing', label: 'Marketing emails', description: 'Tips, best practices, and offers' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">{item.label}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'marketing'} />
                    <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-secondary-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 dark:after:border-secondary-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    <span className="sr-only">Toggle {item.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <p className="font-medium text-red-900 dark:text-red-300">Delete Account</p>
                <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            {passwordError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                disabled={passwordSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={passwordSaving}>
                {passwordSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FAModal} onOpenChange={handleClose2FAModal}>
        <DialogContent className="mx-4 max-w-md">
          {twoFAStep === 'intro' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  Enable Two-Factor Authentication
                </DialogTitle>
                <DialogDescription>
                  Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <Smartphone className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">
                      Authenticator App Required
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      You will need an authenticator app like Google Authenticator, Authy, or 1Password.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <Shield className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">
                      Backup Codes
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      We will provide backup codes in case you lose access to your authenticator app.
                    </p>
                  </div>
                </div>
              </div>
              {verificationError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {verificationError}
                </div>
              )}
              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setShow2FAModal(false)} disabled={enrolling}>
                  Cancel
                </Button>
                <Button onClick={handleStartEnrollment} disabled={enrolling}>
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Setting up...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {twoFAStep === 'qr' && (
            <>
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogDescription>
                  Scan this QR code with your authenticator app, or enter the secret key manually.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border border-secondary-200">
                    <QRCodeSVG
                      value={totpUri}
                      size={160}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Or enter this code manually:</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-md font-mono text-sm text-secondary-900 dark:text-secondary-100 tracking-wider break-all">
                      {totpSecret}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopySecret}
                      aria-label="Copy secret key"
                    >
                      {backupCodesCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setTwoFAStep('intro')}>
                  Back
                </Button>
                <Button onClick={() => setTwoFAStep('verify')}>
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}

          {twoFAStep === 'verify' && (
            <>
              <DialogHeader>
                <DialogTitle>Verify Setup</DialogTitle>
                <DialogDescription>
                  Enter the 6-digit code from your authenticator app to verify the setup.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                {verificationError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {verificationError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>
              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setTwoFAStep('qr')} disabled={verifying}>
                  Back
                </Button>
                <Button onClick={handleVerify2FA} disabled={verifying || verificationCode.length !== 6}>
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Enable'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {twoFAStep === 'success' && (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                </div>
                <DialogTitle className="text-center">2FA Enabled Successfully</DialogTitle>
                <DialogDescription className="text-center">
                  Your account is now protected with two-factor authentication.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">
                        Account Protected
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        You will now be asked for a verification code when signing in.
                      </p>
                    </div>
                  </div>
                </div>
                {totpSecret && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900 dark:text-amber-100 text-sm">
                          Save Your Secret Key
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                          If you lose access to your authenticator app, you can re-add it using this secret:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-2 py-1 bg-white dark:bg-secondary-900 rounded text-xs font-mono break-all">
                            {totpSecret}
                          </code>
                          <Button variant="ghost" size="sm" onClick={handleCopySecret} className="h-7 px-2">
                            {backupCodesCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={handleClose2FAModal} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
