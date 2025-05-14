import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

interface UpdateSessionOptions {
  forceRefresh?: boolean
}

export async function updateSession(request: NextRequest, options: UpdateSessionOptions = {}) {
  const { forceRefresh = true } = options

  // Start with the incoming request on the response context
  let supabaseResponse = NextResponse.next({ request })

  // Create a Supabase client wired to both request & response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write to the request cookies (so Server Components see the fresh tokens)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Then mirror them onto the response for the browser
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Only validate the session if forceRefresh is true
  if (forceRefresh) {
    try {
      // Check if we have a session refresh cookie to avoid unnecessary refreshes
      const lastRefreshed = request.cookies.get("sb-last-refreshed")
      const now = Date.now()

      // Only refresh if we haven't refreshed in the last 5 minutes
      if (!lastRefreshed || now - Number.parseInt(lastRefreshed.value) > 5 * 60 * 1000) {
        // Re-validate the token
        await supabase.auth.getUser()

        // Set a cookie to track when we last refreshed
        supabaseResponse.cookies.set("sb-last-refreshed", now.toString(), {
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      }
    } catch (error) {
      console.error("Error refreshing session in middleware:", error)
    }
  }

  return supabaseResponse
}
