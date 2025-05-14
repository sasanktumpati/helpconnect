"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase/provider"
import { Bell, CheckCircle, Loader2 } from "lucide-react"
import type { Notification } from "@/lib/types"

export default function NotificationsPage() {
  const { supabase, user } = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications(data as Notification[])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [supabase, user])

  const markAllAsRead = async () => {
    if (!user || notifications.filter((n) => !n.is_read).length === 0) return

    try {
      setMarkingAllAsRead(true)
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setMarkingAllAsRead(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "donation":
        return notification.data?.campaign_id ? `/campaigns/${notification.data.campaign_id}` : "/dashboard/donations"
      case "campaign":
        return notification.data?.campaign_id ? `/campaigns/${notification.data.campaign_id}` : "/dashboard/campaigns"
      case "help_request":
        return notification.data?.help_request_id
          ? `/help-requests/${notification.data.help_request_id}`
          : "/dashboard/help-requests"
      case "community_drive":
        return notification.data?.community_drive_id
          ? `/community-drives/${notification.data.community_drive_id}`
          : "/dashboard/community-drives"
      default:
        return "#"
    }
  }

  const formatNotificationTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const unreadNotifications = notifications.filter((n) => !n.is_read)
  const readNotifications = notifications.filter((n) => n.is_read)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest activities and alerts.</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllAsRead} disabled={markingAllAsRead}>
            {markingAllAsRead ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marking as read...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark all as read
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread">
            Unread{" "}
            {unreadNotifications.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {unreadNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="unread">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No unread notifications</h3>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <Card key={notification.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <Link
                      href={getNotificationLink(notification)}
                      className="block"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="all">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications yet</h3>
                <p className="text-sm text-muted-foreground">When you receive notifications, they will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={notification.is_read ? "" : "bg-muted/50"}>
                  <CardContent className="p-4">
                    <Link
                      href={getNotificationLink(notification)}
                      className="block"
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
