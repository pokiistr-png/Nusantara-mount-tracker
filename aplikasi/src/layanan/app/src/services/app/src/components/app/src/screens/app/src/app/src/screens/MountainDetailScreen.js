import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { saveRouteLocal } from '../services/localDb';
import haversine from 'haversine';

export default function MountainDetailScreen({ route, navigation }) {
  const { mountain, user } = route.params;
  const [selectedRoute] = useState(mountain.routes[0]);

  const measureDistance = (a, b) => {
    const d = haversine({ latitude: a[1], longitude: a[0] }, { latitude: b[1], longitude: b[0] }, { unit: 'km' });
    return (d * 1000).toFixed(0);
  };

  const saveRoute = async () => {
    try {
      const id = `${mountain.id}-${selectedRoute.name}`.replace(/\s+/g, '-');
      await saveRouteLocal({ id, mountain_id: mountain.id, name: selectedRoute.name, coords: selectedRoute.coords });
      Alert.alert('Saved', 'Route saved for offline use');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={styles.title}>{mountain.name} • {mountain.province}</Text>
      <Text style={{ marginVertical: 8 }}>{mountain.description}</Text>
      <Text>Elevation: {mountain.elevation} MDPL</Text>
      <Text>Status: {mountain.status}</Text>

      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: '700' }}>Checkpoints</Text>
      {mountain.checkpoints.map((c, idx) => (
        <View key={idx} style={styles.cp}>
          <Text style={{ fontWeight: '600' }}>{c.name} ({c.type})</Text>
          <Text>Elev: {c.elevation} m</Text>
          <Text>Coords: {c.coords[1].toFixed(6)}, {c.coords[0].toFixed(6)}</Text>
        </View>
      ))}

      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: '700' }}>Route: {selectedRoute.name}</Text>
      {selectedRoute.coords.map((c, i) => (
        <Text key={i}>• {c[1].toFixed(6)}, {c[0].toFixed(6)}</Text>
      ))}

      <View style={{ height: 12 }} />
      <Button title="Save route for offline" onPress={saveRoute} />
      <View style={{ height: 8 }} />
      <Button title="Measure segment distances" onPress={() => {
        let total = 0;
        for (let i = 0; i < selectedRoute.coords.length - 1; i++) {
          const a = selectedRoute.coords[i];
          const b = selectedRoute.coords[i + 1];
          total += parseFloat(measureDistance(a, b));
        }
        Alert.alert('Distance', `Estimated distance: ${(total / 1000).toFixed(2)} km`);
      }} />
      <View style={{ height: 8 }} />
      <Button title={user?.premium ? 'Premium features active' : 'Upgrade to Premium to unlock NPC & full features'} onPress={() => {
        if (!user?.premium) {
          const phone = '6281234567890';
          const msg = encodeURIComponent('Hello, I want to upgrade my Nusantara Mount Tracker account to Premium. Email: ' + (user?.email || ''));
          navigation.navigate('Profile', { user });
          Alert.alert('Upgrade', 'Open Profile to upgrade (WhatsApp link)');
        }
      }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cp: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700' }
});
