export interface InstagramConfig {
  enabled: boolean;
  instagram_id?: string;
  username?: string;
  access_token?: string; // Access Token, encrypted at rest
  ai_responses_enabled?: boolean;
}

export const DEFAULT_INSTAGRAM_CONFIG: InstagramConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

export interface InstagramWebhookPayload {
  object: 'instagram';
  entry: InstagramEntry[];
}

export interface InstagramEntry {
  id: string; // Instagram account ID
  time: number;
  messaging: InstagramMessagingEvent[];
}

export interface InstagramMessagingEvent {
  sender: { id: string }; // Instagram-scoped user ID
  recipient: { id: string }; // Instagram account ID
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    is_echo?: boolean;
    attachments?: Array<{ type: string; payload: unknown }>;
  };
  read?: { watermark: number };
  delivery?: { watermark: number; seq: number };
}
