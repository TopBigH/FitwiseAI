/*
  # Add user workouts tracking

  This migration adds the user_workouts table if it doesn't exist and ensures policies
  are created only if they don't already exist.

  1. New Tables
    - `user_workouts`: Tracks workout sessions and progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workout_templates)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `progress_percentage` (integer)
      - `calories_burned` (integer)
      - `notes` (text)

  2. Security
    - Enable RLS on user_workouts table
    - Add policies for authenticated users to:
      - Insert their own workout progress
      - Update their own workout progress
      - View their own workout progress
*/

-- Create user_workouts table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  workout_id uuid REFERENCES workout_templates ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  calories_burned integer,
  notes text
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_workouts' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_workouts' 
    AND policyname = 'Users can insert their own workout progress'
  ) THEN
    CREATE POLICY "Users can insert their own workout progress"
      ON user_workouts
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_workouts' 
    AND policyname = 'Users can update their own workout progress'
  ) THEN
    CREATE POLICY "Users can update their own workout progress"
      ON user_workouts
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_workouts' 
    AND policyname = 'Users can view their own workout progress'
  ) THEN
    CREATE POLICY "Users can view their own workout progress"
      ON user_workouts
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;