/**
 * Re-embed All Knowledge Sources
 * POST /api/chatbots/:id/knowledge/reembed-all
 *
 * Re-processes all completed knowledge sources with the current embedding provider.
 * This aligns all chunks to the same embedding model so similarity search works correctly.
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { reprocessKnowledgeSource } from '@/lib/chatbots/knowledge/processor';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { data: sources, error } = await supabase
      .from('knowledge_sources')
      .select('id, name')
      .eq('chatbot_id', id)
      .in('status', ['completed', 'failed']);

    if (error) throw error;
    if (!sources || sources.length === 0) {
      return successResponse({ queued: 0, message: 'No sources to re-embed' });
    }

    // Mark all as processing and kick off reprocess in background
    let queued = 0;
    for (const source of sources) {
      reprocessKnowledgeSource(source.id).catch((err) => {
        console.error(`[ReembedAll] Failed for source ${source.id} ("${source.name}"):`, err);
      });
      queued++;
    }

    return successResponse({
      queued,
      message: `Re-embedding ${queued} source(s) with current embedding provider. Status will update automatically.`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
