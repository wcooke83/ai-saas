/**
 * Single Webhook Subscription API
 * GET    /api/chatbots/:id/webhooks/:webhookId — get subscription details
 * PATCH  /api/chatbots/:id/webhooks/:webhookId — update subscription
 * DELETE /api/chatbots/:id/webhooks/:webhookId — remove subscription
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { WEBHOOK_EVENT_NAMES, type WebhookEvent } from '@/lib/webhooks/types';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ id: string; webhookId: string }>;
}

async function verifyAccess(req: NextRequest, params: RouteParams['params']) {
  const user = await authenticate(req);
  if (!user) throw APIError.unauthorized();

  const { id: chatbotId, webhookId } = await params;
  const admin = createAdminClient();

  const isOwner = await checkChatbotOwnership(chatbotId, user.id, admin as unknown as TypedSupabaseClient);
  if (!isOwner) throw APIError.forbidden('Access denied');

  // Verify this webhook belongs to the user
  const { data: existing } = await admin
    .from('webhooks')
    .select('id')
    .eq('id', webhookId)
    .eq('user_id', user.id)
    .single();

  if (!existing) throw APIError.notFound('Webhook not found');

  return { user, chatbotId, webhookId, admin };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { webhookId, admin } = await verifyAccess(req, params);

    const { data: webhook, error } = await admin
      .from('webhooks')
      .select('id, url, events, is_active, last_triggered_at, failure_count, created_at, updated_at')
      .eq('id', webhookId)
      .single();

    if (error) throw error;

    return successResponse({ webhook });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { webhookId, admin } = await verifyAccess(req, params);

    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.url !== undefined) {
      let parsed: URL;
      try {
        parsed = new URL(body.url);
      } catch {
        throw APIError.badRequest('url must be a valid URL');
      }
      if (parsed.protocol !== 'https:') {
        throw APIError.badRequest('url must use HTTPS');
      }
      update.url = body.url;
    }

    if (body.events !== undefined) {
      if (!Array.isArray(body.events)) {
        throw APIError.badRequest('events must be an array');
      }
      for (const e of body.events) {
        if (!WEBHOOK_EVENT_NAMES.includes(e as WebhookEvent)) {
          throw APIError.badRequest(`Invalid event: ${e}`);
        }
      }
      update.events = body.events;
    }

    if (body.is_active !== undefined) {
      update.is_active = Boolean(body.is_active);
    }

    // Reset failure count if reactivating
    if (update.is_active === true) {
      update.failure_count = 0;
    }

    const { data: webhook, error } = await admin
      .from('webhooks')
      .update(update)
      .eq('id', webhookId)
      .select('id, url, events, is_active, last_triggered_at, failure_count, created_at, updated_at')
      .single();

    if (error) throw error;

    return successResponse({ webhook });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { webhookId, admin } = await verifyAccess(req, params);

    const { error } = await admin
      .from('webhooks')
      .delete()
      .eq('id', webhookId);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (err) {
    return errorResponse(err);
  }
}
