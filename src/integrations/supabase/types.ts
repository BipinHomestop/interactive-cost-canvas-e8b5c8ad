export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_us_zipcode: {
        Args: {
          zipcode: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
