import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, TrendingUp, Award, ChevronLeft, ChevronRight, Dumbbell, Timer } from 'lucide-react-native';
import { useState } from 'react';
import GradientBackground from '../../components/GradientBackground';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const weekDays = ['23', '24', '25', '26', '27', '28'];
const currentDate = new Date();

const workoutStats = {
  weeklyWorkouts: 5,
  monthlyWorkouts: 20,
  totalMinutes: 840,
  averageIntensity: 7.5,
};

const recentWorkouts = [
  {
    id: 1,
    name: 'Full Body Power',
    duration: '45 min',
    intensity: 'High',
    calories: 450,
    time: '09:30 AM',
    color: '#FF6B6B',
  },
  {
    id: 2,
    name: 'HIIT Cardio',
    duration: '30 min',
    intensity: 'Medium',
    calories: 380,
    time: '02:15 PM',
    color: '#4ECDC4',
  },
];

const CircularProgress = ({ progress, size }: { progress: number; size: number }) => {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#0066FF"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={progressOffset}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

export default function ProgressScreen() {
  const [selectedDay, setSelectedDay] = useState('24');

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>December 24</Text>
            <Text style={styles.title}>Daily Progress</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>

        <View style={styles.weekSelector}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayButton, selectedDay === day && styles.selectedDay]}>
              <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <CircularProgress progress={67} size={width * 0.5} />
            <View style={styles.progressContent}>
              <Text style={styles.progressPercentage}>67%</Text>
              <Text style={styles.progressLabel}>Daily Goal</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FF6B6B20' }]}>
                <Dumbbell size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.statValue}>{workoutStats.weeklyWorkouts}</Text>
              <Text style={styles.statLabel}>Weekly</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#4ECDC420' }]}>
                <Timer size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.statValue}>{workoutStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#45B7D120' }]}>
                <TrendingUp size={24} color="#45B7D1" />
              </View>
              <Text style={styles.statValue}>{workoutStats.averageIntensity}</Text>
              <Text style={styles.statLabel}>Intensity</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#96CEB420' }]}>
                <Award size={24} color="#96CEB4" />
              </View>
              <Text style={styles.statValue}>{workoutStats.monthlyWorkouts}</Text>
              <Text style={styles.statLabel}>Monthly</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentWorkouts}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {recentWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={[styles.workoutCard, { backgroundColor: `${workout.color}10` }]}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutTime}>{workout.time}</Text>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStat}>
                  <Timer size={16} color="#fff" />
                  <Text style={styles.workoutStatText}>{workout.duration}</Text>
                </View>
                <Text style={styles.workoutStatDot}>•</Text>
                <View style={styles.workoutStat}>
                  <TrendingUp size={16} color="#fff" />
                  <Text style={styles.workoutStatText}>{workout.intensity}</Text>
                </View>
                <Text style={styles.workoutStatDot}>•</Text>
                <View style={styles.workoutStat}>
                  <Award size={16} color="#fff" />
                  <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  title: {
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
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  selectedDay: {
    backgroundColor: '#0066FF',
  },
  dayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  selectedDayText: {
    color: '#fff',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#fff',
    marginBottom: 4,
  },
  progressLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  recentWorkouts: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  workoutTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  workoutStatDot: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
});