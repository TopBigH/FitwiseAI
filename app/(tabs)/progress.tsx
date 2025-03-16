import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, TrendingUp, Award, ChevronLeft, ChevronRight, Dumbbell, Timer, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../../components/GradientBackground';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getLastSevenDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date,
      dayName: weekDays[date.getDay()],
      dayNumber: date.getDate(),
    });
  }
  return days;
};

export default function ProgressScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [workoutStats, setWorkoutStats] = useState({
    weeklyWorkouts: 0,
    monthlyWorkouts: 0,
    totalMinutes: 0,
    averageIntensity: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutStats();
    fetchRecentWorkouts();
  }, [selectedDay]);

  const fetchWorkoutStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      const { data: workouts, error } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', startOfMonth.toISOString());

      if (error) throw error;

      const weeklyWorkouts = workouts.filter(w => 
        new Date(w.started_at) >= startOfWeek
      ).length;

      const totalMinutes = workouts.reduce((acc, w) => {
        if (w.completed_at) {
          const duration = (new Date(w.completed_at).getTime() - new Date(w.started_at).getTime()) / 1000 / 60;
          return acc + duration;
        }
        return acc;
      }, 0);

      setWorkoutStats({
        weeklyWorkouts,
        monthlyWorkouts: workouts.length,
        totalMinutes: Math.round(totalMinutes),
        averageIntensity: workouts.length > 0 
          ? Math.round(workouts.reduce((acc, w) => acc + (w.progress_percentage || 0), 0) / workouts.length)
          : 0,
      });
    } catch (error) {
      console.error('Error fetching workout stats:', error);
    }
  };

  const fetchRecentWorkouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfDay = new Date(selectedDay);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDay);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: workouts, error } = await supabase
        .from('user_workouts')
        .select(`
          *,
          workout:workout_templates (
            title,
            category,
            duration_minutes
          )
        `)
        .eq('user_id', user.id)
        .gte('started_at', startOfDay.toISOString())
        .lte('started_at', endOfDay.toISOString())
        .order('started_at', { ascending: false });

      if (error) throw error;
      setRecentWorkouts(workouts || []);
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return ['#FF416C', '#FF4B2B'];
      case 'hiit': return ['#7928CA', '#FF0080'];
      case 'cardio': return ['#00B4DB', '#0083B0'];
      default: return ['#0066FF', '#0044AA'];
    }
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FF416C20' }]}>
              <Dumbbell size={24} color="#FF416C" />
            </View>
            <Text style={styles.statValue}>{workoutStats.weeklyWorkouts}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#7928CA20' }]}>
              <Calendar size={24} color="#7928CA" />
            </View>
            <Text style={styles.statValue}>{workoutStats.monthlyWorkouts}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#00B4DB20' }]}>
              <Timer size={24} color="#00B4DB" />
            </View>
            <Text style={styles.statValue}>{workoutStats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#0066FF20' }]}>
              <TrendingUp size={24} color="#0066FF" />
            </View>
            <Text style={styles.statValue}>{workoutStats.averageIntensity}%</Text>
            <Text style={styles.statLabel}>Intensity</Text>
          </View>
        </View>

        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendar}>
            {getLastSevenDays().map((day) => (
              <TouchableOpacity
                key={day.date.toISOString()}
                style={[
                  styles.dayButton,
                  selectedDay.toDateString() === day.date.toDateString() && styles.selectedDay
                ]}
                onPress={() => setSelectedDay(day.date)}>
                <Text style={[
                  styles.dayName,
                  selectedDay.toDateString() === day.date.toDateString() && styles.selectedDayText
                ]}>
                  {day.dayName}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  selectedDay.toDateString() === day.date.toDateString() && styles.selectedDayText
                ]}>
                  {day.dayNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.workoutsSection}>
          <Text style={styles.sectionTitle}>Workouts</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading workouts...</Text>
            </View>
          ) : recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <TouchableOpacity key={workout.id}>
                <LinearGradient
                  colors={getCategoryColor(workout.workout?.category)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName}>{workout.workout?.title}</Text>
                    <Text style={styles.workoutTime}>
                      {new Date(workout.started_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                  <View style={styles.workoutStats}>
                    <View style={styles.workoutStat}>
                      <Timer size={16} color="#fff" />
                      <Text style={styles.workoutStatText}>
                        {workout.workout?.duration_minutes} min
                      </Text>
                    </View>
                    <Text style={styles.workoutStatDot}>•</Text>
                    <View style={styles.workoutStat}>
                      <TrendingUp size={16} color="#fff" />
                      <Text style={styles.workoutStatText}>
                        {workout.progress_percentage}% Complete
                      </Text>
                    </View>
                    <Text style={styles.workoutStatDot}>•</Text>
                    <View style={styles.workoutStat}>
                      <Flame size={16} color="#fff" />
                      <Text style={styles.workoutStatText}>
                        {workout.calories_burned || '---'} cal
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workouts completed on this day</Text>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
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
  calendarSection: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  calendar: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    width: 64,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedDay: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  dayName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  selectedDayText: {
    color: '#fff',
  },
  workoutsSection: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    color: 'rgba(255,255,255,0.9)',
  },
  workoutStatDot: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
});