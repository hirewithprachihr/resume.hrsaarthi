import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { saveResumeToDb, getResumes, deleteResumeFromDb, togglePublic as togglePublicDb } from '../services/supabase'
import { useAuthStore } from './authStore'

// ─── Schema Version ─────────────────────────────────────────────
const SCHEMA_VERSION = 3

// ─── Safe UUID ──────────────────────────────────────────────────
/**
 * Generate a unique ID.
 * Falls back gracefully on Safari iOS < 15.4 and old Android WebView.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Polyfill: timestamp + random suffix (collision probability negligible)
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

// ─── Safe localStorage Wrapper ───────────────────────────────────
const safeStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name) }
    catch { return null }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        toast.error('Storage full! Please download your resume as PDF and clear old saves.')
      }
    }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name) } catch { /* ignore */ }
  },
}

// ─── Default State ───────────────────────────────────────────────
const DEFAULT_RESUME = {
  personal: {
    fullName: '',
    jobTitle: '',
    email   : '',
    phone   : '',
    location: '',
    linkedin: '',
    website : '',
    github  : '',
    twitter : '',
    photo   : '',   // base64 data-URL, max ~150 KB after compression
    summary : '',
  },
  experience    : [],
  education     : [],
  skills        : [],
  certifications: [],
  projects      : [],
  languages     : [],
  hobbies       : [],
  customSections: [],
}

const DEFAULT_SETTINGS = {
  templateId   : 'ats-classic',
  accentColor  : '#1A56DB',
  fontSize     : 'medium',
  sectionOrder : ['personal','experience','education','skills','certifications','projects','languages','hobbies'],
}

// ─── Schema Migration ────────────────────────────────────────────
/**
 * Migrate persisted state from older schema versions to current.
 * Never drops user data — only adds missing fields with safe defaults.
 *
 * @param {object} old - Previously persisted state
 * @returns {object} Migrated state at SCHEMA_VERSION
 */
function migrate(old) {
  if (!old) return { version: SCHEMA_VERSION }

  const migrated = { ...old, version: SCHEMA_VERSION }

  // v1 → v2: add missing fields that were added in v2
  if (!old.version || old.version < 2) {
    // Ensure all top-level resume sections exist
    const rd = migrated.resumeData || {}
    migrated.resumeData = {
      ...DEFAULT_RESUME,
      ...rd,
      personal: { ...DEFAULT_RESUME.personal, ...rd.personal },
      // Ensure every experience entry has correct fields
      experience: (rd.experience || []).map(e => ({
        ...e,
        id     : e.id      || generateId(),
        bullets: e.bullets || [''],
      })),
      education: (rd.education || []).map(e => ({
        forcePageBreak: false,
        nudge         : 0,
        ...e,
        id: e.id || generateId(),
      })),
      skills        : (rd.skills         || []).map(s => ({ id: s.id || generateId(), ...s })),
      certifications: (rd.certifications || []).map(c => ({ id: c.id || generateId(), ...c })),
      projects      : (rd.projects       || []).map(p => ({ id: p.id || generateId(), ...p })),
      languages     : (rd.languages      || []).map(l => ({ id: l.id || generateId(), ...l })),
      hobbies       : (rd.hobbies        || []).map(h => ({ id: h.id || generateId(), ...h })),
      customSections: rd.customSections  || [],
    }

    // Ensure settings has all new fields
    const st = migrated.settings || {}
    migrated.settings = { ...DEFAULT_SETTINGS, ...st }
  }

  // v2 → v3: add photo + social links (github, twitter) to personal
  if (!old.version || old.version < 3) {
    const rd = migrated.resumeData || {}
    migrated.resumeData = {
      ...rd,
      personal: {
        github : '',
        twitter: '',
        photo  : '',
        ...rd.personal,
      },
    }
  }

  return migrated
}

