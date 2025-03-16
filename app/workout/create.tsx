import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Search, Plus, X, Save } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

const difficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;
type DifficultyLevel = typeof difficultyLevels[number];

const exerciseLibrary = [
  {
    id: 1,
    name: 'Barbell Squat',
    muscleGroups: ['legs', 'core'],
    image: 'https://images.unsplash.com/photo-1566241142704-11fe61e81197?w=500&q=80',
  },
  {
    id: 2,
    name: 'Bench Press',
    muscleGroups: ['chest', 'shoulders'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
  },
];

interface WorkoutExercise {
  id: number;
  sets: number;
  reps: number;
  restSeconds: number;
}

export default function CreateWorkoutScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);

  const handleAddExercise = (exerciseId: number) => {
    if (!selectedExercises.find(e => e.id === exerciseId)) {
      setSelectedExercises([
        ...selectedExercises,
        { id: exerciseId, sets: 3, reps: 12, restSeconds: 60 }
      ]);
    }
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const handleUpdateExercise = (exerciseId: number, updates: Partial<WorkoutExercise>) => {
    setSelectedExercises(selectedExercises.map(exercise => 
      exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
    ));
  };

  const handleSave = async () => {
    // Save workout to database
    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Workout</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}>
            <Save size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter workout title"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter workout description"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {difficultyLevels.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      difficulty === level && styles.difficultyButtonActive
                    ]}
                    onPress={() => setDifficulty(level)}>
                    <Text style={[
                      styles.difficultyButtonText,
                      difficulty === level && styles.difficultyButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            
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

            <View style={styles.selectedExercises}>
              {selectedExercises.map((exercise, index) => {
                const exerciseData = exerciseLibrary.find(e => e.id === exercise.id);
                if (!exerciseData) return null;

                return (
                  <View key={exercise.id} style={styles.selectedExercise}>
                    <View style={styles.exerciseHeader}>
                      <View style={styles.exerciseNumber}>
                        <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.exerciseName}>{exerciseData.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveExercise(exercise.id)}
                        style={styles.removeButton}>
                        <X size={20} color="rgba(255,255,255,0.5)" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.exerciseControls}>
                      <View style={styles.control}>
                        <Text style={styles.controlLabel}>Sets</Text>
                        <TextInput
                          style={styles.controlInput}
                          value={exercise.sets.toString()}
                          onChangeText={(value) => handleUpdateExercise(exercise.id, { sets: parseInt(value) || 0 })}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={styles.control}>
                        <Text style={styles.controlLabel}>Reps</Text>
                        <TextInput
                          style={styles.controlInput}
                          value={exercise.reps.toString()}
                          onChangeText={(value) => handleUpdateExercise(exercise.id, { reps: parseInt(value) || 0 })}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={styles.control}>
                        <Text style={styles.controlLabel}>Rest (s)</Text>
                        <TextInput
                          style={styles.controlInput}
                          value={exercise.restSeconds.toString()}
                          onChangeText={(value) => handleUpdateExercise(exercise.id, { restSeconds: parseInt(value) || 0 })}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={styles.subsectionTitle}>Add Exercises</Text>
            <View style={styles.exerciseGrid}>
              {exerciseLibrary
                .filter(exercise => 
                  exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  !selectedExercises.find(e => e.id === exercise.id)
                )
                .map(exercise => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    onPress={() => handleAddExercise(exercise.id)}>
                    <Text style={styles.exerciseCardName}>{exercise.name}</Text>
                    <Plus size={20} color="#fff" />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  difficultyButtonActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  difficultyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  exercisesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  selectedExercises: {
    gap: 12,
    marginBottom: 24,
  },
  selectedExercise: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#fff',
  },
  exerciseName: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseControls: {
    flexDirection: 'row',
    gap: 12,
  },
  control: {
    flex: 1,
  },
  controlLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  controlInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  subsectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  exerciseGrid: {
    gap: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exerciseCardName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});