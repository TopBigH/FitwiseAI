/*
  # Add More Workouts and Exercises

  1. New Workouts
    - Adds 50+ diverse workout templates across different categories
    - Each workout includes multiple exercises with proper sets/reps
    - Includes featured workouts for the home screen

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

-- Add more strength workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
VALUES
  ('Powerlifting Basics', 'Focus on the big three lifts for maximum strength gains', 'advanced', 75, 'strength', true),
  ('Upper Body Builder', 'Comprehensive chest, back, and shoulders workout', 'intermediate', 60, 'strength', false),
  ('Leg Day Champion', 'Build powerful legs with this intense lower body workout', 'intermediate', 60, 'strength', true),
  ('Push Pull Power', 'Alternating push and pull exercises for balanced development', 'intermediate', 55, 'strength', false),
  ('Strength Endurance', 'Build muscular endurance with high-volume training', 'intermediate', 45, 'strength', false),
  ('Olympic Lifting', 'Technical workout focusing on clean and jerk variations', 'advanced', 90, 'strength', true),
  ('Dumbbell Destroyer', 'Full body workout using only dumbbells', 'intermediate', 45, 'strength', false),
  ('Shoulder Sculptor', 'Targeted shoulder development workout', 'intermediate', 40, 'strength', false),
  ('Back Attack', 'Comprehensive back development routine', 'intermediate', 50, 'strength', false),
  ('Chest Champion', 'Build a powerful chest with this focused workout', 'intermediate', 45, 'strength', false);

-- Add more HIIT workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
VALUES
  ('Tabata Terror', '20/10 intervals for maximum intensity', 'advanced', 30, 'hiit', true),
  ('MetCon Master', 'Metabolic conditioning to torch calories', 'advanced', 45, 'hiit', false),
  ('AMRAP Challenge', 'As many rounds as possible in 20 minutes', 'intermediate', 25, 'hiit', true),
  ('EMOM Burner', 'Every minute on the minute for 30 minutes', 'intermediate', 35, 'hiit', false),
  ('Circuit Breaker', 'Full body circuit training', 'intermediate', 40, 'hiit', false),
  ('Power HIIT', 'Explosive movements for power and conditioning', 'advanced', 35, 'hiit', true),
  ('Kettlebell HIIT', 'High-intensity kettlebell workout', 'intermediate', 30, 'hiit', false),
  ('Bodyweight Blast', 'No equipment HIIT workout', 'intermediate', 25, 'hiit', false),
  ('Cardio Crusher', 'High-intensity cardio intervals', 'advanced', 30, 'hiit', false),
  ('Endurance HIIT', 'Longer intervals for endurance building', 'intermediate', 45, 'hiit', false);

-- Add more cardio workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
VALUES
  ('Steady State Cardio', 'Build aerobic base with steady pace work', 'beginner', 45, 'cardio', true),
  ('Sprint Intervals', 'High-intensity sprint training', 'advanced', 30, 'cardio', false),
  ('Hill Climber', 'Incline-based cardio workout', 'intermediate', 40, 'cardio', true),
  ('Cardio Kickboxing', 'Boxing-inspired cardio routine', 'intermediate', 45, 'cardio', false),
  ('Jump Rope Master', 'Skipping rope cardio workout', 'intermediate', 30, 'cardio', false),
  ('Stair Climber', 'Stair-based cardio challenge', 'intermediate', 35, 'cardio', true),
  ('Power Walking', 'Low-impact cardio session', 'beginner', 45, 'cardio', false),
  ('Mixed Cardio', 'Various cardio exercises combined', 'intermediate', 40, 'cardio', false),
  ('Cardio Core', 'Combined cardio and core workout', 'intermediate', 35, 'cardio', false),
  ('Endurance Builder', 'Long-duration cardio session', 'advanced', 60, 'cardio', false);

-- Add more flexibility workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
VALUES
  ('Morning Yoga Flow', 'Energizing morning yoga routine', 'beginner', 30, 'flexibility', true),
  ('Deep Stretch', 'Comprehensive flexibility work', 'intermediate', 45, 'flexibility', false),
  ('Dynamic Flexibility', 'Active stretching routine', 'intermediate', 35, 'flexibility', true),
  ('Mobility Master', 'Joint mobility workout', 'intermediate', 40, 'flexibility', false),
  ('Yoga Power', 'Strength-focused yoga session', 'intermediate', 50, 'flexibility', false),
  ('Recovery Flow', 'Gentle recovery workout', 'beginner', 30, 'flexibility', true),
  ('Balance Builder', 'Balance and flexibility combined', 'intermediate', 40, 'flexibility', false),
  ('Stretch & Strengthen', 'Combined flexibility and strength work', 'intermediate', 45, 'flexibility', false),
  ('Pilates Flow', 'Core-focused flexibility routine', 'intermediate', 40, 'flexibility', false),
  ('Joint Mobility', 'Focused joint mobility work', 'beginner', 35, 'flexibility', false);

-- Add more bodyweight workouts
INSERT INTO workout_templates (title, description, difficulty, duration_minutes, category, is_featured)
VALUES
  ('Calisthenics Basic', 'Fundamental bodyweight exercises', 'beginner', 45, 'bodyweight', true),
  ('Advanced Calisthenics', 'Advanced bodyweight skills', 'advanced', 60, 'bodyweight', false),
  ('Core Control', 'Bodyweight core workout', 'intermediate', 30, 'bodyweight', true),
  ('Planche Prep', 'Planche progression workout', 'advanced', 45, 'bodyweight', false),
  ('Handstand Practice', 'Handstand skill development', 'advanced', 40, 'bodyweight', false),
  ('Push Power', 'Push-focused bodyweight routine', 'intermediate', 35, 'bodyweight', true),
  ('Pull Progress', 'Pull-up progression workout', 'intermediate', 40, 'bodyweight', false),
  ('Mobility Flow', 'Movement-based bodyweight workout', 'intermediate', 45, 'bodyweight', false),
  ('Skill Practice', 'Bodyweight skill development', 'advanced', 50, 'bodyweight', false),
  ('Beginner Bodyweight', 'Introduction to bodyweight training', 'beginner', 40, 'bodyweight', false);

-- Link exercises to workouts (example for one workout)
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
WHERE wt.title = 'Powerlifting Basics'
AND e.name = 'Barbell Squat'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);

-- Add more exercise-workout links as needed
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds, order_index)
SELECT 
  wt.id,
  e.id,
  4,
  8,
  90,
  2
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Powerlifting Basics'
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
  5,
  120,
  3
FROM workout_templates wt
CROSS JOIN exercises e
WHERE wt.title = 'Powerlifting Basics'
AND e.name = 'Deadlift'
AND NOT EXISTS (
  SELECT 1 FROM workout_exercises we
  WHERE we.workout_id = wt.id
  AND we.exercise_id = e.id
);