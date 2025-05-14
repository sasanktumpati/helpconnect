"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X } from "lucide-react"

export function InventoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [isNeeded, setIsNeeded] = useState<boolean>(false)
  const [belowThreshold, setBelowThreshold] = useState<boolean>(false)

  // Initialize state from URL params after component mounts
  useEffect(() => {
    if (searchParams) {
      setCategory(searchParams.get("category") || "all")
      setAvailability(searchParams.get("availability") || "all")
      setSearch(searchParams.get("search") || "")
      setIsNeeded(searchParams.get("isNeeded") === "true")
      setBelowThreshold(searchParams.get("belowThreshold") === "true")
    }
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category && category !== "all") params.set("category", category)
    if (availability && availability !== "all") params.set("availability", availability)
    if (search) params.set("search", search)
    if (isNeeded) params.set("isNeeded", "true")
    if (belowThreshold) params.set("belowThreshold", "true")

    const queryString = params.toString()
    router.push(`/dashboard/inventory${queryString ? `?${queryString}` : ""}`)
  }

  const resetFilters = () => {
    setCategory("all")
    setAvailability("all")
    setSearch("")
    setIsNeeded(false)
    setBelowThreshold(false)
    router.push("/dashboard/inventory")
  }

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search items..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food & Water</SelectItem>
              <SelectItem value="medical">Medical Supplies</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="shelter">Shelter</SelectItem>
              <SelectItem value="hygiene">Hygiene Products</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger id="availability">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col justify-end space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="isNeeded" checked={isNeeded} onCheckedChange={(checked) => setIsNeeded(checked === true)} />
            <Label htmlFor="isNeeded" className="text-sm font-normal">
              Needed Items
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="belowThreshold"
              checked={belowThreshold}
              onCheckedChange={(checked) => setBelowThreshold(checked === true)}
            />
            <Label htmlFor="belowThreshold" className="text-sm font-normal">
              Below Threshold
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button size="sm" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
