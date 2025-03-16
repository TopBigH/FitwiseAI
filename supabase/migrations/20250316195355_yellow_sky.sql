/*
  # Complete GymBuddy Database Schema

  This migration creates the entire database schema for the GymBuddy application.

  1. Enums
    - exercise_category: Types of exercises (strength, cardio, etc.)
    - difficulty_level: Workout difficulty levels
    - muscle_group: Primary muscle groups targeted

  2. Tables
    - exercises: Exercise library
    - workout_templates: Workout program templates
    - workout_exercises: Junction table linking exercises to workouts
    - user_workouts: User's workout sessions
    - user_exercise_logs: Individual exercise tracking within workouts

  3. Security
    - RLS enabled on all tables
    - Appropriate policies for data access
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE exercise_category AS ENUM ('strength', 'cardio', 'flexibility', 'hiit', 'bodyweight');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

-- Create user_workouts table
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

-- Create user_exercise_logs table
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

-- Enable RLS on all tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'exercises' AND rowsecurity = true) THEN
    ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_templates' AND rowsecurity = true) THEN
    ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_exercises' AND rowsecurity = true) THEN
    ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_workouts' AND rowsecurity = true) THEN
    ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_exercise_logs' AND rowsecurity = true) THEN
    ALTER TABLE user_exercise_logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies
DO $$ 
BEGIN
  -- Exercises policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'exercises' AND policyname = 'Exercises are viewable by everyone') THEN
    CREATE POLICY "Exercises are viewable by everyone" ON exercises FOR SELECT TO authenticated USING (true);
  END IF;

  -- Workout templates policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'workout_templates' AND policyname = 'Workout templates are viewable by everyone') THEN
    CREATE POLICY "Workout templates are viewable by everyone" ON workout_templates FOR SELECT TO authenticated USING (true);
  END IF;

  -- Workout exercises policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'workout_exercises' AND policyname = 'Workout exercises are viewable by everyone') THEN
    CREATE POLICY "Workout exercises are viewable by everyone" ON workout_exercises FOR SELECT TO authenticated USING (true);
  END IF;

  -- User workouts policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_workouts' AND policyname = 'Users can insert their own workout progress') THEN
    CREATE POLICY "Users can insert their own workout progress" ON user_workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_workouts' AND policyname = 'Users can update their own workout progress') THEN
    CREATE POLICY "Users can update their own workout progress" ON user_workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_workouts' AND policyname = 'Users can view their own workout progress') THEN
    CREATE POLICY "Users can view their own workout progress" ON user_workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;

  -- User exercise logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_exercise_logs' AND policyname = 'Users can insert their own exercise logs') THEN
    CREATE POLICY "Users can insert their own exercise logs" ON user_exercise_logs FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM user_workouts WHERE user_workouts.id = user_workout_id AND user_workouts.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_exercise_logs' AND policyname = 'Users can update their own exercise logs') THEN
    CREATE POLICY "Users can update their own exercise logs" ON user_exercise_logs FOR UPDATE TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_workouts WHERE user_workouts.id = user_workout_id AND user_workouts.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_exercise_logs' AND policyname = 'Users can view their own exercise logs') THEN
    CREATE POLICY "Users can view their own exercise logs" ON user_exercise_logs FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_workouts WHERE user_workouts.id = user_workout_id AND user_workouts.user_id = auth.uid()));
  END IF;
END $$;

-- Insert sample data
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Barbell Squat',
  'A compound exercise that targets the entire lower body, particularly the quadriceps, hamstrings, and glutes.',
  'strength'::exercise_category,
  ARRAY['legs', 'core']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Barbell Squat');

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Bench Press',
  'A fundamental upper body exercise that primarily targets the chest, shoulders, and triceps.',
  'strength'::exercise_category,
  ARRAY['chest', 'shoulders', 'arms']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Bench Press');

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Deadlift',
  'A powerful compound movement that engages multiple muscle groups throughout the body.',
  'strength'::exercise_category,
  ARRAY['back', 'legs', 'core']::muscle_group[],
  'advanced'::difficulty_level,
  true
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Deadlift');

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Push-ups',
  'A bodyweight exercise that builds upper body strength and stability.',
  'bodyweight'::exercise_category,
  ARRAY['chest', 'shoulders', 'arms', 'core']::muscle_group[],
  'beginner'::difficulty_level,
  false
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Push-ups');

-- Insert sample workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Full Body Power',
  'A comprehensive full-body workout designed to build strength and muscle endurance.',
  'intermediate'::difficulty_level,
  45,
  'strength'::exercise_category,
  true
WHERE NOT EXISTS (SELECT 1 FROM workout_templates WHERE title = 'Full Body Power');

INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'HIIT Cardio Blast',
  'High-intensity interval training to boost cardiovascular fitness and burn calories.',
  'advanced'::difficulty_level,
  30,
  'hiit'::exercise_category,
  true
WHERE NOT EXISTS (SELECT 1 FROM workout_templates WHERE title = 'HIIT Cardio Blast');

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
AND e.name = 'Barbell Squat'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
  AND we.order_index = 1
);

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
AND e.name = 'Bench Press'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
  AND we.order_index = 2
);

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
AND e.name = 'Deadlift'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
  AND we.order_index = 3
);