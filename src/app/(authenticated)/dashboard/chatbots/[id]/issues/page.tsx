'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTable, Column } from '@/components/ui/sortable-table';
import { EscalationDetailDialog } from '@/components/escalations/escalation-detail-dialog';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import type { Escalation, EscalationStatus } from '@/lib/chatbots/types';

interface ChatbotIssuesPageProps {
  params: Promise<{ id: string }>;
}

interface IssueStats {
  total: number;
  open: number;
  acknowledged: number;
  resolved: number;
}

const REASON_LABELS: Record<string, string> = {
  wrong_answer: 'Wrong Answer',
  offensive_content: 'Offensive',
};

const REASON_COLORS: Record<string, string> = {
  wrong_answer: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  offensive_content: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const STATUS_COLORS: Record<EscalationStatus, string> = {
  open: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  acknowledged: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function ChatbotIssuesPage({ params }: ChatbotIssuesPageProps) {
  const { id: chatbotId } = use(params);

  const [issues, setIssues] = useState<Escalation[]>([]);
  const [stats, setStats] = useState<IssueStats>({ total: 0, open: 0, acknowledged: 0, resolved: 0 });
  const [selectedIssue, setSelectedIssue] = useState<Escalation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | EscalationStatus>('all');

  async function fetchIssues() {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({ limit: '100' });
      if (statusFilter !== 'all') {
        queryParams.set('status', statusFilter);
      }

      const response = await fetch(
        `/api/chatbots/${chatbotId}/issues?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const result = await response.json();
      setIssues(result.data?.data || []);
      setStats(result.data?.stats || { total: 0, open: 0, acknowledged: 0, resolved: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, [chatbotId, statusFilter]);

  const handleStatusChange = () => {
    fetchIssues();
  };

  const handleExport = () => {
    if (issues.length === 0) return;

    setExporting(true);
    try {
      const headers = ['ID', 'Reason', 'Details', 'Status', 'Created', 'Updated'];
      const rows = issues.map((e) => [
        e.id,
        REASON_LABELS[e.reason] || e.reason,
        (e.details || '').replace(/,/g, ';'),
        e.status,
        new Date(e.created_at).toISOString(),
        new Date(e.updated_at).toISOString(),
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `issues-${chatbotId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Exported ${issues.length} issues`);
    } catch (err) {
      toast.error('Failed to export issues');
    } finally {
      setExporting(false);
    }
  };

  const columns = useMemo<Column<Escalation>[]>(() => [
    {
      key: 'reason',
      header: 'Reason',
      sortable: true,
      render: (item) => (
        <Badge className={REASON_COLORS[item.reason]}>
          {REASON_LABELS[item.reason] || item.reason}
        </Badge>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      sortable: false,
      render: (item) => (
        <span className="text-sm text-secondary-600 dark:text-secondary-400">
          {item.details ? truncateText(item.details, 50) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => (
        <Badge className={STATUS_COLORS[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (item) => (
        <div className="text-sm">
          <p className="text-secondary-900 dark:text-secondary-100">{formatShortDate(item.created_at)}</p>
          <p className="text-secondary-500 text-xs">{formatTimeAgo(item.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      className: 'w-16',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIssue(item);
            setDialogOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ], []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dashboard/chatbots">Back to Chatbots</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ChatbotPageHeader chatbotId={chatbotId} title="Issues" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Total</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Open</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {stats.open}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Acknowledged</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {stats.acknowledged}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.resolved}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls and Table */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | EscalationStatus)}
              className="h-9 rounded-md border border-secondary-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-100"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting || issues.length === 0}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export CSV
            </Button>
          </div>

          {issues.length > 0 ? (
            <SortableTable
              data={issues}
              columns={columns}
              keyExtractor={(item) => item.id}
              defaultSortKey="created_at"
              defaultSortDirection="desc"
              searchable
              searchPlaceholder="Search issues..."
              paginated
              defaultPageSize={10}
              emptyMessage="No issues match your search."
              onRowClick={(item) => {
                setSelectedIssue(item);
                setDialogOpen(true);
              }}
            />
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-full inline-block mb-4">
                <ShieldAlert className="w-8 h-8 text-secondary-400" />
              </div>
              <p className="text-secondary-600 dark:text-secondary-400">
                No issues yet. Issues will appear here when visitors flag problems in conversations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <EscalationDetailDialog
        escalation={selectedIssue}
        chatbotId={chatbotId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
