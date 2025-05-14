"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import type { Campaign } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface DonateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign
}

const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
})

export function DonateDialog({ open, onOpenChange, campaign }: DonateDialogProps) {
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10,
      message: "",
      isAnonymous: false,
      paymentMethod: "credit_card",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      router.push(`/auth/login?redirect=/campaigns/${campaign.id}`)
      return
    }

    setIsSubmitting(true)

    try {
      // Call our donation API
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount: values.amount,
          message: values.message,
          isAnonymous: values.isAnonymous,
          paymentMethod: values.paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process donation")
      }

      setTransactionId(data.transactionId)
      setShowSuccess(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (showSuccess) {
      onOpenChange(false)
      setShowSuccess(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={showSuccess ? handleClose : onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Support this campaign</DialogTitle>
              <DialogDescription>Your donation will help fund {campaign.title}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} step={1} {...field} />
                      </FormControl>
                      <FormDescription>Enter the amount you wish to donate in USD.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="credit_card" />
                            </FormControl>
                            <FormLabel className="font-normal">Credit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paypal" />
                            </FormControl>
                            <FormLabel className="font-normal">PayPal</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank_transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">Bank Transfer</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Leave a message of support..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Donate anonymously</FormLabel>
                        <FormDescription>Your name will not be displayed publicly.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Donate Now"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Thank You!</DialogTitle>
              <DialogDescription>Your donation has been processed successfully.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="rounded-lg border p-4 mb-4">
                <p className="font-medium">Transaction Details:</p>
                <p className="text-sm text-muted-foreground mt-1">Transaction ID: {transactionId}</p>
                <p className="text-sm text-muted-foreground">Amount: ${form.getValues("amount")}</p>
                <p className="text-sm text-muted-foreground">
                  Payment Method: {form.getValues("paymentMethod").replace("_", " ")}
                </p>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                A receipt has been sent to your email address.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
