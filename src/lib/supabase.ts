import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Environment variable NEXT_SUPABASE_URL is not set')
}

if (!supabaseAnonKey) {
  throw new Error('Environment variable NEXT_SUPABASE_ANON_KEY is not set')
}

// Client for public operations (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
