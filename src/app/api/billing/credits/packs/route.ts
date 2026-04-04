/**
 * Credit Packs API
 * GET /api/billing/credits/packs - List active global credit packs
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const supabase = createAdminClient();
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('id, name, credit_amount, price_cents, sort_order')
      .eq('is_global', true)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const packs = (packages || []).map((p) => ({
      ...p,
      bonusCredits: 0, // credit_packages table has no bonus_pct column
    }));

    return successResponse({ packs });
  } catch (error) {
    return errorResponse(error);
  }
}
