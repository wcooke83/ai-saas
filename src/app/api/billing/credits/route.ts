/**
 * Credits API
 * Get credit balance and transaction history
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, parseQuery } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CreditBalance, CreditTransaction } from '@/types/billing';

const querySchema = z.object({
  includeTransactions: z.enum(['true', 'false']).optional(),
  transactionLimit: z.string().regex(/^\d+$/).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const query = parseQuery(req, querySchema);
    const supabase = createAdminClient();

    // Get credit balance using RPC function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: balanceData, error: balanceError } = await (supabase.rpc as any)(
      'get_credit_balance',
      { p_user_id: user.id }
    );

    if (balanceError) {
      console.error('Error fetching credit balance:', balanceError);
    }

    // Transform to our type
    const balance: CreditBalance = {
      planAllocation: balanceData?.[0]?.plan_allocation ?? 100,
      planUsed: balanceData?.[0]?.plan_used ?? 0,
      planRemaining: balanceData?.[0]?.plan_remaining ?? 100,
      purchasedCredits: balanceData?.[0]?.purchased_credits ?? 0,
      bonusCredits: balanceData?.[0]?.bonus_credits ?? 0,
      totalAvailable: balanceData?.[0]?.total_available ?? 100,
      isUnlimited: balanceData?.[0]?.plan_allocation === -1,
    };

    // Get transactions if requested
    let transactions: CreditTransaction[] = [];
    if (query.includeTransactions === 'true') {
      const limit = parseInt(query.transactionLimit || '20');
      const { data: txData } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 100));

      transactions = (txData || []) as CreditTransaction[];
    }

    return successResponse({
      balance,
      transactions: query.includeTransactions === 'true' ? transactions : undefined,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
