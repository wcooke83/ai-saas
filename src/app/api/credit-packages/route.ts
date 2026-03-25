/**
 * Public Credit Packages API
 * GET /api/credit-packages - List active global packages (authenticated users)
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const supabase = createAdminClient();
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('id, name, credit_amount, price_cents, active, sort_order')
      .eq('is_global', true)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return successResponse({ packages: packages || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
