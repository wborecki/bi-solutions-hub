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
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      data_table_cache: {
        Row: {
          company_service_id: string
          cached_at: string
          row_count: number
          error: string | null
          refreshing: boolean
        }
        Insert: {
          company_service_id: string
          cached_at?: string
          row_count?: number
          error?: string | null
          refreshing?: boolean
        }
        Update: {
          company_service_id?: string
          cached_at?: string
          row_count?: number
          error?: string | null
          refreshing?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "data_table_cache_company_service_id_fkey"
            columns: ["company_service_id"]
            isOneToOne: true
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      data_table_rows: {
        Row: {
          id: string
          company_service_id: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          company_service_id: string
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          company_service_id?: string
          data?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_table_rows_company_service_id_fkey"
            columns: ["company_service_id"]
            isOneToOne: false
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      company_services: {
        Row: {
          company_id: string
          config: Json
          created_at: string
          embed_url: string
          id: string
          is_active: boolean
          name: string
          service_id: string
        }
        Insert: {
          company_id: string
          config?: Json
          created_at?: string
          embed_url?: string
          id?: string
          is_active?: boolean
          name?: string
          service_id: string
        }
        Update: {
          company_id?: string
          config?: Json
          created_at?: string
          embed_url?: string
          id?: string
          is_active?: boolean
          name?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          folder_path: string
          id: string
          mime_type: string
          uploaded_by: string
        }
        Insert: {
          company_id: string
          created_at?: string
          file_name: string
          file_size?: number
          file_url: string
          folder_path?: string
          id?: string
          mime_type?: string
          uploaded_by: string
        }
        Update: {
          company_id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          folder_path?: string
          id?: string
          mime_type?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          custom_data: string | null
          email: string
          full_name: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          custom_data?: string | null
          email: string
          full_name: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          custom_data?: string | null
          email?: string
          full_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_profile_filters: {
        Row: {
          created_at: string
          field_name: string
          field_value: string
          id: string
          rls_profile_id: string
        }
        Insert: {
          created_at?: string
          field_name: string
          field_value: string
          id?: string
          rls_profile_id: string
        }
        Update: {
          created_at?: string
          field_name?: string
          field_value?: string
          id?: string
          rls_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rls_profile_filters_rls_profile_id_fkey"
            columns: ["rls_profile_id"]
            isOneToOne: false
            referencedRelation: "rls_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_profiles: {
        Row: {
          company_id: string
          company_service_id: string | null
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          company_id: string
          company_service_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          company_service_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "rls_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rls_profiles_company_service_id_fkey"
            columns: ["company_service_id"]
            isOneToOne: false
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name: string
          slug: string
          type?: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_rules: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string
          pbi_role: string | null
          pbi_custom_data: string | null
          pbi_username: string | null
          looker_filters: Json | null
          report_type: string | null
          company_service_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string
          pbi_role?: string | null
          pbi_custom_data?: string | null
          pbi_username?: string | null
          looker_filters?: Json | null
          report_type?: string | null
          company_service_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string
          pbi_role?: string | null
          pbi_custom_data?: string | null
          pbi_username?: string | null
          looker_filters?: Json | null
          report_type?: string | null
          company_service_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rls_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rls_rules: {
        Row: {
          id: string
          user_id: string
          rls_rule_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rls_rule_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rls_rule_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rls_rules_rls_rule_id_fkey"
            columns: ["rls_rule_id"]
            isOneToOne: false
            referencedRelation: "rls_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      get_user_rls_for_company: {
        Args: { _user_id: string; _company_id: string }
        Returns: { pbi_role: string | null; pbi_custom_data: string | null; pbi_username: string | null; looker_filters: Json | null; report_type: string | null }[]
      }
      get_user_rls_for_service: {
        Args: { _user_id: string; _company_service_id: string }
        Returns: { pbi_role: string | null; pbi_custom_data: string | null; pbi_username: string | null; looker_filters: Json | null; report_type: string | null }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_admin: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "client_admin"
      service_type: "bi_embed" | "looker_embed" | "document" | "custom" | "data_table"
      ticket_priority: "baixa" | "media" | "alta" | "urgente"
      ticket_status: "aberto" | "em_andamento" | "resolvido" | "fechado"
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
    Enums: {
      app_role: ["admin", "client", "company_admin"],
      service_type: ["bi_embed", "looker_embed", "document", "custom"],
      ticket_priority: ["baixa", "media", "alta", "urgente"],
      ticket_status: ["aberto", "em_andamento", "resolvido", "fechado"],
    },
  },
} as const
