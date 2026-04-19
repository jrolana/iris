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
    PostgrestVersion: "13.0.5"
  }
  private: {
    Tables: {
      api_tokens: {
        Row: {
          created_at: string
          id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          token?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action_result: Database["private"]["Enums"]["actionresult"]
          action_taken: string
          action_type: Database["private"]["Enums"]["actiontype"]
          changed_fields: Json | null
          event_at: string | null
          id: string
          record_type: Database["private"]["Enums"]["recordtype"]
          snapshot_record_reference: string
          snapshot_user_name: string
          snapshot_user_role: string
        }
        Insert: {
          action_result: Database["private"]["Enums"]["actionresult"]
          action_taken: string
          action_type: Database["private"]["Enums"]["actiontype"]
          changed_fields?: Json | null
          event_at?: string | null
          id?: string
          record_type: Database["private"]["Enums"]["recordtype"]
          snapshot_record_reference: string
          snapshot_user_name: string
          snapshot_user_role: string
        }
        Update: {
          action_result?: Database["private"]["Enums"]["actionresult"]
          action_taken?: string
          action_type?: Database["private"]["Enums"]["actiontype"]
          changed_fields?: Json | null
          event_at?: string | null
          id?: string
          record_type?: Database["private"]["Enums"]["recordtype"]
          snapshot_record_reference?: string
          snapshot_user_name?: string
          snapshot_user_role?: string
        }
        Relationships: []
      }
      college_units: {
        Row: {
          code: string
          full_name: string
        }
        Insert: {
          code: string
          full_name: string
        }
        Update: {
          code?: string
          full_name?: string
        }
        Relationships: []
      }
      inventors: {
        Row: {
          application_id: string
          college_code: string | null
          comments: string | null
          email: string
          external_institution: string | null
          full_name: string
          id: string
          other_college_name: string | null
          status: Database["private"]["Enums"]["inventorstatustype"]
          techgen_id: string | null
        }
        Insert: {
          application_id: string
          college_code?: string | null
          comments?: string | null
          email: string
          external_institution?: string | null
          full_name: string
          id?: string
          other_college_name?: string | null
          status?: Database["private"]["Enums"]["inventorstatustype"]
          techgen_id?: string | null
        }
        Update: {
          application_id?: string
          college_code?: string | null
          comments?: string | null
          email?: string
          external_institution?: string | null
          full_name?: string
          id?: string
          other_college_name?: string | null
          status?: Database["private"]["Enums"]["inventorstatustype"]
          techgen_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventor_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_inventor_collegecode"
            columns: ["college_code"]
            isOneToOne: false
            referencedRelation: "college_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fk_inventor_techgen"
            columns: ["techgen_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ipr_applications: {
        Row: {
          created_at: string | null
          created_by: string | null
          curr_status: string | null
          filing_date: string | null
          funding_source: string
          id: string
          ip_number: string | null
          ip_title: string | null
          ip_type: Database["private"]["Enums"]["iprtype"]
          is_archived: boolean | null
          is_withdrawn: boolean | null
          parent_application_id: string | null
          project_title: string
          registration_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          curr_status?: string | null
          filing_date?: string | null
          funding_source: string
          id?: string
          ip_number?: string | null
          ip_title?: string | null
          ip_type: Database["private"]["Enums"]["iprtype"]
          is_archived?: boolean | null
          is_withdrawn?: boolean | null
          parent_application_id?: string | null
          project_title: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          curr_status?: string | null
          filing_date?: string | null
          funding_source?: string
          id?: string
          ip_number?: string | null
          ip_title?: string | null
          ip_type?: Database["private"]["Enums"]["iprtype"]
          is_archived?: boolean | null
          is_withdrawn?: boolean | null
          parent_application_id?: string | null
          project_title?: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ipr_applications_curr_status_fkey"
            columns: ["curr_status"]
            isOneToOne: false
            referencedRelation: "ipr_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipr_applications_parent_application_id_fkey"
            columns: ["parent_application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      ipr_files: {
        Row: {
          application_id: string
          comments: string | null
          file_description: string | null
          file_name: string
          file_type: string
          id: string
          modified_at: string | null
          owner_id: string
          owner_name: string | null
          storage_id: string | null
          storage_path: string
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          comments?: string | null
          file_description?: string | null
          file_name: string
          file_type: string
          id?: string
          modified_at?: string | null
          owner_id: string
          owner_name?: string | null
          storage_id?: string | null
          storage_path: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          comments?: string | null
          file_description?: string | null
          file_name?: string
          file_type?: string
          id?: string
          modified_at?: string | null
          owner_id?: string
          owner_name?: string | null
          storage_id?: string | null
          storage_path?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ipr_files_app_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ipr_files_owner_id"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ipr_statuses: {
        Row: {
          application_id: string
          created_at: string | null
          deadline: string | null
          id: string
          is_public: boolean | null
          note: string | null
          status_name: string | null
          status_type: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          status_name?: string | null
          status_type: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          status_name?: string | null
          status_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_statuses_application_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          application_id: string | null
          category: string | null
          content: string
          created_at: string | null
          has_email_sent: boolean
          id: string
          read_at: string | null
          receiver_id: string
          title: string
        }
        Insert: {
          application_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          has_email_sent?: boolean
          id?: string
          read_at?: string | null
          receiver_id: string
          title: string
        }
        Update: {
          application_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          has_email_sent?: boolean
          id?: string
          read_at?: string | null
          receiver_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifs_app_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notifs_user_id"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pings: {
        Row: {
          acknowledged_at: string | null
          application_id: string
          application_name: string
          created_at: string
          id: string
          stage_delayed: string
          step_delayed: string
          target_date: string
        }
        Insert: {
          acknowledged_at?: string | null
          application_id: string
          application_name: string
          created_at?: string
          id?: string
          stage_delayed: string
          step_delayed: string
          target_date: string
        }
        Update: {
          acknowledged_at?: string | null
          application_id?: string
          application_name?: string
          created_at?: string
          id?: string
          stage_delayed?: string
          step_delayed?: string
          target_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pings_app_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          application_id: string
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean
          reporter_id: string | null
          reporter_name: string
          subject_id: string
          subject_name: string
        }
        Insert: {
          application_id: string
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean
          reporter_id?: string | null
          reporter_name: string
          subject_id: string
          subject_name: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean
          reporter_id?: string | null
          reporter_name?: string
          subject_id?: string
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_report_app"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ipr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reporter"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "inventors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "inventors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_registration_requests: {
        Row: {
          college_code: string | null
          email: string
          external_institution: string | null
          full_name: string
          id: string
          invite_expires_at: string | null
          other_college_name: string | null
          rejection_reason: string | null
          requested_at: string
          role: Database["private"]["Enums"]["user_role"]
          status: Database["private"]["Enums"]["registrationrequestsstatus"]
        }
        Insert: {
          college_code?: string | null
          email: string
          external_institution?: string | null
          full_name: string
          id?: string
          invite_expires_at?: string | null
          other_college_name?: string | null
          rejection_reason?: string | null
          requested_at?: string
          role: Database["private"]["Enums"]["user_role"]
          status?: Database["private"]["Enums"]["registrationrequestsstatus"]
        }
        Update: {
          college_code?: string | null
          email?: string
          external_institution?: string | null
          full_name?: string
          id?: string
          invite_expires_at?: string | null
          other_college_name?: string | null
          rejection_reason?: string | null
          requested_at?: string
          role?: Database["private"]["Enums"]["user_role"]
          status?: Database["private"]["Enums"]["registrationrequestsstatus"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_registration_college"
            columns: ["college_code"]
            isOneToOne: false
            referencedRelation: "college_units"
            referencedColumns: ["code"]
          },
        ]
      }
      users: {
        Row: {
          college_code: string | null
          created_at: string | null
          email: string
          external_institution: string | null
          full_name: string
          id: string
          is_active: boolean
          other_college_name: string | null
          role: Database["private"]["Enums"]["user_role"]
        }
        Insert: {
          college_code?: string | null
          created_at?: string | null
          email: string
          external_institution?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          other_college_name?: string | null
          role?: Database["private"]["Enums"]["user_role"]
        }
        Update: {
          college_code?: string | null
          created_at?: string | null
          email?: string
          external_institution?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          other_college_name?: string | null
          role?: Database["private"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_collegecode"
            columns: ["college_code"]
            isOneToOne: false
            referencedRelation: "college_units"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_app_files: { Args: { app_id_text: string }; Returns: boolean }
      check_inventor_access: {
        Args: { target_app_id: string }
        Returns: boolean
      }
      format_date: { Args: { d: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_official: { Args: never; Returns: boolean }
      is_published_status: { Args: { p_status_id: string }; Returns: boolean }
      process_daily_deadline_reminders: { Args: never; Returns: undefined }
    }
    Enums: {
      actionresult: "success" | "pending" | "failure"
      actiontype:
        | "create"
        | "update"
        | "delete"
        | "upload"
        | "status_change"
        | "role_change"
      inventorstatustype: "pending" | "member" | "non-member"
      iprtype:
        | "patent"
        | "utility_model"
        | "industrial_design"
        | "trademark"
        | "copyright"
      recordtype: "application" | "document" | "account" | "inventor" | "report"
      registrationrequestsstatus: "pending" | "approved" | "rejected"
      user_role: "admin" | "up-official" | "techgen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      v_dashboard_analytics: {
        Row: {
          dashboard_status: string | null
          ip_type: Database["private"]["Enums"]["iprtype"] | null
          total: number | null
          year: number | null
        }
        Relationships: []
      }
      v_dashboard_analytics_techgen: {
        Row: {
          dashboard_status: string | null
          ip_type: Database["private"]["Enums"]["iprtype"] | null
          techgen_id: string | null
          total: number | null
          year: number | null
        }
        Relationships: []
      }
      v_dashboard_status: {
        Row: {
          dashboard_status: string | null
          id: string | null
          ip_type: Database["private"]["Enums"]["iprtype"] | null
          time_concerned: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_app_exists: { Args: { app_id_text: string }; Returns: boolean }
      create_application_with_inventors: {
        Args: {
          p_funding_source: string
          p_inventors: Json
          p_ip_type: Database["private"]["Enums"]["iprtype"]
          p_project_title: string
        }
        Returns: string
      }
      format_date: { Args: { d: string }; Returns: string }
      get_user_role: { Args: never; Returns: string }
      search_applications: {
        Args: {
          p_colleges?: string[]
          p_ip_types?: string[]
          p_statuses?: string[]
          p_techgens?: string[]
          p_title?: string
        }
        Returns: {
          created_at: string
          filing_date: string
          funding_agency: string
          id: string
          inventors: Json
          ip_number: string
          ip_title: string
          ip_type: string
          is_archived: boolean
          is_withdrawn: boolean
          project_title: string
          registration_date: string
          status_type: string
          updated_at: string
        }[]
      }
      search_users_for_linking: {
        Args: { excluded_ids?: string[]; search_query: string }
        Returns: {
          college_code: string
          email: string
          external_institution: string
          full_name: string
          id: string
          other_college_name: string
        }[]
      }
      submit_registration_request: {
        Args: {
          p_college_code?: string
          p_email: string
          p_external_institution?: string
          p_full_name: string
          p_other_college_name?: string
          p_role: string
        }
        Returns: undefined
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
  private: {
    Enums: {
      actionresult: ["success", "pending", "failure"],
      actiontype: [
        "create",
        "update",
        "delete",
        "upload",
        "status_change",
        "role_change",
      ],
      inventorstatustype: ["pending", "member", "non-member"],
      iprtype: [
        "patent",
        "utility_model",
        "industrial_design",
        "trademark",
        "copyright",
      ],
      recordtype: ["application", "document", "account", "inventor", "report"],
      registrationrequestsstatus: ["pending", "approved", "rejected"],
      user_role: ["admin", "up-official", "techgen"],
    },
  },
  public: {
    Enums: {},
  },
} as const
