/**
 * Admin Trial API - Individual Trial Operations
 * GET, PUT, DELETE for a specific trial link
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TrialLinkWithPlan } from '@/types/billing';

const updateSchema = z.object({
  durationDays: z.number().min(1).max(365).optional(),
  creditsLimit: z.number().min(1).optional().nullable(),
  featuresOverride: z.record(z.union([z.boolean(), z.string()])).optional().nullable(),
  maxRedemptions: z.number().min(1).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  name: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

interface RouteContext {
  params: Promise<{ code: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    const { code } = await context.params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('trial_links')
      .select(`
        *,
        plan:subscription_plans (
          id,
          slug,
          name,
          credits_monthly,
          features
        ),
        redemptions:trial_redemptions (
          id,
          user_id,
          redeemed_at,
          expires_at,
          status
        )
      `)
      .ilike('code', code)
      .single();

    if (error || !data) {
      throw APIError.notFound('Trial link not found');
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    const { code } = await context.params;
    const input = await parseBody(req, updateSchema);
    const supabase = createAdminClient();

    // Check if trial exists
    const { data: existing } = await supabase
      .from('trial_links')
      .select('id')
      .ilike('code', code)
      .single();

    if (!existing) {
      throw APIError.notFound('Trial link not found');
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.durationDays !== undefined) updateData.duration_days = input.durationDays;
    if (input.creditsLimit !== undefined) updateData.credits_limit = input.creditsLimit;
    if (input.featuresOverride !== undefined) updateData.features_override = input.featuresOverride;
    if (input.maxRedemptions !== undefined) updateData.max_redemptions = input.maxRedemptions;
    if (input.expiresAt !== undefined) updateData.expires_at = input.expiresAt;
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;

    const { data, error } = await supabase
      .from('trial_links')
      .update(updateData)
      .eq('id', existing.id)
      .select(`
        *,
        plan:subscription_plans (
          id,
          slug,
          name
        )
      `)
      .single();

    if (error) {
      throw APIError.internal('Failed to update trial link');
    }

    return successResponse(data as unknown as TrialLinkWithPlan);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    const { code } = await context.params;
    const supabase = createAdminClient();

    // Check if trial exists
    const { data: trial } = await supabase
      .from('trial_links')
      .select('id, redemptions_count')
      .ilike('code', code)
      .single();

    if (!trial) {
      throw APIError.notFound('Trial link not found');
    }

    // Warn if has redemptions (but allow delete)
    const hasRedemptions = (trial.redemptions_count ?? 0) > 0;

    const { error } = await supabase
      .from('trial_links')
      .delete()
      .eq('id', trial.id);

    if (error) {
      throw APIError.internal('Failed to delete trial link');
    }

    return successResponse({
      deleted: true,
      hadRedemptions: hasRedemptions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
