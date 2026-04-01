/**
 * Webhook Delivery Log API
 * GET /api/webhooks/:id/deliveries
 *
 * Returns recent delivery attempts for a specific webhook,
 * sourced from the audit_log table.
 *
 * Query params:
 *   limit  — max results, default 25, max 100
 *   cursor — ISO timestamp for pagination (returns entries before this)
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id: webhookId } = await params;
    const supabase = createAdminClient();

    // Verify the user owns this webhook
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', webhookId)
      .eq('user_id', user.id)
      .single();

    if (!webhook) throw APIError.notFound('Webhook not found');

    // Parse query params
    const { searchParams } = req.nextUrl;
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);
    const cursor = searchParams.get('cursor');

    // Query audit_log for delivery entries
    let query = supabase
      .from('audit_log')
      .select('id, action, metadata, created_at')
      .eq('entity_type', 'webhook_delivery')
      .eq('entity_id', webhookId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data: entries, error } = await query;

    if (error) throw error;

    // Transform into a cleaner shape
    const deliveries = (entries ?? []).map((entry) => {
      const meta = (entry.metadata || {}) as Record<string, unknown>;
      return {
        id: entry.id,
        delivery_id: meta.delivery_id || null,
        event: meta.event || null,
        chatbot_id: meta.chatbot_id || null,
        status: entry.action === 'delivered' || entry.action === 'test_delivered'
          ? 'success'
          : 'failed',
        status_code: meta.status_code ?? null,
        attempts: meta.attempts ?? null,
        error: meta.error || null,
        is_test: meta.is_test === true,
        created_at: entry.created_at,
      };
    });

    // Provide cursor for next page
    const nextCursor = deliveries.length === limit
      ? deliveries[deliveries.length - 1].created_at
      : null;

    return successResponse({
      deliveries,
      next_cursor: nextCursor,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
