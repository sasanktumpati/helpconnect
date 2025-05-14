"use server"

import { createServerSupabaseClient } from "./server-client"
import type { UserRole } from "../types"
import { createUserProfile } from "./database"

export async function signUp(email: string, password: string, role: UserRole, displayName: string) {
  const supabase = createServerSupabaseClient()

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        display_name: displayName,
      },
    },
  })

  if (authError) throw authError

  // Create the user profile in the database
  if (authData.user) {
    try {
      await createUserProfile({
        id: authData.user.id,
        email,
        role,
        display_name: displayName,
        is_verified: false,
        profile_completed: false, // Mark as incomplete by default
      })
    } catch (error) {
      console.error("Error creating user profile:", error)
      // If profile creation fails, we should ideally delete the auth user
      // but Supabase doesn't expose this API directly to clients
      throw error
    }
  }

  return authData
}

export async function signIn(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Check if user exists in the database
  const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("id", data.user.id)

  // If user doesn't exist in the database, create a profile
  if (count === 0) {
    try {
      await createUserProfile({
        id: data.user.id,
        email: data.user.email || "",
        role: (data.user.user_metadata?.role as UserRole) || "individual",
        display_name: data.user.user_metadata?.display_name || "User",
        is_verified: false,
        profile_completed: false,
      })
    } catch (error) {
      console.error("Error creating user profile on sign in:", error)
    }
  }

  return data
}

export async function signOut() {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw error
  return true
}

export async function getSession() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) throw error
  return data.session
}

export async function getUser() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.getUser()

  if (error) throw error
  return data.user
}
