import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { saveResumeToDb, getResumes, deleteResumeFromDb, togglePublic as togglePublicDb } from '../services/supabase'
import { useAuthStore } from './authStore'

// ─── Schema Version ─────────────────────────────────────────────
const SCHEMA_VERSION = 4

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
    yearsExperience   : '',
    openToRelocate    : false,
    relocationCities  : '',
    workAuthorization : '',
    visaType          : '',
    noticePeriodDays  : '',
    expectedCompensation: { currency: 'INR', min: '', max: '', period: 'annual' },
    preferredWorkMode : '',
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

  // v3 → v4: job-search preferences + employment type / team size
  if (!old.version || old.version < 4) {
    const rd = migrated.resumeData || {}
    const ec = rd.personal?.expectedCompensation
    migrated.resumeData = {
      ...rd,
      personal: {
        ...DEFAULT_RESUME.personal,
        ...rd.personal,
        yearsExperience   : rd.personal?.yearsExperience ?? '',
        openToRelocate    : rd.personal?.openToRelocate ?? false,
        relocationCities  : rd.personal?.relocationCities ?? '',
        workAuthorization : rd.personal?.workAuthorization ?? '',
        visaType          : rd.personal?.visaType ?? '',
        noticePeriodDays  : rd.personal?.noticePeriodDays ?? '',
        expectedCompensation: ec && typeof ec === 'object'
          ? { currency: ec.currency || 'INR', min: ec.min ?? '', max: ec.max ?? '', period: ec.period || 'annual' }
          : { currency: 'INR', min: '', max: '', period: 'annual' },
        preferredWorkMode : rd.personal?.preferredWorkMode ?? '',
      },
      experience: (rd.experience || []).map(e => ({
        ...e,
        employmentType: e.employmentType || 'full_time',
        teamSize       : e.teamSize ?? '',
      })),
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
      /** Set true after AI summary/bullet/tailor/upload-parse; cleared after export attestation. Not persisted. */
      aiAssistPendingAttestation: false,

      markAiAssistUsed: () => set({ aiAssistPendingAttestation: true }),
      acknowledgeAiAssistAttestation: () => set({ aiAssistPendingAttestation: false }),

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
            employmentType: 'full_time',
            teamSize: '',
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
      clearJobDescription: ()     => set({ jobDescription: '' }),

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
          jobDescription: state.jobDescription || '',
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
            jobDescription: resume.jobDescription ?? '',
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
      loadCloudResumes: async (force = false) => {
        const currentUser = useAuthStore.getState().user
        if (!currentUser?.id) return

        // Prevent concurrent syncs
        if (get()._isSyncing) return
        set({ _isSyncing: true })

        try {
          // ── 5-minute TTL cache ──────────────────────────────────────
          const state = get()
          const FIVE_MIN = 5 * 60 * 1000
          const lastFetch = state._lastCloudFetch || 0
          const sameUser = state._lastCloudFetchUserId === currentUser.id
          const hasFreshData = Date.now() - lastFetch < FIVE_MIN && state.savedResumes.length > 0 && sameUser
          
          if (!force && hasFreshData) {
            set({ _isSyncing: false })
            return
          }

          const cloudResumes = await getResumes(currentUser.id)
          if (!cloudResumes || cloudResumes.length === 0) {
            set(s => ({ savedResumes: [], _lastCloudFetch: Date.now(), _lastCloudFetchUserId: currentUser.id, _isSyncing: false }))
            return
          }
          // Normalize cloud resumes
          const normalized = cloudResumes.map(r => ({
            ...r,
            resumeData: r.resumeData || r.data,
            data      : undefined,
            jobDescription: r.jobDescription ?? '',
            isPublic: r.isPublic ?? r.is_public ?? false,
          }))
          set(s => {
            const merged = [
              ...normalized,
              ...s.savedResumes.filter(r => !normalized.some(c => c.id === r.id)),
            ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            return { savedResumes: merged, _lastCloudFetch: Date.now(), _lastCloudFetchUserId: currentUser.id, _isSyncing: false }
          })
        } catch (err) {
          console.warn('[ResumeStore] Could not load cloud resumes:', err.message)
          set({ _isSyncing: false })
        }
      },

      newResume: () => set({
        resumeData    : { ...DEFAULT_RESUME },
        settings      : { ...DEFAULT_SETTINGS },
        activeResumeId: null,
        isDirty       : false,
        atsScore      : null,
        jobDescription: '',
        aiAssistPendingAttestation: false,
      }),

      clearStore: () => set({
        resumeData    : { ...DEFAULT_RESUME },
        settings      : { ...DEFAULT_SETTINGS },
        savedResumes  : [],
        activeResumeId: null,
        isDirty       : false,
        atsScore      : null,
        jobDescription: '',
        aiAssistPendingAttestation: false,
        _lastCloudFetch: 0,
        _lastCloudFetchUserId: null,
      }),

      // Clone current in-editor resume to a new saved slot with a custom label
      cloneResume: async (title = 'Clone') => {
        const state = get()
        const newId = generateId()
        const clone = {
          id         : newId,
          title,
          resumeData : state.resumeData,
          settings   : state.settings,
          updatedAt  : new Date().toISOString(),
          atsScore   : state.atsScore?.total || 0,
          jobDescription: state.jobDescription || '',
        }
        set(s => ({ savedResumes: [...s.savedResumes, clone] }))
        // Cloud sync
        const user = useAuthStore.getState().user
        if (user?.id) {
          try { await saveResumeToDb(user.id, { ...clone, data: clone.resumeData }) }
          catch { /* local save succeeded */ }
        }
        return newId
      },

      // Expose as `currentResumeId` alias for version panel
      get currentResumeId() { return get().activeResumeId },

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
            jobDescription: resume.jobDescription || '',
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
            ...DEFAULT_RESUME.personal,
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
            employmentType: e.employmentType || 'full_time',
            teamSize      : e.teamSize ?? '',
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
        jobDescription: state.jobDescription,
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
