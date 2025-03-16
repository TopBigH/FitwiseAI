import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Timer, Flame } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import GradientBackground from '../../components/GradientBackground';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, [id]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('workout_templates')
        .select(`
          *,
          workout_exercises (
            exercise:exercises (
              name,
              category,
              difficulty
            )
          )
        `)
        .eq('category', id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setWorkouts(data || []);
    } catch (err) {
      setError('Error loading workouts. Please try again.');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push({
      pathname: '/workout/[id]',
      params: { id: workoutId }
    });
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>
              {id.charAt(0).toUpperCase() + id.slice(1)} Workouts
            </Text>
            <Text style={styles.subtitle}>
              Find your perfect {id.toLowerCase()} workout
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchWorkouts}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading workouts...</Text>
          </View>
        ) : workouts.length > 0 ? (
          <View style={styles.workoutGrid}>
            {workouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() => handleWorkoutPress(workout.id)}>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <Text style={styles.workoutDescription} numberOfLines={2}>
                  {workout.description}
                </Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Timer size={16} color="#fff" />
                    <Text style={styles.workoutStatText}>{workout.duration_minutes} min</Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <Flame size={16} color="#fff" />
                    <Text style={styles.workoutStatText}>450 cal</Text>
                  </View>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{workout.difficulty}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workouts found</Text>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  workoutGrid: {
    padding: 20,
    gap: 16,
  },
  workoutCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  workoutTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  workoutDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutStatText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0066FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  difficultyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
});