'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import {
  Users,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  Crown,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  metrics: {
    totalUsers: number;
    activeSubscriptions: number;
    totalTokensAllTime: number;
    totalTokensPeriod: number;
    apiCallsSuccess: number;
    apiCallsFailed: number;
    successRate: number;
  };
  topUsers: Array<{ userId: string; email: string; tokens: number }>;
  dailyUsage: Array<{ date: string; tokens: number }>;
  planDistribution: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('year');
  const router = useRouter();

  const loadData = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Failed to load analytics');
      }
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(period);
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">Failed to load analytics data</p>
      </div>
    );
  }

  const periodLabel = period === 'year' ? 'This Year' : period === 'quarter' ? 'This Quarter' : 'This Month';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">Analytics Dashboard</H1>
            <p className="text-secondary-600 dark:text-secondary-400">Business intelligence and usage metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            {(['month', 'quarter', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize',
                  period === p
                    ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => loadData(period)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Users</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.metrics.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Crown className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.metrics.activeSubscriptions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Tokens ({periodLabel})</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {(data.metrics.totalTokensPeriod / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500">
                  {(data.metrics.totalTokensAllTime / 1000000).toFixed(2)}M all time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Success Rate</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.metrics.successRate.toFixed(1)}%
                </p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500">
                  {data.metrics.apiCallsSuccess.toLocaleString()} / {(data.metrics.apiCallsSuccess + data.metrics.apiCallsFailed).toLocaleString()} calls
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>Active subscriptions by plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.planDistribution).map(([plan, count]) => {
              const total = Object.values(data.planDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">{plan}</Badge>
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {count} {count === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-secondary-100 dark:bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users by Token Usage</CardTitle>
          <CardDescription>Highest token consumers in {periodLabel.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topUsers.map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 border border-secondary-100 dark:border-secondary-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                    index === 0 ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" :
                    index === 1 ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" :
                    index === 2 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                    "bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {user.email}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {user.userId.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">
                    {user.tokens.toLocaleString()}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">tokens</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Token Usage</CardTitle>
          <CardDescription>Token consumption over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {data.dailyUsage.slice(-30).map((day, index) => {
              const maxTokens = Math.max(...data.dailyUsage.map(d => d.tokens));
              const height = maxTokens > 0 ? (day.tokens / maxTokens) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 bg-primary-500 rounded-t hover:bg-primary-600 transition-colors relative group"
                  style={{ height: `${height}%`, minHeight: day.tokens > 0 ? '4px' : '0' }}
                  title={`${day.date}: ${day.tokens.toLocaleString()} tokens`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-secondary-900 dark:bg-secondary-100 text-secondary-100 dark:text-secondary-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {new Date(day.date).toLocaleDateString()}<br />
                    {day.tokens.toLocaleString()} tokens
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs text-secondary-500 dark:text-secondary-400">
            <span>{data.dailyUsage[0]?.date ? new Date(data.dailyUsage[0].date).toLocaleDateString() : ''}</span>
            <span>{data.dailyUsage[data.dailyUsage.length - 1]?.date ? new Date(data.dailyUsage[data.dailyUsage.length - 1].date).toLocaleDateString() : ''}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
