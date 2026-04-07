import { Link } from 'react-router-dom'
import { Lock, Star, Zap } from 'lucide-react'
import { useEntitlements } from '../utils/entitlements'

export default function ProGate({ children, feature = 'This feature' }) {
  const { isPro } = useEntitlements()
  if (isPro) return children

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-amber-300 z-10">
        <div className="text-center px-6 py-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{feature} is Pro</h3>
          <p className="text-xs text-gray-500 mb-4">Upgrade to unlock AI-powered features</p>
          <Link to="/upgrade" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-xl hover:shadow-md transition-all">
            <Star size={14} fill="white" />Upgrade — ₹149/mo
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold rounded uppercase tracking-wide">
      <Zap size={9} fill="white" />PRO
    </span>
  )
}
