import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CommunityPrediction = {
  id: number;
  category_id: string;
  prediction: string;
  created_at: string;
  use_count: number;
};

export type CommunityExcuse = {
  id: number;
  excuse: string;
  created_at: string;
  use_count: number;
};

export type CommunitySuperpower = {
  id: number;
  superpower: string;
  created_at: string;
  use_count: number;
};
