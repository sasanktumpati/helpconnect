"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Info, Plus, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DashboardDonationItemsHeaderProps {
  totalItems: number
  availableItems: number
  unavailableItems: number
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}

export function DashboardDonationItemsHeader({
  totalItems,
  availableItems,
  unavailableItems,
  contactName,
  contactEmail,
  contactPhone,
}: DashboardDonationItemsHeaderProps) {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Donation Items</h1>
          <p className="text-muted-foreground">Manage items you've listed for donation</p>
        </div>
        <div className="flex items-center gap-2">
          <PopoverVisibilityInfo />
          <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
            <Link href="/dashboard/donation-items/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-muted/40">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <StatusBadge label="Total Items" count={totalItems} variant="outline" />
              <StatusBadge
                label="Visible"
                count={availableItems}
                variant="default"
                icon={<Eye className="h-3 w-3 mr-1" />}
              />
              <StatusBadge
                label="Hidden"
                count={unavailableItems}
                variant="secondary"
                icon={<EyeOff className="h-3 w-3 mr-1" />}
              />
            </div>

            <ContactInfoDisplay contactName={contactName} contactEmail={contactEmail} contactPhone={contactPhone} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">
            All Items
            <Badge variant="outline" className="ml-2">
              {totalItems}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="visible">
            Visible
            <Badge variant="outline" className="ml-2">
              {availableItems}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="hidden">
            Hidden
            <Badge variant="outline" className="ml-2">
              {unavailableItems}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

function StatusBadge({
  label,
  count,
  variant = "default",
  icon,
}: {
  label: string
  count: number
  variant?: "default" | "secondary" | "outline" | "destructive"
  icon?: React.ReactNode
}) {
  return (
    <Badge variant={variant} className="px-3 py-1 h-auto text-xs">
      {icon}
      {label}: <span className="font-bold ml-1">{count}</span>
    </Badge>
  )
}

function ContactInfoDisplay({
  contactName,
  contactEmail,
  contactPhone,
}: {
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}) {
  if (!contactName && !contactEmail && !contactPhone) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Set up your default contact information</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Contact Info</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-medium">Default Contact Information</h4>
          <p className="text-sm text-muted-foreground">
            This information will be shown to users interested in your donations.
          </p>
          <div className="grid gap-1 pt-2">
            {contactName && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Name:</span>
                <span>{contactName}</span>
              </div>
            )}
            {contactEmail && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Email:</span>
                <span>{contactEmail}</span>
              </div>
            )}
            {contactPhone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Phone:</span>
                <span>{contactPhone}</span>
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button size="sm" variant="outline" asChild className="w-full">
              <Link href="/dashboard/profile">Edit Contact Info</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PopoverVisibilityInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Item Visibility</h4>
          <p className="text-sm text-muted-foreground">
            Items marked as "Visible" can be seen by other users browsing the donation items section.
          </p>
          <div className="grid gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm">Visible items are actively listed for donation</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Hidden items are not shown to other users</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
