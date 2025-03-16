import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Play, Clock, Dumbbell, ChartBar as BarChart } from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';

const exerciseData = {
  id: 1,
  name: 'Barbell Squat',
  description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes. It also engages the core and lower back muscles for stability.',
  difficulty: 'intermediate',
  equipment: ['Barbell', 'Squat Rack'],
  muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
  image: 'https://images.unsplash.com/photo-1566241142704-11fe61e81197?w=500&q=80',
  steps: [
    'Position yourself under the barbell with it resting on your upper back',
    'Unrack the weight and step back, feet shoulder-width apart',
    'Keeping your chest up and core tight, bend your knees and hips to lower yourself',
    'Continue until your thighs are parallel to the ground',
    'Drive through your heels to return to the starting position',
  ],
  tips: [
    'Keep your back straight throughout the movement',
    'Ensure your knees track over your toes',
    'Breathe in as you lower, out as you rise',
    'Start with lighter weights to perfect form',
  ],
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exerciseData.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{exerciseData.name}</Text>
          <Text style={styles.description}>{exerciseData.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Dumbbell size={20} color="#fff" />
              <Text style={styles.statLabel}>Equipment</Text>
              <Text style={styles.statValue}>{exerciseData.equipment.join(', ')}</Text>
            </View>
            <View style={styles.stat}>
              <BarChart size={20} color="#fff" />
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{exerciseData.difficulty}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Muscles</Text>
            <View style={styles.muscles}>
              {exerciseData.muscleGroups.map((muscle, index) => (
                <View key={index} style={styles.muscle}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exerciseData.steps.map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips</Text>
            {exerciseData.tips.map((tip, index) => (
              <View key={index} style={styles.tip}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Play size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Exercise</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 12,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  muscles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  muscleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066FF',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    margin: 20,
    gap: 8,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});