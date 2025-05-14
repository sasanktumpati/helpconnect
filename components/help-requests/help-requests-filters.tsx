"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UrgencyLevel } from "@/lib/types"

export function HelpRequestsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    urgency: (searchParams.get("urgency") as UrgencyLevel) || "",
    status: searchParams.get("status") || "",
  })

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.type) params.set("type", filters.type)
    if (filters.urgency) params.set("urgency", filters.urgency)
    if (filters.status) params.set("status", filters.status)

    router.push(`/help-requests?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      urgency: "",
      status: "",
    })
    router.push("/help-requests")
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-muted-foreground">Narrow down help requests by specific criteria.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search help requests..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Request Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="personal">Personal Emergency</SelectItem>
              <SelectItem value="community">Community Need</SelectItem>
              <SelectItem value="disaster">Disaster-affected</SelectItem>
              <SelectItem value="medical">Medical Assistance</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
            </SelectContent>
          </Select>
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
