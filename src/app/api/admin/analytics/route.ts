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

    // Get total tokens used (all time and period)
    const { data: allTimeTokens } = await supabase
      .from('api_logs')
      .select('tokens_total');

    const { data: periodTokens } = await supabase
      .from('api_logs')
      .select('tokens_total, created_at')
      .gte('created_at', startDate.toISOString());

    // Calculate totals
    const totalTokensAllTime = (allTimeTokens || []).reduce((sum, log) => sum + (log.tokens_total || 0), 0);
    const totalTokensPeriod = (periodTokens || []).reduce((sum, log) => sum + (log.tokens_total || 0), 0);

    // Get API call stats
    const { data: apiCalls } = await supabase
      .from('api_logs')
      .select('status_code, created_at')
      .gte('created_at', startDate.toISOString());

    const successfulCalls = (apiCalls || []).filter(call => call.status_code < 400).length;
    const failedCalls = (apiCalls || []).filter(call => call.status_code >= 400).length;

    // Get top users by token usage
    const { data: topUsersData } = await supabase
      .from('api_logs')
      .select('user_id, tokens_total')
      .gte('created_at', startDate.toISOString());

    const userTokenMap: Record<string, number> = {};
    (topUsersData || []).forEach(log => {
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
      .in('id', topUserIds);

    const topUsersWithEmails = topUsers.map(user => ({
      ...user,
      email: profiles?.find(p => p.id === user.userId)?.email || 'Unknown',
    }));

    // Calculate daily usage for chart
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
      planDistribution[sub.plan] = (planDistribution[sub.plan] || 0) + 1;
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
        successRate: apiCalls?.length ? (successfulCalls / apiCalls.length) * 100 : 0,
      },
      topUsers: topUsersWithEmails,
      dailyUsage: dailyUsageArray,
      planDistribution,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
