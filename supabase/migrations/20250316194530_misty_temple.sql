/*
  # Add exercises and workout exercises tables

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (exercise_category)
      - `muscle_groups` (muscle_group[])
      - `difficulty` (difficulty_level)
      - `equipment_required` (boolean)
      - `demo_video_url` (text)
      - `created_at` (timestamp)
    
    - `workout_exercises`
      - `id` (uuid, primary key)
      - `workout_id` (uuid, references workout_templates)
      - `exercise_id` (uuid, references exercises)
      - `sets` (integer)
      - `reps` (integer)
      - `duration_seconds` (integer)
      - `rest_seconds` (integer)
      - `order_index` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category exercise_category NOT NULL,
  muscle_groups muscle_group[] NOT NULL,
  difficulty difficulty_level NOT NULL,
  equipment_required boolean DEFAULT false,
  demo_video_url text,
  created_at timestamptz DEFAULT now()
);

-- Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workout_templates ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises ON DELETE CASCADE NOT NULL,
  sets integer,
  reps integer,
  duration_seconds integer,
  rest_seconds integer DEFAULT 60,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workout_id, exercise_id, order_index)
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON exercises;
  DROP POLICY IF EXISTS "Workout exercises are viewable by everyone" ON workout_exercises;
END $$;

-- Policies for exercises
CREATE POLICY "Exercises are viewable by everyone"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for workout_exercises
CREATE POLICY "Workout exercises are viewable by everyone"
  ON workout_exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty) VALUES
  (
    'Barbell Squat',
    'A compound exercise that targets the entire lower body and core.',
    'strength',
    ARRAY['legs', 'core']::muscle_group[],
    'intermediate'
  ),
  (
    'Bench Press',
    'A fundamental upper body exercise for chest, shoulders, and triceps.',
    'strength',
    ARRAY['chest', 'shoulders', 'arms']::muscle_group[],
    'intermediate'
  ),
  (
    'Deadlift',
    'A powerful compound movement that works the entire posterior chain.',
    'strength',
    ARRAY['back', 'legs', 'core']::muscle_group[],
    'advanced'
  ),
  (
    'Pull-ups',
    'An upper body exercise that primarily targets the back and biceps.',
    'strength',
    ARRAY['back', 'arms']::muscle_group[],
    'intermediate'
  );

-- Connect exercises to workouts
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id as workout_id,
  e.id as exercise_id,
  4 as sets,
  12 as reps,
  90 as rest_seconds,
  row_number() OVER () as order_index
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Full Body Power'
  AND e.name IN ('Barbell Squat', 'Bench Press', 'Deadlift', 'Pull-ups');