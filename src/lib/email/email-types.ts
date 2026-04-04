export interface EmailConfig {
  enabled: boolean;
  email_address?: string;         // {chatbotId}@inbound.vocui.com
  ai_responses_enabled?: boolean; // Default: true
  reply_name?: string;            // e.g. "Acme Support"
}

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  enabled: false,
  ai_responses_enabled: true,
};
