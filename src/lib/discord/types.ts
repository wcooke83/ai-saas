/**
 * Discord Integration Types
 * Types for the per-chatbot Discord slash command integration
 */

export interface DiscordConfig {
  enabled: boolean;
  bot_token?: string;          // Discord bot token (encrypted at rest)
  application_id?: string;     // Discord application ID
  public_key?: string;         // For interaction signature verification (Ed25519)
  guild_id?: string;           // Optional: restrict to specific server
  command_id?: string;         // Registered slash command ID (for cleanup)
  ai_responses_enabled?: boolean;
}

export const DEFAULT_DISCORD_CONFIG: DiscordConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

// ── Discord Interaction Types ──────────────────────────────────────

/** Discord interaction type constants */
export const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
} as const;

/** Discord interaction response type constants */
export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
} as const;

/** Discord application command option type constants */
export const ApplicationCommandOptionType = {
  STRING: 3,
} as const;

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string;
}

export interface DiscordInteraction {
  id: string;
  application_id: string;
  type: number;
  data?: {
    id?: string;
    name: string;
    options?: Array<{
      name: string;
      value: string;
      type: number;
    }>;
  };
  guild_id?: string;
  channel_id?: string;
  member?: { user: DiscordUser };
  user?: DiscordUser;    // Present in DMs (no guild)
  token: string;         // Interaction token for responding/following up
}
