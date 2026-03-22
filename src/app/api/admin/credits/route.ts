/**
 * Admin Credit Adjustments API
 * POST - Create a credit adjustment for a user
 * GET - List credit adjustments with optional filters
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUserAdmin } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      throw APIError.forbidden('Admin access required');
    }

    const body = await req.json();
    const { user_id, amount, reason, effective_at } = body;

    if (!user_id || typeof user_id !== 'string') {
      throw APIError.badRequest('user_id is required');
    }
    if (typeof amount !== 'number' || amount === 0) {
      throw APIError.badRequest('amount must be a non-zero number');
    }
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      throw APIError.badRequest('reason is required');
    }

    const supabase = createAdminClient();

    // Verify target user exists
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', user_id)
      .single();

    if (!targetUser) {
      throw APIError.notFound('User not found');
    }

    // Create the adjustment
    const effectiveDate = effective_at ? new Date(effective_at).toISOString() : new Date().toISOString();

    const { data: adjustment, error: insertError } = await supabase
      .from('credit_adjustments')
      .insert({
        user_id,
        admin_id: user.id,
        amount,
        reason: reason.trim(),
        effective_at: effectiveDate,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create credit adjustment:', insertError);
      throw APIError.internal('Failed to create credit adjustment');
    }

    // Update the usage record's credits_used
    const { data: usageRecord } = await supabase
      .from('usage')
      .select('id, credits_used')
      .eq('user_id', user_id)
      .order('period_start', { ascending: false })
      .limit(1)
      .single();

    if (usageRecord) {
      const newCreditsUsed = Math.max(0, (usageRecord.credits_used || 0) + amount);
      await supabase
        .from('usage')
        .update({ credits_used: newCreditsUsed })
        .eq('id', usageRecord.id);
    }

    return successResponse({
      adjustment,
      usage_updated: !!usageRecord,
      new_credits_used: usageRecord ? Math.max(0, (usageRecord.credits_used || 0) + amount) : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      throw APIError.forbidden('Admin access required');
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('credit_adjustments')
      .select(`
        *,
        target_user:profiles!credit_adjustments_user_id_fkey(id, email),
        admin_user:profiles!credit_adjustments_admin_id_fkey(id, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: adjustments, error } = await query;

    if (error) {
      console.error('Failed to fetch credit adjustments:', error);
      // Fallback: query without joins if foreign key names don't match
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('credit_adjustments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        throw APIError.internal('Failed to fetch credit adjustments');
      }

      return successResponse(fallbackData || []);
    }

    return successResponse(adjustments || []);
  } catch (error) {
    return errorResponse(error);
  }
}
