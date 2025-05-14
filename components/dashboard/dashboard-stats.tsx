"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import { Card, CardContent } from "@/components/ui/card"
import { CircleDollarSign, Heart, HelpCircle, Package } from "lucide-react"

export function DashboardStats() {
  const { supabase, user } = useSupabase()
  const [stats, setStats] = useState({
    campaignsCount: 0,
    helpRequestsCount: 0,
    donationItemsCount: 0,
    donationsAmount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      setLoading(true)

      try {
        // Fetch campaigns count
        const { count: campaignsCount } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", user.id)

        // Fetch help requests count (if table exists)
        let helpRequestsCount = 0
        try {
          const { count } = await supabase
            .from("help_requests")
            .select("*", { count: "exact", head: true })
            .eq("requester_id", user.id)
          helpRequestsCount = count || 0
        } catch (error) {
          // Table might not exist yet
          console.log("Help requests table might not exist yet")
        }

        // Fetch donation items count (if table exists)
        let donationItemsCount = 0
        try {
          const { count } = await supabase
            .from("donation_items")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user.id)
          donationItemsCount = count || 0
        } catch (error) {
          // Table might not exist yet
          console.log("Donation items table might not exist yet")
        }

        // Fetch total donations amount
        const { data: donations } = await supabase
          .from("donations")
          .select("amount")
          .eq("donor_id", user.id)
          .eq("payment_status", "completed")

        const donationsAmount = donations?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0

        setStats({
          campaignsCount: campaignsCount || 0,
          helpRequestsCount,
          donationItemsCount,
          donationsAmount,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase, user])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Campaigns"
        value={stats.campaignsCount}
        icon={<Heart className="h-4 w-4 text-rose-500" />}
        description="Campaigns created"
        loading={loading}
      />
      <StatCard
        title="Help Requests"
        value={stats.helpRequestsCount}
        icon={<HelpCircle className="h-4 w-4 text-purple-500" />}
        description="Requests submitted"
        loading={loading}
      />
      <StatCard
        title="Donation Items"
        value={stats.donationItemsCount}
        icon={<Package className="h-4 w-4 text-emerald-500" />}
        description="Items listed"
        loading={loading}
      />
      <StatCard
        title="Total Donated"
        value={`$${stats.donationsAmount.toFixed(2)}`}
        icon={<CircleDollarSign className="h-4 w-4 text-blue-500" />}
        description="Amount contributed"
        loading={loading}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description: string
  loading?: boolean
}

function StatCard({ title, value, icon, description, loading = false }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium tracking-tight">{title}</h3>
          {icon}
        </div>
        <div className="text-2xl font-bold">
          {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted"></div> : value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
