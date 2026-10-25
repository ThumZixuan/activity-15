/**
// claude-template-fix: leaks-v1
 * PrivacySettingsScreen
 *
 * TODO 5: Create privacy settings screen
 *
 * Your tasks:
 * 1. Load saved consents on mount using ConsentService
 * 2. Implement updateConsent() to save changes
 * 3. Implement handleExportData() to export user data
 * 4. Implement handleDeleteAccount() to clear all data
 *
 * Reference: See Activity 15 MDX for full implementation guide
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
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
import ConsentService from '../services/ConsentService';
import SecureStorageService from '../services/SecureStorageService';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

function PrivacySettingsScreen({ onClose }) {
  const [consents, setConsents] = useState(ConsentService.defaultConsents);
  const [consentDate, setConsentDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsents();
  }, []);

  /**
   * Load saved consent settings
   *
   * TODO: Implement consent loading
   *
   * Steps:
   * 1. Call ConsentService.getConsents()
   * 2. If consents exist, update state with saved values
   * 3. Also save the consentDate for display
   * 4. Set loading to false
   */
  const loadConsents = async () => {
    try {
      const saved = await ConsentService.getConsents();
      if (saved) {
        setConsents({
          essential: true,
          analytics: Boolean(saved.analytics),
          personalization: Boolean(saved.personalization),
          crashReporting: Boolean(saved.crashReporting),
        });
        setConsentDate(saved.consentDate || null);
      }
    } catch (error) {
      console.warn('Could not load privacy settings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a single consent setting
   *
   * TODO: Save consent change immediately
   *
   * @param {string} key - Consent key to update
   * @param {boolean} value - New value
   */
  const updateConsent = async (key, value) => {
    if (key === 'essential') return; // Can't change essential

    const newConsents = { ...consents, [key]: value };
    setConsents(newConsents);

    const result = await ConsentService.saveConsents(newConsents);
    if (result.success) setConsentDate(result.consentDate);
    else showAlert('Save failed', result.error || 'Your privacy settings could not be saved.');
  };

  /**
   * Export user data
   *
   * TODO: Implement data export
   *
   * In a real app, this would:
   * 1. Gather all user data (photos, albums, settings)
   * 2. Create a downloadable file
   * 3. Share or save the file
   */
  const handleExportData = async () => {
    showAlert(
      'Export Your Data',
      'This will create a file with all your photos, albums, and settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            try {
              const payload = {
                exportedAt: new Date().toISOString(),
                app: 'Activity 15 Privacy Implementation',
                privacyConsents: {
                  essential: true,
                  analytics: consents.analytics,
                  personalization: consents.personalization,
                  crashReporting: consents.crashReporting,
                },
                consentDate,
                note: 'This demo export includes available app settings. It does not include original photos or server-side account data.',
              };
              const uri = `${FileSystem.cacheDirectory}privacy-data-export.json`;
              await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Export your data' });
              } else {
                showAlert('Export prepared', `Export file created at: ${uri}`);
              }
            } catch (error) {
              showAlert('Export failed', error.message || 'Could not prepare your data export.');
            }
          },
        },
      ]
    );
  };

  /**
   * Delete all user data
   *
   * TODO: Implement account deletion
   *
   * Steps:
   * 1. Show confirmation dialog
   * 2. Call SecureStorageService.clearAll()
   * 3. Navigate away or reset app state
   */
  const handleDeleteAccount = async () => {
    showAlert(
      'Delete All Data',
      'This will permanently delete all your photos, albums, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            const result = await SecureStorageService.clearAll();
            if (result.success) {
              await ConsentService.saveConsents({
                analytics: false,
                personalization: false,
                crashReporting: false,
              });
              setConsents({ ...ConsentService.defaultConsents });
              setConsentDate(new Date().toISOString());
              showAlert('Data cleared', 'Stored app preferences and known secure keys were cleared. This demo cannot delete photos or data held by external services.');
            } else {
              showAlert('Deletion failed', result.error || 'Could not clear stored data.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header with close button */}
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {consentDate && (
          <Text style={styles.consentDate}>
            Last updated: {new Date(consentDate).toLocaleDateString()}
          </Text>
        )}

        {/* Data Collection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Essential Data</Text>
              <Text style={styles.settingDescription}>
                Required for app functionality
              </Text>
            </View>
            <Switch value={true} disabled={true} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Usage Analytics</Text>
              <Text style={styles.settingDescription}>
                Help improve the app with anonymous usage data
              </Text>
            </View>
            <Switch
              value={consents.analytics}
              onValueChange={(v) => updateConsent('analytics', v)}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Personalization</Text>
              <Text style={styles.settingDescription}>
                Customize your experience
              </Text>
            </View>
            <Switch
              value={consents.personalization}
              onValueChange={(v) => updateConsent('personalization', v)}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Crash Reporting</Text>
              <Text style={styles.settingDescription}>
                Send anonymous error reports to help fix bugs
              </Text>
            </View>
            <Switch
              value={consents.crashReporting}
              onValueChange={(v) => updateConsent('crashReporting', v)}
            />
          </View>
        </View>

        {/* Your Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Text style={styles.actionIcon}>📦</Text>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Export Your Data</Text>
              <Text style={styles.actionDescription}>
                Download a copy of all your data
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.actionIcon}>🗑</Text>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, styles.dangerText]}>
                Delete All Data
              </Text>
              <Text style={styles.actionDescription}>
                Permanently remove all your data
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy Link */}
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>View Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 4,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666666',
  },
  consentDate: {
    fontSize: 12,
    color: '#888888',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    color: '#333333',
  },
  dangerText: {
    color: '#dc2626',
  },
  actionDescription: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#cccccc',
  },
  linkButton: {
    padding: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0066cc',
    fontSize: 16,
  },
});

export default PrivacySettingsScreen;
