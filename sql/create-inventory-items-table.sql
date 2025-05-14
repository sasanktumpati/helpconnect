-- Create inventory_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_threshold INTEGER,
  location TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_needed BOOLEAN NOT NULL DEFAULT FALSE,
  images TEXT[]
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS inventory_items_owner_id_idx ON inventory_items(owner_id);
CREATE INDEX IF NOT EXISTS inventory_items_category_idx ON inventory_items(category);

-- Create function to get min threshold for an item
CREATE OR REPLACE FUNCTION get_min_threshold(item_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT min_threshold FROM inventory_items WHERE id = item_id);
END;
$$ LANGUAGE plpgsql;

-- Add comment to table
COMMENT ON TABLE inventory_items IS 'Table for storing inventory items';
