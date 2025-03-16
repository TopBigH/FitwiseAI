import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect } from 'react-native-svg';

export default function TopologyBackground() {
  return (
    <View style={styles.container}>
      <Svg style={styles.background} viewBox="0 0 400 800">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00EAFF" />
            <Stop offset="33%" stopColor="#4D3589" />
            <Stop offset="66%" stopColor="#BADAFF" />
            <Stop offset="100%" stopColor="#0025CE" />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="800" fill="url(#grad)" />
        
        {/* Topology Lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Path
            key={i}
            d={`M ${Math.random() * 400} ${Math.random() * 800} Q ${Math.random() * 400} ${Math.random() * 800}, ${Math.random() * 400} ${Math.random() * 800}`}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  background: {
    width: '100%',
    height: '100%',
  },
});