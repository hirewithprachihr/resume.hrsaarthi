import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import {
  signIn, signUp, signOut,
  getProfile, updatePlan, getSession,
  onAuthStateChange, supabase
} from '../services/supabase'

// Module-level: NOT stored in Zustand to avoid serialization issues
let _authSubscription = null

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user        : null,
      accessToken : null,       // CACHED JWT for AI services
      plan        : 'free',
      planExpiry  : null,       // ISO timestamp — when current Pro period ends
      subscriptionId: null,     // Razorpay subscription ID
      testMode    : false,
      isLoading   : false,
      isAuthLoading: true, // true until first onAuthStateChange fires

      setUser        : (user)          => set({ user }),
      setPlan        : (plan)          => set({ plan }),
      setTestMode    : (testMode)      => set({ testMode }),
      setLoading     : (isLoading)     => set({ isLoading }),
      setPlanExpiry  : (planExpiry)    => set({ planExpiry }),

      // ── init: called once in App.jsx on mount ──────────────
      // Restores session from Supabase cookies & subscribes to changes
      initAuth: () => {
        const { _handleSession } = get()
        if (_authSubscription) { _authSubscription.unsubscribe(); _authSubscription = null }

        // Use already-imported getSession — no dynamic import needed
        getSession()
            .then(async ({ data: { session } }) => {
              if (session?.user) {
                await _handleSession(session.user, session)
              } else {
                set({ user: null, accessToken: null, plan: 'free', isAuthLoading: false })
              }
            })
            .catch(() => set({ isAuthLoading: false }))

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, accessToken: null, plan: 'free', isAuthLoading: false })
          } else if (session?.user) {
            await _handleSession(session.user, session)
          } else if (event === 'TOKEN_REFRESHED' && session) {
            set({ accessToken: session.access_token })
          } else {
            set({ isAuthLoading: false })
          }
        })
        _authSubscription = subscription

        // Store at module level — NOT in Zustand state
        _authSubscription = subscription
      },

      // Internal: fetch profile & set user + plan
      _handleSession: async (authUser, session = null) => {
        // Prevent concurrent session handling
        if (get()._isHandlingSession) return
        set({ _isHandlingSession: true })

        try {
          const profile = await getProfile(authUser.id)
          const planExpiry = profile.plan_expires_at ? new Date(profile.plan_expires_at) : null
          let activePlan = planExpiry && planExpiry < new Date() ? 'free' : (profile.plan || 'free')

          set({
            user: {
              id        : authUser.id,
              email     : authUser.email,
              name      : profile.name || authUser.email?.split('@')[0],
              avatar    : profile.avatar_url || null,
            },
            accessToken   : session?.access_token || null,
            plan          : activePlan,
            planExpiry    : profile.plan_expires_at || null,
            subscriptionId: profile.subscription_id || null,
          })
        } catch (err) {
          console.error('[AuthStore] Profile fetch failed:', err.message)
          set({
            user: {
              id    : authUser.id,
              email : authUser.email,
              name  : authUser.email?.split('@')[0],
              avatar: null,
            },
            accessToken: session?.access_token || null,
            plan: 'free',
          })
        } finally {
          set({ _isHandlingSession: false, isAuthLoading: false })
        }
      },

      // ── Login ──────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await signIn(email, password)
          if (data?.user) {
            await get()._handleSession(data.user, data.session)
          }
        } catch (err) {
          const msg = err.message?.includes('Invalid login')
            ? 'Invalid email or password.'
            : err.message || 'Login failed.'
          toast.error(msg)
          throw err
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Logout ─────────────────────────────────────────────
      logout: async () => {
        try {
          // Attempt external sign out, but catch errors to ensure local cleanup
          await signOut().catch(() => {})
        } finally {
          // Always clear local state to guarantee smooth logout
          set({ user: null, plan: 'free', planExpiry: null, subscriptionId: null })
          
          // Force wipe localStorage to prevent zombie sessions or stuck data
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') || key.startsWith('hwp-')) {
              localStorage.removeItem(key)
            }
          })
          
          // Keep navigation in caller to avoid hard reload races in some browsers.
        }
      },

      // ── Pro Upgrade ────────────────────────────────────────
      // Called after successful Razorpay payment
      upgradeToPro: async (razorpayPaymentId = null, subscriptionId = null) => {
        const { user } = get()
        set({ plan: 'pro', subscriptionId: subscriptionId || null })
        if (user?.id) {
          try { await updatePlan(user.id, 'pro', razorpayPaymentId) } catch { /* non-critical */ }
        }
      },

      // Legacy sync version (used in UpgradePage handler before async)
      upgradeToproSync: () => set({ plan: 'pro' }),

      isPro: () => {
        const state = useAuthStore.getState()
        return state.plan === 'pro' || state.testMode
      },

      // ── Pro mode testing (URL param ?pro=true) ─────────────
      init: () => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('pro') === 'true') set({ plan: 'pro' })
      },

      // Legacy no-op kept for compatibility
      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options : { redirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
      },
    }),
    {
      name      : 'hwp-auth-store',
      partialize: (state) => ({
        user          : state.user,
        plan          : state.plan,
        planExpiry    : state.planExpiry,
        subscriptionId: state.subscriptionId,
        testMode      : state.testMode,
        // isAuthLoading is intentionally NOT persisted
      }),
    }
  )
)