// ─── Store ───────────────────────────────────────────────────────
export const useResumeStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────
      resumeData    : { ...DEFAULT_RESUME },
      settings      : { ...DEFAULT_SETTINGS },
      atsScore      : null,
      jobDescription: '',
      savedResumes  : [],
      activeResumeId: null,
      isDirty       : false,
      version       : SCHEMA_VERSION,

      // ── Import AI Parsed Data ──────────────────────────────────
      // NOTE: The canonical fillFromParsed is defined later in this store (with full field mapping).
      // This stub is intentionally removed to avoid shadowing. See line ~474.

      // ── Personal ───────────────────────────────────────────────
      updatePersonal: (data) => set(s => ({
        resumeData: { ...s.resumeData, personal: { ...s.resumeData.personal, ...data } },
        isDirty: true,
      })),

      // ── Experience ─────────────────────────────────────────────
      addExperience: () => set(s => ({
        resumeData: {
          ...s.resumeData,
          experience: [...s.resumeData.experience, {
            id: generateId(),
            title: '', company: '', location: '', startDate: '', endDate: '',
            current: false, bullets: [''],
          }],
        },
        isDirty: true,
      })),

      updateExperience: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          experience: s.resumeData.experience.map(e => e.id === id ? { ...e, ...data } : e),
        },
        isDirty: true,
      })),

      removeExperience: (id) => set(s => ({
        resumeData: { ...s.resumeData, experience: s.resumeData.experience.filter(e => e.id !== id) },
        isDirty: true,
      })),

      reorderExperience: (items) => set(s => ({
        resumeData: { ...s.resumeData, experience: items }, isDirty: true,
      })),

      // ── Education ──────────────────────────────────────────────
      addEducation: () => set((state) => ({
        resumeData: {
          ...state.resumeData,
          education: [
            ...state.resumeData.education,
            {
              id: generateId(),
              degree: '',
              school: '',
              location: '',
              startDate: '',
              endDate: '',
              grade: '',
              achievements: '',
            },
          ],
        },
        isDirty: true,
      })),

      updateEducation: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          education: s.resumeData.education.map(e => e.id === id ? { ...e, ...data } : e),
        },
        isDirty: true,
      })),

      removeEducation: (id) => set(s => ({
        resumeData: { ...s.resumeData, education: s.resumeData.education.filter(e => e.id !== id) },
        isDirty: true,
      })),

      // ── Skills ─────────────────────────────────────────────────
      addSkillGroup: () => set(s => ({
        resumeData: {
          ...s.resumeData,
          skills: [...s.resumeData.skills, { id: generateId(), category: '', items: '' }],
        },
        isDirty: true,
      })),

      updateSkillGroup: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          skills: s.resumeData.skills.map(sk => sk.id === id ? { ...sk, ...data } : sk),
        },
        isDirty: true,
      })),

      removeSkillGroup: (id) => set(s => ({
        resumeData: { ...s.resumeData, skills: s.resumeData.skills.filter(sk => sk.id !== id) },
        isDirty: true,
      })),

      // ── Certifications ─────────────────────────────────────────
      addCertification: () => set(s => ({
        resumeData: {
          ...s.resumeData,
          certifications: [...s.resumeData.certifications, {
            id: generateId(), name: '', issuer: '', date: '', url: '',
          }],
        },
        isDirty: true,
      })),

      updateCertification: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          certifications: s.resumeData.certifications.map(c => c.id === id ? { ...c, ...data } : c),
        },
        isDirty: true,
      })),

      removeCertification: (id) => set(s => ({
        resumeData: { ...s.resumeData, certifications: s.resumeData.certifications.filter(c => c.id !== id) },
        isDirty: true,
      })),

      // ── Projects ───────────────────────────────────────────────
      addProject: () => set(s => ({
        resumeData: {
          ...s.resumeData,
          projects: [...s.resumeData.projects, {
            id: generateId(), name: '', description: '', tech: '', url: '', date: '',
          }],
        },
        isDirty: true,
      })),

      updateProject: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          projects: s.resumeData.projects.map(p => p.id === id ? { ...p, ...data } : p),
        },
        isDirty: true,
      })),

      removeProject: (id) => set(s => ({
        resumeData: { ...s.resumeData, projects: s.resumeData.projects.filter(p => p.id !== id) },
        isDirty: true,
      })),

      // ── Languages ──────────────────────────────────────────────
      addLanguage: () => set(s => ({
        resumeData: {
          ...s.resumeData,
          languages: [...(s.resumeData.languages || []), { id: generateId(), language: '', proficiency: 'Professional' }],
        },
        isDirty: true,
      })),

      updateLanguage: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          languages: (s.resumeData.languages || []).map(l => l.id === id ? { ...l, ...data } : l),
        },
        isDirty: true,
      })),

      removeLanguage: (id) => set(s => ({
        resumeData: { ...s.resumeData, languages: (s.resumeData.languages || []).filter(l => l.id !== id) },
        isDirty: true,
      })),

      // ── Hobbies ────────────────────────────────────────────────
      addHobby: (hobby = '') => set(s => ({
        resumeData: {
          ...s.resumeData,
          hobbies: [...(s.resumeData.hobbies || []), { id: generateId(), name: hobby, icon: '' }],
        },
        isDirty: true,
      })),

      updateHobby: (id, data) => set(s => ({
        resumeData: {
          ...s.resumeData,
          hobbies: (s.resumeData.hobbies || []).map(h => h.id === id ? { ...h, ...data } : h),
        },
        isDirty: true,
      })),

      removeHobby: (id) => set(s => ({
        resumeData: { ...s.resumeData, hobbies: (s.resumeData.hobbies || []).filter(h => h.id !== id) },
        isDirty: true,
      })),

      reorderHobbies: (items) => set(s => ({
        resumeData: { ...s.resumeData, hobbies: items }, isDirty: true,
      })),

      // ── Settings ───────────────────────────────────────────────
      updateSettings  : (data) => set(s => ({ settings: { ...s.settings, ...data }, isDirty: true })),
      setTemplate     : (templateId) => set(s => ({ settings: { ...s.settings, templateId }, isDirty: true })),
      setAccentColor  : (color) => set(s => ({ settings: { ...s.settings, accentColor: color }, isDirty: true })),
      reorderSections : (order) => set(s => ({ settings: { ...s.settings, sectionOrder: order }, isDirty: true })),

      // ── ATS ────────────────────────────────────────────────────
      setATSScore       : (score) => set({ atsScore: score }),
      setJobDescription : (jd)    => set({ jobDescription: jd }),

      // ── Resume Management ──────────────────────────────────────
      saveResume: async (title = 'My Resume') => {
        const state = get()
        const { plan } = useAuthStore.getState()
        const id = state.activeResumeId || generateId()

        // Free tier: enforce max 1 saved resume
        if (plan !== 'pro') {
          const isExistingResume = state.savedResumes.some(r => r.id === id)
          if (!isExistingResume && state.savedResumes.length >= 1) {
            toast.error('Free plan allows 1 saved resume. Upgrade to Pro for unlimited resumes!')
            return null
          }
        }

        const resume = {
          id,
          title,
          resumeData: state.resumeData,   // canonical field name
          settings : state.settings,
          updatedAt: new Date().toISOString(),
          atsScore : state.atsScore?.total || 0,
        }
        set(s => ({
          savedResumes: s.savedResumes.some(r => r.id === id)
            ? s.savedResumes.map(r => r.id === id ? resume : r)
            : [...s.savedResumes, resume],
          activeResumeId: id,
          isDirty       : false,
        }))
        // Cloud sync — non-blocking, fire & forget
        const currentUser = useAuthStore.getState().user
        if (currentUser?.id) {
          try {
            // saveResumeToDb expects resume.data — adapter layer
            await saveResumeToDb(currentUser.id, { ...resume, data: resume.resumeData })
          } catch (err) {
            console.warn('[ResumeStore] Cloud save failed (local save succeeded):', err.message)
          }
        }
        return id
      },

      loadResume: (id) => {
        const state = get()
        const resume = state.savedResumes.find(r => r.id === id)
        if (resume) {
          // Support both 'resumeData' (new) and legacy 'data' field
          const rData = resume.resumeData || resume.data
          set({
            resumeData    : rData,
            settings      : resume.settings,
            activeResumeId: id,
            isDirty       : false,
            atsScore      : null,
          })
        }
      },

      deleteResume: async (id) => {
        set(s => ({
          savedResumes  : s.savedResumes.filter(r => r.id !== id),
          activeResumeId: s.activeResumeId === id ? null : s.activeResumeId,
        }))
        // Cloud sync — attempt to delete from DB
        const currentUser = useAuthStore.getState().user
        if (currentUser?.id) {
          try { await deleteResumeFromDb(id) } catch { /* ignore */ }
        }
      },

      // Load resumes from Supabase cloud on login & merge with local
      loadCloudResumes: async () => {
        const currentUser = useAuthStore.getState().user
        if (!currentUser?.id) return

        // ── 5-minute TTL cache ──────────────────────────────────────
        // Prevent hammering the DB on every dashboard mount.
        // Skip if we fetched < 5 minutes ago AND already have data.
        const state = get()
        const FIVE_MIN = 5 * 60 * 1000
        const lastFetch = state._lastCloudFetch || 0
        const hasFreshData = Date.now() - lastFetch < FIVE_MIN && state.savedResumes.length > 0
        if (hasFreshData) return
        // ─────────────────────────────────────────────────────────────

        try {
          const cloudResumes = await getResumes(currentUser.id)
          if (!cloudResumes || cloudResumes.length === 0) {
            set(s => ({ savedResumes: [], _lastCloudFetch: Date.now() }))
            return
          }
          // Normalize cloud resumes: getResumes returns { data } but local store uses { resumeData }
          const normalized = cloudResumes.map(r => ({
            ...r,
            resumeData: r.resumeData || r.data,
            data      : undefined,
          }))
          set(s => {
            const merged = [
              ...normalized,
              ...s.savedResumes.filter(r => !normalized.some(c => c.id === r.id)),
            ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            return { savedResumes: merged, _lastCloudFetch: Date.now() }
          })
        } catch (err) {
          console.warn('[ResumeStore] Could not load cloud resumes:', err.message)
        }
      },

      newResume: () => set({
        resumeData    : { ...DEFAULT_RESUME },
        settings      : { ...DEFAULT_SETTINGS },
        activeResumeId: null,
        isDirty       : false,
        atsScore      : null,
        jobDescription: '',
      }),

      clearStore: () => set({
        resumeData    : { ...DEFAULT_RESUME },
        settings      : { ...DEFAULT_SETTINGS },
        savedResumes  : [],
        activeResumeId: null,
        isDirty       : false,
        atsScore      : null,
        jobDescription: '',
        _lastCloudFetch: 0,
      }),

      duplicateResume: (id) => {
        const state = get()
        const resume = state.savedResumes.find(r => r.id === id)
        if (resume) {
          const newId = generateId()
          const copy  = {
            ...resume,
            id        : newId,
            title     : `${resume.title} (Copy)`,
            updatedAt : new Date().toISOString(),
            resumeData: resume.resumeData || resume.data,  // normalize
            data      : undefined,
          }
          set(s => ({ savedResumes: [...s.savedResumes, copy] }))
        }
      },

      togglePublic: async (id, isPublic) => {
        set(s => ({
          savedResumes: s.savedResumes.map(r => r.id === id ? { ...r, isPublic } : r)
        }))
        const user = useAuthStore.getState().user
        if (user) {
          try { await togglePublicDb(id, isPublic) }
          catch (e) { toast.error('Sharing update failed: ' + e.message) }
        }
      },

      // ── Rename a saved resume title ────────────────────────────
      updateResumeTitle: (id, title) => {
        set(s => ({
          savedResumes: s.savedResumes.map(r =>
            r.id === id ? { ...r, title, updatedAt: new Date().toISOString() } : r
          ),
        }))
      },


      fillFromParsed: (parsed) => set(s => ({
        resumeData: {
          personal: {
            fullName: parsed.name      || '',
            jobTitle: parsed.jobTitle  || '',
            email   : parsed.email     || '',
            phone   : parsed.phone     || '',
            location: parsed.location  || '',
            linkedin: parsed.linkedin  || '',
            website : parsed.website   || '',
            summary : parsed.summary   || '',
          },
          experience: (parsed.experience || []).map(e => ({
            id            : generateId(),
            title         : e.title    || '',
            company       : e.company  || '',
            location      : e.location || '',
            startDate     : e.startDate || '',
            endDate       : e.endDate   || '',
            current       : e.current   || false,
            bullets       : e.bullets   || [''],
            forcePageBreak: false,
            nudge         : 0,
          })),
          education: (parsed.education || []).map(e => ({
            id            : generateId(),
            degree        : e.degree   || '',
            school        : e.school   || '',
            location      : e.location || '',
            startDate     : e.startDate || '',
            endDate       : e.endDate   || '',
            grade         : e.grade    || '',
            achievements  : e.achievements || '',
            forcePageBreak: false,
            nudge         : 0,
          })),
          skills: (parsed.skills || []).map((sk, i) =>
            typeof sk === 'string'
              ? { id: generateId(), category: i === 0 ? 'Technical Skills' : 'Other Skills', items: sk }
              : { id: generateId(), ...sk }
          ),
          certifications: (parsed.certifications || []).map(c => ({
            id: generateId(), name: c.name || c, issuer: c.issuer || '', date: c.date || '', url: '',
          })),
          projects      : s.resumeData.projects,
          languages     : s.resumeData.languages,
          hobbies: (parsed.hobbies || []).map(h => ({
            id  : generateId(),
            name: typeof h === 'string' ? h : h.name || '',
            icon: typeof h === 'string' ? '' : h.icon || '',
          })),
          customSections: s.resumeData.customSections,
        },
        isDirty: true,
      })),
    }),
    {
      name   : 'hwp-resume-store-v2',
      storage: safeStorage,
      partialize: (state) => ({
        resumeData    : state.resumeData,
        settings      : state.settings,
        savedResumes  : state.savedResumes,
        activeResumeId: state.activeResumeId,
        version       : state.version,
      }),
      onRehydrateStorage: () => (state) => {
        // If loaded state has old schema, migrate it in-place
        if (state && (!state.version || state.version < SCHEMA_VERSION)) {
          const migrated = migrate(state)
          Object.assign(state, migrated)
        }
        // Normalize legacy savedResumes: rename 'data' → 'resumeData' for all entries
        if (state && Array.isArray(state.savedResumes)) {
          state.savedResumes = state.savedResumes.map(r => {
            if (r.data !== undefined && r.resumeData === undefined) {
              return { ...r, resumeData: r.data, data: undefined }
            }
            return r
          })
        }
      },
      migrate: (persisted, version) => migrate(persisted),
      version: SCHEMA_VERSION,
    }
  )
)
