"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type SupabaseContextType = {
  user: User | null
  session: Session | null
  supabase: ReturnType<typeof getClient>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  isRefreshing: boolean
  lastRefreshed: number | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

// Minimum time between refreshes (5 minutes in milliseconds)
const REFRESH_COOLDOWN = 5 * 60 * 1000

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  // Use the singleton instance
  const supabase = getClient()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null)
  const router = useRouter()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialized = useRef(false)

  const refreshSession = async () => {
    // Don't refresh if already refreshing
    if (isRefreshing) return

    // Don't refresh if we've refreshed recently
    if (lastRefreshed && Date.now() - lastRefreshed < REFRESH_COOLDOWN) {
      console.log("Skipping refresh - cooldown period active")
      return
    }

    try {
      setIsRefreshing(true)
      console.log("Refreshing session...")
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error refreshing session:", error)
        return
      }

      setSession(data.session)
      setUser(data.session?.user || null)
      setLastRefreshed(Date.now())

      // Schedule next refresh based on token expiry
      if (data.session) {
        const expiresAt = data.session.expires_at
        if (expiresAt) {
          const expiryTime = expiresAt * 1000 // Convert to milliseconds
          const timeUntilExpiry = expiryTime - Date.now()
          const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, REFRESH_COOLDOWN) // Refresh 5 minutes before expiry or after cooldown

          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
          }

          console.log(`Scheduling next refresh in ${Math.floor(refreshTime / 60000)} minutes`)
          refreshTimeoutRef.current = setTimeout(refreshSession, refreshTime)
        }
      }
    } catch (err) {
      console.error("Unexpected error during session refresh:", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return
    initialized.current = true

    // Initial session check
    const initialSessionCheck = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user || null)
        setLastRefreshed(Date.now())

        // Schedule refresh based on token expiry if session exists
        if (data.session) {
          const expiresAt = data.session.expires_at
          if (expiresAt) {
            const expiryTime = expiresAt * 1000
            const timeUntilExpiry = expiryTime - Date.now()
            const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, REFRESH_COOLDOWN)

            console.log(
              `Initial session expires in ${Math.floor(timeUntilExpiry / 60000)} minutes, scheduling refresh in ${Math.floor(refreshTime / 60000)} minutes`,
            )
            refreshTimeoutRef.current = setTimeout(refreshSession, refreshTime)
          }
        }
      } catch (error) {
        console.error("Error during initial session check:", error)
      }
    }

    initialSessionCheck()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event)

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed by Supabase client")
      }

      setSession(newSession)
      setUser(newSession?.user || null)

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setLastRefreshed(Date.now())
        router.refresh()
      }
    })

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }
    await supabase.auth.signOut()
    router.push("/")
  }

  const value = {
    user,
    session,
    supabase,
    signOut,
    refreshSession,
    isRefreshing,
    lastRefreshed,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
