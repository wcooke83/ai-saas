import { describe, it, expect } from 'vitest';
import { buildRAGPrompt, buildSystemPrompt, formatConversationHistory } from './rag';
import type { Chatbot, Message } from './types';
import type { RAGContext } from './rag';

function makeChatbot(overrides: Partial<Chatbot> = {}): Chatbot {
  return {
    id: 'chatbot-1',
    user_id: 'user-1',
    name: 'Test Bot',
    slug: 'test-bot',
    description: null,
    system_prompt: 'You are a helpful assistant.',
    model: 'claude-3-haiku',
    temperature: 0.7,
    max_tokens: 4096,
    enable_prompt_protection: false,
    language: 'en',
    memory_enabled: false,
    memory_days: 30,
    session_ttl_hours: 24,
    widget_config: {} as any,
    logo_url: null,
    welcome_message: 'Hello!',
    placeholder_text: 'Type here...',
    pre_chat_form_config: {} as any,
    post_chat_survey_config: {} as any,
    status: 'active' as any,
    is_published: true,
    monthly_message_limit: 1000,
    messages_this_month: 0,
    pricing_type: 'free' as any,
    stripe_product_id: null,
    file_upload_config: {} as any,
    proactive_messages_config: {} as any,
    transcript_config: {} as any,
    credit_exhaustion_mode: 'block' as any,
    credit_exhaustion_config: {} as any,
    allowed_origins: null,
    live_fetch_threshold: 0.8,
    custom_text_updated_at: null,
    language_updated_at: null,
    widget_reviewed_at: null,
    first_conversation_at: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    ...overrides,
  };
}

function makeContext(overrides: Partial<RAGContext> = {}): RAGContext {
  return {
    chunks: [],
    systemPrompt: 'You are a helpful assistant.',
    contextText: '',
    confidence: 0,
    pinnedUrls: [],
    ...overrides,
  };
}

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'msg-1',
    conversation_id: 'conv-1',
    chatbot_id: 'chatbot-1',
    role: 'user',
    content: 'Hello',
    model: null,
    tokens_input: null,
    tokens_output: null,
    latency_ms: null,
    context_chunks: null,
    metadata: null,
    thumbs_up: null,
    attachments: null,
    created_at: '2024-01-01',
    ...overrides,
  };
}

// --- buildRAGPrompt ---

describe('buildRAGPrompt', () => {
  it('returns just the user message when no context', () => {
    const ctx = makeContext();
    const result = buildRAGPrompt(ctx, [], 'What is your name?');
    expect(result).toBe('What is your name?');
  });

  it('includes reference information when context exists', () => {
    const ctx = makeContext({ contextText: 'Our product costs $49/mo.' });
    const result = buildRAGPrompt(ctx, [], 'How much does it cost?');
    expect(result).toContain('## Reference Information');
    expect(result).toContain('Our product costs $49/mo.');
    expect(result).toContain('How much does it cost?');
  });

  it('includes document text when provided', () => {
    const ctx = makeContext();
    const result = buildRAGPrompt(ctx, [], 'Summarize this', 'Document content here');
    expect(result).toContain('## Attached Documents');
    expect(result).toContain('Document content here');
  });

  it('includes both context and document when both present', () => {
    const ctx = makeContext({ contextText: 'KB content' });
    const result = buildRAGPrompt(ctx, [], 'Question', 'Doc content');
    expect(result).toContain('## Reference Information');
    expect(result).toContain('## Attached Documents');
    expect(result).toContain('Question');
  });
});

// --- buildSystemPrompt ---

describe('buildSystemPrompt', () => {
  it('starts with the chatbot system prompt', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot);
    expect(result).toMatch(/^You are a helpful assistant\./);
  });

  it('appends user profile when userData provided', () => {
    const chatbot = makeChatbot();
    // Note: sanitizeContextValue converts @ -> a, so email gets mangled
    const result = buildSystemPrompt(chatbot, false, null, null, { name: 'John', email: 'john@test.com' });
    expect(result).toContain('## Authenticated User Profile');
    expect(result).toContain('name: John');
    expect(result).toContain('email:');
  });

  it('filters out id from userData', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, null, { id: '123', name: 'John' });
    expect(result).not.toContain('id: 123');
    expect(result).toContain('name: John');
  });

  it('skips userData section when empty', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, null, {});
    expect(result).not.toContain('## Authenticated User Profile');
  });

  it('appends user context data', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, null, null, { plan: 'Pro', orders: ['order-1'] });
    expect(result).toContain('## User Account Data');
    expect(result).toContain('Plan: Pro');
  });

  it('appends pre-chat info', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, { name: 'Jane', topic: 'Billing' });
    expect(result).toContain('## Visitor Information');
    expect(result).toContain('name: Jane');
    expect(result).toContain('topic: Billing');
  });

  it('appends calendar instructions when enabled', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, null, null, null, true);
    expect(result).toContain('## Calendar Booking');
    expect(result).toContain('CALENDAR_CHECK');
  });

  it('skips calendar section when not enabled', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, null, null, null, false);
    expect(result).not.toContain('## Calendar Booking');
  });

  it('appends prompt protection when enabled', () => {
    const chatbot = makeChatbot({ enable_prompt_protection: true });
    const result = buildSystemPrompt(chatbot);
    expect(result).toContain('## CRITICAL SECURITY RULES');
    expect(result).toContain('Reject Off-Topic Requests');
  });

  it('skips prompt protection when disabled', () => {
    const chatbot = makeChatbot({ enable_prompt_protection: false });
    const result = buildSystemPrompt(chatbot);
    expect(result).not.toContain('## CRITICAL SECURITY RULES');
  });

  it('appends memory context', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot, false, null, 'User previously asked about pricing.');
    expect(result).toContain('## Returning Visitor Context');
    expect(result).toContain('User previously asked about pricing.');
  });

  it('adds non-English language instruction', () => {
    const chatbot = makeChatbot({ language: 'es' });
    const result = buildSystemPrompt(chatbot);
    expect(result).toContain('## Language');
    // Should mention the language name, not just code
    expect(result).not.toContain('Your default language is English.');
  });

  it('adds English language instruction by default', () => {
    const chatbot = makeChatbot({ language: 'en' });
    const result = buildSystemPrompt(chatbot);
    expect(result).toContain('Your default language is English.');
  });

  it('always includes mandatory response rules', () => {
    const chatbot = makeChatbot();
    const result = buildSystemPrompt(chatbot);
    expect(result).toContain('## MANDATORY Response Rules');
  });
});

// --- formatConversationHistory ---

describe('formatConversationHistory', () => {
  it('filters to user and assistant only', () => {
    const messages = [
      makeMessage({ role: 'user', content: 'hi' }),
      makeMessage({ role: 'assistant', content: 'hello' }),
      makeMessage({ role: 'system' as any, content: 'system prompt' }),
    ];
    const result = formatConversationHistory(messages);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ role: 'user', content: 'hi' });
    expect(result[1]).toEqual({ role: 'assistant', content: 'hello' });
  });

  it('returns empty array for empty input', () => {
    expect(formatConversationHistory([])).toEqual([]);
  });

  it('preserves message order', () => {
    const messages = [
      makeMessage({ role: 'user', content: 'first' }),
      makeMessage({ role: 'assistant', content: 'second' }),
      makeMessage({ role: 'user', content: 'third' }),
    ];
    const result = formatConversationHistory(messages);
    expect(result.map((m) => m.content)).toEqual(['first', 'second', 'third']);
  });
});
