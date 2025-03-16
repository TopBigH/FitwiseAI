import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Play, Clock, ChevronLeft, Flame, ChartBar as BarChart3 } from 'lucide-react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import GradientBackground from '../../components/GradientBackground';

const workoutData = {
  id: 1,
  title: 'Full Body Power',
  description: 'A comprehensive full-body workout designed to build strength and muscle endurance.',
  duration: '45 min',
  difficulty: 'Advanced',
  calories: '450 cal',
  exercises: [
    {
      id: 1,
      name: 'Barbell Squats',
      sets: 4,
      reps: '8-10',
      rest: '90s',
    },
    {
      id: 2,
      name: 'Bench Press',
      sets: 4,
      reps: '8-12',
      rest: '90s',
    },
    {
      id: 3,
      name: 'Deadlifts',
      sets: 3,
      reps: '8-10',
      rest: '120s',
    },
    {
      id: 4,
      name: 'Pull-ups',
      sets: 3,
      reps: '8-12',
      rest: '60s',
    },
  ],
};

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const { navigateBack } = useAppNavigation();

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{workoutData.title}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{workoutData.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={20} color="#fff" />
              <Text style={styles.statValue}>{workoutData.duration}</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={20} color="#fff" />
              <Text style={styles.statValue}>{workoutData.calories}</Text>
            </View>
            <View style={styles.stat}>
              <BarChart3 size={20} color="#fff" />
              <Text style={styles.statValue}>{workoutData.difficulty}</Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {workoutData.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </View>
                <View style={styles.exerciseDetails}>
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <Text style={styles.detailValue}>{exercise.sets}</Text>
                  </View>
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <Text style={styles.detailValue}>{exercise.reps}</Text>
                  </View>
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Rest</Text>
                    <Text style={styles.detailValue}>{exercise.rest}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Play size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
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
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});