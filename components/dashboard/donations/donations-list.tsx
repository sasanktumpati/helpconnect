"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Download, ExternalLink, Info } from "lucide-react"
import type { Campaign, Donation } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DonationsList() {
  const { supabase, user } = useSupabase()
  const [donations, setDonations] = useState<(Donation & { campaign: Campaign })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("donations")
          .select(
            `
            *,
            campaign:campaigns(
              id,
              title,
              campaign_type,
              creator_id
            )
          `,
          )
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setDonations(data as (Donation & { campaign: Campaign })[])
      } catch (err: any) {
        setError(err.message || "Failed to load donations")
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading donations</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Donations Yet</CardTitle>
          <CardDescription>You haven't made any donations yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Support a campaign to make a difference and help those in need. Your contributions can have a significant
            impact.
          </p>
          <Button asChild>
            <Link href="/campaigns">Browse Campaigns</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Donations</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-4">
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left font-medium">Date</th>
                  <th className="h-12 px-4 text-left font-medium">Campaign</th>
                  <th className="h-12 px-4 text-left font-medium">Amount</th>
                  <th className="h-12 px-4 text-left font-medium">Status</th>
                  <th className="h-12 px-4 text-left font-medium">Transaction ID</th>
                  <th className="h-12 px-4 text-left font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="p-4 align-middle">{new Date(donation.created_at).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">
                      <Link
                        href={`/campaigns/${donation.campaign_id}`}
                        className="font-medium hover:underline flex items-center"
                      >
                        {donation.campaign.title}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </td>
                    <td className="p-4 align-middle font-medium">${donation.amount?.toFixed(2)}</td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={
                          donation.payment_status === "completed"
                            ? "success"
                            : donation.payment_status === "failed"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {donation.payment_status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {donation.transaction_id ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-muted-foreground">
                                {donation.transaction_id.substring(0, 8)}...
                                <Info className="ml-1 h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{donation.transaction_id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      {donation.payment_status === "completed" && donation.receipt_url && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={donation.receipt_url}>
                            <Download className="mr-2 h-4 w-4" />
                            Receipt
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="recent" className="space-y-4">
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left font-medium">Date</th>
                  <th className="h-12 px-4 text-left font-medium">Campaign</th>
                  <th className="h-12 px-4 text-left font-medium">Amount</th>
                  <th className="h-12 px-4 text-left font-medium">Status</th>
                  <th className="h-12 px-4 text-left font-medium">Transaction ID</th>
                  <th className="h-12 px-4 text-left font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="p-4 align-middle">{new Date(donation.created_at).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">
                      <Link
                        href={`/campaigns/${donation.campaign_id}`}
                        className="font-medium hover:underline flex items-center"
                      >
                        {donation.campaign.title}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </td>
                    <td className="p-4 align-middle font-medium">${donation.amount?.toFixed(2)}</td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={
                          donation.payment_status === "completed"
                            ? "success"
                            : donation.payment_status === "failed"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {donation.payment_status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {donation.transaction_id ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-muted-foreground">
                                {donation.transaction_id.substring(0, 8)}...
                                <Info className="ml-1 h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{donation.transaction_id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      {donation.payment_status === "completed" && donation.receipt_url && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={donation.receipt_url}>
                            <Download className="mr-2 h-4 w-4" />
                            Receipt
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
