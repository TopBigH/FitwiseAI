-- Update existing workouts to ensure they have exercises
UPDATE workout_templates 
SET is_featured = true 
WHERE title IN ('Full Body Power', 'HIIT Cardio Blast', 'Power Hour');

-- Ensure workout exercises are properly linked
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
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
);

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
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
);

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
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
);

-- Add exercises to HIIT Cardio Blast
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
  wt.id,
  e.id,
  4,
  20,
  30,
  1
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'HIIT Cardio Blast'
AND e.name = 'Burpees'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
  wt.id,
  e.id,
  4,
  30,
  30,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'HIIT Cardio Blast'
AND e.name = 'Mountain Climbers'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Add exercises to Power Hour
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT DISTINCT
  wt.id,
  e.id,
  5,
  5,
  120,
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
SELECT DISTINCT
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

-- Verify and fix any workouts without exercises
DO $$
DECLARE
  workout record;
BEGIN
  FOR workout IN 
    SELECT id, title 
    FROM workout_templates wt
    WHERE NOT EXISTS (
      SELECT 1 FROM workout_exercises we WHERE we.workout_id = wt.id
    )
  LOOP
    -- Add default exercises to workouts without any
    INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
    SELECT 
      workout.id,
      e.id,
      3,
      12,
      60,
      1
    FROM exercises e
    WHERE e.name = 'Push-ups'
    LIMIT 1;
  END LOOP;
END $$;