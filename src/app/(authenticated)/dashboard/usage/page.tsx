'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { UserLogEntry, type UserAPILog } from '@/components/dashboard/UserLogEntry';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  ArrowUpRight,
  Filter,
  Zap,
  ScrollText,
  RefreshCw,
  Activity,
  Download,
  Shield,
  Info,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type Usage = Database['public']['Tables']['usage']['Row'];
type Generation = Database['public']['Tables']['generations']['Row'];
type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

interface CreditAdjustment {
  id: string;
  amount: number;
  reason: string;
  effective_at: string;
  created_at: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function UsagePage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [apiLogs, setApiLogs] = useState<UserAPILog[]>([]);
  const [creditAdjustments, setCreditAdjustments] = useState<CreditAdjustment[]>([]);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all'>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'errors'>('all');
  const [activeTab, setActiveTab] = useState<'generations' | 'logs'>('generations');
  const [chartPeriod, setChartPeriod] = useState<'7d' | '14d' | '30d'>('14d');
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [lastMonthTokens, setLastMonthTokens] = useState(0);

  const router = useRouter();
  const supabase = createClient() as any;

  const loadData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const [usageResult, generationsResult, logsResult, subscriptionResult, adjustmentsResult] = await Promise.all([
      supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('api_logs')
        .select('id, endpoint, status_code, provider, model, tokens_input, tokens_output, tokens_billed, duration_ms, error_message, request_body, response_body, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('credit_adjustments')
        .select('id, amount, reason, effective_at, created_at')
        .eq('user_id', user.id)
        .order('effective_at', { ascending: false })
        .limit(50),
    ]);

    if (usageResult.data) {
      setUsage(usageResult.data);
    }

    if (generationsResult.data) {
      setGenerations(generationsResult.data);
    }

    if (logsResult.data) {
      setApiLogs(logsResult.data);
    }

    if (adjustmentsResult.data) {
      setCreditAdjustments(adjustmentsResult.data);
    }

    // Get subscription plan details
    if (subscriptionResult.data?.plan) {
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('slug', subscriptionResult.data.plan)
        .single();
      if (planData) {
        setSubscriptionPlan(planData);
      }
    }

    // Calculate total tokens used from api_logs for this billing period
    const periodStart = usageResult.data?.period_start;
    const periodEnd = usageResult.data?.period_end;
    if (periodStart) {
      const { data: tokenData } = await supabase
        .from('api_logs')
        .select('tokens_total')
        .eq('user_id', user.id)
        .gte('created_at', periodStart);

      if (tokenData) {
        const total = tokenData.reduce((sum: number, log: { tokens_total: number | null }) => sum + (log.tokens_total || 0), 0);
        setTotalTokensUsed(total);
      }
    }

    // Calculate last month's tokens for comparison
    if (periodStart) {
      const lastMonthStart = new Date(periodStart);
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      const lastMonthEnd = new Date(periodStart);

      const { data: lastMonthData } = await supabase
        .from('api_logs')
        .select('tokens_total')
        .eq('user_id', user.id)
        .gte('created_at', lastMonthStart.toISOString())
        .lt('created_at', lastMonthEnd.toISOString());

      if (lastMonthData) {
        const lastTotal = lastMonthData.reduce((sum: number, log: { tokens_total: number | null }) => sum + (log.tokens_total || 0), 0);
        setLastMonthTokens(lastTotal);
      }
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/usage/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usage-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  // Compute chart data from generations
  const chartData = useMemo(() => {
    const days = chartPeriod === '7d' ? 7 : chartPeriod === '14d' ? 14 : 30;
    const aggregated: Record<string, { tokens: number; inputTokens: number; outputTokens: number }> = {};

    generations.forEach((gen) => {
      if (!gen.created_at) return;
      const date = new Date(gen.created_at).toISOString().split('T')[0];
      if (!aggregated[date]) {
        aggregated[date] = { tokens: 0, inputTokens: 0, outputTokens: 0 };
      }
      aggregated[date].tokens += (gen.tokens_input ?? 0) + (gen.tokens_output ?? 0);
      aggregated[date].inputTokens += gen.tokens_input ?? 0;
      aggregated[date].outputTokens += gen.tokens_output ?? 0;
    });

    // Also include API logs tokens
    apiLogs.forEach((log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      if (!aggregated[date]) {
        aggregated[date] = { tokens: 0, inputTokens: 0, outputTokens: 0 };
      }
      aggregated[date].tokens += (log.tokens_input ?? 0) + (log.tokens_output ?? 0);
      aggregated[date].inputTokens += log.tokens_input ?? 0;
      aggregated[date].outputTokens += log.tokens_output ?? 0;
    });

    return Object.entries(aggregated)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }, [generations, apiLogs, chartPeriod]);

  const filteredGenerations = generations.filter((gen) => {
    if (filter === 'all') return true;
    return gen.type === filter;
  });

  const filteredLogs = apiLogs.filter((log) => {
    if (logFilter === 'errors') return log.status_code >= 400;
    return true;
  });

  const toggleLogExpanded = (id: string) => {
    setExpandedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Use api_logs count if generations table is empty
  const totalGenerationsCount = generations.length > 0 ? generations.length : apiLogs.length;

  const stats = {
    totalGenerations: totalGenerationsCount,
    apiCalls: apiLogs.length,
    avgDuration: apiLogs.length > 0
      ? Math.round(apiLogs.reduce((sum, l) => sum + (l.duration_ms || 0), 0) / apiLogs.length)
      : 0,
    successRate: generations.length > 0
      ? Math.round((generations.filter((g) => g.status === 'completed').length / generations.length) * 100)
      : apiLogs.length > 0
      ? Math.round((apiLogs.filter((l) => l.status_code < 400).length / apiLogs.length) * 100)
      : 0,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="h-[280px] bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-100 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get credits limit from subscription plan, falling back to usage table, then default
  const creditsLimit = subscriptionPlan?.credits_monthly || usage?.credits_limit || 100;
  // Use actual token count from api_logs instead of credits_used counter
  const creditsUsed = totalTokensUsed;
  const creditPercentage = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  // Calculate month-over-month change
  const monthOverMonthChange = lastMonthTokens > 0 
    ? ((creditsUsed - lastMonthTokens) / lastMonthTokens) * 100 
    : creditsUsed > 0 ? 100 : 0;
  const isIncreasing = monthOverMonthChange > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">Usage & History</H1>
            <p className="text-secondary-600 dark:text-secondary-400">Track your AI generations and credit usage</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={exporting}
          >
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard/upgrade">
              <ArrowUpRight className="w-4 h-4 mr-2" aria-hidden="true" />
              Upgrade Plan
            </a>
          </Button>
        </div>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Token Usage</CardTitle>
                <CardDescription>Daily token consumption over time</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
              {(['7d', '14d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    chartPeriod === period
                      ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UsageChart data={chartData} period={chartPeriod} />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  Tokens Used
                  <Tooltip content="Total tokens processed by AI models. Tokens are units of text — roughly 1 token per word. Credit usage is based on tokens.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {creditsUsed.toLocaleString()}
                  <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400">
                    /{creditsLimit.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div
                className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2"
                role="progressbar"
                aria-valuenow={creditsUsed}
                aria-valuemin={0}
                aria-valuemax={creditsLimit}
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    creditPercentage > 80 ? 'bg-red-500' :
                    creditPercentage > 50 ? 'bg-yellow-500' :
                    'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                isIncreasing 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : monthOverMonthChange < 0 
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {isIncreasing ? (
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                ) : monthOverMonthChange < 0 ? (
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">vs Last Month</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
                </p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                  {lastMonthTokens.toLocaleString()} tokens
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Generations</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.totalGenerations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ScrollText className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  API Calls
                  <Tooltip content="Total API calls made using your API keys. Does not include widget chat traffic.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.apiCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Avg Response</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.avgDuration > 0 ? `${(stats.avgDuration / 1000).toFixed(1)}s` : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Period */}
      {usage && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Current Billing Period</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {usage.period_start ? new Date(usage.period_start).toLocaleDateString() : 'N/A'} - {usage.period_end ? new Date(usage.period_end).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Resets in</p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {usage.period_end ? Math.max(0, Math.ceil((new Date(usage.period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Content: Generation History & API Logs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'generations'}
                onClick={() => setActiveTab('generations')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'generations'
                    ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                )}
              >
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                Generation History
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'logs'
                    ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                )}
              >
                <ScrollText className="w-4 h-4" aria-hidden="true" />
                API Logs
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {activeTab === 'generations' ? (
                <>
                  <Filter className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">All Types</span>
                </>
              ) : (
                <>
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value as typeof logFilter)}
                    className="text-sm border border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    aria-label="Filter logs"
                  >
                    <option value="all">All Requests</option>
                    <option value="errors">Errors Only</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadData(true)}
                    disabled={refreshing}
                    className="gap-2"
                  >
                    <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} aria-hidden="true" />
                    Refresh
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Generation History Tab */}
          {activeTab === 'generations' && (
            <div role="tabpanel">
              {filteredGenerations.length > 0 ? (
                <div className="space-y-3">
                  {filteredGenerations.map((gen) => (
                    <div
                      key={gen.id}
                      className="flex items-center justify-between p-4 border border-secondary-100 dark:border-secondary-800 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100 capitalize">{gen.type} Generation</p>
                          <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              {gen.created_at ? formatRelativeTime(gen.created_at) : 'Unknown'}
                            </span>
                            {gen.duration_ms && (
                              <span>{(gen.duration_ms / 1000).toFixed(1)}s</span>
                            )}
                            <span>{((gen.tokens_input ?? 0) + (gen.tokens_output ?? 0)).toLocaleString()} tokens</span>
                          </div>
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
                    </div>
                  ))}
                </div>
              ) : apiLogs.length > 0 ? (
                // Show api_logs as generation history when generations table is empty
                <div className="space-y-3">
                  {apiLogs.map((log) => {
                    // Extract tool type from endpoint
                    let toolType = 'api';
                    let displayType = 'Api';
                    
                    if (log.endpoint.includes('/api/chat/')) {
                      toolType = 'chat';
                      displayType = 'Chat Message';
                    } else {
                      const toolMatch = log.endpoint.match(/\/api\/tools\/([^/]+)/);
                      if (toolMatch) {
                        toolType = toolMatch[1];
                        displayType = toolType.replace(/-/g, ' ');
                      }
                    }
                    
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-4 border border-secondary-100 dark:border-secondary-800 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            toolType === 'chat' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {toolType === 'chat' ? (
                              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                            ) : (
                              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-secondary-100">{displayType}</p>
                            <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                {formatRelativeTime(log.created_at)}
                              </span>
                              {log.duration_ms && (
                                <span>{(log.duration_ms / 1000).toFixed(1)}s</span>
                              )}
                              <span>{((log.tokens_input ?? 0) + (log.tokens_output ?? 0)).toLocaleString()} tokens</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={log.status_code < 400 ? 'success' : 'destructive'}>
                          {log.status_code < 400 ? 'completed' : 'failed'}
                        </Badge>
                      </div>
                    );
                  })}
                  {/* Credit adjustments in generation history */}
                  {creditAdjustments.map((adj) => (
                    <div
                      key={`adj-${adj.id}`}
                      className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800/50 rounded-lg bg-amber-50/50 dark:bg-amber-900/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            Admin Adjustment
                          </p>
                          <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              {formatRelativeTime(adj.effective_at)}
                            </span>
                            <span className={adj.amount > 0 ? 'text-red-500' : 'text-green-500'}>
                              {adj.amount > 0 ? '+' : ''}{adj.amount.toLocaleString()} tokens
                            </span>
                          </div>
                          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{adj.reason}</p>
                        </div>
                      </div>
                      <Badge variant="warning">manual</Badge>
                    </div>
                  ))}
                </div>
              ) : creditAdjustments.length > 0 ? (
                <div className="space-y-3">
                  {creditAdjustments.map((adj) => (
                    <div
                      key={`adj-${adj.id}`}
                      className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-800/50 rounded-lg bg-amber-50/50 dark:bg-amber-900/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            Admin Adjustment
                          </p>
                          <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              {formatRelativeTime(adj.effective_at)}
                            </span>
                            <span className={adj.amount > 0 ? 'text-red-500' : 'text-green-500'}>
                              {adj.amount > 0 ? '+' : ''}{adj.amount.toLocaleString()} tokens
                            </span>
                          </div>
                          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{adj.reason}</p>
                        </div>
                      </div>
                      <Badge variant="warning">manual</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-secondary-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No generations yet</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">Start using VocUI to see your history</p>
                  <Button asChild>
                    <a href="/dashboard/chatbots">
                      <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                      Create a Chatbot
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* API Logs Tab */}
          {activeTab === 'logs' && (
            <div role="tabpanel">
              {(filteredLogs.length > 0 || creditAdjustments.length > 0) ? (
                <div className="space-y-2">
                  {filteredLogs.map((log) => (
                    <UserLogEntry
                      key={log.id}
                      log={log}
                      isExpanded={expandedLogIds.has(log.id)}
                      onToggle={() => toggleLogExpanded(log.id)}
                    />
                  ))}
                  {/* Credit adjustments in API logs */}
                  {creditAdjustments.map((adj) => (
                    <div
                      key={`adj-log-${adj.id}`}
                      className="p-3 border border-amber-200 dark:border-amber-800/50 rounded-lg bg-amber-50/50 dark:bg-amber-900/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
                            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                Admin Adjustment
                              </span>
                              <Badge variant="warning" className="text-xs">manual</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              <span>{new Date(adj.effective_at).toLocaleString()}</span>
                              <span className={adj.amount > 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                                {adj.amount > 0 ? '+' : ''}{adj.amount.toLocaleString()} tokens
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-2 ml-10">{adj.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                    <ScrollText className="w-6 h-6 text-secondary-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No API logs yet</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">API calls will appear here when you use the tools</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
