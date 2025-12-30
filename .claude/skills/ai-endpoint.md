# AI Endpoint Skill

Generate API endpoints for AI integrations with Claude/OpenAI, streaming support, and usage tracking.

## Trigger
`/ai-endpoint` or `/ai`

## Arguments
- `name`: Endpoint name (e.g., "generate-email", "summarize")
- `--provider`: `claude` | `openai` | `both` (default: claude)
- `--streaming`: `true` | `false` (default: true)
- `--type`: `text` | `chat` | `structured` | `vision`

## Instructions

When invoked:

1. **Generate files**:
   ```
   src/app/api/ai/[name]/route.ts    # API endpoint
   src/lib/ai/[name].ts              # Business logic
   src/lib/ai/prompts/[name].ts      # Prompt templates
   ```

2. **Include**:
   - Provider abstraction for easy switching
   - Streaming response handling
   - Token counting and usage tracking
   - Error handling with retries
   - Rate limiting per user

## AI Client Setup

### Anthropic Client (`src/lib/ai/anthropic.ts`)
```typescript
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODELS = {
  fast: 'claude-3-5-haiku-20241022',
  balanced: 'claude-3-5-sonnet-20241022',
  powerful: 'claude-3-opus-20240229',
} as const;

export type ModelType = keyof typeof MODELS;
```

### OpenAI Client (`src/lib/ai/openai.ts`)
```typescript
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODELS = {
  fast: 'gpt-4o-mini',
  balanced: 'gpt-4o',
  powerful: 'gpt-4o',
} as const;
```

### Provider Abstraction (`src/lib/ai/provider.ts`)
```typescript
import { anthropic, MODELS as CLAUDE_MODELS, ModelType } from './anthropic';
import { openai, MODELS as OPENAI_MODELS } from './openai';

export type Provider = 'claude' | 'openai';

interface GenerateOptions {
  provider?: Provider;
  model?: ModelType;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface GenerateResult {
  content: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  provider: Provider;
}

export async function generate(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const {
    provider = 'claude',
    model = 'balanced',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  if (provider === 'claude') {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODELS[model],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === 'text');

    return {
      content: textContent?.text || '',
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
      model: CLAUDE_MODELS[model],
      provider: 'claude',
    };
  }

  // OpenAI fallback
  const response = await openai.chat.completions.create({
    model: OPENAI_MODELS[model],
    max_tokens: maxTokens,
    temperature,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ],
  });

  return {
    content: response.choices[0]?.message?.content || '',
    tokensInput: response.usage?.prompt_tokens || 0,
    tokensOutput: response.usage?.completion_tokens || 0,
    model: OPENAI_MODELS[model],
    provider: 'openai',
  };
}

// Streaming version
export async function* generateStream(
  prompt: string,
  options: GenerateOptions = {}
): AsyncGenerator<string> {
  const {
    provider = 'claude',
    model = 'balanced',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  if (provider === 'claude') {
    const stream = await anthropic.messages.stream({
      model: CLAUDE_MODELS[model],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
    return;
  }

  // OpenAI streaming
  const stream = await openai.chat.completions.create({
    model: OPENAI_MODELS[model],
    max_tokens: maxTokens,
    temperature,
    stream: true,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
```

## Endpoint Templates

