/**
 * Admin Plan API - Individual Plan Operations
 * GET, PUT, DELETE for a specific plan
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SubscriptionPlan } from '@/types/billing';

const updateSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional().nullable(),
  name: z.string().min(1).max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  usageDescription: z.string().max(200).optional().nullable(),
  priceMonthly: z.number().min(0).optional().nullable(),
  priceYearly: z.number().min(0).optional().nullable(),
  stripePriceIdMonthly: z.string().optional().nullable(),
  stripePriceIdYearly: z.string().optional().nullable(),
  creditsMonthly: z.number().min(-1).optional().nullable(),
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

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw APIError.notFound('Plan not found');
    }

    return successResponse(data as SubscriptionPlan);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await context.params;
    const input = await parseBody(req, updateSchema);
    const supabase = createAdminClient();

    // Check if plan exists
    const { data: existing } = await supabase
      .from('subscription_plans')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (!existing) {
      throw APIError.notFound('Plan not found');
    }

    // Check for duplicate slug if updating slug
    if (input.slug && input.slug !== existing.slug) {
      const { data: duplicateSlug } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('slug', input.slug)
        .single();

      if (duplicateSlug) {
        throw APIError.badRequest('A plan with this slug already exists');
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.usageDescription !== undefined) updateData.usage_description = input.usageDescription;
    if (input.priceMonthly !== undefined) updateData.price_monthly_cents = input.priceMonthly;
    if (input.priceYearly !== undefined) updateData.price_yearly_cents = input.priceYearly;
    if (input.stripePriceIdMonthly !== undefined) updateData.stripe_price_id_monthly = input.stripePriceIdMonthly;
    if (input.stripePriceIdYearly !== undefined) updateData.stripe_price_id_yearly = input.stripePriceIdYearly;
    if (input.creditsMonthly !== undefined) updateData.credits_monthly = input.creditsMonthly;
    if (input.creditsRollover !== undefined) updateData.credits_rollover = input.creditsRollover;
    if (input.rateLimitTokens !== undefined) updateData.rate_limit_tokens = input.rateLimitTokens;
    if (input.rateLimitPeriodSeconds !== undefined) updateData.rate_limit_period_seconds = input.rateLimitPeriodSeconds;
    if (input.rateLimitIsHardCap !== undefined) updateData.rate_limit_is_hard_cap = input.rateLimitIsHardCap;
    if (input.features !== undefined) updateData.features = input.features;
    if (input.apiKeysLimit !== undefined) updateData.api_keys_limit = input.apiKeysLimit;
    if (input.trialDays !== undefined) updateData.trial_days = input.trialDays;
    if (input.trialCredits !== undefined) updateData.trial_credits = input.trialCredits;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;
    if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;
    if (input.isHidden !== undefined) updateData.is_hidden = input.isHidden;
    if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;

    const { data, error } = await supabase
      .from('subscription_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw APIError.internal('Failed to update plan');
    }

    return successResponse(data as SubscriptionPlan);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await context.params;
    const supabase = createAdminClient();

    // Check if plan exists and has subscriptions
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (!plan) {
      throw APIError.notFound('Plan not found');
    }

    // Prevent deleting built-in plans
    if (['free', 'pro', 'enterprise'].includes(plan.slug)) {
      throw APIError.badRequest('Cannot delete built-in plans. Deactivate them instead.');
    }

    // Check for active subscriptions
    const { count } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('plan_id', id);

    if (count && count > 0) {
      throw APIError.badRequest(
        `Cannot delete plan with ${count} active subscription(s). Migrate users first.`
      );
    }

    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);

    if (error) {
      throw APIError.internal('Failed to delete plan');
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
