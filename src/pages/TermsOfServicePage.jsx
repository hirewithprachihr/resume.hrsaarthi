import { motion } from 'framer-motion'
import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const EFFECTIVE_DATE = 'April 7, 2026'
const COMPANY       = 'Prachi Digital Ventures'
const PRODUCT       = 'HR Saarthi'
const EMAIL         = 'hello@hrsaarthi.com'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F7FF' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0A2010 100%)' }}>
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none" style={{ background: '#0EC8A0' }} />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(14,200,160,0.15)', border: '1px solid rgba(14,200,160,0.3)' }}>
            <FileText size={26} className="text-emerald-400" />
          </div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-3 tracking-tight">
            Terms of Service
          </motion.h1>
          <p className="text-gray-400 text-sm font-medium">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-10">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm space-y-10">
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using <strong>{PRODUCT}</strong> ("the Platform"), a product of <strong>{COMPANY}</strong>, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, please discontinue use of the Platform immediately.</p>
            <p>These Terms apply to all visitors, registered users, and paying subscribers of the Platform.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>{PRODUCT} is an AI-powered resume builder platform that enables users to:</p>
            <ul>
              <li>Create, edit, and export ATS-optimised professional resumes</li>
              <li>Generate AI-powered cover letters tailored to specific job descriptions</li>
              <li>Score resumes against ATS compatibility metrics</li>
              <li>Access interview preparation questions and coaching</li>
            </ul>
            <p>Certain features are available to all users for free; advanced features require an active <strong>Elite Pro</strong> subscription.</p>
          </Section>

          <Section title="3. Account Registration">
            <ul>
              <li>You must be at least 18 years of age to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your credentials.</li>
              <li>You agree to provide accurate and truthful information when registering.</li>
              <li>You may not create more than one account per person. Accounts are non-transferable.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Subscriptions & Payments">
            <p><strong>Free Plan:</strong> Available with no payment required. Includes limited templates and features.</p>
            <p><strong>Elite Pro Plan:</strong> A paid subscription (monthly or annual) that unlocks all templates, AI tools, and advanced features. Prices are displayed on the Pricing page.</p>
            <ul>
              <li>All payments are processed securely through <strong>Razorpay</strong>. We do not store your payment details.</li>
              <li>Subscriptions automatically renew at the end of each billing period unless cancelled.</li>
              <li>You may cancel your subscription at any time. Access continues until the end of the paid period. <strong>Refunds are not provided</strong> for partial billing periods, except where required by applicable Indian law.</li>
              <li>We reserve the right to modify subscription pricing with 30 days' prior notice to active subscribers.</li>
            </ul>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to use the Platform to:</p>
            <ul>
              <li>Submit false, misleading, or fraudulent information in any resume or profile</li>
              <li>Reproduce, resell, or commercially exploit our templates or AI outputs without our written consent</li>
              <li>Attempt to reverse-engineer, scrape, or disrupt the Platform's systems</li>
              <li>Upload content that infringes third-party intellectual property rights</li>
              <li>Engage in any activity that violates applicable Indian or international law</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p><strong>Our Content:</strong> All templates, design systems, AI models, and Platform code are the property of {COMPANY}. You may not copy, modify, or distribute them without explicit written permission.</p>
            <p><strong>Your Content:</strong> Resume data you enter remains yours. You grant us a limited, non-exclusive licence to store and process your data solely to provide the services described in this Agreement. We will never claim ownership of your personal career information.</p>
          </Section>

          <Section title="7. AI-Generated Content Disclaimer">
            <p>The Platform uses AI to help generate resume bullet points, cover letters, and interview questions. While we strive for accuracy, AI-generated content:</p>
            <ul>
              <li>May not always be perfectly accurate, appropriate, or complete</li>
              <li>Should be reviewed and edited by you before submission to employers</li>
              <li>Does not constitute professional career advice</li>
            </ul>
            <p><strong>{COMPANY}</strong> is not responsible for outcomes (including job rejections or offers) that result from content generated by the Platform.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, {COMPANY} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to:</p>
            <ul>
              <li>Loss of employment opportunities</li>
              <li>Reliance on AI-generated content</li>
              <li>Data loss due to technical failures (though we maintain regular backups)</li>
            </ul>
            <p>Our total liability in any case shall not exceed the amount paid by you in the 3 months preceding the claim.</p>
          </Section>

          <Section title="9. Termination">
            <p>We reserve the right to suspend or terminate your account at our sole discretion, with or without notice, if we determine that you have violated these Terms. Upon termination:</p>
            <ul>
              <li>Your right to access the Platform ceases immediately</li>
              <li>You may request a data export within 30 days of termination</li>
              <li>Your data will be deleted after 90 days unless otherwise requested</li>
            </ul>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Mumbai, Maharashtra</strong>.</p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>We may update these Terms at any time. Material changes will be communicated via email to registered users at least 14 days before taking effect. Continued use of the Platform after the effective date constitutes acceptance of the updated Terms.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For questions about these Terms:</p>
            <div className="mt-3 p-5 rounded-2xl" style={{ background: '#F5F7FF', border: '1px solid rgba(14,200,160,0.15)' }}>
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
