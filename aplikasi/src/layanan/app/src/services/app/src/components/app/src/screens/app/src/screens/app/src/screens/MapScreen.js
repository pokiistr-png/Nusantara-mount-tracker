import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Linking from 'expo-linking';
import { getAllMountainsLocal, getUserLocal } from '../services/localDb';
import NPCMarker from '../components/NPCMarker';

export default function MapScreen({ navigation, route }) {
  const [mountains, setMountains] = useState([]);
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [user, setUser] = useState(route.params?.user || null);
  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      const m = await getAllMountainsLocal();
      setMountains(m);
      if (m.length > 0) {
        setSelectedMountain(m[0]);
      }
      if (user) {
        const stored = await getUserLocal(user.email);
        if (stored) setUser(stored);
      }
    })();
  }, []);

  const openProfile = () => navigation.navigate('Profile', { user });

  const openMountain = (m) => {
    setSelectedMountain(m);
    navigation.navigate('MountainDetail', { mountain: m, user });
  };

  const upgradeToPremium = () => {
    const phone = '6281234567890'; // replace with developer number
    const msg = encodeURIComponent('Hello, I want to upgrade my Nusantara Mount Tracker account to Premium. Email: ' + (user?.email || ''));
    Linking.openURL(`https://wa.me/${phone}?text=${msg}`);
    Alert.alert('WhatsApp', 'WhatsApp chat opened. After payment, developer will upgrade your account.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Profile" onPress={openProfile} />
        <Text style={styles.title}>Nusantara Mount Tracker</Text>
        <Button title="Upgrade" onPress={upgradeToPremium} />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -2.5489,
          longitude: 118.0149,
          latitudeDelta: 15,
          longitudeDelta: 15
        }}
      >
        {mountains.map(m => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.checkpoints[0].coords[1], longitude: m.checkpoints[0].coords[0] }}
            title={m.name}
            description={`${m.province} • ${m.elevation} m`}
            onCalloutPress={() => openMountain(m)}
          />
        ))}

        {selectedMountain && selectedMountain.routes.map((r, idx) => (
          <Polyline
            key={idx}
            coordinates={r.coords.map(c => ({ latitude: c[1], longitude: c[0] }))}
            strokeWidth={4}
            strokeColor="#d14747"
          />
        ))}

        {/* NPC demo: for the first route of selected mountain */}
        {selectedMountain && selectedMountain.routes[0] && user?.premium ? (
          <NPCMarker
            routeCoords={selectedMountain.routes[0].coords.map(c => ({ latitude: c[1], longitude: c[0] }))}
            checkpoints={selectedMountain.checkpoints}
          />
        ) : null}
      </MapView>
      <View style={styles.bottomList}>
        <Text style={{ fontWeight: '700' }}>Mountains nearby / list</Text>
        {mountains.slice(0, 8).map(m => (
          <TouchableOpacity key={m.id} onPress={() => openMountain(m)} style={styles.listItem}>
            <Text>{m.name} — {m.province} ({m.elevation} m)</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  container: { flex: 1 },
  map: { flex: 1 },
  bottomList: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 8 },
  listItem: { paddingVertical: 8 }
});
