import { createClient } from "@/lib/supabase/server"

// This is just a wrapper around createClient for backward compatibility
export function createServerSupabaseClient() {
  return createClient()
}
