import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '../types/database.types';

const expoExtra = (Constants?.expoConfig as any)?.extra ?? {};
const supabaseUrl: string | undefined = expoExtra?.supabaseUrl;
const supabaseAnonKey: string | undefined = expoExtra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast during development if credentials are missing
  // eslint-disable-next-line no-console
  console.warn('Supabase credentials are missing from app.json extra.');
}

export const supabase = createClient<Database>(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);

export default supabase;




