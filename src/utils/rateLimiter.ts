/**
 * Rate Limiter Utility
 * Protects against Brute-Force and DoS attacks on Login, Signup, Admin access, and API operations.
 */

interface RateLimitRecord {
  attempts: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remainingSeconds: number;
  message?: string;
}

const storagePrefix = 'rl_tracker_';

function getRecords(actionKey: string): number[] {
  try {
    const raw = localStorage.getItem(`${storagePrefix}${actionKey}`);
    if (raw) {
      const parsed: RateLimitRecord = JSON.parse(raw);
      return Array.isArray(parsed.attempts) ? parsed.attempts : [];
    }
  } catch {
    // Ignore storage parse issues
  }
  return [];
}

function saveRecords(actionKey: string, attempts: number[]): void {
  try {
    localStorage.setItem(`${storagePrefix}${actionKey}`, JSON.stringify({ attempts }));
  } catch {
    // Ignore storage set issues
  }
}

/**
 * Checks if an action is allowed within the configured rate limit parameters.
 * @param actionKey - Unique identifier for the action (e.g. 'login', 'signup', 'admin_login')
 * @param maxAttempts - Maximum allowed attempts within the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = 5,
  windowMs: number = 2 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Filter out timestamps older than current window
  const attempts = getRecords(actionKey).filter(ts => ts > windowStart);

  if (attempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...attempts);
    const timeToWaitMs = oldestAttempt + windowMs - now;
    const remainingSeconds = Math.max(1, Math.ceil(timeToWaitMs / 1000));

    return {
      allowed: false,
      remainingSeconds,
      message: `অত্যধিক চেষ্টা করা হয়েছে। অনুগ্রহ করে ${remainingSeconds} সেকেন্ড পর আবার চেষ্টা করুন।`
    };
  }

  return {
    allowed: true,
    remainingSeconds: 0
  };
}

/**
 * Records an attempt for rate limiting calculations.
 */
export function recordAttempt(actionKey: string, windowMs: number = 2 * 60 * 1000): void {
  const now = Date.now();
  const windowStart = now - windowMs;
  const attempts = getRecords(actionKey).filter(ts => ts > windowStart);
  attempts.push(now);
  saveRecords(actionKey, attempts);
}

/**
 * Resets rate limit records for an action upon successful operation.
 */
export function resetRateLimit(actionKey: string): void {
  try {
    localStorage.removeItem(`${storagePrefix}${actionKey}`);
  } catch {
    // Ignore
  }
}
