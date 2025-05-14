import { createClient } from "@/lib/supabase/client"
import type {
  Campaign,
  CommunityDrive,
  Donation,
  DonationItem,
  HelpRequest,
  InventoryItem,
  Notification,
  User,
} from "../types"

// Helper to get a Supabase instance
const getSupabase = () => createClient()

// ——————————————————————————————
// User functions
// ——————————————————————————————

export async function getUserProfile(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from<User>("users").select("*").eq("id", userId).single()
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, userData: Partial<User>) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from<User>("users").update(userData).eq("id", userId).select().single()
  if (error) throw error
  return data
}

export async function createUserProfile(userData: Partial<User>) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from<User>("users").insert(userData).select().single()
  if (error) throw error
  return data
}

export async function checkUserExists(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from<{ id: string }>("users").select("id").eq("id", userId).single()
  // PGRST116 means "no rows"
  if (error && (error.code === "PGRST116" || error.message.match(/got no rows/))) {
    return false
  }
  if (error) throw error
  return !!data
}

// ——————————————————————————————
// Campaigns
// ——————————————————————————————

export async function getCampaigns(limit = 10, page = 0, filters?: Partial<Campaign>) {
  const supabase = getSupabase()
  let query = supabase
    .from<Campaign>("campaigns")
    .select("*, users!inner(display_name, profile_image_url, is_verified)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getCampaignById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<Campaign>("campaigns")
    .select("*, users!inner(display_name, profile_image_url, is_verified)")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function createCampaign(campaignData: Partial<Campaign>) {
  const supabase = getSupabase()
  const userExists = await checkUserExists(campaignData.creator_id!)
  if (!userExists) {
    throw new Error("User does not exist. Please complete your profile before creating a campaign.")
  }
  const { data, error } = await supabase.from<Campaign>("campaigns").insert(campaignData).select().single()
  if (error) throw error
  return data
}

// ——————————————————————————————
// Help Requests
// ——————————————————————————————

export async function getHelpRequests(limit = 10, page = 0, filters?: Partial<HelpRequest>) {
  const supabase = getSupabase()
  let query = supabase
    .from<HelpRequest>("help_requests")
    .select("*, users!inner(display_name, profile_image_url, is_verified)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getHelpRequestById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<HelpRequest>("help_requests")
    .select("*, users!inner(display_name, profile_image_url, is_verified)")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function getUserHelpRequests(userId: string, limit = 10, page = 0) {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from<HelpRequest>("help_requests")
    .select("*", { count: "exact" })
    .eq("requester_id", userId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  if (error) throw error
  return { data, count }
}

export async function createHelpRequest(requestData: Partial<HelpRequest>) {
  const supabase = getSupabase()
  const userExists = await checkUserExists(requestData.requester_id!)
  if (!userExists) {
    throw new Error("User does not exist. Please complete your profile before creating a help request.")
  }
  const { data, error } = await supabase.from<HelpRequest>("help_requests").insert(requestData).select().single()
  if (error) throw error
  return data
}

export async function updateHelpRequest(id: string, requestData: Partial<HelpRequest>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<HelpRequest>("help_requests")
    .update(requestData)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteHelpRequest(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from<HelpRequest>("help_requests").delete().eq("id", id)
  if (error) throw error
  return true
}

// ——————————————————————————————
// Donation Items
// ——————————————————————————————

export async function getDonationItems(limit = 10, page = 0, filters?: Partial<DonationItem>) {
  const supabase = getSupabase()
  let query = supabase
    .from<DonationItem>("donation_items")
    .select("*, users!inner(display_name, profile_image_url, is_verified)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getDonationItemById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<DonationItem>("donation_items")
    .select("*, users!inner(display_name, profile_image_url, is_verified)")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function getUserDonationItems(userId: string, limit = 10, page = 0) {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from<DonationItem>("donation_items")
    .select("*", { count: "exact" })
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  if (error) throw error
  return { data, count }
}

export async function createDonationItem(itemData: Partial<DonationItem>) {
  const supabase = getSupabase()
  const userExists = await checkUserExists(itemData.owner_id!)
  if (!userExists) {
    throw new Error("User does not exist. Please complete your profile before creating a donation item.")
  }
  const { data, error } = await supabase.from<DonationItem>("donation_items").insert(itemData).select().single()
  if (error) throw error
  return data
}

export async function updateDonationItem(id: string, itemData: Partial<DonationItem>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<DonationItem>("donation_items")
    .update(itemData)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDonationItem(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from<DonationItem>("donation_items").delete().eq("id", id)
  if (error) throw error
  return true
}

// ——————————————————————————————
// Community Drives
// ——————————————————————————————

export async function getCommunityDrives(limit = 10, page = 0, filters?: Partial<CommunityDrive>) {
  const supabase = getSupabase()
  let query = supabase
    .from<CommunityDrive>("community_drives")
    .select("*, users!inner(display_name, profile_image_url, is_verified)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function createCommunityDrive(driveData: Partial<CommunityDrive>) {
  const supabase = getSupabase()
  const userExists = await checkUserExists(driveData.organizer_id!)
  if (!userExists) {
    throw new Error("User does not exist. Please complete your profile before creating a community drive.")
  }
  const { data, error } = await supabase.from<CommunityDrive>("community_drives").insert(driveData).select().single()
  if (error) throw error
  return data
}

// ——————————————————————————————
// Inventory Items
// ——————————————————————————————

export async function getInventoryItems(limit = 10, page = 0, filters?: Partial<InventoryItem>) {
  const supabase = getSupabase()
  let query = supabase
    .from<InventoryItem>("inventory_items")
    .select("*, users!inner(display_name, profile_image_url, is_verified)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function createInventoryItem(itemData: Partial<InventoryItem>) {
  const supabase = getSupabase()
  const userExists = await checkUserExists(itemData.owner_id!)
  if (!userExists) {
    throw new Error("User does not exist. Please complete your profile before creating an inventory item.")
  }
  const { data, error } = await supabase.from<InventoryItem>("inventory_items").insert(itemData).select().single()
  if (error) throw error
  return data
}

// ——————————————————————————————
// Notifications
// ——————————————————————————————

export async function getUserNotifications(userId: string, limit = 10, page = 0) {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from<Notification>("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  if (error) throw error
  return { data, count }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<Notification>("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ——————————————————————————————
// Donations & Stats
// ——————————————————————————————

export async function getDonations(
  limit = 10,
  offset = 0,
  filters: Record<string, any> = {},
): Promise<{ data: Donation[] | null; error: any }> {
  try {
    const supabase = createClient()

    let query = supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    const { data, error } = await query

    if (error) {
      console.error("Supabase error in getDonations:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getDonations:", error)
    return { data: null, error }
  }
}

export async function getUserDonations(userId: string, limit = 10, page = 0) {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from<Donation>("donations")
    .select("*, campaigns(*)", { count: "exact" })
    .eq("donor_id", userId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  if (error) throw error
  return { data, count }
}

export async function createDonation(donationData: Partial<Donation>) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from<Donation>("donations").insert(donationData).select().single()
  if (error) throw error
  return data
}

export async function getOrganizations(limit = 10, page = 0, filters?: { role?: string; search?: string }) {
  const supabase = getSupabase()
  let query = supabase
    .from<User>("users")
    .select("*", { count: "exact" })
    .in("role", ["ngo", "organization"])
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role)
  }
  if (filters?.search) {
    query = query.or(`organization_name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getOrganizationById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<User>("users")
    .select("*")
    .eq("id", id)
    .in("role", ["ngo", "organization"])
    .single()
  if (error) throw error
  return data
}

export async function getOrganizationCampaigns(organizationId: string, limit = 3) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from<Campaign>("campaigns")
    .select("*")
    .eq("creator_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getDonationStats(organizationId?: string) {
  const supabase = getSupabase()
  let rpc = supabase.rpc("get_donation_stats")
  if (organizationId) {
    rpc = supabase.rpc("get_organization_donation_stats", {
      org_id: organizationId,
    })
  }
  const { data, error } = await rpc
  if (error) {
    console.error("Error fetching donation stats:", error)
    return {
      total_donations: 0,
      total_amount: 0,
      avg_donation: 0,
      donation_count_by_month: [],
    }
  }
  return data
}
