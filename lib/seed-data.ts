import { createClient } from "@supabase/supabase-js"
import type { CampaignType, DriveType, RequestStatus, UrgencyLevel, UserRole } from "./types"

// This is a utility script to seed the database with sample data
// It can be run from a server action or a separate script

export async function seedDatabase(supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Sample users
  const users = [
    {
      id: "user1",
      email: "john@example.com",
      display_name: "John Doe",
      role: "individual" as UserRole,
      bio: "I'm passionate about helping communities in need.",
      location: "New York, USA",
      blood_type: "O+",
      is_verified: true,
    },
    {
      id: "user2",
      email: "redcross@example.com",
      display_name: "Red Cross Local Chapter",
      role: "ngo" as UserRole,
      bio: "Official local chapter of the Red Cross organization.",
      location: "Boston, USA",
      is_verified: true,
    },
    {
      id: "user3",
      email: "community@example.com",
      display_name: "Community Helpers",
      role: "organization" as UserRole,
      bio: "A small organization dedicated to community service.",
      location: "Chicago, USA",
      is_verified: true,
    },
  ]

  // Sample campaigns
  const campaigns = [
    {
      id: "campaign1",
      creator_id: "user2",
      title: "Hurricane Relief Fund",
      description:
        "Support those affected by the recent hurricane. Funds will be used for emergency shelter, food, and medical supplies.",
      campaign_type: "monetary" as CampaignType,
      target_amount: 50000,
      current_amount: 27500,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Florida, USA",
      is_disaster_relief: true,
      disaster_type: "Hurricane",
      affected_area: "Coastal Florida",
      urgency_level: "high" as UrgencyLevel,
      immediate_needs: ["Water", "Food", "Shelter", "Medical Supplies"],
      is_active: true,
    },
    {
      id: "campaign2",
      creator_id: "user3",
      title: "Community Food Drive",
      description:
        "Help us collect non-perishable food items for local families in need. Drop-off locations available throughout the city.",
      campaign_type: "goods" as CampaignType,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Chicago, USA",
      is_disaster_relief: false,
      urgency_level: "medium" as UrgencyLevel,
      is_active: true,
    },
    {
      id: "campaign3",
      creator_id: "user2",
      title: "Emergency Blood Drive",
      description:
        "Critical shortage of blood supplies. Your donation can save lives. All blood types needed, especially O-negative.",
      campaign_type: "blood" as CampaignType,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Boston, USA",
      is_disaster_relief: false,
      urgency_level: "critical" as UrgencyLevel,
      is_active: true,
    },
  ]

  // Sample help requests
  const helpRequests = [
    {
      id: "request1",
      requester_id: "user1",
      title: "Need Temporary Housing",
      description:
        "Family of 4 displaced by flooding. Looking for temporary housing for 2-3 weeks while repairs are made to our home.",
      request_type: "disaster",
      urgency_level: "high" as UrgencyLevel,
      location: "Miami, Florida",
      status: "pending" as RequestStatus,
    },
    {
      id: "request2",
      requester_id: "user3",
      title: "Volunteers Needed for Cleanup",
      description:
        "Seeking volunteers to help with debris cleanup in the downtown area after the storm. Tools and safety equipment will be provided.",
      request_type: "community",
      urgency_level: "medium" as UrgencyLevel,
      location: "Chicago, USA",
      status: "in_progress" as RequestStatus,
    },
    {
      id: "request3",
      requester_id: "user1",
      title: "Medical Assistance Required",
      description:
        "Elderly neighbor needs transportation to medical appointments twice a week. Looking for volunteers with vehicles.",
      request_type: "medical",
      urgency_level: "medium" as UrgencyLevel,
      location: "New York, USA",
      status: "pending" as RequestStatus,
    },
  ]

  // Sample community drives
  const communityDrives = [
    {
      id: "drive1",
      organizer_id: "user3",
      title: "City Park Cleanup",
      description: "Join us for a day of cleaning and beautifying our local park. Bring gloves if you have them!",
      drive_type: "environmental" as DriveType,
      start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      location: "Central Park, Chicago",
      participant_limit: 50,
      current_participants: 12,
      is_active: true,
    },
    {
      id: "drive2",
      organizer_id: "user2",
      title: "Free Health Checkup Camp",
      description: "Free basic health checkups including blood pressure, glucose levels, and general consultation.",
      drive_type: "health" as DriveType,
      start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      location: "Community Center, Boston",
      participant_limit: 100,
      current_participants: 45,
      is_active: true,
    },
    {
      id: "drive3",
      organizer_id: "user1",
      title: "Neighborhood Watch Training",
      description:
        "Learn how to set up and participate in an effective neighborhood watch program to keep our community safe.",
      drive_type: "community" as DriveType,
      start_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      location: "Public Library, New York",
      participant_limit: 30,
      current_participants: 8,
      is_active: true,
    },
  ]

  // Insert data into tables
  try {
    // Insert users
    const { error: usersError } = await supabase.from("users").upsert(users)
    if (usersError) throw usersError

    // Insert campaigns
    const { error: campaignsError } = await supabase.from("campaigns").upsert(campaigns)
    if (campaignsError) throw campaignsError

    // Insert help requests
    const { error: requestsError } = await supabase.from("help_requests").upsert(helpRequests)
    if (requestsError) throw requestsError

    // Insert community drives
    const { error: drivesError } = await supabase.from("community_drives").upsert(communityDrives)
    if (drivesError) throw drivesError

    return { success: true, message: "Database seeded successfully" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
