/**
 * Supabase client & helpers — v2.1 (hardened auth + retry logic)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken : true,
    persistSession   : true,
    detectSessionInUrl: true,
    storageKey       : 'hwp-auth',   // Consistent key for all storage ops
  },
})

// ── Helper: delay ────────────────────────────────────────────
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// ── Helper: race with timeout ────────────────────────────────
function withTimeout(promise, ms, rejectMessage) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(rejectMessage)), ms)
  )
  return Promise.race([promise, timeoutPromise])
}

// ── Auth ─────────────────────────────────────────────────────

/**
 * Sign up with email + password.
 * 15s timeout — network conditions in India can be slow.
 */
export const signUp = async (email, password, name) => {
  const { data, error } = await withTimeout(
    supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    }),
    15000,
    'Signup timed out. Please check your connection and try again.'
  )
  if (error) throw error
  return data
}

/**
 * Sign in with email + password.
 * FIXED: 15s timeout (was 7s — too aggressive for 3G/slow connections).
 * Auto-retries once on network error only (not on auth failures).
 */
export const signIn = async (email, password) => {
  const attemptSignIn = () =>
    withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      15000,
      'Login timed out. Please check your connection and try again.'
    )

  let lastError
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, error } = await attemptSignIn()
      if (error) {
        // Auth errors (wrong password, unconfirmed email) — don't retry
        if (
          error.message?.includes('Invalid login') ||
          error.message?.includes('Email not confirmed') ||
          error.message?.includes('Invalid credentials') ||
          error.status === 400
        ) {
          throw error
        }
        // Network/server errors — retry once
        lastError = error
        if (attempt < 2) {
          console.warn(`[Supabase] signIn attempt ${attempt} failed (network), retrying…`)
          await delay(1500)
          continue
        }
        throw error
      }
      return data
    } catch (err) {
      lastError = err
      // Don't retry on auth errors
      if (
        err.message?.includes('Invalid login') ||
        err.message?.includes('Email not confirmed') ||
        err.message?.includes('Invalid credentials') ||
        err.message?.includes('timed out')
      ) {
        throw err
      }
      if (attempt < 2) {
        console.warn(`[Supabase] signIn attempt ${attempt} exception, retrying…`)
        await delay(1500)
      }
    }
  }
  throw lastError
}

export const signOut = async () => {
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000))
  const { error } = await Promise.race([
    supabase.auth.signOut(),
    timeoutPromise.then(() => ({ error: null })) // Force resolve on timeout so local cleanup always runs
  ])
  if (error) throw error
}

/**
 * Safe getSession wrapper — prevents lock-induced hangs.
 * Returns null session (not an error) if Supabase auth lock is stuck.
 * Timeout is 6s to avoid false-positive fires during React StrictMode
 * double-invoke (which holds the GoTrue lock briefly on second mount).
 */
export const getSession = async () => {
  try {
    return await withTimeout(
      supabase.auth.getSession(),
      6000,
      'SESSION_LOCK_TIMEOUT'
    )
  } catch (err) {
    if (err.message === 'SESSION_LOCK_TIMEOUT') {
      console.info('[Supabase] getSession took >6s — returning null to unblock UI.')
      return { data: { session: null }, error: null }
    }
    throw err
  }
}

export const onAuthStateChange = (cb) => {
  try {
    return supabase.auth.onAuthStateChange(cb)
  } catch (err) {
    console.error('[Supabase] onAuthStateChange failed:', err)
    // Return a no-op subscription to avoid destructuring errors in caller
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
}

// ── Profile ──────────────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const upsertProfile = async (profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updatePlan = async (userId, plan, razorpaySubscriptionId = null) => {
  const payload = { id: userId, plan, updated_at: new Date().toISOString() }
  if (razorpaySubscriptionId) payload.razorpay_subscription_id = razorpaySubscriptionId
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Resumes ──────────────────────────────────────────────────
export const saveResumeToDb = async (userId, resume) => {
  const payload = {
    id         : resume.id,
    user_id    : userId,
    title      : resume.title || 'My Resume',
    template_id: resume.settings?.templateId || 'ats-classic',
    resume_data: resume.data,
    settings   : resume.settings,
    ats_score  : resume.atsScore || 0,
    updated_at : new Date().toISOString(),
    job_description: resume.jobDescription || '',
  }
  const { data, error } = await supabase
    .from('resumes')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export const getResumes = async (userId) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  // Normalize to the same shape used by local store
  return data.map(r => ({
    id        : r.id,
    title     : r.title,
    data      : r.resume_data,
    settings  : r.settings,
    atsScore  : r.ats_score,
    updatedAt : r.updated_at,
    createdAt : r.created_at,
    jobDescription: r.job_description || '',
    isPublic  : r.is_public ?? false,
  }))
}

export const deleteResumeFromDb = async (id) => {
  const { error } = await supabase.from('resumes').delete().eq('id', id)
  if (error) throw error
}

export const togglePublic = async (id, isPublic) => {
  const { data, error } = await supabase
    .from('resumes')
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getPublicResume = async (id) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()
  if (error) throw error
  return {
    id        : data.id,
    title     : data.title,
    data      : data.resume_data,
    settings  : data.settings,
    atsScore  : data.ats_score,
    updatedAt : data.updated_at,
    user_id   : data.user_id,
  }
}

// ── Job applications (candidate tracker) ─────────────────────────
export const fetchJobApplications = async (userId) => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const createJobApplication = async (row) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert(row)
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateJobApplication = async (id, patch) => {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteJobApplication = async (id) => {
  const { error } = await supabase.from('job_applications').delete().eq('id', id)
  if (error) throw error
}

// ── Cover letters (persisted versions) ─────────────────────────
export const fetchCoverLetters = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[Supabase] fetchCoverLetters error:', error)
      throw new Error(`Failed to fetch cover letters: ${error.message}`)
    }

    return data || []
  } catch (err) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Please check your internet connection')
    }
    throw err
  }
}

export const saveCoverLetter = async (row) => {
  try {
    const ts = new Date().toISOString()
    const payload = { ...row, updated_at: ts }

    const { data, error } = await supabase
      .from('cover_letters')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('[Supabase] saveCoverLetter error:', error)
      throw new Error(`Failed to save cover letter: ${error.message}`)
    }

    return data
  } catch (err) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Please check your internet connection')
    }
    throw err
  }
}

export const deleteCoverLetter = async (id) => {
  try {
    const { error } = await supabase
      .from('cover_letters')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Supabase] deleteCoverLetter error:', error)
      throw new Error(`Failed to delete cover letter: ${error.message}`)
    }
  } catch (err) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Please check your internet connection')
    }
    throw err
  }
}
