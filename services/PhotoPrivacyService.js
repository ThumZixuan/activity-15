import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

class PhotoPrivacyService {
  static async stripMetadata(uri) {
    try {
      if (!uri) throw new Error('A photo URI is required.');
      // Re-encoding creates a fresh JPEG without the original EXIF metadata.
      const result = await ImageManipulator.manipulateAsync(
        uri, [], { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      return { success: true, uri: result.uri, metadataStripped: true };
    } catch (error) {
      return { success: false, uri, metadataStripped: false, error: error.message };
    }
  }

  static async prepareForSharing(uri, options = {}) {
    const { stripLocation = true, stripCameraInfo = true, stripDateTime = true } = options;
    // ImageManipulator cannot selectively edit EXIF fields. If any removal is
    // selected, remove the entire EXIF block to avoid leaking other metadata.
    if (stripLocation || stripCameraInfo || stripDateTime) return this.stripMetadata(uri);
    return { success: true, uri, metadataStripped: false };
  }

  static async generateAnonymousFilename() {
    const bytes = await Crypto.getRandomBytesAsync(16);
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `photo_${hex}.jpg`;
  }

  static async createShareableCopy(uri, options = {}) {
    try {
      const prepared = await this.prepareForSharing(uri, options);
      if (!prepared.success) throw new Error(prepared.error || 'Could not prepare photo.');
      const filename = await this.generateAnonymousFilename();
      const cacheDir = `${FileSystem.cacheDirectory}share/`;
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true }).catch(() => {});
      const destination = `${cacheDir}${filename}`;
      await FileSystem.copyAsync({ from: prepared.uri, to: destination });
      if (prepared.uri !== uri && prepared.uri !== destination) {
        await FileSystem.deleteAsync(prepared.uri, { idempotent: true }).catch(() => {});
      }
      return { success: true, uri: destination, filename, metadataStripped: prepared.metadataStripped };
    } catch (error) {
      return { success: false, uri, filename: null, metadataStripped: false, error: error.message };
    }
  }

  static async cleanupShareCache() {
    try {
      const cacheDir = `${FileSystem.cacheDirectory}share/`;
      await FileSystem.deleteAsync(cacheDir, { idempotent: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default PhotoPrivacyService;
