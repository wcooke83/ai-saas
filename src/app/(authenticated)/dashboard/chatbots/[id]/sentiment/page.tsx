'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Download,
  Loader2,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  SmilePlus,
  Meh,
  Frown,
  BarChart3,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import type { Chatbot } from '@/lib/chatbots/types';

interface SentimentPageProps {
  params: Promise<{ id: string }>;
}

interface SentimentItem {
  id: string;
  session_id: string;
  visitor_id: string | null;
  message_count: number;
  sentiment_score: number;
  sentiment_label: string;
  sentiment_summary: string;
  sentiment_analyzed_at: string;
  created_at: string;
  loyalty: {
    loyalty_score: number;
    loyalty_trend: string;
    total_sessions: number;
    avg_sentiment: number;
  } | null;
}

interface SentimentStats {
  total_analyzed: number;
  avg_score: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateId(id: string | null, len = 12): string {
  if (!id) return '—';
  return id.length > len ? id.substring(0, len) + '...' : id;
}

function SentimentBadge({ label, score }: { label: string; score: number }) {
  const config: Record<string, { variant: string; icon: React.ReactNode; text: string }> = {
    very_positive: { variant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', icon: <SmilePlus className="w-3 h-3" />, text: 'Very Positive' },
    positive: { variant: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: <SmilePlus className="w-3 h-3" />, text: 'Positive' },
    neutral: { variant: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: <Meh className="w-3 h-3" />, text: 'Neutral' },
    negative: { variant: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', icon: <Frown className="w-3 h-3" />, text: 'Negative' },
    very_negative: { variant: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', icon: <Frown className="w-3 h-3" />, text: 'Very Negative' },
  };

  const c = config[label] || config.neutral;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.variant}`}>
      {c.icon}
      {c.text} ({score})
    </span>
  );
}

function LoyaltyTrendBadge({ trend }: { trend: string }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="w-3 h-3" /> Improving
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
        <TrendingDown className="w-3 h-3" /> Declining
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 4 ? 'bg-emerald-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">{score.toFixed(1)}</span>
    </div>
  );
}

export default function SentimentPage({ params }: SentimentPageProps) {
  const { id } = use(params);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [items, setItems] = useState<SentimentItem[]>([]);
  const [stats, setStats] = useState<SentimentStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [unanalyzedCount, setUnanalyzedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const [chatbotRes, sentimentRes, unanalyzedRes] = await Promise.all([
        fetch(`/api/chatbots/${id}`),
        fetch(`/api/chatbots/${id}/sentiment?page=${pageNum}&limit=20`),
        fetch(`/api/chatbots/${id}/sentiment/analyze`),
      ]);

      if (!chatbotRes.ok) throw new Error('Failed to fetch chatbot');
      const chatbotData = await chatbotRes.json();
      setChatbot(chatbotData.data.chatbot);

      if (sentimentRes.ok) {
        const sentimentData = await sentimentRes.json();
        setItems(sentimentData.data.items);
        setStats(sentimentData.data.stats);
        setPagination(sentimentData.data.pagination);
      }

      if (unanalyzedRes.ok) {
        const unanalyzedData = await unanalyzedRes.json();
        setUnanalyzedCount(unanalyzedData.data.unanalyzed_count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/sentiment/analyze`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Analyzed ${data.data.processed} conversation${data.data.processed !== 1 ? 's' : ''}${data.data.failed > 0 ? ` (${data.data.failed} failed)` : ''}`);
        // Refresh data
        await fetchData(page);
      } else {
        toast.error(data.error?.message || 'Analysis failed');
      }
    } catch {
      toast.error('Failed to run analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}/sentiment/export`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentiment-loyalty-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading && !chatbot) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <ChatbotPageHeader
        chatbotId={id}
        title="Sentiment & Loyalty"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              onClick={handleAnalyze}
              disabled={analyzing || unanalyzedCount === 0}
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {analyzing
                ? 'Analyzing...'
                : unanalyzedCount > 0
                  ? `Analyze ${unanalyzedCount} Session${unanalyzedCount !== 1 ? 's' : ''}`
                  : 'All Analyzed'}
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={!stats || stats.total_analyzed === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      {stats && stats.total_analyzed > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                    Avg. Sentiment
                    <Tooltip content="Average sentiment score from 1 (very negative) to 5 (very positive), calculated by AI analysis of each conversation.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {stats.avg_score.toFixed(1)}<span className="text-sm font-normal text-secondary-400"> / 5</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <SmilePlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                    Positive
                    <Tooltip content="Percentage of conversations rated as positive or very positive sentiment.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {stats.positive_pct}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Meh className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                    Neutral
                    <Tooltip content="Percentage of conversations with neither clearly positive nor negative sentiment.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {stats.neutral_pct}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <Frown className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                    Negative
                    <Tooltip content="Percentage of conversations rated as negative or very negative sentiment.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {stats.negative_pct}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {(!stats || stats.total_analyzed === 0) && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                No Sentiment Data Yet
              </h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-2 max-w-md mx-auto">
                {unanalyzedCount > 0
                  ? `You have ${unanalyzedCount} conversation${unanalyzedCount !== 1 ? 's' : ''} ready to analyze. Click the button above to process them.`
                  : 'Sentiment data will appear here once your chatbot has conversations with at least 2 messages.'}
              </p>
              <p className="text-sm text-secondary-400 dark:text-secondary-500 mb-6 max-w-md mx-auto">
                Conversations must be completed before they can be analyzed for sentiment.
              </p>
              {unanalyzedCount > 0 && (
                <Button onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  {analyzing ? 'Analyzing...' : 'Analyze Now'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation Sentiment</CardTitle>
            <CardDescription>
              {stats?.total_analyzed || 0} analyzed conversation{(stats?.total_analyzed || 0) !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700">
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">Date</th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">Visitor</th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">Messages</th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">
                      <span className="flex items-center gap-1">
                        Sentiment
                        <Tooltip content="AI-analyzed sentiment score (1-5) and label for each conversation." side="bottom">
                          <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">
                      <span className="flex items-center gap-1">
                        Loyalty
                        <Tooltip content="Loyalty score (1-5) based on repeat visits and overall satisfaction across sessions." side="bottom">
                          <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">
                      <span className="flex items-center gap-1">
                        Trend
                        <Tooltip content="Visitor's sentiment direction over time: improving, declining, or stable." side="bottom">
                          <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </th>
                    <th className="text-left py-3 px-3 font-medium text-secondary-500 dark:text-secondary-400">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
                    >
                      <td className="py-3 px-3 text-secondary-700 dark:text-secondary-300 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 px-3">
                        <code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">
                          {truncateId(item.visitor_id)}
                        </code>
                      </td>
                      <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400">
                        {item.message_count}
                      </td>
                      <td className="py-3 px-3">
                        <SentimentBadge label={item.sentiment_label} score={item.sentiment_score} />
                      </td>
                      <td className="py-3 px-3">
                        {item.loyalty ? (
                          <ScoreBar score={item.loyalty.loyalty_score} />
                        ) : (
                          <span className="text-xs text-secondary-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {item.loyalty ? (
                          <LoyaltyTrendBadge trend={item.loyalty.loyalty_trend} />
                        ) : (
                          <span className="text-xs text-secondary-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400 max-w-xs truncate">
                        {item.sentiment_summary || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.total_pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
