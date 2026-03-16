/**
 * License Key Redemption API
 * POST - Redeem an AppSumo/marketplace license key to activate a lifetime plan
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

const redeemSchema = z.object({
  key: z
    .string()
    .min(1, 'License key is required')
    .max(100, 'Invalid license key')
    .trim(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { key } = await parseBody(req, redeemSchema);
    const supabase = createAdminClient();

    // Call the database function to redeem
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('redeem_license_key', {
      p_user_id: user.id,
      p_key: key,
    }) as {
      data: Array<{
        success: boolean;
        plan_slug: string | null;
        plan_name: string | null;
        tier: number;
        message: string;
      }> | null;
      error: unknown;
    };

    if (error) {
      console.error('License key redemption error:', error);
      throw APIError.internal('Failed to process license key');
    }

    const result = data?.[0];

    if (!result?.success) {
      throw APIError.badRequest(result?.message || 'Failed to redeem license key');
    }

    return successResponse({
      planSlug: result.plan_slug,
      planName: result.plan_name,
      tier: result.tier,
      message: result.message,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
