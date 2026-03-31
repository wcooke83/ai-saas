import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Sparkles,
  Key,
  BarChart3,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Plug,
  Code,
  Bot,
} from 'lucide-react';
import { InfoTooltip } from '@/components/ui/tooltip';
import { H1 } from '@/components/ui/heading';
import { NewUserWelcome } from '@/components/dashboard/new-user-welcome';
import type { Database } from '@/types/database';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
type Usage = Database['public']['Tables']['usage']['Row'];
type Generation = Database['public']['Tables']['generations']['Row'];

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    subscriptionResult,
    usageResult,
    generationsResult,
    generationsCountResult,
    apiKeysResult,
    apiLogsResult,
    apiLogsCountResult,
    chatbotsCountResult,
  ] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('usage').select('*').eq('user_id', user.id).order('period_start', { ascending: false }).limit(1).single(),
    supabase.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('api_keys').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    // Also fetch recent API logs to show in Recent Activity if no generations exist
    supabase.from('api_logs').select('id, endpoint, status_code, tokens_input, tokens_output, tokens_total, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    // Get count for total generations (use api_logs if generations is empty)
    supabase.from('api_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('chatbots').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  // Fetch subscription plan details if user has a plan
  const subscription = subscriptionResult.data as Subscription | null;
  let subscriptionPlan: SubscriptionPlan | null = null;
  if (subscription?.plan) {
    const planResult = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('slug', subscription.plan)
      .single();
    subscriptionPlan = planResult.data as SubscriptionPlan | null;
  }

  // Calculate actual token usage from api_logs for this billing period
  const usage = usageResult.data as Usage | null;
  const periodStart = usage?.period_start;
  let totalTokensUsed = 0;

  if (periodStart) {
    const { data: tokenData } = await supabase
      .from('api_logs')
      .select('tokens_total')
      .eq('user_id', user.id)
      .gte('created_at', periodStart);

    if (tokenData && Array.isArray(tokenData)) {
      totalTokensUsed = tokenData.reduce((sum: number, log: { tokens_total: number | null }) => sum + (log.tokens_total || 0), 0);
    }
  }

  // Use api_logs for recent activity if generations is empty
  const generations = (generationsResult.data || []) as Generation[];
  const apiLogs = apiLogsResult.data || [];
  const totalGenerationsCount = generationsCountResult.count || 0;
  const totalApiLogsCount = apiLogsCountResult.count || 0;

  return {
    subscription,
    subscriptionPlan: subscriptionPlan as SubscriptionPlan | null,
    usage,
    recentGenerations: generations,
    recentApiLogs: apiLogs,
    totalGenerations: totalGenerationsCount > 0 ? totalGenerationsCount : totalApiLogsCount,
    apiKeysCount: apiKeysResult.count || 0,
    totalTokensUsed,
    chatbotCount: chatbotsCountResult.count ?? 0,
  };
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-secondary-200 rounded mb-2" />
        <div className="h-4 w-96 bg-secondary-100 rounded" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-20 bg-secondary-100 rounded mb-2" />
              <div className="h-8 w-16 bg-secondary-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-24 bg-secondary-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-secondary-200 rounded mb-2" />
              <div className="h-4 w-48 bg-secondary-100 rounded" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="h-10 w-24 bg-secondary-200 rounded" />
                <div className="h-10 w-24 bg-secondary-100 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return <DashboardSkeleton />;
  }

  const { subscription, subscriptionPlan, usage, recentGenerations, recentApiLogs, totalGenerations, apiKeysCount, totalTokensUsed, chatbotCount } = data;

  if (chatbotCount === 0) {
    return <NewUserWelcome />;
  }

  // Get credits limit from subscription plan, falling back to usage table, then default
  const creditsLimit = subscriptionPlan?.credits_monthly || usage?.credits_limit || 100;
  // Use actual token count from api_logs instead of credits_used counter
  const creditsUsed = totalTokensUsed;
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const creditPercentage = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  // Determine recent activity - use api_logs if no generations
  const hasGenerations = recentGenerations.length > 0;
  const recentActivity = hasGenerations ? recentGenerations : recentApiLogs;

  // Get plan display name from subscription_plans or format the slug
  const planDisplayName = subscriptionPlan?.name || (subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Free');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Dashboard</H1>
          <p className="text-secondary-600 dark:text-secondary-400">Here&apos;s what&apos;s happening with your chatbots.</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Current Plan</CardDescription>
              <CreditCard className="w-4 h-4 text-secondary-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">{planDisplayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/settings"
              className="text-sm text-primary-500 hover:text-primary-600 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Manage subscription
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1">
                Credits Remaining
                <InfoTooltip content="Credits remaining this billing period. Credits are used when your chatbot answers questions and processes knowledge sources." />
              </CardDescription>
              <Sparkles className="w-4 h-4 text-secondary-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">{creditsRemaining.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2 overflow-hidden"
              role="progressbar"
              aria-valuenow={creditsUsed}
              aria-valuemin={0}
              aria-valuemax={creditsLimit}
              aria-label="Credit usage"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  creditPercentage > 80 ? 'bg-red-500' : creditPercentage > 50 ? 'bg-yellow-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(creditPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              {creditsUsed.toLocaleString()} of {creditsLimit.toLocaleString()} used
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1">
                API Keys
                <InfoTooltip content="Number of active API keys. Use these to integrate VocUI into your own applications." />
              </CardDescription>
              <Key className="w-4 h-4 text-secondary-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">{apiKeysCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/api-keys"
              className="text-sm text-primary-500 hover:text-primary-600 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Manage keys
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1">
                Total Generations
                <InfoTooltip content="Total chatbot responses generated since your account was created." />
              </CardDescription>
              <TrendingUp className="w-4 h-4 text-secondary-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">{totalGenerations.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/usage"
              className="text-sm text-primary-500 hover:text-primary-600 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              View history
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Integrate on Your Website */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
              <Plug className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Add VocUI to Your Website
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Embed VocUI on your site with a simple code snippet, or integrate via REST API.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/chatbots">
                <Code className="w-4 h-4 mr-2" aria-hidden="true" />
                View Chatbots
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Quick Actions
            </CardTitle>
            <CardDescription>Quick links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/chatbots">
                  <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
                  Manage Chatbots
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/api-keys">
                  <Key className="w-4 h-4 mr-2" aria-hidden="true" />
                  API Keys
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Recent Activity
            </CardTitle>
            <CardDescription>Recent chatbot activity</CardDescription>
          </CardHeader>
          <CardContent>
            {hasGenerations ? (
              <ul className="space-y-2">
                {recentGenerations.map((gen) => (
                  <li
                    key={gen.id}
                    className="flex items-center justify-between py-2 border-b border-secondary-100 dark:border-secondary-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-secondary-100 dark:bg-secondary-800 rounded">
                        <FileText className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 capitalize">{gen.type}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          {gen.created_at ? new Date(gen.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        gen.status === 'completed' ? 'success' :
                        gen.status === 'failed' ? 'destructive' :
                        'warning'
                      }
                    >
                      {gen.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : recentApiLogs.length > 0 ? (
              <ul className="space-y-2">
                {recentApiLogs.map((log: { id: string; endpoint: string; status_code: number; tokens_total: number | null; created_at: string }) => {
                  // Extract tool type from endpoint
                  const toolMatch = log.endpoint.match(/\/api\/tools\/([^/]+)/);
                  const chatMatch = !toolMatch && log.endpoint.match(/\/api\/chat(?:bots)?(?:\/|$)/);
                  const toolType = toolMatch ? toolMatch[1]
                    : chatMatch ? 'chatbot'
                    : log.endpoint.split('/').filter(Boolean).pop() || 'api-request';
                  return (
                    <li
                      key={log.id}
                      className="flex items-center justify-between py-2 border-b border-secondary-100 dark:border-secondary-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-secondary-100 dark:bg-secondary-800 rounded">
                          {toolType === 'chatbot' ? (
                            <Bot className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 capitalize">
                            {toolType.replace(/-/g, ' ')}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            {new Date(log.created_at).toLocaleDateString()} • {(log.tokens_total || 0).toLocaleString()} tokens
                          </p>
                        </div>
                      </div>
                      <Badge variant={log.status_code < 400 ? 'success' : 'destructive'}>
                        {log.status_code < 400 ? 'completed' : 'failed'}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-secondary-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No activity yet</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-4">Create a chatbot to start seeing responses here</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/chatbots">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    Create Chatbot
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
