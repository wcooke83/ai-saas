/**
 * SMS / Twilio Integration Types
 * Per-chatbot Twilio integration — each chatbot brings its own credentials.
 */

export interface SmsConfig {
  enabled: boolean;
  account_sid?: string;          // Twilio Account SID (ACxxxxxxx)
  auth_token?: string;           // AES-256-GCM encrypted at rest (prefix: "enc:")
  phone_number?: string;         // E.164 format: "+14155551234"
  max_response_length?: number;  // Default: 320 chars (2 SMS segments)
  ai_responses_enabled?: boolean;
}

export const DEFAULT_SMS_CONFIG: SmsConfig = {
  enabled: false,
  ai_responses_enabled: false,
  max_response_length: 320,
};

// Twilio POSTs form-encoded body (NOT JSON)
export interface SmsWebhookBody {
  MessageSid: string;
  AccountSid: string;
  From: string;       // E.164 sender
  To: string;         // E.164 recipient (Twilio number)
  Body: string;       // SMS text
  NumMedia: string;   // "0" for text-only
  NumSegments?: string;
  SmsStatus?: string;
}
