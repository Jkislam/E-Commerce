/**
 * Secure Storage Utility
 * Encrypts / Obfuscates data stored in localStorage to prevent plain-text exposure
 * of sensitive information such as payment numbers, order data, and settings.
 */

const STORAGE_KEY_PREFIX = 'sec_al_hurumah_';
const SECRET_SALT = 'al_hurumah_v1_secure_salt_key_99';

// XOR Obfuscation + Base64 Encoding to ensure local storage values are encrypted/obfuscated
function encryptData(data: string): string {
  try {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(encodeURIComponent(result));
  } catch (e) {
    // Fallback if encoding fails
    return btoa(encodeURIComponent(data));
  }
}

function decryptData(encryptedStr: string): string {
  try {
    const raw = decodeURIComponent(atob(encryptedStr));
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    // Fallback if decryption fails (e.g. if legacy unencrypted base64 or plaintext was stored)
    try {
      return decodeURIComponent(atob(encryptedStr));
    } catch {
      return encryptedStr;
    }
  }
}

export const secureStorage = {
  /**
   * Securely saves an item into localStorage with encryption
   */
  setItem: (key: string, value: any): void => {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = encryptData(jsonString);
      localStorage.setItem(STORAGE_KEY_PREFIX + key, encrypted);
      // Clean up legacy unencrypted plain-text key if it exists
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`SecureStorage failed to set key: ${key}`, e);
    }
  },

  /**
   * Retrieves and decrypts an item from localStorage.
   * Also seamlessly migrates legacy plain-text keys if present.
   */
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      // 1. Check for encrypted key first
      const encrypted = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (encrypted) {
        const decryptedStr = decryptData(encrypted);
        return JSON.parse(decryptedStr) as T;
      }

      // 2. Fallback check for legacy unencrypted key
      const legacyRaw = localStorage.getItem(key);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw) as T;
          // Seamlessly re-save as encrypted and clean up plain-text legacy key
          secureStorage.setItem(key, parsed);
          localStorage.removeItem(key);
          return parsed;
        } catch {
          // Ignore invalid JSON
        }
      }
    } catch (e) {
      console.error(`SecureStorage failed to get key: ${key}`, e);
    }
    return defaultValue;
  },

  /**
   * Removes an item from storage (both encrypted key and legacy key)
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + key);
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`SecureStorage failed to remove key: ${key}`, e);
    }
  }
};
