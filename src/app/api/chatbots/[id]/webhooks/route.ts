/**
 * Chatbot Webhook Subscriptions API
 * GET  /api/chatbots/:id/webhooks — list webhook subscriptions for a chatbot
 * POST /api/chatbots/:id/webhooks — create a new subscription
 */

import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { WEBHOOK_EVENT_NAMES, type WebhookEvent } from '@/lib/webhooks/types';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id: chatbotId } = await params;
    const admin = createAdminClient();

    const isOwner = await checkChatbotOwnership(chatbotId, user.id, admin as unknown as TypedSupabaseClient);
    if (!isOwner) throw APIError.forbidden('Access denied');

    const { data: webhooks, error } = await admin
      .from('webhooks')
      .select('id, url, events, is_active, last_triggered_at, failure_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse({ webhooks: webhooks ?? [] });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id: chatbotId } = await params;
    const admin = createAdminClient();

    const isOwner = await checkChatbotOwnership(chatbotId, user.id, admin as unknown as TypedSupabaseClient);
    if (!isOwner) throw APIError.forbidden('Access denied');

    const body = await req.json();
    const { url, events, secret: providedSecret } = body as {
      url: string;
      events?: string[];
      secret?: string;
    };

    // Validate URL
    if (!url || typeof url !== 'string') {
      throw APIError.badRequest('url is required');
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw APIError.badRequest('url must be a valid URL');
    }
    if (parsed.protocol !== 'https:') {
      throw APIError.badRequest('url must use HTTPS');
    }

    // Validate events
    const validatedEvents: WebhookEvent[] = [];
    if (events && Array.isArray(events)) {
      for (const e of events) {
        if (!WEBHOOK_EVENT_NAMES.includes(e as WebhookEvent)) {
          throw APIError.badRequest(`Invalid event: ${e}. Valid events: ${WEBHOOK_EVENT_NAMES.join(', ')}`);
        }
        validatedEvents.push(e as WebhookEvent);
      }
    }

    const secret = providedSecret || randomBytes(32).toString('hex');

    const { data: webhook, error } = await admin
      .from('webhooks')
      .insert({
        user_id: user.id,
        url,
        secret,
        events: validatedEvents.length > 0 ? validatedEvents : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse({ webhook }, undefined, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
