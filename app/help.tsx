import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Mail, Globe } from 'lucide-react-native';
import GradientBackground from '../components/GradientBackground';

export default function HelpScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Mail size={24} color="#fff" />
              <Text style={styles.contactButtonText}>support@fitwise.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Globe size={24} color="#fff" />
              <Text style={styles.contactButtonText}>www.fitwise.com</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FAQs</Text>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I track my workouts?</Text>
              <Text style={styles.faqAnswer}>
                Start a workout from the home screen, follow along with the exercises, and mark them complete as you go. Your progress will be automatically saved.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Can I create custom workouts?</Text>
              <Text style={styles.faqAnswer}>
                Yes! Tap the + button on the home screen to create a new custom workout. You can add exercises, set repetitions, and customize rest periods.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How does the equipment scanner work?</Text>
              <Text style={styles.faqAnswer}>
                Point your camera at gym equipment to get instant information about proper form, targeted muscles, and exercise suggestions.
              </Text>
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
    marginRight: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  faqItem: {
    marginBottom: 24,
  },
  faqQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
});