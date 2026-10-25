// Sample photo data for testing privacy features
// Each photo simulates having metadata that could be stripped

export const SAMPLE_PHOTOS = [
  {
    id: '1',
    uri: 'https://picsum.photos/seed/privacy1/400/400',
    title: 'Mountain View',
    createdAt: '2024-11-15T10:30:00Z',
    // Simulated EXIF metadata (in a real app, this would be embedded)
    metadata: {
      location: { lat: 37.7749, lng: -122.4194 },
      device: 'iPhone 14 Pro',
      camera: 'Back Triple Camera',
      datetime: '2024-11-15T10:30:00Z',
    },
  },
  {
    id: '2',
    uri: 'https://picsum.photos/seed/privacy2/400/400',
    title: 'City Night',
    createdAt: '2024-11-16T22:15:00Z',
    metadata: {
      location: { lat: 40.7128, lng: -74.0060 },
      device: 'Samsung Galaxy S24',
      camera: '50MP Wide Camera',
      datetime: '2024-11-16T22:15:00Z',
    },
  },
  {
    id: '3',
    uri: 'https://picsum.photos/seed/privacy3/400/400',
    title: 'Beach Sunset',
    createdAt: '2024-11-17T18:45:00Z',
    metadata: {
      location: { lat: 25.7617, lng: -80.1918 },
      device: 'Google Pixel 8',
      camera: '50MP Octa PD Camera',
      datetime: '2024-11-17T18:45:00Z',
    },
  },
  {
    id: '4',
    uri: 'https://picsum.photos/seed/privacy4/400/400',
    title: 'Garden Flowers',
    createdAt: '2024-11-18T09:20:00Z',
    metadata: {
      location: { lat: 51.5074, lng: -0.1278 },
      device: 'iPhone 15',
      camera: '48MP Main Camera',
      datetime: '2024-11-18T09:20:00Z',
    },
  },
];

// Helper to format metadata for display
export function formatMetadata(metadata) {
  if (!metadata) return 'No metadata';

  const parts = [];

  if (metadata.location) {
    parts.push(`📍 ${metadata.location.lat.toFixed(4)}, ${metadata.location.lng.toFixed(4)}`);
  }
  if (metadata.device) {
    parts.push(`📱 ${metadata.device}`);
  }
  if (metadata.datetime) {
    parts.push(`📅 ${new Date(metadata.datetime).toLocaleString()}`);
  }

  return parts.join('\n');
}