### Standard Text Generation
```typescript
// src/app/api/ai/generate-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import { emailPrompt } from '@/lib/ai/prompts/email';
import { APIError, handleAPIError } from '@/lib/api-utils';
import { trackUsage } from '@/lib/usage';

const requestSchema = z.object({
  type: z.enum(['cold-outreach', 'follow-up', 'proposal', 'introduction']),
  context: z.object({
    recipientName: z.string(),
    recipientCompany: z.string().optional(),
    purpose: z.string(),
    tone: z.enum(['formal', 'friendly', 'professional']).default('professional'),
    additionalContext: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    // Check usage
    const canUse = await trackUsage.check(session.user.id);
    if (!canUse) {
      throw new APIError('Usage limit reached', 403);
    }

    const body = await req.json();
    const { type, context } = requestSchema.parse(body);

    // Generate prompt
    const prompt = emailPrompt(type, context);

    // Generate content
    const startTime = Date.now();
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: 'You are an expert email copywriter. Write compelling, concise emails.',
      temperature: 0.7,
    });
    const duration = Date.now() - startTime;

    // Save generation
    const { data: generation } = await supabase
      .from('generations')
      .insert({
        user_id: session.user.id,
        type: `email-${type}`,
        prompt,
        output: result.content,
        model: result.model,
        tokens_input: result.tokensInput,
        tokens_output: result.tokensOutput,
        duration_ms: duration,
        status: 'completed',
      })
      .select()
      .single();

    // Track usage
    await trackUsage.increment(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: generation?.id,
        content: result.content,
        tokensUsed: result.tokensInput + result.tokensOutput,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

### Streaming Endpoint
```typescript
// src/app/api/ai/chat/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateStream } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages, systemPrompt } = await req.json();

  // Create a TransformStream for streaming
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Start streaming in background
  (async () => {
    try {
      const lastMessage = messages[messages.length - 1];

      for await (const chunk of generateStream(lastMessage.content, {
        provider: 'claude',
        model: 'balanced',
        systemPrompt,
      })) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
      }

      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (error) {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Generation failed' })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Structured Output (JSON)
```typescript
// src/app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/ai/anthropic';
import { z } from 'zod';

const analysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  topics: z.array(z.string()),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze the following text and return a JSON object with:
- sentiment: "positive", "negative", or "neutral"
- topics: array of main topics
- summary: 1-2 sentence summary
- keyPoints: array of key points
- confidence: 0-1 confidence score

Text to analyze:
${text}

Return only valid JSON, no other text.`,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  const parsed = JSON.parse(textContent?.text || '{}');
  const validated = analysisSchema.parse(parsed);

  return NextResponse.json({ success: true, data: validated });
}
```

## Prompt Templates

### Email Prompt (`src/lib/ai/prompts/email.ts`)
```typescript
interface EmailContext {
  recipientName: string;
  recipientCompany?: string;
  purpose: string;
  tone: 'formal' | 'friendly' | 'professional';
  additionalContext?: string;
}

export function emailPrompt(
  type: 'cold-outreach' | 'follow-up' | 'proposal' | 'introduction',
  context: EmailContext
): string {
  const toneGuide = {
    formal: 'Use formal language, proper titles, and traditional business conventions.',
    friendly: 'Be warm and personable while remaining professional.',
    professional: 'Balance professionalism with approachability.',
  };

  const typeGuide = {
    'cold-outreach': 'This is an initial contact email. Focus on providing value upfront.',
    'follow-up': 'This follows a previous interaction. Reference the prior contact.',
    'proposal': 'This presents an offer or proposal. Be clear about the value proposition.',
    'introduction': 'This introduces yourself or your company. Be concise and memorable.',
  };

  return `Write a ${type} email with the following details:

Recipient: ${context.recipientName}${context.recipientCompany ? ` at ${context.recipientCompany}` : ''}
Purpose: ${context.purpose}
${context.additionalContext ? `Additional context: ${context.additionalContext}` : ''}

Guidelines:
- ${toneGuide[context.tone]}
- ${typeGuide[type]}
- Keep the email concise (under 200 words)
- Include a clear call-to-action
- Use short paragraphs for readability

Return only the email content (subject line and body).`;
}
```

## Usage Tracking (`src/lib/usage.ts`)
```typescript
import { createClient } from '@/lib/supabase/server';

export const trackUsage = {
  async check(userId: string): Promise<boolean> {
    const supabase = createClient();
    const { data } = await supabase
      .from('usage')
      .select('credits_used, credits_limit')
      .eq('user_id', userId)
      .single();

    if (!data) return false;
    return data.credits_used < data.credits_limit;
  },

  async increment(userId: string, amount: number = 1): Promise<void> {
    const supabase = createClient();
    await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_amount: amount,
    });
  },

  async get(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  },
};
```

## Example Usage

```
/ai-endpoint generate-email --provider claude --streaming false
/ai-endpoint chat --provider both --streaming true
/ai-endpoint summarize --provider claude --type text
/ai-endpoint analyze-document --provider claude --type vision
```

## Output Checklist

- [ ] API route with auth/validation
- [ ] Provider abstraction used
- [ ] Streaming support if enabled
- [ ] Token usage tracked
- [ ] Generation saved to database
- [ ] Rate limiting applied
- [ ] Error handling with retries
- [ ] Prompt template separated
