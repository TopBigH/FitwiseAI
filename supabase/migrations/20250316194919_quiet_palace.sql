/*
  # Add workout templates and exercises

  1. New Tables
    - `exercises`
      - Basic exercise information and metadata
    - `workout_exercises`
      - Junction table linking exercises to workouts
    - `workout_templates`
      - Predefined workout templates
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create exercise_category enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE exercise_category AS ENUM ('strength', 'cardio', 'flexibility', 'hiit', 'bodyweight');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create difficulty_level enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create muscle_group enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE muscle_group AS ENUM ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

-- Create workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty difficulty_level NOT NULL,
  duration_minutes integer NOT NULL,
  category exercise_category NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false
);

-- Create workout_exercises junction table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  sets integer,
  reps integer,
  duration_seconds integer,
  rest_seconds integer,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workout_id, exercise_id, order_index)
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Exercises are viewable by everyone"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workout templates are viewable by everyone"
  ON workout_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workout exercises are viewable by everyone"
  ON workout_exercises FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required) VALUES
  (
    'Barbell Squat',
    'A compound exercise that targets the entire lower body, particularly the quadriceps, hamstrings, and glutes.',
    'strength',
    ARRAY['legs', 'core']::muscle_group[],
    'intermediate',
    true
  ),
  (
    'Bench Press',
    'A fundamental upper body exercise that primarily targets the chest, shoulders, and triceps.',
    'strength',
    ARRAY['chest', 'shoulders', 'arms']::muscle_group[],
    'intermediate',
    true
  ),
  (
    'Deadlift',
    'A powerful compound movement that engages multiple muscle groups throughout the body.',
    'strength',
    ARRAY['back', 'legs', 'core']::muscle_group[],
    'advanced',
    true
  ),
  (
    'Push-ups',
    'A bodyweight exercise that builds upper body strength and stability.',
    'bodyweight',
    ARRAY['chest', 'shoulders', 'arms', 'core']::muscle_group[],
    'beginner',
    false
  );

-- Insert sample workout templates
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured) VALUES
  (
    'Full Body Power',
    'A comprehensive full-body workout designed to build strength and muscle endurance.',
    'intermediate',
    45,
    'strength',
    true
  ),
  (
    'HIIT Cardio Blast',
    'High-intensity interval training to boost cardiovascular fitness and burn calories.',
    'advanced',
    30,
    'hiit',
    true
  );

-- Link exercises to workouts
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  12,
  60,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Full Body Power'
AND e.name = 'Barbell Squat';

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  12,
  60,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Full Body Power'
AND e.name = 'Bench Press';

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  3,
  10,
  90,
  3
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Full Body Power'
AND e.name = 'Deadlift';