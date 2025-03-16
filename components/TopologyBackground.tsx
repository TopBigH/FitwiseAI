import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function TopologyBackground() {
  return (
    <View style={styles.container}>
      <Svg style={styles.background} viewBox="0 0 400 800">
        {Array.from({ length: 8 }).map((_, i) => (
          <Path
            key={i}
            d={`M ${Math.random() * 400} ${Math.random() * 800} Q ${Math.random() * 400} ${Math.random() * 800}, ${Math.random() * 400} ${Math.random() * 800}`}
            stroke="rgba(0,102,255,0.1)"
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
    opacity: 0.5,
  },
  background: {
    width: '100%',
    height: '100%',
  },
});