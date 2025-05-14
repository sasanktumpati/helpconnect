import { InventoryEditForm } from "@/components/inventory/inventory-edit-form"

interface EditInventoryItemPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: "Edit Inventory Item | HelpConnect",
  description: "Edit an inventory item on HelpConnect",
}

export default function EditInventoryItemPage({ params }: EditInventoryItemPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Inventory Item</h1>
        <p className="text-muted-foreground">Update the details of your inventory item.</p>
      </div>
      <div className="border rounded-lg p-6">
        <InventoryEditForm itemId={params.id} />
      </div>
    </div>
  )
}
