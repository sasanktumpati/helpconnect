"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { DonationItem } from "@/lib/types"
import { PublicDonationItemCard } from "./public-donation-item-card"
import { Button } from "@/components/ui/button"
import { Loader2, Package } from "lucide-react"

export function DonationItemsList() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<DonationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const limit = 12

  // Convert searchParams to a string for dependency tracking
  const searchParamsString = Array.from(searchParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const fetchItems = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        const currentPage = reset ? 0 : page

        const supabase = createClient()
        let query = supabase
          .from("donation_items")
          .select("*, users!inner(display_name, profile_image_url, is_verified)", { count: "exact" })
          .eq("is_available", true)
          .order("created_at", { ascending: false })
          .range(currentPage * limit, (currentPage + 1) * limit - 1)

        // Apply category filter
        const categoriesParam = searchParams.get("categories")
        if (categoriesParam) {
          const categories = categoriesParam.split(",")
          query = query.in("category", categories)
        }

        // Apply condition filter
        const conditionParam = searchParams.get("condition")
        if (conditionParam) {
          query = query.eq("condition", conditionParam)
        }

        const { data, count, error } = await query

        if (error) throw error

        if (count !== null) {
          setTotalItems(count)
          setHasMore((currentPage + 1) * limit < count)
        }

        if (reset) {
          setItems(data || [])
          setPage(0)
        } else {
          setItems((prev) => [...prev, ...(data || [])])
          setPage(currentPage + 1)
        }
      } catch (err) {
        console.error("Error fetching donation items:", err)
        setError("Failed to load donation items. Please try again later.")
      } finally {
        setLoading(false)
      }
    },
    [page, searchParams, limit],
  )

  useEffect(() => {
    fetchItems(true)
  }, [searchParamsString, fetchItems])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => fetchItems(true)} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!loading && items.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No items found</h3>
        <p className="text-muted-foreground mt-2">There are no items available for donation matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <PublicDonationItemCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => fetchItems()} disabled={loading} className="min-w-[200px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing {items.length} of {totalItems} items
        </p>
      )}
    </div>
  )
}
