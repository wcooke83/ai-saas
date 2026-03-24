'use client';

import { useState, useEffect, useRef, use } from 'react';
import { toast } from 'sonner';
import {
  Loader2,
  Ticket,
  ChevronRight,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';

interface TicketData {
  id: string;
  reference: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  subject: string | null;
  message: string;
  priority: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface Reply {
  id: string;
  ticket_id: string;
  sender_type: 'admin' | 'visitor';
  sender_email: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const statusTabs = ['all', 'open', 'in_progress', 'resolved', 'closed'];

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  closed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertTriangle className="w-4 h-4" />,
  in_progress: <Clock className="w-4 h-4" />,
  resolved: <CheckCircle2 className="w-4 h-4" />,
  closed: <XCircle className="w-4 h-4" />,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function TicketsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<TicketData | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const repliesEndRef = useRef<HTMLDivElement>(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/tickets?page=${page}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.data.tickets);
        setTotal(data.data.total);
      }
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch counts for each status
      const statuses = ['open', 'in_progress', 'resolved', 'closed'];
      const counts = await Promise.all(
        statuses.map(async (s) => {
          const res = await fetch(`/api/chatbots/${id}/tickets?status=${s}&limit=1`);
          const data = await res.json();
          return { status: s, count: data.success ? data.data.total : 0 };
        })
      );
      const allRes = await fetch(`/api/chatbots/${id}/tickets?limit=1`);
      const allData = await allRes.json();
      const newStats: Record<string, number> = { total: allData.success ? allData.data.total : 0 };
      counts.forEach(({ status, count }) => { newStats[status] = count; });
      setStats(newStats as typeof stats);
    } catch {
      // silently fail stats
    }
  };

  const fetchReplies = async (ticketId: string) => {
    setRepliesLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/tickets/${ticketId}/replies`);
      const data = await res.json();
      if (data.success) {
        setReplies(data.data.replies);
      }
    } catch {
      toast.error('Failed to load replies');
    } finally {
      setRepliesLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [page, statusFilter]);
  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [replies]);

  const selectTicket = (ticket: TicketData) => {
    setSelected(ticket);
    setAdminNotes(ticket.admin_notes || '');
    setReplyText('');
    setReplies([]);
    fetchReplies(ticket.id);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSelected(data.data.ticket);
      setTickets(prev => prev.map(t => t.id === ticketId ? data.data.ticket : t));
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      fetchStats();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/tickets/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSelected(data.data.ticket);
      setTickets(prev => prev.map(t => t.id === selected.id ? data.data.ticket : t));
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/tickets/${selected.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setReplies(prev => [...prev, data.data.reply]);
      setReplyText('');
      toast.success('Reply sent and visitor notified via email');
      // Refresh ticket (status may have changed to in_progress)
      const ticketRes = await fetch(`/api/chatbots/${id}/tickets/${selected.id}`);
      const ticketData = await ticketRes.json();
      if (ticketData.success) {
        setSelected(ticketData.data.ticket);
        setTickets(prev => prev.map(t => t.id === selected.id ? ticketData.data.ticket : t));
      }
      fetchStats();
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // ========== DETAIL VIEW ==========
  if (selected) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tickets
        </button>

        {/* Ticket header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
              <Ticket className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                {selected.reference}
              </h1>
              <p className="text-sm text-secondary-500">{selected.subject || 'No subject'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[selected.priority]}>{selected.priority}</Badge>
            <Badge className={statusColors[selected.status]}>
              <span className="flex items-center gap-1">
                {statusIcons[selected.status]}
                {selected.status.replace('_', ' ')}
              </span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Conversation thread */}
          <div className="lg:col-span-2 space-y-4">
            {/* Original message */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      {selected.visitor_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
                        {selected.visitor_name}
                      </span>
                      <span className="text-xs text-secondary-500">{selected.visitor_email}</span>
                      <span className="text-xs text-secondary-400 ml-auto">{formatDate(selected.created_at)}</span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg rounded-tl-none">
                      <p className="text-sm whitespace-pre-wrap text-secondary-800 dark:text-secondary-200">{selected.message}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies thread */}
            {repliesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-secondary-400" />
              </div>
            ) : (
              replies.map(reply => (
                <Card key={reply.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.sender_type === 'admin'
                          ? 'bg-primary-100 dark:bg-primary-900/50'
                          : 'bg-blue-100 dark:bg-blue-900/50'
                      }`}>
                        <span className={`text-xs font-medium ${
                          reply.sender_type === 'admin'
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                          {reply.sender_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
                            {reply.sender_name}
                          </span>
                          {reply.sender_type === 'admin' && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Staff</Badge>
                          )}
                          <span className="text-xs text-secondary-400 ml-auto">{formatDate(reply.created_at)}</span>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          reply.sender_type === 'admin'
                            ? 'bg-primary-50 dark:bg-primary-900/20 rounded-tl-none'
                            : 'bg-blue-50 dark:bg-blue-900/20 rounded-tl-none'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap text-secondary-800 dark:text-secondary-200">{reply.message}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <div ref={repliesEndRef} />

            {/* Reply form */}
            {selected.status !== 'closed' && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Reply to {selected.visitor_name}
                    </label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                      placeholder="Type your reply... The visitor will be notified via email."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          sendReply();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-secondary-400">Ctrl+Enter to send</span>
                      <Button
                        size="sm"
                        onClick={sendReply}
                        disabled={sendingReply || !replyText.trim()}
                      >
                        {sendingReply ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Ticket details sidebar */}
          <div className="space-y-4">
            {/* Visitor info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Visitor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-secondary-500 block text-xs">Name</span>
                  <span className="text-secondary-900 dark:text-secondary-100">{selected.visitor_name}</span>
                </div>
                <div>
                  <span className="text-secondary-500 block text-xs">Email</span>
                  <a href={`mailto:${selected.visitor_email}`} className="text-primary-600 hover:underline">
                    {selected.visitor_email}
                  </a>
                </div>
                {selected.visitor_phone && (
                  <div>
                    <span className="text-secondary-500 block text-xs">Phone</span>
                    <span>{selected.visitor_phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-secondary-500 block text-xs">Submitted</span>
                  <span>{formatDate(selected.created_at)}</span>
                </div>
                {selected.resolved_at && (
                  <div>
                    <span className="text-secondary-500 block text-xs">Resolved</span>
                    <span>{formatDate(selected.resolved_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status management */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {(['open', 'in_progress', 'resolved', 'closed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateTicketStatus(selected.id, status)}
                      disabled={updatingStatus || selected.status === status}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        selected.status === status
                          ? statusColors[status] + ' ring-2 ring-offset-1 ring-primary-500'
                          : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                      }`}
                    >
                      {statusIcons[status]}
                      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-secondary-400">
                  Status changes send an email notification to the visitor.
                </p>
              </CardContent>
            </Card>

            {/* Admin notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  placeholder="Add internal notes (not visible to visitor)..."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={saveAdminNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="space-y-6">
      <ChatbotPageHeader chatbotId={id} title="Tickets" />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Total</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                <Ticket className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Open</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.open}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.in_progress}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.resolved}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg w-fit">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setStatusFilter(tab); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === tab ? 'bg-white dark:bg-secondary-700 shadow-sm' : 'text-secondary-600 dark:text-secondary-400'
            }`}
          >
            {tab === 'all' ? 'All' : tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-secondary-400" /></div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-full inline-block mb-4">
              <Ticket className="w-8 h-8 text-secondary-400" />
            </div>
            <p className="text-secondary-500">No tickets found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Visitor</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 cursor-pointer"
                    onClick={() => selectTicket(ticket)}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{ticket.reference}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{ticket.subject || '-'}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{ticket.visitor_name}</div>
                        <div className="text-xs text-secondary-400">{ticket.visitor_email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[ticket.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[ticket.status]}
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-secondary-500">
                      <div>
                        <div>{new Date(ticket.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-secondary-400">{formatTimeAgo(ticket.created_at)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-secondary-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-secondary-500 py-2">Page {page} of {Math.ceil(total / 20)}</span>
          <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
