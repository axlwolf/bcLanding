import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Enhanced validation with better error messages
if (!supabaseUrl) {
  console.error('[SUPABASE] Error: NEXT_PUBLIC_SUPABASE_URL environment variable is missing')
  console.error('[SUPABASE] Please add this variable to your Vercel project settings:')
  console.error(
    '[SUPABASE] 1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables'
  )
  console.error('[SUPABASE] 2. Add: NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co')

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required for production deployment')
  }

  // Development fallback
  console.warn('[SUPABASE] Using development fallback. Please configure .env.local')
}

if (!supabaseAnonKey) {
  console.error('[SUPABASE] Error: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is missing')
  console.error('[SUPABASE] Please add this variable to your Vercel project settings:')
  console.error(
    '[SUPABASE] 1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables'
  )
  console.error('[SUPABASE] 2. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key')

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required for production deployment')
  }

  // Development fallback
  console.warn('[SUPABASE] Using development fallback. Please configure .env.local')
}

// Only create client if we have valid credentials
if (supabaseUrl && supabaseAnonKey) {
  console.log('[SUPABASE] Initializing client with URL:', supabaseUrl.substring(0, 30) + '...')
} else {
  console.warn('[SUPABASE] Creating client with fallback values for development')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
)
