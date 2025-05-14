-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own notifications
CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for service role to insert notifications
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
