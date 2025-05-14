import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding is not allowed in production" }, { status: 403 })
  }

  try {
    const result = await seedDatabase(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
