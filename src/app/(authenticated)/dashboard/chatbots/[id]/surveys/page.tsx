'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ClipboardList,
  Star,
  MessageSquare,
  Download,
  Eye,
  Loader2,
  Calendar,
  Hash,
  TrendingUp,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { SortableTable, Column } from '@/components/ui/sortable-table';
import { SurveyDetailDialog } from '@/components/surveys/survey-detail-dialog';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import type { SurveyResponse, SurveyStats, Chatbot } from '@/lib/chatbots/types';

interface ChatbotSurveysPageProps {
  params: Promise<{ id: string }>;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isRating(value: unknown): value is number {
  return typeof value === 'number' && value >= 1 && value <= 5;
}

function findRatingValue(responses: Record<string, string | number | string[]>): number | null {
  for (const value of Object.values(responses)) {
    if (isRating(value)) {
      return value;
    }
  }
  return null;
}

function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatResponsesPreview(responses: Record<string, string | number | string[]>): string {
  const entries = Object.entries(responses);
  if (entries.length === 0) return 'No responses';

  const [key, value] = entries[0];
  const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
  return `${key}: ${truncateText(formattedValue, 40)}`;
}

// Simple bar chart component for rating distribution
function RatingDistributionChart({
  distribution,
}: {
  distribution: Record<number, number>;
}) {
  const maxValue = Math.max(...Object.values(distribution), 1);
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const count = distribution[rating] || 0;
        const percentage = (count / maxValue) * 100;

        return (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <div className="flex-1 h-6 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-secondary-600 dark:text-secondary-400 w-10 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatbotSurveysPage({ params }: ChatbotSurveysPageProps) {
  const { id: chatbotId } = use(params);

  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch chatbot info
        const chatbotRes = await fetch(`/api/chatbots/${chatbotId}`);
        if (chatbotRes.ok) {
          const chatbotData = await chatbotRes.json();
          setChatbot(chatbotData.data.chatbot);
        }

        // Calculate date range
        let dateFrom: string | undefined;
        const now = new Date();
        if (dateRange !== 'all') {
          const days = parseInt(dateRange);
          const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          dateFrom = fromDate.toISOString().split('T')[0];
        }

        // Build query params
        const queryParams = new URLSearchParams();
        queryParams.append('limit', '100');
        if (dateFrom) queryParams.append('dateFrom', dateFrom);

        // Fetch survey responses
        const responsesRes = await fetch(
          `/api/chatbots/${chatbotId}/surveys?${queryParams.toString()}`
        );

        if (!responsesRes.ok) {
          throw new Error('Failed to fetch survey responses');
        }

        const responsesData = await responsesRes.json();
        setResponses(responsesData.data.responses || []);
        setStats(responsesData.data.stats || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load survey data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [chatbotId, dateRange]);

  // Calculate recent stats
  const recentStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentResponses = responses.filter(
      (r) => new Date(r.created_at) > oneWeekAgo
    ).length;

    return {
      recentResponses,
    };
  }, [responses]);

