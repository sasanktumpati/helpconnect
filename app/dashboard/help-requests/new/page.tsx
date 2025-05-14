import { HelpRequestForm } from "@/components/help-requests/help-request-form"

export const metadata = {
  title: "Create Help Request | HelpConnect",
  description: "Create a new help request on HelpConnect",
}

export default function NewHelpRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Help Request</h1>
        <p className="text-muted-foreground">Request assistance from the community.</p>
      </div>
      <div className="border rounded-lg p-6">
        <HelpRequestForm />
      </div>
    </div>
  )
}
