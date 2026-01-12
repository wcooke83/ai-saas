export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_models: {
        Row: {
          api_model_id: string
          cost_input_per_mtok: number | null
          cost_output_per_mtok: number | null
          created_at: string | null
          display_order: number | null
          id: string
          is_default: boolean | null
          is_enabled: boolean | null
          max_tokens: number | null
          name: string
          provider_id: string
          retail_input_per_mtok: number | null
          retail_output_per_mtok: number | null
          slug: string
          supports_streaming: boolean | null
          tier: string | null
          updated_at: string | null
          wholesale_input_per_mtok: number | null
          wholesale_output_per_mtok: number | null
        }
        Insert: {
          api_model_id: string
          cost_input_per_mtok?: number | null
          cost_output_per_mtok?: number | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          max_tokens?: number | null
          name: string
          provider_id: string
          retail_input_per_mtok?: number | null
          retail_output_per_mtok?: number | null
          slug: string
          supports_streaming?: boolean | null
          tier?: string | null
          updated_at?: string | null
          wholesale_input_per_mtok?: number | null
          wholesale_output_per_mtok?: number | null
        }
        Update: {
          api_model_id?: string
          cost_input_per_mtok?: number | null
          cost_output_per_mtok?: number | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          max_tokens?: number | null
          name?: string
          provider_id?: string
          retail_input_per_mtok?: number | null
          retail_output_per_mtok?: number | null
          slug?: string
          supports_streaming?: boolean | null
          tier?: string | null
          updated_at?: string | null
          wholesale_input_per_mtok?: number | null
          wholesale_output_per_mtok?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_enabled: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          allowed_domains: string[] | null
          created_at: string | null
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          scopes: string[] | null
          user_id: string
        }
        Insert: {
          allowed_domains?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          user_id: string
        }
        Update: {
          allowed_domains?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      api_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          method: string
          model: string | null
          provider: string | null
          raw_ai_prompt: string | null
          raw_ai_response: string | null
          request_body: Json | null
          response_body: Json | null
          status_code: number | null
          tokens_billed: number | null
          tokens_input: number | null
          tokens_output: number | null
          tokens_total: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string
          model?: string | null
          provider?: string | null
          raw_ai_prompt?: string | null
          raw_ai_response?: string | null
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          tokens_billed?: number | null
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_total?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string
          model?: string | null
          provider?: string | null
          raw_ai_prompt?: string | null
          raw_ai_response?: string | null
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
          tokens_billed?: number | null
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_total?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          ai_provider: string
          id: string
          local_api_path: string | null
          local_api_provider: string | null
          local_api_timeout: number | null
          multiplier_claude: number | null
          multiplier_local: number | null
          multiplier_openai: number | null
          token_multiplier: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ai_provider?: string
          id?: string
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          token_multiplier?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ai_provider?: string
          id?: string
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          token_multiplier?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_analytics: {
        Row: {
          avg_messages_per_conversation: number | null
          avg_response_time_ms: number | null
          chatbot_id: string
          conversations_count: number | null
          created_at: string | null
          date: string
          id: string
          messages_count: number | null
          thumbs_down_count: number | null
          thumbs_up_count: number | null
          top_questions: Json | null
          unique_visitors: number | null
        }
        Insert: {
          avg_messages_per_conversation?: number | null
          avg_response_time_ms?: number | null
          chatbot_id: string
          conversations_count?: number | null
          created_at?: string | null
          date: string
          id?: string
          messages_count?: number | null
          thumbs_down_count?: number | null
          thumbs_up_count?: number | null
          top_questions?: Json | null
          unique_visitors?: number | null
        }
        Update: {
          avg_messages_per_conversation?: number | null
          avg_response_time_ms?: number | null
          chatbot_id?: string
          conversations_count?: number | null
          created_at?: string | null
          date?: string
          id?: string
          messages_count?: number | null
          thumbs_down_count?: number | null
          thumbs_up_count?: number | null
          top_questions?: Json | null
          unique_visitors?: number | null
        }
        Relationships: []
      }
      chatbot_api_keys: {
        Row: {
          chatbot_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          rate_limit: number | null
          scopes: string[] | null
          user_id: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          rate_limit?: number | null
          scopes?: string[] | null
          user_id: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          rate_limit?: number | null
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      chatbots: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          max_tokens: number | null
          messages_this_month: number | null
          model: string | null
          monthly_message_limit: number | null
          name: string
          placeholder_text: string | null
          pricing_type: string | null
          slug: string
          status: string | null
          stripe_product_id: string | null
          system_prompt: string
          temperature: number | null
          updated_at: string | null
          user_id: string
          welcome_message: string | null
          widget_config: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          max_tokens?: number | null
          messages_this_month?: number | null
          model?: string | null
          monthly_message_limit?: number | null
          name: string
          placeholder_text?: string | null
          pricing_type?: string | null
          slug: string
          status?: string | null
          stripe_product_id?: string | null
          system_prompt?: string
          temperature?: number | null
          updated_at?: string | null
          user_id: string
          welcome_message?: string | null
          widget_config?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          max_tokens?: number | null
          messages_this_month?: number | null
          model?: string | null
          monthly_message_limit?: number | null
          name?: string
          placeholder_text?: string | null
          pricing_type?: string | null
          slug?: string
          status?: string | null
          stripe_product_id?: string | null
          system_prompt?: string
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
          welcome_message?: string | null
          widget_config?: Json | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          channel: string | null
          chatbot_id: string
          created_at: string | null
          feedback_text: string | null
          first_message_at: string | null
          id: string
          last_message_at: string | null
          message_count: number | null
          rating: number | null
          session_id: string
          status: string | null
          updated_at: string | null
          visitor_id: string | null
          visitor_metadata: Json | null
        }
        Insert: {
          channel?: string | null
          chatbot_id: string
          created_at?: string | null
          feedback_text?: string | null
          first_message_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          rating?: number | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          visitor_id?: string | null
          visitor_metadata?: Json | null
        }
        Update: {
          channel?: string | null
          chatbot_id?: string
          created_at?: string | null
          feedback_text?: string | null
          first_message_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          rating?: number | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          visitor_id?: string | null
          visitor_metadata?: Json | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string | null
          credit_source: string | null
          description: string | null
          id: string
          metadata: Json | null
          related_model_id: string | null
          related_usage_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string | null
          credit_source?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          related_model_id?: string | null
          related_usage_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string | null
          credit_source?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          related_model_id?: string | null
          related_usage_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      generations: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          model: string | null
          output: string | null
          prompt: string
          rating: number | null
          status: string | null
          tokens_input: number | null
          tokens_output: number | null
          tool_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          model?: string | null
          output?: string | null
          prompt: string
          rating?: number | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          tool_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          model?: string | null
          output?: string | null
          prompt?: string
          rating?: number | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          tool_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_chunks: {
        Row: {
          chatbot_id: string
          chunk_index: number
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source_id: string
          token_count: number | null
        }
        Insert: {
          chatbot_id: string
          chunk_index: number
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id: string
          token_count?: number | null
        }
        Update: {
          chatbot_id?: string
          chunk_index?: number
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string
          token_count?: number | null
        }
        Relationships: []
      }
      knowledge_sources: {
        Row: {
          answer: string | null
          chatbot_id: string
          chunks_count: number | null
          content: string | null
          created_at: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          name: string
          question: string | null
          status: string | null
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          answer?: string | null
          chatbot_id: string
          chunks_count?: number | null
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          name: string
          question?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          answer?: string | null
          chatbot_id?: string
          chunks_count?: number | null
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          question?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chatbot_id: string
          content: string
          context_chunks: Json | null
          conversation_id: string
          created_at: string | null
          id: string
          latency_ms: number | null
          model: string | null
          role: string
          thumbs_up: boolean | null
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          chatbot_id: string
          content: string
          context_chunks?: Json | null
          conversation_id: string
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          model?: string | null
          role: string
          thumbs_up?: boolean | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          chatbot_id?: string
          content?: string
          context_chunks?: Json | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          model?: string | null
          role?: string
          thumbs_up?: boolean | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_affiliate: boolean | null
          preferred_model_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_affiliate?: boolean | null
          preferred_model_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_affiliate?: boolean | null
          preferred_model_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limit_usage: {
        Row: {
          created_at: string | null
          id: string
          plan_slug: string | null
          requests_count: number | null
          tokens_used: number | null
          updated_at: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_slug?: string | null
          requests_count?: number | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_slug?: string | null
          requests_count?: number | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      slack_integrations: {
        Row: {
          bot_token: string
          bot_user_id: string | null
          channel_ids: string[] | null
          chatbot_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          mention_only: boolean | null
          team_id: string
          team_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bot_token: string
          bot_user_id?: string | null
          channel_ids?: string[] | null
          chatbot_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mention_only?: boolean | null
          team_id: string
          team_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bot_token?: string
          bot_user_id?: string | null
          channel_ids?: string[] | null
          chatbot_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mention_only?: boolean | null
          team_id?: string
          team_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          api_keys_limit: number | null
          created_at: string | null
          credits_monthly: number
          credits_rollover: boolean | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_monthly_cents: number
          price_yearly_cents: number | null
          rate_limit_is_hard_cap: boolean | null
          rate_limit_period_seconds: number | null
          rate_limit_tokens: number | null
          slug: string
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          trial_credits: number | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          api_keys_limit?: number | null
          created_at?: string | null
          credits_monthly?: number
          credits_rollover?: boolean | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_monthly_cents?: number
          price_yearly_cents?: number | null
          rate_limit_is_hard_cap?: boolean | null
          rate_limit_period_seconds?: number | null
          rate_limit_tokens?: number | null
          slug: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          trial_credits?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          api_keys_limit?: number | null
          created_at?: string | null
          credits_monthly?: number
          credits_rollover?: boolean | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_monthly_cents?: number
          price_yearly_cents?: number | null
          rate_limit_is_hard_cap?: boolean | null
          rate_limit_period_seconds?: number | null
          rate_limit_tokens?: number | null
          slug?: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          trial_credits?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string | null
          plan_id: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          trial_link_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string | null
          plan_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          trial_link_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string | null
          plan_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          trial_link_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          config: Json | null
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          category: string
          config?: Json | null
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trial_links: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          credits_limit: number | null
          description: string | null
          duration_days: number
          expires_at: string | null
          features_override: Json | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          name: string | null
          plan_id: string | null
          redemptions_count: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          credits_limit?: number | null
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          features_override?: Json | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name?: string | null
          plan_id?: string | null
          redemptions_count?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          credits_limit?: number | null
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          features_override?: Json | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          name?: string | null
          plan_id?: string | null
          redemptions_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trial_redemptions: {
        Row: {
          converted_at: string | null
          expires_at: string
          id: string
          redeemed_at: string | null
          status: string | null
          trial_link_id: string
          user_id: string
        }
        Insert: {
          converted_at?: string | null
          expires_at: string
          id?: string
          redeemed_at?: string | null
          status?: string | null
          trial_link_id: string
          user_id: string
        }
        Update: {
          converted_at?: string | null
          expires_at?: string
          id?: string
          redeemed_at?: string | null
          status?: string | null
          trial_link_id?: string
          user_id?: string
        }
        Relationships: []
      }
      usage: {
        Row: {
          created_at: string | null
          credits_limit: number | null
          credits_used: number | null
          id: string
          period_end: string | null
          period_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_limit?: number | null
          credits_used?: number | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_limit?: number | null
          credits_used?: number | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          auto_topup_amount: number | null
          auto_topup_enabled: boolean | null
          auto_topup_max_monthly: number | null
          auto_topup_month_start: string | null
          auto_topup_this_month: number | null
          auto_topup_threshold: number | null
          bonus_credits: number | null
          created_at: string | null
          default_payment_method_id: string | null
          id: string
          purchased_credits: number | null
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_max_monthly?: number | null
          auto_topup_month_start?: string | null
          auto_topup_this_month?: number | null
          auto_topup_threshold?: number | null
          bonus_credits?: number | null
          created_at?: string | null
          default_payment_method_id?: string | null
          id?: string
          purchased_credits?: number | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_max_monthly?: number | null
          auto_topup_month_start?: string | null
          auto_topup_this_month?: number | null
          auto_topup_threshold?: number | null
          bonus_credits?: number | null
          created_at?: string | null
          default_payment_method_id?: string | null
          id?: string
          purchased_credits?: number | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[] | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"]
