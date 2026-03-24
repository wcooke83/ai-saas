/**
 * Usage Export API
 * Exports user's usage history as CSV
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const supabase = createAdminClient();

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = Math.min(parseInt(searchParams.get('limit') || '1000', 10), 10000);

    // Build query
    let query = supabase
      .from('api_logs')
      .select('created_at, endpoint, provider, model, tokens_input, tokens_output, tokens_total, tokens_billed, status_code, duration_ms, error_message')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: logs, error } = await query;

    if (error) {
      throw APIError.internal('Failed to fetch usage logs');
    }

    // Generate CSV
    const headers = [
      'Date',
      'Time',
      'Endpoint',
      'Provider',
      'Model',
      'Input Tokens',
      'Output Tokens',
      'Total Tokens',
      'Billed Tokens',
      'Status',
      'Duration (ms)',
      'Error'
    ];

    const rows = (logs || []).map((log) => {
      const date = new Date(log.created_at);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        log.endpoint || '',
        log.provider || '',
        log.model || '',
        log.tokens_input || 0,
        log.tokens_output || 0,
        log.tokens_total || 0,
        log.tokens_billed || 0,
        (log.status_code ?? 0) < 400 ? 'Success' : 'Error',
        log.duration_ms || 0,
        log.error_message || ''
      ];
    });

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape cells containing commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    // Return CSV file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="usage-history-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
