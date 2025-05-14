import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <AlertTriangle className="h-12 w-12 text-[#1249BF]" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/campaigns">Browse Campaigns</Link>
        </Button>
      </div>
    </div>
  )
}
