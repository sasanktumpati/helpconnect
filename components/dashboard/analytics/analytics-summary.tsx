"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { AlertCircle, DollarSign, Heart, Users } from "lucide-react"

export function AnalyticsSummary() {
  const { supabase, user } = useSupabase()
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonations: 0,
    totalRaised: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Get total campaigns
        const { count: totalCampaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", user.id)

        if (campaignsError) throw campaignsError

        // Get active campaigns
        const { count: activeCampaigns, error: activeCampaignsError } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", user.id)
          .eq("is_active", true)

        if (activeCampaignsError) throw activeCampaignsError

        // Get total donations and amount raised
        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("amount")
          .in("campaign_id", supabase.from("campaigns").select("id").eq("creator_id", user.id))
          .eq("payment_status", "completed")

        if (donationsError) throw donationsError

        const totalRaised = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)

        setStats({
          totalCampaigns: totalCampaigns || 0,
          activeCampaigns: activeCampaigns || 0,
          totalDonations: donations.length,
          totalRaised,
        })
      } catch (err: any) {
        setError(err.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center p-4 text-sm border rounded-md bg-destructive/10 text-destructive">
        <AlertCircle className="h-4 w-4 mr-2" />
        <p>Error loading analytics: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          <p className="text-xs text-muted-foreground">{stats.activeCampaigns} active campaigns</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRaised.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">From {stats.totalDonations} donations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Donation</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalDonations > 0 ? (stats.totalRaised / stats.totalDonations).toFixed(2) : "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">Per donation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalCampaigns > 0 ? `${((stats.totalDonations / stats.totalCampaigns) * 100).toFixed(1)}%` : "0%"}
          </div>
          <p className="text-xs text-muted-foreground">Donations per campaign</p>
        </CardContent>
      </Card>
    </div>
  )
}
