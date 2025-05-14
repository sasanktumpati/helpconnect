"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import type { User } from "@/lib/types"
import { AlertCircle } from "lucide-react"
import { OrganizationCard } from "@/components/directory/organization-card"

export function DirectoryList() {
  const { supabase } = useSupabase()
  const searchParams = useSearchParams()
  const [organizations, setOrganizations] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 9

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from("users")
          .select("*")
          .or("role.eq.ngo,role.eq.organization")
          .eq("profile_completed", true)
          .order("created_at", { ascending: false })
          .range(0, limit - 1)

        // Apply filters from URL params
        const role = searchParams.get("role")
        const type = searchParams.get("type")
        const location = searchParams.get("location")
        const search = searchParams.get("search")
        const isVerified = searchParams.get("isVerified")

        if (role && role !== "all") query = query.eq("role", role)
        if (type && type !== "all") query = query.ilike("organization_type", `%${type}%`)
        if (location) query = query.ilike("location", `%${location}%`)
        if (search) {
          query = query.or(
            `organization_name.ilike.%${search}%,display_name.ilike.%${search}%,mission_statement.ilike.%${search}%`,
          )
        }
        if (isVerified === "true") query = query.eq("is_verified", true)

        const { data, error, count } = await query

        if (error) throw error

        setOrganizations(data as User[])
        setHasMore((count || 0) > limit)
        setPage(0)
      } catch (err: any) {
        setError(err.message || "Failed to load organizations")
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [supabase, searchParams, limit])

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      let query = supabase
        .from("users")
        .select("*")
        .or("role.eq.ngo,role.eq.organization")
        .eq("profile_completed", true)
        .order("created_at", { ascending: false })
        .range((page + 1) * limit, (page + 2) * limit - 1)

      // Apply filters from URL params
      const role = searchParams.get("role")
      const type = searchParams.get("type")
      const location = searchParams.get("location")
      const search = searchParams.get("search")
      const isVerified = searchParams.get("isVerified")

      if (role && role !== "all") query = query.eq("role", role)
      if (type && type !== "all") query = query.ilike("organization_type", `%${type}%`)
      if (location) query = query.ilike("location", `%${location}%`)
      if (search) {
        query = query.or(
          `organization_name.ilike.%${search}%,display_name.ilike.%${search}%,mission_statement.ilike.%${search}%`,
        )
      }
      if (isVerified === "true") query = query.eq("is_verified", true)

      const { data, error } = await query

      if (error) throw error

      setOrganizations((prev) => [...prev, ...(data as User[])])
      setHasMore(data.length === limit)
      setPage((prev) => prev + 1)
    } catch (err: any) {
      setError(err.message || "Failed to load more organizations")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading organizations</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!loading && organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No organizations found</h3>
        <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
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
