/**
 * Admin Trials API
 * CRUD operations for trial links
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, parseQuery, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TrialLink, TrialLinkWithPlan } from '@/types/billing';

const querySchema = z.object({
  includeInactive: z.enum(['true', 'false']).optional(),
  planId: z.string().uuid().optional(),
});

const createSchema = z.object({
  code: z.string().min(3).max(50).regex(/^[A-Z0-9-]+$/i),
  planId: z.string().uuid(),
  durationDays: z.number().min(1).max(365),
  creditsLimit: z.number().min(1).optional(),
  featuresOverride: z.record(z.union([z.boolean(), z.string()])).optional(),
  maxRedemptions: z.number().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
  name: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const query = parseQuery(req, querySchema);
    const supabase = createAdminClient();

    let queryBuilder = supabase
      .from('trial_links')
      .select(`
        *,
        plan:subscription_plans (
          id,
          slug,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (query.includeInactive !== 'true') {
      queryBuilder = queryBuilder.eq('is_active', true);
    }

    if (query.planId) {
      queryBuilder = queryBuilder.eq('plan_id', query.planId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw APIError.internal('Failed to fetch trial links');
    }

    return successResponse(data as unknown as TrialLinkWithPlan[]);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin(req);
    const input = await parseBody(req, createSchema);
    const supabase = createAdminClient();

    // Check for duplicate code
    const { data: existing } = await supabase
      .from('trial_links')
      .select('id')
      .ilike('code', input.code)
      .single();

    if (existing) {
      throw APIError.badRequest('A trial link with this code already exists');
    }

    // Verify plan exists
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('id', input.planId)
      .single();

    if (!plan) {
      throw APIError.badRequest('Plan not found');
    }

    const { data, error } = await supabase
      .from('trial_links')
      .insert({
        code: input.code.toUpperCase(),
        plan_id: input.planId,
        duration_days: input.durationDays,
        credits_limit: input.creditsLimit,
        features_override: input.featuresOverride,
        max_redemptions: input.maxRedemptions,
        expires_at: input.expiresAt,
        name: input.name,
        description: input.description,
        created_by: user.id,
        is_active: true,
      })
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
      throw APIError.internal('Failed to create trial link');
    }

    return successResponse(data as unknown as TrialLinkWithPlan, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
