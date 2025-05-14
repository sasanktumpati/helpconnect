import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { PaymentStatus } from "@/lib/types"
import { createNotification } from "@/lib/utils/notification-utils"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      campaignId,
      amount,
      message,
      isAnonymous,
      paymentMethod,
      fullName,
      email,
      isRecurring = false,
      frequency = null,
    } = body

    if (!campaignId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation data" }, { status: 400 })
    }

    const transactionId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    const receiptUrl = `/receipts/${transactionId}`

    const donationData = {
      campaign_id: campaignId,
      donor_id: isAnonymous ? null : session.user.id,
      amount,
      message: message || null,
      is_anonymous: isAnonymous,
      payment_status: "completed" as PaymentStatus,
      payment_method: paymentMethod || "credit_card",
      transaction_id: transactionId,
      receipt_url: receiptUrl,
      donor_name: isAnonymous ? null : fullName || session.user.user_metadata?.name,
      donor_email: isAnonymous ? null : email || session.user.email,
      is_recurring: isRecurring,
      frequency: isRecurring ? frequency : null,
      created_at: new Date().toISOString(),
    }

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert(donationData)
      .select()
      .single()

    if (donationError) {
      console.error("Donation error:", donationError)
      return NextResponse.json({ error: donationError.message }, { status: 500 })
    }

    const { data: campaign, error: campaignFetchError } = await supabase
      .from("campaigns")
      .select("current_amount, creator_id, title")
      .eq("id", campaignId)
      .single()

    if (campaignFetchError) {
      console.error("Campaign fetch error:", campaignFetchError)
      return NextResponse.json({ error: campaignFetchError.message }, { status: 500 })
    }

    const { error: campaignUpdateError } = await supabase
      .from("campaigns")
      .update({
        current_amount: (campaign.current_amount || 0) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId)

    if (campaignUpdateError) {
      console.error("Campaign update error:", campaignUpdateError)
      return NextResponse.json({ error: campaignUpdateError.message }, { status: 500 })
    }

    if (campaign) {
      try {
        await createNotification({
          supabase,
          userId: campaign.creator_id,
          type: "donation",
          title: "New Donation Received",
          message: `${isAnonymous ? "Anonymous donor" : fullName || "Someone"} donated $${amount} to your campaign "${
            campaign.title
          }"${isRecurring ? ` (${frequency} recurring)` : ""}`,
          data: {
            campaign_id: campaignId,
            donation_id: donation.id,
            amount,
            is_recurring: isRecurring,
            transaction_id: transactionId,
          },
        })
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError)
      }
    }

    if (!isAnonymous) {
      try {
        await createNotification({
          supabase,
          userId: session.user.id,
          type: "donation",
          title: "Donation Successful",
          message: `Your ${isRecurring ? `${frequency} recurring ` : ""}donation of $${amount} to "${
            campaign.title
          }" was successful.`,
          data: {
            campaign_id: campaignId,
            donation_id: donation.id,
            amount,
            is_recurring: isRecurring,
            receipt_url: receiptUrl,
            transaction_id: transactionId,
          },
        })
      } catch (notificationError) {
        console.error("Failed to create donor notification:", notificationError)
      }
    }

    return NextResponse.json({
      success: true,
      donation,
      transactionId,
      receiptUrl,
      message: "Donation processed successfully",
    })
  } catch (error: any) {
    console.error("Donation API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
