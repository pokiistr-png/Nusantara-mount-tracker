import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MapScreen from './src/screens/MapScreen';
import MountainDetailScreen from './src/screens/MountainDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { initLocalDb } from './src/services/localDb';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize local SQLite DB, load mountains.json into local DB on first run
    initLocalDb().catch(err => console.error('DB init error', err));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Nusantara Mount Tracker' }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="MountainDetail" component={MountainDetailScreen} options={{ title: 'Mountain' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
