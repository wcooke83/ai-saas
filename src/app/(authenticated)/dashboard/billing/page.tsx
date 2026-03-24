'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  ExternalLink,
  Loader2,
  Check,
  Crown,
  Zap,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  Download,
  FileText,
  Clock,
  Receipt,
} from 'lucide-react';
import type { Database } from '@/types/database';
import AutoTopupSettings from '@/components/dashboard/AutoTopupSettings';
import CreditPurchase from '@/components/dashboard/CreditPurchase';
import LicenseKeyRedemption from '@/components/dashboard/LicenseKeyRedemption';
import { H1 } from '@/components/ui/heading';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: string | null;
  created: string;
  periodStart: string | null;
  periodEnd: string | null;
  pdfUrl: string | null;
  hostedUrl: string | null;
}

interface UpcomingInvoice {
  amount: number;
  currency: string;
  periodStart: string | null;
  periodEnd: string | null;
  lineItems: { description: string | null; amount: number; quantity: number | null }[];
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [gracePeriodEndsAt, setGracePeriodEndsAt] = useState<string | null>(null);
  const [planPrice, setPlanPrice] = useState<number>(0);
  const [planName, setPlanName] = useState<string>('Base');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [upcomingInvoice, setUpcomingInvoice] = useState<UpcomingInvoice | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purchaseSource, setPurchaseSource] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const loadBillingData = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/billing');
      const result = await response.json();

      if (!response.ok) {
        console.error('Billing API error:', response.status, result);
        return;
      }

      const data = result.data || result;
      setInvoices(data.invoices || []);
      setUpcomingInvoice(data.upcomingInvoice || null);
      setPaymentMethods(data.paymentMethods || []);
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setBillingLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData);
        // grace_period_ends_at will be added in future migration
        setGracePeriodEndsAt(null);

        setPurchaseSource((subscriptionData as any).purchase_source || 'stripe');
        const subPlan = (subscriptionData as any).plan as string || 'base';
        const { data: planData } = await supabase
          .from('subscription_plans')
          .select('name, price_monthly_cents')
          .eq('slug', subPlan)
          .maybeSingle();

        if (planData) {
          setPlanPrice((planData as any).price_monthly_cents / 100);
          setPlanName((planData as any).name);
        } else {
          setPlanName(subPlan.charAt(0).toUpperCase() + subPlan.slice(1));
        }
      }

      setLoading(false);
    }

    loadData();
    loadBillingData();
  }, [router, supabase, loadBillingData]);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to open billing portal');
      }

      const result = await response.json();
      const url = result.data?.url || result.url;
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'trialing':
        return <Badge variant="warning">Trial</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'open':
        return <Badge variant="warning">Open</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'uncollectible':
        return <Badge variant="destructive">Uncollectible</Badge>;
      case 'void':
        return <Badge variant="secondary">Void</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCardBrandIcon = (brand: string) => {
    const brandNames: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'Amex',
      discover: 'Discover',
      diners: 'Diners',
      jcb: 'JCB',
      unionpay: 'UnionPay',
    };
    return brandNames[brand] || brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="h-32 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-32 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="h-48 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const planStyles: Record<string, { icon: typeof User; color: string }> = {
    base: { icon: User, color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' },
    pro: { icon: Zap, color: 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' },
    enterprise: { icon: Crown, color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' },
    lifetime_tier1: { icon: Crown, color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' },
    lifetime_tier2: { icon: Crown, color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' },
    lifetime_tier3: { icon: Crown, color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' },
  };

  const isLifetimePlan = subscription?.plan?.startsWith('lifetime_');
  const currentStyle = planStyles[subscription?.plan || 'base'] || planStyles.base;
  const PlanIcon = currentStyle.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Billing</H1>
          <p className="text-secondary-600 dark:text-secondary-400">Manage your subscription, payment methods, and invoices</p>
        </div>
      </div>

      {/* Past Due Warning */}
      {subscription?.status === 'past_due' && (
        <Card className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Payment Overdue
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {gracePeriodEndsAt && new Date(gracePeriodEndsAt) > new Date()
                    ? `Your last payment failed. Please update your payment method before ${new Date(gracePeriodEndsAt).toLocaleDateString()} to avoid service interruption.`
                    : 'Your payment is overdue and the grace period has expired. Your account features are restricted until payment is resolved.'}
                </p>
                <div className="mt-3">
                  <Button variant="destructive" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
                    {portalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Update Payment Method
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Current Plan
            </CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${currentStyle.color}`}>
                  <PlanIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {planName} Plan
                    </h3>
                    {getSubscriptionStatusBadge(subscription?.status || 'active')}
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                    {isLifetimePlan ? (
                      <>
                        Lifetime
                        <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400 ml-1">plan</span>
                      </>
                    ) : (
                      <>
                        ${planPrice}
                        <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400">/month</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {isLifetimePlan ? (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/upgrade">View Plans</Link>
                  </Button>
                ) : subscription?.plan === 'base' ? (
                  <Button asChild>
                    <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/upgrade">Change Plan</Link>
                    </Button>
                    <Button variant="outline" onClick={handleManageSubscription}>
                      Manage Subscription
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isLifetimePlan ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Lifetime access — no recurring billing. Credits reset monthly.</span>
              </div>
            ) : subscription?.current_period_end && (
              <div className="mt-4 flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {subscription.cancel_at_period_end ? (
                  <span>Your plan will be canceled on {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                ) : (
                  <span>Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Payment Method
            </CardTitle>
            <CardDescription>Your card on file</CardDescription>
          </CardHeader>
          <CardContent>
            {billingLoading ? (
              <div className="space-y-3">
                <div className="h-16 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-secondary-700 rounded-md border border-secondary-200 dark:border-secondary-600">
                        <CreditCard className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {getCardBrandIcon(pm.brand)} •••• {pm.last4}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          Expires {pm.expMonth}/{pm.expYear}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleManageSubscription} disabled={portalLoading}>
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage in Stripe
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <CreditCard className="w-8 h-8 text-secondary-300 dark:text-secondary-600 mx-auto mb-2" />
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">No payment method on file</p>
                <Button size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  Add Payment Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Invoice */}
      {upcomingInvoice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Upcoming Invoice
            </CardTitle>
            <CardDescription>
              Next payment due {upcomingInvoice.periodEnd ? formatDate(upcomingInvoice.periodEnd) : 'soon'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Amount due</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {formatCurrency(upcomingInvoice.amount, upcomingInvoice.currency)}
                </p>
                {upcomingInvoice.periodStart && upcomingInvoice.periodEnd && (
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    Billing period: {formatDate(upcomingInvoice.periodStart)} – {formatDate(upcomingInvoice.periodEnd)}
                  </p>
                )}
              </div>
              {upcomingInvoice.lineItems.length > 0 && (
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {upcomingInvoice.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between gap-4">
                      <span>{item.description || 'Subscription'}</span>
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">
                        {formatCurrency(item.amount, upcomingInvoice.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Invoice History
              </CardTitle>
              <CardDescription>Your past invoices and payment records</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
              {portalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Full History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {billingLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              ))}
            </div>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700">
                    <th className="text-left py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Invoice</th>
                    <th className="text-left py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Period</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Amount</th>
                    <th className="text-center py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-secondary-400" />
                          <span className="text-secondary-900 dark:text-secondary-100 font-medium">
                            {invoice.number || invoice.id.slice(0, 12)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-secondary-600 dark:text-secondary-400">
                        {formatDate(invoice.created)}
                      </td>
                      <td className="py-3 px-2 text-secondary-600 dark:text-secondary-400">
                        {invoice.periodStart && invoice.periodEnd
                          ? `${formatDate(invoice.periodStart)} – ${formatDate(invoice.periodEnd)}`
                          : '—'}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-secondary-900 dark:text-secondary-100">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {getInvoiceStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {invoice.hostedUrl && (
                            <a
                              href={invoice.hostedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
                              title="View invoice"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {invoice.pdfUrl && (
                            <a
                              href={invoice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="w-10 h-10 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
              <p className="text-secondary-500 dark:text-secondary-400">No invoices yet</p>
              <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                Invoices will appear here once you have an active subscription
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* License Key Redemption */}
      <LicenseKeyRedemption
        purchaseSource={purchaseSource}
        currentPlanSlug={subscription?.plan}
        onRedeemed={() => window.location.reload()}
      />

      {/* Credit Purchase */}
      <CreditPurchase purchaseSource={purchaseSource} />

      {/* Auto Top-up Settings */}
      <AutoTopupSettings purchaseSource={purchaseSource} />

      {/* Upgrade CTA */}
      <Card>
        <CardHeader>
          <CardTitle>Need More?</CardTitle>
          <CardDescription>Upgrade your plan for more credits and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">More Credits</span>
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Generate more content with higher credit limits</p>
            </div>
            <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Priority Support</span>
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Get faster responses from our support team</p>
            </div>
            <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Advanced Features</span>
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Access premium tools and export options</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button asChild>
              <Link href="/dashboard/upgrade">
                View All Plans
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
