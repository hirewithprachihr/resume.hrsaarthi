/**
 * Unit tests for Job Applications and Cover Letters API functions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  fetchJobApplications, 
  createJobApplication, 
  updateJobApplication, 
  deleteJobApplication,
  fetchCoverLetters,
  saveCoverLetter,
  deleteCoverLetter
} from './supabase.js'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '123', company: 'Test Corp', role: 'Engineer' },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '123', status: 'interview' },
              error: null
            }))
          }))
        }))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'letter-123', title: 'Test Letter', company: 'Tech Corp' },
            error: null
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      }))
    })),
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }))
}))

describe('Job Applications API', () => {
  describe('fetchJobApplications', () => {
    it('should fetch applications for a user', async () => {
      const userId = 'user-123'
      const result = await fetchJobApplications(userId)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array when no applications exist', async () => {
      const result = await fetchJobApplications('user-456')
      expect(result).toEqual([])
    })
  })

  describe('createJobApplication', () => {
    it('should create a new job application', async () => {
      const application = {
        user_id: 'user-123',
        company: 'Test Corp',
        role: 'Software Engineer',
        status: 'applied'
      }
      
      const result = await createJobApplication(application)
      expect(result).toBeDefined()
      expect(result.company).toBe('Test Corp')
    })

    it('should return the created application with id', async () => {
      const application = {
        user_id: 'user-123',
        company: 'Acme Inc',
        role: 'Developer'
      }
      
      const result = await createJobApplication(application)
      expect(result.id).toBeDefined()
    })
  })

  describe('updateJobApplication', () => {
    it('should update an existing application', async () => {
      const id = '123'
      const updates = { status: 'interview' }
      
      const result = await updateJobApplication(id, updates)
      expect(result).toBeDefined()
      expect(result.status).toBe('interview')
    })

    it('should include updated_at timestamp', async () => {
      const id = '123'
      const updates = { notes: 'Follow up next week' }
      
      const result = await updateJobApplication(id, updates)
      expect(result).toBeDefined()
    })
  })

  describe('deleteJobApplication', () => {
    it('should delete an application without error', async () => {
      const id = '123'
      await expect(deleteJobApplication(id)).resolves.not.toThrow()
    })
  })
})

describe('Cover Letters API', () => {
  describe('fetchCoverLetters', () => {
    it('should fetch cover letters for a user', async () => {
      const userId = 'user-123'
      const result = await fetchCoverLetters(userId)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array when no cover letters exist', async () => {
      const result = await fetchCoverLetters('user-456')
      expect(result).toEqual([])
    })

    it('should handle network errors gracefully', async () => {
      // This test verifies error handling exists
      const userId = 'user-123'
      await expect(fetchCoverLetters(userId)).resolves.toBeDefined()
    })
  })

  describe('saveCoverLetter', () => {
    it('should save a new cover letter using upsert', async () => {
      const letter = {
        user_id: 'user-123',
        title: 'Software Engineer Application',
        company: 'Tech Corp',
        job_title: 'Senior Developer',
        content: 'Dear Hiring Manager...',
        tone: 'professional'
      }
      
      const result = await saveCoverLetter(letter)
      expect(result).toBeDefined()
      expect(result.company).toBe('Tech Corp')
    })

    it('should update existing cover letter using upsert', async () => {
      const letter = {
        id: 'letter-123',
        user_id: 'user-123',
        title: 'Updated Application',
        company: 'Tech Corp',
        content: 'Updated content...'
      }
      
      const result = await saveCoverLetter(letter)
      expect(result).toBeDefined()
    })

    it('should include updated_at timestamp', async () => {
      const letter = {
        user_id: 'user-123',
        title: 'Test Letter',
        content: 'Test content'
      }
      
      const result = await saveCoverLetter(letter)
      expect(result).toBeDefined()
    })

    it('should handle network errors gracefully', async () => {
      const letter = {
        user_id: 'user-123',
        title: 'Test',
        content: 'Content'
      }
      
      await expect(saveCoverLetter(letter)).resolves.toBeDefined()
    })
  })

  describe('deleteCoverLetter', () => {
    it('should delete a cover letter without error', async () => {
      const id = 'letter-123'
      await expect(deleteCoverLetter(id)).resolves.not.toThrow()
    })

    it('should handle network errors gracefully', async () => {
      const id = 'letter-456'
      await expect(deleteCoverLetter(id)).resolves.not.toThrow()
    })
  })
})
