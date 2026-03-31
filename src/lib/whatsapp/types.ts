/**
 * WhatsApp Business API Integration Types
 * Types for the per-chatbot WhatsApp Cloud API integration
 */

// ── Config ─────────────────────────────────────────────────────────

export interface WhatsAppConfig {
  enabled: boolean;
  phone_number_id?: string;       // Meta's phone number ID
  access_token?: string;           // System User access token (encrypted at rest)
  verify_token?: string;           // Webhook verification token
  waba_id?: string;               // WhatsApp Business Account ID
  display_phone?: string;          // Display phone number for UI (E.164)
  ai_responses_enabled?: boolean;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

// ── Webhook Payload ────────────────────────────────────────────────

export interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string; // WABA ID
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppChangeValue;
  field: string; // 'messages'
}

export interface WhatsAppChangeValue {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

// ── Incoming Message ───────────────────────────────────────────────

export interface WhatsAppMessage {
  from: string;          // Sender phone in E.164 (e.g. "14155238886")
  id: string;            // Message ID (e.g. "wamid.xxxx")
  timestamp: string;     // Unix epoch seconds
  type: WhatsAppMessageType;
  text?: { body: string };
  image?: WhatsAppMedia;
  audio?: WhatsAppMedia;
  video?: WhatsAppMedia;
  document?: WhatsAppMedia;
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  reaction?: { message_id: string; emoji: string };
}

export type WhatsAppMessageType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'location'
  | 'reaction'
  | 'sticker'
  | 'contacts'
  | 'interactive'
  | 'button'
  | 'unknown';

export interface WhatsAppMedia {
  id: string;
  mime_type: string;
  sha256?: string;
  caption?: string;
}

// ── Contact ────────────────────────────────────────────────────────

export interface WhatsAppContact {
  profile: { name: string };
  wa_id: string; // Phone number
}

// ── Status Update ──────────────────────────────────────────────────

export interface WhatsAppStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string; message: string }>;
}

// ── Outbound API ───────────────────────────────────────────────────

export interface WhatsAppSendMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text';
  text: { preview_url: boolean; body: string };
}
