import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, Dumbbell, Timer, Flame } from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';

const categories = [
  { id: 'strength', name: 'Strength', icon: Dumbbell, color: '#FF6B6B' },
  { id: 'cardio', name: 'Cardio', icon: Timer, color: '#4ECDC4' },
  { id: 'hiit', name: 'HIIT', icon: Flame, color: '#45B7D1' },
];

const exercises = [
  {
    id: 1,
    name: 'Barbell Squat',
    category: 'strength',
    difficulty: 'intermediate',
    muscleGroups: ['legs', 'core'],
    image: 'https://images.unsplash.com/photo-1566241142704-11fe61e81197?w=500&q=80',
  },
  {
    id: 2,
    name: 'Bench Press',
    category: 'strength',
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
  },
];

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercise Library</Text>
          <Text style={styles.subtitle}>Find the perfect exercise for your workout</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && { backgroundColor: category.color },
              ]}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}>
              <category.icon
                size={20}
                color={selectedCategory === category.id ? '#fff' : category.color}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.exerciseGrid}>
          {filteredExercises.map(exercise => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => router.push(`/exercises/${exercise.id}`)}>
              <View style={styles.exerciseImageContainer}>
                <View style={styles.exerciseImage} />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseTags}>
                  {exercise.muscleGroups.map(muscle => (
                    <View key={muscle} style={styles.tag}>
                      <Text style={styles.tagText}>{muscle}</Text>
                    </View>
                  ))}
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 12,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categories: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  exerciseGrid: {
    padding: 20,
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exerciseImageContainer: {
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  exerciseImage: {
    flex: 1,
  },
  exerciseInfo: {
    padding: 16,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  tagText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});