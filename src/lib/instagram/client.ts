import type { InstagramConfig } from './types';

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';
const INSTAGRAM_MAX_MSG_LENGTH = 2000;

function splitInstagramMessage(text: string, maxLength = INSTAGRAM_MAX_MSG_LENGTH): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    let splitIdx = remaining.lastIndexOf('\n', maxLength);
    if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(' ', maxLength);
    if (splitIdx <= 0) splitIdx = maxLength;

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

export async function sendInstagramMessage(
  config: InstagramConfig,
  recipientId: string,
  text: string
): Promise<boolean> {
  if (!config.access_token) {
    console.error('[Instagram] Access token not configured');
    return false;
  }

  const chunks = splitInstagramMessage(text);

  for (const chunk of chunks) {
    try {
      const response = await fetch(
        `${GRAPH_API_BASE}/me/messages?access_token=${encodeURIComponent(config.access_token)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: chunk },
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('[Instagram] API error:', response.status, data);
        return false;
      }
    } catch (error) {
      console.error('[Instagram] Failed to send message:', error);
      return false;
    }
  }

  return true;
}
