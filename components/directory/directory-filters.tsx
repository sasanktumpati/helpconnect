"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function DirectoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    role: searchParams.get("role") || "",
    location: searchParams.get("location") || "",
    isVerified: searchParams.get("isVerified") === "true" || false,
  })

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.type) params.set("type", filters.type)
    if (filters.role) params.set("role", filters.role)
    if (filters.location) params.set("location", filters.location)
    if (filters.isVerified) params.set("isVerified", "true")

    router.push(`/directory?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      role: "",
      location: "",
      isVerified: false,
    })
    router.push("/directory")
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-muted-foreground">Narrow down organizations by specific criteria.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search organizations..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Organization Role</Label>
          <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="organization">Small Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Organization Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="humanitarian">Humanitarian</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="community">Community</SelectItem>
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
            id="verified"
            checked={filters.isVerified}
            onCheckedChange={(checked) => handleFilterChange("isVerified", checked)}
          />
          <Label htmlFor="verified">Verified Organizations Only</Label>
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
