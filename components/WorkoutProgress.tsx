import { View, Text, StyleSheet } from 'react-native';
import { useWorkoutProgress } from '../lib/hooks/useWorkoutProgress';
import { supabase } from '../lib/supabase';

export default function WorkoutProgress() {
  const { data: { user } } = await supabase.auth.getUser();
  const { progress, loading, error } = useWorkoutProgress(user?.id || '');

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statValue}>{progress.weeklyWorkouts}</Text>
        <Text style={styles.statLabel}>This Week</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.stat}>
        <Text style={styles.statValue}>{progress.monthlyWorkouts}</Text>
        <Text style={styles.statLabel}>This Month</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.stat}>
        <Text style={styles.statValue}>{progress.totalMinutes}</Text>
        <Text style={styles.statLabel}>Minutes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
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
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    flex: 1,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    flex: 1,
  },
});