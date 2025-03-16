import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, ChevronLeft, CircleCheck as CheckCircle } from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';
import { useActiveWorkout } from '../../../lib/hooks/useActiveWorkout';

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeWorkout, workout, loading, error, updateProgress, completeWorkout } = useActiveWorkout(id as string);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      setExerciseProgress(prev => ({
        ...prev,
        [exerciseId]: true
      }));

      const totalExercises = workout?.workout_exercises?.length || 0;
      const completedExercises = Object.values({
        ...exerciseProgress,
        [exerciseId]: true
      }).filter(Boolean).length;
      
      const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
      await updateProgress(progressPercentage);

      if (currentExercise < (workout?.workout_exercises?.length || 0) - 1) {
        setCurrentExercise(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error completing exercise:', err);
    }
  };

  const handleComplete = async () => {
    try {
      const calories = Math.round(elapsedTime / 60 * 10); // Simple calorie calculation
      await completeWorkout(calories);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !workout) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </GradientBackground>
    );
  }

  const currentExerciseData = workout.workout_exercises[currentExercise];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{workout.title}</Text>
          </View>

          <View style={styles.timerSection}>
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.progressText}>
              Exercise {currentExercise + 1} of {workout.workout_exercises.length}
            </Text>
          </View>

          <ScrollView 
            style={styles.mainContent} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {currentExerciseData && (
              <View style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{currentExerciseData.exercise.name}</Text>
                <Text style={styles.exerciseDescription}>
                  {currentExerciseData.exercise.description}
                </Text>
                <View style={styles.exerciseDetails}>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <Text style={styles.detailValue}>{currentExerciseData.sets}</Text>
                  </View>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <Text style={styles.detailValue}>{currentExerciseData.reps}</Text>
                  </View>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Rest</Text>
                    <Text style={styles.detailValue}>{currentExerciseData.rest_seconds}s</Text>
                  </View>
                </View>

                {!exerciseProgress[currentExerciseData.id] && (
                  <TouchableOpacity 
                    style={styles.completeExerciseButton}
                    onPress={() => handleExerciseComplete(currentExerciseData.id)}>
                    <CheckCircle size={20} color="#fff" />
                    <Text style={styles.completeExerciseText}>Complete Exercise</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.upcomingExercises}>
              <Text style={styles.sectionTitle}>Coming Up</Text>
              {workout.workout_exercises.slice(currentExercise + 1).map((we: any, index: number) => (
                <View key={we.id} style={styles.upcomingExercise}>
                  <View style={styles.upcomingExerciseNumber}>
                    <Text style={styles.upcomingExerciseNumberText}>
                      {currentExercise + index + 2}
                    </Text>
                  </View>
                  <Text style={styles.upcomingExerciseName}>{we.exercise.name}</Text>
                  {exerciseProgress[we.id] && (
                    <CheckCircle size={20} color="#0066FF" />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setIsPaused(!isPaused)}>
              {isPaused ? (
                <Play size={32} color="#fff" />
              ) : (
                <Pause size={32} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.completeButton,
                !Object.values(exerciseProgress).every(Boolean) && styles.completeButtonDisabled
              ]}
              onPress={handleComplete}
              disabled={!Object.values(exerciseProgress).every(Boolean)}>
              <CheckCircle size={24} color="#fff" />
              <Text style={styles.completeButtonText}>Complete Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    flex: 1,
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    color: '#fff',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exerciseName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detail: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  completeExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeExerciseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  upcomingExercises: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  upcomingExercise: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  upcomingExerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingExerciseNumberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  upcomingExerciseName: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  controls: {
    padding: 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});