/*
  # Add More Exercises and Fix Navigation

  1. New Exercises
    - Adds 50+ exercises across different categories
    - Each exercise includes proper descriptions and metadata
    - Covers all major muscle groups and difficulty levels

  2. Categories
    - Strength Training
    - HIIT
    - Cardio
    - Flexibility
    - Bodyweight

  3. Exercise Types
    - Compound movements
    - Isolation exercises
    - Cardio exercises
    - Flexibility work
*/

-- Add more strength exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
VALUES
  ('Lat Pulldown', 'A machine exercise targeting the latissimus dorsi muscles.', 'strength', ARRAY['back', 'arms']::muscle_group[], 'beginner', true),
  ('Leg Press', 'A machine-based lower body exercise for quad development.', 'strength', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Shoulder Press', 'An overhead pressing movement for shoulder development.', 'strength', ARRAY['shoulders', 'arms']::muscle_group[], 'intermediate', true),
  ('Tricep Extension', 'An isolation exercise for triceps development.', 'strength', ARRAY['arms']::muscle_group[], 'beginner', true),
  ('Bicep Curl', 'An isolation exercise for biceps development.', 'strength', ARRAY['arms']::muscle_group[], 'beginner', true),
  ('Cable Row', 'A cable machine exercise for back development.', 'strength', ARRAY['back', 'arms']::muscle_group[], 'beginner', true),
  ('Face Pull', 'A rear deltoid and upper back exercise.', 'strength', ARRAY['shoulders', 'back']::muscle_group[], 'intermediate', true),
  ('Leg Extension', 'An isolation exercise for quadriceps.', 'strength', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Leg Curl', 'An isolation exercise for hamstrings.', 'strength', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Calf Raise', 'An isolation exercise for calf development.', 'strength', ARRAY['legs']::muscle_group[], 'beginner', true);

-- Add more bodyweight exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
VALUES
  ('Chin-ups', 'A pulling exercise using bodyweight.', 'bodyweight', ARRAY['back', 'arms']::muscle_group[], 'intermediate', false),
  ('Diamond Push-ups', 'A tricep-focused push-up variation.', 'bodyweight', ARRAY['chest', 'arms']::muscle_group[], 'intermediate', false),
  ('Pike Push-ups', 'A shoulder-focused push-up variation.', 'bodyweight', ARRAY['shoulders', 'arms']::muscle_group[], 'intermediate', false),
  ('Inverted Rows', 'A horizontal pulling movement.', 'bodyweight', ARRAY['back', 'arms']::muscle_group[], 'beginner', false),
  ('Bulgarian Split Squats', 'A unilateral leg exercise.', 'bodyweight', ARRAY['legs']::muscle_group[], 'intermediate', false),
  ('L-Sit', 'A static hold for core strength.', 'bodyweight', ARRAY['core']::muscle_group[], 'advanced', false),
  ('Handstand Push-ups', 'An advanced shoulder exercise.', 'bodyweight', ARRAY['shoulders', 'arms']::muscle_group[], 'advanced', false),
  ('Muscle-ups', 'A complex pulling and pushing movement.', 'bodyweight', ARRAY['back', 'chest', 'arms']::muscle_group[], 'advanced', false),
  ('Front Lever', 'An advanced static hold.', 'bodyweight', ARRAY['back', 'core']::muscle_group[], 'advanced', false),
  ('Back Lever', 'An advanced gymnastics hold.', 'bodyweight', ARRAY['back', 'core']::muscle_group[], 'advanced', false);

-- Add more HIIT exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
VALUES
  ('Box Jumps', 'Explosive jumping exercise.', 'hiit', ARRAY['legs']::muscle_group[], 'intermediate', true),
  ('Battle Ropes', 'High-intensity rope exercise.', 'hiit', ARRAY['shoulders', 'arms', 'core']::muscle_group[], 'intermediate', true),
  ('Medicine Ball Slams', 'Explosive full body movement.', 'hiit', ARRAY['full_body']::muscle_group[], 'intermediate', true),
  ('Rowing Sprints', 'High-intensity cardio on rower.', 'hiit', ARRAY['full_body']::muscle_group[], 'intermediate', true),
  ('Assault Bike', 'Full body cardio machine work.', 'hiit', ARRAY['full_body']::muscle_group[], 'advanced', true),
  ('Wall Balls', 'Combined squat and throw movement.', 'hiit', ARRAY['full_body']::muscle_group[], 'intermediate', true),
  ('Kettlebell Swings', 'Hip-hinge power movement.', 'hiit', ARRAY['legs', 'back']::muscle_group[], 'intermediate', true),
  ('Thrusters', 'Combined squat and press.', 'hiit', ARRAY['full_body']::muscle_group[], 'advanced', true),
  ('Devil Press', 'Burpee to overhead press.', 'hiit', ARRAY['full_body']::muscle_group[], 'advanced', true),
  ('Ski Erg', 'Upper body cardio machine.', 'hiit', ARRAY['shoulders', 'back']::muscle_group[], 'intermediate', true);

-- Add more cardio exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
VALUES
  ('Treadmill Run', 'Basic running on treadmill.', 'cardio', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Stair Climber', 'Climbing on machine.', 'cardio', ARRAY['legs']::muscle_group[], 'intermediate', true),
  ('Elliptical', 'Low-impact full body cardio.', 'cardio', ARRAY['full_body']::muscle_group[], 'beginner', true),
  ('Stationary Bike', 'Seated cycling exercise.', 'cardio', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Jump Rope', 'Basic jumping rope.', 'cardio', ARRAY['legs']::muscle_group[], 'beginner', true),
  ('Mountain Climbers', 'Dynamic plank movement.', 'cardio', ARRAY['core', 'legs']::muscle_group[], 'intermediate', false),
  ('High Knees', 'Running in place exercise.', 'cardio', ARRAY['legs']::muscle_group[], 'beginner', false),
  ('Jumping Jacks', 'Full body jumping movement.', 'cardio', ARRAY['full_body']::muscle_group[], 'beginner', false),
  ('Burpees', 'Complex full body movement.', 'cardio', ARRAY['full_body']::muscle_group[], 'intermediate', false),
  ('Shadow Boxing', 'Boxing movements without equipment.', 'cardio', ARRAY['full_body']::muscle_group[], 'beginner', false);

-- Add more flexibility exercises
INSERT INTO exercises (name, description, category, muscle_groups, difficulty, equipment_required)
VALUES
  ('Forward Fold', 'Standing forward bend.', 'flexibility', ARRAY['legs', 'back']::muscle_group[], 'beginner', false),
  ('Downward Dog', 'Inverted V position.', 'flexibility', ARRAY['full_body']::muscle_group[], 'beginner', false),
  ('Cobra Pose', 'Back extension movement.', 'flexibility', ARRAY['back']::muscle_group[], 'beginner', false),
  ('Pigeon Pose', 'Hip opening position.', 'flexibility', ARRAY['legs']::muscle_group[], 'intermediate', false),
  ('Child''s Pose', 'Resting stretch position.', 'flexibility', ARRAY['back']::muscle_group[], 'beginner', false),
  ('Cat-Cow', 'Spinal mobility exercise.', 'flexibility', ARRAY['back']::muscle_group[], 'beginner', false),
  ('Thread the Needle', 'Thoracic spine stretch.', 'flexibility', ARRAY['back']::muscle_group[], 'beginner', false),
  ('World''s Greatest Stretch', 'Complex mobility movement.', 'flexibility', ARRAY['full_body']::muscle_group[], 'intermediate', false),
  ('90/90 Hip Stretch', 'Deep hip mobility work.', 'flexibility', ARRAY['legs']::muscle_group[], 'intermediate', false),
  ('Shoulder Dislocates', 'Shoulder mobility exercise.', 'flexibility', ARRAY['shoulders']::muscle_group[], 'intermediate', true);

-- Link exercises to workouts
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
WHERE wt.title = 'Upper Body Builder'
AND e.name = 'Bench Press'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Add more exercise links for Upper Body Builder
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  3,
  12,
  60,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Upper Body Builder'
AND e.name = 'Shoulder Press'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Add exercise links for HIIT Cardio Blast
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
WHERE wt.title = 'HIIT Cardio Blast'
AND e.name = 'Battle Ropes'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  20,
  30,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'HIIT Cardio Blast'
AND e.name = 'Box Jumps'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);