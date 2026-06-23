import { createClient } from '@supabase/supabase-js';

// Fallback credentials in case environment variables are missing or incorrect
const FALLBACK_URL = 'https://pdadclhefyotuexvmfpc.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkYWRjbGhlZnlvdHVleHZtZnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODY5ODcsImV4cCI6MjA5MDg2Mjk4N30.4v5DOpooPj1xk8tBLUhMkb8UZuHQnlfCAoUcq44ZWXo';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Use environment variables if they look correct (supabase.co domain), otherwise use fallback
const isUrlValid = rawUrl.includes('supabase.co') && !rawUrl.includes('qprnyjnnegzkqccve');
const finalUrl = isUrlValid ? rawUrl : FALLBACK_URL;
const finalKey = isUrlValid ? rawKey : FALLBACK_KEY;

if (!isUrlValid && rawUrl) {
  console.log('Using production Supabase fallback for stability.');
}

export const supabase = createClient(
  finalUrl,
  finalKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'al_hurumah_auth_v3',
    },
    global: {
      fetch: (...args) => fetch(...args),
    }
  }
);
