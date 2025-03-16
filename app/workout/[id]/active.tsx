import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, ChevronLeft, CircleCheck as CheckCircle, Plus, Minus } from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';
import { useActiveWorkout } from '../../../lib/hooks/useActiveWorkout';

const { width, height } = Dimensions.get('window');

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeWorkout, workout, loading, error, updateProgress, completeWorkout } = useActiveWorkout(id as string);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<{[key: string]: {
    completed: boolean;
    currentSet: number;
    setsCompleted: number[];
  }}>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && restTimer === null) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, restTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (restTimer === 0) {
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const handleSetComplete = (exerciseId: string, setNumber: number, reps: number) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId] || { completed: false, currentSet: 1, setsCompleted: [] },
        setsCompleted: [
          ...(prev[exerciseId]?.setsCompleted || []),
          reps
        ],
        currentSet: (prev[exerciseId]?.currentSet || 1) + 1
      }
    }));

    const exercise = workout.workout_exercises.find((e: any) => e.id === exerciseId);
    if (exercise && exercise.rest_seconds && setNumber < exercise.sets) {
      setRestTimer(exercise.rest_seconds);
    }
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      setExerciseProgress(prev => ({
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] || { currentSet: 1, setsCompleted: [] }),
          completed: true
        }
      }));

      const totalExercises = workout?.workout_exercises?.length || 0;
      const completedExercises = Object.values(exerciseProgress).filter(e => e.completed).length + 1;
      const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
      
      await updateProgress(progressPercentage);

      if (currentExercise < (workout?.workout_exercises?.length || 0) - 1) {
        setCurrentExercise(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error completing exercise:', err);
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
  const exerciseState = exerciseProgress[currentExerciseData?.id];

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

          <View style={styles.mainContent}>
            {restTimer !== null ? (
              <View style={styles.restTimer}>
                <Text style={styles.restTimerTitle}>Rest Time</Text>
                <Text style={styles.restTimerText}>{restTimer}s</Text>
                <TouchableOpacity 
                  style={styles.skipRestButton}
                  onPress={() => setRestTimer(null)}>
                  <Text style={styles.skipRestText}>Skip Rest</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView 
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                {currentExerciseData && (
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseName}>{currentExerciseData.exercise.name}</Text>
                    <Text style={styles.exerciseDescription}>
                      {currentExerciseData.exercise.description}
                    </Text>

                    <View style={styles.setTracker}>
                      <Text style={styles.setTitle}>
                        Set {exerciseState?.currentSet || 1} of {currentExerciseData.sets}
                      </Text>
                      
                      <View style={styles.repCounter}>
                        <TouchableOpacity 
                          style={styles.repButton}
                          onPress={() => {
                            const currentReps = exerciseState?.setsCompleted[exerciseState.currentSet - 1] || currentExerciseData.reps;
                            if (currentReps > 0) {
                              setExerciseProgress(prev => ({
                                ...prev,
                                [currentExerciseData.id]: {
                                  ...prev[currentExerciseData.id] || { completed: false, currentSet: 1, setsCompleted: [] },
                                  setsCompleted: [
                                    ...(prev[currentExerciseData.id]?.setsCompleted || []).slice(0, -1),
                                    currentReps - 1
                                  ]
                                }
                              }));
                            }
                          }}>
                          <Minus size={24} color="#fff" />
                        </TouchableOpacity>
                        
                        <Text style={styles.repCount}>
                          {exerciseState?.setsCompleted[exerciseState.currentSet - 1] || currentExerciseData.reps} reps
                        </Text>
                        
                        <TouchableOpacity 
                          style={styles.repButton}
                          onPress={() => {
                            const currentReps = exerciseState?.setsCompleted[exerciseState.currentSet - 1] || currentExerciseData.reps;
                            setExerciseProgress(prev => ({
                              ...prev,
                              [currentExerciseData.id]: {
                                ...prev[currentExerciseData.id] || { completed: false, currentSet: 1, setsCompleted: [] },
                                setsCompleted: [
                                  ...(prev[currentExerciseData.id]?.setsCompleted || []).slice(0, -1),
                                  currentReps + 1
                                ]
                              }
                            }));
                          }}>
                          <Plus size={24} color="#fff" />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity 
                        style={styles.completeSetButton}
                        onPress={() => {
                          const currentReps = exerciseState?.setsCompleted[exerciseState.currentSet - 1] || currentExerciseData.reps;
                          handleSetComplete(
                            currentExerciseData.id,
                            exerciseState?.currentSet || 1,
                            currentReps
                          );
                        }}
                        disabled={exerciseState?.currentSet > currentExerciseData.sets}>
                        <Text style={styles.completeSetText}>Complete Set</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.setHistory}>
                      <Text style={styles.setHistoryTitle}>Set History</Text>
                      {exerciseState?.setsCompleted.map((reps, index) => (
                        <Text key={index} style={styles.setHistoryItem}>
                          Set {index + 1}: {reps} reps
                        </Text>
                      ))}
                    </View>

                    {exerciseState?.currentSet > currentExerciseData.sets && (
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
                      {exerciseProgress[we.id]?.completed && (
                        <CheckCircle size={20} color="#0066FF" />
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

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
                !Object.values(exerciseProgress).every(e => e.completed) && styles.completeButtonDisabled
              ]}
              onPress={async () => {
                try {
                  const calories = Math.round(elapsedTime / 60 * 10);
                  await completeWorkout(calories);
                  router.replace('/(tabs)');
                } catch (error) {
                  console.error('Error completing workout:', error);
                }
              }}
              disabled={!Object.values(exerciseProgress).every(e => e.completed)}>
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
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    height: height,
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
    width: '100%',
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
    width: '100%',
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
    width: '100%',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
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
  setTracker: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  setTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  repCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  repButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    width: 100,
    textAlign: 'center',
  },
  completeSetButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeSetText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  setHistory: {
    marginBottom: 16,
  },
  setHistoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  setHistoryItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
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
    width: '100%',
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
  restTimer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  restTimerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  restTimerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    color: '#fff',
    marginBottom: 24,
  },
  skipRestButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  skipRestText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});