import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Kunci Anon dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

let supabase: any;

// Lakukan validasi untuk memastikan variabel tidak kosong
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables:", { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
  // Instead of throwing, create a mock client for development
  console.warn("Using mock Supabase client for development");
  supabase = {
    auth: {
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase };
