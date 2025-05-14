"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CommunityDriveCard } from "@/components/dashboard/community-drive-card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import type { CommunityDrive } from "@/lib/types"
import { AlertCircle } from "lucide-react"

export function CommunityDrivesList() {
  const { supabase } = useSupabase()
  const searchParams = useSearchParams()
  const [communityDrives, setCommunityDrives] = useState<CommunityDrive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 9

  useEffect(() => {
    const fetchCommunityDrives = async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from("community_drives")
          .select("*")
          .order("start_date", { ascending: true })
          .range(0, limit - 1)

        // Apply filters from URL params
        const type = searchParams.get("type")
        const location = searchParams.get("location")
        const search = searchParams.get("search")
        const isActive = searchParams.get("isActive")
        const hasSpace = searchParams.get("hasSpace")

        if (type && type !== "all") query = query.eq("drive_type", type)
        if (location) query = query.ilike("location", `%${location}%`)
        if (search) query = query.ilike("title", `%${search}%`)
        if (isActive !== "false") query = query.eq("is_active", true)
        if (hasSpace === "true") {
          query = query.or(`participant_limit.is.null,current_participants.lt.participant_limit`)
        }

        const { data, error, count } = await query

        if (error) throw error

        setCommunityDrives(data as CommunityDrive[])
        setHasMore((count || 0) > limit)
        setPage(0)
      } catch (err: any) {
        setError(err.message || "Failed to load community drives")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityDrives()
  }, [supabase, searchParams, limit])

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      let query = supabase
        .from("community_drives")
        .select("*")
        .order("start_date", { ascending: true })
        .range((page + 1) * limit, (page + 2) * limit - 1)

      // Apply filters from URL params
      const type = searchParams.get("type")
      const location = searchParams.get("location")
      const search = searchParams.get("search")
      const isActive = searchParams.get("isActive")
      const hasSpace = searchParams.get("hasSpace")

      if (type && type !== "all") query = query.eq("drive_type", type)
      if (location) query = query.ilike("location", `%${location}%`)
      if (search) query = query.ilike("title", `%${search}%`)
      if (isActive !== "false") query = query.eq("is_active", true)
      if (hasSpace === "true") {
        query = query.or(`participant_limit.is.null,current_participants.lt.participant_limit`)
      }

      const { data, error } = await query

      if (error) throw error

      setCommunityDrives((prev) => [...prev, ...(data as CommunityDrive[])])
      setHasMore(data.length === limit)
      setPage((prev) => prev + 1)
    } catch (err: any) {
      setError(err.message || "Failed to load more community drives")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading community drives</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!loading && communityDrives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No community drives found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try adjusting your filters or create a new community drive.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityDrives.map((communityDrive) => (
          <CommunityDriveCard key={communityDrive.id} communityDrive={communityDrive} />
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
