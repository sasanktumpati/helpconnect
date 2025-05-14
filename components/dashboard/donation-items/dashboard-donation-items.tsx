"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase/provider"
import { AlertCircle, Plus } from "lucide-react"
import { DonationItemCard } from "@/components/donation-items/donation-item-card"
import { DashboardDonationItemsHeader } from "./dashboard-donation-items-header"
import type { DonationItem } from "@/lib/types"

export function DashboardDonationItems() {
  const { supabase, user } = useSupabase()
  const [items, setItems] = useState<DonationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("donation_items")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Also fetch user profile for contact info
        // Fix: Query the "users" table instead of "profiles"
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
        } else {
          setUserProfile(profileData || null)
        }

        setItems(data as DonationItem[])
      } catch (err: any) {
        console.error("Error fetching donation items:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [supabase, user])

  // Filter items based on active tab
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "visible") return item.is_available
    if (activeTab === "hidden") return !item.is_available
    return true
  })

  // Calculate counts for header
  const totalItems = items.length
  const availableItems = items.filter((item) => item.is_available).length
  const unavailableItems = totalItems - availableItems

  // Get default contact info from the first item or user profile
  const defaultContactInfo = {
    name: userProfile?.display_name || items[0]?.contact_name || "",
    email: userProfile?.email || items[0]?.contact_email || "",
    phone: userProfile?.phone_number || items[0]?.contact_phone || "",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Donation Items</h1>
            <p className="text-muted-foreground">Manage items you've listed for donation</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/donation-items/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4">
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="h-6 w-full bg-muted rounded mb-4"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading donation items</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardDonationItemsHeader
        totalItems={totalItems}
        availableItems={availableItems}
        unavailableItems={unavailableItems}
        contactName={defaultContactInfo.name}
        contactEmail={defaultContactInfo.email}
        contactPhone={defaultContactInfo.phone}
      />

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="all" className="mt-6">
          {renderItemsList(items, "all")}
        </TabsContent>
        <TabsContent value="visible" className="mt-6">
          {renderItemsList(filteredItems, "visible")}
        </TabsContent>
        <TabsContent value="hidden" className="mt-6">
          {renderItemsList(filteredItems, "hidden")}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderItemsList(items: DonationItem[], type: string) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {type === "all" ? "No donation items yet" : type === "visible" ? "No visible items" : "No hidden items"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {type === "all"
              ? "List items you want to donate to help those in need."
              : type === "visible"
                ? "Items marked as visible will appear here."
                : "Items marked as hidden will appear here."}
          </p>
          <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
            <Link href="/dashboard/donation-items/new">Add Donation Item</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DonationItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
