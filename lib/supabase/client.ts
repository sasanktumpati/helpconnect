import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../types"

// Global singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null

export function createClient() {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Otherwise, create a new instance and store it
  supabaseInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseInstance
}

// For direct access to the singleton instance
export function getClient() {
  if (!supabaseInstance) {
    return createClient()
  }
  return supabaseInstance
}
