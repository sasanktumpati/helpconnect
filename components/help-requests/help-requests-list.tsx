"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { HelpRequestCard } from "@/components/dashboard/help-request-card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import type { HelpRequest } from "@/lib/types"
import { AlertCircle } from "lucide-react"

export function HelpRequestsList() {
  const { supabase } = useSupabase()
  const searchParams = useSearchParams()
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 9

  // Convert searchParams to a string for dependency tracking
  const searchParamsString = Array.from(searchParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const fetchHelpRequests = useCallback(
    async (reset = false) => {
      setLoading(true)
      setError(null)

      try {
        const currentPage = reset ? 0 : page

        let query = supabase
          .from("help_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .range(currentPage * limit, (currentPage + 1) * limit - 1)

        // Apply filters from URL params
        const type = searchParams.get("type")
        const urgency = searchParams.get("urgency")
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        if (type && type !== "all") query = query.eq("request_type", type)
        if (urgency && urgency !== "any") query = query.eq("urgency_level", urgency)
        if (status && status !== "any") query = query.eq("status", status)
        if (search) query = query.ilike("title", `%${search}%`)

        const { data, error, count } = await query

        if (error) throw error

        if (reset) {
          setHelpRequests(data as HelpRequest[])
          setPage(0)
        } else {
          setHelpRequests((prev) => [...prev, ...(data as HelpRequest[])])
          setPage(currentPage + 1)
        }

        setHasMore((count || 0) > (currentPage + 1) * limit)
      } catch (err: any) {
        setError(err.message || "Failed to load help requests")
      } finally {
        setLoading(false)
      }
    },
    [supabase, searchParams, page, limit],
  )

  useEffect(() => {
    fetchHelpRequests(true)
  }, [searchParamsString, fetchHelpRequests])

  const loadMore = () => {
    if (loading || !hasMore) return
    fetchHelpRequests(false)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading help requests</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchHelpRequests(true)}>Try Again</Button>
      </div>
    )
  }

  if (!loading && helpRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No help requests found</h3>
        <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or create a new help request.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpRequests.map((helpRequest) => (
          <HelpRequestCard key={helpRequest.id} helpRequest={helpRequest} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
