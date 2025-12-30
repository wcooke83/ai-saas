/**
 * Embeddable Widget SDK
 * Allows tools to be embedded in external websites
 */

// ===================
// TYPES
// ===================

export interface EmbedConfig {
  toolId: string;
  apiKey: string;
  container: string | HTMLElement;
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onResult?: (result: unknown) => void;
  styles?: Partial<EmbedStyles>;
}

export interface EmbedStyles {
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  maxWidth: string;
}

// ===================
// EMBED SCRIPT GENERATOR
// ===================

/**
 * Generate embed code snippet for external websites
 */
export function generateEmbedCode(
  toolId: string,
  options: {
    apiKey?: string;
    theme?: 'light' | 'dark';
    width?: string;
    height?: string;
  } = {}
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  // iframe embed (simplest, most isolated)
  const iframeCode = `<iframe
  src="${baseUrl}/embed/${toolId}${options.apiKey ? `?key=${options.apiKey}` : ''}"
  width="${options.width || '100%'}"
  height="${options.height || '600'}"
  frameborder="0"
  allow="clipboard-write"
  style="border: 1px solid #e2e8f0; border-radius: 8px;"
></iframe>`;

  return iframeCode;
}

/**
 * Generate JavaScript SDK embed code
 */
export function generateSDKCode(toolId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  return `<script src="${baseUrl}/sdk/v1/embed.js"></script>
<script>
  AISaaS.init({
    toolId: '${toolId}',
    apiKey: 'YOUR_API_KEY',
    container: '#ai-tool-container',
    theme: 'light',
    onResult: function(result) {
      console.log('Generated:', result);
    }
  });
</script>
<div id="ai-tool-container"></div>`;
}

// ===================
// POSTMESSAGE COMMUNICATION
// ===================

export interface EmbedMessage {
  type: 'ready' | 'result' | 'error' | 'resize' | 'close';
  toolId: string;
  payload?: unknown;
}

/**
 * Send message from embed to parent window
 */
export function sendToParent(message: EmbedMessage): void {
  if (window.parent !== window) {
    window.parent.postMessage(
      { source: 'ai-saas-embed', ...message },
      '*'
    );
  }
}

/**
 * Listen for messages from parent window
 */
export function listenFromParent(
  callback: (message: EmbedMessage) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (event.data?.source === 'ai-saas-parent') {
      callback(event.data as EmbedMessage);
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

// ===================
// AUTO-RESIZE
// ===================

/**
 * Send height to parent for iframe auto-resize
 */
export function sendHeightToParent(toolId: string): void {
  const height = document.documentElement.scrollHeight;
  sendToParent({
    type: 'resize',
    toolId,
    payload: { height },
  });
}

/**
 * Setup auto-resize observer
 */
export function setupAutoResize(toolId: string): () => void {
  const observer = new ResizeObserver(() => {
    sendHeightToParent(toolId);
  });

  observer.observe(document.body);

  return () => observer.disconnect();
}
