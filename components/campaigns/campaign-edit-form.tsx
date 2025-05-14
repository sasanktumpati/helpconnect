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
import type { Campaign, CampaignType, UrgencyLevel } from "@/lib/types"
import { CalendarIcon, Loader2, Plus, X, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CampaignEditFormProps {
  userId: string
  campaignId: string
  campaign: Campaign
}

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  campaign_type: z.enum(["monetary", "goods", "blood", "volunteer", "disaster_relief"] as const),
  target_amount: z.coerce.number().optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
  location: z.string().optional(),
  is_disaster_relief: z.boolean().default(false),
  disaster_type: z.string().optional(),
  affected_area: z.string().optional(),
  urgency_level: z.enum(["low", "medium", "high", "critical"] as const),
  immediate_needs: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
})

export function CampaignEditForm({ userId, campaignId, campaign }: CampaignEditFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [immediateNeed, setImmediateNeed] = useState("")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: campaign.title || "",
      description: campaign.description || "",
      campaign_type: (campaign.campaign_type as CampaignType) || "monetary",
      target_amount: campaign.target_amount || undefined,
      start_date: campaign.start_date ? new Date(campaign.start_date) : new Date(),
      end_date: campaign.end_date ? new Date(campaign.end_date) : undefined,
      location: campaign.location || "",
      is_disaster_relief: campaign.is_disaster_relief || false,
      disaster_type: campaign.disaster_type || "",
      affected_area: campaign.affected_area || "",
      urgency_level: (campaign.urgency_level as UrgencyLevel) || "medium",
      immediate_needs: campaign.immediate_needs || [],
      is_active: campaign.is_active,
    },
  })

  const watchCampaignType = form.watch("campaign_type")
  const watchIsDisasterRelief = form.watch("is_disaster_relief")

  const addImmediateNeed = () => {
    if (!immediateNeed.trim()) return

    const currentNeeds = form.getValues("immediate_needs") || []
    form.setValue("immediate_needs", [...currentNeeds, immediateNeed.trim()])
    setImmediateNeed("")
  }

  const removeImmediateNeed = (index: number) => {
    const currentNeeds = form.getValues("immediate_needs") || []
    form.setValue(
      "immediate_needs",
      currentNeeds.filter((_, i) => i !== index),
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("campaigns")
        .update({
          title: values.title,
          description: values.description,
          campaign_type: values.campaign_type,
          target_amount: values.target_amount,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date?.toISOString(),
          location: values.location,
          is_disaster_relief: values.is_disaster_relief,
          disaster_type: values.disaster_type,
          affected_area: values.affected_area,
          urgency_level: values.urgency_level,
          immediate_needs: values.immediate_needs,
          is_active: values.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", campaignId)
        .eq("creator_id", userId)

      if (error) throw error

      toast({
        title: "Campaign updated!",
        description: "Your campaign has been successfully updated.",
      })

      router.push(`/campaigns/${campaignId}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error updating campaign:", error)
      setError(error.message || "Failed to update campaign. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a clear, descriptive title" {...field} />
              </FormControl>
              <FormDescription>Choose a title that clearly describes your campaign.</FormDescription>
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
                <Textarea placeholder="Describe your campaign in detail..." className="min-h-32" {...field} />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your campaign, its goals, and why it matters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="campaign_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monetary">Monetary Donation</SelectItem>
                    <SelectItem value="goods">Goods Donation</SelectItem>
                    <SelectItem value="blood">Blood Donation</SelectItem>
                    <SelectItem value="volunteer">Volunteer Time</SelectItem>
                    <SelectItem value="disaster_relief">Disaster Relief</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the type of support you are seeking.</FormDescription>
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
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Indicate how urgent this campaign is.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchCampaignType === "monetary" && (
          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} step={1} {...field} />
                </FormControl>
                <FormDescription>Set your fundraising goal in USD.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>When will your campaign begin?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < form.getValues("start_date")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When will your campaign end? (Leave blank for ongoing campaigns)</FormDescription>
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, State, Country" {...field} />
              </FormControl>
              <FormDescription>Where is this campaign located?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Campaign is active</FormLabel>
                <FormDescription>
                  When active, your campaign will be visible to the public and can receive donations.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_disaster_relief"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This is a disaster relief campaign</FormLabel>
                <FormDescription>Enable additional fields specific to disaster relief efforts.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {watchIsDisasterRelief && (
          <div className="space-y-6 rounded-md border p-6">
            <h3 className="text-lg font-medium">Disaster Relief Information</h3>

            <FormField
              control={form.control}
              name="disaster_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disaster Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Flood, Earthquake, Fire" {...field} />
                  </FormControl>
                  <FormDescription>What type of disaster are you responding to?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affected_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affected Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Specific region affected" {...field} />
                  </FormControl>
                  <FormDescription>Which specific area has been affected by this disaster?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Immediate Needs</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add an immediate need"
                  value={immediateNeed}
                  onChange={(e) => setImmediateNeed(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addImmediateNeed()
                    }
                  }}
                />
                <Button type="button" onClick={addImmediateNeed} size="sm">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add</span>
                </Button>
              </div>
              <FormDescription className="mt-2">
                List specific immediate needs for this disaster relief effort.
              </FormDescription>

              <div className="flex flex-wrap gap-2 mt-4">
                {form.getValues("immediate_needs")?.map((need, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                    {need}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeImmediateNeed(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Campaign"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
