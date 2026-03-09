/**
 * Local AI Provider
 * Sends prompts to ai-prompt-api (FastAPI) via HTTP
 */

import { getAppSettings } from '@/lib/settings';

const DEFAULT_API_URL = 'http://localhost:8000';

export interface LocalProviderOptions {
  timeout?: number;
  provider?: 'default' | 'chatgpt' | 'claude' | 'grok';
  apiUrl?: string;
}

export interface LocalProviderResponse {
  success: boolean;
  text: string;
  error?: string;
  session_id?: string;
  provider?: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
}

/**
 * Send a prompt to the local AI API
 */
export async function executeLocalAI(
  prompt: string,
  options: LocalProviderOptions = {}
): Promise<LocalProviderResponse> {
  const settings = await getAppSettings();

  const apiUrl = (options.apiUrl || settings?.local_api_path || DEFAULT_API_URL).replace(/\/+$/, '');
  const timeout = options.timeout || settings?.local_api_timeout || 120;
  const provider = options.provider || settings?.local_api_provider || undefined;

  const body: Record<string, unknown> = {
    text: prompt,
    timeout,
  };

  // Only add provider if not 'default'
  if (provider && provider !== 'default') {
    body.provider = provider;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), (timeout + 10) * 1000);

    const response = await fetch(`${apiUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        text: '',
        error: errorData?.detail || `API returned ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: data.success ?? false,
      text: data.text || '',
      error: data.error,
      session_id: data.session_id,
      provider: data.provider,
      model: data.model,
      input_tokens: data.input_tokens,
      output_tokens: data.output_tokens,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, text: '', error: `Request timed out after ${timeout}s` };
    }
    return {
      success: false,
      text: '',
      error: err instanceof Error ? err.message : 'Failed to reach local AI API',
    };
  }
}

/**
 * Check if local AI API is reachable and extension is connected
 */
export async function isLocalAIAvailable(): Promise<boolean> {
  try {
    const settings = await getAppSettings();
    const apiUrl = (settings?.local_api_path || DEFAULT_API_URL).replace(/\/+$/, '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiUrl}/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const data = await response.json();
    return data.status === 'ok' && data.extension_connected === true;
  } catch {
    return false;
  }
}
