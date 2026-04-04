/**
 * Translation API Endpoint
 * POST /api/chatbots/:id/translate - Translate custom form/survey text
 *
 * Uses AI to translate user-defined custom text while preserving placeholders.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { generate } from '@/lib/ai/provider';
import { deductCredits } from '@/lib/usage/tracker';
import {
  DEFAULT_PRE_CHAT_FORM_CONFIG,
  DEFAULT_POST_CHAT_SURVEY_CONFIG,
  type PreChatFormConfig,
  type PostChatSurveyConfig,
} from '@/lib/chatbots/types';
import { getLanguageName } from '@/lib/chatbots/translations';

// Translation request validation
const translateSchema = z.object({
  targetLanguage: z.string().min(2).max(10),
  preChatFormConfig: z.record(z.unknown()).optional(),
  postChatSurveyConfig: z.record(z.unknown()).optional(),
  generalText: z.object({
    welcomeMessage: z.string().optional(),
    placeholderText: z.string().optional(),
  }).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Detect if a value is custom (differs from default)
 */
function isCustomValue(current: string, defaultValue: string): boolean {
  return current !== defaultValue && current.trim() !== '';
}

/**
 * Extract placeholders from text (e.g., {{name}}, {{email}})
 */
function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{[^}]+\}\}/g);
  return matches || [];
}

/**
 * Replace placeholders with markers for translation, then restore after
 */
function prepareForTranslation(text: string): { prepared: string; placeholders: Map<string, string> } {
  const placeholders = new Map<string, string>();
  let prepared = text;
  let index = 0;

  prepared = prepared.replace(/\{\{[^}]+\}\}/g, (match) => {
    const marker = `__PLACEHOLDER_${index}__`;
    placeholders.set(marker, match);
    index++;
    return marker;
  });

  return { prepared, placeholders };
}

/**
 * Restore placeholders after translation
 */
function restorePlaceholders(translated: string, placeholders: Map<string, string>): string {
  let result = translated;
  placeholders.forEach((original, marker) => {
    result = result.replace(marker, original);
  });
  return result;
}

/**
 * Translate a single string using AI
 */
async function translateString(text: string, targetLanguage: string): Promise<string> {
  const languageName = getLanguageName(targetLanguage);

  const { prepared, placeholders } = prepareForTranslation(text);

  const prompt = `Translate the following text to ${languageName}. Preserve any __PLACEHOLDER_X__ markers exactly as they appear. Only return the translated text, nothing else.

Text to translate:
${prepared}`;

  try {
    const result = await generate(prompt, {
      model: 'fast', // Use a fast, cost-effective model for translations
      temperature: 0.3, // Lower temperature for more consistent translations
      maxTokens: 500,
    });

    return restorePlaceholders(result.content.trim(), placeholders);
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Failed to translate to ${languageName}`);
  }
}

/**
 * Translate Pre-Chat Form config
 */
async function translatePreChatForm(
  config: PreChatFormConfig,
  targetLanguage: string
): Promise<PreChatFormConfig> {
  const translated: PreChatFormConfig = { ...config };

  // Translate title if not empty
  if (config.title?.trim()) {
    translated.title = await translateString(config.title, targetLanguage);
  }

  // Translate description if not empty
  if (config.description?.trim()) {
    translated.description = await translateString(config.description, targetLanguage);
  }

  // Translate submit button if not empty
  if (config.submitButtonText?.trim()) {
    translated.submitButtonText = await translateString(config.submitButtonText, targetLanguage);
  }

  // Translate field labels and placeholders
  translated.fields = await Promise.all(
    config.fields.map(async (field) => {
      const translatedField = { ...field };

      // Translate label if not empty
      if (field.label?.trim()) {
        translatedField.label = await translateString(field.label, targetLanguage);
      }

      // Translate placeholder if present
      if (field.placeholder?.trim()) {
        translatedField.placeholder = await translateString(field.placeholder, targetLanguage);
      }

      // Translate select options if present
      if (field.options?.length) {
        translatedField.options = await Promise.all(
          field.options.map((opt) => translateString(opt, targetLanguage))
        );
      }

      return translatedField;
    })
  );

  return translated;
}

/**
 * Translate Post-Chat Survey config
 */
async function translatePostChatSurvey(
  config: PostChatSurveyConfig,
  targetLanguage: string
): Promise<PostChatSurveyConfig> {
  const translated: PostChatSurveyConfig = { ...config };

  // Translate title if not empty
  if (config.title?.trim()) {
    translated.title = await translateString(config.title, targetLanguage);
  }

  // Translate description if not empty
  if (config.description?.trim()) {
    translated.description = await translateString(config.description, targetLanguage);
  }

  // Translate submit button if not empty
  if (config.submitButtonText?.trim()) {
    translated.submitButtonText = await translateString(config.submitButtonText, targetLanguage);
  }

  // Translate thank you message if not empty
  if (config.thankYouMessage?.trim()) {
    translated.thankYouMessage = await translateString(config.thankYouMessage, targetLanguage);
  }

  // Translate question labels
  translated.questions = await Promise.all(
    config.questions.map(async (question) => {
      const translatedQuestion = { ...question };

      // Translate label if not empty
      if (question.label?.trim()) {
        translatedQuestion.label = await translateString(question.label, targetLanguage);
      }

      // Translate choice options if present
      if (question.options?.length) {
        translatedQuestion.options = await Promise.all(
          question.options.map((opt) => translateString(opt, targetLanguage))
        );
      }

      return translatedQuestion;
    })
  );

  return translated;
}

/**
 * Translate General text (welcome message and placeholder)
 */
async function translateGeneralText(
  generalText: { welcomeMessage?: string; placeholderText?: string },
  targetLanguage: string
): Promise<{ welcomeMessage?: string; placeholderText?: string }> {
  const translated: { welcomeMessage?: string; placeholderText?: string } = {};

  // Translate welcome message if not empty
  if (generalText.welcomeMessage?.trim()) {
    translated.welcomeMessage = await translateString(generalText.welcomeMessage, targetLanguage);
  }

  // Translate placeholder text if not empty
  if (generalText.placeholderText?.trim()) {
    translated.placeholderText = await translateString(generalText.placeholderText, targetLanguage);
  }

  return translated;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Get chatbot
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }

    // Verify ownership
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Validate input
    const input = await parseBody(req, translateSchema);

    // Deduct 3 credits per translation request before processing
    await deductCredits(user.id, 3, 'Translation', { chatbot_id: id, target_language: input.targetLanguage });

    const result: {
      preChatFormConfig?: PreChatFormConfig;
      postChatSurveyConfig?: PostChatSurveyConfig;
      generalText?: { welcomeMessage?: string; placeholderText?: string };
    } = {};

    // Translate General text if provided
    if (input.generalText) {
      result.generalText = await translateGeneralText(
        input.generalText,
        input.targetLanguage
      );
    }

    // Translate Pre-Chat Form if provided
    if (input.preChatFormConfig) {
      result.preChatFormConfig = await translatePreChatForm(
        input.preChatFormConfig as unknown as PreChatFormConfig,
        input.targetLanguage
      );
    }

    // Translate Post-Chat Survey if provided
    if (input.postChatSurveyConfig) {
      result.postChatSurveyConfig = await translatePostChatSurvey(
        input.postChatSurveyConfig as unknown as PostChatSurveyConfig,
        input.targetLanguage
      );
    }

    return successResponse(result);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
