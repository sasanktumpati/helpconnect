-- Add new columns to the donations table for recurring donations
ALTER TABLE IF EXISTS donations 
ADD COLUMN IF NOT EXISTS donor_name TEXT,
ADD COLUMN IF NOT EXISTS donor_email TEXT,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS frequency TEXT;

-- Create an index on campaign_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);

-- Create an index on donor_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
