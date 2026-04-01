/**
 * Webhook instance API
 * PATCH  /api/webhooks/[id] — update webhook
 * DELETE /api/webhooks/[id] — delete webhook
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { validateWebhookURL } from '@/lib/webhooks/url-validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id } = await params;
    const supabase = createAdminClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) throw APIError.notFound('Webhook not found');

    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.url !== undefined) {
      // SSRF protection: validate URL scheme + DNS resolution
      const urlCheck = await validateWebhookURL(body.url);
      if (!urlCheck.valid) {
        throw APIError.badRequest(urlCheck.error || 'Invalid webhook URL');
      }
      update.url = body.url;
    }

    if (body.events !== undefined) {
      if (!Array.isArray(body.events)) throw APIError.badRequest('events must be an array');
      update.events = body.events;
    }

    if (body.is_active !== undefined) {
      update.is_active = Boolean(body.is_active);
    }

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .update(update)
      .eq('id', id)
      .select('id, url, events, is_active, last_triggered_at, failure_count, created_at')
      .single();

    if (error) throw error;

    return successResponse({ webhook });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id } = await params;
    const supabase = createAdminClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) throw APIError.notFound('Webhook not found');

    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (err) {
    return errorResponse(err);
  }
}
