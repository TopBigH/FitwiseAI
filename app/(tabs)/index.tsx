import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Dumbbell, Timer, Flame, Zap } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

const featuredWorkouts = [
  {
    id: 1,
    title: 'Full Body Power',
    duration: '45 min',
    level: 'Advanced',
    calories: '450',
    color: '#FF6B6B',
  },
  {
    id: 2,
    title: 'HIIT Cardio',
    duration: '30 min',
    level: 'Intermediate',
    calories: '380',
    color: '#4ECDC4',
  }
];

const categories = [
  {
    id: 'strength',
    title: 'Strength',
    icon: Dumbbell,
    color: '#FF6B6B',
    workouts: 24,
  },
  {
    id: 'hiit',
    title: 'HIIT',
    icon: Zap,
    color: '#4ECDC4',
    workouts: 18,
  },
  {
    id: 'cardio',
    title: 'Cardio',
    icon: Timer,
    color: '#45B7D1',
    workouts: 16,
  },
  {
    id: 'endurance',
    title: 'Endurance',
    icon: Flame,
    color: '#96CEB4',
    workouts: 12,
  },
];

export default function WorkoutsScreen() {
  const handleWorkoutPress = (workoutId: number) => {
    router.push(`/workout/${workoutId}`);
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.name}>FitWise</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Workouts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContent}>
            {featuredWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[styles.featuredCard, { backgroundColor: `${workout.color}20` }]}
                onPress={() => handleWorkoutPress(workout.id)}>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{workout.title}</Text>
                  <View style={styles.featuredStats}>
                    <View style={styles.featuredStat}>
                      <Timer size={14} color="#fff" />
                      <Text style={styles.featuredStatText}>{workout.duration}</Text>
                    </View>
                    <View style={styles.featuredStat}>
                      <Flame size={14} color="#fff" />
                      <Text style={styles.featuredStatText}>{workout.calories} cal</Text>
                    </View>
                  </View>
                  <View style={[styles.levelBadge, { backgroundColor: workout.color }]}>
                    <Text style={styles.levelText}>{workout.level}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: `${category.color}20` }]}
                onPress={() => router.push(`/category/${category.id}`)}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <category.icon size={24} color="#fff" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.workouts} workouts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  featuredSection: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featuredContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  featuredStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredStatText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  levelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  categoriesSection: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  categoryCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
});