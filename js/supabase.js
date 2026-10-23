import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, isSupabaseConfigured } from "./config.js";
export { isSupabaseConfigured };
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;
export function showSetupMessage(element, extra = "") {
  if (element) element.textContent = "Cloud setup is not complete yet. Add your Supabase project URL and publishable key in js/config.js, then refresh. " + extra;
}
