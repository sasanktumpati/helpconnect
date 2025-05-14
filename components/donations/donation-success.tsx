"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Download, Copy } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface DonationSuccessProps {
  transactionId: string
  amount: number
  campaignTitle: string
  campaignId: string
  paymentMethod: string
  date: string
  isRecurring?: boolean
  frequency?: string | null
  receiptUrl?: string
}

export function DonationSuccess({
  transactionId,
  amount,
  campaignTitle,
  campaignId,
  paymentMethod,
  date,
  isRecurring = false,
  frequency = null,
  receiptUrl,
}: DonationSuccessProps) {
  const [copying, setCopying] = useState(false)
  const { toast } = useToast()

  const copyTransactionId = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(transactionId)
      toast({
        title: "Copied!",
        description: "Transaction ID copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      })
    } finally {
      setCopying(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Thank You for Your Donation!</CardTitle>
        <CardDescription>Your contribution will make a real difference.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Amount:</span>
            <span className="text-sm font-bold">${amount.toFixed(2)}</span>
          </div>
          {isRecurring && frequency && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Frequency:</span>
              <span className="text-sm capitalize">{frequency}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Campaign:</span>
            <span className="text-sm">{campaignTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Transaction ID:</span>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">{transactionId}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTransactionId} disabled={copying}>
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy transaction ID</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Payment Method:</span>
            <span className="text-sm capitalize">{paymentMethod.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date:</span>
            <span className="text-sm">{date}</span>
          </div>
        </div>

        {isRecurring && (
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Recurring Donation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your {frequency} donation has been set up successfully. You can manage your recurring donations from your
              account dashboard.
            </p>
          </div>
        )}

        <p className="text-sm text-center text-muted-foreground">A receipt has been sent to your email address.</p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaignId}`}>Return to Campaign</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/donations">View Your Donations</Link>
        </Button>
        {receiptUrl && (
          <Button variant="ghost" asChild className="w-full">
            <Link href={receiptUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
