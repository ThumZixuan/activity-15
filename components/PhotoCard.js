/**
 * PhotoCard Component
 * A simple photo card with share button for the privacy template
 */

import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

function PhotoCard({ photo, onShare, onViewMetadata }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: photo.uri }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {photo.title}
        </Text>
        <Text style={styles.date}>
          {new Date(photo.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onViewMetadata(photo)}
        >
          <Text style={styles.actionIcon}>ℹ️</Text>
          <Text style={styles.actionText}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => onShare(photo)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  date: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  shareButton: {
    backgroundColor: '#f0f9f4',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  shareText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
});

export default PhotoCard;
