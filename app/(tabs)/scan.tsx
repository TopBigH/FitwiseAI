import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Equipment Scanner</Text>
        <Text style={styles.subtitle}>Scan gym equipment to learn proper form</Text>
      </View>

      <View style={styles.cameraContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80' }}
          style={styles.preview}
        />
        <TouchableOpacity style={styles.captureButton}>
          <Camera size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to scan</Text>
        <Text style={styles.instructionsText}>
          1. Point your camera at any piece of gym equipment{'\n'}
          2. Make sure the equipment is clearly visible{'\n'}
          3. Tap the camera button to scan{'\n'}
          4. Get instant information about proper usage
        </Text>
      </View>

      <View style={styles.recentScans}>
        <Text style={styles.recentTitle}>Recent Scans</Text>
        <View style={styles.scanList}>
          <View style={styles.scanItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&q=80' }}
              style={styles.scanImage}
            />
            <View style={styles.scanInfo}>
              <Text style={styles.scanTitle}>Leg Press Machine</Text>
              <Text style={styles.scanDate}>2 hours ago</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  cameraContainer: {
    aspectRatio: 3/4,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  recentScans: {
    marginBottom: 24,
  },
  recentTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  scanList: {
    gap: 12,
  },
  scanItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanImage: {
    width: 80,
    height: 80,
  },
  scanInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  scanTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scanDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
});