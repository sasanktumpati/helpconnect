"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import { createInventoryItem } from "@/lib/supabase/database"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const inventoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string({
    required_error: "Please select a category.",
  }),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must be a positive number.",
  }),
  min_threshold: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  is_available: z.boolean().default(true),
  is_needed: z.boolean().default(false),
})

type InventoryFormValues = z.infer<typeof inventoryFormSchema>

const defaultValues: Partial<InventoryFormValues> = {
  description: "",
  quantity: 1,
  min_threshold: undefined,
  location: "",
  is_available: true,
  is_needed: false,
}

export function InventoryForm() {
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues,
  })

  async function onSubmit(data: InventoryFormValues) {
    if (!user) {
      setError("You must be logged in to create an inventory item.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const inventoryData = {
        ...data,
        owner_id: user.id,
      }

      await createInventoryItem(inventoryData)

      toast({
        title: "Inventory item created",
        description: "Your inventory item has been created successfully.",
      })

      router.push("/dashboard/inventory")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create inventory item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormDescription>The name of the inventory item.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter a description of the item" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Provide details about the item's condition, specifications, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="food">Food & Water</SelectItem>
                      <SelectItem value="medical">Medical Supplies</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="hygiene">Hygiene Products</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the category that best describes this item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>The number of items available.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="min_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Threshold (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Set minimum threshold"
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Get alerts when quantity falls below this threshold.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter storage location" {...field} />
                  </FormControl>
                  <FormDescription>Where this item is stored or available.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <FormDescription>Mark this item as available for distribution or use.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_needed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Needed</FormLabel>
                    <FormDescription>Mark this as an item you need rather than one you have.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
