import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types"

export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as User
}

export async function updateUserProfile(userId: string, profileData: Partial<User>): Promise<User | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("users")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    return null
  }

  return data as User
}

export async function completeUserProfile(userId: string, profileData: Partial<User>): Promise<User | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("users")
    .update({
      ...profileData,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error completing user profile:", error)
    return null
  }

  return data as User
}
