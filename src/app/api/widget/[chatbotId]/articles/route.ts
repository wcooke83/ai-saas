/**
 * Widget Help Articles API
 * GET /api/widget/:chatbotId/articles - Search/list help articles (public)
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getChatbotCorsOrigin } from '@/lib/api/cors';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const supabase = createAdminClient();

    const q = req.nextUrl.searchParams.get('q')?.trim();

    let query = supabase
      .from('help_articles')
      .select('id, title, summary, body, sort_order, created_at')
      .eq('chatbot_id', chatbotId)
      .eq('published', true)
      .order('sort_order', { ascending: true });

    // Full-text search if query provided
    if (q) {
      // Sanitize: strip non-alphanumeric chars to prevent tsquery syntax errors
      const words = q.split(/\s+/).filter(Boolean).map(w => w.replace(/[^a-zA-Z0-9]/g, '')).filter(w => w.length > 0);
      if (words.length > 0) {
        const tsquery = words.map(w => `${w}:*`).join(' & ');
        query = query.textSearch('search_vector', tsquery);
      }
    }

    const { data: articles, error } = await query.limit(50);

    if (error) {
      console.error('[Widget:Articles] Query error:', error);
      return corsResponse({ success: false, error: { message: 'Failed to fetch articles' } }, 500, req, chatbotId);
    }

    return corsResponse({ success: true, data: { articles: articles || [] } }, 200, req, chatbotId);
  } catch (error) {
    console.error('[Widget:Articles] Error:', error);
    return new Response(JSON.stringify({ success: false, error: { message: 'Internal server error' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function OPTIONS(req: NextRequest, { params }: RouteParams) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

async function corsResponse(body: unknown, status: number, req: NextRequest, chatbotId: string) {
  let origin = '*';
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('chatbots').select('allowed_origins').eq('id', chatbotId).single();
    if (data) origin = getChatbotCorsOrigin((data as any).allowed_origins, req.headers.get('origin'));
  } catch {}
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
