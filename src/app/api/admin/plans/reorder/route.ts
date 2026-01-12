/**
 * Admin Plans Reorder API
 * Bulk update display_order for plans
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

const reorderSchema = z.object({
  planIds: z.array(z.string().uuid()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const input = await parseBody(req, reorderSchema);
    const supabase = createAdminClient();

    // Update display_order for each plan based on array position
    const updates = input.planIds.map((id, index) => ({
      id,
      display_order: index,
      updated_at: new Date().toISOString(),
    }));

    // Use a transaction-like approach with upsert
    for (const update of updates) {
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          display_order: update.display_order,
          updated_at: update.updated_at,
        })
        .eq('id', update.id);

      if (error) {
        console.error(`Failed to update plan ${update.id}:`, error);
        throw APIError.internal(`Failed to update plan order`);
      }
    }

    return successResponse({
      success: true,
      updated: updates.length,
      message: 'Plan order updated successfully'
    });
  } catch (error) {
    return errorResponse(error);
  }
}
