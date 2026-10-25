/**
 * ConsentService
 *
 * TODO 4: Implement privacy consent management
 *
 * Your tasks:
 * 1. Implement getConsents() to retrieve saved consent settings
 * 2. Implement saveConsents() to store user choices
 * 3. Implement hasConsent() to check specific feature consent
 * 4. Implement needsConsent() to check if consent collection is needed
 * 5. Handle consent version changes (re-collect when policy updates)
 *
 * Reference: See Activity 15 MDX for full implementation guide
 */

import SecureStorageService from './SecureStorageService';

const CONSENT_KEY = 'user_privacy_consents';
const CONSENT_VERSION = '1.0'; // Update when privacy policy changes

class ConsentService {
  // Default consent values (opt-out by default for optional items)
  static defaultConsents = {
    essential: true, // Always true, required for app to function
    analytics: false, // Usage tracking - opt-in
    personalization: false, // Personalized features - opt-in
    crashReporting: false, // Error reporting - opt-in
  };

  /**
   * Get current consent settings
   *
   * TODO: Retrieve and validate stored consents
   *
   * Steps:
   * 1. Get stored consents from SecureStorageService
   * 2. Check if consent version matches current CONSENT_VERSION
   * 3. If version matches, return merged consents with defaults
   * 4. If outdated or missing, return null (needs recollection)
   *
   * @returns {Promise<object|null>} Consent settings or null
   */
  static async getConsents() {
    const result = await SecureStorageService.getPreference(CONSENT_KEY);
    if (!result.success || !result.value) return null;
    const saved = result.value;
    if (saved.version !== CONSENT_VERSION || !saved.consents) return null;
    return {
      ...this.defaultConsents,
      ...saved.consents,
      essential: true,
      consentDate: saved.consentDate || null,
    };
  }

  /**
   * Save consent settings
   *
   * TODO: Store user's consent choices
   *
   * Save object structure:
   * {
   *   version: CONSENT_VERSION,
   *   consents: { ... merged with defaults ... },
   *   consentDate: ISO timestamp
   * }
   *
   * @param {object} consents - User's consent choices
   * @returns {Promise<object>} Result with success status
   */
  static async saveConsents(consents) {
    const data = {
      version: CONSENT_VERSION,
      consents: { ...this.defaultConsents, ...consents, essential: true },
      consentDate: new Date().toISOString(),
    };
    const result = await SecureStorageService.setPreference(CONSENT_KEY, data);
    return result.success
      ? { success: true, consentDate: data.consentDate }
      : { success: false, error: result.error || 'Could not save consent settings.' };
  }

  /**
   * Check if user has given consent for a specific feature
   *
   * TODO: Return consent status for a single feature
   *
   * @param {string} feature - Feature key (analytics, personalization, etc.)
   * @returns {Promise<boolean>} True if consent given
   */
  static async hasConsent(feature) {
    const consents = await this.getConsents();
    return Boolean(consents && consents[feature] === true);
  }

  /**
   * Check if consent needs to be collected/recollected
   *
   * TODO: Determine if consent dialog should be shown
   *
   * @returns {Promise<boolean>} True if consent needed
   */
  static async needsConsent() {
    return (await this.getConsents()) === null;
  }

  /**
   * Revoke all optional consents
   * (Complete as an example)
   */
  static async revokeOptionalConsents() {
    return await this.saveConsents({
      analytics: false,
      personalization: false,
      crashReporting: false,
    });
  }

  /**
   * Get consent descriptions for UI
   * (Complete as an example)
   */
  static getConsentDescriptions() {
    return {
      essential: {
        title: 'Essential Data',
        description: 'Required for app functionality',
        required: true,
      },
      analytics: {
        title: 'Usage Analytics',
        description: 'Help improve the app with anonymous usage data',
        required: false,
      },
      personalization: {
        title: 'Personalization',
        description: 'Customize your experience based on usage',
        required: false,
      },
      crashReporting: {
        title: 'Crash Reporting',
        description: 'Send anonymous error reports to help fix bugs',
        required: false,
      },
    };
  }
}

export default ConsentService;
