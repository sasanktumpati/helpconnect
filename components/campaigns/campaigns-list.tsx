"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { CampaignCard } from "@/components/dashboard/campaign-card"
import { Button } from "@/components/ui/button"
import { getCampaigns } from "@/lib/supabase/database"
import type { Campaign } from "@/lib/types"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function CampaignsList() {
  const searchParams = useSearchParams()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 9

  // Create a stable reference to the search params
  const type = searchParams.get("type")
  const urgency = searchParams.get("urgency")
  const search = searchParams.get("search")
  const isDisasterRelief = searchParams.get("isDisasterRelief")
  const isActive = searchParams.get("isActive")

  // Create a stable key for the current filters to use in dependencies
  const filterKey = useMemo(() => {
    return `${type || ""}|${urgency || ""}|${search || ""}|${isDisasterRelief || ""}|${isActive || ""}`
  }, [type, urgency, search, isDisasterRelief, isActive])

  // Create memoized filters object that doesn't change unless the filter values change
  const filters = useMemo(() => {
    const filtersObj: Partial<Campaign> = {}

    if (type && type !== "" && type !== "all") filtersObj.campaign_type = type
    if (urgency && urgency !== "" && urgency !== "any") filtersObj.urgency_level = urgency
    if (isDisasterRelief === "true") filtersObj.is_disaster_relief = true
    if (isActive !== "false") filtersObj.is_active = true

    return filtersObj
  }, [type, urgency, isDisasterRelief, isActive])

  const fetchCampaigns = useCallback(
    async (pageNumber = 0, isLoadMore = false) => {
      if (!isLoadMore) {
        setLoading(true)
      }
      setError(null)

      try {
        // Use the database utility function
        const { data, count } = await getCampaigns(limit, pageNumber, filters)
        setTotalCount(count || 0)

        // If search is provided, filter results client-side
        let filteredData = data
        if (search && search !== "") {
          filteredData = data.filter((campaign) => campaign.title.toLowerCase().includes(search.toLowerCase()))
        }

        if (pageNumber === 0) {
          setCampaigns(filteredData)
        } else {
          setCampaigns((prev) => [...prev, ...filteredData])
        }

        setHasMore((count || 0) > (pageNumber + 1) * limit)
        setPage(pageNumber)
      } catch (err: any) {
        console.error("Error fetching campaigns:", err)
        setError(err.message || "Failed to load campaigns")
      } finally {
        setLoading(false)
      }
    },
    [filters, search, limit],
  )

  // Only run this effect when the filter key changes
  useEffect(() => {
    // Reset to page 0 when filters change
    setCampaigns([])
    setPage(0)
    fetchCampaigns(0)
  }, [filterKey, fetchCampaigns])

  const loadMore = () => {
    if (loading || !hasMore) return
    fetchCampaigns(page + 1, true)
  }

  const handleRetry = () => {
    fetchCampaigns(0)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading campaigns</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && campaigns.length === 0 ? (
          // Show skeletons when initially loading
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))
        ) : campaigns.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">No campaigns found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or create a new campaign.</p>
          </div>
        ) : (
          campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
        )}
      </div>

      {hasMore && campaigns.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {totalCount > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing {campaigns.length} of {totalCount} campaigns
        </p>
      )}
    </div>
  )
}
