"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Heart, HelpCircle, Gift, Calendar } from "lucide-react"

export function DashboardWelcome() {
  const { user } = useSupabase()
  const [greeting, setGreeting] = useState("Good day")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Get user's name from metadata
    if (user?.user_metadata?.name) {
      setUserName(user.user_metadata.name.split(" ")[0])
    } else if (user?.email) {
      setUserName(user.email.split("@")[0])
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName || "Welcome back"}!
        </h1>
        <p className="text-muted-foreground">Here's an overview of your activity and impact on HelpConnect.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="Create Campaign"
          description="Start a new fundraising campaign"
          icon={<Heart className="h-5 w-5" />}
          href="/create-campaign"
          color="bg-blue-50 dark:bg-blue-950"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <QuickActionCard
          title="Submit Help Request"
          description="Ask the community for assistance"
          icon={<HelpCircle className="h-5 w-5" />}
          href="/help-requests/new"
          color="bg-purple-50 dark:bg-purple-950"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <QuickActionCard
          title="Donate Items"
          description="List items you want to donate"
          icon={<Gift className="h-5 w-5" />}
          href="/donation-items/new"
          color="bg-green-50 dark:bg-green-950"
          iconColor="text-green-600 dark:text-green-400"
        />
        <QuickActionCard
          title="Plan Community Drive"
          description="Organize a community event"
          icon={<Calendar className="h-5 w-5" />}
          href="/community-drives/new"
          color="bg-amber-50 dark:bg-amber-950"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  iconColor: string
}

function QuickActionCard({ title, description, icon, href, color, iconColor }: QuickActionCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <Link href={href} className="block">
          <div className="flex items-start p-6">
            <div className={`rounded-full p-2 mr-4 ${color}`}>
              <div className={iconColor}>{icon}</div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-50" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
