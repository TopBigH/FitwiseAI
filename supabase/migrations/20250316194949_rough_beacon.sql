/*
  # Add workout templates and exercises

  1. Tables
    - Adds sample exercises and workouts
    - Links exercises to workouts with proper metadata
  
  2. Data
    - Inserts sample exercises
    - Creates featured workouts
    - Sets up workout-exercise relationships
*/

-- Insert sample exercises if they don't exist
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Barbell Squat',
  'A compound exercise that targets the entire lower body, particularly the quadriceps, hamstrings, and glutes.',
  'strength'::exercise_category,
  ARRAY['legs', 'core']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Barbell Squat'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Bench Press',
  'A fundamental upper body exercise that primarily targets the chest, shoulders, and triceps.',
  'strength'::exercise_category,
  ARRAY['chest', 'shoulders', 'arms']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Bench Press'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Deadlift',
  'A powerful compound movement that engages multiple muscle groups throughout the body.',
  'strength'::exercise_category,
  ARRAY['back', 'legs', 'core']::muscle_group[],
  'advanced'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Deadlift'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Push-ups',
  'A bodyweight exercise that builds upper body strength and stability.',
  'bodyweight'::exercise_category,
  ARRAY['chest', 'shoulders', 'arms', 'core']::muscle_group[],
  'beginner'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Push-ups'
);

-- Insert sample workout templates if they don't exist
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Full Body Power',
  'A comprehensive full-body workout designed to build strength and muscle endurance.',
  'intermediate'::difficulty_level,
  45,
  'strength'::exercise_category,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Full Body Power'
);

INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'HIIT Cardio Blast',
  'High-intensity interval training to boost cardiovascular fitness and burn calories.',
  'advanced'::difficulty_level,
  30,
  'hiit'::exercise_category,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'HIIT Cardio Blast'
);

-- Link exercises to workouts if they don't exist
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