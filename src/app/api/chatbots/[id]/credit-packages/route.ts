/**
 * Credit Packages API
 * GET  /api/chatbots/:id/credit-packages - List packages
 * PUT  /api/chatbots/:id/credit-packages - Bulk replace packages
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

const packageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  credit_amount: z.number().int().min(1),
  price_cents: z.number().int().min(0),
  stripe_price_id: z.string().min(1).max(500),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

const bulkReplaceSchema = z.object({
  packages: z.array(packageSchema).max(20),
});

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
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('chatbot_id', id)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return successResponse({ packages: packages || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, bulkReplaceSchema);
    const supabase = createAdminClient();

    // Get existing package IDs
    const { data: existing } = await supabase
      .from('credit_packages')
      .select('id')
      .eq('chatbot_id', id);

    const existingIds = new Set((existing || []).map((p: any) => p.id));
    const incomingIds = new Set(input.packages.filter(p => p.id).map(p => p.id));

    // Delete packages that were removed
    const toDelete = [...existingIds].filter(eid => !incomingIds.has(eid));
    if (toDelete.length > 0) {
      await supabase
        .from('credit_packages')
        .delete()
        .eq('chatbot_id', id)
        .in('id', toDelete);
    }

    // Upsert remaining packages
    const upserts = input.packages.map((pkg, idx) => ({
      id: pkg.id || crypto.randomUUID(),
      chatbot_id: id,
      name: pkg.name,
      credit_amount: pkg.credit_amount,
      price_cents: pkg.price_cents,
      stripe_price_id: pkg.stripe_price_id,
      active: pkg.active ?? true,
      sort_order: idx,
    }));

    if (upserts.length > 0) {
      const { error } = await supabase
        .from('credit_packages')
        .upsert(upserts, { onConflict: 'id' });
      if (error) throw error;
    }

    // Return the final state
    const { data: packages } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('chatbot_id', id)
      .order('sort_order', { ascending: true });

    return successResponse({ packages: packages || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
