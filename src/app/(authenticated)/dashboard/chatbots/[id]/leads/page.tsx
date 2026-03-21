'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Download,
  Eye,
  Loader2,
  TrendingUp,
  Calendar,
  Hash,
  ChevronRight,
  Mail,
  X,
  Settings,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortableTable, Column } from '@/components/ui/sortable-table';
import { H1 } from '@/components/ui/heading';
import { LeadDetailDialog } from '@/components/leads/lead-detail-dialog';
import { ConversationDetailDialog } from '@/components/leads/conversation-detail-dialog';
import { generateLeadsCsv, generateConversationsCsv, downloadCsv } from '@/lib/leads/export';

interface Lead {
  [key: string]: unknown;
  id: string;
  session_id: string;
  form_data: Record<string, string>;
  created_at: string;
}

interface Conversation {
  [key: string]: unknown;
  id: string;
  session_id: string;
  channel: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  message_count?: number;
}

interface ChatbotLeadsPageProps {
  params: Promise<{ id: string }>;
}

interface PreChatFormConfig {
  enabled: boolean;
  [key: string]: unknown;
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ChatbotLeadsPage({ params }: ChatbotLeadsPageProps) {
  const { id: chatbotId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionFilter = searchParams.get('session');

  const [activeTab, setActiveTab] = useState(sessionFilter ? 'conversations' : 'leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [conversationDialogOpen, setConversationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [preChatFormEnabled, setPreChatFormEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch chatbot info to check pre-chat form config
        const chatbotRes = await fetch(`/api/chatbots/${chatbotId}`);
        if (chatbotRes.ok) {
          const chatbotData = await chatbotRes.json();
          const config = chatbotData.data?.chatbot?.pre_chat_form_config as PreChatFormConfig | undefined;
          setPreChatFormEnabled(config?.enabled ?? false);
        }

        // Fetch leads
        const leadsResponse = await fetch(`/api/chatbots/${chatbotId}/leads?limit=100`);
        if (!leadsResponse.ok) {
          throw new Error('Failed to fetch leads');
        }
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.data?.leads || []);

        // Fetch conversations
        const convResponse = await fetch(`/api/chatbots/${chatbotId}/conversations?limit=100`);
        if (!convResponse.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const convData = await convResponse.json();
        setConversations(convData.data?.conversations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [chatbotId]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentLeads = leads.filter(l => new Date(l.created_at) > oneWeekAgo).length;
    const recentConversations = conversations.filter(c => new Date(c.created_at) > oneWeekAgo).length;
    const todayLeads = leads.filter(l => new Date(l.created_at) > oneDayAgo).length;
    const todayConversations = conversations.filter(c => new Date(c.created_at) > oneDayAgo).length;

    return {
      totalLeads: leads.length,
      totalConversations: conversations.length,
      recentLeads,
      recentConversations,
      todayLeads,
      todayConversations,
    };
  }, [leads, conversations]);

  // Filter data by date
  const filteredLeads = useMemo(() => {
    if (dateFilter === 'all') return leads;
    
    const now = new Date();
    const cutoff = {
      today: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    }[dateFilter];

    return leads.filter(l => new Date(l.created_at) > cutoff);
  }, [leads, dateFilter]);

  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    
    if (sessionFilter) {
      filtered = filtered.filter(c => c.session_id === sessionFilter);
    }
    
    if (dateFilter === 'all') return filtered;
    
    const now = new Date();
    const cutoff = {
      today: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    }[dateFilter];

    return filtered.filter(c => new Date(c.created_at) > cutoff);
  }, [conversations, dateFilter, sessionFilter]);

