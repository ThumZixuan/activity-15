/**
 * PhotoScreen - Main photo gallery with privacy features
 *
 * This screen is mostly COMPLETE. It demonstrates:
 * - Photo grid with sample data
 * - Metadata viewing
 * - Privacy-aware sharing UI
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import PhotoCard from '../components/PhotoCard';
import PrivacyAwareShare from '../components/PrivacyAwareShare';
import ConsentBanner from '../components/ConsentBanner';
import ConsentService from '../services/ConsentService';
import { SAMPLE_PHOTOS, formatMetadata } from '../utils/SamplePhotos';

function PhotoScreen({ onOpenSettings }) {
  const [photos] = useState(SAMPLE_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    const needsConsent = await ConsentService.needsConsent();
    setShowConsentBanner(needsConsent);
  };

  const handleConsentComplete = (consents) => {
    setShowConsentBanner(false);
    console.log('Consents saved:', consents);
  };

  const handleShare = (photo) => {
    setSelectedPhoto(photo);
    setShowShareModal(true);
  };

  const handleViewMetadata = (photo) => {
    setSelectedPhoto(photo);
    setShowMetadataModal(true);
  };

  const renderPhoto = ({ item }) => (
    <PhotoCard
      photo={item}
      onShare={handleShare}
      onViewMetadata={handleViewMetadata}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Creative Studio</Text>
          <Text style={styles.subtitle}>{photos.length} photos</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={onOpenSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy info banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>🔒</Text>
        <Text style={styles.infoText}>
          Tap Share to see privacy options for removing photo metadata
        </Text>
      </View>

      {/* Photo Grid */}
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <PrivacyAwareShare
            photoUri={selectedPhoto?.uri}
            onClose={() => setShowShareModal(false)}
          />
        </View>
      </Modal>

      {/* Metadata Modal */}
      <Modal
        visible={showMetadataModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowMetadataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.metadataCard}>
            <Text style={styles.metadataTitle}>Photo Metadata</Text>
            <Text style={styles.metadataSubtitle}>
              This hidden data is embedded in your photos
            </Text>

            <View style={styles.metadataContent}>
              <Text style={styles.metadataText}>
                {selectedPhoto && formatMetadata(selectedPhoto.metadata)}
              </Text>
            </View>

            <Text style={styles.warningText}>
              ⚠️ This information can reveal your location and device when you
              share photos!
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMetadataModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Consent Banner (shows on first launch) */}
      {showConsentBanner && (
        <ConsentBanner onComplete={handleConsentComplete} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  grid: {
    padding: 8,
    paddingTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  metadataCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 24,
  },
  metadataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  metadataSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  metadataContent: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
  },
  warningText: {
    fontSize: 13,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PhotoScreen;
