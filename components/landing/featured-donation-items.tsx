"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ArrowRight } from "lucide-react"

export function FeaturedDonationItems() {
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
      <div className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
                Available Items
              </div>
              <h2 className="text-3xl font-bold">Featured Donation Items</h2>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
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
                <CardFooter className="px-6 pb-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
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
    <div className="py-20 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
              Available Items
            </div>
            <h2 className="text-3xl font-bold">Featured Donation Items</h2>
          </div>
          <Link href="/donation-items">
            <Button variant="outline" className="group">
              View All Items
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                  <Button variant="outline" className="w-full group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
