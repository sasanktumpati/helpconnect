import { DonationItemForm } from "@/components/donation-items/donation-item-form"

export const metadata = {
  title: "Create Donation Item | HelpConnect",
  description: "Create a new donation item on HelpConnect",
}

export default function NewDonationItemPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Donation Item</h1>
        <p className="text-muted-foreground">List an item you want to donate to those in need.</p>
      </div>
      <div className="border rounded-lg p-6">
        <DonationItemForm />
      </div>
    </div>
  )
}
