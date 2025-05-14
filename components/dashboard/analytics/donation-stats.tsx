"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDonationStats } from "@/lib/supabase/database"
import { CircleDollarSign, TrendingUp, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DonationStatsProps {
  className?: string
}

export function DonationStats({ className }: DonationStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDonationStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching donation stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 mb-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
        </div>
        <Card className="mt-4">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format monthly data for chart
  const chartData =
    stats?.donation_count_by_month?.map((item: any) => ({
      name: item.month,
      amount: Number.parseFloat(item.amount),
      count: item.count,
    })) || []

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_donations || 0}</div>
            <p className="text-xs text-muted-foreground">Successful donations received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number.parseFloat(stats?.total_amount || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total funds raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number.parseFloat(stats?.avg_donation || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average donation amount</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Monthly Donations</CardTitle>
          <CardDescription>Donation amounts and counts by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="amount" name="Amount ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="count" name="Number of Donations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {stats?.top_campaigns && stats.top_campaigns.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
            <CardDescription>Campaigns with the highest donation amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.top_campaigns.map((campaign: any, index: number) => (
                <div key={campaign.campaign_id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{campaign.campaign_title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.donation_count} donations</p>
                    </div>
                  </div>
                  <div className="font-medium">${Number.parseFloat(campaign.total_amount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
