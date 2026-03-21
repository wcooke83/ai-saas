/**
 * Telegram Integration Types
 * Types for the per-chatbot Telegram live handoff system
 */

export interface TelegramConfig {
  enabled: boolean;
  bot_token?: string;
  chat_id?: string;
  webhook_secret?: string;
  auto_handoff_on_escalation?: boolean;
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  enabled: false,
  auto_handoff_on_escalation: true,
};

export interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  from?: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
  };
  text?: string;
  reply_to_message?: {
    message_id: number;
    text?: string;
  };
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export type HandoffStatus = 'pending' | 'active' | 'resolved';

export interface HandoffSession {
  id: string;
  chatbot_id: string;
  conversation_id: string;
  session_id: string | null;
  status: HandoffStatus;
  agent_name: string | null;
  agent_telegram_id: number | null;
  escalation_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}
