/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens to prevent Cross-Site Request Forgery attacks.
 */

const CSRF_TOKEN_KEY = 'app_csrf_token';

/**
 * Retrieves the current CSRF token from sessionStorage, or generates a new one if missing.
 */
export function getCsrfToken(): string {
  try {
    let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) {
      token = generateRandomToken();
      sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
  } catch {
    // Fallback if sessionStorage is disabled/blocked
    return generateRandomToken();
  }
}

/**
 * Validates if the provided CSRF token matches the session token.
 */
export function validateCsrfToken(providedToken?: string): boolean {
  if (!providedToken) return false;
  try {
    const sessionToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!sessionToken) return false;
    
    // Constant time comparison
    return constantTimeCompare(providedToken, sessionToken);
  } catch {
    return false;
  }
}

/**
 * Regenerates and saves a new CSRF token (useful after login/logout/sensitive actions).
 */
export function refreshCsrfToken(): string {
  try {
    const newToken = generateRandomToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
    return newToken;
  } catch {
    return generateRandomToken();
  }
}

function generateRandomToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
