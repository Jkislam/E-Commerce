/**
 * Error Handling Utility
 * Sanitizes system/database error messages to prevent internal structure leak
 * and provides user-friendly error messages.
 */

export function getSanitizedErrorMessage(error: any, fallbackMessage: string = 'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'): string {
  if (!error) return fallbackMessage;

  // Log actual technical error for internal debugging
  console.error('[System Error Handled]:', error);

  const rawMessage = typeof error === 'string' ? error : error?.message || error?.details || error?.hint || '';

  if (!rawMessage) return fallbackMessage;

  const lowerMsg = rawMessage.toLowerCase();

  // Filter out internal database, table, schema, column, code, or authorization structure details
  const isTechnicalOrSensitive = 
    lowerMsg.includes('postgres') ||
    lowerMsg.includes('postgrest') ||
    lowerMsg.includes('relation') ||
    lowerMsg.includes('column') ||
    lowerMsg.includes('table') ||
    lowerMsg.includes('violates') ||
    lowerMsg.includes('foreign key') ||
    lowerMsg.includes('primary key') ||
    lowerMsg.includes('pgrst') ||
    lowerMsg.includes('schema') ||
    lowerMsg.includes('jwt') ||
    lowerMsg.includes('row-level security') ||
    lowerMsg.includes('rls') ||
    lowerMsg.includes('permission denied') ||
    lowerMsg.includes('auth.uid') ||
    lowerMsg.includes('auth.role') ||
    lowerMsg.includes('null value in column') ||
    lowerMsg.includes('syntax error') ||
    lowerMsg.includes('rpc') ||
    lowerMsg.includes('sql') ||
    lowerMsg.includes('function public.');

  if (isTechnicalOrSensitive) {
    if (lowerMsg.includes('permission denied') || lowerMsg.includes('row-level security') || lowerMsg.includes('rls')) {
      return 'আপনার এই কাজটি করার পর্যাপ্ত অনুমতি নেই।';
    }
    if (lowerMsg.includes('stock') || lowerMsg.includes('insufficient')) {
      return 'পণ্যটির পর্যাপ্ত স্টক নেই।';
    }
    if (lowerMsg.includes('unique') || lowerMsg.includes('duplicate') || lowerMsg.includes('already exists')) {
      return 'এই তথ্যটি ইতিমধ্যে সিস্টেমে বিদ্যমান।';
    }
    return fallbackMessage;
  }

  // If the message is already user-friendly, return it
  return rawMessage;
}

export function showCleanAlert(error: any, fallbackMessage?: string) {
  const cleanMsg = getSanitizedErrorMessage(error, fallbackMessage);
  alert(cleanMsg);
}
