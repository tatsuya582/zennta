export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          provider: string;
          sourceCreatedAt: string;
          tags: Json | null;
          title: string;
          url: string;
        };
        Insert: {
          id?: string;
          provider: string;
          sourceCreatedAt: string;
          tags?: Json | null;
          title: string;
          url: string;
        };
        Update: {
          id?: string;
          provider?: string;
          sourceCreatedAt?: string;
          tags?: Json | null;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      histories: {
        Row: {
          articleId: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          articleId: string;
          id?: string;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          articleId?: string;
          id?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "histories_articleId_fkey";
            columns: ["articleId"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "histories_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      readLaters: {
        Row: {
          articleId: string | null;
          createdAt: string;
          id: string;
          userId: string;
        };
        Insert: {
          articleId?: string | null;
          createdAt?: string;
          id?: string;
          userId: string;
        };
        Update: {
          articleId?: string | null;
          createdAt?: string;
          id?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "readLaters_articleId_fkey";
            columns: ["articleId"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "readLaters_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatarUrl: string | null;
          createdAt: string;
          id: string;
          name: string;
        };
        Insert: {
          avatarUrl?: string | null;
          createdAt?: string;
          id?: string;
          name: string;
        };
        Update: {
          avatarUrl?: string | null;
          createdAt?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      insert_history_with_article: {
        Args: {
          userid: string;
          articleprovider: string;
          articleurl: string;
          articletitle: string;
          articlesourcecreatedat?: string;
          tags?: Json;
        };
        Returns: undefined;
      };
      insert_read_later_with_article: {
        Args: {
          userid: string;
          articleprovider: string;
          articleurl: string;
          articletitle: string;
          articlesourcecreatedat?: string;
          tags?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
