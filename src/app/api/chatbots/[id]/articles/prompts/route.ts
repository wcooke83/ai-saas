/**
 * Extraction Prompts API
 * GET  /api/chatbots/:id/articles/prompts - List prompts
 * POST /api/chatbots/:id/articles/prompts - Create prompt
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

const DEFAULT_PROMPTS = [
  'What are your business hours or opening times?',
  'Where are you located and how can customers find you?',
  'What contact information is available (phone, email, social)?',
  'What products or services do you offer?',
  'What is your pricing or rate structure?',
  'What is your return, refund, or cancellation policy?',
  'What shipping or delivery options are available?',
  'What payment methods do you accept?',
  'What are the most frequently asked questions?',
  'What promotions, discounts, or loyalty programs are available?',
];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { data: prompts, error } = await supabase
      .from('article_extraction_prompts')
      .select('*')
      .eq('chatbot_id', id)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // If no prompts exist yet, seed defaults
    if (!prompts || prompts.length === 0) {
      const inserts = DEFAULT_PROMPTS.map((question, i) => ({
        chatbot_id: id,
        question,
        sort_order: i,
        enabled: true,
      }));

      const { data: seeded, error: seedError } = await supabase
        .from('article_extraction_prompts')
        .insert(inserts)
        .select();

      if (seedError) throw seedError;
      return successResponse({ prompts: seeded || [] });
    }

    return successResponse({ prompts });
  } catch (error) {
    return errorResponse(error);
  }
}

const createPromptSchema = z.object({
  question: z.string().min(3).max(500),
  enabled: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, createPromptSchema);

    const supabase = createAdminClient();

    // Get max sort_order
    const { data: existing } = await supabase
      .from('article_extraction_prompts')
      .select('sort_order')
      .eq('chatbot_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data: prompt, error } = await supabase
      .from('article_extraction_prompts')
      .insert({
        chatbot_id: id,
        question: input.question,
        enabled: input.enabled,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse({ prompt }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
