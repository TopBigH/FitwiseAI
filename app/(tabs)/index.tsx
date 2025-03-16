import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Dumbbell, FileWarning as Running, SwissFranc as Swim, Cog as Yoga } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

const workoutCategories = [
  {
    id: 1,
    title: 'Swimming',
    duration: '40m',
    icon: Swim,
    color: '#0066FF',
  },
  {
    id: 2,
    title: 'Body Building',
    duration: '40 minutes',
    icon: Dumbbell,
    color: '#0066FF',
  },
  {
    id: 3,
    title: 'Running',
    duration: '30m',
    icon: Running,
    color: '#0066FF',
  },
];

const filters = ['Cardio', 'Running', 'Gym', 'Pilates'];

export default function WorkoutsScreen() {
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
            <TouchableOpacity key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutContent}>
                <View style={styles.iconContainer}>
                  <workout.icon size={24} color="#fff" strokeWidth={1.5} />
                </View>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutDuration}>{workout.duration}</Text>
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
  workoutDuration: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});