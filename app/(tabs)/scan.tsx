import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { router } from 'expo-router';
import { Camera as CameraIcon, Info, ChevronRight, X } from 'lucide-react-native';
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
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const handleScanPress = async () => {
    if (Platform.OS === 'web') {
      alert('Camera scanning is only available in the mobile app. Please download our mobile app for full functionality.');
      return;
    }

    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        return;
      }
    }

    setIsCameraActive(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      // Here you would typically send the photo to your AI model for processing
      console.log('Photo taken:', photo.uri);
      setIsCameraActive(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsCameraActive(false);
    }
  };

  const handleEquipmentPress = (id: number) => {
    router.push(`/equipment/${id}`);
  };

  if (Platform.OS !== 'web' && !permission?.granted && permission?.canAskAgain) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.text}>We need your permission to use the camera</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  if (Platform.OS !== 'web' && !permission?.granted && !permission?.canAskAgain) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.text}>Camera access is required. Please enable it in your device settings.</Text>
        </View>
      </GradientBackground>
    );
  }

  if (isCameraActive && Platform.OS !== 'web') {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={CameraType.back}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsCameraActive(false)}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.scanFrame} />
            <Text style={styles.scanInstructions}>
              Center the equipment in the frame
            </Text>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleCapture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Equipment Scanner</Text>
          <Text style={styles.subtitle}>Learn proper form and technique</Text>
        </View>

        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleScanPress}>
          <View style={styles.iconContainer}>
            <CameraIcon size={32} color="#fff" />
          </View>
          <Text style={styles.scanText}>Tap to Scan Equipment</Text>
          {Platform.OS === 'web' && (
            <Text style={styles.webNote}>
              Download our mobile app for camera functionality
            </Text>
          )}
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
            <TouchableOpacity 
              key={scan.id} 
              style={styles.scanItem}
              onPress={() => handleEquipmentPress(scan.id)}>
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
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  webNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
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
    marginBottom: 8,
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
    marginTop: 40,
  },
  scanFrame: {
    flex: 1,
    margin: 40,
    borderWidth: 2,
    borderColor: '#0066FF',
    borderRadius: 20,
  },
  scanInstructions: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});