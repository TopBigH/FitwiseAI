import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, TrendingUp, Award } from 'lucide-react-native';

const days = ['23', '24', '25', '26', '27', '28'];
const activities = [
  { id: 1, title: 'Swimming', duration: '40 min', calories: 320, time: '09:00 AM' },
  { id: 2, title: 'Body Building', duration: '50 min', calories: 450, time: '11:30 AM' },
  { id: 3, title: 'Running', duration: '30 min', calories: 280, time: '04:00 PM' },
];

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Activities</Text>
          <Text style={styles.date}>December 24</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendar}
          contentContainerStyle={styles.calendarContent}>
          {days.map((day, index) => (
            <View
              key={day}
              style={[styles.dayCard, day === '24' && styles.dayCardActive]}>
              <Text style={[styles.dayText, day === '24' && styles.dayTextActive]}>
                {day}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.progressCircle}>
          <View style={styles.circleContent}>
            <Text style={styles.percentage}>67%</Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Wake Time</Text>
                <Text style={styles.timeValue}>06:30</Text>
              </View>
              <View style={styles.timeDivider} />
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Active Time</Text>
                <Text style={styles.timeValue}>12:52</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.activities}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={styles.activityStat}>{activity.duration}</Text>
                <Text style={styles.activityDot}>•</Text>
                <Text style={styles.activityStat}>{activity.calories} cal</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#999',
  },
  calendar: {
    marginBottom: 24,
  },
  calendarContent: {
    gap: 12,
  },
  dayCard: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCardActive: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#999',
  },
  dayTextActive: {
    color: '#fff',
  },
  progressCircle: {
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    padding: 20,
    marginBottom: 24,
  },
  circleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#fff',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  timeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  timeDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
  },
  activities: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  activityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
  },
  activityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityStat: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
  },
  activityDot: {
    color: '#666',
  },
});