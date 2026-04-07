import { useAuthStore } from '../store/authStore'

/**
 * Single source of truth for feature entitlements.
 * UI can use this to keep Pro-gates and copy consistent.
 */
export function getEntitlements(state = useAuthStore.getState()) {
  const isPro = state.plan === 'pro' || !!state.testMode
  const isGuest = !state.user

  return {
    isPro,
    isGuest,
    canUseAIFeatures: isPro,
    canUseJDMatching: isPro,
    canExportDocx: isPro,
    freeMaxSavedResumes: isPro ? Infinity : 1,
  }
}

export function useEntitlements() {
  const { plan, testMode, user } = useAuthStore()
  return getEntitlements({ plan, testMode, user })
}

