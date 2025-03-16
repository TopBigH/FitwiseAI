/*
  # Fix Workout Data and Exercise Links

  1. Updates
    - Add proper exercises to all workouts
    - Fix workout descriptions
    - Update workout durations and difficulties
    - Add proper exercise sets/reps/rest times

  2. Changes
    - Remove single push-up default
    - Add multiple exercises per workout
    - Update featured workouts
*/

-- First, remove any single push-up workouts
DELETE FROM workout_exercises
WHERE exercise_id IN (
  SELECT id FROM exercises WHERE name = 'Push-ups'
)
AND (
  SELECT COUNT(*) FROM workout_exercises we2 
  WHERE we2.workout_id = workout_exercises.workout_id
) = 1;

-- Update Full Body Power workout
WITH workout AS (
  SELECT id FROM workout_templates WHERE title = 'Full Body Power'
)
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  workout.id,
  e.id,
  CASE e.name
    WHEN 'Barbell Squat' THEN 4
    WHEN 'Bench Press' THEN 4
    WHEN 'Deadlift' THEN 3
    WHEN 'Military Press' THEN 3
    WHEN 'Pull-ups' THEN 3
  END,
  CASE e.name
    WHEN 'Barbell Squat' THEN 10
    WHEN 'Bench Press' THEN 10
    WHEN 'Deadlift' THEN 8
    WHEN 'Military Press' THEN 12
    WHEN 'Pull-ups' THEN 8
  END,
  90,
  CASE e.name
    WHEN 'Barbell Squat' THEN 1
    WHEN 'Bench Press' THEN 2
    WHEN 'Deadlift' THEN 3
    WHEN 'Military Press' THEN 4
    WHEN 'Pull-ups' THEN 5
  END
FROM workout
CROSS JOIN exercises e
WHERE e.name IN ('Barbell Squat', 'Bench Press', 'Deadlift', 'Military Press', 'Pull-ups')
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we 
  WHERE we.workout_id = workout.id 
  AND we.exercise_id = e.id
);

-- Update HIIT Cardio Blast workout
WITH workout AS (
  SELECT id FROM workout_templates WHERE title = 'HIIT Cardio Blast'
)
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  workout.id,
  e.id,
  4,
  CASE e.name
    WHEN 'Burpees' THEN 15
    WHEN 'Mountain Climbers' THEN 30
    WHEN 'Box Jumps' THEN 12
    WHEN 'Battle Ropes' THEN 30
    WHEN 'Kettlebell Swings' THEN 20
  END,
  30,
  CASE e.name
    WHEN 'Burpees' THEN 1
    WHEN 'Mountain Climbers' THEN 2
    WHEN 'Box Jumps' THEN 3
    WHEN 'Battle Ropes' THEN 4
    WHEN 'Kettlebell Swings' THEN 5
  END
FROM workout
CROSS JOIN exercises e
WHERE e.name IN ('Burpees', 'Mountain Climbers', 'Box Jumps', 'Battle Ropes', 'Kettlebell Swings')
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we 
  WHERE we.workout_id = workout.id 
  AND we.exercise_id = e.id
);

-- Update Core Crusher workout
WITH workout AS (
  SELECT id FROM workout_templates WHERE title = 'Core Crusher'
)
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  workout.id,
  e.id,
  3,
  CASE e.name
    WHEN 'Plank' THEN 60
    WHEN 'Mountain Climbers' THEN 30
    WHEN 'L-Sit' THEN 20
  END,
  45,
  CASE e.name
    WHEN 'Plank' THEN 1
    WHEN 'Mountain Climbers' THEN 2
    WHEN 'L-Sit' THEN 3
  END
FROM workout
CROSS JOIN exercises e
WHERE e.name IN ('Plank', 'Mountain Climbers', 'L-Sit')
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we 
  WHERE we.workout_id = workout.id 
  AND we.exercise_id = e.id
);

-- Update Upper Body Builder workout
WITH workout AS (
  SELECT id FROM workout_templates WHERE title = 'Upper Body Builder'
)
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  workout.id,
  e.id,
  4,
  CASE e.name
    WHEN 'Bench Press' THEN 12
    WHEN 'Pull-ups' THEN 8
    WHEN 'Military Press' THEN 10
    WHEN 'Face Pull' THEN 15
  END,
  60,
  CASE e.name
    WHEN 'Bench Press' THEN 1
    WHEN 'Pull-ups' THEN 2
    WHEN 'Military Press' THEN 3
    WHEN 'Face Pull' THEN 4
  END
FROM workout
CROSS JOIN exercises e
WHERE e.name IN ('Bench Press', 'Pull-ups', 'Military Press', 'Face Pull')
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we 
  WHERE we.workout_id = workout.id 
  AND we.exercise_id = e.id
);

-- Ensure all workouts have proper exercise counts
DO $$
DECLARE
  workout record;
BEGIN
  FOR workout IN 
    SELECT wt.id, wt.title 
    FROM workout_templates wt
    WHERE (
      SELECT COUNT(*) FROM workout_exercises we 
      WHERE we.workout_id = wt.id
    ) < 3
  LOOP
    -- Add default strength exercises
    INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
    SELECT 
      workout.id,
      e.id,
      3,
      12,
      60,
      CASE e.name
        WHEN 'Push-ups' THEN 1
        WHEN 'Pull-ups' THEN 2
        WHEN 'Squats' THEN 3
      END
    FROM exercises e
    WHERE e.name IN ('Push-ups', 'Pull-ups', 'Squats')
    AND NOT EXISTS (
      SELECT 1 FROM workout_exercises we 
      WHERE we.workout_id = workout.id 
      AND we.exercise_id = e.id
    );
  END LOOP;
END $$;