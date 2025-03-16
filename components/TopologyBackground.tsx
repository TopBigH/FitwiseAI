import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useMemo } from 'react';

const { width, height } = Dimensions.get('window');

export default function TopologyBackground() {
  // Generate fixed circles for consistent pattern
  const circles = useMemo(() => {
    const baseCircles = [
      { cx: width * 0.2, cy: height * 0.2, r: 40 },
      { cx: width * 0.8, cy: height * 0.3, r: 60 },
      { cx: width * 0.3, cy: height * 0.6, r: 50 },
      { cx: width * 0.7, cy: height * 0.7, r: 45 },
      { cx: width * 0.5, cy: height * 0.4, r: 55 },
      { cx: width * 0.2, cy: height * 0.8, r: 35 },
      { cx: width * 0.8, cy: height * 0.9, r: 40 },
    ];

    return baseCircles.map((circle, i) => ({
      ...circle,
      id: i,
    }));
  }, []);

  // Create fixed connections between circles
  const connections = useMemo(() => {
    return [
      { from: 0, to: 4 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 5, to: 2 },
      { from: 6, to: 3 },
    ].map((conn, i) => ({
      id: i,
      from: circles[conn.from],
      to: circles[conn.to],
    }));
  }, [circles]);

  return (
    <View style={styles.container}>
      <Svg style={styles.background} viewBox={`0 0 ${width} ${height}`}>
        <G opacity={0.15}>
          {/* Draw connections first */}
          {connections.map((conn) => (
            <Path
              key={conn.id}
              d={`M ${conn.from.cx} ${conn.from.cy} Q ${(conn.from.cx + conn.to.cx) / 2} ${
                (conn.from.cy + conn.to.cy) / 2 - 50
              } ${conn.to.cx} ${conn.to.cy}`}
              stroke="rgba(0,102,255,0.3)"
              strokeWidth="2"
              fill="none"
            />
          ))}
          {/* Draw circles on top */}
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="rgba(0,102,255,0.1)"
              stroke="rgba(0,102,255,0.3)"
              strokeWidth="2"
            />
          ))}
        </G>
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