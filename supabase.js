import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Вставьте сюда ваши данные из Supabase
const supabaseUrl = 'https://zrumcnmfdxhbwnbcdycc.supabase.co';
const supabaseAnonKey = 'sb_publishable_0cQYITKjZTYfXQe6hvdjmA_jPNnemA3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});