import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useWorkoutProgress(userId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    weeklyWorkouts: 0,
    monthlyWorkouts: 0,
    totalMinutes: 0,
    averageIntensity: 0,
  });

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch weekly workouts
        const { data: weeklyWorkouts, error: weeklyError } = await supabase
          .from('user_workouts')
          .select('*')
          .eq('user_id', userId)
          .gte('started_at', startOfWeek.toISOString())
          .lt('started_at', now.toISOString());

        if (weeklyError) throw weeklyError;

        // Fetch monthly workouts
        const { data: monthlyWorkouts, error: monthlyError } = await supabase
          .from('user_workouts')
          .select('*')
          .eq('user_id', userId)
          .gte('started_at', startOfMonth.toISOString())
          .lt('started_at', now.toISOString());

        if (monthlyError) throw monthlyError;

        // Calculate total minutes and average intensity
        const totalMinutes = monthlyWorkouts.reduce((acc, workout) => {
          const duration = workout.completed_at 
            ? (new Date(workout.completed_at).getTime() - new Date(workout.started_at).getTime()) / 1000 / 60
            : 0;
          return acc + duration;
        }, 0);

        const averageIntensity = monthlyWorkouts.length > 0
          ? monthlyWorkouts.reduce((acc, workout) => acc + (workout.progress_percentage || 0), 0) / monthlyWorkouts.length
          : 0;

        setProgress({
          weeklyWorkouts: weeklyWorkouts.length,
          monthlyWorkouts: monthlyWorkouts.length,
          totalMinutes: Math.round(totalMinutes),
          averageIntensity: Math.round(averageIntensity),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  return { progress, loading, error };
}