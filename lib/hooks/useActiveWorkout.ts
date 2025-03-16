import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useActiveWorkout(workoutId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    checkExistingWorkout();
    fetchWorkoutDetails();
  }, [workoutId]);

  const checkExistingWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('workout_id', workoutId)
        .eq('user_id', user.id)
        .is('completed_at', null)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setActiveWorkout(data);
      }
    } catch (err) {
      console.error('Error checking existing workout:', err);
    }
  };

  const fetchWorkoutDetails = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('workout_templates')
        .select(`
          *,
          workout_exercises (
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
              muscle_groups
            )
          )
        `)
        .eq('id', workoutId)
        .single();

      if (fetchError) throw fetchError;

      if (data?.workout_exercises) {
        data.workout_exercises.sort((a: any, b: any) => a.order_index - b.order_index);
      }

      setWorkout(data);
    } catch (err) {
      setError('Error loading workout details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existingWorkout, error: checkError } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('workout_id', workoutId)
        .eq('user_id', user.id)
        .is('completed_at', null)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingWorkout) {
        setActiveWorkout(existingWorkout);
        return existingWorkout;
      }

      const { data: newWorkout, error: insertError } = await supabase
        .from('user_workouts')
        .insert({
          workout_id: workoutId,
          user_id: user.id,
          progress_percentage: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setActiveWorkout(newWorkout);
      return newWorkout;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start workout';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progress: number) => {
    if (!activeWorkout) return;

    try {
      const { error } = await supabase
        .from('user_workouts')
        .update({ progress_percentage: progress })
        .eq('id', activeWorkout.id);

      if (error) throw error;
      setActiveWorkout({ ...activeWorkout, progress_percentage: progress });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  const completeWorkout = async (calories: number) => {
    if (!activeWorkout) return;

    try {
      const completedAt = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_workouts')
        .update({
          completed_at: completedAt,
          progress_percentage: 100,
          calories_burned: calories
        })
        .eq('id', activeWorkout.id);

      if (error) throw error;
      
      setActiveWorkout({
        ...activeWorkout,
        completed_at: completedAt,
        progress_percentage: 100,
        calories_burned: calories
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete workout');
      throw err;
    }
  };

  return {
    activeWorkout,
    workout,
    loading,
    error,
    startWorkout,
    updateProgress,
    completeWorkout,
  };
}