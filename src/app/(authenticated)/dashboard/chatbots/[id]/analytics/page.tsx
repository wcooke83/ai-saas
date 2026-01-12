'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Users,
  ThumbsUp,
  Download,
  Calendar,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Chatbot } from '@/lib/chatbots/types';

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

interface AnalyticsSummary {
  total_conversations: number;
  total_messages: number;
  unique_visitors: number;
  avg_messages_per_conversation: number;
  satisfaction_rate: number;
  daily_data: Array<{
    date: string;
    conversations: number;
    messages: number;
  }>;
}

// Simple bar chart component
function BarChart({ data, label }: { data: Array<{ date: string; value: number }>; label: string }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{label}</p>
      <div className="flex items-end gap-1 h-32">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? '4px' : '0',
              }}
              title={`${item.date}: ${item.value}`}
            />
            {i % 5 === 0 && (
              <span className="text-xs text-secondary-400 truncate w-full text-center">
                {new Date(item.date).getDate()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = use(params);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [chatbotRes, analyticsRes] = await Promise.all([
          fetch(`/api/chatbots/${id}`),
          fetch(`/api/chatbots/${id}/analytics?days=${dateRange}`),
        ]);

        if (!chatbotRes.ok) throw new Error('Failed to fetch chatbot');
        const chatbotData = await chatbotRes.json();
        setChatbot(chatbotData.data.chatbot);

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, dateRange]);

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/analytics/export?days=${dateRange}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-analytics-${id}-${dateRange}days.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error || 'Chatbot not found'}</p>
      </div>
    );
  }

  // Generate placeholder data if no analytics yet
  const defaultAnalytics: AnalyticsSummary = analytics || {
    total_conversations: 0,
    total_messages: 0,
    unique_visitors: 0,
    avg_messages_per_conversation: 0,
    satisfaction_rate: 0,
    daily_data: [],
  };

  // Fill in missing days
  const filledDailyData = [];
  const days = parseInt(dateRange);
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const existing = defaultAnalytics.daily_data.find((d) => d.date === dateStr);
    filledDailyData.push({
      date: dateStr,
      conversations: existing?.conversations || 0,
      messages: existing?.messages || 0,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/dashboard/chatbots/${id}`}
            className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Chatbot
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Analytics
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Track performance and engagement for {chatbot.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
            {(['7', '30', '90'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                }`}
              >
                {range}d
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Total Conversations
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {defaultAnalytics.total_conversations.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Total Messages
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {defaultAnalytics.total_messages.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Unique Visitors
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {defaultAnalytics.unique_visitors.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Satisfaction Rate
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {defaultAnalytics.satisfaction_rate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversations Over Time</CardTitle>
            <CardDescription>Daily conversation volume</CardDescription>
          </CardHeader>
          <CardContent>
            {filledDailyData.length > 0 ? (
              <BarChart
                data={filledDailyData.map((d) => ({ date: d.date, value: d.conversations }))}
                label={`Last ${dateRange} days`}
              />
            ) : (
              <div className="h-32 flex items-center justify-center text-secondary-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages Over Time</CardTitle>
            <CardDescription>Daily message volume</CardDescription>
          </CardHeader>
          <CardContent>
            {filledDailyData.length > 0 ? (
              <BarChart
                data={filledDailyData.map((d) => ({ date: d.date, value: d.messages }))}
                label={`Last ${dateRange} days`}
              />
            ) : (
              <div className="h-32 flex items-center justify-center text-secondary-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>Key metrics and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Avg. Messages/Conv</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {defaultAnalytics.avg_messages_per_conversation.toFixed(1)}
              </p>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Daily Average</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {days > 0
                  ? (defaultAnalytics.total_conversations / days).toFixed(1)
                  : '0'}{' '}
                <span className="text-sm font-normal text-secondary-500">convs/day</span>
              </p>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Message Growth</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Engagement Trend</span>
              </div>
              <Badge variant="success">Growing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
