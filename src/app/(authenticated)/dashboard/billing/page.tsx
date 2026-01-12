'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Crown,
  Zap,
  User,
  Calendar,
  DollarSign,
} from 'lucide-react';
import type { Database } from '@/types/database';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// Mock data for demo
const mockInvoices: Invoice[] = [
  { id: 'inv_001', date: '2024-12-01', amount: 29, status: 'paid', description: 'Pro Plan - December 2024' },
  { id: 'inv_002', date: '2024-11-01', amount: 29, status: 'paid', description: 'Pro Plan - November 2024' },
  { id: 'inv_003', date: '2024-10-01', amount: 29, status: 'paid', description: 'Pro Plan - October 2024' },
  { id: 'inv_004', date: '2024-09-01', amount: 29, status: 'paid', description: 'Pro Plan - September 2024' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_001', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025, isDefault: true },
];

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const router = useRouter();
  const supabase = createClient();

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
      }

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const handleManageSubscription = () => {
    // In a real app, redirect to Stripe Customer Portal
    window.open('https://billing.stripe.com/p/login/test', '_blank');
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const getCardIcon = (brand: string) => {
    // In production, use actual card brand icons
    return <CreditCard className="w-6 h-6" aria-hidden="true" />;
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
      </div>
    );
  }

  const planConfig = {
    free: { icon: User, color: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400', price: 0 },
    pro: { icon: Zap, color: 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400', price: 29 },
    enterprise: { icon: Crown, color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400', price: 99 },
  };

  const currentPlan = planConfig[subscription?.plan as keyof typeof planConfig] || planConfig.free;
  const PlanIcon = currentPlan.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Billing</h1>
        <p className="text-secondary-600 dark:text-secondary-400">Manage your subscription, payment methods, and invoices</p>
      </div>

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
                <div className={`p-3 rounded-lg ${currentPlan.color}`}>
                  <PlanIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 capitalize">
                      {subscription?.plan || 'Free'} Plan
                    </h3>
                    <Badge variant={subscription?.status === 'active' ? 'success' : 'secondary'}>
                      {subscription?.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                    ${currentPlan.price}
                    <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400">/month</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {subscription?.plan === 'free' ? (
                  <Button asChild>
                    <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleManageSubscription}>
                      Change Plan
                    </Button>
                    <Button variant="outline" onClick={handleManageSubscription}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {subscription?.current_period_end && (
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

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Payment Method
            </CardTitle>
            <CardDescription>Your default payment method</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getCardIcon(method.brand)}
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 capitalize">
                          {method.brand} ****{method.last4}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" aria-hidden="true" />
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">No payment method on file</p>
                <Button onClick={handleManageSubscription}>
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Billing History
              </CardTitle>
              <CardDescription>Your past invoices and payments</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription}>
              <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
              View All in Stripe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-secondary-900 dark:text-secondary-100">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {invoice.description}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Download invoice</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" aria-hidden="true" />
              <p className="text-secondary-600 dark:text-secondary-400">No invoices yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Summary */}
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
