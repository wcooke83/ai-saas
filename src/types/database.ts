export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
          grade: string
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
          grade: string
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
          grade?: string
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
          created_at: string
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
          created_at?: string
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
          created_at?: string
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          ai_provider: string
          id: string
          local_api_key: string | null
          local_api_path: string | null
          local_api_provider: string | null
          local_api_timeout: number | null
          multiplier_claude: number | null
          multiplier_local: number | null
          multiplier_openai: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ai_provider?: string
          id?: string
          local_api_key?: string | null
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ai_provider?: string
          id?: string
          local_api_key?: string | null
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
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
          created_at?: string
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
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "chatbot_analytics_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "chatbot_api_keys_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbots: {
        Row: {
          created_at: string | null
          description: string | null
          enable_prompt_protection: boolean
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
          enable_prompt_protection?: boolean
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
          enable_prompt_protection?: boolean
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
        Relationships: [
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          model: string
          output: string | null
          prompt: string
          rating: number | null
          status: string
          tokens_input: number | null
          tokens_output: number | null
          tool_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          model?: string
          output?: string | null
          prompt: string
          rating?: number | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tool_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          model?: string
          output?: string | null
          prompt?: string
          rating?: number | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tool_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "knowledge_chunks_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "messages_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_affiliate: boolean | null
          preferred_model_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_affiliate?: boolean | null
          preferred_model_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_affiliate?: boolean | null
          preferred_model_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_model_id_fkey"
            columns: ["preferred_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "rate_limit_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "slack_integrations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slack_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          is_hidden: boolean | null
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
          usage_description: string | null
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
          is_hidden?: boolean | null
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
          usage_description?: string | null
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
          is_hidden?: boolean | null
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
          usage_description?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          grace_period_ends_at: string | null
          id: string
          payment_failed_at: string | null
          plan: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          trial_link_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          plan?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          trial_link_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          plan?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          trial_link_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_trial_link_id_fkey"
            columns: ["trial_link_id"]
            isOneToOne: false
            referencedRelation: "trial_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category: string
          config: Json | null
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category: string
          config?: Json | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
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
        Relationships: [
          {
            foreignKeyName: "trial_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_links_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "trial_redemptions_trial_link_id_fkey"
            columns: ["trial_link_id"]
            isOneToOne: false
            referencedRelation: "trial_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage: {
        Row: {
          created_at: string
          credits_limit: number
          credits_used: number
          id: string
          period_end: string
          period_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_limit?: number
          credits_used?: number
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_limit?: number
          credits_used?: number
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[] | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_bonus_credits: {
        Args: { p_amount: number; p_description?: string; p_user_id: string }
        Returns: number
      }
      add_purchased_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_payment_intent_id?: string
          p_type?: string
          p_user_id: string
        }
        Returns: number
      }
      aggregate_chatbot_analytics: {
        Args: { p_date?: string }
        Returns: undefined
      }
      change_subscription_plan: {
        Args: {
          p_billing_interval?: string
          p_new_plan_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_token_limit: number
          p_tokens_requested: number
          p_user_id: string
          p_window_seconds: number
        }
        Returns: {
          allowed: boolean
          is_soft_cap: boolean
          reset_at: string
          tokens_remaining: number
          tokens_used: number
        }[]
      }
      check_subscription_status: {
        Args: { p_user_id: string }
        Returns: {
          days_remaining: number
          grace_period_ends_at: string
          grace_period_expired: boolean
          is_active: boolean
          is_in_grace_period: boolean
          is_past_due: boolean
          subscription_status: string
        }[]
      }
      cleanup_rate_limit_usage: { Args: never; Returns: number }
      clear_payment_failure: {
        Args: { p_stripe_subscription_id: string }
        Returns: undefined
      }
      deduct_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_related_model_id?: string
          p_related_usage_id?: string
          p_user_id: string
        }
        Returns: {
          deducted_from: string
          remaining_total: number
          success: boolean
        }[]
      }
      end_trial: {
        Args: { p_convert_to_paid?: boolean; p_user_id: string }
        Returns: undefined
      }
      expire_trial: {
        Args: { p_converted?: boolean; p_redemption_id: string }
        Returns: boolean
      }
      get_active_trial: {
        Args: { p_user_id: string }
        Returns: {
          credits_limit: number
          expires_at: string
          features: Json
          plan_id: string
          plan_slug: string
          trial_id: string
        }[]
      }
      get_credit_balance: {
        Args: { p_user_id: string }
        Returns: {
          bonus_credits: number
          plan_allocation: number
          plan_remaining: number
          plan_used: number
          purchased_credits: number
          total_available: number
        }[]
      }
      get_effective_plan: {
        Args: { p_user_id: string }
        Returns: {
          billing_status: string
          credits_monthly: number
          features: Json
          is_trial: boolean
          plan_id: string
          plan_name: string
          plan_slug: string
          rate_limit_is_hard_cap: boolean
          rate_limit_period_seconds: number
          rate_limit_tokens: number
          trial_expires_at: string
        }[]
      }
      get_rate_limit_status: {
        Args: { p_user_id: string }
        Returns: {
          is_hard_cap: boolean
          reset_at: string
          tokens_limit: number
          tokens_remaining: number
          tokens_used: number
          window_seconds: number
        }[]
      }
      increment_chatbot_messages: {
        Args: { p_amount?: number; p_chatbot_id: string }
        Returns: undefined
      }
      increment_conversation_messages: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      increment_usage: {
        Args: { p_amount?: number; p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: { p_user_id: string }; Returns: boolean }
      match_knowledge_chunks: {
        Args: {
          p_chatbot_id: string
          p_match_count?: number
          p_match_threshold?: number
          p_query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      redeem_trial_link: {
        Args: { p_code: string; p_user_id: string }
        Returns: {
          expires_at: string
          message: string
          success: boolean
          trial_id: string
        }[]
      }
      reset_monthly_message_counts: { Args: never; Returns: undefined }
      reset_plan_credits: { Args: { p_user_id: string }; Returns: undefined }
      set_payment_failed: {
        Args: { p_grace_days?: number; p_stripe_subscription_id: string }
        Returns: undefined
      }
      should_auto_topup: {
        Args: { p_user_id: string }
        Returns: {
          amount: number
          reason: string
          should_trigger: boolean
        }[]
      }
      start_subscription_trial: {
        Args: {
          p_plan_id: string
          p_trial_days: number
          p_trial_link_id?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

