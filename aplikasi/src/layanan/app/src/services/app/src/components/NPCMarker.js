import React, { useEffect, useRef, useState } from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import haversine from 'haversine';

/**
 * NPCMarker:
 * - Walks along the provided routeCoords (array of { latitude, longitude })
 * - Provides distance remaining, ETA and elevation gain estimation (elevation sampled from nearest checkpoint)
 */
export default function NPCMarker({ routeCoords = [], checkpoints = [] }) {
  const [position, setPosition] = useState(routeCoords[0] || null);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const [remaining, setRemaining] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const speedKmph = 4; // average hiking approx 4 km/h (conservative)

  useEffect(() => {
    if (!routeCoords || routeCoords.length < 2) return;
    computeRemaining(routeCoords[0]);
    intervalRef.current = setInterval(step, 1300);
    return () => clearInterval(intervalRef.current);
  }, [routeCoords]);

  const step = () => {
    const nextIndex = indexRef.current + 1;
    if (nextIndex >= routeCoords.length) {
      clearInterval(intervalRef.current);
      return;
    }
    const nextPos = routeCoords[nextIndex];
    setPosition(nextPos);
    indexRef.current = nextIndex;
    computeRemaining(nextPos);
  };

  const computeRemaining = (currentPos) => {
    // compute remaining distance along remaining segments
    let d = 0;
    for (let i = indexRef.current; i < routeCoords.length - 1; i++) {
      const a = routeCoords[i];
      const b = routeCoords[i + 1];
      d += haversine(a, b, { unit: 'km' }) || 0;
    }
    setRemaining((d * 1000).toFixed(0)); // meters
    const etaH = d / speedKmph;
    setEtaMinutes(Math.round(etaH * 60));
  };

  if (!position) return null;

  // elevation gain estimate: difference between current pos (map to nearest checkpoint) and summit if present
  const summit = checkpoints.find(c => c.type === 'summit');
  let elevationGain = 0;
  if (summit) {
    // estimate current elevation by nearest checkpoint elevation
    let nearest = checkpoints[0];
    let minD = Infinity;
    checkpoints.forEach(cp => {
      const d = haversine({ latitude: cp.coords[1], longitude: cp.coords[0] }, position, { unit: 'km' });
      if (d < minD) { minD = d; nearest = cp; }
    });
    elevationGain = Math.max(0, (summit.elevation || 0) - (nearest.elevation || 0));
  }

  return (
    <>
      <Marker coordinate={position}>
        <View style={styles.bubble}>
          <Text style={{ fontWeight: '700' }}>NPC Guide</Text>
          <Text>Remaining: {remaining} m</Text>
          <Text>ETA: {etaMinutes} min</Text>
          <Text>Δelev: {elevationGain} m</Text>
        </View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 6,
    width: 160
  }
});
