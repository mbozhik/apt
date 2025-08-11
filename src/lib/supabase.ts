import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_SUPABASE_URL
const supabaseKey = process.env.NEXT_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Environment variable NEXT_SUPABASE_URL is not set')
}

if (!supabaseKey) {
  throw new Error('Environment variable NEXT_SUPABASE_ANON_KEY is not set')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
