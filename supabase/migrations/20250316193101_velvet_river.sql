/*
  # Workout Tracking Schema

  1. New Tables
    - `user_workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workout_templates)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `progress_percentage` (integer)
      - `calories_burned` (integer)
      - `notes` (text)

    - `user_exercise_logs`
      - `id` (uuid, primary key)
      - `user_workout_id` (uuid, references user_workouts)
      - `exercise_id` (uuid, references exercises)
      - `sets_completed` (integer)
      - `reps_completed` (integer)
      - `weight_used` (numeric)
      - `duration_seconds` (integer)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
*/

-- Create user_workouts table
CREATE TABLE IF NOT EXISTS user_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  workout_id uuid REFERENCES workout_templates NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  calories_burned integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create user_exercise_logs table
CREATE TABLE IF NOT EXISTS user_exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id uuid REFERENCES user_workouts ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises NOT NULL,
  sets_completed integer,
  reps_completed integer,
  weight_used numeric(5,2),
  duration_seconds integer,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_logs ENABLE ROW LEVEL SECURITY;

-- Policies for user_workouts
CREATE POLICY "Users can insert their own workout progress"
  ON user_workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workout progress"
  ON user_workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout progress"
  ON user_workouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_exercise_logs
CREATE POLICY "Users can insert their own exercise logs"
  ON user_exercise_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_workouts
    WHERE user_workouts.id = user_workout_id
    AND user_workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own exercise logs"
  ON user_exercise_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_workouts
    WHERE user_workouts.id = user_workout_id
    AND user_workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own exercise logs"
  ON user_exercise_logs
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_workouts
    WHERE user_workouts.id = user_workout_id
    AND user_workouts.user_id = auth.uid()
  ));