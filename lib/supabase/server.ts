import { createServerClient as createServerClientBase } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/database"

export function createServerClient() {
  // During prerendering, cookies() might not be available
  // We need to handle this case to prevent build errors
  let cookieStore
  try {
    cookieStore = cookies()
  } catch (error) {
    // Return a client with no cookies during prerendering
    return createServerClientBase<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    })
  }

  return createServerClientBase<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name) => {
        return cookieStore.get(name)?.value
      },
      set: (name, value, options) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name, options) => {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Export createClient as a named export to fix the missing export error
export const createClient = createServerClient
