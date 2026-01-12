/**
 * Auto Top-up Settings API
 * Manage auto top-up configuration
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AutoTopupSettings } from '@/types/billing';

const updateSchema = z.object({
  enabled: z.boolean().optional(),
  threshold: z.number().min(10).max(10000).optional(),
  amount: z.number().min(100).max(50000).optional(),
  maxMonthly: z.number().min(100).max(100000).nullable().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('user_credits')
      .select(
        'auto_topup_enabled, auto_topup_threshold, auto_topup_amount, auto_topup_max_monthly, auto_topup_this_month, default_payment_method_id'
      )
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw APIError.internal('Failed to fetch auto top-up settings');
    }

    const settings: AutoTopupSettings = {
      enabled: data?.auto_topup_enabled ?? false,
      threshold: data?.auto_topup_threshold ?? 100,
      amount: data?.auto_topup_amount ?? 1000,
      maxMonthly: data?.auto_topup_max_monthly ?? null,
      thisMonth: data?.auto_topup_this_month ?? 0,
      hasPaymentMethod: !!data?.default_payment_method_id,
    };

    return successResponse(settings);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const input = await parseBody(req, updateSchema);
    const supabase = createAdminClient();

    // If enabling, check for payment method
    if (input.enabled === true) {
      const { data: credits } = await supabase
        .from('user_credits')
        .select('default_payment_method_id')
        .eq('user_id', user.id)
        .single();

      if (!credits?.default_payment_method_id) {
        throw APIError.badRequest(
          'Please add a payment method before enabling auto top-up'
        );
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.enabled !== undefined) {
      updateData.auto_topup_enabled = input.enabled;
    }
    if (input.threshold !== undefined) {
      updateData.auto_topup_threshold = input.threshold;
    }
    if (input.amount !== undefined) {
      updateData.auto_topup_amount = input.amount;
    }
    if (input.maxMonthly !== undefined) {
      updateData.auto_topup_max_monthly = input.maxMonthly;
    }

    const { data, error } = await supabase
      .from('user_credits')
      .update(updateData)
      .eq('user_id', user.id)
      .select(
        'auto_topup_enabled, auto_topup_threshold, auto_topup_amount, auto_topup_max_monthly, auto_topup_this_month, default_payment_method_id'
      )
      .single();

    if (error) {
      throw APIError.internal('Failed to update auto top-up settings');
    }

    const settings: AutoTopupSettings = {
      enabled: data?.auto_topup_enabled ?? false,
      threshold: data?.auto_topup_threshold ?? 100,
      amount: data?.auto_topup_amount ?? 1000,
      maxMonthly: data?.auto_topup_max_monthly ?? null,
      thisMonth: data?.auto_topup_this_month ?? 0,
      hasPaymentMethod: !!data?.default_payment_method_id,
    };

    return successResponse(settings);
  } catch (error) {
    return errorResponse(error);
  }
}
