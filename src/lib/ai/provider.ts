/**
 * AI Provider Abstraction
 * Unified interface for Claude and OpenAI with automatic fallback
 */

import { anthropic, CLAUDE_MODELS, type ClaudeModel } from './providers/anthropic';
import { openai, OPENAI_MODELS, type OpenAIModel } from './providers/openai';

// ===================
// MOCK MODE
// ===================

// Check for valid API keys (must be longer than placeholder values)
const hasValidAnthropicKey = process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-api') &&
  process.env.ANTHROPIC_API_KEY.length > 20;
const hasValidOpenAIKey = process.env.OPENAI_API_KEY?.startsWith('sk-') &&
  process.env.OPENAI_API_KEY.length > 20;

const MOCK_MODE = process.env.AI_MOCK_MODE === 'true' ||
  (!hasValidAnthropicKey && !hasValidOpenAIKey);

function getMockEmailResponse(prompt: string): string {
  // Extract context from prompt for realistic mock
  const isFollowUp = prompt.toLowerCase().includes('follow') || prompt.toLowerCase().includes('reply');
  const isFormal = prompt.toLowerCase().includes('formal') || prompt.toLowerCase().includes('professional');
  const isMeeting = prompt.toLowerCase().includes('meeting');

  const subject = isMeeting
    ? "Meeting Request: Discussion on Project Timeline"
    : isFollowUp
    ? "Re: Following Up on Our Previous Discussion"
    : "Quick Question About Your Availability";

  const greeting = isFormal ? "Dear Colleague," : "Hi there,";
  const closing = isFormal ? "Best regards," : "Thanks!";

  // Return in the format the API expects (Subject: line, then body)
  return `Subject: ${subject}

${greeting}

I hope this message finds you well. ${isFollowUp ? "I wanted to follow up on our previous conversation." : isMeeting ? "I'm writing to request a meeting to discuss our upcoming project." : "I'm reaching out to discuss an opportunity."}

This is a mock response generated for testing purposes. In production, this would be a fully AI-generated email tailored to your specific requirements.

Key points this email would cover:
• Personalized greeting based on context
• Main message addressing your stated purpose
• Clear call to action
• Professional ${isFormal ? 'formal' : 'casual'} tone throughout

${closing}
[Your Name]

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY to .env.local for real AI responses.`;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getMockProposalResponse(prompt: string): string {
  // Extract section types from the prompt
  const sectionMatches = prompt.match(/### \d+\. .+ \(type: "([^"]+)"\)/g) || [];
  const sectionTypes = sectionMatches.map(m => {
    const match = m.match(/type: "([^"]+)"/);
    return match ? match[1] : 'executive-summary';
  });

  const sections = sectionTypes.map(type => {
    const titles: Record<string, string> = {
      'executive-summary': 'Executive Summary',
      'company-overview': 'Company Overview',
      'problem-statement': 'Problem Statement',
      'proposed-solution': 'Proposed Solution',
      'scope-of-work': 'Scope of Work',
      'deliverables': 'Deliverables',
      'timeline-milestones': 'Timeline & Milestones',
      'pricing-fees': 'Pricing & Fees',
      'team-qualifications': 'Team & Qualifications',
      'case-studies': 'Case Studies',
      'methodology': 'Methodology',
      'terms-conditions': 'Terms & Conditions',
      'next-steps': 'Next Steps',
    };

    const content = getMockSectionContent(type);

    return {
      type,
      title: titles[type] || type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content,
    };
  });

  return JSON.stringify({ sections });
}

function getMockSectionContent(type: string): string {
  const contents: Record<string, string> = {
    'executive-summary': `This proposal outlines our comprehensive approach to delivering exceptional results for your organization.

**Key Highlights:**
- Proven methodology with 95% client satisfaction rate
- Dedicated team of industry experts
- Flexible timeline and transparent pricing
- Ongoing support and optimization

We are confident that our solution will exceed your expectations and deliver measurable ROI within the first quarter.

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`,

    'problem-statement': `Based on our analysis, your organization faces several critical challenges:

1. **Operational Inefficiency** - Current processes require significant manual intervention
2. **Scalability Limitations** - Existing systems cannot support projected growth
3. **Competitive Pressure** - Market leaders are adopting advanced solutions

These challenges, if left unaddressed, could result in:
- 15-20% reduction in operational efficiency
- Missed revenue opportunities
- Declining market position

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`,

    'proposed-solution': `We propose a comprehensive solution that addresses your core challenges:

**Phase 1: Assessment & Planning**
- Detailed requirements analysis
- Stakeholder alignment sessions
- Technical architecture design

**Phase 2: Implementation**
- Agile development methodology
- Regular progress reviews
- Quality assurance testing

**Phase 3: Deployment & Optimization**
- Phased rollout strategy
- User training and documentation
- Performance monitoring

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`,

    'pricing-fees': `**Investment Summary**

| Component | Price |
|-----------|-------|
| Phase 1: Discovery | $5,000 |
| Phase 2: Development | $15,000 |
| Phase 3: Deployment | $5,000 |
| **Total Investment** | **$25,000** |

**Payment Terms:**
- 30% upon project kickoff
- 40% at Phase 2 completion
- 30% upon final delivery

*All prices are estimates. Final pricing will be confirmed after requirements review.*

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`,

    'next-steps': `To move forward with this proposal:

1. **Review & Questions** - Schedule a call to discuss any questions
2. **Sign Agreement** - Review and sign the attached agreement
3. **Kickoff Meeting** - Schedule project kickoff within 5 business days

**Contact:**
- Email: contact@company.com
- Phone: (555) 123-4567

We look forward to partnering with you on this initiative.

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`,
  };

  return contents[type] || `**${type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}**

This section would contain detailed, AI-generated content specific to your proposal requirements. The content would be tailored to your industry, client, and project details.

Key elements that would be included:
- Industry-specific terminology and best practices
- Customized messaging based on your input
- Professional formatting and structure
- Actionable recommendations

---
⚠️ MOCK MODE: Add a valid ANTHROPIC_API_KEY for real AI-generated content.`;
}

// ===================
// TYPES
// ===================

export type Provider = 'claude' | 'openai' | 'mock';
export type ModelTier = 'fast' | 'balanced' | 'powerful';

export interface GenerateOptions {
  provider?: Provider;
  model?: ModelTier;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stopSequences?: string[];
}

export interface GenerateResult {
  content: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  provider: Provider;
  durationMs: number;
}

export interface StreamOptions extends GenerateOptions {
  onToken?: (token: string) => void;
  onComplete?: (result: GenerateResult) => void;
}

// ===================
// PROVIDER DETECTION
// ===================

export function isMockMode(): boolean {
  return MOCK_MODE;
}

export function getAvailableProvider(): Provider | null {
  if (MOCK_MODE) return 'mock';
  if (anthropic) return 'claude';
  if (openai) return 'openai';
  return null;
}

export function isProviderAvailable(provider: Provider): boolean {
  if (provider === 'mock') return MOCK_MODE;
  if (provider === 'claude') return !!anthropic && !MOCK_MODE;
  if (provider === 'openai') return !!openai && !MOCK_MODE;
  return false;
}

// ===================
// GENERATE (Non-streaming)
// ===================

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
    stopSequences,
  } = options;

  const startTime = Date.now();

  // Try preferred provider, fallback if unavailable
  const activeProvider = isProviderAvailable(provider)
    ? provider
    : getAvailableProvider();

  if (!activeProvider) {
    throw new Error('No AI provider available. Check API keys.');
  }

  // Mock mode for testing
  if (activeProvider === 'mock') {
    await delay(1500); // Simulate API latency (longer for proposals)

    // Detect request type and use appropriate mock response
    const isProposal = prompt.includes('proposal') ||
      systemPrompt?.includes('proposal writer') ||
      prompt.includes('## Required Sections');

    const mockContent = isProposal
      ? getMockProposalResponse(prompt)
      : getMockEmailResponse(prompt);

    return {
      content: mockContent,
      tokensInput: Math.ceil(prompt.length / 4),
      tokensOutput: Math.ceil(mockContent.length / 4),
      model: 'mock-model',
      provider: 'mock',
      durationMs: Date.now() - startTime,
    };
  }

  if (activeProvider === 'claude' && anthropic) {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODELS[model as ClaudeModel],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      stop_sequences: stopSequences,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === 'text');

    return {
      content: textContent?.text || '',
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
      model: CLAUDE_MODELS[model as ClaudeModel],
      provider: 'claude',
      durationMs: Date.now() - startTime,
    };
  }

  if (activeProvider === 'openai' && openai) {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS[model as OpenAIModel],
      max_tokens: maxTokens,
      temperature,
      stop: stopSequences,
      messages: [
        ...(systemPrompt
          ? [{ role: 'system' as const, content: systemPrompt }]
          : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensInput: response.usage?.prompt_tokens || 0,
      tokensOutput: response.usage?.completion_tokens || 0,
      model: OPENAI_MODELS[model as OpenAIModel],
      provider: 'openai',
      durationMs: Date.now() - startTime,
    };
  }

  throw new Error('No AI provider available');
}

