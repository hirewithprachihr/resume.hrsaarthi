import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Mail, Heart, Sparkles, Shield } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-400 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600 rounded-full blur-[150px] opacity-8 -mt-48 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 mb-16">

          {/* Brand */}
          <div className="md:col-span-5 space-y-7">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #5B4BF5, #0EC8A0)' }}>
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-black tracking-[0.28em] uppercase" style={{ color: '#5B4BF5AA' }}>HR Saarthi</span>
                <span className="font-bold text-xl text-white tracking-tight">Elite <span className="text-gray-500 font-light">Builder</span></span>
              </div>
            </Link>

            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              Engineering the next generation of professional identities with AI-driven precision and world-class design.
            </p>

            <div className="flex gap-3">
              <SocialIcon icon={<Linkedin size={16} />} href="#" />
              <SocialIcon icon={<Twitter size={16} />} href="#" />
              <SocialIcon icon={<Mail size={16} />} href="mailto:hello@hrsaarthi.com" />
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Shield size={13} className="text-emerald-500" /> 100% Data Secure · SSL Encrypted
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-black text-[9px] uppercase tracking-[0.28em] mb-7">Platform</h4>
              <ul className="space-y-4">
                <FooterLink to="/builder">Elite Builder</FooterLink>
                <FooterLink to="/templates">Template Library</FooterLink>
                <FooterLink to="/ats-score">AI Score Engine</FooterLink>
                <FooterLink to="/upgrade">Pricing Plans</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-[9px] uppercase tracking-[0.28em] mb-7">AI Tools</h4>
              <ul className="space-y-4">
                <FooterLink to="/cover-letter">Cover Letter AI</FooterLink>
                <FooterLink to="/interview-prep">Interview Coach</FooterLink>
                <FooterLink to="/ats-score">ATS Checker</FooterLink>
                <FooterLink to="/dashboard">My Dashboard</FooterLink>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-white font-black text-[9px] uppercase tracking-[0.28em] mb-7">Legal & Support</h4>
              <ul className="space-y-4">
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
                <FooterLink to="/login">Sign In</FooterLink>
                <li>
                  <a href="mailto:hello@hrsaarthi.com"
                    className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              © {year} HR Saarthi — All rights reserved.
            </p>
            <span className="hidden sm:inline text-gray-700">·</span>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
              A part of <span className="text-gray-500">Prachi Digital Ventures</span>
            </p>
          </div>
          <p className="text-[10px] font-black text-gray-600 flex items-center gap-2 uppercase tracking-widest">
            Handcrafted with <Heart size={11} className="text-rose-600 fill-rose-600" /> for Indian Professionals
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
        {children}
      </Link>
    </li>
  )
}

function SocialIcon({ icon, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all text-gray-500 hover:text-white"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#5B4BF5'; e.currentTarget.style.borderColor = '#5B4BF5' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
      {icon}
    </a>
  )
}
