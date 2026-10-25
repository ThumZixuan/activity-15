/**
 * SecureStorageService
 *
 * This service is COMPLETE and ready to use!
 *
 * It provides two types of storage:
 * 1. SecureStore - For sensitive data (tokens, passwords)
 *    - Hardware-backed encryption on iOS (Keychain)
 *    - Hardware-backed on Android (Keystore)
 *
 * 2. AsyncStorage - For non-sensitive preferences
 *    - Faster but less secure
 *    - Good for settings, theme preferences, etc.
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SecureStorageService {
  // Check if secure storage is available on this device
  static async isSecureAvailable() {
    return await SecureStore.isAvailableAsync();
  }

  // Store sensitive data securely
  static async setSecure(key, value) {
    try {
      // Validate inputs
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid key');
      }
      if (typeof value !== 'string') {
        throw new Error('Value must be a string');
      }

      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });

      return { success: true };
    } catch (error) {
      console.error('Secure storage error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Retrieve sensitive data
  static async getSecure(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return { success: true, value };
    } catch (error) {
      console.error('Secure retrieval error:', error.message);
      return { success: false, value: null, error: error.message };
    }
  }

  // Delete sensitive data
  static async deleteSecure(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return { success: true };
    } catch (error) {
      console.error('Secure deletion error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Store non-sensitive preferences (regular AsyncStorage)
  static async setPreference(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`pref_${key}`, jsonValue);
      return { success: true };
    } catch (error) {
      console.error('Preference storage error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Get non-sensitive preference
  static async getPreference(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(`pref_${key}`);
      const value = jsonValue ? JSON.parse(jsonValue) : defaultValue;
      return { success: true, value };
    } catch (error) {
      console.error('Preference retrieval error:', error.message);
      return { success: false, value: defaultValue };
    }
  }

  // Get all preference keys
  static async getAllPreferenceKeys() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return {
        success: true,
        keys: allKeys.filter((key) => key.startsWith('pref_')),
      };
    } catch (error) {
      return { success: false, keys: [], error: error.message };
    }
  }

  // Clear all stored data (for account deletion)
  static async clearAll() {
    try {
      // Get all AsyncStorage keys
      const allKeys = await AsyncStorage.getAllKeys();
      const prefKeys = allKeys.filter((key) => key.startsWith('pref_'));

      // Clear preferences
      if (prefKeys.length > 0) {
        await AsyncStorage.multiRemove(prefKeys);
      }

      // Clear known secure storage keys
      const secureKeys = ['auth_token', 'refresh_token', 'user_id'];
      for (const key of secureKeys) {
        await SecureStore.deleteItemAsync(key).catch(() => {});
      }

      return { success: true };
    } catch (error) {
      console.error('Clear all error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default SecureStorageService;
