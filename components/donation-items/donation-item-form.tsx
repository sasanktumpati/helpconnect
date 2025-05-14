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
import { createDonationItem } from "@/lib/supabase/database"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const donationItemFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  condition: z.enum(["new", "like_new", "good", "fair", "poor"] as const, {
    required_error: "Please select the item condition.",
  }),
  category: z.enum(
    [
      "clothing",
      "food",
      "furniture",
      "electronics",
      "toys",
      "books",
      "medical",
      "household",
      "school_supplies",
      "other",
    ] as const,
    {
      required_error: "Please select a category.",
    },
  ),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  location: z.string().optional(),
  is_available: z.boolean().default(true),
  contact_name: z.string().min(2, {
    message: "Contact name is required.",
  }),
  contact_email: z.string().email({ message: "Please enter a valid email" }).optional(),
  contact_phone: z.string().optional(),
  notes: z.string().optional(),
})

type DonationItemFormValues = z.infer<typeof donationItemFormSchema>

// Ensure all fields have default values to prevent controlled/uncontrolled switching
const defaultValues: DonationItemFormValues = {
  title: "",
  description: "",
  condition: "good",
  category: "other",
  quantity: 1,
  location: "",
  is_available: true,
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  notes: "",
}

export function DonationItemForm() {
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<DonationItemFormValues>({
    resolver: zodResolver(donationItemFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: DonationItemFormValues) {
    if (!user) {
      setError("You must be logged in to create a donation item.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const donationItemData = {
        ...data,
        owner_id: user.id,
      }

      await createDonationItem(donationItemData)

      toast({
        title: "Donation item created",
        description: "Your donation item has been created successfully.",
      })

      router.push("/dashboard/donation-items")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create donation item. Please try again.")
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item title" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>A clear, descriptive title for the item you're donating.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the item in detail"
                    className="resize-none min-h-[120px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Provide details about the item, such as size, color, etc.</FormDescription>
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
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="medical">Medical Supplies</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                      <SelectItem value="school_supplies">School Supplies</SelectItem>
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
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What condition is the item in?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      value={field.value || 1}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "1" : e.target.value
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>How many items are you donating?</FormDescription>
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
                    <Input placeholder="Enter pickup location" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Where can the item be picked up?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              Provide contact details so people can reach out about this donation.
            </p>

            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact name" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter contact email" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact phone" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information about the item or pickup arrangements"
                    className="resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Include any special instructions or additional details about the donation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Available</FormLabel>
                  <FormDescription>Mark this item as available for donation.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value === undefined ? true : field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Donation Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
