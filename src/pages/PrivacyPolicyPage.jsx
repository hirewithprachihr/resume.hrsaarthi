import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const EFFECTIVE_DATE = 'April 7, 2026'
const COMPANY       = 'Prachi Digital Ventures'
const PRODUCT       = 'HR Saarthi'
const EMAIL         = 'hello@hrsaarthi.com'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F7FF' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1040 100%)' }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none" style={{ background: '#5B4BF5' }} />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(91,75,245,0.2)', border: '1px solid rgba(91,75,245,0.3)' }}>
            <Shield size={26} className="text-indigo-400" />
          </div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-3 tracking-tight">
            Privacy Policy
          </motion.h1>
          <p className="text-gray-400 text-sm font-medium">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-10">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm space-y-10">
          <Section title="1. Overview">
            <p>This Privacy Policy describes how <strong>{COMPANY}</strong> ("we", "our", or "us"), operator of <strong>{PRODUCT}</strong>, collects, uses, and protects information you provide when using our resume-building platform at <strong>hrsaarthi.com</strong>.</p>
            <p>By accessing or using our services, you agree to the collection and use of information as described in this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of information:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials when you sign up or log in using Google OAuth or email/password.</li>
              <li><strong>Resume Data:</strong> Professional history, education, skills, contact details, and other information you enter into the resume builder. This data is stored securely in your account and is under your full control.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, and session duration to help us improve the platform. Collected via standard server logs and anonymised analytics.</li>
              <li><strong>Payment Information:</strong> Subscription payment is processed by Razorpay. We do not store card numbers or sensitive financial data. Razorpay's own privacy policy governs payment data.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To provide, operate, and maintain the HR Saarthi platform</li>
              <li>To save and sync your resume data across devices</li>
              <li>To process subscription payments and manage your plan</li>
              <li>To send transactional emails (e.g. account verification, password reset)</li>
              <li>To improve the product through aggregate, anonymised usage analytics</li>
              <li>To respond to support queries you send us</li>
            </ul>
            <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </Section>

          <Section title="4. Data Storage & Security">
            <p>Your data is stored on Supabase infrastructure powered by AWS. We use enterprise-grade Row-Level Security (RLS) policies on all database tables — only you can access your own resume data.</p>
            <p>All connections between your browser and our servers are encrypted using SSL/TLS (HTTPS). We follow industry best practices including secure token storage and regular security audits.</p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>We use the following trusted third-party services. Each has its own privacy policy:</p>
            <ul>
              <li><strong>Supabase</strong> — Database, authentication, and file storage</li>
              <li><strong>Razorpay</strong> — Payment processing for subscriptions</li>
              <li><strong>OpenAI</strong> — AI-powered resume parsing and content generation (prompts are processed in-memory and not stored)</li>
              <li><strong>Google Fonts</strong> — Font loading via CDN</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>We use essential session cookies to keep you logged in. We do not use advertising cookies or cross-site tracking. You can disable cookies in your browser settings, but certain features (such as staying logged in) require them.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access and download all resume data stored in your account</li>
              <li>Edit or delete your resume data at any time from your dashboard</li>
              <li>Delete your account and all associated data by emailing us at <a href={`mailto:${EMAIL}`} className="text-indigo-600 font-semibold hover:underline">{EMAIL}</a></li>
              <li>Opt out of any non-essential communications</li>
            </ul>
          </Section>

          <Section title="8. Children's Privacy">
            <p>HR Saarthi is intended for users who are 18 years of age or older. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal information, please contact us immediately.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Effective Date" at the top of this page and notify registered users via email if the changes are material.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For any privacy-related questions or data requests, please contact:</p>
            <div className="mt-3 p-5 rounded-2xl" style={{ background: '#F5F7FF', border: '1px solid rgba(91,75,245,0.1)' }}>
              <div className="font-black text-gray-900">{COMPANY}</div>
              <div className="text-sm text-gray-500 mt-1">Operating: {PRODUCT}</div>
              <a href={`mailto:${EMAIL}`} className="text-indigo-600 font-semibold text-sm hover:underline">{EMAIL}</a>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-black text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-gray-800 [&_a]:text-indigo-600">
        {children}
      </div>
    </div>
  )
}
