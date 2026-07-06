import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          visitor_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visitor_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visitor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          session_id: string;
          type: string;
          timestamp: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          session_id: string;
          type: string;
          timestamp?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          session_id?: string;
          type?: string;
          timestamp?: string;
          metadata?: any;
        };
      };
      classifications: {
        Row: {
          id: string;
          session_id: string;
          state: string;
          confidence: number;
          evidence: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          state: string;
          confidence: number;
          evidence: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          state?: string;
          confidence?: number;
          evidence?: any;
          created_at?: string;
        };
      };
    };
  };
};