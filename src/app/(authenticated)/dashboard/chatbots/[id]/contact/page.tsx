'use client';

import { useState, useEffect, use, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, FileText, ChevronRight, Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';

interface Submission {
  id: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  status: string;
  created_at: string;
}

interface Reply {
  id: string;
  submission_id: string;
  sender_type: 'admin' | 'visitor';
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  read: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  replied: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

export default function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [checkingReplies, setCheckingReplies] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/contact-submissions?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data.submissions);
        setTotal(data.data.total);
      }
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (submissionId: string) => {
    setRepliesLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/contact-submissions?submissionId=${submissionId}`);
      const data = await res.json();
      if (data.success) {
        setReplies(data.data.replies || []);
        // Update the selected submission in case status changed
        if (data.data.submission) {
          setSelected(data.data.submission);
          setSubmissions(prev => prev.map(s => s.id === submissionId ? data.data.submission : s));
        }
      }
    } catch {
      toast.error('Failed to load replies');
    } finally {
      setRepliesLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, [page]);

  useEffect(() => {
    if (selected) {
      fetchReplies(selected.id);
    } else {
      setReplies([]);
      setReplyText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies.length]);

  const updateStatus = async (submissionId: string, status: string) => {
    setUpdatingStatus(`${submissionId}-${status}`);
    try {
      const res = await fetch(`/api/chatbots/${id}/contact-submissions?submissionId=${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSubmissions(prev => prev.map(s => s.id === submissionId ? data.data.submission : s));
      if (selected?.id === submissionId) setSelected(data.data.submission);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: selected.id, message: replyText.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || 'Failed to send reply');
      }
      const data = await res.json();
      setReplies(prev => [...prev, data.data.reply]);
      setReplyText('');
      // Update status to replied
      setSelected(prev => prev ? { ...prev, status: 'replied' } : null);
      setSubmissions(prev => prev.map(s => s.id === selected.id ? { ...s, status: 'replied' } : s));
      toast.success('Reply sent');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const checkForReplies = async () => {
    setCheckingReplies(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-replies' }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const { processed } = data.data;
      if (processed > 0) {
        toast.success(`${processed} new ${processed === 1 ? 'reply' : 'replies'} found`);
        fetchSubmissions();
        if (selected) fetchReplies(selected.id);
      } else {
        toast.info('No new replies');
      }
    } catch {
      toast.error('Failed to check for replies');
    } finally {
      setCheckingReplies(false);
    }
  };

  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelected(null)} className="text-sm text-primary-600 hover:underline">&larr; Back to submissions</button>
          <Button
            variant="outline"
            size="sm"
            onClick={checkForReplies}
            disabled={checkingReplies}
          >
            {checkingReplies ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Check for replies
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contact from {selected.visitor_name}
              </CardTitle>
              <Badge className={statusColors[selected.status]}>{selected.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-1">
              <p><span className="text-secondary-500">Email:</span> {selected.visitor_email}</p>
              <p><span className="text-secondary-500">Date:</span> {new Date(selected.created_at).toLocaleString()}</p>
            </div>

            {/* Original message */}
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-secondary-500">{selected.visitor_name}</span>
                <span className="text-xs text-secondary-400">{new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
            </div>

            {/* Reply thread */}
            {repliesLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-secondary-400" /></div>
            ) : replies.length > 0 ? (
              <div className="space-y-3">
                {replies.map(reply => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.sender_type === 'admin'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'bg-secondary-50 dark:bg-secondary-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {reply.sender_type === 'admin' ? 'Admin' : 'Visitor'}
                      </Badge>
                      <span className="text-xs font-medium text-secondary-500">{reply.sender_name}</span>
                      <span className="text-xs text-secondary-400">{new Date(reply.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>
            ) : null}

            {/* Reply form */}
            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
              <label className="block text-sm font-medium mb-2">Reply to {selected.visitor_name}</label>
              <Textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="min-h-[100px] resize-y"
                disabled={sendingReply}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  {selected.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(selected.id, 'read')}
                      disabled={updatingStatus === `${selected.id}-read`}
                    >
                      {updatingStatus === `${selected.id}-read` && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                      Mark as Read
                    </Button>
                  )}
                  {selected.status !== 'replied' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(selected.id, 'replied')}
                      disabled={updatingStatus === `${selected.id}-replied`}
                    >
                      {updatingStatus === `${selected.id}-replied` && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                      Mark as Replied
                    </Button>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                >
                  {sendingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Send className="w-4 h-4 mr-1" />
                  )}
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ChatbotPageHeader chatbotId={id} title="Contact Submissions" />
        <Button
          variant="outline"
          size="sm"
          onClick={checkForReplies}
          disabled={checkingReplies}
        >
          {checkingReplies ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
          Check for replies
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-secondary-400" /></div>
      ) : submissions.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-secondary-500">No contact submissions</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-500 hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr
                    key={sub.id}
                    className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 cursor-pointer focus:bg-secondary-50 dark:focus:bg-secondary-800/50 outline-none"
                    onClick={() => setSelected(sub)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(sub); } }}
                  >
                    <td className="px-4 py-3">{sub.visitor_name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{sub.visitor_email}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{sub.message}</td>
                    <td className="px-4 py-3"><Badge className={statusColors[sub.status]}>{sub.status}</Badge></td>
                    <td className="px-4 py-3 text-secondary-500 hidden sm:table-cell">{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-secondary-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

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
