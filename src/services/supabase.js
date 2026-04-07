/**
 * Supabase client & helpers — v2.0 (real auth + cloud sync)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession  : true,
    detectSessionInUrl: true,
  },
})

// ── Auth ─────────────────────────────────────────────────────
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = () => supabase.auth.getSession()

export const onAuthStateChange = (cb) => supabase.auth.onAuthStateChange(cb)

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
