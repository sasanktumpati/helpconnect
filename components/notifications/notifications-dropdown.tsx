"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSupabase } from "@/lib/supabase/provider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Notification } from "@/lib/types"

export function NotificationsDropdown() {
  const { supabase, user } = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      setNotifications(data as Notification[])
      setUnreadCount(data.filter((n) => !n.is_read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Don't set error state to avoid UI disruption
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    // Only fetch notifications when the dropdown is opened
    if (isOpen) {
      fetchNotifications()
    }
  }, [fetchNotifications, isOpen])

  useEffect(() => {
    if (!user) return

    // Subscribe to new notifications
    try {
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev])
            setUnreadCount((prev) => prev + 1)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error("Error setting up notification subscription:", error)
    }
  }, [supabase, user])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (notifications.length === 0 || unreadCount === 0) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .eq("is_read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (!notification.data) return "/dashboard/notifications"

    switch (notification.type) {
      case "donation":
        return notification.data.campaign_id ? `/campaigns/${notification.data.campaign_id}` : "/dashboard/donations"
      case "campaign":
        return notification.data.campaign_id ? `/campaigns/${notification.data.campaign_id}` : "/dashboard/campaigns"
      case "help_request":
        return notification.data.help_request_id
          ? `/help-requests/${notification.data.help_request_id}`
          : "/dashboard/help-requests"
      case "community_drive":
        return notification.data.community_drive_id
          ? `/community-drives/${notification.data.community_drive_id}`
          : "/dashboard/community-drives"
      default:
        return "/dashboard/notifications"
    }
  }

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMins / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-0 focus:bg-transparent ${!notification.is_read ? "bg-muted/50" : ""}`}
                  onSelect={(e) => e.preventDefault()}
                >
                  <Link
                    href={getNotificationLink(notification)}
                    className="flex flex-col w-full p-3 hover:bg-accent rounded-sm"
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatNotificationTime(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notifications" className="justify-center font-medium">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
