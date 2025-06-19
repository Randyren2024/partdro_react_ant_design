import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          specifications: Record<string, any>;
          name_i18n?: Record<string, string>;
          description_i18n?: Record<string, string>;
          specifications_i18n?: Record<string, Record<string, any>>;
          features_i18n?: Record<string, string[]>;
          tags_i18n?: Record<string, string[]>;
          images: string[];
          video_url?: string;
          category: string;
          subcategory?: string;
          tags: string[];
          features: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          specifications: Record<string, any>;
          name_i18n?: Record<string, string>;
          description_i18n?: Record<string, string>;
          specifications_i18n?: Record<string, Record<string, any>>;
          features_i18n?: Record<string, string[]>;
          tags_i18n?: Record<string, string[]>;
          images: string[];
          video_url?: string;
          category: string;
          subcategory?: string;
          tags: string[];
          features: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          specifications?: Record<string, any>;
          name_i18n?: Record<string, string>;
          description_i18n?: Record<string, string>;
          specifications_i18n?: Record<string, Record<string, any>>;
          features_i18n?: Record<string, string[]>;
          tags_i18n?: Record<string, string[]>;
          images?: string[];
          video_url?: string;
          category?: string;
          subcategory?: string;
          tags?: string[];
          features?: string[];
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          parent_id: string | null;
          description: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          parent_id?: string | null;
          description: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          parent_id?: string | null;
          description?: string;
          image_url?: string;
        };
      };
    };
  };
};