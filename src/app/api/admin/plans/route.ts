/**
 * Admin Plans API
 * CRUD operations for subscription plans
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, parseQuery, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SubscriptionPlan } from '@/types/billing';

const querySchema = z.object({
  includeInactive: z.enum(['true', 'false']).optional(),
});

const createSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  usageDescription: z.string().max(200).optional().nullable(),
  priceMonthly: z.number().min(0),
  priceYearly: z.number().min(0).optional().nullable(),
  priceLifetime: z.number().min(0).optional().nullable(),
  stripePriceIdMonthly: z.string().optional().nullable(),
  stripePriceIdYearly: z.string().optional().nullable(),
  creditsMonthly: z.number().min(-1),
  creditsRollover: z.boolean().optional().nullable(),
  rateLimitTokens: z.number().min(-1).optional().nullable(),
  rateLimitPeriodSeconds: z.number().min(0).optional().nullable(),
  rateLimitIsHardCap: z.boolean().optional().nullable(),
  features: z.record(z.union([z.boolean(), z.string()])).optional().nullable(),
  apiKeysLimit: z.number().min(-1).optional().nullable(),
  trialDays: z.number().min(0).optional().nullable(),
  trialCredits: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  isFeatured: z.boolean().optional().nullable(),
  isHidden: z.boolean().optional().nullable(),
  displayOrder: z.number().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQuery(req, querySchema);
    const supabase = createAdminClient();

    let queryBuilder = supabase
      .from('subscription_plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (query.includeInactive !== 'true') {
      queryBuilder = queryBuilder.eq('is_active', true);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw APIError.internal('Failed to fetch plans');
    }

    return successResponse(data as SubscriptionPlan[]);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Debug: log that we received the request
    console.log('[Admin Plans POST] Starting request');

    const admin = await requireAdmin(req);
    console.log('[Admin Plans POST] Admin verified:', admin.id);

    const input = await parseBody(req, createSchema);
    console.log('[Admin Plans POST] Input parsed:', input.slug);

    const supabase = createAdminClient();

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('slug', input.slug)
      .single();

    if (existing) {
      throw APIError.badRequest('A plan with this slug already exists');
    }

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        slug: input.slug,
        name: input.name,
        description: input.description,
        usage_description: input.usageDescription,
        price_monthly_cents: input.priceMonthly,
        price_yearly_cents: input.priceYearly,
        price_lifetime_cents: input.priceLifetime,
        stripe_price_id_monthly: input.stripePriceIdMonthly,
        stripe_price_id_yearly: input.stripePriceIdYearly,
        credits_monthly: input.creditsMonthly,
        credits_rollover: input.creditsRollover ?? false,
        rate_limit_tokens: input.rateLimitTokens,
        rate_limit_period_seconds: input.rateLimitPeriodSeconds,
        rate_limit_is_hard_cap: input.rateLimitIsHardCap ?? true,
        features: input.features ?? {},
        api_keys_limit: input.apiKeysLimit ?? 2,
        trial_days: input.trialDays ?? 0,
        trial_credits: input.trialCredits,
        is_active: input.isActive ?? true,
        is_featured: input.isFeatured ?? false,
        is_hidden: input.isHidden ?? false,
        display_order: input.displayOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal('Failed to create plan');
    }

    console.log('[Admin Plans POST] Plan created successfully:', data?.id);
    return successResponse(data as SubscriptionPlan, undefined, 201);
  } catch (error) {
    console.error('[Admin Plans POST] Error:', error);
    // Ensure we always return a JSON response
    try {
      return errorResponse(error);
    } catch (responseError) {
      console.error('[Admin Plans POST] Failed to create error response:', responseError);
      return NextResponse.json(
        { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
        { status: 500 }
      );
    }
  }
}