// ===================
// GENERATE STREAM
// ===================

export async function* generateStream(
  prompt: string,
  options: GenerateOptions = {}
): AsyncGenerator<string, GenerateResult> {
  const {
    provider = 'claude',
    model = 'balanced',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  const startTime = Date.now();
  let tokensInput = 0;
  let tokensOutput = 0;
  let fullContent = '';

  const activeProvider = isProviderAvailable(provider)
    ? provider
    : getAvailableProvider();

  if (!activeProvider) {
    throw new Error('No AI provider available');
  }

  // Mock mode for testing (simulated streaming)
  if (activeProvider === 'mock') {
    const mockContent = getMockEmailResponse(prompt);
    const words = mockContent.split(' ');

    for (const word of words) {
      await delay(30); // Simulate streaming delay
      fullContent += (fullContent ? ' ' : '') + word;
      tokensOutput++;
      yield word + ' ';
    }

    return {
      content: fullContent,
      tokensInput: Math.ceil(prompt.length / 4),
      tokensOutput,
      model: 'mock-model',
      provider: 'mock',
      durationMs: Date.now() - startTime,
    };
  }

  if (activeProvider === 'claude' && anthropic) {
    const stream = anthropic.messages.stream({
      model: CLAUDE_MODELS[model as ClaudeModel],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullContent += event.delta.text;
        yield event.delta.text;
      }

      if (event.type === 'message_delta' && event.usage) {
        tokensOutput = event.usage.output_tokens;
      }

      if (event.type === 'message_start' && event.message.usage) {
        tokensInput = event.message.usage.input_tokens;
      }
    }

    return {
      content: fullContent,
      tokensInput,
      tokensOutput,
      model: CLAUDE_MODELS[model as ClaudeModel],
      provider: 'claude',
      durationMs: Date.now() - startTime,
    };
  }

  if (activeProvider === 'openai' && openai) {
    const stream = await openai.chat.completions.create({
      model: OPENAI_MODELS[model as OpenAIModel],
      max_tokens: maxTokens,
      temperature,
      stream: true,
      messages: [
        ...(systemPrompt
          ? [{ role: 'system' as const, content: systemPrompt }]
          : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
        tokensOutput++;
        yield content;
      }
    }

    // Estimate input tokens for OpenAI streaming (not provided in stream)
    tokensInput = Math.ceil((systemPrompt?.length || 0 + prompt.length) / 4);

    return {
      content: fullContent,
      tokensInput,
      tokensOutput,
      model: OPENAI_MODELS[model as OpenAIModel],
      provider: 'openai',
      durationMs: Date.now() - startTime,
    };
  }

  throw new Error('No AI provider available');
}

// ===================
// STREAMING RESPONSE HELPER
// ===================

/**
 * Create a streaming HTTP response from generator
 */
export function createStreamingResponse(
  generator: AsyncGenerator<string, GenerateResult>
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let result = await generator.next();

        while (!result.done) {
          const data = JSON.stringify({ type: 'token', content: result.value });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          result = await generator.next();
        }

        // Send final message with stats
        const finalData = JSON.stringify({
          type: 'done',
          usage: {
            tokensInput: result.value.tokensInput,
            tokensOutput: result.value.tokensOutput,
            model: result.value.model,
            provider: result.value.provider,
            durationMs: result.value.durationMs,
          },
        });
        controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
        controller.close();
      } catch (error) {
        const errorData = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Stream error',
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// ===================
// RETRY LOGIC
// ===================

export async function generateWithRetry(
  prompt: string,
  options: GenerateOptions & { maxRetries?: number } = {}
): Promise<GenerateResult> {
  const { maxRetries = 3, ...generateOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generate(prompt, generateOptions);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`AI generation attempt ${attempt} failed:`, lastError.message);

      // Don't retry on certain errors
      if (lastError.message.includes('Invalid API key')) {
        throw lastError;
      }

      // Exponential backoff
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw lastError || new Error('Generation failed after retries');
}
