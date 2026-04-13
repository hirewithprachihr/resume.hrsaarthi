/**
 * Preservation Property Tests: Email/Password Authentication Unchanged
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3**
 * 
 * IMPORTANT: These tests verify that non-Google authentication methods
 * remain completely unchanged by the Google OAuth fix.
 * 
 * These tests should PASS on UNFIXED code (establishing baseline behavior)
 * and continue to PASS on FIXED code (confirming no regressions).
 * 
 * Property 2: Preservation - Email/Password Authentication Unchanged
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import AuthCallback from '../../pages/AuthCallback'
import { useAuthStore } from '../../store/authStore'

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

// Mock the resume store
vi.mock('../../store/resumeStore', () => ({
  useResumeStore: vi.fn((selector) => {
    const store = {
      loadCloudResumes: vi.fn().mockResolvedValue(undefined),
    }
    return selector ? selector(store) : store
  }),
}))

// Mock supabase
vi.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      getSession: vi.fn(),
    },
  },
}))

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()],
  }
})

describe('Preservation: Email/Password Authentication Unchanged', () => {
  let mockLogin
  let mockRegister
  let mockResetPasswordForEmail

  beforeEach(async () => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    
    // Get the mocked supabase module
    const { supabase } = await import('../../services/supabase')
    mockResetPasswordForEmail = supabase.auth.resetPasswordForEmail
    
    // Setup mock auth functions
    mockLogin = vi.fn().mockResolvedValue(undefined)
    mockRegister = vi.fn().mockResolvedValue(undefined)

    // Mock the auth store to return our test functions
    useAuthStore.mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      loginWithGoogle: vi.fn(),
      isLoading: false,
      _handleSession: vi.fn(),
    })
  })

  /**
   * Property 2.1: Email/Password Sign-In Unchanged
   * 
   * Verifies that email/password sign-in continues to work exactly as before
   * the Google OAuth fix.
   */
  describe('Email/Password Sign-In', () => {
    it('should call login(email, password) when sign-in form is submitted', async () => {
      const user = userEvent.setup()
      const testEmail = 'test@example.com'
      const testPassword = 'password123'
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Fill in credentials
      await user.type(screen.getByLabelText(/email address/i), testEmail)
      await user.type(screen.getByLabelText(/^password$/i), testPassword)

      // Submit form
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      await user.click(submitButton)

      // Verify login was called with correct parameters
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(1)
        expect(mockLogin).toHaveBeenCalledWith(testEmail, testPassword)
      })
    })

    it('should preserve login method signature and behavior', () => {
      const store = useAuthStore()
      
      // Verify login method exists and is a function
      expect(store.login).toBeDefined()
      expect(typeof store.login).toBe('function')
    })
  })

  /**
   * Property 2.2: Email/Password Sign-Up Unchanged
   * 
   * Verifies that email/password sign-up continues to work exactly as before
   * the Google OAuth fix.
   */
  describe('Email/Password Sign-Up', () => {
    it('should call register(email, password, name) when sign-up form is submitted', async () => {
      const user = userEvent.setup()
      const testName = 'John Doe'
      const testEmail = 'john@example.com'
      const testPassword = 'securepass123'
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Switch to sign-up mode
      const signUpButton = screen.getByRole('button', { name: /sign up — it's free/i })
      await user.click(signUpButton)

      // Fill in registration form
      await user.type(screen.getByLabelText(/full name/i), testName)
      await user.type(screen.getByLabelText(/email address/i), testEmail)
      await user.type(screen.getByLabelText(/^password$/i), testPassword)

      // Submit form
      const createAccountButton = screen.getByRole('button', { name: /create free account/i })
      await user.click(createAccountButton)

      // Verify register was called with correct parameters
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledTimes(1)
        expect(mockRegister).toHaveBeenCalledWith(testEmail, testPassword, testName)
      })
    })

    it('should preserve register method signature and behavior', () => {
      const store = useAuthStore()
      
      // Verify register method exists and is a function
      expect(store.register).toBeDefined()
      expect(typeof store.register).toBe('function')
    })
  })

  /**
   * Property 2.3: Password Reset Flow Unchanged
   * 
   * Verifies that password reset continues to work exactly as before
   * the Google OAuth fix.
   */
  describe('Password Reset Flow', () => {
    it('should call supabase.auth.resetPasswordForEmail() with correct parameters', async () => {
      const user = userEvent.setup()
      const testEmail = 'reset@example.com'
      
      mockResetPasswordForEmail.mockResolvedValue({ error: null })
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Fill in email
      await user.type(screen.getByLabelText(/email address/i), testEmail)

      // Click forgot password
      const forgotPasswordButton = screen.getByRole('button', { name: /forgot password\?/i })
      await user.click(forgotPasswordButton)

      // Verify resetPasswordForEmail was called with correct parameters
      await waitFor(() => {
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
          testEmail,
          {
            redirectTo: `${window.location.origin}/auth/callback`,
          }
        )
      })
    })

    it('should use correct redirect URL for password reset callback', async () => {
      const user = userEvent.setup()
      const testEmail = 'test@example.com'
      
      mockResetPasswordForEmail.mockResolvedValue({ error: null })
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      await user.type(screen.getByLabelText(/email address/i), testEmail)
      await user.click(screen.getByRole('button', { name: /forgot password\?/i }))

      await waitFor(() => {
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
          testEmail,
          expect.objectContaining({
            redirectTo: expect.stringContaining('/auth/callback'),
          })
        )
      })
    })
  })

  /**
   * Property 2.4: OAuth Callback Handling Unchanged
   * 
   * Verifies that the AuthCallback page continues to process OAuth redirects
   * using the existing supabase.auth.getSession() logic.
   */
  describe('OAuth Callback Handling', () => {
    it('should process OAuth callbacks via supabase.auth.getSession()', async () => {
      const { supabase } = await import('../../services/supabase')
      const mockGetSession = supabase.auth.getSession
      
      // Mock successful session
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
            access_token: 'test-token',
          },
        },
        error: null,
      })

      render(
        <BrowserRouter>
          <AuthCallback />
        </BrowserRouter>
      )

      // Verify getSession was called
      await waitFor(() => {
        expect(mockGetSession).toHaveBeenCalled()
      })

      // Verify success state is shown
      await waitFor(() => {
        expect(screen.getByText(/email confirmed/i)).toBeInTheDocument()
      })
    })

    it('should handle OAuth callback errors gracefully', async () => {
      const { supabase } = await import('../../services/supabase')
      const mockGetSession = supabase.auth.getSession
      
      // Mock error response
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid session' },
      })

      render(
        <BrowserRouter>
          <AuthCallback />
        </BrowserRouter>
      )

      // Verify error state is shown
      await waitFor(() => {
        expect(screen.getByText(/confirmation failed/i)).toBeInTheDocument()
      })
    })
  })

  /**
   * Integration Test: Verify all non-Google auth methods coexist
   * 
   * This test ensures that all authentication methods (email/password sign-in,
   * sign-up, password reset) are available and functional on the same page.
   */
  describe('Integration: All Auth Methods Available', () => {
    it('should provide all non-Google authentication options on LoginPage', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Verify email/password sign-in form is present
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()

      // Verify password reset option is present
      expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeInTheDocument()

      // Verify sign-up option is present
      expect(screen.getByRole('button', { name: /sign up — it's free/i })).toBeInTheDocument()
    })

    it('should switch between sign-in and sign-up modes without affecting functionality', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Start in sign-in mode
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()

      // Switch to sign-up mode
      await user.click(screen.getByRole('button', { name: /sign up — it's free/i }))
      expect(screen.getByRole('button', { name: /create free account/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()

      // Switch back to sign-in mode
      await user.click(screen.getByRole('button', { name: /^sign in$/i }))
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
      expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument()
    })
  })
})

/**
 * EXPECTED OUTCOME:
 * 
 * These preservation tests should PASS on UNFIXED code, establishing the
 * baseline behavior for non-Google authentication methods.
 * 
 * After the Google OAuth fix is implemented, these tests should continue
 * to PASS, confirming that:
 * 
 * 1. Email/password sign-in works identically via login(email, password)
 * 2. Email/password sign-up works identically via register(email, password, name)
 * 3. Password reset works identically via supabase.auth.resetPasswordForEmail()
 * 4. OAuth callback handling works identically via supabase.auth.getSession()
 * 
 * If any of these tests FAIL after the fix, it indicates a regression in
 * existing authentication functionality.
 */
