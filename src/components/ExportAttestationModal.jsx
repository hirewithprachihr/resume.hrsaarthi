import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'

/**
 * Shown before PDF export when the user has used AI-assisted edits this session.
 */
export default function ExportAttestationModal({ open, onCancel, onConfirm }) {
  const [checked, setChecked] = useState(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50">
                  <ShieldCheck size={18} className="text-emerald-600" />
                </div>
                <button type="button" onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-3 mb-1">Confirm before export</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                You used AI-assisted editing in this session. Please confirm your resume accurately reflects your real experience before downloading.
              </p>
              <label className="mt-4 flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">
                  I confirm this resume reflects my real experience and qualifications.
                </span>
              </label>
            </div>
            <div className="px-6 pb-6 flex gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!checked}
                onClick={() => { onConfirm(); setChecked(false) }}
                className="flex-1 py-2.5 font-bold rounded-xl text-sm transition-all bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
