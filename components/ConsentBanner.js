/**
 * ConsentBanner Component
 *
 * This component is COMPLETE and shows the initial consent collection UI.
 * Use it as a reference for how consent flows work.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ConsentService from '../services/ConsentService';

function ConsentBanner({ onComplete }) {
  const descriptions = ConsentService.getConsentDescriptions();
  const [consents, setConsents] = useState({
    essential: true,
    analytics: false,
    personalization: false,
    crashReporting: false,
  });

  const handleToggle = (key) => {
    if (key === 'essential') return; // Can't toggle essential
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = async () => {
    const allConsents = {
      essential: true,
      analytics: true,
      personalization: true,
      crashReporting: true,
    };
    await ConsentService.saveConsents(allConsents);
    onComplete(allConsents);
  };

  const handleAcceptSelected = async () => {
    await ConsentService.saveConsents(consents);
    onComplete(consents);
  };

  const handleRejectOptional = async () => {
    const minimalConsents = {
      essential: true,
      analytics: false,
      personalization: false,
      crashReporting: false,
    };
    await ConsentService.saveConsents(minimalConsents);
    onComplete(minimalConsents);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.banner}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Your Privacy Matters</Text>

          <Text style={styles.description}>
            We collect some data to make the app work and improve your
            experience. You control what we collect.
          </Text>

          {/* Consent Options */}
          {Object.entries(descriptions).map(([key, info]) => (
            <View key={key} style={styles.consentRow}>
              <View style={styles.consentInfo}>
                <Text style={styles.consentTitle}>
                  {info.title}
                  {info.required && (
                    <Text style={styles.required}> (Required)</Text>
                  )}
                </Text>
                <Text style={styles.consentDescription}>{info.description}</Text>
              </View>
              <Switch
                value={consents[key]}
                onValueChange={() => handleToggle(key)}
                disabled={info.required}
              />
            </View>
          ))}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptAllButton]}
              onPress={handleAcceptAll}
            >
              <Text style={styles.acceptAllText}>Accept All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptSelectedButton]}
              onPress={handleAcceptSelected}
            >
              <Text style={styles.acceptSelectedText}>Accept Selected</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleRejectOptional}
            >
              <Text style={styles.rejectText}>Essential Only</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            You can change these settings anytime in Privacy Settings.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  consentInfo: {
    flex: 1,
    marginRight: 12,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  required: {
    fontWeight: 'normal',
    color: '#888888',
    fontSize: 12,
  },
  consentDescription: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptAllButton: {
    backgroundColor: '#22c55e',
  },
  acceptAllText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptSelectedButton: {
    backgroundColor: '#0066cc',
  },
  acceptSelectedText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  rejectButton: {
    backgroundColor: '#f0f0f0',
  },
  rejectText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ConsentBanner;
