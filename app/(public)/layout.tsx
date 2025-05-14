import type React from "react"
import { PublicHeader } from "@/components/public/public-header"
import { Footer } from "@/components/landing/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
