import { InventoryForm } from "@/components/inventory/inventory-form"

export const metadata = {
  title: "Add Inventory Item | HelpConnect",
  description: "Add a new inventory item to your HelpConnect account",
}

export default function NewInventoryItemPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Add Inventory Item</h1>
        <p className="text-muted-foreground">Create a new inventory item to track your resources.</p>
      </div>
      <div className="border rounded-lg p-6">
        <InventoryForm />
      </div>
    </div>
  )
}
