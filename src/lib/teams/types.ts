/**
 * Microsoft Teams Integration Types
 * Bot Framework Activity types and related interfaces for the Teams integration.
 *
 * TeamsConfig and DEFAULT_TEAMS_CONFIG are defined in @/lib/chatbots/types
 * alongside the other integration configs.
 */

export type { TeamsConfig } from '@/lib/chatbots/types';
export { DEFAULT_TEAMS_CONFIG } from '@/lib/chatbots/types';

/**
 * Bot Framework Activity (simplified).
 * See: https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference
 */
export interface TeamsActivity {
  type: string;              // 'message', 'conversationUpdate', 'invoke', etc.
  id: string;                // Activity ID (used when replying)
  timestamp: string;
  serviceUrl: string;        // Base URL for sending replies
  channelId: string;         // 'msteams'
  from: TeamsChannelAccount;
  conversation: TeamsConversationAccount;
  recipient: TeamsChannelAccount;
  text?: string;
  textFormat?: string;       // 'plain', 'markdown', 'xml'
  locale?: string;
  channelData?: Record<string, unknown>;
  entities?: TeamsEntity[];
}

export interface TeamsChannelAccount {
  id: string;
  name?: string;
  aadObjectId?: string;      // Azure AD Object ID
}

export interface TeamsConversationAccount {
  id: string;
  conversationType?: string; // 'personal', 'groupChat', 'channel'
  tenantId?: string;
  isGroup?: boolean;
  name?: string;
}

export interface TeamsEntity {
  type: string;              // 'mention', 'clientInfo', etc.
  mentioned?: TeamsChannelAccount;
  text?: string;
}

/**
 * Bot Framework token response from Microsoft identity platform.
 */
export interface BotFrameworkTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
