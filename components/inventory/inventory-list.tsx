"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { InventoryItemCard } from "@/components/inventory/inventory-item-card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import type { InventoryItem } from "@/lib/types"
import { AlertCircle } from "lucide-react"

export function InventoryList() {
  const { supabase, user } = useSupabase()
  const searchParams = useSearchParams()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 9

  useEffect(() => {
    if (!user) return

    const fetchInventoryItems = async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from("inventory_items")
          .select("*", { count: "exact" })
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .range(0, limit - 1)

        // Apply filters from URL params if they exist
        if (searchParams) {
          const category = searchParams.get("category")
          const availability = searchParams.get("availability")
          const search = searchParams.get("search")
          const isNeeded = searchParams.get("isNeeded")
          const belowThreshold = searchParams.get("belowThreshold")

          if (category && category !== "all") query = query.eq("category", category)
          if (availability === "available") query = query.eq("is_available", true)
          if (availability === "unavailable") query = query.eq("is_available", false)
          if (search) query = query.ilike("name", `%${search}%`)
          if (isNeeded === "true") query = query.eq("is_needed", true)
          if (belowThreshold === "true")
            query = query.lt("quantity", supabase.rpc("get_min_threshold", { item_id: "id" }))
        }

        const { data, error, count } = await query

        if (error) throw error

        setInventoryItems(data as InventoryItem[])
        setHasMore((count || 0) > limit)
        setPage(0)
      } catch (err: any) {
        setError(err.message || "Failed to load inventory items")
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryItems()
  }, [supabase, searchParams, user, limit])

  const loadMore = async () => {
    if (loading || !hasMore || !user) return

    setLoading(true)

    try {
      let query = supabase
        .from("inventory_items")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .range((page + 1) * limit, (page + 2) * limit - 1)

      // Apply filters from URL params
      if (searchParams) {
        const category = searchParams.get("category")
        const availability = searchParams.get("availability")
        const search = searchParams.get("search")
        const isNeeded = searchParams.get("isNeeded")
        const belowThreshold = searchParams.get("belowThreshold")

        if (category && category !== "all") query = query.eq("category", category)
        if (availability === "available") query = query.eq("is_available", true)
        if (availability === "unavailable") query = query.eq("is_available", false)
        if (search) query = query.ilike("name", `%${search}%`)
        if (isNeeded === "true") query = query.eq("is_needed", true)
        if (belowThreshold === "true")
          query = query.lt("quantity", supabase.rpc("get_min_threshold", { item_id: "id" }))
      }

      const { data, error } = await query

      if (error) throw error

      setInventoryItems((prev) => [...prev, ...(data as InventoryItem[])])
      setHasMore(data.length === limit)
      setPage((prev) => prev + 1)
    } catch (err: any) {
      setError(err.message || "Failed to load more inventory items")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading inventory items</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!loading && inventoryItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No inventory items found</h3>
        <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or add new inventory items.</p>
        <Button asChild>
          <a href="/dashboard/inventory/new">Add Inventory Item</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => (
          <InventoryItemCard key={item.id} item={item} />
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