  // Lead table columns - memoized to prevent unnecessary re-renders
  const leadColumns = useMemo<Column<Lead>[]>(() => [
    {
      key: 'name',
      header: 'Lead',
      sortable: false,
      render: (lead) => {
        const name = lead.form_data.name || 'Anonymous';
        const email = lead.form_data.email;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium text-sm">
              {name !== 'Anonymous' ? getInitials(name) : '?'}
            </div>
            <div>
              <p className="font-medium text-secondary-900 dark:text-secondary-100">{name}</p>
              {email && (
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {email}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'form_data',
      header: 'Details',
      sortable: false,
      render: (lead) => (
        <div className="flex flex-wrap gap-1">
          {Object.entries(lead.form_data)
            .filter(([key]) => !['name', 'email'].includes(key.toLowerCase()))
            .slice(0, 3)
            .map(([key, value]) => (
              <Badge key={key} variant="outline" className="text-xs font-normal">
                <span className="text-secondary-500 capitalize mr-1">{key}:</span>
                <span className="truncate max-w-[100px]">{value}</span>
              </Badge>
            ))}
          {Object.keys(lead.form_data).length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{Object.keys(lead.form_data).length - 3} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'session_id',
      header: 'Session',
      sortable: false,
      className: 'hidden sm:table-cell',
      render: (lead) => (
        <div className="flex items-center gap-1.5 text-sm text-secondary-500">
          <Hash className="w-3.5 h-3.5" />
          <span className="font-mono">{lead.session_id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Submitted',
      sortable: true,
      render: (lead) => (
        <div className="text-sm">
          <p className="text-secondary-900 dark:text-secondary-100">{formatShortDate(lead.created_at)}</p>
          <p className="text-secondary-500 text-xs">{formatTimeAgo(lead.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      className: 'w-16',
      render: (lead) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLead(lead);
            setLeadDialogOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ], []);

  // Conversation table columns - memoized
  const conversationColumns = useMemo<Column<Conversation>[]>(() => [
    {
      key: 'session_id',
      header: 'Conversation',
      sortable: false,
      render: (conv) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-secondary-900 dark:text-secondary-100">
              Session {conv.session_id.slice(0, 8)}...
            </p>
            <p className="text-sm text-secondary-500">
              {conv.message_count ? `${conv.message_count} messages` : 'Click to view messages'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      sortable: true,
      render: (conv) => (
        <Badge variant="secondary" className="capitalize text-xs">
          {conv.channel}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last Activity',
      sortable: true,
      render: (conv) => (
        <div className="text-sm">
          <p className="text-secondary-900 dark:text-secondary-100">{formatShortDate(conv.updated_at)}</p>
          <p className="text-secondary-500 text-xs">{formatTimeAgo(conv.updated_at)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      className: 'w-16',
      render: (conv) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedConversation(conv);
            setConversationDialogOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ], []);

  function handleExport() {
    setExporting(true);
    try {
      if (activeTab === 'leads') {
        const csv = generateLeadsCsv(filteredLeads);
        downloadCsv(csv, `leads-${chatbotId}-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success(`Exported ${filteredLeads.length} leads`);
      } else {
        const csv = generateConversationsCsv(filteredConversations);
        downloadCsv(csv, `conversations-${chatbotId}-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success(`Exported ${filteredConversations.length} conversations`);
      }
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/chatbots/${chatbotId}`}
            className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Chatbot
          </Link>
          <H1 variant="dashboard">
            Leads & Conversations
          </H1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            View pre-chat form submissions and chat history
          </p>
        </div>
        {sessionFilter && (
          <Badge variant="outline" className="w-fit">
            Filtered by session: {sessionFilter.slice(0, 16)}...
            <button
              onClick={() => router.push(`/dashboard/chatbots/${chatbotId}/leads`)}
              className="ml-2 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  Total Leads
                  <Tooltip content="Visitors who submitted the pre-chat form before starting a conversation.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {stats.totalLeads}
                </p>
              </div>
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">+{stats.recentLeads}</span>
              <span className="text-secondary-500">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  Total Conversations
                  <Tooltip content="All chat sessions, including those from visitors who skipped the pre-chat form.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {stats.totalConversations}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">+{stats.recentConversations}</span>
              <span className="text-secondary-500">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  Today&apos;s Activity
                  <Tooltip content="Combined total of leads and conversations from the last 24 hours.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {stats.todayLeads + stats.todayConversations}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-secondary-500">
              <span className="font-medium text-secondary-700 dark:text-secondary-300">{stats.todayLeads}</span>
              <span>leads,</span>
              <span className="font-medium text-secondary-700 dark:text-secondary-300">{stats.todayConversations}</span>
              <span>conversations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  Conversion Rate
                  <Tooltip content="Percentage of conversations where the visitor also submitted the pre-chat form.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {stats.totalConversations > 0
                    ? `${Math.round((stats.totalLeads / stats.totalConversations) * 100)}%`
                    : '0%'}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-secondary-500">
              <span>Leads per conversation</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Leads ({filteredLeads.length})
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversations ({filteredConversations.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="h-9 rounded-md border border-secondary-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-100"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting || (activeTab === 'leads' ? filteredLeads.length === 0 : filteredConversations.length === 0)}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export CSV
            </Button>
          </div>
        </div>

        {/* Leads Tab */}
        <TabsContent value="leads" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {filteredLeads.length > 0 ? (
                <SortableTable
                  data={filteredLeads}
                  columns={leadColumns}
                  keyExtractor={(lead) => lead.id}
                  defaultSortKey="created_at"
                  defaultSortDirection="desc"
                  searchable={true}
                  searchPlaceholder="Search by name, email, or form data..."
                  paginated={true}
                  defaultPageSize={10}
                  emptyMessage="No leads match your search."
                  onRowClick={(lead) => {
                    setSelectedLead(lead);
                    setLeadDialogOpen(true);
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-full inline-block mb-4">
                    <Users className="w-8 h-8 text-secondary-400" />
                  </div>
                  {preChatFormEnabled === false ? (
                    <>
                      <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                        No leads yet. Enable the pre-chat form in Settings to start collecting visitor information.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/chatbots/${chatbotId}/settings`}>
                          <Settings className="w-4 h-4 mr-2" />
                          Go to Settings
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-secondary-600 dark:text-secondary-400">
                      No leads collected yet. Leads will appear here when visitors fill out the pre-chat form.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <SortableTable
                data={filteredConversations}
                columns={conversationColumns}
                keyExtractor={(conv) => conv.id}
                defaultSortKey="updated_at"
                defaultSortDirection="desc"
                searchable={true}
                searchPlaceholder="Search by session ID or channel..."
                paginated={true}
                defaultPageSize={10}
                emptyMessage={sessionFilter ? "No conversations found for this session." : "No conversations yet. Chat sessions will appear here."}
                onRowClick={(conv) => {
                  setSelectedConversation(conv);
                  setConversationDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Dialog */}
      <LeadDetailDialog
        lead={selectedLead}
        chatbotId={chatbotId}
        open={leadDialogOpen}
        onOpenChange={setLeadDialogOpen}
      />

      {/* Conversation Detail Dialog */}
      <ConversationDetailDialog
        conversation={selectedConversation}
        chatbotId={chatbotId}
        open={conversationDialogOpen}
        onOpenChange={setConversationDialogOpen}
      />
    </div>
  );
}
