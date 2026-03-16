/**
 * Memory Check API
 * POST /api/widget/:chatbotId/memory/check - Check if email has existing conversation memory
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'email is required' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabase = createAdminClient();

    // Check if this email has a verified visitor_id mapping
    const { data: mapping } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('conversation_memory_emails')
      .select('visitor_id')
      .eq('chatbot_id', chatbotId)
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!mapping) {
      return new Response(
        JSON.stringify({ success: true, data: { has_memory: false } }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Check if that visitor actually has memory data
    const { data: memory } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('conversation_memory')
      .select('id, key_facts')
      .eq('chatbot_id', chatbotId)
      .eq('visitor_id', mapping.visitor_id)
      .single();

    const hasMemory = !!(memory && memory.key_facts && Array.isArray(memory.key_facts) && memory.key_facts.length > 0);

    return new Response(
      JSON.stringify({ success: true, data: { has_memory: hasMemory } }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Memory check error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
