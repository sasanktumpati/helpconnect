"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReceiptActions() {
  return (
    <Button variant="outline" className="w-full" onClick={() => window.print()}>
      <Download className="mr-2 h-4 w-4" />
      Print Receipt
    </Button>
  )
}
