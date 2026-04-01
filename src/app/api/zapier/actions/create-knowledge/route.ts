/**
 * Zapier Action: Create Knowledge Source
 * POST /api/zapier/actions/create-knowledge
 *
 * Adds a knowledge source (URL, text, or Q&A pair) to a chatbot.
 * Processing happens asynchronously -- the response returns immediately
 * with source metadata while embedding generation runs in the background.
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  createKnowledgeSource,
  checkKnowledgeSourceLimit,
} from '@/lib/chatbots/api';
import { processKnowledgeSource } from '@/lib/chatbots/knowledge/processor';

const createKnowledgeSchema = z
  .object({
    chatbot_id: z.string().uuid('chatbot_id must be a valid UUID'),
    type: z.enum(['url', 'text', 'qa_pair']),
    name: z.string().max(255).optional(),
    url: z.string().url().optional(),
    content: z.string().max(50000).optional(),
    question: z.string().max(1000).optional(),
    answer: z.string().max(5000).optional(),
  })
  .refine(
    (d) => {
      if (d.type === 'url') return !!d.url;
      if (d.type === 'text') return !!d.content;
      if (d.type === 'qa_pair') return !!d.question && !!d.answer;
      return false;
    },
    { message: 'Required fields depend on type: url needs url, text needs content, qa_pair needs question+answer' },
  );

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    const user = await authenticateAPIKeyStrict(authHeader);

    const body = await req.json();
    const input = createKnowledgeSchema.parse(body);

    // Verify ownership
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, user_id')
      .eq('id', input.chatbot_id)
      .eq('user_id', user.id)
      .single();

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found or access denied' },
        { status: 404 },
      );
    }

    // Check plan limits
    const canAdd = await checkKnowledgeSourceLimit(input.chatbot_id, user.plan || 'base');
    if (!canAdd) {
      return NextResponse.json(
        { error: 'Knowledge source limit reached for your plan. Please upgrade.' },
        { status: 403 },
      );
    }

    // Generate name if not provided
    let name = input.name;
    if (!name) {
      switch (input.type) {
        case 'url':
          name = new URL(input.url!).hostname;
          break;
        case 'text':
          name = input.content!.substring(0, 50) + '...';
          break;
        case 'qa_pair':
          name = input.question!.substring(0, 50) + '...';
          break;
      }
    }

    const source = await createKnowledgeSource({
      chatbot_id: input.chatbot_id,
      type: input.type,
      name: name || 'Untitled',
      content: input.content || null,
      url: input.url || null,
      question: input.question || null,
      answer: input.answer || null,
    });

    // Trigger async processing (don't await)
    processKnowledgeSource(source.id).catch(console.error);

    return NextResponse.json({
      id: source.id,
      chatbot_id: input.chatbot_id,
      type: source.type,
      name: source.name,
      status: 'processing',
      created_at: source.created_at,
    }, { status: 201 });
  } catch (err) {
    console.error('[Zapier:CreateKnowledge] Error:', err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Validation error: ${err.errors.map((e) => e.message).join(', ')}` },
        { status: 400 },
      );
    }

    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
