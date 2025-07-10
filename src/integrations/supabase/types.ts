export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: string
          requirement_data: Json | null
          requirement_type: string
          requirement_value: number | null
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity?: string
          requirement_data?: Json | null
          requirement_type: string
          requirement_value?: number | null
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: string
          requirement_data?: Json | null
          requirement_type?: string
          requirement_value?: number | null
          xp_reward?: number
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          created_at: string
          date: string
          difficulty_level: number
          id: string
          target_score: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          difficulty_level: number
          id?: string
          target_score?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          difficulty_level?: number
          id?: string
          target_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      daily_completions: {
        Row: {
          attempts: number
          challenge_date: string
          completed_at: string
          created_at: string
          id: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          challenge_date: string
          completed_at?: string
          created_at?: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          challenge_date?: string
          completed_at?: string
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          created_at: string
          game_center_synced: boolean | null
          id: string
          premium_analytics: Json | null
          premium_metadata: Json | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_center_synced?: boolean | null
          id?: string
          premium_analytics?: Json | null
          premium_metadata?: Json | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_center_synced?: boolean | null
          id?: string
          premium_analytics?: Json | null
          premium_metadata?: Json | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      premium_badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          premium_only: boolean
          rarity: string
          requirement_data: Json | null
          requirement_type: string
          requirement_value: number | null
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          premium_only?: boolean
          rarity?: string
          requirement_data?: Json | null
          requirement_type: string
          requirement_value?: number | null
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          premium_only?: boolean
          rarity?: string
          requirement_data?: Json | null
          requirement_type?: string
          requirement_value?: number | null
          xp_reward?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_color: string | null
          avatar_image: string | null
          created_at: string | null
          current_streak: number
          id: string
          longest_streak: number
          total_daily_completions: number
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_color?: string | null
          avatar_image?: string | null
          created_at?: string | null
          current_streak?: number
          id: string
          longest_streak?: number
          total_daily_completions?: number
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_color?: string | null
          avatar_image?: string | null
          created_at?: string | null
          current_streak?: number
          id?: string
          longest_streak?: number
          total_daily_completions?: number
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          created_at: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_daily_challenge: {
        Args: { target_date?: string }
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
