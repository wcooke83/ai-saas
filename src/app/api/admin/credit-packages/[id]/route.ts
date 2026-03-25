/**
 * Admin Credit Package API (single)
 * PUT    /api/admin/credit-packages/:id - Update a package
 * DELETE /api/admin/credit-packages/:id - Delete a package
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUserAdmin } from '@/lib/settings';

const updatePackageSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  credit_amount: z.number().int().min(1).optional(),
  price_cents: z.number().int().min(1).optional(),
  stripe_price_id: z.string().min(1).max(500).refine(s => s.startsWith('price_'), {
    message: 'Stripe Price ID must start with "price_"',
  }).optional(),
  active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireAuth(req);
    const admin = await isUserAdmin(user.id);
    if (!admin) throw APIError.forbidden('Admin access required');

    const body = await req.json();
    const input = updatePackageSchema.parse(body);

    const supabase = createAdminClient();

    // Verify package exists and is global
    const { data: existing } = await supabase
      .from('credit_packages')
      .select('id')
      .eq('id', id)
      .eq('is_global', true)
      .single();

    if (!existing) throw APIError.notFound('Package not found');

    const { data: pkg, error } = await supabase
      .from('credit_packages')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ package: pkg });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(APIError.badRequest(error.errors.map(e => e.message).join(', ')));
    }
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireAuth(req);
    const admin = await isUserAdmin(user.id);
    if (!admin) throw APIError.forbidden('Admin access required');

    const supabase = createAdminClient();

    // Check if package has any completed purchases
    const { count } = await supabase
      .from('credit_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('package_id', id)
      .eq('status', 'completed');

    if (count && count > 0) {
      // Soft delete - just deactivate
      const { error } = await supabase
        .from('credit_packages')
        .update({ active: false })
        .eq('id', id)
        .eq('is_global', true);

      if (error) throw error;

      return successResponse({ deactivated: true, message: 'Package has purchase history and was deactivated instead of deleted' });
    }

    const { error } = await supabase
      .from('credit_packages')
      .delete()
      .eq('id', id)
      .eq('is_global', true);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
