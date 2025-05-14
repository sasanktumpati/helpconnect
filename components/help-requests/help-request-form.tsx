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
import { createHelpRequest } from "@/lib/supabase/database"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { RequestStatus } from "@/lib/types"

const helpRequestFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  request_type: z.string({
    required_error: "Please select a request type.",
  }),
  urgency_level: z.enum(["low", "medium", "high", "critical"] as const, {
    required_error: "Please select an urgency level.",
  }),
  location: z.string().optional(),
  contact_info: z.object({
    name: z.string().min(2, { message: "Contact name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }).optional(),
    phone: z.string().optional(),
    preferred_contact: z.enum(["email", "phone", "either"] as const),
  }),
  is_active: z.boolean().default(true),
})

type HelpRequestFormValues = z.infer<typeof helpRequestFormSchema>

const defaultValues: Partial<HelpRequestFormValues> = {
  description: "",
  location: "",
  urgency_level: "medium",
  is_active: true,
  contact_info: {
    preferred_contact: "email",
  },
}

export function HelpRequestForm() {
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<HelpRequestFormValues>({
    resolver: zodResolver(helpRequestFormSchema),
    defaultValues,
  })

  async function onSubmit(data: HelpRequestFormValues) {
    if (!user) {
      setError("You must be logged in to create a help request.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const helpRequestData = {
        ...data,
        requester_id: user.id,
        status: "pending" as RequestStatus,
      }

      await createHelpRequest(helpRequestData)

      toast({
        title: "Help request created",
        description: "Your help request has been created successfully.",
      })

      router.push("/dashboard/help-requests")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create help request. Please try again.")
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title for your request" {...field} />
                </FormControl>
                <FormDescription>A clear, concise title for your help request.</FormDescription>
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
                  <Textarea
                    placeholder="Describe what kind of help you need"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide details about what you need help with.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="request_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="medical">Medical Assistance</SelectItem>
                      <SelectItem value="food">Food & Water</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="financial">Financial Aid</SelectItem>
                      <SelectItem value="education">Educational Support</SelectItem>
                      <SelectItem value="childcare">Childcare</SelectItem>
                      <SelectItem value="elderly">Elderly Care</SelectItem>
                      <SelectItem value="mental_health">Mental Health Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of help you're requesting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgency_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Needed soon</SelectItem>
                      <SelectItem value="high">High - Urgent need</SelectItem>
                      <SelectItem value="critical">Critical - Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How urgently do you need this help?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your location" {...field} />
                </FormControl>
                <FormDescription>Where are you located? This helps match you with nearby help.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              Provide contact details so people can reach out to help you.
            </p>

            <FormField
              control={form.control}
              name="contact_info.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_info.email"
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
                name="contact_info.phone"
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

            <FormField
              control={form.control}
              name="contact_info.preferred_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred contact method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="either">Either</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Request</FormLabel>
                  <FormDescription>Make this request visible to others immediately.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
              {isSubmitting ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
