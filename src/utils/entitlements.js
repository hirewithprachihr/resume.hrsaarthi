import { useAuthStore } from '../store/authStore'

/**
 * Single source of truth for feature entitlements.
 * UI can use this to keep Pro-gates and copy consistent.
 */
export function getEntitlements(state = useAuthStore.getState()) {
  const LAUNCH_OFFER_START = new Date('2026-04-07T00:00:00').getTime()
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
  const launchOfferActive = Date.now() - LAUNCH_OFFER_START < THIRTY_DAYS_MS

  const isPro = state.plan === 'pro' || !!state.testMode || launchOfferActive
  const isGuest = !state.user

  return {
    isPro,
    isGuest,
    launchOfferActive,
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

