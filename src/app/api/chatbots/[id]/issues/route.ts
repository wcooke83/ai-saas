/**
 * Chatbot Issues API
 * GET /api/chatbots/:id/issues - List reported issues with stats and pagination
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError, successResponse, errorResponse } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Only issue reports — handoff reasons are managed via Agent Console
const REPORT_REASONS = ['wrong_answer', 'offensive_content'];

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const isOwner = await checkChatbotOwnership(chatbotId, user.id, supabase as unknown as TypedSupabaseClient);
    if (!isOwner) {
      throw APIError.forbidden('Access denied');
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');

    const db = supabase as any;

    // Build query
    let query = db
      .from('conversation_escalations')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', chatbotId)
      .in('reason', REPORT_REASONS)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    // Fetch issues and stats in parallel
    const [issuesResult, openResult, acknowledgedResult, resolvedResult] = await Promise.all([
      query,
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .in('reason', REPORT_REASONS)
        .eq('status', 'open'),
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .in('reason', REPORT_REASONS)
        .eq('status', 'acknowledged'),
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .in('reason', REPORT_REASONS)
        .eq('status', 'resolved'),
    ]);

    if (issuesResult.error) {
      console.error('Failed to fetch issues:', issuesResult.error);
      throw APIError.internal('Failed to fetch issues');
    }

    const total = (openResult.count || 0) + (acknowledgedResult.count || 0) + (resolvedResult.count || 0);

    return successResponse({
      data: issuesResult.data || [],
      stats: {
        total,
        open: openResult.count || 0,
        acknowledged: acknowledgedResult.count || 0,
        resolved: resolvedResult.count || 0,
      },
      pagination: {
        page,
        limit,
        total: issuesResult.count || 0,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
