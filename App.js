/**
 * Activity 15: Privacy Implementation
 *
 * Learn to protect user privacy with secure storage,
 * metadata stripping, and consent management.
 *
 * Run: npx expo start
 * Press 'w' for web, 'i' for iOS, or 'a' for Android
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Modal, StyleSheet, SafeAreaView } from 'react-native';
import PhotoScreen from './screens/PhotoScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <PhotoScreen onOpenSettings={() => setShowSettings(true)} />

      <Modal
        visible={showSettings}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <PrivacySettingsScreen onClose={() => setShowSettings(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
