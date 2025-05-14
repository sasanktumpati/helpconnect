"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import type { InventoryItem } from "@/lib/types"
import { AlertCircle, ArrowLeft, Edit, Package, Trash2, AlertTriangle, MapPin } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface InventoryDetailProps {
  itemId: string
}

export function InventoryDetail({ itemId }: InventoryDetailProps) {
  const { supabase, user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchInventoryItem = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("id", itemId)
          .eq("owner_id", user.id)
          .single()

        if (error) throw error
        setItem(data as InventoryItem)
      } catch (err: any) {
        setError(err.message || "Failed to load inventory item")
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryItem()
  }, [supabase, itemId, user])

  const handleDelete = async () => {
    if (!user) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("inventory_items").delete().eq("id", itemId).eq("owner_id", user.id)

      if (error) throw error

      toast({
        title: "Item deleted",
        description: "The inventory item has been deleted successfully.",
      })

      router.push("/dashboard/inventory")
      router.refresh()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete inventory item",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
        <div className="h-8 w-full bg-muted rounded animate-pulse" />
        <div className="h-24 w-full bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Inventory item not found"}.{" "}
          <Button variant="link" onClick={() => router.back()}>
            Go back
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const isBelowThreshold = item.min_threshold !== null && item.quantity < item.min_threshold
  const thresholdPercentage = item.min_threshold
    ? Math.min(Math.round((item.quantity / item.min_threshold) * 100), 100)
    : 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/dashboard/inventory/edit/${item.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the inventory item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="h-64 bg-muted">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={item.is_needed ? "destructive" : item.is_available ? "default" : "outline"}>
                  {item.is_needed ? "Needed" : item.is_available ? "Available" : "Unavailable"}
                </Badge>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>Added on {format(new Date(item.created_at), "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

              {item.location && (
                <div className="flex items-center mt-4">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{item.location}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>Detailed information about this inventory item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-bold">{item.quantity}</span>
                    {isBelowThreshold && (
                      <Badge variant="destructive" className="ml-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Below Threshold
                      </Badge>
                    )}
                  </div>
                </div>

                {item.min_threshold !== null && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Inventory Level</h3>
                      <span className="text-sm">{thresholdPercentage}%</span>
                    </div>
                    <Progress value={thresholdPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum threshold: {item.min_threshold} {isBelowThreshold && "(Low stock alert)"}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="mt-1">{item.is_available ? "Available" : "Unavailable"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p className="mt-1">{item.is_needed ? "Needed Item" : "Stocked Item"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="mt-1">{item.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="mt-1">{format(new Date(item.updated_at), "PPP")}</p>
                </div>
              </div>

              {isBelowThreshold && (
                <>
                  <Separator />
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Low Stock Warning</AlertTitle>
                    <AlertDescription>
                      This item is below the minimum threshold of {item.min_threshold}. Consider restocking soon.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
