import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Timer, Flame, Dumbbell, Zap, Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import GradientBackground from '../../components/GradientBackground';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const categories = [
  {
    id: 'strength',
    title: 'Strength',
    icon: Dumbbell,
    colors: ['#FF6B6B', '#EE5D5D'],
    workouts: 24,
  },
  {
    id: 'hiit',
    title: 'HIIT',
    icon: Zap,
    colors: ['#4ECDC4', '#45B7B0'],
    workouts: 18,
  },
  {
    id: 'cardio',
    title: 'Cardio',
    icon: Heart,
    colors: ['#45B7D1', '#3DA5BD'],
    workouts: 16,
  },
];

export default function WorkoutsScreen() {
  const [featuredWorkouts, setFeaturedWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedWorkouts();
  }, [selectedCategory]);

  const fetchFeaturedWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
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
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query.limit(3);

      if (fetchError) throw fetchError;
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
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      router.push({
        pathname: '/category/[id]',
        params: { id: categoryId }
      });
    }
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

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}>
                <LinearGradient
                  colors={category.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.categoryCardSelected
                  ]}>
                  <View style={styles.categoryIcon}>
                    <category.icon size={24} color="#fff" />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.workouts} workouts</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
                featuredWorkouts.map((workout, index) => {
                  const category = categories.find(c => c.id === workout.category);
                  return (
                    <TouchableOpacity
                      key={workout.id}
                      onPress={() => handleWorkoutPress(workout.id)}>
                      <LinearGradient
                        colors={category?.colors || ['#FF6B6B', '#EE5D5D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.featuredCard}>
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
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>{workout.difficulty}</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No featured workouts available</Text>
                </View>
              )}
            </ScrollView>
          )}
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
  categoriesSection: {
    paddingTop: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: width * 0.4,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  categoryCardSelected: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: 'rgba(255,255,255,0.8)',
  },
  featuredSection: {
    paddingTop: 32,
  },
  featuredContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: width * 0.75,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  featuredStatText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  levelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
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
    width: width * 0.75,
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
    width: width * 0.75,
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