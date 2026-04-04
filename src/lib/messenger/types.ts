export interface MessengerConfig {
  enabled: boolean;
  page_id?: string;
  page_name?: string;
  access_token?: string; // Page Access Token, encrypted at rest
  ai_responses_enabled?: boolean;
}

export const DEFAULT_MESSENGER_CONFIG: MessengerConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

export interface MessengerWebhookPayload {
  object: 'page';
  entry: MessengerEntry[];
}

export interface MessengerEntry {
  id: string; // Page ID
  time: number;
  messaging: MessengerMessagingEvent[];
}

export interface MessengerMessagingEvent {
  sender: { id: string }; // User PSID
  recipient: { id: string }; // Page ID
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    is_echo?: boolean;
    attachments?: Array<{ type: string; payload: unknown }>;
  };
  read?: { watermark: number };
  delivery?: { watermark: number; seq: number };
  postback?: { title: string; payload: string };
}
