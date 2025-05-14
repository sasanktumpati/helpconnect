"use client"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { Campaign } from "@/lib/types"

interface CampaignStatusManagerProps {
  campaign: Campaign
  onStatusChange?: (updatedCampaign: Campaign) => void
}

export function CampaignStatusManager({ campaign, onStatusChange }: CampaignStatusManagerProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [localCampaign, setLocalCampaign] = useState<Campaign>(campaign)

  const now = new Date()
  const startDate = localCampaign.start_date ? new Date(localCampaign.start_date) : null
  const endDate = localCampaign.end_date ? new Date(localCampaign.end_date) : null

  const isNotStarted = startDate && isBefore(now, startDate)
  const isExpired = endDate && isAfter(now, endDate)

  const handleToggleStatus = async () => {
    try {
      setLoading(true)
      const newStatus = !localCampaign.is_active

      const { data, error } = await supabase
        .from("campaigns")
        .update({ is_active: newStatus })
        .eq("id", localCampaign.id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      const updatedCampaign = { ...localCampaign, is_active: newStatus } as Campaign
      setLocalCampaign(updatedCampaign)

      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(updatedCampaign)
      }

      toast({
        title: newStatus ? "Campaign activated" : "Campaign deactivated",
        description: newStatus
          ? "The campaign is now visible to the public."
          : "The campaign is now hidden from public view.",
      })

      // Refresh the page data without a full reload
      router.refresh()
    } catch (error: any) {
      console.error("Error updating campaign status:", error)
      toast({
        title: "Error updating campaign",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Campaign Status</CardTitle>
        <CardDescription>Manage the visibility and status of your campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${localCampaign.is_active ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="font-medium">{localCampaign.is_active ? "Active" : "Inactive"}</span>
          </div>

          {isNotStarted && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Starts on {startDate ? format(startDate, "MMMM d, yyyy") : "N/A"}</span>
            </div>
          )}

          {isExpired && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <XCircle className="h-4 w-4" />
              <span>Expired on {endDate ? format(endDate, "MMMM d, yyyy") : "N/A"}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleToggleStatus}
          disabled={loading}
          variant={localCampaign.is_active ? "outline" : "default"}
          className={localCampaign.is_active ? "" : "bg-[#1249BF] hover:bg-[#1249BF]/90"}
          size="sm"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
              Processing...
            </span>
          ) : localCampaign.is_active ? (
            <span className="flex items-center gap-1">
              <XCircle className="h-4 w-4 mr-1" />
              Deactivate Campaign
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Activate Campaign
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
