import type { SupabaseClient } from "@supabase/supabase-js"
import type { Notification } from "@/lib/types"

interface CreateNotificationParams {
  supabase: SupabaseClient
  userId: string
  type: "donation" | "campaign" | "help_request" | "community_drive" | "system"
  title: string
  message: string
  data?: Record<string, any>
  link?: string
}

export async function createNotification({
  supabase,
  userId,
  type,
  title,
  message,
  data = {},
  link,
}: CreateNotificationParams): Promise<Notification> {
  const notification = {
    user_id: userId,
    type,
    title,
    message,
    data,
    link,
    is_read: false,
    created_at: new Date().toISOString(),
  }

  const { data: createdNotification, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single()

  if (error) {
    console.error("Error creating notification:", error)
    throw error
  }

  return createdNotification as Notification
}

export async function markNotificationAsRead(supabase: SupabaseClient, notificationId: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function deleteNotification(supabase: SupabaseClient, notificationId: string): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

  if (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}
