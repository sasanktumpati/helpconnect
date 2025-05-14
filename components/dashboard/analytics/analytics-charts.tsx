"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase/provider"
import { AlertCircle } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { COLORS } from "@/lib/utils/color-utils"

export function AnalyticsCharts() {
  const { supabase, user } = useSupabase()
  const [campaignData, setCampaignData] = useState<any[]>([])
  const [donationData, setDonationData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Get campaigns by type
        const { data: campaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("campaign_type, count")
          .eq("creator_id", user.id)
          .group("campaign_type")

        if (campaignsError) throw campaignsError

        // Format campaign data for chart
        const formattedCampaignData = campaigns.map((item) => ({
          type: item.campaign_type.replace("_", " "),
          count: item.count,
        }))

        setCampaignData(formattedCampaignData)

        // Get donations by month (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("created_at, amount")
          .in("campaign_id", supabase.from("campaigns").select("id").eq("creator_id", user.id))
          .eq("payment_status", "completed")
          .gte("created_at", sixMonthsAgo.toISOString())
          .order("created_at", { ascending: true })

        if (donationsError) throw donationsError

        // Group donations by month
        const donationsByMonth: Record<string, number> = {}

        donations.forEach((donation) => {
          const date = new Date(donation.created_at)
          const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

          if (!donationsByMonth[monthYear]) {
            donationsByMonth[monthYear] = 0
          }

          donationsByMonth[monthYear] += donation.amount || 0
        })

        // Format donation data for chart
        const formattedDonationData = Object.entries(donationsByMonth).map(([month, amount]) => ({
          month,
          amount,
        }))

        setDonationData(formattedDonationData)
      } catch (err: any) {
        setError(err.message || "Failed to load chart data")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [supabase, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Charts</CardTitle>
          <CardDescription>Please wait while we load your data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load chart data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 text-sm border rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Analytics</CardTitle>
        <CardDescription>View statistics about your campaigns and donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="campaigns">
          <TabsList className="mb-4">
            <TabsTrigger value="campaigns">Campaigns by Type</TabsTrigger>
            <TabsTrigger value="donations">Donations Over Time</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns" className="h-80">
            {campaignData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Campaigns" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No campaign data available</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="donations" className="h-80">
            {donationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" name="Donation Amount" stroke={COLORS.primary} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No donation data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
