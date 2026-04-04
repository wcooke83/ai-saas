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
import { encryptTelegramConfig, decryptTelegramConfig, encryptToken, decryptToken } from '@/lib/telegram/crypto';
import { encryptWhatsAppConfig, decryptWhatsAppConfig } from '@/lib/whatsapp/crypto';
import { encryptMessengerConfig, decryptMessengerConfig } from '@/lib/messenger/crypto';
import { encryptInstagramConfig, decryptInstagramConfig } from '@/lib/instagram/crypto';
import { encryptSmsConfig, decryptSmsConfig } from '@/lib/sms/crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireChatbotAccess } from '@/lib/auth/agent-permissions';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';

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
  whatsapp_config: z.record(z.unknown()).optional(),
  messenger_config: z.record(z.unknown()).optional(),
  instagram_config: z.record(z.unknown()).optional(),
  sms_config: z.record(z.unknown()).optional(),
  email_config: z.record(z.unknown()).optional(),
  teams_config: z.record(z.unknown()).optional(),
  discord_config: z.record(z.unknown()).optional(),
  live_fetch_threshold: z.number().min(0.5).max(0.95).optional(),
  credit_exhaustion_mode: z.enum(['tickets', 'contact_form', 'purchase_credits', 'help_articles']).optional(),
  credit_exhaustion_config: z.record(z.unknown()).optional(),
  monthly_message_limit: z.number().min(0).optional(),
  messages_this_month: z.number().min(0).optional(),
  purchased_credits_remaining: z.number().min(0).optional(),
  auto_topup_package_id: z.string().uuid().nullable().optional(),
  auto_topup_max_per_month: z.number().min(1).max(50).optional(),
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

    // Decrypt telegram bot token before sending to client
    if (chatbot.telegram_config && typeof chatbot.telegram_config === 'object' && !Array.isArray(chatbot.telegram_config)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatbot as any).telegram_config = decryptTelegramConfig(chatbot.telegram_config as unknown as Record<string, unknown>);
    }

    // Decrypt whatsapp access token before sending to client
    if (chatbot.whatsapp_config && typeof chatbot.whatsapp_config === 'object' && !Array.isArray(chatbot.whatsapp_config)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatbot as any).whatsapp_config = decryptWhatsAppConfig(chatbot.whatsapp_config as unknown as Record<string, unknown>);
    }

    // Decrypt messenger access token before sending to client
    if (chatbot.messenger_config && typeof chatbot.messenger_config === 'object' && !Array.isArray(chatbot.messenger_config)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatbot as any).messenger_config = decryptMessengerConfig(chatbot.messenger_config as unknown as Record<string, unknown>);
    }

    // Decrypt instagram access token before sending to client
    if (chatbot.instagram_config && typeof chatbot.instagram_config === 'object' && !Array.isArray(chatbot.instagram_config)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatbot as any).instagram_config = decryptInstagramConfig(chatbot.instagram_config as unknown as Record<string, unknown>);
    }

    // Decrypt SMS auth token before sending to client
    if (chatbot.sms_config && typeof chatbot.sms_config === 'object' && !Array.isArray(chatbot.sms_config)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatbot as any).sms_config = decryptSmsConfig(chatbot.sms_config as unknown as Record<string, unknown>);
    }

    // Decrypt discord bot token before sending to client
    if (chatbot.discord_config && typeof chatbot.discord_config === 'object' && !Array.isArray(chatbot.discord_config)) {
      const dc = chatbot.discord_config as unknown as Record<string, unknown>;
      if (dc.bot_token && typeof dc.bot_token === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chatbot as any).discord_config = { ...dc, bot_token: decryptToken(dc.bot_token as string) };
      }
    }

    // Decrypt teams app secret before sending to client
    if (chatbot.teams_config && typeof chatbot.teams_config === 'object' && !Array.isArray(chatbot.teams_config)) {
      const tc = chatbot.teams_config as unknown as Record<string, unknown>;
      if (tc.app_secret && typeof tc.app_secret === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chatbot as any).teams_config = { ...tc, app_secret: decryptToken(tc.app_secret as string) };
      }
    }

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

    // Verify owner or assigned agent with can_modify_settings
    await requireChatbotAccess(id, user.id, 'can_modify_settings');

    // Get existing chatbot
    const existing = await getChatbot(id);
    if (!existing) {
      throw APIError.notFound('Chatbot not found');
    }

    // Validate input
    const input = await parseBody(req, updateChatbotSchema);

    // Plan gates run against the chatbot owner's subscription, not the agent's
    const ownerUserId = existing.user_id;

    // Handle slug update if name changed
    let slug = existing.slug;
    if (input.name && input.name !== existing.name) {
      slug = await generateUniqueSlug(ownerUserId, input.name);
    }

    // Merge widget config if provided
    let widgetConfig = existing.widget_config as WidgetConfig;
    if (input.widget_config) {
      widgetConfig = {
        ...DEFAULT_WIDGET_CONFIG,
        ...widgetConfig,
        ...(input.widget_config as Partial<WidgetConfig>),
      };

      // Gate branding removal behind Pro+ plan
      if (widgetConfig.showBranding === false) {
        const limits = await getPlanLimits(user.plan || 'free').catch(() => FREE_PLAN_LIMITS);
        if (!limits.customBrandingEnabled) {
          throw APIError.forbidden('Removing branding requires a Pro or Agency plan');
        }
      }
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

    // Fetch plan limits once for all integration gates
    const integrationLimits = await getPlanLimits(user.plan || 'free').catch(() => FREE_PLAN_LIMITS);

    // Gate Telegram integration behind Pro+ plan
    if (input.telegram_config && typeof input.telegram_config === 'object') {
      const tc = input.telegram_config as Record<string, unknown>;
      if (tc.enabled === true || tc.ai_responses_enabled === true) {
        if (!integrationLimits.telegramEnabled) {
          throw APIError.forbidden('Telegram integration requires a Pro or Agency plan');
        }
      }
    }

    // Encrypt telegram bot token before storing
    if (input.telegram_config && typeof input.telegram_config === 'object') {
      input.telegram_config = encryptTelegramConfig(input.telegram_config as Record<string, unknown>);
    }

    // Gate WhatsApp integration behind Pro+ plan
    if (input.whatsapp_config && typeof input.whatsapp_config === 'object') {
      const wc = input.whatsapp_config as Record<string, unknown>;
      if (wc.enabled === true || wc.ai_responses_enabled === true) {
        if (!integrationLimits.whatsappEnabled) {
          throw APIError.forbidden('WhatsApp integration requires a Pro or Agency plan');
        }
      }
    }

    // Encrypt whatsapp access token before storing
    if (input.whatsapp_config && typeof input.whatsapp_config === 'object') {
      input.whatsapp_config = encryptWhatsAppConfig(input.whatsapp_config as Record<string, unknown>);
    }

    // Encrypt messenger access token before storing
    if (input.messenger_config && typeof input.messenger_config === 'object') {
      input.messenger_config = encryptMessengerConfig(input.messenger_config as Record<string, unknown>);
    }

    // Encrypt instagram access token before storing
    if (input.instagram_config && typeof input.instagram_config === 'object') {
      input.instagram_config = encryptInstagramConfig(input.instagram_config as Record<string, unknown>);
    }

    // Encrypt SMS auth token before storing
    if (input.sms_config && typeof input.sms_config === 'object') {
      input.sms_config = encryptSmsConfig(input.sms_config as Record<string, unknown>);
    }

    // Gate Discord integration behind Pro+ plan
    if (input.discord_config && typeof input.discord_config === 'object') {
      const dc = input.discord_config as Record<string, unknown>;
      if (dc.enabled === true || dc.ai_responses_enabled === true) {
        if (!integrationLimits.discordEnabled) {
          throw APIError.forbidden('Discord integration requires a Pro or Agency plan');
        }
      }
    }

    // Encrypt discord bot token before storing
    if (input.discord_config && typeof input.discord_config === 'object') {
      const dc = input.discord_config as Record<string, unknown>;
      if (dc.bot_token && typeof dc.bot_token === 'string' && !dc.bot_token.startsWith('enc:')) {
        input.discord_config = { ...dc, bot_token: encryptToken(dc.bot_token) };
      }
    }

    // Gate Teams integration behind Pro+ plan
    if (input.teams_config && typeof input.teams_config === 'object') {
      const tc = input.teams_config as Record<string, unknown>;
      if (tc.enabled === true || tc.ai_responses_enabled === true) {
        if (!integrationLimits.teamsEnabled) {
          throw APIError.forbidden('Teams integration requires a Pro or Agency plan');
        }
      }
    }

    // Encrypt teams app secret before storing
    if (input.teams_config && typeof input.teams_config === 'object') {
      const tc = input.teams_config as Record<string, unknown>;
      if (tc.app_secret && typeof tc.app_secret === 'string' && !tc.app_secret.startsWith('enc:')) {
        input.teams_config = { ...tc, app_secret: encryptToken(tc.app_secret) };
      }
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
