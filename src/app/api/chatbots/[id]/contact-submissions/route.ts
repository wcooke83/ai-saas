/**
 * Admin Contact Submissions API
 * GET  /api/chatbots/:id/contact-submissions - List submissions (authenticated)
 * PATCH /api/chatbots/:id/contact-submissions?submissionId=X - Update status
 * POST /api/chatbots/:id/contact-submissions - Send reply or check inbound replies
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendContactReplyEmail } from '@/lib/email/smtp';
import { pollContactReplies } from '@/lib/email/imap';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;
    const status = req.nextUrl.searchParams.get('status');
    const submissionId = req.nextUrl.searchParams.get('submissionId');

    // If requesting a single submission with its replies
    if (submissionId) {
      const { data: submission, error: subErr } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', submissionId)
        .eq('chatbot_id', id)
        .single();

      if (subErr || !submission) throw APIError.notFound('Submission not found');

      const { data: replies } = await supabase
        .from('contact_replies')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      return successResponse({ submission, replies: replies || [] });
    }

    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: submissions, count, error } = await query;
    if (error) throw error;

    return successResponse({ submissions: submissions || [], total: count || 0, page, limit });
  } catch (error) {
    return errorResponse(error);
  }
}

const updateSubmissionSchema = z.object({
  status: z.enum(['new', 'read', 'replied']),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, updateSubmissionSchema);
    const submissionId = req.nextUrl.searchParams.get('submissionId');
    if (!submissionId) throw APIError.badRequest('submissionId required');

    const supabase = createAdminClient();
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .update({ status: input.status })
      .eq('id', submissionId)
      .eq('chatbot_id', id)
      .select()
      .single();

    if (error || !submission) throw APIError.notFound('Submission not found');

    return successResponse({ submission });
  } catch (error) {
    return errorResponse(error);
  }
}

const replySchema = z.object({
  submissionId: z.string().uuid(),
  message: z.string().min(1).max(10000),
});

const actionSchema = z.object({
  action: z.literal('check-replies'),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const body = await req.json();

    // Action: check-replies (trigger IMAP poll)
    if (body.action === 'check-replies') {
      const result = await pollContactReplies();
      return successResponse(result);
    }

    // Action: send reply
    const input = replySchema.parse(body);
    const supabase = createAdminClient();

    // Verify submission belongs to this chatbot
    const { data: submission, error: subErr } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', input.submissionId)
      .eq('chatbot_id', id)
      .single();

    if (subErr || !submission) throw APIError.notFound('Submission not found');

    // Find the last email_message_id in the thread for threading
    const { data: lastReply } = await supabase
      .from('contact_replies')
      .select('email_message_id')
      .eq('submission_id', input.submissionId)
      .not('email_message_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Send email via SMTP
    const emailMessageId = await sendContactReplyEmail(
      (submission as any).visitor_email,
      {
        visitorName: (submission as any).visitor_name,
        submissionId: input.submissionId,
        replyMessage: input.message,
        replierName: user.email || 'Support',
        inReplyToMessageId: lastReply?.email_message_id || undefined,
      }
    );

    // Store the reply
    const { data: reply, error: replyErr } = await supabase
      .from('contact_replies')
      .insert({
        submission_id: input.submissionId,
        sender_type: 'admin',
        sender_name: user.email || 'Support',
        sender_email: 'support@vocui.com',
        message: input.message,
        email_message_id: emailMessageId,
      })
      .select()
      .single();

    if (replyErr) throw replyErr;

    // Auto-mark submission as replied
    await supabase
      .from('contact_submissions')
      .update({ status: 'replied' })
      .eq('id', input.submissionId);

    return successResponse({ reply });
  } catch (error) {
    return errorResponse(error);
  }
}
