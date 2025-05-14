import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: campaigns } = await supabase.from("campaigns").select("id")
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ error: "No campaigns found to seed donations" }, { status: 400 })
    }

    const { data: users } = await supabase.from("users").select("id")
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found to seed donations" }, { status: 400 })
    }

    const donations = []
    const paymentMethods = ["credit_card", "paypal", "bank_transfer"]
    const paymentStatuses = ["success", "pending", "failed"]
    const messages = [
      "Keep up the great work!",
      "Happy to support this cause",
      "Thank you for making a difference",
      "Wishing you success with this campaign",
      "Hope this helps",
    ]

    const now = new Date()
    for (let i = 0; i < 50; i++) {
      const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomAmount = Math.floor(Math.random() * 1000) + 10
      const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      const randomStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      const randomDate = new Date(now)
      randomDate.setMonth(now.getMonth() - Math.floor(Math.random() * 6))
      randomDate.setDate(Math.floor(Math.random() * 28) + 1)

      donations.push({
        donor_id: randomUser.id,
        campaign_id: randomCampaign.id,
        amount: randomAmount,
        is_anonymous: Math.random() > 0.7,
        message: Math.random() > 0.3 ? randomMessage : null,
        payment_status: randomStatus,
        payment_method: randomMethod,
        transaction_id: `tx_${Math.random().toString(36).substring(2, 15)}`,
        receipt_url: `https://example.com/receipts/${Math.random().toString(36).substring(2, 10)}`,
        created_at: randomDate.toISOString(),
      })
    }

    const { data, error } = await supabase.from("donations").insert(donations).select()

    if (error) {
      console.error("Error seeding donations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: `Successfully seeded ${data.length} donations`,
      data,
    })
  } catch (error: any) {
    console.error("Error in donation seed route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
