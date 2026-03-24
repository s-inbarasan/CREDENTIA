import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clean the values (remove any accidental labels or extra whitespace)
const cleanUrl = rawUrl?.replace(/Project URL\s*:\s*/i, '').trim();
const cleanKey = rawKey?.replace(/Anon public key\s*:\s*/i, '').trim();

const isValidUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Create a mock client if keys are missing or invalid to prevent the app from crashing on startup
export const supabase = (isValidUrl(cleanUrl) && cleanKey) 
  ? createClient(cleanUrl, cleanKey)
  : createClient('https://placeholder-url.supabase.co', 'placeholder-key');

if (!isValidUrl(cleanUrl) || !cleanKey) {
  console.warn('Supabase URL or Anon Key is missing or invalid. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Settings.');
}
