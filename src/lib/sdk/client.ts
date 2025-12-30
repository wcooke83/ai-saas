/**
 * AI SaaS JavaScript Client SDK
 * For integrating tools into external applications
 */

// ===================
// TYPES
// ===================

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  onError?: (error: Error) => void;
}

export interface GenerateOptions {
  tool: string;
  input: Record<string, unknown>;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface GenerateResult {
  success: boolean;
  data?: {
    id: string;
    content: string;
    tokensUsed: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

// ===================
// SDK CLIENT CLASS
// ===================

export class AISaaSClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private onError?: (error: Error) => void;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.yourdomain.com';
    this.timeout = config.timeout || 30000;
    this.onError = config.onError;
  }

  /**
   * Generate content using a tool
   */
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const { tool, input, stream = false, onToken } = options;

    try {
      if (stream && onToken) {
        return this.generateStream(tool, input, onToken);
      }

      const response = await this.request(`/v1/tools/${tool}/generate`, {
        method: 'POST',
        body: JSON.stringify({ input }),
      });

      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.onError?.(err);
      throw err;
    }
  }

  /**
   * Stream generation with token callback
   */
  private async generateStream(
    tool: string,
    input: Record<string, unknown>,
    onToken: (token: string) => void
  ): Promise<GenerateResult> {
    const response = await fetch(`${this.baseUrl}/v1/tools/${tool}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ input, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';
    let result: GenerateResult | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          if (data.type === 'token') {
            fullContent += data.content;
            onToken(data.content);
          } else if (data.type === 'done') {
            result = {
              success: true,
              data: {
                id: data.id,
                content: fullContent,
                tokensUsed: data.usage?.tokensInput + data.usage?.tokensOutput || 0,
              },
            };
          } else if (data.type === 'error') {
            throw new Error(data.error);
          }
        }
      }
    }

    return result || { success: false, error: { message: 'Stream ended unexpectedly', code: 'STREAM_ERROR' } };
  }

  /**
   * Get available tools
   */
  async listTools(): Promise<{ tools: Array<{ id: string; name: string; description: string }> }> {
    return this.request('/v1/tools');
  }

  /**
   * Get usage stats
   */
  async getUsage(): Promise<{
    creditsUsed: number;
    creditsLimit: number;
    creditsRemaining: number;
  }> {
    return this.request('/v1/usage');
  }

  /**
   * Make authenticated request
   */
  private async request(
    path: string,
    options: RequestInit = {}
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `HTTP error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// ===================
// FACTORY FUNCTION
// ===================

export function createClient(config: ClientConfig): AISaaSClient {
  return new AISaaSClient(config);
}

// ===================
// BROWSER GLOBAL (for script tag usage)
// ===================

if (typeof window !== 'undefined') {
  (window as any).AISaaS = {
    createClient,
    Client: AISaaSClient,
  };
}
