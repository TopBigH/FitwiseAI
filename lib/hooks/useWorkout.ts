import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useWorkout(id: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      setError(null);

      // First verify the workout exists
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (workoutError) throw workoutError;
      if (!workoutData) throw new Error('Workout not found');

      // Then fetch the exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          id,
          sets,
          reps,
          rest_seconds,
          order_index,
          exercise:exercises (
            id,
            name,
            description,
            category,
            difficulty,
            muscle_groups,
            equipment_required
          )
        `)
        .eq('workout_id', id)
        .order('order_index');

      if (exercisesError) throw exercisesError;

      setWorkout({
        ...workoutData,
        workout_exercises: exercisesData || []
      });
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  return {
    workout,
    loading,
    error,
    refreshWorkout: fetchWorkout,
  };
}