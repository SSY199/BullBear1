import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Please define SUPABASE_URL and SUPABASE_ANON_KEY inside .env.local");
}

// Export the client to be used anywhere in your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);