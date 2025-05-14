"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Package } from "lucide-react"

export function FeaturedItems() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("donation_items")
          .select("*, users!inner(display_name)")
          .eq("is_available", true)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error("Error fetching featured items:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Donation Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Donation Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2">{item.condition}</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Donated by {item.users.display_name || "Anonymous"}
                </p>
                <p className="text-sm line-clamp-3 mb-4">{item.description}</p>
                <Badge variant="outline" className="mr-2">
                  {item.category}
                </Badge>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link href={`/donation-items/${item.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/donation-items">
            <Button>View All Donation Items</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
