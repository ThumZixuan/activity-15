/**
// claude-template-fix: leaks-v1
 * PrivacyAwareShare Component
 *
 * TODO 3: Create a privacy-aware sharing interface
 *
 * Your tasks:
 * 1. Implement handleShare() to use PhotoPrivacyService
 * 2. Show privacy options before sharing
 * 3. Strip metadata based on user preferences
 * 4. Clean up cache after sharing
 *
 * Reference: See Activity 15 MDX for full implementation guide
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

// Cross-platform alert utility (works on web, iOS, and Android)
const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    const okButton = buttons.find(b => b.text === 'OK' || b.style !== 'cancel');
    const cancelButton = buttons.find(b => b.style === 'cancel');
    if (result && okButton?.onPress) okButton.onPress();
    if (!result && cancelButton?.onPress) cancelButton.onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};
import * as Sharing from 'expo-sharing';
import PhotoPrivacyService from '../services/PhotoPrivacyService';

function PrivacyAwareShare({ photoUri, onClose }) {
  const [privacySettings, setPrivacySettings] = useState({
    stripLocation: true,
    stripCameraInfo: true,
    stripDateTime: true,
  });
  const [processing, setProcessing] = useState(false);

  /**
   * Handle share button press
   *
   * TODO: Implement the sharing workflow
   *
   * Steps:
   * 1. Set processing to true
   * 2. Call PhotoPrivacyService.createShareableCopy() with privacySettings
   * 3. Check if sharing is available using Sharing.isAvailableAsync()
   * 4. Share the photo using Sharing.shareAsync()
   * 5. Clean up cache using PhotoPrivacyService.cleanupShareCache()
   * 6. Call onClose()
   */
  // TODO #3: Run the share flow. Call PhotoPrivacyService.createShareableCopy
  // with the current `privacySettings`. If the result fails, show an error and
  // bail. Otherwise check `Sharing.isAvailableAsync()`, share the resulting
  // URI, and end with `PhotoPrivacyService.cleanupShareCache()`. Always call
  // `onClose()` when the flow finishes (success or handled error).
  // Verify: The shared file has stripped metadata, the OS share sheet appears,
  // and the cache directory is empty after the dialog closes.
  const handleShare = async () => {
    setProcessing(true);
    try {
      const result = await PhotoPrivacyService.createShareableCopy(photoUri, privacySettings);
      if (!result.success) {
        showAlert('Unable to prepare photo', result.error || 'Please try again.');
        return;
      }
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        showAlert('Sharing unavailable', 'Sharing is not supported on this device.');
        return;
      }
      await Sharing.shareAsync(result.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share photo safely',
        UTI: 'public.jpeg',
      });
    } catch (error) {
      showAlert('Error', error.message || 'Failed to share photo.');
      console.error('Share error:', error);
    } finally {
      await PhotoPrivacyService.cleanupShareCache();
      setProcessing(false);
      if (onClose) onClose();
    }
  };

  const updateSetting = (key, value) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Photo</Text>

      <Text style={styles.sectionTitle}>Privacy Options</Text>
      <Text style={styles.description}>
        Remove hidden information from your photo before sharing:
      </Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Remove Location</Text>
          <Text style={styles.settingDescription}>
            GPS coordinates where photo was taken
          </Text>
        </View>
        <Switch
          value={privacySettings.stripLocation}
          onValueChange={(v) => updateSetting('stripLocation', v)}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Remove Device Info</Text>
          <Text style={styles.settingDescription}>
            Phone model and camera details
          </Text>
        </View>
        <Switch
          value={privacySettings.stripCameraInfo}
          onValueChange={(v) => updateSetting('stripCameraInfo', v)}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Remove Date/Time</Text>
          <Text style={styles.settingDescription}>
            When the photo was captured
          </Text>
        </View>
        <Switch
          value={privacySettings.stripDateTime}
          onValueChange={(v) => updateSetting('stripDateTime', v)}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          disabled={processing}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.shareText}>Share Safely</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.privacyNote}>
        ℹ️ All selected information will be permanently removed from the shared
        copy. Your original photo remains unchanged.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  description: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#22c55e',
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  shareText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  privacyNote: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default PrivacyAwareShare;
