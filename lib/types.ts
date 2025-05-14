export type UserRole = "individual" | "ngo" | "organization"
export type CampaignType = "monetary" | "goods" | "blood" | "volunteer" | "disaster_relief"
export type UrgencyLevel = "low" | "medium" | "high" | "critical"
export type RequestStatus = "pending" | "in_progress" | "fulfilled"
export type DriveType = "environmental" | "community" | "health" | "emergency"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"
export type DonationFrequency = "weekly" | "monthly" | "quarterly" | "annually"
export type NotificationType = "donation" | "campaign" | "help_request" | "community_drive" | "system" | "profile"
export type ItemCondition = "new" | "like_new" | "good" | "fair" | "poor"
export type DonationItemCategory =
  | "clothing"
  | "food"
  | "furniture"
  | "electronics"
  | "toys"
  | "books"
  | "medical"
  | "household"
  | "school_supplies"
  | "other"

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  role: UserRole
  display_name: string
  bio?: string
  profile_image_url?: string
  location?: string
  blood_type?: string
  is_verified: boolean
  phone_number?: string
  notification_preferences: Record<string, any>

  // NGO and Organization specific fields
  organization_name?: string
  organization_type?: string
  year_established?: number
  registration_number?: string
  website?: string
  social_media?: Record<string, string>
  mission_statement?: string
  areas_of_focus?: string[]
  staff_count?: number
  volunteer_count?: number
  tax_exempt_status?: boolean
  profile_completed: boolean
  verification_documents?: string[]
}

export interface Campaign {
  id: string
  created_at: string
  updated_at: string
  creator_id: string
  title: string
  description: string
  campaign_type: CampaignType
  target_amount?: number
  current_amount?: number
  start_date: string
  end_date?: string
  location?: string
  is_disaster_relief: boolean
  disaster_type?: string
  affected_area?: string
  urgency_level?: UrgencyLevel
  immediate_needs?: string[]
  images?: string[]
  is_active: boolean
}

export interface InventoryItem {
  id: string
  created_at: string
  updated_at: string
  owner_id: string
  name: string
  description?: string
  category: string
  quantity: number
  min_threshold?: number
  location?: string
  is_available: boolean
  images?: string[]
  is_needed: boolean
}

export interface HelpRequest {
  id: string
  created_at: string
  updated_at: string
  requester_id: string
  title: string
  description: string
  request_type: string
  urgency_level: UrgencyLevel
  location?: string
  contact_info?: Record<string, any>
  status: RequestStatus
  images?: string[]
  is_active: boolean
}

export interface DonationItem {
  id: string
  created_at: string
  updated_at: string
  owner_id: string
  title: string
  description?: string
  condition: ItemCondition
  category: DonationItemCategory
  quantity: number
  is_available: boolean
  location?: string
  images?: string[]
  contact_email?: string
  contact_phone?: string
  contact_name?: string
  notes?: string
}

export interface CommunityDrive {
  id: string
  created_at: string
  updated_at: string
  organizer_id: string
  title: string
  description: string
  drive_type: DriveType
  start_date: string
  end_date?: string
  location: string
  participant_limit?: number
  current_participants: number
  images?: string[]
  is_active: boolean
}

export interface DriveParticipant {
  id: string
  drive_id: string
  user_id: string
  registered_at: string
  attended: boolean
}

