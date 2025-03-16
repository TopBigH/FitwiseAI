import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Timer, Flame } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import GradientBackground from '../../components/GradientBackground';

const categories = [
  {
    id: 'strength',
    title: 'Strength',
    color: '#FF6B6B',
    workouts: 24,
  },
  {
    id: 'hiit',
    title: 'HIIT',
    color: '#4ECDC4',
    workouts: 18,
  },
  {
    id: 'cardio',
    title: 'Cardio',
    color: '#45B7D1',
    workouts: 16,
  },
];

export default function WorkoutsScreen() {
  const [featuredWorkouts, setFeaturedWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedWorkouts();
  }, []);

  const fetchFeaturedWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

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
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setFeaturedWorkouts(data || []);
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

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/category/[id]',
      params: { id: categoryId }
    });
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.name}>FitWise</Text>
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Workouts</Text>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchFeaturedWorkouts}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContent}>
              {loading ? (
                <View style={styles.loadingCard}>
                  <Text style={styles.loadingText}>Loading workouts...</Text>
                </View>
              ) : featuredWorkouts.length > 0 ? (
                featuredWorkouts.map((workout) => (
                  <TouchableOpacity
                    key={workout.id}
                    style={[styles.featuredCard, { backgroundColor: `${categories[0].color}20` }]}
                    onPress={() => handleWorkoutPress(workout.id)}>
                    <View style={styles.featuredContent}>
                      <Text style={styles.featuredTitle}>{workout.title}</Text>
                      <View style={styles.featuredStats}>
                        <View style={styles.featuredStat}>
                          <Timer size={14} color="#fff" />
                          <Text style={styles.featuredStatText}>{workout.duration_minutes} min</Text>
                        </View>
                        <View style={styles.featuredStat}>
                          <Flame size={14} color="#fff" />
                          <Text style={styles.featuredStatText}>450 cal</Text>
                        </View>
                      </View>
                      <View style={[styles.levelBadge, { backgroundColor: categories[0].color }]}>
                        <Text style={styles.levelText}>{workout.difficulty}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No featured workouts available</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: `${category.color}20` }]}
                onPress={() => handleCategoryPress(category.id)}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]} />
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
  errorContainer: {
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
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
  loadingCard: {
    width: 280,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  emptyCard: {
    width: 280,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});