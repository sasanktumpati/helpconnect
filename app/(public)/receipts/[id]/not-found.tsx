import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileX } from "lucide-react"

export default function ReceiptNotFound() {
  return (
    <div className="container max-w-md py-16 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Receipt Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The receipt you're looking for doesn't exist or may have been removed.
      </p>
      <div className="flex flex-col gap-2 w-full">
        <Button asChild>
          <Link href="/dashboard/donations">View Your Donations</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
