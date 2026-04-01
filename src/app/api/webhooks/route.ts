/**
 * Webhooks API
 * GET  /api/webhooks — list user's webhooks
 * POST /api/webhooks — create a new webhook
 */

import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { validateWebhookURL } from '@/lib/webhooks/url-validation';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const supabase = createAdminClient();
    const { data: webhooks, error } = await supabase
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

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const body = await req.json();
    const { url, events, description } = body as {
      url: string;
      events: string[];
      description?: string;
    };

    if (!url || typeof url !== 'string') {
      throw APIError.badRequest('url is required');
    }

    // SSRF protection: validate URL scheme + DNS resolution
    const urlCheck = await validateWebhookURL(url);
    if (!urlCheck.valid) {
      throw APIError.badRequest(urlCheck.error || 'Invalid webhook URL');
    }

    if (!Array.isArray(events)) {
      throw APIError.badRequest('events must be an array');
    }

    const secret = randomBytes(32).toString('hex');

    const supabase = createAdminClient();
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        user_id: user.id,
        url,
        secret,
        events,
        is_active: true,
      })
      .select('id, url, events, is_active, created_at')
      .single();

    if (error) throw error;

    // Return secret only at creation time — it will never be shown again
    return successResponse({ webhook: { ...webhook, secret } }, undefined, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
