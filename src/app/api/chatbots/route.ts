/**
 * Chatbots API Endpoint
 * GET /api/chatbots - List all chatbots
 * POST /api/chatbots - Create a new chatbot
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbotsWithStats,
  createChatbot,
  generateUniqueSlug,
  checkChatbotLimit,
} from '@/lib/chatbots/api';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG } from '@/lib/chatbots/types';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';
import { checkReembedStatusBatch } from '@/lib/chatbots/reembed-check';
import { trackActivationMilestone } from '@/lib/onboarding/activation';

// Create chatbot validation schema
const createChatbotSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
  system_prompt: z.string().min(10, 'System prompt must be at least 10 characters').max(5000).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(100).max(4096).optional(),
  widget_config: z.record(z.unknown()).optional(),
  welcome_message: z.string().max(500).optional(),
  language: z.string().max(10).optional(),
  memory_enabled: z.boolean().optional(),
  memory_days: z.number().min(0).max(365).optional(),
  file_upload_config: z.record(z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Check tool access
    await requireToolAccess(user, 'chatbots');

    // Get chatbots with stats
    const chatbots = await getChatbotsWithStats(user.id);

    // Batch check re-embed status
    const reembedMap = await checkReembedStatusBatch(chatbots.map(c => c.id));
    const chatbotsWithReembed = chatbots.map(c => ({
      ...c,
      ...reembedMap[c.id],
    }));

    return successResponse({ chatbots: chatbotsWithReembed });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Check tool access
    await requireToolAccess(user, 'chatbots');

    // Validate input
    const input = await parseBody(req, createChatbotSchema);

    // Check plan limits
    const canCreate = await checkChatbotLimit(user.id, user.plan || 'free');
    if (!canCreate) {
      throw APIError.forbidden(
        'You have reached the maximum number of chatbots for your plan. Upgrade to create more.'
      );
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(user.id, input.name);

    // Merge widget config with defaults
    const widgetConfig = {
      ...DEFAULT_WIDGET_CONFIG,
      ...(input.widget_config || {}),
    };

    // Derive monthly_message_limit from the subscription_plans table (0 = unlimited in DB convention)
    const planLimits = await getPlanLimits(user.plan || 'free').catch(() => FREE_PLAN_LIMITS);
    const monthlyMessageLimit = planLimits.monthlyMessageLimit;

    // Create chatbot
    const chatbot = await createChatbot({
      user_id: user.id,
      name: input.name,
      slug,
      monthly_message_limit: monthlyMessageLimit,
      description: input.description || null,
      system_prompt: input.system_prompt,
      model: input.model,
      temperature: input.temperature,
      max_tokens: input.max_tokens,
      widget_config: widgetConfig,
      welcome_message: input.welcome_message,
      language: input.language,
      memory_enabled: input.memory_enabled,
      memory_days: input.memory_days,
      file_upload_config: input.file_upload_config
        ? { ...DEFAULT_FILE_UPLOAD_CONFIG, ...input.file_upload_config }
        : undefined,
    });

    // Track chatbot_created milestone if request comes from onboarding wizard
    const isOnboarding =
      req.nextUrl.searchParams.get('onboarding') === 'true' ||
      req.headers.get('x-onboarding') === 'true';
    if (isOnboarding) {
      trackActivationMilestone(user.id, 'chatbot_created', { chatbot_id: chatbot.id }).catch(() => {});
    }

    return successResponse({ chatbot }, undefined, 201);
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
