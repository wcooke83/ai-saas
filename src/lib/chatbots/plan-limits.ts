import { createClient } from '@/lib/supabase/server';

export interface PlanLimits {
  chatbots: number;            // -1 = unlimited
  knowledgeSources: number;    // -1 = unlimited
  maxFileSizeBytes: number;
  slackEnabled: boolean;
  telegramEnabled: boolean;
  whatsappEnabled: boolean;
  discordEnabled: boolean;
  teamsEnabled: boolean;
  customBrandingEnabled: boolean;
  monthlyMessageLimit: number; // 0 = unlimited (driven per-chatbot row, not here)
  apiKeysLimit: number;        // -1 = unlimited
}

/** Fallback used when DB is unavailable or plan slug is not found. */
export const FREE_PLAN_LIMITS: PlanLimits = {
  chatbots: 1,
  knowledgeSources: 3,
  maxFileSizeBytes: 5242880, // 5 MB
  slackEnabled: false,
  telegramEnabled: false,
  whatsappEnabled: false,
  discordEnabled: false,
  teamsEnabled: false,
  customBrandingEnabled: false,
  monthlyMessageLimit: 100,
  apiKeysLimit: 0,
};

export async function getPlanLimits(planSlug: string): Promise<PlanLimits> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('chatbots_limit, knowledge_sources_limit, max_file_size_bytes, slack_enabled, telegram_enabled, whatsapp_enabled, discord_enabled, teams_enabled, custom_branding_enabled, api_keys_limit')
    .eq('slug', planSlug)
    .single<{
      chatbots_limit: number;
      knowledge_sources_limit: number;
      max_file_size_bytes: number;
      slack_enabled: boolean;
      telegram_enabled: boolean;
      whatsapp_enabled: boolean;
      discord_enabled: boolean;
      teams_enabled: boolean;
      custom_branding_enabled: boolean;
      api_keys_limit: number | null;
    }>();

  if (error || !data) {
    return FREE_PLAN_LIMITS;
  }

  return {
    chatbots: data.chatbots_limit,
    knowledgeSources: data.knowledge_sources_limit,
    maxFileSizeBytes: data.max_file_size_bytes,
    slackEnabled: data.slack_enabled,
    telegramEnabled: data.telegram_enabled,
    whatsappEnabled: data.whatsapp_enabled,
    discordEnabled: data.discord_enabled,
    teamsEnabled: data.teams_enabled,
    customBrandingEnabled: data.custom_branding_enabled,
    monthlyMessageLimit: 0, // driven per-chatbot row
    apiKeysLimit: data.api_keys_limit ?? 0,
  };
}
