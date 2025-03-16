import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Dumbbell, FileWarning as Running, Timer, Cog as Yoga } from 'lucide-react-native';
import { router } from 'expo-router';
import GradientBackground from '../../components/GradientBackground';

const workoutCategories = [
  {
    id: 1,
    title: 'Strength',
    duration: '45m',
    icon: Dumbbell,
    description: 'Build muscle & strength',
    exercises: 12,
  },
  {
    id: 2,
    title: 'HIIT',
    duration: '30m',
    icon: Timer,
    description: 'High intensity intervals',
    exercises: 8,
  },
  {
    id: 3,
    title: 'Cardio',
    duration: '40m',
    icon: Running,
    description: 'Improve endurance',
    exercises: 6,
  },
  {
    id: 4,
    title: 'Flexibility',
    duration: '35m',
    icon: Yoga,
    description: 'Enhance mobility',
    exercises: 10,
  },
];

const filters = ['All', 'Strength', 'Cardio', 'HIIT', 'Flexibility'];

export default function WorkoutsScreen() {
  const handleWorkoutPress = (workoutId: number) => {
    router.push(`/workout/${workoutId}`);
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>SELECT</Text>
            <Text style={styles.title}>WORKOUT</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuIcon} />
            <View style={styles.menuIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterButton, index === 0 && styles.filterButtonActive]}>
              <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.workoutList}>
          {workoutCategories.map((workout) => (
            <TouchableOpacity 
              key={workout.id} 
              style={styles.workoutCard}
              onPress={() => handleWorkoutPress(workout.id)}>
              <View style={styles.workoutContent}>
                <View style={styles.iconContainer}>
                  <workout.icon size={24} color="#fff" strokeWidth={1.5} />
                </View>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutDescription}>{workout.description}</Text>
                  <View style={styles.workoutStats}>
                    <Text style={styles.workoutStat}>{workout.duration}</Text>
                    <Text style={styles.workoutStatDot}>•</Text>
                    <Text style={styles.workoutStat}>{workout.exercises} exercises</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#fff',
    lineHeight: 40,
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    gap: 6,
  },
  menuIcon: {
    width: 24,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  filters: {
    marginBottom: 32,
  },
  filtersContent: {
    gap: 12,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  filterText: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
  },
  workoutList: {
    gap: 16,
  },
  workoutCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  workoutContent: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,102,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,102,255,0.2)',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  workoutDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  workoutStatDot: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 8,
  },
});