/**
 * Supabase Database Types
 * Auto-generated types should replace this file via:
 * npx supabase gen types typescript --local > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: 'free' | 'active' | 'canceled' | 'past_due';
          plan: 'free' | 'pro' | 'enterprise';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: 'free' | 'active' | 'canceled' | 'past_due';
          plan?: 'free' | 'pro' | 'enterprise';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: 'free' | 'active' | 'canceled' | 'past_due';
          plan?: 'free' | 'pro' | 'enterprise';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      usage: {
        Row: {
          id: string;
          user_id: string;
          credits_used: number;
          credits_limit: number;
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits_used?: number;
          credits_limit?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          credits_used?: number;
          credits_limit?: number;
          period_start?: string;
          period_end?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usage_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      generations: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          type: string;
          prompt: string;
          output: string | null;
          model: string;
          tokens_input: number;
          tokens_output: number;
          duration_ms: number | null;
          status: 'pending' | 'completed' | 'failed';
          error_message: string | null;
          rating: number | null;
          is_favorite: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          type: string;
          prompt: string;
          output?: string | null;
          model?: string;
          tokens_input?: number;
          tokens_output?: number;
          duration_ms?: number | null;
          status?: 'pending' | 'completed' | 'failed';
          error_message?: string | null;
          rating?: number | null;
          is_favorite?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          output?: string | null;
          status?: 'pending' | 'completed' | 'failed';
          error_message?: string | null;
          rating?: number | null;
          is_favorite?: boolean;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'generations_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          scopes: string[];
          last_used_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          scopes?: string[];
          last_used_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          scopes?: string[];
          last_used_at?: string | null;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'api_keys_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      tools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          category: string;
          is_active: boolean;
          is_featured: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          category: string;
          is_active?: boolean;
          is_featured?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string;
          category?: string;
          is_active?: boolean;
          is_featured?: boolean;
          config?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };

      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'audit_log_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      webhooks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          secret: string;
          events: string[];
          is_active: boolean;
          last_triggered_at: string | null;
          failure_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          secret: string;
          events?: string[];
          is_active?: boolean;
          last_triggered_at?: string | null;
          failure_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          url?: string;
          secret?: string;
          events?: string[];
          is_active?: boolean;
          last_triggered_at?: string | null;
          failure_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'webhooks_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };

    Views: {};

    Functions: {
      increment_usage: {
        Args: {
          p_user_id: string;
          p_amount: number;
        };
        Returns: undefined;
      };
    };

    Enums: {};

    CompositeTypes: {};
  };
}

// ===================
// CONVENIENCE TYPES
// ===================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Shorthand types
export type Profile = Tables<'profiles'>;
export type Subscription = Tables<'subscriptions'>;
export type Usage = Tables<'usage'>;
export type Generation = Tables<'generations'>;
export type APIKey = Tables<'api_keys'>;
export type Tool = Tables<'tools'>;
export type AuditLog = Tables<'audit_log'>;
export type Webhook = Tables<'webhooks'>;
