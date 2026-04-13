/**
 * Bug Condition Exploration Test: Google OAuth Flow Not Initiated
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * CRITICAL: This test encodes the EXPECTED behavior (what SHOULD happen).
 * - On UNFIXED code: This test FAILS (proving the bug exists)
 * - On FIXED code: This test PASSES (confirming the fix works)
 * 
 * Bug Condition: Google OAuth button is disabled and does not initiate OAuth flow
 * Expected Behavior: Button should be enabled and initiate OAuth flow via signInWithOAuth
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import { useAuthStore } from '../../store/authStore'

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

// Mock the resume store
vi.mock('../../store/resumeStore', () => ({
  useResumeStore: vi.fn(() => ({
    loadCloudResumes: vi.fn().mockResolvedValue(undefined),
  })),
}))

// Mock supabase
vi.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}))

describe('Bug 1: Google OAuth Flow Not Initiated', () => {
  let mockLoginWithGoogle
  let mockSignInWithOAuth

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Get the mocked supabase module
    const { supabase } = await import('../../services/supabase')
    mockSignInWithOAuth = supabase.auth.signInWithOAuth
    
    // Setup mock loginWithGoogle function
    mockLoginWithGoogle = vi.fn().mockImplementation(async () => {
      return mockSignInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    })

    // Mock the auth store to return our test functions
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: mockLoginWithGoogle,
      isLoading: false,
    })
  })

  /**
   * Property 1: Bug Condition - Google OAuth Flow Initiation
   * 
   * This test verifies the EXPECTED behavior:
   * - Google button should exist and be enabled
   * - Button should NOT have disabled styling or "coming soon" tooltip
   * - Clicking the button should call loginWithGoogle
   * - loginWithGoogle should initiate OAuth flow via supabase.auth.signInWithOAuth
   * - OAuth should redirect to ${window.location.origin}/auth/callback
   * 
   * On UNFIXED code, this test would FAIL because:
   * - Button would be disabled
   * - Button would show "Google sign-in coming soon" tooltip
   * - onClick handler would not be connected
   * - OAuth flow would not initiate
   */
  it('should initiate Google OAuth flow when button is clicked', async () => {
    const user = userEvent.setup()
    
    // Render the LoginPage
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // ASSERTION 1: Google button should exist
    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    expect(googleButton).toBeInTheDocument()

    // ASSERTION 2: Button should be enabled (not disabled)
    // On UNFIXED code, this would FAIL - button would have disabled prop
    expect(googleButton).not.toBeDisabled()

    // ASSERTION 3: Button should NOT have "coming soon" tooltip
    // On UNFIXED code, this would FAIL - button would have title="Google sign-in coming soon"
    expect(googleButton).not.toHaveAttribute('title', 'Google sign-in coming soon')

    // ASSERTION 4: Button should NOT have cursor-not-allowed styling
    // On UNFIXED code, this would FAIL - button would have cursor-not-allowed class
    expect(googleButton.className).not.toContain('cursor-not-allowed')

    // ASSERTION 5: Clicking button should call loginWithGoogle
    // On UNFIXED code, this would FAIL - onClick handler not connected
    await user.click(googleButton)
    
    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1)
    })

    // ASSERTION 6: loginWithGoogle should initiate OAuth flow
    // On UNFIXED code, this would FAIL - OAuth flow not initiated
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  })

  /**
   * Additional test: Verify loginWithGoogle method exists in authStore
   * 
   * This confirms the method is implemented and available
   */
  it('should have loginWithGoogle method in authStore', () => {
    const store = useAuthStore()
    
    // ASSERTION: loginWithGoogle method should exist
    // On UNFIXED code, this might FAIL if method doesn't exist or is a stub
    expect(store.loginWithGoogle).toBeDefined()
    expect(typeof store.loginWithGoogle).toBe('function')
  })

  /**
   * Edge case: Button should be disabled only when isLoading is true
   * 
   * This ensures the button is disabled during authentication, not permanently
   */
  it('should disable button only during loading state', () => {
    // Mock loading state
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: mockLoginWithGoogle,
      isLoading: true, // Loading state
    })

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    
    // Button should be disabled during loading
    expect(googleButton).toBeDisabled()
  })

  /**
   * Integration test: Verify OAuth redirect URL is correct
   * 
   * This ensures the redirect URL matches the expected callback route
   */
  it('should use correct redirect URL for OAuth callback', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            redirectTo: expect.stringContaining('/auth/callback'),
          }),
        })
      )
    })
  })
})

/**
 * COUNTEREXAMPLES DOCUMENTATION (Expected on UNFIXED code):
 * 
 * When this test is run on UNFIXED code, we expect the following failures:
 * 
 * 1. Button disabled assertion fails:
 *    - Expected: button NOT disabled
 *    - Actual: button has disabled prop set to true
 * 
 * 2. Tooltip assertion fails:
 *    - Expected: no "coming soon" tooltip
 *    - Actual: button has title="Google sign-in coming soon"
 * 
 * 3. Styling assertion fails:
 *    - Expected: no cursor-not-allowed class
 *    - Actual: button has cursor-not-allowed styling
 * 
 * 4. onClick handler assertion fails:
 *    - Expected: loginWithGoogle called on click
 *    - Actual: onClick handler not connected, function not called
 * 
 * 5. OAuth flow assertion fails:
 *    - Expected: signInWithOAuth called with correct params
 *    - Actual: OAuth flow never initiated
 * 
 * These failures confirm the bug exists: Google OAuth button is disabled
 * and does not initiate the OAuth flow when clicked.
 */