  const handleExport = () => {
    if (responses.length === 0) return;

    setExporting(true);

    try {
      // Build CSV headers dynamically from all response keys
      const allKeys = new Set<string>();
      responses.forEach((r) => {
        Object.keys(r.responses || {}).forEach((key) => allKeys.add(key));
      });
      const headers = ['Date', 'Session ID', ...Array.from(allKeys)];

      // Build CSV rows
      const rows = responses.map((r) => {
        const baseRow = [
          new Date(r.created_at).toISOString(),
          r.session_id || '',
        ];
        const responseValues = Array.from(allKeys).map((key) => {
          const value = r.responses?.[key];
          if (Array.isArray(value)) return value.join('; ');
          return value !== undefined ? String(value) : '';
        });
        return [...baseRow, ...responseValues];
      });

      // Combine into CSV
      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-responses-${chatbotId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Survey responses exported successfully');
    } catch (err) {
      toast.error('Failed to export survey responses');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleRowClick = (response: SurveyResponse) => {
    setSelectedResponse(response);
    setDialogOpen(true);
  };

  // Table columns
  const columns: Column<SurveyResponse>[] = [
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
            {formatShortDate(item.created_at)}
          </span>
          <span className="text-xs text-secondary-500">{formatTimeAgo(item.created_at)}</span>
        </div>
      ),
    },
    {
      key: 'session_id',
      header: 'Session',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-secondary-400" />
          <span className="text-sm text-secondary-600 dark:text-secondary-400 font-mono">
            {item.session_id ? `${item.session_id.slice(0, 8)}...` : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: false,
      render: (item) => {
        const rating = findRatingValue(item.responses);
        if (rating === null) return <span className="text-secondary-400">-</span>;
        return (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              {rating}
            </span>
            <span className="text-xs text-secondary-400">/ 5</span>
          </div>
        );
      },
    },
    {
      key: 'responses',
      header: 'Responses',
      sortable: false,
      render: (item) => (
        <span className="text-sm text-secondary-600 dark:text-secondary-400 truncate max-w-xs">
          {formatResponsesPreview(item.responses)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={() => handleRowClick(item)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

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

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const hasSurveyConfig = chatbot?.post_chat_survey_config?.enabled;
  const hasResponses = responses.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ChatbotPageHeader
        chatbotId={chatbotId}
        title="Survey Results"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
              {(['7', '30', '90', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  }`}
                >
                  {range === 'all' ? 'All' : `${range}d`}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || !hasResponses}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export
            </Button>
          </div>
        }
      />

      {/* No Survey Config Warning */}
      {!hasSurveyConfig && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <ClipboardList className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">
                  Post-Chat Survey Not Enabled
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Enable and configure the post-chat survey in{' '}
                  <Link
                    href={`/dashboard/chatbots/${chatbotId}/settings`}
                    className="text-primary-600 hover:underline"
                  >
                    Settings
                  </Link>{' '}
                  to start collecting responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  Total Responses
                  <Tooltip content="Number of completed post-chat survey submissions from visitors.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats?.total_responses || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  Average Rating
                  <Tooltip content="Mean star rating (1-5) across all survey responses that include a rating question.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats?.avg_rating?.toFixed(1) || 'N/A'}
                </p>
                {stats?.rating_count ? (
                  <p className="text-xs text-secondary-500">
                    {stats.rating_count} rating
                    {stats.rating_count !== 1 ? 's' : ''}
                  </p>
                ) : null}
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
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  Recent (7 days)
                  <Tooltip content="Survey responses received in the last 7 days, regardless of the date filter above.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {recentStats.recentResponses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  Survey Status
                  <Tooltip content="Whether the post-chat survey is currently enabled in your chatbot settings.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                  {hasSurveyConfig ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300">
                      Disabled
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      {stats?.rating_count && stats.rating_count > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Rating Distribution
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              Breakdown of ratings across all responses
              <Tooltip content="Shows how many visitors gave each star rating. Taller bars indicate more common ratings.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingDistributionChart distribution={stats.rating_distribution} />
          </CardContent>
        </Card>
      ) : null}

      {/* Responses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
          <CardDescription>
            {hasResponses
              ? `${responses.length} response${responses.length !== 1 ? 's' : ''} collected`
              : 'No survey responses yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasResponses ? (
            <SortableTable
              data={responses}
              columns={columns}
              keyExtractor={(item) => item.id}
              defaultSortKey="created_at"
              defaultSortDirection="desc"
              searchable
              searchPlaceholder="Search responses..."
              paginated
              defaultPageSize={25}
              emptyMessage="No survey responses found"
              onRowClick={handleRowClick}
            />
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-full inline-block mb-4">
                <ClipboardList className="w-8 h-8 text-secondary-400" />
              </div>
              {hasSurveyConfig ? (
                <p className="text-secondary-600 dark:text-secondary-400">
                  No survey responses yet. Responses will appear here after visitors complete conversations.
                </p>
              ) : (
                <>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                    No survey responses yet. Enable the post-chat survey in Settings to start collecting feedback.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/chatbots/${chatbotId}/settings`}>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Go to Settings
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Survey Detail Dialog */}
      <SurveyDetailDialog
        response={selectedResponse}
        chatbotId={chatbotId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
