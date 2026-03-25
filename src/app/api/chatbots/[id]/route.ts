/**
 * Single Chatbot API Endpoint
 * GET /api/chatbots/:id - Get chatbot details
 * PATCH /api/chatbots/:id - Update chatbot
 * DELETE /api/chatbots/:id - Delete chatbot
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  updateChatbot,
  deleteChatbot,
  generateUniqueSlug,
} from '@/lib/chatbots/api';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, type WidgetConfig, type FileUploadConfig } from '@/lib/chatbots/types';
import { checkReembedStatus } from '@/lib/chatbots/reembed-check';

// Update chatbot validation schema
const updateChatbotSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  system_prompt: z.string().min(10).max(5000).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(100).max(4096).optional(),
  enable_prompt_protection: z.boolean().optional(),
  widget_config: z.record(z.unknown()).optional(),
  logo_url: z.string().url().nullable().optional(),
  welcome_message: z.string().max(500).optional(),
  placeholder_text: z.string().max(200).optional(),
  pre_chat_form_config: z.record(z.unknown()).optional(),
  post_chat_survey_config: z.record(z.unknown()).optional(),
  status: z.enum(['draft', 'active', 'paused', 'archived']).optional(),
  language: z.string().max(10).optional(),
  memory_enabled: z.boolean().optional(),
  memory_days: z.number().min(0).max(365).optional(),
  session_ttl_hours: z.number().min(1).max(720).optional(),
  file_upload_config: z.record(z.unknown()).optional(),
  proactive_messages_config: z.record(z.unknown()).optional(),
  transcript_config: z.record(z.unknown()).optional(),
  escalation_config: z.record(z.unknown()).optional(),
  feedback_config: z.record(z.unknown()).optional(),
  live_handoff_config: z.record(z.unknown()).optional(),
  telegram_config: z.record(z.unknown()).optional(),
  live_fetch_threshold: z.number().min(0.5).max(0.95).optional(),
  credit_exhaustion_mode: z.enum(['tickets', 'contact_form', 'purchase_credits', 'help_articles']).optional(),
  credit_exhaustion_config: z.record(z.unknown()).optional(),
  monthly_message_limit: z.number().min(0).optional(),
  messages_this_month: z.number().min(0).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Get chatbot (filter by user_id to avoid RLS "public read" policy leaking other users' chatbots)
    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const reembedStatus = await checkReembedStatus(id);

    return successResponse({ chatbot, ...reembedStatus });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Get existing chatbot
    const existing = await getChatbot(id);
    if (!existing || existing.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Validate input
    const input = await parseBody(req, updateChatbotSchema);

    // Handle slug update if name changed
    let slug = existing.slug;
    if (input.name && input.name !== existing.name) {
      slug = await generateUniqueSlug(user.id, input.name);
    }

    // Merge widget config if provided
    let widgetConfig = existing.widget_config as WidgetConfig;
    if (input.widget_config) {
      widgetConfig = {
        ...DEFAULT_WIDGET_CONFIG,
        ...widgetConfig,
        ...(input.widget_config as Partial<WidgetConfig>),
      };
    }

    // Merge file upload config if provided
    let fileUploadConfig = (existing as any).file_upload_config as FileUploadConfig | undefined;
    if (input.file_upload_config) {
      const existingUploadConfig = fileUploadConfig || DEFAULT_FILE_UPLOAD_CONFIG;
      const inputConfig = input.file_upload_config as Partial<FileUploadConfig>;
      fileUploadConfig = {
        ...existingUploadConfig,
        ...inputConfig,
        allowed_types: {
          ...existingUploadConfig.allowed_types,
          ...(inputConfig.allowed_types || {}),
        },
      };
    }

    // Build update payload
    const updates: Record<string, unknown> = {
      ...(input as Record<string, unknown>),
      slug,
      widget_config: widgetConfig,
      ...(fileUploadConfig ? { file_upload_config: fileUploadConfig } : {}),
    };

    // Use a single timestamp for consistency when both change in the same save
    const now = new Date().toISOString();

    // Detect if custom text actually changed (compare with existing values)
    const textActuallyChanged =
      (input.welcome_message !== undefined && input.welcome_message !== (existing.welcome_message ?? '')) ||
      (input.placeholder_text !== undefined && input.placeholder_text !== (existing.placeholder_text ?? '')) ||
      (input.pre_chat_form_config !== undefined && JSON.stringify(input.pre_chat_form_config) !== JSON.stringify(existing.pre_chat_form_config)) ||
      (input.post_chat_survey_config !== undefined && JSON.stringify(input.post_chat_survey_config) !== JSON.stringify(existing.post_chat_survey_config));

    if (textActuallyChanged) {
      updates.custom_text_updated_at = now;
    }

    // Detect if language actually changed
    if (input.language !== undefined && input.language !== existing.language) {
      updates.language_updated_at = now;
    }

    // Update chatbot
    const chatbot = await updateChatbot(id, updates as Parameters<typeof updateChatbot>[1]);

    return successResponse({ chatbot });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Get existing chatbot
    const existing = await getChatbot(id);
    if (!existing || existing.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Delete chatbot (cascades to all related data)
    await deleteChatbot(id);

    return successResponse({ deleted: true });
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
