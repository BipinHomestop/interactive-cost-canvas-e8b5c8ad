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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
        }
        Relationships: []
      }
      analytics_location_visits: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          ip_hash: string | null
          latitude: number | null
          longitude: number | null
          page_visited: string | null
          region: string | null
          time_range: string | null
          visit_date: string
          visit_time: string
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          latitude?: number | null
          longitude?: number | null
          page_visited?: string | null
          region?: string | null
          time_range?: string | null
          visit_date?: string
          visit_time?: string
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          latitude?: number | null
          longitude?: number | null
          page_visited?: string | null
          region?: string | null
          time_range?: string | null
          visit_date?: string
          visit_time?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      calculator_pricing_config: {
        Row: {
          config_key: string
          config_value: number
          created_at: string
          description: string | null
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: number
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: number
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      calculator_step_images: {
        Row: {
          created_at: string | null
          id: string
          image_path: string
          image_type: string
          is_last_selected: boolean | null
          step_number: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path: string
          image_type: string
          is_last_selected?: boolean | null
          step_number: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string
          image_type?: string
          is_last_selected?: boolean | null
          step_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cost_calculator_submissions: {
        Row: {
          checkout_session_id: string | null
          created_at: string
          current_condition: string | null
          discount_code: string | null
          discount_percentage: number | null
          email: string
          extra_footage: string | null
          garage_capacity: number
          garage_finish: string
          id: string
          location: string
          name: string
          need_extra_footage: string | null
          need_stem_walls: string
          need_steps: string | null
          payment_intent_id: string | null
          payment_status: string | null
          phone: string
          preferred_installation_date: string | null
          stem_wall_type: string | null
          total_price: number | null
        }
        Insert: {
          checkout_session_id?: string | null
          created_at?: string
          current_condition?: string | null
          discount_code?: string | null
          discount_percentage?: number | null
          email: string
          extra_footage?: string | null
          garage_capacity: number
          garage_finish: string
          id?: string
          location: string
          name: string
          need_extra_footage?: string | null
          need_stem_walls: string
          need_steps?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          phone: string
          preferred_installation_date?: string | null
          stem_wall_type?: string | null
          total_price?: number | null
        }
        Update: {
          checkout_session_id?: string | null
          created_at?: string
          current_condition?: string | null
          discount_code?: string | null
          discount_percentage?: number | null
          email?: string
          extra_footage?: string | null
          garage_capacity?: number
          garage_finish?: string
          id?: string
          location?: string
          name?: string
          need_extra_footage?: string | null
          need_stem_walls?: string
          need_steps?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          phone?: string
          preferred_installation_date?: string | null
          stem_wall_type?: string | null
          total_price?: number | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_percentage: number
          expires_at: string | null
          id: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_percentage: number
          expires_at?: string | null
          id?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_percentage?: number
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
      garage_finish_image_collections: {
        Row: {
          created_at: string | null
          finish_type: string
          garage_finish_image: string
          id: string
          stem_wall_large_image: string
          stem_wall_no_image: string
          stem_wall_standard_image: string
          stemwall_yes_image: string
          steps_no_image: string
          steps_yes_image: string
        }
        Insert: {
          created_at?: string | null
          finish_type: string
          garage_finish_image: string
          id?: string
          stem_wall_large_image: string
          stem_wall_no_image: string
          stem_wall_standard_image: string
          stemwall_yes_image?: string
          steps_no_image: string
          steps_yes_image: string
        }
        Update: {
          created_at?: string | null
          finish_type?: string
          garage_finish_image?: string
          id?: string
          stem_wall_large_image?: string
          stem_wall_no_image?: string
          stem_wall_standard_image?: string
          stemwall_yes_image?: string
          steps_no_image?: string
          steps_yes_image?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_area_zipcodes: {
        Row: {
          city: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          state: string | null
          zipcode: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          state?: string | null
          zipcode: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          state?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      submission_session_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          submission_id: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          submission_id: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          submission_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_submission"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "cost_calculator_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_users: { Args: never; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_valid_us_zipcode: { Args: { zipcode: string }; Returns: boolean }
      log_security_event: {
        Args: {
          details?: Json
          event_type: string
          ip_address?: string
          user_agent?: string
          user_id?: string
        }
        Returns: undefined
      }
      validate_discount_code: {
        Args: { code_to_check: string }
        Returns: {
          discount_percentage: number
          is_valid: boolean
        }[]
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
