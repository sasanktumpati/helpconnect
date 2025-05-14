"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { AlertCircle } from "lucide-react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { COLORS } from "@/lib/utils/color-utils"

export function DonationTrends() {
  const { supabase, user } = useSupabase()
  const [donationTrends, setDonationTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonationTrends = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Get donations by day (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("created_at, amount, payment_status")
          .in("campaign_id", supabase.from("campaigns").select("id").eq("creator_id", user.id))
          .eq("payment_status", "completed")
          .gte("created_at", thirtyDaysAgo.toISOString())
          .order("created_at", { ascending: true })

        if (donationsError) throw donationsError

        // Group donations by day
        const donationsByDay: Record<string, { count: number; amount: number }> = {}

        // Initialize all days in the last 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split("T")[0]
          donationsByDay[dateStr] = { count: 0, amount: 0 }
        }

        // Fill in actual donation data
        donations.forEach((donation) => {
          const dateStr = donation.created_at.split("T")[0]
          if (!donationsByDay[dateStr]) {
            donationsByDay[dateStr] = { count: 0, amount: 0 }
          }
          donationsByDay[dateStr].count += 1
          donationsByDay[dateStr].amount += donation.amount || 0
        })

        // Format donation data for chart
        const formattedDonationTrends = Object.entries(donationsByDay)
          .map(([date, data]) => ({
            date,
            count: data.count,
            amount: data.amount,
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14) // Show only the last 14 days for better visualization

        setDonationTrends(formattedDonationTrends)
      } catch (err: any) {
        setError(err.message || "Failed to load donation trends")
      } finally {
        setLoading(false)
      }
    }

    fetchDonationTrends()
  }, [supabase, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Loading donation trends data...</CardDescription>
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
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Failed to load donation trends</CardDescription>
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
        <CardTitle>Donation Trends (Last 14 Days)</CardTitle>
        <CardDescription>Track your donation activity over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {donationTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
              />
              <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "amount") return [`$${value}`, "Amount"]
                  return [value, "Count"]
                }}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString()
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="amount"
                name="Donation Amount"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorAmount)"
                yAxisId="left"
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Donation Count"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCount)"
                yAxisId="right"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No donation data available for the last 14 days</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
