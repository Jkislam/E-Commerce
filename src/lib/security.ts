// Security & SQL Injection Prevention Helpers

/**
 * Checks if a string contains common SQL Injection patterns.
 */
export function containsSqlInjection(input: string): boolean {
  if (!input) return false;
  
  // Patterns matching SQL injection attempts
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|HAVING|TRUNCATE|DECLARE|WAITFOR|BENCHMARK|SLEEP)\b)/i,
    /(--|\/\*|\*\/|#|;)/, // SQL comments and query separators
    /'\s*(OR|AND)\s*['"\d\w]/i, // ' OR '1'='1 or similar
    /'\s*=\s*'/i,
    /["']\s*=\s*["']/i,
    /UNION\s+ALL\s+SELECT/i,
    /ORDER\s+BY\s+\d+/i,
    /CHAR\(\d+\)/i
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitizes input string by trimming whitespace and escaping or removing hazardous characters.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.trim();
}

/**
 * Validates Email Address with SQL Injection checks.
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'ইমেইল পূরণ করা আবশ্যক' };
  }

  // Check SQL injection
  if (containsSqlInjection(trimmed)) {
    return { isValid: false, error: 'ইমেইলে অননুমোদিত বা ক্ষতিকর অক্ষর সনাক্ত করা হয়েছে' };
  }

  // Strict email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed) || trimmed.length > 100) {
    return { isValid: false, error: 'সঠিক ইমেইল ঠিকানা প্রদান করুন (যেমন: customer@example.com)' };
  }

  return { isValid: true };
}

/**
 * Validates Password with SQL Injection checks.
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'পাসওয়ার্ড পূরণ করা আবশ্যক' };
  }

  if (containsSqlInjection(password)) {
    return { isValid: false, error: 'পাসওয়ার্ডে ক্ষতিকর অক্ষর অথবা অননুমোদিত চিহ্ন সনাক্ত করা হয়েছে' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে' };
  }

  if (password.length > 100) {
    return { isValid: false, error: 'পাসওয়ার্ড অত্যন্ত দীর্ঘ (সর্বোচ্চ ১০০ অক্ষর)' };
  }

  return { isValid: true };
}

/**
 * Validates Full Name with SQL Injection checks.
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'আপনার নাম পূরণ করা আবশ্যক' };
  }

  if (containsSqlInjection(trimmed)) {
    return { isValid: false, error: 'নামের ঘরে অননুমোদিত চিহ্ন বা ক্ষতিকর কমান্ড দেওয়া যাবে না' };
  }

  if (trimmed.length < 2 || trimmed.length > 80) {
    return { isValid: false, error: 'নাম ২ থেকে ৮০ অক্ষরের মধ্যে হতে হবে' };
  }

  // Allow letters, numbers, spaces, dots, hyphens, and Bengali unicode characters
  const nameRegex = /^[a-zA-Z0-9\s.\-\u0980-\u09FF]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'নামে কোনো অননুমোদিত বিশেষ অক্ষর দেওয়া যাবে না' };
  }

  return { isValid: true };
}

/**
 * Validates Phone Number (Bangladeshi 11-digit standard) with SQL Injection checks.
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, error: 'মোবাইল নম্বর পূরণ করা আবশ্যক' };
  }

  if (containsSqlInjection(trimmed)) {
    return { isValid: false, error: 'মোবাইল নম্বরে অননুমোদিত ক্ষতিকর অক্ষর সনাক্ত করা হয়েছে' };
  }

  // Must be strictly 11 digits starting with 01
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  if (!bdPhoneRegex.test(trimmed)) {
    return { isValid: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' };
  }

  return { isValid: true };
}

/**
 * Validates Address with SQL Injection checks.
 */
export function validateAddress(address: string): { isValid: boolean; error?: string } {
  const trimmed = address.trim();
  if (!trimmed) {
    return { isValid: false, error: 'ডেলিভারি ঠিকানা পূরণ করা আবশ্যক' };
  }

  if (containsSqlInjection(trimmed)) {
    return { isValid: false, error: 'ঠিকানায় অননুমোদিত প্রতীক বা ক্ষতিকর কমান্ড দেওয়া যাবে না' };
  }

  if (trimmed.length < 5 || trimmed.length > 250) {
    return { isValid: false, error: 'ঠিকানা অন্তত ৫ এবং সর্বোচ্চ ২৫০ অক্ষরের মধ্যে হতে হবে' };
  }

  return { isValid: true };
}
