export const SUPABASE_URL = "https://mqycdharpnpuzaotkfth.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_SUwEX2d-ynz5phF6-3x2Vg_tQvI6Kc3";
export const isSupabaseConfigured = () =>
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_YOUR") &&
  !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR");
