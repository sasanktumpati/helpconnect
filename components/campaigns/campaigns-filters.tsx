"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { CampaignType, UrgencyLevel } from "@/lib/types"

export function CampaignsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    urgency: "",
    isDisasterRelief: false,
    isActive: true,
  })

  // Use a ref to track if the component has been initialized
  const initializedRef = useRef(false)

  // Initialize filters from URL params when component mounts
  useEffect(() => {
    // Only run this effect once on mount
    if (!initializedRef.current) {
      setFilters({
        search: searchParams.get("search") || "",
        type: (searchParams.get("type") as CampaignType) || "",
        urgency: (searchParams.get("urgency") as UrgencyLevel) || "",
        isDisasterRelief: searchParams.get("isDisasterRelief") === "true",
        isActive: searchParams.get("isActive") !== "false",
      })
      initializedRef.current = true
    }
  }, [searchParams])

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.type && filters.type !== "all") params.set("type", filters.type)
    if (filters.urgency && filters.urgency !== "any") params.set("urgency", filters.urgency)
    if (filters.isDisasterRelief) params.set("isDisasterRelief", "true")
    if (!filters.isActive) params.set("isActive", "false")

    router.push(`/campaigns?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      urgency: "",
      isDisasterRelief: false,
      isActive: true,
    })
    router.push("/campaigns")
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-muted-foreground">Narrow down campaigns by specific criteria.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Campaign Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="monetary">Monetary</SelectItem>
              <SelectItem value="goods">Goods</SelectItem>
              <SelectItem value="blood">Blood</SelectItem>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="disaster_relief">Disaster Relief</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select value={filters.urgency} onValueChange={(value) => handleFilterChange("urgency", value)}>
            <SelectTrigger id="urgency">
              <SelectValue placeholder="Any urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any urgency</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="disaster-relief"
            checked={filters.isDisasterRelief}
            onCheckedChange={(checked) => handleFilterChange("isDisasterRelief", checked)}
          />
          <Label htmlFor="disaster-relief">Disaster Relief Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={filters.isActive}
            onCheckedChange={(checked) => handleFilterChange("isActive", checked)}
          />
          <Label htmlFor="active">Active Campaigns Only</Label>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
