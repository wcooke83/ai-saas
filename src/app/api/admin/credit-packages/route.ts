/**
 * Admin Credit Packages API
 * GET  /api/admin/credit-packages - List all global packages
 * POST /api/admin/credit-packages - Create a new global package
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUserAdmin } from '@/lib/settings';

const createPackageSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  credit_amount: z.number().int().min(1),
  price_cents: z.number().int().min(1),
  stripe_price_id: z.string().min(1).max(500).refine(s => s.startsWith('price_'), {
    message: 'Stripe Price ID must start with "price_"',
  }),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const admin = await isUserAdmin(user.id);
    if (!admin) throw APIError.forbidden('Admin access required');

    const supabase = createAdminClient();
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('is_global', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return successResponse({ packages: packages || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const admin = await isUserAdmin(user.id);
    if (!admin) throw APIError.forbidden('Admin access required');

    const body = await req.json();
    const input = createPackageSchema.parse(body);

    const supabase = createAdminClient();

    // Get max sort_order for auto-ordering
    const { data: existing } = await supabase
      .from('credit_packages')
      .select('sort_order')
      .eq('is_global', true)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = input.sort_order || ((existing?.[0]?.sort_order ?? -1) + 1);

    const { data: pkg, error } = await supabase
      .from('credit_packages')
      .insert({
        chatbot_id: null,
        is_global: true,
        name: input.name,
        description: input.description || null,
        credit_amount: input.credit_amount,
        price_cents: input.price_cents,
        stripe_price_id: input.stripe_price_id,
        active: input.active,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse({ package: pkg }, undefined, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(APIError.badRequest(error.errors.map(e => e.message).join(', ')));
    }
    return errorResponse(error);
  }
}
