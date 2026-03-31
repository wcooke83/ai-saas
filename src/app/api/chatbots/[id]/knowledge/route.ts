/**
 * Knowledge Sources API Endpoint
 * GET /api/chatbots/:id/knowledge - List knowledge sources
 * POST /api/chatbots/:id/knowledge - Add new knowledge source
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  getKnowledgeSources,
  createKnowledgeSource,
  checkKnowledgeSourceLimit,
} from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { processKnowledgeSource, processUrlWithCrawl } from '@/lib/chatbots/knowledge/processor';

// Add knowledge source validation schema
const addKnowledgeSchema = z.object({
  type: z.enum(['document', 'url', 'qa_pair', 'text']),
  name: z.string().max(255).optional(),
  content: z.string().max(50000).optional(), // For text type
  url: z.string().url().optional(), // For URL type
  question: z.string().max(1000).optional(), // For Q&A type
  answer: z.string().max(5000).optional(), // For Q&A type
  crawl: z.boolean().optional().default(false), // Enable website crawling
  maxPages: z.number().int().min(1).max(100).optional().default(25), // Max pages to crawl
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    console.log(`[Knowledge API] GET request for chatbot ${id}`);

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      console.log(`[Knowledge API] Authentication failed for chatbot ${id}`);
      throw APIError.unauthorized('Authentication required');
    }
    console.log(`[Knowledge API] Authenticated user ${user.id} for chatbot ${id}`);

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      console.log(`[Knowledge API] Chatbot ${id} not found`);
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      console.log(`[Knowledge API] Access denied: user ${user.id} does not own chatbot ${id} (owner: ${chatbot.user_id})`);
      throw APIError.forbidden('Access denied');
    }
    console.log(`[Knowledge API] Chatbot ownership verified for ${id}`);

    // Get knowledge sources
    const sources = await getKnowledgeSources(id);
    console.log(`[Knowledge API] Retrieved ${sources.length} sources for chatbot ${id}`);

    return successResponse({ sources });
  } catch (error) {
    console.error(`[Knowledge API] Error in GET /api/chatbots/${(await params).id}/knowledge:`, error);
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Check plan limits
    const canAdd = await checkKnowledgeSourceLimit(id, user.plan || 'free');
    if (!canAdd) {
      throw APIError.forbidden(
        'You have reached the maximum number of knowledge sources for your plan. Upgrade to add more.'
      );
    }

    // Validate input
    const input = await parseBody(req, addKnowledgeSchema);

    // Validate based on type
    if (input.type === 'url' && !input.url) {
      throw APIError.badRequest('URL is required for URL type sources');
    }
    if (input.type === 'text' && !input.content) {
      throw APIError.badRequest('Content is required for text type sources');
    }
    if (input.type === 'qa_pair' && (!input.question || !input.answer)) {
      throw APIError.badRequest('Question and answer are required for Q&A type sources');
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
        default:
          name = 'Untitled Source';
      }
    }

    // Create knowledge source
    const source = await createKnowledgeSource({
      chatbot_id: id,
      type: input.type,
      name,
      content: input.content || null,
      url: input.url || null,
      question: input.question || null,
      answer: input.answer || null,
    });

    // Record first knowledge source milestone (fire-and-forget)
    const admin = createAdminClient();
    admin
      .from('chatbots')
      .update({ first_knowledge_source_at: new Date().toISOString() })
      .eq('id', id)
      .is('first_knowledge_source_at', null)
      .then(() => {});

    // Trigger async processing (don't await)
    if (input.type === 'url' && input.crawl) {
      // Crawl mode: discover and process multiple pages
      processUrlWithCrawl(source.id, id, input.url!, input.maxPages).catch(console.error);
    } else {
      processKnowledgeSource(source.id).catch(console.error);
    }

    return successResponse({ source }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
