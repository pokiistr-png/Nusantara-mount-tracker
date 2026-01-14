import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveUserLocal, getUserLocal } from '../services/localDb';

export default function ProfileScreen({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [photo, setPhoto] = useState(user?.photo || '');

  useEffect(() => {
    (async () => {
      if (!user && email) {
        const local = await getUserLocal(email);
        if (local) {
          setUser(local);
          setName(local.name);
          setPhoto(local.photo);
        }
      }
    })();
  }, []);

  const choosePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6 });
    if (!res.cancelled) {
      const base64Uri = `data:image/jpeg;base64,${res.base64}`;
      setPhoto(base64Uri);
    }
  };

  const saveProfile = async () => {
    try {
      const u = { email, name, photo, premium: user?.premium };
      await saveUserLocal(u);
      Alert.alert('Saved');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const upgrade = () => {
    // WhatsApp upgrade flow
    const phone = '6281234567890';
    const msg = encodeURIComponent('Hello, I want to upgrade my Nusantara Mount Tracker account to Premium. Email: ' + (email || ''));
    const url = `https://wa.me/${phone}?text=${msg}`;
    navigation.popToTop();
    Alert.alert('Open WhatsApp', 'Open WhatsApp to contact developer for Premium upgrade:\n' + url);
  };

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Profile</Text>
      <Image source={photo ? { uri: photo } : require('../../assets/avatar-placeholder.png')} style={{ width: 120, height: 120, borderRadius: 60, marginVertical: 12 }} />
      <Button title="Change photo" onPress={choosePhoto} />
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <Text style={{ marginVertical: 8 }}>Email: {email}</Text>
      <Text>Account: {user?.premium ? 'Premium' : 'Free'}</Text>
      <View style={{ height: 12 }} />
      <Button title="Save profile locally" onPress={saveProfile} />
      <View style={{ height: 8 }} />
      <Button title="Upgrade to Premium (WhatsApp)" onPress={upgrade} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginVertical: 8, borderRadius: 6 }
});
