import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Dumbbell, FileWarning as Running, Waves, Cog as Yoga } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

const workoutCategories = [
  {
    id: 1,
    title: 'Swimming',
    duration: '40m',
    icon: Waves,
    color: '#4A90E2',
  },
  {
    id: 2,
    title: 'Body Building',
    duration: '50m',
    icon: Dumbbell,
    color: '#E25C4A',
  },
  {
    id: 3,
    title: 'Running',
    duration: '30m',
    icon: Running,
    color: '#50E3C2',
  },
  {
    id: 4,
    title: 'Pilates',
    duration: '45m',
    icon: Yoga,
    color: '#BD10E0',
  },
];

const filters = ['Cardio', 'Running', 'Gym', 'Pilates'];

export default function WorkoutsScreen() {
  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>SELECT WORKOUT</Text>
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
            <TouchableOpacity key={workout.id} style={styles.workoutCard}>
              <View style={[styles.iconContainer, { backgroundColor: workout.color }]}>
                <workout.icon size={24} color="#fff" />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <Text style={styles.workoutDuration}>{workout.duration}</Text>
              </View>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
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
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
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
    marginBottom: 24,
  },
  filtersContent: {
    paddingRight: 20,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#302b63',
  },
  filterText: {
    color: '#999',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
  },
  workoutList: {
    gap: 16,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 16,
  },
  workoutTitle: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  workoutDuration: {
    color: '#999',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#302b63',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});