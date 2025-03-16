import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Clock, ChevronLeft, Flame, ChartBar as BarChart3 } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useWorkout } from '../../lib/hooks/useWorkout';
import { useActiveWorkout } from '../../lib/hooks/useActiveWorkout';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { workout, loading: workoutLoading, error: workoutError } = useWorkout(id as string);
  const { startWorkout, loading: startingWorkout, error: startError } = useActiveWorkout(id as string);

  const handleStartWorkout = async () => {
    try {
      await startWorkout();
      router.push(`/workout/${id}/active`);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  if (workoutLoading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </GradientBackground>
    );
  }

  if (workoutError) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{workoutError}</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{workout.title}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{workout.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={20} color="#fff" />
              <Text style={styles.statValue}>{workout.duration_minutes} min</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={20} color="#fff" />
              <Text style={styles.statValue}>450 cal</Text>
            </View>
            <View style={styles.stat}>
              <BarChart3 size={20} color="#fff" />
              <Text style={styles.statValue}>{workout.difficulty}</Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {workout.workout_exercises
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((workoutExercise: any, index: number) => (
                <View key={workoutExercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseNumber}>
                      <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Sets</Text>
                      <Text style={styles.detailValue}>{workoutExercise.sets}</Text>
                    </View>
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Reps</Text>
                      <Text style={styles.detailValue}>{workoutExercise.reps}</Text>
                    </View>
                    <View style={styles.exerciseDetail}>
                      <Text style={styles.detailLabel}>Rest</Text>
                      <Text style={styles.detailValue}>{workoutExercise.rest_seconds}s</Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.startButton, startingWorkout && styles.startButtonDisabled]}
          onPress={handleStartWorkout}
          disabled={startingWorkout}>
          <Play size={24} color="#fff" />
          <Text style={styles.startButtonText}>
            {startingWorkout ? 'Starting...' : 'Start Workout'}
          </Text>
        </TouchableOpacity>

        {startError && (
          <Text style={styles.errorText}>{startError}</Text>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  exerciseList: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#0066FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 24,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
});