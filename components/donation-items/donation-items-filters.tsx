"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import type { ItemCondition, DonationItemCategory } from "@/lib/types"

export function DonationItemsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    condition: searchParams.get("condition") || "",
    categories: [] as string[],
  })

  // Initialize categories from URL
  useEffect(() => {
    const categoriesParam = searchParams.get("categories")
    if (categoriesParam) {
      setFilters((prev) => ({
        ...prev,
        categories: categoriesParam.split(","),
      }))
    }
  }, [searchParams])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => {
      const newCategories = checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category)

      return {
        ...prev,
        categories: newCategories,
      }
    })
  }

  const handleConditionChange = (condition: string) => {
    setFilters((prev) => ({
      ...prev,
      condition,
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.condition) {
      params.set("condition", filters.condition)
    }

    if (filters.categories.length > 0) {
      params.set("categories", filters.categories.join(","))
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      condition: "",
      categories: [],
    })
    router.push(pathname)
  }

  const categories: { value: DonationItemCategory; label: string }[] = [
    { value: "clothing", label: "Clothing" },
    { value: "food", label: "Food" },
    { value: "furniture", label: "Furniture" },
    { value: "electronics", label: "Electronics" },
    { value: "toys", label: "Toys" },
    { value: "books", label: "Books" },
    { value: "medical", label: "Medical Supplies" },
    { value: "household", label: "Household Items" },
    { value: "school_supplies", label: "School Supplies" },
    { value: "other", label: "Other" },
  ]

  const conditions: { value: ItemCondition; label: string }[] = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={filters.categories.includes(category.value)}
                  onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                />
                <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Condition</h3>
          <RadioGroup value={filters.condition} onValueChange={handleConditionChange}>
            {conditions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <RadioGroupItem value={condition.value} id={`condition-${condition.value}`} />
                <Label htmlFor={`condition-${condition.value}`}>{condition.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={applyFilters} className="w-full bg-[#1249BF] hover:bg-[#1249BF]/90">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters} className="w-full">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
