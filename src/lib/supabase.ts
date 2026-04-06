import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://qprnyjnnegzkqccvezvu.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcm55am5uZWd6a3FjY3ZlenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzA4MTIsImV4cCI6MjA5MDI0NjgxMn0.OU-zMOEHEmpgUxkChI2YDIKS42VUBGtUtLN-XSBjss8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
