/**
 * Admin API — direct Supabase REST calls for admin operations
 * Uses the anon key + RLS to enforce admin-only access
 */
import { supabase } from './supabase'

// ── Auth check ─────────────────────────────────────────────────
export async function isAdmin(userId) {
  if (!userId) return false
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return !!data
}

// ── All Users ──────────────────────────────────────────────────
export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── All Resumes ────────────────────────────────────────────────
export async function fetchAllResumes() {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Payments (subscriptions via profiles) ─────────────────────
export async function fetchPayments() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, plan, pro_activated_at, created_at')
    .neq('plan', 'free')
    .order('pro_activated_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Discount Codes ─────────────────────────────────────────────
export async function fetchDiscounts() {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createDiscount(payload) {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDiscount(id, payload) {
  const { data, error } = await supabase
    .from('discount_codes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDiscount(id) {
  const { error } = await supabase.from('discount_codes').delete().eq('id', id)
  if (error) throw error
}

// ── Platform Settings ─────────────────────────────────────────
export async function fetchSettings() {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
  if (error) throw error
  const settings = {}
  for (const row of (data || [])) {
    try { settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value }
    catch { settings[row.key] = row.value }
  }
  return settings
}

export async function saveSetting(key, value) {
  const { error } = await supabase
    .from('platform_settings')
    .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() })
  if (error) throw error
}

// ── User plan management ───────────────────────────────────────
export async function setUserPlan(userId, plan) {
  const { error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId)
  if (error) throw error
}

export async function deleteUser(userId) {
  // Note: Deleting from auth.users requires service_role key.
  // Here we mark the profile as inactive (soft delete is safer).
  const { error } = await supabase
    .from('profiles')
    .update({ plan: 'deleted' })
    .eq('id', userId)
  if (error) throw error
}
