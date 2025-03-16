/*
  # Add user exercise logs

  This migration adds the user_exercise_logs table to track individual exercise progress
  within workouts.

  1. New Tables
    - `user_exercise_logs`: Tracks individual exercise completion and metrics
      - `id` (uuid, primary key)
      - `user_workout_id` (uuid, references user_workouts)
      - `exercise_id` (uuid, references exercises)
      - `sets_completed` (integer)
      - `reps_completed` (integer)
      - `weight_used` (numeric)
      - `duration_seconds` (integer)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Insert their own exercise logs
      - Update their own exercise logs
      - View their own exercise logs
*/

-- Create user_exercise_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id uuid REFERENCES user_workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  sets_completed integer,
  reps_completed integer,
  weight_used numeric(5,2),
  duration_seconds integer,
  completed_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_exercise_logs' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE user_exercise_logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_exercise_logs' 
    AND policyname = 'Users can insert their own exercise logs'
  ) THEN
    CREATE POLICY "Users can insert their own exercise logs"
      ON user_exercise_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_workouts
          WHERE user_workouts.id = user_workout_id
          AND user_workouts.user_id = auth.uid()
        )
      );
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_exercise_logs' 
    AND policyname = 'Users can update their own exercise logs'
  ) THEN
    CREATE POLICY "Users can update their own exercise logs"
      ON user_exercise_logs
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_workouts
          WHERE user_workouts.id = user_workout_id
          AND user_workouts.user_id = auth.uid()
        )
      );
  END IF;

  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_exercise_logs' 
    AND policyname = 'Users can view their own exercise logs'
  ) THEN
    CREATE POLICY "Users can view their own exercise logs"
      ON user_exercise_logs
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_workouts
          WHERE user_workouts.id = user_workout_id
          AND user_workouts.user_id = auth.uid()
        )
      );
  END IF;
END $$;