/**
 * Chatbot Surveys API
 * GET /api/chatbots/:id/surveys - Get all post-chat survey responses for a chatbot
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const isOwner = await checkChatbotOwnership(chatbotId, user.id, supabase as unknown as TypedSupabaseClient);
    if (!isOwner) {
      throw APIError.forbidden('Access denied');
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build query
    let query = (supabase as any)
      .from('chatbot_survey_responses')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', chatbotId);

    // Apply date filters
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Fetch responses
    const { data: responses, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch survey responses:', error);
      throw APIError.internal('Failed to fetch survey responses');
    }

    // Calculate stats
    const allResponsesQuery = (supabase as any)
      .from('chatbot_survey_responses')
      .select('responses')
      .eq('chatbot_id', chatbotId);
    
    if (dateFrom) {
      allResponsesQuery.gte('created_at', dateFrom);
    }
    if (dateTo) {
      allResponsesQuery.lte('created_at', dateTo);
    }

    const { data: allResponses } = await allResponsesQuery;

    // Calculate rating stats
    let totalRating = 0;
    let ratingCount = 0;
    const ratingDistribution: Record<number, number> = {};

    allResponses?.forEach((r: any) => {
      const responses = r.responses || {};
      Object.values(responses).forEach((value) => {
        if (typeof value === 'number' && value >= 1 && value <= 5) {
          totalRating += value;
          ratingCount++;
          ratingDistribution[value] = (ratingDistribution[value] || 0) + 1;
        }
      });
    });

    const stats = {
      total_responses: count || 0,
      avg_rating: ratingCount > 0 ? totalRating / ratingCount : null,
      rating_distribution: ratingDistribution,
      rating_count: ratingCount,
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          responses: responses || [],
          total: count || 0,
          stats,
          limit,
          offset,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ success: false, error: { message: error.message, code: error.code } }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Surveys API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
