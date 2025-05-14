"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CreditCard, Calendar, AlertCircle } from "lucide-react"
import { DonationSuccess } from "./donation-success"
import { AuthPrompt } from "@/components/auth/auth-prompt"
import { useSupabase } from "@/lib/supabase/provider"
import type { Campaign } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface DonationFormProps {
  campaign: Campaign
}

const oneTimeFormSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

const recurringFormSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  frequency: z.enum(["weekly", "monthly", "quarterly", "annually"]),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

export function DonationForm({ campaign }: DonationFormProps) {
  const { user, supabase, refreshSession, isRefreshing, lastRefreshed } = useSupabase()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [donationAmount, setDonationAmount] = useState(0)
  const [donationType, setDonationType] = useState<"one-time" | "recurring">("one-time")
  const [donationFrequency, setDonationFrequency] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Only refresh session before submission, not on component mount
  // This prevents unnecessary refreshes when just viewing the form
  const ensureSessionBeforeSubmit = async () => {
    if (!user) {
      setShowAuthPrompt(true)
      return false
    }

    // Only refresh if we haven't refreshed in the last 5 minutes
    if (!lastRefreshed || Date.now() - lastRefreshed > 5 * 60 * 1000) {
      await refreshSession()
    }
    return true
  }

  const oneTimeForm = useForm<z.infer<typeof oneTimeFormSchema>>({
    resolver: zodResolver(oneTimeFormSchema),
    defaultValues: {
      amount: 10,
      message: "",
      isAnonymous: false,
      paymentMethod: "credit_card",
      fullName: user?.user_metadata?.name || "",
      email: user?.email || "",
      agreeToTerms: false,
    },
  })

  const recurringForm = useForm<z.infer<typeof recurringFormSchema>>({
    resolver: zodResolver(recurringFormSchema),
    defaultValues: {
      amount: 10,
      frequency: "monthly",
      message: "",
      isAnonymous: false,
      paymentMethod: "credit_card",
      fullName: user?.user_metadata?.name || "",
      email: user?.email || "",
      agreeToTerms: false,
    },
  })

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      oneTimeForm.setValue("fullName", user.user_metadata?.name || "")
      oneTimeForm.setValue("email", user.email || "")
      recurringForm.setValue("fullName", user.user_metadata?.name || "")
      recurringForm.setValue("email", user.email || "")
    }
  }, [user, oneTimeForm, recurringForm])

  async function onSubmitOneTime(values: z.infer<typeof oneTimeFormSchema>) {
    const sessionValid = await ensureSessionBeforeSubmit()
    if (!sessionValid) return

    setIsSubmitting(true)
    setError(null)

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
          fullName: values.fullName,
          email: values.email,
          isRecurring: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process donation")
      }

      setTransactionId(data.transactionId)
      setReceiptUrl(data.receiptUrl || null)
      setDonationAmount(values.amount)
      setShowSuccess(true)

      toast({
        title: "Donation Successful",
        description: `Your donation of $${values.amount} was processed successfully.`,
        variant: "default",
      })
    } catch (error: any) {
      console.error("Donation error:", error)
      setError(error.message || "Failed to process donation. Please try again.")

      toast({
        title: "Donation Failed",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSubmitRecurring(values: z.infer<typeof recurringFormSchema>) {
    const sessionValid = await ensureSessionBeforeSubmit()
    if (!sessionValid) return

    setIsSubmitting(true)
    setError(null)

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
          fullName: values.fullName,
          email: values.email,
          isRecurring: true,
          frequency: values.frequency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process donation")
      }

      setTransactionId(data.transactionId)
      setReceiptUrl(data.receiptUrl || null)
      setDonationAmount(values.amount)
      setDonationFrequency(values.frequency)
      setShowSuccess(true)

      toast({
        title: "Recurring Donation Set Up",
        description: `Your ${values.frequency} donation of $${values.amount} was set up successfully.`,
        variant: "default",
      })
    } catch (error: any) {
      console.error("Donation error:", error)
      setError(error.message || "Failed to process donation. Please try again.")

      toast({
        title: "Donation Failed",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess && transactionId) {
    return (
      <DonationSuccess
        transactionId={transactionId}
        amount={donationAmount}
        campaignTitle={campaign.title}
        campaignId={campaign.id}
        paymentMethod={
          donationType === "one-time"
            ? oneTimeForm.getValues("paymentMethod")
            : recurringForm.getValues("paymentMethod")
        }
        date={new Date().toLocaleDateString()}
        isRecurring={donationType === "recurring"}
        frequency={donationFrequency}
        receiptUrl={receiptUrl || undefined}
      />
    )
  }

  const suggestedAmounts = [10, 25, 50, 100]

  return (
    <>
      <AuthPrompt
        open={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        message="You need to be signed in to make a donation."
        redirectUrl={`/campaigns/${campaign.id}`}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="one-time" onValueChange={(value) => setDonationType(value as "one-time" | "recurring")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="one-time">One-time Donation</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Donation</TabsTrigger>
        </TabsList>

        <TabsContent value="one-time">
          <Form {...oneTimeForm}>
            <form onSubmit={oneTimeForm.handleSubmit(onSubmitOneTime)} className="space-y-6">
              {/* Form content remains the same */}
              <FormField
                control={oneTimeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount ($)</FormLabel>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        {suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={field.value === amount ? "default" : "outline"}
                            onClick={() => oneTimeForm.setValue("amount", amount)}
                            className="h-12"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <FormControl>
                        <Input type="number" min={1} step={1} {...field} />
                      </FormControl>
                    </div>
                    <FormDescription>Enter the amount you wish to donate in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={oneTimeForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={oneTimeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <FormField
                    control={oneTimeForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <FormLabel className="font-normal">Credit Card</FormLabel>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="h-5 w-5 text-[#00457C]"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .76-.642h6.649c2.123 0 3.846.414 5.126 1.228 1.24.79 1.861 1.972 1.861 3.556 0 .74-.152 1.431-.455 2.066a5.142 5.142 0 0 1-1.292 1.597c-.563.467-1.258.86-2.071 1.17-.814.311-1.715.467-2.701.467h-4.05a.77.77 0 0 0-.76.642l-1.38 8.784a.641.641 0 0 1-.633.74h-.002v-.001zm7.861-12.252c0-.686-.276-1.228-.814-1.636-.538-.394-1.302-.598-2.29-.598h-3.95l-1.227 7.798h3.95c.767 0 1.43-.098 1.982-.288a3.325 3.325 0 0 0 1.38-.844c.371-.371.634-.824.802-1.347.168-.523.252-1.131.252-1.808l-.085-1.277z" />
                                  <path d="M22.8 12.917c0 .72-.15 1.389-.439 2.003a4.97 4.97 0 0 1-1.258 1.554c-.544.435-1.211.79-1.982 1.066-.771.276-1.636.414-2.58.414h-4.05a.77.77 0 0 0-.76.642l-1.38 8.76a.641.641 0 0 1-.633.74H5.31a.641.641 0 0 1-.633-.74l.236-1.518 1.105-7.023.04-.219a.77.77 0 0 1 .76-.642h4.05c.767 0 1.43-.098 1.982-.288a3.325 3.325 0 0 0 1.38-.844c.371-.371.634-.824.802-1.347.168-.523.252-1.131.252-1.808l-.085-1.277z" />
                                </svg>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="bank_transfer" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="h-5 w-5 text-muted-foreground"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 5H21V19H3V5Z"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path d="M3 9H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M3 15H7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M11 15H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <FormLabel className="font-normal">Bank Transfer</FormLabel>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <FormField
                control={oneTimeForm.control}
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

              <div className="space-y-4">
                <FormField
                  control={oneTimeForm.control}
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

                <FormField
                  control={oneTimeForm.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions</FormLabel>
                        <FormDescription>
                          By donating, you agree to our terms of service and privacy policy.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || isRefreshing}>
                {isSubmitting || isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRefreshing ? "Preparing..." : "Processing..."}
                  </>
                ) : (
                  "Donate Now"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="recurring">
          <Form {...recurringForm}>
            <form onSubmit={recurringForm.handleSubmit(onSubmitRecurring)} className="space-y-6">
              {/* Recurring form content remains the same */}
              <FormField
                control={recurringForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount ($)</FormLabel>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        {suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={field.value === amount ? "default" : "outline"}
                            onClick={() => recurringForm.setValue("amount", amount)}
                            className="h-12"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <FormControl>
                        <Input type="number" min={1} step={1} {...field} />
                      </FormControl>
                    </div>
                    <FormDescription>Enter the amount you wish to donate in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={recurringForm.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often would you like to donate?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={recurringForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={recurringForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <FormField
                    control={recurringForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <FormLabel className="font-normal">Credit Card</FormLabel>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="h-5 w-5 text-[#00457C]"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .76-.642h6.649c2.123 0 3.846.414 5.126 1.228 1.24.79 1.861 1.972 1.861 3.556 0 .74-.152 1.431-.455 2.066a5.142 5.142 0 0 1-1.292 1.597c-.563.467-1.258.86-2.071 1.17-.814.311-1.715.467-2.701.467h-4.05a.77.77 0 0 0-.76.642l-1.38 8.784a.641.641 0 0 1-.633.74h-.002v-.001zm7.861-12.252c0-.686-.276-1.228-.814-1.636-.538-.394-1.302-.598-2.29-.598h-3.95l-1.227 7.798h3.95c.767 0 1.43-.098 1.982-.288a3.325 3.325 0 0 0 1.38-.844c.371-.371.634-.824.802-1.347.168-.523.252-1.131.252-1.808l-.085-1.277z" />
                                  <path d="M22.8 12.917c0 .72-.15 1.389-.439 2.003a4.97 4.97 0 0 1-1.258 1.554c-.544.435-1.211.79-1.982 1.066-.771.276-1.636.414-2.58.414h-4.05a.77.77 0 0 0-.76.642l-1.38 8.76a.641.641 0 0 1-.633.74H5.31a.641.641 0 0 1-.633-.74l.236-1.518 1.105-7.023.04-.219a.77.77 0 0 1 .76-.642h4.05c.767 0 1.43-.098 1.982-.288a3.325 3.325 0 0 0 1.38-.844c.371-.371.634-.824.802-1.347.168-.523.252-1.131.252-1.808l-.085-1.277z" />
                                </svg>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <RadioGroupItem value="bank_transfer" />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="h-5 w-5 text-muted-foreground"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 5H21V19H3V5Z"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path d="M3 9H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M3 15H7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M11 15H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <FormLabel className="font-normal">Bank Transfer</FormLabel>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Recurring Donation Information</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your donation will be automatically processed on the same date each{" "}
                  {recurringForm.watch("frequency") === "weekly"
                    ? "week"
                    : recurringForm.watch("frequency") === "monthly"
                      ? "month"
                      : recurringForm.watch("frequency") === "quarterly"
                        ? "quarter"
                        : "year"}
                  . You can cancel or modify your recurring donation at any time from your account dashboard.
                </p>
              </div>

              <FormField
                control={recurringForm.control}
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

              <div className="space-y-4">
                <FormField
                  control={recurringForm.control}
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

                <FormField
                  control={recurringForm.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions</FormLabel>
                        <FormDescription>
                          By donating, you agree to our terms of service and privacy policy.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || isRefreshing}>
                {isSubmitting || isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRefreshing ? "Preparing..." : "Set Up Recurring Donation"}
                  </>
                ) : (
                  "Set Up Recurring Donation"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  )
}
