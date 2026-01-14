import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import api from '../services/api';
import { saveUserLocal } from '../services/localDb';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await api.auth.login(email, password);
      const user = res.data;
      // Save locally
      await saveUserLocal(user);
      navigation.replace('Map', { user });
    } catch (err) {
      Alert.alert('Login failed', err?.response?.data?.error || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={{ width: 140, height: 140 }} />
      <Text style={styles.title}>Nusantara Mount Tracker</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Login" onPress={login} />
      <View style={{ height: 12 }} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  input: { width: '100%', padding: 12, borderColor: '#ccc', borderWidth: 1, marginVertical: 8, borderRadius: 6 },
  title: { fontSize: 20, marginVertical: 12 }
});
