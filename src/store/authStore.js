import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import {
  signIn, signUp, signOut,
  getProfile, updatePlan,
  onAuthStateChange, supabase
} from '../services/supabase'

// Module-level: NOT stored in Zustand to avoid serialization issues
let _authSubscription = null

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user        : null,
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

        // Unsubscribe previous listener if re-initialized
        if (_authSubscription) { _authSubscription.unsubscribe(); _authSubscription = null }

        // Explicitly check session immediately to prevent infinite isAuthLoading
        // (sometimes onAuthStateChange misses the INITIAL_SESSION event)
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            await _handleSession(session.user)
          } else {
            set({ user: null, plan: 'free', isAuthLoading: false })
          }
          set({ isAuthLoading: false })
        })

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, plan: 'free', isAuthLoading: false })
          } else if (session?.user) {
            await _handleSession(session.user)
          }
          set({ isAuthLoading: false })
        })

        // Store at module level — NOT in Zustand state
        _authSubscription = subscription
      },

      // Internal: fetch profile & set user + plan
      _handleSession: async (authUser) => {
        try {
          const profile = await getProfile(authUser.id)
          // Check if subscription has expired
          const planExpiry = profile.plan_expires_at ? new Date(profile.plan_expires_at) : null
          let activePlan = planExpiry && planExpiry < new Date() ? 'free' : (profile.plan || 'free')

          // Launch Offer Note:
          // We previously granted 'pro' forcibly to all within 30 days.
          // This disconnected the admin panel from the UI state. We now rely strictly 
          // on the database `profile.plan` so admins can correctly revoke or upgrade.
          set({
            user: {
              id        : authUser.id,
              email     : authUser.email,
              name      : profile.name || authUser.email?.split('@')[0],
              avatar    : profile.avatar_url || null,
            },
            plan          : activePlan,
            planExpiry    : profile.plan_expires_at || null,
            subscriptionId: profile.subscription_id || null,
          })
        } catch {
          // Profile might not exist yet (race condition on first signup)
          set({
            user: {
              id    : authUser.id,
              email : authUser.email,
              name  : authUser.email?.split('@')[0],
              avatar: null,
            },
            plan: 'free',
          })
        }
      },

      // ── Sign Up ────────────────────────────────────────────
      register: async (email, password, name) => {
        set({ isLoading: true })
        try {
          await signUp(email, password, name)
          // Supabase sends confirmation email by default.
          // If email confirm is disabled, onAuthStateChange fires immediately.
          toast.success('Account created! Check your email to confirm.')
        } catch (err) {
          toast.error(err.message || 'Sign up failed.')
          throw err
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Login ──────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await signIn(email, password)
          if (data?.user) {
            await get()._handleSession(data.user)
          }
          // onAuthStateChange will also fire and call _handleSession
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
          
          // Hard reload the browser to purge all in-memory Zustand states
          window.location.href = '/'
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
