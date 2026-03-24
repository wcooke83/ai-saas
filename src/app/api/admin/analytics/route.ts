/**
 * Admin Analytics API
 * Returns aggregate metrics for business intelligence
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUserAdmin } from '@/lib/settings';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      throw APIError.forbidden('Admin access required');
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'year'; // year, quarter, month

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get active subscriptions
    const { data: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .in('status', ['active', 'trialing']);

    // Use SQL aggregation to avoid loading all rows into memory
    const startDateISO = startDate.toISOString();

    // All-time token total
    const { data: allTimeSumData } = await supabase
      .from('api_logs')
      .select('tokens_total.sum()');
    const totalTokensAllTime = (allTimeSumData as any)?.[0]?.sum ?? 0;

    // Period token total
    const { data: periodSumData } = await supabase
      .from('api_logs')
      .select('tokens_total.sum()')
      .gte('created_at', startDateISO);
    const totalTokensPeriod = (periodSumData as any)?.[0]?.sum ?? 0;

    // API call stats - count with filters (bounded)
    const { count: totalCallsCount } = await supabase
      .from('api_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDateISO);

    const { count: failedCallsCount } = await supabase
      .from('api_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDateISO)
      .gte('status_code', 400);

    const successfulCalls = (totalCallsCount || 0) - (failedCallsCount || 0);
    const failedCalls = failedCallsCount || 0;

    // Top users by token usage - fetch bounded set
    const { data: topUsersData } = await supabase
      .from('api_logs')
      .select('user_id, tokens_total')
      .gte('created_at', startDateISO)
      .not('user_id', 'is', null)
      .limit(10000);

    const userTokenMap: Record<string, number> = {};
    (topUsersData || []).forEach(log => {
      if (!log.user_id) return;
      userTokenMap[log.user_id] = (userTokenMap[log.user_id] || 0) + (log.tokens_total || 0);
    });

    const topUsers = Object.entries(userTokenMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId, tokens]) => ({ userId, tokens }));

    // Get user emails for top users
    const topUserIds = topUsers.map(u => u.userId);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', topUserIds.length > 0 ? topUserIds : ['_none_']);

    const topUsersWithEmails = topUsers.map(user => ({
      ...user,
      email: profiles?.find(p => p.id === user.userId)?.email || 'Unknown',
    }));

    // Daily usage for chart - bounded
    const { data: periodTokens } = await supabase
      .from('api_logs')
      .select('tokens_total, created_at')
      .gte('created_at', startDateISO)
      .limit(10000);

    const dailyUsage: Record<string, number> = {};
    (periodTokens || []).forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      dailyUsage[date] = (dailyUsage[date] || 0) + (log.tokens_total || 0);
    });

    const dailyUsageArray = Object.entries(dailyUsage)
      .map(([date, tokens]) => ({ date, tokens }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Plan distribution
    const planDistribution: Record<string, number> = {};
    (activeSubscriptions || []).forEach(sub => {
      const plan = sub.plan ?? 'unknown';
      planDistribution[plan] = (planDistribution[plan] || 0) + 1;
    });

    return successResponse({
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      metrics: {
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions?.length || 0,
        totalTokensAllTime,
        totalTokensPeriod,
        apiCallsSuccess: successfulCalls,
        apiCallsFailed: failedCalls,
        successRate: totalCallsCount ? (successfulCalls / totalCallsCount) * 100 : 0,
      },
      topUsers: topUsersWithEmails,
      dailyUsage: dailyUsageArray,
      planDistribution,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
