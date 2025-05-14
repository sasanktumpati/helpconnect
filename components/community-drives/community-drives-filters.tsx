"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { DriveType } from "@/lib/types"

export function CommunityDrivesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: (searchParams.get("type") as DriveType) || "",
    location: searchParams.get("location") || "",
    isActive: searchParams.get("isActive") === "true" || true,
    hasSpace: searchParams.get("hasSpace") === "true" || false,
  })

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.type) params.set("type", filters.type)
    if (filters.location) params.set("location", filters.location)
    if (!filters.isActive) params.set("isActive", "false")
    if (filters.hasSpace) params.set("hasSpace", "true")

    router.push(`/community-drives?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      location: "",
      isActive: true,
      hasSpace: false,
    })
    router.push("/community-drives")
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-muted-foreground">Narrow down community drives by specific criteria.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search community drives..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Drive Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="community">Community Building</SelectItem>
              <SelectItem value="health">Health Camp</SelectItem>
              <SelectItem value="emergency">Emergency Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={filters.isActive}
            onCheckedChange={(checked) => handleFilterChange("isActive", checked)}
          />
          <Label htmlFor="active">Active Drives Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="has-space"
            checked={filters.hasSpace}
            onCheckedChange={(checked) => handleFilterChange("hasSpace", checked)}
          />
          <Label htmlFor="has-space">Available Spots Only</Label>
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
