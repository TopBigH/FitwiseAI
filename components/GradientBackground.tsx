import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TopologyBackground from './TopologyBackground';

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#141420', '#1A1A25']}
        style={styles.gradient}
      />
      <TopologyBackground />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});