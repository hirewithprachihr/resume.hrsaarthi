import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mtfxwyezotzrzzsyhoay.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'MISSING' // Need anon key

// Wait, I can just look at .env or src/services/supabase.js
