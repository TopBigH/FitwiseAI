/*
  # Add More Exercises and Workouts

  1. New Exercises
    - Adding various exercises across different categories and difficulty levels
    - Each exercise includes detailed descriptions and muscle group targeting
  
  2. New Workouts
    - Adding more workout templates with different focuses
    - Linking exercises to workouts with specific sets, reps, and rest periods
*/

-- Add more strength exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Military Press',
  'A compound exercise that targets the shoulders and upper body.',
  'strength'::exercise_category,
  ARRAY['shoulders', 'arms']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Military Press'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Romanian Deadlift',
  'A hip-hinge movement that targets the posterior chain.',
  'strength'::exercise_category,
  ARRAY['back', 'legs']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Romanian Deadlift'
);

-- Add more bodyweight exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Dips',
  'A challenging upper body exercise for chest, shoulders, and triceps.',
  'bodyweight'::exercise_category,
  ARRAY['chest', 'shoulders', 'arms']::muscle_group[],
  'intermediate'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Dips'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Pistol Squats',
  'A single-leg squat that builds strength and balance.',
  'bodyweight'::exercise_category,
  ARRAY['legs', 'core']::muscle_group[],
  'advanced'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Pistol Squats'
);

-- Add more cardio exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Mountain Climbers',
  'A dynamic exercise that combines cardio and core strength.',
  'cardio'::exercise_category,
  ARRAY['core', 'full_body']::muscle_group[],
  'intermediate'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Mountain Climbers'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Box Jumps',
  'An explosive plyometric exercise for power and cardio.',
  'cardio'::exercise_category,
  ARRAY['legs']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Box Jumps'
);

-- Add more HIIT exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Kettlebell Swings',
  'A dynamic exercise that builds power and endurance.',
  'hiit'::exercise_category,
  ARRAY['legs', 'back', 'core']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Kettlebell Swings'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Battle Ropes',
  'A high-intensity exercise for upper body and cardio.',
  'hiit'::exercise_category,
  ARRAY['shoulders', 'arms', 'core']::muscle_group[],
  'intermediate'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Battle Ropes'
);

-- Add more flexibility exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Dynamic Stretching',
  'A series of active movements to improve flexibility.',
  'flexibility'::exercise_category,
  ARRAY['full_body']::muscle_group[],
  'beginner'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Dynamic Stretching'
);

-- Add new workout template
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Power Hour',
  'A challenging full-body workout combining strength and HIIT.',
  'advanced'::difficulty_level,
  60,
  'strength'::exercise_category,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Power Hour'
);

-- Link exercises to Power Hour workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  8,
  90,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Power Hour'
AND e.name = 'Military Press'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  3,
  15,
  60,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Power Hour'
AND e.name = 'Kettlebell Swings'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);