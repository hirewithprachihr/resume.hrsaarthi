import { supabase } from './supabase'

/**
 * Standard event names for funnel reporting (Admin Overview + product analytics).
 * Use these constants from feature code so dashboards stay consistent.
 */
export const EVENT_NAMES = {
  BUILDER_SECTION_COMPLETED: 'builder_section_completed',
  ATS_SCORE_IMPROVED: 'ats_score_improved',
  ATS_TIP_VIEWED: 'ats_tip_viewed',
  EXPORT_PDF: 'export_pdf',
  EXPORT_DOCX: 'export_docx',
  UPGRADE_CLICK: 'upgrade_click',
  COVER_LETTER_GENERATED: 'cover_letter_generated',
  COVER_LETTER_SAVED: 'cover_letter_saved',
  COVER_LETTER_DELETED: 'cover_letter_deleted',
  RESUME_EXPORTED: 'resume_exported',
  RESUME_SAVED: 'resume_saved',
  JD_PASTED: 'jd_pasted',
  JOB_APPLICATION_CREATED: 'job_application_created',
  JOB_APPLICATION_UPDATED: 'job_application_updated',
  JOB_APPLICATION_DELETED: 'job_application_deleted',
  TAILOR_TO_JOB_STARTED: 'tailor_to_job_started',
}

/**
 * Best-effort client analytics.
 * Fails silently to avoid UX disruption.
 */
export async function trackEvent(eventName, payload = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null
    await supabase.from('events').insert({
      event_name: eventName,
      payload,
      user_id: userId,
      page_path: typeof window !== 'undefined' ? window.location.pathname : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    })
  } catch {
    // no-op
  }
}
