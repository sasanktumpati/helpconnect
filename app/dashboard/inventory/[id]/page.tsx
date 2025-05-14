import { InventoryDetail } from "@/components/inventory/inventory-detail"

interface InventoryItemPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: "Inventory Item Details | HelpConnect",
  description: "View details of an inventory item on HelpConnect",
}

export default function InventoryItemPage({ params }: InventoryItemPageProps) {
  return (
    <div className="space-y-6">
      <InventoryDetail itemId={params.id} />
    </div>
  )
}
