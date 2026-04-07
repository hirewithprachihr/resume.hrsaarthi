import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Premium ConfirmModal — replaces all window.confirm() usage.
 * 
 * Usage:
 *   <ConfirmModal
 *     open={showConfirm}
 *     title="Delete Resume"
 *     message="This action cannot be undone."
 *     confirmLabel="Delete"
 *     danger
 *     onConfirm={() => { doDelete(); setShowConfirm(false) }}
 *     onCancel={() => setShowConfirm(false)}
 *   />
 */
export default function ConfirmModal({
  open,
  title       = 'Are you sure?',
  message     = '',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  danger       = false,
  onConfirm,
  onCancel,
  icon,
}) {
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
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
                  {icon || <AlertTriangle size={18} className={danger ? 'text-red-500' : 'text-amber-500'} />}
                </div>
                <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-3 mb-1">{title}</h2>
              {message && <p className="text-sm text-gray-500 leading-relaxed">{message}</p>}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-2.5">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 font-bold rounded-xl text-sm transition-all ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