export interface Donation {
  id: string
  created_at: string
  donor_id?: string
  campaign_id: string
  amount?: number
  is_anonymous: boolean
  message?: string
  payment_status: PaymentStatus
  payment_method?: string
  transaction_id?: string
  receipt_url?: string
  donor_name?: string
  donor_email?: string
  is_recurring?: boolean
  frequency?: DonationFrequency
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  data?: Record<string, any>
  created_at: string
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          campaign_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          affected_area: string | null
          campaign_type: CampaignType
          created_at: string
          creator_id: string
          current_amount: number | null
          description: string
          disaster_type: string | null
          end_date: string | null
          id: string
          immediate_needs: string[] | null
          is_active: boolean
          is_disaster_relief: boolean
          location: string | null
          start_date: string
          target_amount: number | null
          title: string
          updated_at: string
          urgency_level: UrgencyLevel | null
          images: string[] | null
        }
        Insert: {
          affected_area?: string | null
          campaign_type: CampaignType
          created_at?: string
          creator_id: string
          current_amount?: number | null
          description: string
          disaster_type?: string | null
          end_date?: string | null
          id?: string
          immediate_needs?: string[] | null
          is_active?: boolean
          is_disaster_relief: boolean
          location?: string | null
          start_date: string
          target_amount?: number | null
          title: string
          updated_at?: string
          urgency_level?: UrgencyLevel | null
          images?: string[] | null
        }
        Update: {
          affected_area?: string | null
          campaign_type?: CampaignType
          created_at?: string
          creator_id?: string
          current_amount?: number | null
          description?: string
          disaster_type?: string | null
          end_date?: string | null
          id?: string
          immediate_needs?: string[] | null
          is_active?: boolean
          is_disaster_relief?: boolean
          location?: string | null
          start_date?: string
          target_amount?: number | null
          title?: string
          updated_at?: string
          urgency_level?: UrgencyLevel | null
          images?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_drives: {
        Row: {
          created_at: string
          description: string
          drive_type: DriveType
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          organizer_id: string
          participant_limit: number | null
          start_date: string
          title: string
          updated_at: string
          current_participants: number
        }
        Insert: {
          created_at?: string
          description: string
          drive_type: DriveType
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          organizer_id: string
          participant_limit?: number | null
          start_date: string
          title: string
          updated_at?: string
          current_participants: number
        }
        Update: {
          created_at?: string
          description?: string
          drive_type?: DriveType
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          organizer_id?: string
          participant_limit?: number | null
          start_date?: string
          title?: string
          updated_at?: string
          current_participants?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_drives_organizer_id_fkey"
            columns: ["organizer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          owner_id: string
          title: string
          description: string | null
          condition: ItemCondition
          category: DonationItemCategory
          quantity: number
          is_available: boolean
          location: string | null
          images: string[] | null
          contact_email: string | null
          contact_phone: string | null
          contact_name: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_id: string
          title: string
          description?: string | null
          condition: ItemCondition
          category: DonationItemCategory
          quantity?: number
          is_available?: boolean
          location?: string | null
          images?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_name?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
          title?: string
          description?: string | null
          condition?: ItemCondition
          category?: DonationItemCategory
          quantity?: number
          is_available?: boolean
          location?: string | null
          images?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_name?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number | null
          campaign_id: string
          created_at: string
          donor_id: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          payment_method: string | null
          payment_status: PaymentStatus
          receipt_url: string | null
          transaction_id: string | null
          donor_name: string | null
          donor_email: string | null
          is_recurring: boolean | null
          frequency: string | null
        }
        Insert: {
          amount?: number | null
          campaign_id: string
          created_at?: string
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string | null
          payment_status: PaymentStatus
          receipt_url?: string | null
          transaction_id?: string | null
          donor_name?: string | null
          donor_email?: string | null
          is_recurring?: boolean | null
          frequency?: string | null
        }
        Update: {
          amount?: number | null
          campaign_id?: string
          created_at?: string
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string | null
          payment_status?: PaymentStatus
          receipt_url?: string | null
          transaction_id?: string | null
          donor_name?: string | null
          donor_email?: string | null
          is_recurring?: boolean | null
          frequency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      help_requests: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          requester_id: string
          request_type: string
          status: RequestStatus
          title: string
          updated_at: string
          urgency_level: UrgencyLevel
          contact_info: Json | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          requester_id: string
          request_type: string
          status: RequestStatus
          title: string
          updated_at?: string
          urgency_level: UrgencyLevel
          contact_info?: Json | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          requester_id?: string
          request_type?: string
          status?: RequestStatus
          title?: string
          updated_at?: string
          urgency_level?: UrgencyLevel
          contact_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "help_requests_creator_id_fkey"
            columns: ["requester_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_needed: boolean
          location: string | null
          min_threshold: number | null
          name: string
          owner_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_needed?: boolean
          location?: string | null
          min_threshold?: number | null
          name: string
          owner_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_needed?: boolean
          location?: string | null
          min_threshold?: number | null
          name?: string
          owner_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: NotificationType
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type: NotificationType
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: NotificationType
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          blood_type: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          is_verified: boolean
          location: string | null
          notification_preferences: Json | null
          phone_number: string | null
          profile_completed: boolean
          role: UserRole
          updated_at: string
          organization_name: string | null
          organization_type: string | null
          year_established: number | null
          registration_number: string | null
          website: string | null
          social_media: Json | null
          mission_statement: string | null
          areas_of_focus: string[] | null
          staff_count: number | null
          volunteer_count: number | null
          tax_exempt_status: boolean | null
          profile_image_url: string | null
          verification_documents: string[] | null
        }
        Insert: {
          bio?: string | null
          blood_type?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
          is_verified?: boolean
          location?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          profile_completed?: boolean
          role: UserRole
          updated_at?: string
          organization_name?: string | null
          organization_type?: string | null
          year_established?: number | null
          registration_number?: string | null
          website?: string | null
          social_media?: Json | null
          mission_statement?: string | null
          areas_of_focus?: string[] | null
          staff_count?: number | null
          volunteer_count?: number | null
          tax_exempt_status?: boolean | null
          profile_image_url?: string | null
          verification_documents?: string[] | null
        }
        Update: {
          bio?: string | null
          blood_type?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          is_verified?: boolean
          location?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          profile_completed?: boolean
          role?: UserRole
          updated_at?: string
          organization_name?: string | null
          organization_type?: string | null
          year_established?: number | null
          registration_number?: string | null
          website?: string | null
          social_media?: Json | null
          mission_statement?: string | null
          areas_of_focus?: string[] | null
          staff_count?: number | null
          volunteer_count?: number | null
          tax_exempt_status?: boolean | null
          profile_image_url?: string | null
          verification_documents?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_organization_donation_stats: {
        Args: {
          org_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      CampaignType: "monetary" | "goods" | "blood" | "volunteer" | "disaster_relief"
      DriveType: "environmental" | "community" | "health" | "emergency"
      PaymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded"
      RequestStatus: "pending" | "in_progress" | "fulfilled"
      UrgencyLevel: "low" | "medium" | "high" | "critical"
      UserRole: "individual" | "ngo" | "organization"
      DonationFrequency: "weekly" | "monthly" | "quarterly" | "annually"
      NotificationType: "donation" | "campaign" | "help_request" | "community_drive" | "system" | "profile"
      ItemCondition: "new" | "like_new" | "good" | "fair" | "poor"
      DonationItemCategory:
        | "clothing"
        | "food"
        | "furniture"
        | "electronics"
        | "toys"
        | "books"
        | "medical"
        | "household"
        | "school_supplies"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
