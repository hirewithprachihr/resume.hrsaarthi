/**
 * InlineEditTitle — Editable resume title shown in the builder toolbar.
 * Click to edit, Enter/Escape or blur to save.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { Pencil, Check } from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'
import toast from 'react-hot-toast'

export default function InlineEditTitle() {
  const { activeResumeId, savedResumes, updateResumeTitle } = useResumeStore()
  const active  = savedResumes.find(r => r.id === activeResumeId)
  const current = active?.title || 'My Resume'

  const [editing, setEditing] = useState(false)
  const [value, setValue]     = useState(current)
  const inputRef              = useRef(null)

  // Sync value when the active resume changes
  useEffect(() => { setValue(current) }, [current])

  // Focus input when entering edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const save = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) { setValue(current); setEditing(false); return }
    if (trimmed !== current && activeResumeId && updateResumeTitle) {
      updateResumeTitle(activeResumeId, trimmed)
      toast.success('Title updated')
    }
    setEditing(false)
  }, [value, current, activeResumeId, updateResumeTitle])

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          id="inline-edit-title"
          name="title"
          aria-label="Resume title"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={e => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') { setValue(current); setEditing(false) }
          }}
          maxLength={60}
          className="px-3 py-1.5 text-sm font-semibold text-gray-800 border border-brand-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-100 w-44 transition-all"
          placeholder="Resume title…"
        />
        <button
          onMouseDown={e => { e.preventDefault(); save() }}
          className="w-7 h-7 bg-brand-600 text-white rounded-lg flex items-center justify-center hover:bg-brand-700 transition-colors flex-shrink-0"
        >
          <Check size={13} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-sm font-semibold text-gray-700 transition-all group max-w-[180px]"
      title="Click to rename"
    >
      <span className="truncate">{current}</span>
      <Pencil size={11} className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
