import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, Info, ChevronRight } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

const recentScans = [
  {
    id: 1,
    name: 'Leg Press Machine',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&q=80',
  },
  {
    id: 2,
    name: 'Chest Press Machine',
    time: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80',
  },
];

export default function ScanScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Equipment Scanner</Text>
          <Text style={styles.subtitle}>Learn proper form and technique</Text>
        </View>

        <TouchableOpacity style={styles.cameraButton}>
          <View style={styles.cameraIcon}>
            <Camera size={32} color="#fff" />
          </View>
          <Text style={styles.cameraText}>Tap to Scan Equipment</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color="#fff" />
            <Text style={styles.infoTitle}>How to scan</Text>
          </View>
          <Text style={styles.infoText}>
            1. Point your camera at gym equipment{'\n'}
            2. Keep the equipment centered in frame{'\n'}
            3. Hold steady while scanning{'\n'}
            4. View proper form and technique
          </Text>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Scans</Text>
          {recentScans.map((scan) => (
            <TouchableOpacity key={scan.id} style={styles.scanItem}>
              <Image source={{ uri: scan.image }} style={styles.scanImage} />
              <View style={styles.scanInfo}>
                <Text style={styles.scanName}>{scan.name}</Text>
                <Text style={styles.scanTime}>{scan.time}</Text>
              </View>
              <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
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
  cameraButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  recentSection: {
    gap: 16,
  },
  recentTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scanImage: {
    width: 60,
    height: 60,
  },
  scanInfo: {
    flex: 1,
    padding: 16,
  },
  scanName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  scanTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
});