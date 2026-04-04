export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_presence: {
        Row: {
          agent_name: string | null
          chatbot_id: string
          id: string
          last_heartbeat: string
          user_id: string
        }
        Insert: {
          agent_name?: string | null
          chatbot_id: string
          id?: string
          last_heartbeat?: string
          user_id: string
        }
        Update: {
          agent_name?: string | null
          chatbot_id?: string
          id?: string
          last_heartbeat?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_presence_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "api_logs_user_id_fkey"
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
          article_generation_model_id: string | null
          chat_debug_mode: boolean
          embedding_model_id: string | null
          id: string
          local_api_key: string | null
          local_api_path: string | null
          local_api_provider: string | null
          local_api_timeout: number | null
          multiplier_claude: number | null
          multiplier_local: number | null
          multiplier_openai: number | null
          sentiment_model_id: string | null
          token_multiplier: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ai_provider?: string
          article_generation_model_id?: string | null
          chat_debug_mode?: boolean
          embedding_model_id?: string | null
          id?: string
          local_api_key?: string | null
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          sentiment_model_id?: string | null
          token_multiplier?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ai_provider?: string
          article_generation_model_id?: string | null
          chat_debug_mode?: boolean
          embedding_model_id?: string | null
          id?: string
          local_api_key?: string | null
          local_api_path?: string | null
          local_api_provider?: string | null
          local_api_timeout?: number | null
          multiplier_claude?: number | null
          multiplier_local?: number | null
          multiplier_openai?: number | null
          sentiment_model_id?: string | null
          token_multiplier?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_article_generation_model_id_fkey"
            columns: ["article_generation_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_settings_embedding_model_id_fkey"
            columns: ["embedding_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_settings_sentiment_model_id_fkey"
            columns: ["sentiment_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_extraction_prompts: {
        Row: {
          chatbot_id: string
          created_at: string
          enabled: boolean
          id: string
          last_generated_at: string | null
          question: string
          schedule: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_generated_at?: string | null
          question: string
          schedule?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_generated_at?: string | null
          question?: string
          schedule?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_extraction_prompts_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
      calendar_availability_cache: {
        Row: {
          date: string
          expires_at: string
          fetched_at: string | null
          id: string
          integration_id: string
          slots: Json
        }
        Insert: {
          date: string
          expires_at: string
          fetched_at?: string | null
          id?: string
          integration_id: string
          slots: Json
        }
        Update: {
          date?: string
          expires_at?: string
          fetched_at?: string | null
          id?: string
          integration_id?: string
          slots?: Json
        }
        Relationships: [
          {
            foreignKeyName: "calendar_availability_cache_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_bookings: {
        Row: {
          attendee_email: string
          attendee_name: string
          attendee_timezone: string
          chat_session_id: string | null
          chatbot_id: string
          created_at: string | null
          end_time: string
          id: string
          integration_id: string | null
          meeting_url: string | null
          metadata: Json | null
          notes: string | null
          provider: string
          provider_booking_id: string | null
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          attendee_email: string
          attendee_name: string
          attendee_timezone?: string
          chat_session_id?: string | null
          chatbot_id: string
          created_at?: string | null
          end_time: string
          id?: string
          integration_id?: string | null
          meeting_url?: string | null
          metadata?: Json | null
          notes?: string | null
          provider: string
          provider_booking_id?: string | null
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          attendee_email?: string
          attendee_name?: string
          attendee_timezone?: string
          chat_session_id?: string | null
          chatbot_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          integration_id?: string | null
          meeting_url?: string | null
          metadata?: Json | null
          notes?: string | null
          provider?: string
          provider_booking_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_bookings_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_bookings_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_bookings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_business_hours: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          integration_id: string
          is_enabled: boolean | null
          start_time: string
        }
        Insert: {
          day_of_week: number
          end_time?: string
          id?: string
          integration_id: string
          is_enabled?: boolean | null
          start_time?: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          integration_id?: string
          is_enabled?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_business_hours_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_event_types: {
        Row: {
          buffer_after_minutes: number | null
          buffer_before_minutes: number | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          integration_id: string
          is_active: boolean | null
          max_days_ahead: number | null
          min_notice_hours: number | null
          provider_event_type_id: string | null
          provider_schedule_id: string | null
          slug: string
          timezone: string
          title: string
          updated_at: string | null
        }
        Insert: {
          buffer_after_minutes?: number | null
          buffer_before_minutes?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          integration_id: string
          is_active?: boolean | null
          max_days_ahead?: number | null
          min_notice_hours?: number | null
          provider_event_type_id?: string | null
          provider_schedule_id?: string | null
          slug?: string
          timezone?: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          buffer_after_minutes?: number | null
          buffer_before_minutes?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          integration_id?: string
          is_active?: boolean | null
          max_days_ahead?: number | null
          min_notice_hours?: number | null
          provider_event_type_id?: string | null
          provider_schedule_id?: string | null
          slug?: string
          timezone?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_event_types_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_integrations: {
        Row: {
          chatbot_id: string
          config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chatbot_id: string
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chatbot_id?: string
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_integrations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_performance_log: {
        Row: {
          assistant_response: string | null
          attachments_ms: number | null
          chatbot_id: string
          chatbot_loaded_ms: number | null
          conversation_id: string | null
          conversation_ready_ms: number | null
          created_at: string
          first_token_ms: number | null
          history_msg_handoff_ms: number | null
          id: string
          is_streaming: boolean | null
          live_fetch_triggered: boolean | null
          message_length: number | null
          model: string | null
          pipeline_timings: Json | null
          prompts_built_ms: number | null
          rag_chunks_count: number | null
          rag_confidence: number | null
          rag_embedding_ms: number | null
          rag_live_fetch_ms: number | null
          rag_similarity_ms: number | null
          rag_total_ms: number | null
          response_length: number | null
          session_id: string | null
          stream_complete_ms: number | null
          total_ms: number | null
          user_message: string | null
        }
        Insert: {
          assistant_response?: string | null
          attachments_ms?: number | null
          chatbot_id: string
          chatbot_loaded_ms?: number | null
          conversation_id?: string | null
          conversation_ready_ms?: number | null
          created_at?: string
          first_token_ms?: number | null
          history_msg_handoff_ms?: number | null
          id?: string
          is_streaming?: boolean | null
          live_fetch_triggered?: boolean | null
          message_length?: number | null
          model?: string | null
          pipeline_timings?: Json | null
          prompts_built_ms?: number | null
          rag_chunks_count?: number | null
          rag_confidence?: number | null
          rag_embedding_ms?: number | null
          rag_live_fetch_ms?: number | null
          rag_similarity_ms?: number | null
          rag_total_ms?: number | null
          response_length?: number | null
          session_id?: string | null
          stream_complete_ms?: number | null
          total_ms?: number | null
          user_message?: string | null
        }
        Update: {
          assistant_response?: string | null
          attachments_ms?: number | null
          chatbot_id?: string
          chatbot_loaded_ms?: number | null
          conversation_id?: string | null
          conversation_ready_ms?: number | null
          created_at?: string
          first_token_ms?: number | null
          history_msg_handoff_ms?: number | null
          id?: string
          is_streaming?: boolean | null
          live_fetch_triggered?: boolean | null
          message_length?: number | null
          model?: string | null
          pipeline_timings?: Json | null
          prompts_built_ms?: number | null
          rag_chunks_count?: number | null
          rag_confidence?: number | null
          rag_embedding_ms?: number | null
          rag_live_fetch_ms?: number | null
          rag_similarity_ms?: number | null
          rag_total_ms?: number | null
          response_length?: number | null
          session_id?: string | null
          stream_complete_ms?: number | null
          total_ms?: number | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_performance_log_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_performance_log_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
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
      chatbot_leads: {
        Row: {
          chatbot_id: string
          conversation_id: string | null
          created_at: string | null
          form_data: Json
          id: string
          session_id: string | null
        }
        Insert: {
          chatbot_id: string
          conversation_id?: string | null
          created_at?: string | null
          form_data?: Json
          id?: string
          session_id?: string | null
        }
        Update: {
          chatbot_id?: string
          conversation_id?: string | null
          created_at?: string | null
          form_data?: Json
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_leads_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_leads_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_survey_responses: {
        Row: {
          chatbot_id: string
          conversation_id: string | null
          created_at: string | null
          id: string
          responses: Json
          session_id: string | null
        }
        Insert: {
          chatbot_id: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          responses?: Json
          session_id?: string | null
        }
        Update: {
          chatbot_id?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          responses?: Json
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_survey_responses_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_survey_responses_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbots: {
        Row: {
          allowed_origins: string[] | null
          article_last_generated_at: string | null
          article_schedule: string | null
          article_source_urls: string[] | null
          auto_topup_max_per_month: number
          auto_topup_package_id: string | null
          created_at: string | null
          credit_exhaustion_config: Json
          credit_exhaustion_mode: string
          custom_text_updated_at: string | null
          description: string | null
          discord_config: Json | null
          enable_prompt_protection: boolean
          escalation_config: Json
          feedback_config: Json | null
          file_upload_config: Json
          first_knowledge_ready_at: string | null
          first_knowledge_source_at: string | null
          id: string
          is_published: boolean | null
          language: string
          language_updated_at: string | null
          live_fetch_threshold: number | null
          live_handoff_config: Json
          logo_url: string | null
          max_tokens: number | null
          memory_days: number
          memory_enabled: boolean
          messages_this_month: number | null
          model: string | null
          monthly_message_limit: number | null
          name: string
          onboarding_step: number | null
          placeholder_text: string | null
          post_chat_survey_config: Json | null
          pre_chat_form_config: Json | null
          pricing_type: string | null
          proactive_messages_config: Json | null
          purchased_credits_remaining: number
          session_ttl_hours: number
          slug: string
          status: string | null
          stripe_product_id: string | null
          system_prompt: string
          teams_config: Json | null
          telegram_config: Json
          temperature: number | null
          transcript_config: Json
          updated_at: string | null
          user_id: string
          welcome_message: string | null
          whatsapp_config: Json | null
          messenger_config: Json | null
          instagram_config: Json | null
          sms_config: Json | null
          email_config: Json | null
          widget_config: Json | null
        }
        Insert: {
          allowed_origins?: string[] | null
          article_last_generated_at?: string | null
          article_schedule?: string | null
          article_source_urls?: string[] | null
          auto_topup_max_per_month?: number
          auto_topup_package_id?: string | null
          created_at?: string | null
          credit_exhaustion_config?: Json
          credit_exhaustion_mode?: string
          custom_text_updated_at?: string | null
          description?: string | null
          discord_config?: Json | null
          enable_prompt_protection?: boolean
          escalation_config?: Json
          feedback_config?: Json | null
          file_upload_config?: Json
          first_knowledge_ready_at?: string | null
          first_knowledge_source_at?: string | null
          id?: string
          is_published?: boolean | null
          language?: string
          language_updated_at?: string | null
          live_fetch_threshold?: number | null
          live_handoff_config?: Json
          logo_url?: string | null
          max_tokens?: number | null
          memory_days?: number
          memory_enabled?: boolean
          messages_this_month?: number | null
          model?: string | null
          monthly_message_limit?: number | null
          name: string
          onboarding_step?: number | null
          placeholder_text?: string | null
          post_chat_survey_config?: Json | null
          pre_chat_form_config?: Json | null
          pricing_type?: string | null
          proactive_messages_config?: Json | null
          purchased_credits_remaining?: number
          session_ttl_hours?: number
          slug: string
          status?: string | null
          stripe_product_id?: string | null
          system_prompt?: string
          teams_config?: Json | null
          telegram_config?: Json
          temperature?: number | null
          transcript_config?: Json
          updated_at?: string | null
          user_id: string
          welcome_message?: string | null
          whatsapp_config?: Json | null
          messenger_config?: Json | null
          instagram_config?: Json | null
          sms_config?: Json | null
          email_config?: Json | null
          widget_config?: Json | null
        }
        Update: {
          allowed_origins?: string[] | null
          article_last_generated_at?: string | null
          article_schedule?: string | null
          article_source_urls?: string[] | null
          auto_topup_max_per_month?: number
          auto_topup_package_id?: string | null
          created_at?: string | null
          credit_exhaustion_config?: Json
          credit_exhaustion_mode?: string
          custom_text_updated_at?: string | null
          description?: string | null
          discord_config?: Json | null
          enable_prompt_protection?: boolean
          escalation_config?: Json
          feedback_config?: Json | null
          file_upload_config?: Json
          first_knowledge_ready_at?: string | null
          first_knowledge_source_at?: string | null
          id?: string
          is_published?: boolean | null
          language?: string
          language_updated_at?: string | null
          live_fetch_threshold?: number | null
          live_handoff_config?: Json
          logo_url?: string | null
          max_tokens?: number | null
          memory_days?: number
          memory_enabled?: boolean
          messages_this_month?: number | null
          model?: string | null
          monthly_message_limit?: number | null
          name?: string
          onboarding_step?: number | null
          placeholder_text?: string | null
          post_chat_survey_config?: Json | null
          pre_chat_form_config?: Json | null
          pricing_type?: string | null
          proactive_messages_config?: Json | null
          purchased_credits_remaining?: number
          session_ttl_hours?: number
          slug?: string
          status?: string | null
          stripe_product_id?: string | null
          system_prompt?: string
          teams_config?: Json | null
          telegram_config?: Json
          temperature?: number | null
          transcript_config?: Json
          updated_at?: string | null
          user_id?: string
          welcome_message?: string | null
          whatsapp_config?: Json | null
          messenger_config?: Json | null
          instagram_config?: Json | null
          sms_config?: Json | null
          email_config?: Json | null
          widget_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_auto_topup_package_id_fkey"
            columns: ["auto_topup_package_id"]
            isOneToOne: false
            referencedRelation: "credit_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_replies: {
        Row: {
          created_at: string
          email_message_id: string | null
          id: string
          message: string
          sender_email: string
          sender_name: string
          sender_type: string
          submission_id: string
        }
        Insert: {
          created_at?: string
          email_message_id?: string | null
          id?: string
          message: string
          sender_email: string
          sender_name: string
          sender_type: string
          submission_id: string
        }
        Update: {
          created_at?: string
          email_message_id?: string | null
          id?: string
          message?: string
          sender_email?: string
          sender_name?: string
          sender_type?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_replies_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          chatbot_id: string
          created_at: string
          id: string
          message: string
          status: string
          visitor_email: string
          visitor_name: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          id?: string
          message: string
          status?: string
          visitor_email: string
          visitor_name: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          id?: string
          message?: string
          status?: string
          visitor_email?: string
          visitor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_escalations: {
        Row: {
          chatbot_id: string
          conversation_id: string | null
          created_at: string
          details: string | null
          id: string
          message_id: string | null
          reason: string
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          chatbot_id: string
          conversation_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          message_id?: string | null
          reason: string
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          chatbot_id?: string
          conversation_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          message_id?: string | null
          reason?: string
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_escalations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_escalations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_memory: {
        Row: {
          chatbot_id: string
          created_at: string
          id: string
          key_facts: Json
          last_accessed: string
          summary: string | null
          updated_at: string
          visitor_id: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          id?: string
          key_facts?: Json
          last_accessed?: string
          summary?: string | null
          updated_at?: string
          visitor_id: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          id?: string
          key_facts?: Json
          last_accessed?: string
          summary?: string | null
          updated_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_memory_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_memory_emails: {
        Row: {
          chatbot_id: string
          created_at: string
          email: string
          id: string
          verified_at: string
          visitor_id: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          email: string
          id?: string
          verified_at?: string
          visitor_id: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          email?: string
          id?: string
          verified_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_memory_emails_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
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
          handoff_active: boolean
          id: string
          language: string | null
          last_message_at: string | null
          message_count: number | null
          rating: number | null
          sentiment_analyzed_at: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          sentiment_summary: string | null
          session_id: string
          status: string | null
          summary: string | null
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
          handoff_active?: boolean
          id?: string
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          rating?: number | null
          sentiment_analyzed_at?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          sentiment_summary?: string | null
          session_id: string
          status?: string | null
          summary?: string | null
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
          handoff_active?: boolean
          id?: string
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          rating?: number | null
          sentiment_analyzed_at?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          sentiment_summary?: string | null
          session_id?: string
          status?: string | null
          summary?: string | null
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
      credit_adjustments: {
        Row: {
          admin_id: string
          amount: number
          created_at: string
          effective_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          admin_id: string
          amount: number
          created_at?: string
          effective_at?: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          admin_id?: string
          amount?: number
          created_at?: string
          effective_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_packages: {
        Row: {
          active: boolean
          chatbot_id: string | null
          created_at: string
          credit_amount: number
          description: string | null
          id: string
          is_global: boolean
          name: string
          price_cents: number
          sort_order: number
          stripe_price_id: string
        }
        Insert: {
          active?: boolean
          chatbot_id?: string | null
          created_at?: string
          credit_amount: number
          description?: string | null
          id?: string
          is_global?: boolean
          name: string
          price_cents: number
          sort_order?: number
          stripe_price_id: string
        }
        Update: {
          active?: boolean
          chatbot_id?: string | null
          created_at?: string
          credit_amount?: number
          description?: string | null
          id?: string
          is_global?: boolean
          name?: string
          price_cents?: number
          sort_order?: number
          stripe_price_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_packages_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_purchases: {
        Row: {
          amount_paid_cents: number
          chatbot_id: string
          created_at: string
          credit_amount: number
          id: string
          package_id: string
          purchase_type: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid_cents: number
          chatbot_id: string
          created_at?: string
          credit_amount: number
          id?: string
          package_id: string
          purchase_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid_cents?: number
          chatbot_id?: string
          created_at?: string
          credit_amount?: number
          id?: string
          package_id?: string
          purchase_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "credit_packages"
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
        Relationships: [
          {
            foreignKeyName: "generations_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help_articles: {
        Row: {
          body: string
          chatbot_id: string
          created_at: string
          extraction_prompt_id: string | null
          id: string
          published: boolean
          search_vector: unknown
          sort_order: number
          source_chunk_ids: string[] | null
          source_url: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          chatbot_id: string
          created_at?: string
          extraction_prompt_id?: string | null
          id?: string
          published?: boolean
          search_vector?: unknown
          sort_order?: number
          source_chunk_ids?: string[] | null
          source_url?: string | null
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          chatbot_id?: string
          created_at?: string
          extraction_prompt_id?: string | null
          id?: string
          published?: boolean
          search_vector?: unknown
          sort_order?: number
          source_chunk_ids?: string[] | null
          source_url?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_articles_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_articles_extraction_prompt_id_fkey"
            columns: ["extraction_prompt_id"]
            isOneToOne: false
            referencedRelation: "article_extraction_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_chunks: {
        Row: {
          chatbot_id: string
          chunk_index: number
          content: string
          content_hash: string | null
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
          content_hash?: string | null
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
          content_hash?: string | null
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
          embedding_model: string | null
          embedding_provider: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_priority: boolean
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
          embedding_model?: string | null
          embedding_provider?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_priority?: boolean
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
          embedding_model?: string | null
          embedding_provider?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_priority?: boolean
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
      license_key_redemptions: {
        Row: {
          id: string
          license_key_id: string
          new_plan_slug: string
          previous_plan_slug: string | null
          redeemed_at: string
          stacked_tier: number
          user_id: string
        }
        Insert: {
          id?: string
          license_key_id: string
          new_plan_slug: string
          previous_plan_slug?: string | null
          redeemed_at?: string
          stacked_tier?: number
          user_id: string
        }
        Update: {
          id?: string
          license_key_id?: string
          new_plan_slug?: string
          previous_plan_slug?: string | null
          redeemed_at?: string
          stacked_tier?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_key_redemptions_license_key_id_fkey"
            columns: ["license_key_id"]
            isOneToOne: false
            referencedRelation: "license_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_key_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      license_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key: string
          max_redemptions: number
          plan_slug: string
          redemptions_count: number
          source: string
          tier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key: string
          max_redemptions?: number
          plan_slug: string
          redemptions_count?: number
          source?: string
          tier?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key?: string
          max_redemptions?: number
          plan_slug?: string
          redemptions_count?: number
          source?: string
          tier?: number
          updated_at?: string
        }
        Relationships: []
      }
      memory_verification_codes: {
        Row: {
          chatbot_id: string
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          chatbot_id: string
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          chatbot_id?: string
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "memory_verification_codes_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          chatbot_id: string
          content: string
          context_chunks: Json | null
          conversation_id: string
          created_at: string | null
          credit_source: string | null
          feedback_reason: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          role: string
          thumbs_up: boolean | null
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          attachments?: Json | null
          chatbot_id: string
          content: string
          context_chunks?: Json | null
          conversation_id: string
          created_at?: string | null
          credit_source?: string | null
          feedback_reason?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          role: string
          thumbs_up?: boolean | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          attachments?: Json | null
          chatbot_id?: string
          content?: string
          context_chunks?: Json | null
          conversation_id?: string
          created_at?: string | null
          credit_source?: string | null
          feedback_reason?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
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
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_affiliate: boolean | null
          onboarding_milestones: Json | null
          preferred_model_id: string | null
          reengagement_email_sent: boolean
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
          onboarding_milestones?: Json | null
          preferred_model_id?: string | null
          reengagement_email_sent?: boolean
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
          onboarding_milestones?: Json | null
          preferred_model_id?: string | null
          reengagement_email_sent?: boolean
          updated_at?: string | null
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
      stripe_events: {
        Row: {
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string
        }
        Insert: {
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id: string
        }
        Update: {
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      subscription_changes: {
        Row: {
          applied_to_invoice_id: string | null
          change_type: string
          created_at: string | null
          credit_amount_cents: number
          id: string
          new_plan_id: string
          new_stripe_subscription_id: string | null
          old_plan_id: string | null
          old_stripe_subscription_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_to_invoice_id?: string | null
          change_type: string
          created_at?: string | null
          credit_amount_cents?: number
          id?: string
          new_plan_id: string
          new_stripe_subscription_id?: string | null
          old_plan_id?: string | null
          old_stripe_subscription_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_to_invoice_id?: string | null
          change_type?: string
          created_at?: string | null
          credit_amount_cents?: number
          id?: string
          new_plan_id?: string
          new_stripe_subscription_id?: string | null
          old_plan_id?: string | null
          old_stripe_subscription_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_changes_new_plan_id_fkey"
            columns: ["new_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_changes_old_plan_id_fkey"
            columns: ["old_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
          price_lifetime_cents: number | null
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
          price_lifetime_cents?: number | null
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
          price_lifetime_cents?: number | null
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
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          external_license_key: string | null
          grace_period_ends_at: string | null
          id: string
          payment_failed_at: string | null
          plan: string | null
          plan_id: string | null
          purchase_source: string | null
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
          external_license_key?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          plan?: string | null
          plan_id?: string | null
          purchase_source?: string | null
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
          external_license_key?: string | null
          grace_period_ends_at?: string | null
          id?: string
          payment_failed_at?: string | null
          plan?: string | null
          plan_id?: string | null
          purchase_source?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          trial_link_id?: string | null
          updated_at?: string | null
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
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_command_log: {
        Row: {
          arguments: string[] | null
          chatbot_id: string
          command: string
          error_message: string | null
          executed_at: string
          id: string
          success: boolean
          telegram_user_id: number
          telegram_username: string | null
        }
        Insert: {
          arguments?: string[] | null
          chatbot_id: string
          command: string
          error_message?: string | null
          executed_at?: string
          id?: string
          success?: boolean
          telegram_user_id: number
          telegram_username?: string | null
        }
        Update: {
          arguments?: string[] | null
          chatbot_id?: string
          command?: string
          error_message?: string | null
          executed_at?: string
          id?: string
          success?: boolean
          telegram_user_id?: number
          telegram_username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_command_log_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_handoff_sessions: {
        Row: {
          agent_name: string | null
          agent_source: string
          agent_telegram_id: number | null
          agent_user_id: string | null
          chatbot_id: string
          conversation_id: string
          created_at: string
          escalation_id: string | null
          id: string
          resolved_at: string | null
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_name?: string | null
          agent_source?: string
          agent_telegram_id?: number | null
          agent_user_id?: string | null
          chatbot_id: string
          conversation_id: string
          created_at?: string
          escalation_id?: string | null
          id?: string
          resolved_at?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_name?: string | null
          agent_source?: string
          agent_telegram_id?: number | null
          agent_user_id?: string | null
          chatbot_id?: string
          conversation_id?: string
          created_at?: string
          escalation_id?: string | null
          id?: string
          resolved_at?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_handoff_sessions_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_handoff_sessions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_handoff_sessions_escalation_id_fkey"
            columns: ["escalation_id"]
            isOneToOne: false
            referencedRelation: "conversation_escalations"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_message_mappings: {
        Row: {
          chatbot_id: string
          conversation_id: string
          created_at: string
          id: string
          telegram_chat_id: number
          telegram_message_id: number
        }
        Insert: {
          chatbot_id: string
          conversation_id: string
          created_at?: string
          id?: string
          telegram_chat_id: number
          telegram_message_id: number
        }
        Update: {
          chatbot_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          telegram_chat_id?: number
          telegram_message_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "telegram_message_mappings_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_message_mappings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_email: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_email: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_email?: string
          sender_name?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          admin_notes: string | null
          chatbot_id: string
          created_at: string
          custom_fields: Json | null
          id: string
          message: string
          priority: string
          reference: string
          resolved_at: string | null
          status: string
          subject: string | null
          updated_at: string
          visitor_email: string
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          admin_notes?: string | null
          chatbot_id: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          message: string
          priority?: string
          reference: string
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          visitor_email: string
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          admin_notes?: string | null
          chatbot_id?: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          message?: string
          priority?: string
          reference?: string
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          visitor_email?: string
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      visitor_loyalty: {
        Row: {
          avg_sentiment: number
          chatbot_id: string
          created_at: string
          id: string
          last_sentiment_score: number | null
          loyalty_score: number
          loyalty_trend: string
          total_sessions: number
          updated_at: string
          visitor_id: string
        }
        Insert: {
          avg_sentiment?: number
          chatbot_id: string
          created_at?: string
          id?: string
          last_sentiment_score?: number | null
          loyalty_score?: number
          loyalty_trend?: string
          total_sessions?: number
          updated_at?: string
          visitor_id: string
        }
        Update: {
          avg_sentiment?: number
          chatbot_id?: string
          created_at?: string
          id?: string
          last_sentiment_score?: number | null
          loyalty_score?: number
          loyalty_trend?: string
          total_sessions?: number
          updated_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_loyalty_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
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
      add_chatbot_purchased_credits: {
        Args: { p_amount: number; p_chatbot_id: string }
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
      check_rate_limit:
        | {
            Args: {
              p_key: string
              p_max_requests: number
              p_window_seconds: number
            }
            Returns: boolean
          }
        | {
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
      cleanup_rate_limits: { Args: never; Returns: undefined }
      clear_payment_failure: {
        Args: { p_stripe_subscription_id: string }
        Returns: undefined
      }
      count_auto_topups_this_month: {
        Args: { p_chatbot_id: string }
        Returns: number
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
      get_chat_perf_aggregates: {
        Args: {
          p_chatbot_id: string
          p_live_fetch?: boolean
          p_models?: string[]
          p_since: string
          p_to?: string
        }
        Returns: Json
      }
      get_chatbot_stats: {
        Args: { p_chatbot_ids: string[] }
        Returns: {
          chatbot_id: string
          conversation_count: number
          message_count: number
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
      get_or_create_conversation: {
        Args: {
          p_channel?: string
          p_chatbot_id: string
          p_session_id: string
          p_visitor_id?: string
        }
        Returns: {
          channel: string | null
          chatbot_id: string
          created_at: string | null
          feedback_text: string | null
          first_message_at: string | null
          handoff_active: boolean
          id: string
          language: string | null
          last_message_at: string | null
          message_count: number | null
          rating: number | null
          sentiment_analyzed_at: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          sentiment_summary: string | null
          session_id: string
          status: string | null
          summary: string | null
          updated_at: string | null
          visitor_id: string | null
          visitor_metadata: Json | null
        }
        SetofOptions: {
          from: "*"
          to: "conversations"
          isOneToOne: true
          isSetofReturn: false
        }
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
        Returns: Json
      }
      increment_conversation_messages: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      increment_usage: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: { p_user_id: string }; Returns: boolean }
      match_knowledge_chunks: {
        Args: {
          p_chatbot_id: string
          p_match_count: number
          p_match_threshold: number
          p_query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      match_priority_knowledge_chunks: {
        Args: {
          p_chatbot_id: string
          p_match_count: number
          p_match_threshold: number
          p_query_embedding: string
          p_source_ids: string[]
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      next_ticket_reference: {
        Args: { p_chatbot_id: string; p_prefix?: string }
        Returns: string
      }
      redeem_license_key: {
        Args: { p_key: string; p_user_id: string }
        Returns: {
          message: string
          plan_name: string
          plan_slug: string
          success: boolean
          tier: number
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
  public: {
    Enums: {},
  },
} as const
