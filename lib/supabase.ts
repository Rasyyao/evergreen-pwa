import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DetectionRow = {
  id: string;
  created_at: string;
  image_data_url: string;
  summary: string;
  detection_count: number;
  top_species: string | null;
  top_confidence: number | null;
  top_severity: string | null;
  detections: unknown;
};
