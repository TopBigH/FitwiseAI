/*
  # Add More Workouts and Exercises

  1. New Exercises
    - Pull-ups (bodyweight)
    - Dumbbell Rows (strength)
    - Plank (bodyweight)
    - Burpees (hiit)
    - Jump Rope (cardio)
    - Yoga Flow (flexibility)

  2. New Workout Templates
    - Upper Body Focus
    - Core Crusher
    - Cardio Endurance
    - Flexibility Flow

  3. Exercise-Workout Relationships
    - Link new exercises to appropriate workouts
    - Set proper sets, reps, and rest periods
*/

-- Add more exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Pull-ups',
  'A challenging bodyweight exercise that builds upper body strength and back development.',
  'bodyweight'::exercise_category,
  ARRAY['back', 'arms']::muscle_group[],
  'intermediate'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Pull-ups'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Dumbbell Rows',
  'An effective back exercise that also engages the biceps and core.',
  'strength'::exercise_category,
  ARRAY['back', 'arms', 'core']::muscle_group[],
  'beginner'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Dumbbell Rows'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Plank',
  'A static hold exercise that builds core strength and stability.',
  'bodyweight'::exercise_category,
  ARRAY['core']::muscle_group[],
  'beginner'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Plank'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Burpees',
  'A full-body exercise that combines strength and cardio.',
  'hiit'::exercise_category,
  ARRAY['full_body']::muscle_group[],
  'intermediate'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Burpees'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Jump Rope',
  'A classic cardio exercise that improves coordination and endurance.',
  'cardio'::exercise_category,
  ARRAY['legs']::muscle_group[],
  'beginner'::difficulty_level,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Jump Rope'
);

INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
SELECT
  'Yoga Flow',
  'A sequence of poses that improve flexibility and mind-body connection.',
  'flexibility'::exercise_category,
  ARRAY['full_body']::muscle_group[],
  'beginner'::difficulty_level,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM exercises WHERE name = 'Yoga Flow'
);

-- Add more workout templates
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Upper Body Focus',
  'Build strength and definition in your chest, back, shoulders, and arms.',
  'intermediate'::difficulty_level,
  40,
  'strength'::exercise_category,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Upper Body Focus'
);

INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Core Crusher',
  'Strengthen your core with this targeted ab workout.',
  'intermediate'::difficulty_level,
  20,
  'strength'::exercise_category,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Core Crusher'
);

INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Cardio Endurance',
  'Improve your cardiovascular fitness with this high-energy workout.',
  'intermediate'::difficulty_level,
  30,
  'cardio'::exercise_category,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Cardio Endurance'
);

INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
SELECT
  'Flexibility Flow',
  'Enhance your flexibility and mobility with this gentle workout.',
  'beginner'::difficulty_level,
  45,
  'flexibility'::exercise_category,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM workout_templates WHERE title = 'Flexibility Flow'
);

-- Link exercises to Upper Body Focus workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  3,
  12,
  60,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Upper Body Focus'
AND e.name = 'Bench Press'
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
  10,
  90,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Upper Body Focus'
AND e.name = 'Pull-ups'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Link exercises to Core Crusher workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  3,
  60,
  45,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Core Crusher'
AND e.name = 'Plank'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Link exercises to Cardio Endurance workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  20,
  30,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Cardio Endurance'
AND e.name = 'Burpees'
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
  180,
  60,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Cardio Endurance'
AND e.name = 'Jump Rope'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Link exercises to Flexibility Flow workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, duration_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  1,
  1,
  900,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Flexibility Flow'
AND e.name = 'Yoga Flow'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);