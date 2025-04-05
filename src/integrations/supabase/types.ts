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
      assignments: {
        Row: {
          client_address: string
          client_name: string
          client_phone: string
          collector_id: string | null
          date_assigned: string
          device_model: string
          device_type: string
          id: string
          is_delivery: boolean
          notes: string | null
          repair_id: string
          status: Database["public"]["Enums"]["assignment_status"]
          time_window: string | null
        }
        Insert: {
          client_address: string
          client_name: string
          client_phone: string
          collector_id?: string | null
          date_assigned?: string
          device_model: string
          device_type: string
          id?: string
          is_delivery?: boolean
          notes?: string | null
          repair_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
          time_window?: string | null
        }
        Update: {
          client_address?: string
          client_name?: string
          client_phone?: string
          collector_id?: string | null
          date_assigned?: string
          device_model?: string
          device_type?: string
          id?: string
          is_delivery?: boolean
          notes?: string | null
          repair_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          time_window?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      repairs: {
        Row: {
          assigned_collector: string | null
          assigned_fixer: string | null
          client_id: string | null
          client_name: string
          client_phone: string
          date_created: string
          device_model: string
          device_type: string
          id: string
          issue: string
          last_updated: string
          notes: string | null
          price: number | null
          status: Database["public"]["Enums"]["repair_status"]
        }
        Insert: {
          assigned_collector?: string | null
          assigned_fixer?: string | null
          client_id?: string | null
          client_name: string
          client_phone: string
          date_created?: string
          device_model: string
          device_type: string
          id?: string
          issue: string
          last_updated?: string
          notes?: string | null
          price?: number | null
          status?: Database["public"]["Enums"]["repair_status"]
        }
        Update: {
          assigned_collector?: string | null
          assigned_fixer?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string
          date_created?: string
          device_model?: string
          device_type?: string
          id?: string
          issue?: string
          last_updated?: string
          notes?: string | null
          price?: number | null
          status?: Database["public"]["Enums"]["repair_status"]
        }
        Relationships: [
          {
            foreignKeyName: "repairs_assigned_collector_fkey"
            columns: ["assigned_collector"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_assigned_fixer_fkey"
            columns: ["assigned_fixer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_client_id_fkey"
            columns: ["client_id"]
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
      [_ in never]: never
    }
    Enums: {
      assignment_status: "pending" | "in_progress" | "completed" | "cancelled"
      repair_status:
        | "pending_confirmation"
        | "awaiting_collection"
        | "in_repair"
        | "waiting_price_confirmation"
        | "repair_in_progress"
        | "fixed_awaiting_delivery"
        | "repair_rejected"
        | "completed"
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
