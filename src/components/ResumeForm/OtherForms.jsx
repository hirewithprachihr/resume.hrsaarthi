import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '../../store/resumeStore'
import { useState } from 'react'
import clsx from 'clsx' // Added clsx import

// ── Education ─────────────────────────────────────────────────────────────────
export function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore()
  const [expanded, setExpanded] = useState({})
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <div className="space-y-3">
      {resumeData.education.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400">No education added yet</p>
        </div>
      )}
      {resumeData.education.map(edu => {
        const isOpen = expanded[edu.id] !== false
        return (
          <div key={edu.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggle(edu.id)}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{edu.degree || 'New Education'}</div>
                <div className="text-xs text-gray-500 truncate">{edu.school}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); removeEducation(edu.id) }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={13} /></button>
              {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
            {isOpen && (
              <div className="p-4 space-y-3">
                <div>
                  <label htmlFor={`edu-degree-${edu.id}`} className="label">Degree / Qualification</label>
                  <input id={`edu-degree-${edu.id}`} name="degree" className="input-field" placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`edu-school-${edu.id}`} className="label">School / University</label>
                  <input id={`edu-school-${edu.id}`} name="school" className="input-field" placeholder="IIT Bombay" value={edu.school} onChange={e => updateEducation(edu.id, { school: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`edu-location-${edu.id}`} className="label">Location</label>
                  <input id={`edu-location-${edu.id}`} name="location" className="input-field" placeholder="Mumbai, Maharashtra" value={edu.location} onChange={e => updateEducation(edu.id, { location: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor={`edu-start-${edu.id}`} className="label">Start Year</label>
                    <input id={`edu-start-${edu.id}`} name="startDate" className="input-field" placeholder="2019" value={edu.startDate} onChange={e => updateEducation(edu.id, { startDate: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor={`edu-end-${edu.id}`} className="label">End Year</label>
                    <input id={`edu-end-${edu.id}`} name="endDate" className="input-field" placeholder="2023" value={edu.endDate} onChange={e => updateEducation(edu.id, { endDate: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor={`edu-grade-${edu.id}`} className="label">Grade / CGPA</label>
                    <input id={`edu-grade-${edu.id}`} name="grade" className="input-field" placeholder="8.5 CGPA" value={edu.grade} onChange={e => updateEducation(edu.id, { grade: e.target.value })} />
                  </div>
                </div>
                 <div>
                   <label htmlFor={`edu-achievements-${edu.id}`} className="label">Achievements / Activities</label>
                   <textarea id={`edu-achievements-${edu.id}`} name="achievements" className="input-field resize-none" rows={2} placeholder="Dean's List, Hackathon winner, Student Council" value={edu.achievements} onChange={e => updateEducation(edu.id, { achievements: e.target.value })} />
                 </div>
                 

              </div>
            )}
          </div>
        )
      })}
      <button onClick={addEducation} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
        <Plus size={15} />Add Education
      </button>
    </div>
  )
}

// ── Skills ────────────────────────────────────────────────────────────────────
export function SkillsForm() {
  const { resumeData, addSkillGroup, updateSkillGroup, removeSkillGroup } = useResumeStore()

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Group skills by category for better ATS detection</p>
      {resumeData.skills.map(sk => (
        <div key={sk.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor={`skill-cat-${sk.id}`} className="label">Category</label>
              <input id={`skill-cat-${sk.id}`} name="category" className="input-field" placeholder="Technical Skills" value={sk.category} onChange={e => updateSkillGroup(sk.id, { category: e.target.value })} />
            </div>
            <button onClick={() => removeSkillGroup(sk.id)} className="mt-6 p-2 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
          </div>
          <div>
            <label htmlFor={`skill-items-${sk.id}`} className="label">Skills (comma-separated)</label>
            <textarea id={`skill-items-${sk.id}`} name="items" className="input-field resize-none" rows={2} placeholder="React, Node.js, TypeScript, MongoDB, AWS, Docker" value={sk.items} onChange={e => updateSkillGroup(sk.id, { items: e.target.value })} />
          </div>
        </div>
      ))}
      <button onClick={addSkillGroup} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
        <Plus size={15} />Add Skill Category
      </button>
    </div>
  )
}

// ── Certifications ────────────────────────────────────────────────────────────
export function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore()

  return (
    <div className="space-y-3">
      {resumeData.certifications.map(cert => (
        <div key={cert.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div>
                <label htmlFor={`cert-name-${cert.id}`} className="label">Certification Name</label>
                <input id={`cert-name-${cert.id}`} name="name" className="input-field" placeholder="AWS Certified Solutions Architect" value={cert.name} onChange={e => updateCertification(cert.id, { name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`cert-issuer-${cert.id}`} className="label">Issuing Organization</label>
                  <input id={`cert-issuer-${cert.id}`} name="issuer" className="input-field" placeholder="Amazon Web Services" value={cert.issuer} onChange={e => updateCertification(cert.id, { issuer: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`cert-date-${cert.id}`} className="label">Date</label>
                  <input id={`cert-date-${cert.id}`} name="date" className="input-field" placeholder="Mar 2023" value={cert.date} onChange={e => updateCertification(cert.id, { date: e.target.value })} />
                </div>
              </div>
              <div>
                <label htmlFor={`cert-url-${cert.id}`} className="label">Certificate URL (optional)</label>
                <input id={`cert-url-${cert.id}`} name="url" className="input-field" type="url" placeholder="https://credly.com/..." value={cert.url} onChange={e => updateCertification(cert.id, { url: e.target.value })} />
              </div>
            </div>
            <button onClick={() => removeCertification(cert.id)} className="ml-3 p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
      <button onClick={addCertification} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
        <Plus size={15} />Add Certification
      </button>
    </div>
  )
}

// ── Projects ──────────────────────────────────────────────────────────────────
export function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore()
  const [expanded, setExpanded] = useState({})
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <div className="space-y-3">
      {resumeData.projects.map(proj => {
        const isOpen = expanded[proj.id] !== false
        return (
          <div key={proj.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => toggle(proj.id)}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{proj.name || 'New Project'}</div>
                <div className="text-xs text-gray-500 truncate">{proj.tech}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); removeProject(proj.id) }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={13} /></button>
              {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
            {isOpen && (
              <div className="p-4 space-y-3">
                <div>
                  <label htmlFor={`proj-name-${proj.id}`} className="label">Project Name</label>
                  <input id={`proj-name-${proj.id}`} name="name" className="input-field" placeholder="E-Commerce Platform" value={proj.name} onChange={e => updateProject(proj.id, { name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`proj-tech-${proj.id}`} className="label">Technologies Used</label>
                  <input id={`proj-tech-${proj.id}`} name="tech" className="input-field" placeholder="React, Node.js, MongoDB, Stripe" value={proj.tech} onChange={e => updateProject(proj.id, { tech: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`proj-desc-${proj.id}`} className="label">Description</label>
                  <textarea id={`proj-desc-${proj.id}`} name="description" className="input-field resize-none" rows={3} placeholder="Built a full-stack e-commerce platform handling 10K+ monthly orders with real-time inventory tracking and Stripe payments integration." value={proj.description} onChange={e => updateProject(proj.id, { description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`proj-url-${proj.id}`} className="label">Live URL</label>
                    <input id={`proj-url-${proj.id}`} name="url" className="input-field" type="url" placeholder="https://myproject.com" value={proj.url} onChange={e => updateProject(proj.id, { url: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor={`proj-date-${proj.id}`} className="label">Date</label>
                    <input id={`proj-date-${proj.id}`} name="date" className="input-field" placeholder="Jan 2024" value={proj.date} onChange={e => updateProject(proj.id, { date: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
      <button onClick={addProject} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
        <Plus size={15} />Add Project
      </button>
    </div>
  )
}

// ── Languages ─────────────────────────────────────────────────────────────────
export function LanguagesForm() {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResumeStore()

  return (
    <div className="space-y-3">
      {(resumeData.languages || []).map(lang => (
        <div key={lang.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor={`lang-name-${lang.id}`} className="label">Language</label>
              <input id={`lang-name-${lang.id}`} name="language" className="input-field" placeholder="English" value={lang.language} onChange={e => updateLanguage(lang.id, { language: e.target.value })} />
            </div>
            <div className="flex-1">
              <label htmlFor={`lang-prof-${lang.id}`} className="label">Proficiency</label>
              <input id={`lang-prof-${lang.id}`} name="proficiency" className="input-field" placeholder="Fluent" value={lang.proficiency} onChange={e => updateLanguage(lang.id, { proficiency: e.target.value })} />
            </div>
            <button onClick={() => removeLanguage(lang.id)} className="mt-6 p-2 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <button onClick={addLanguage} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all">
        <Plus size={15} />Add Language
      </button>
    </div>
  )
}

// ── Hobbies ──────────────────────────────────────────────────────────────────
export function HobbiesForm() {
  const { resumeData, addHobby, updateHobby, removeHobby } = useResumeStore()
  
  const PRESETS = [
    { name: 'Reading', icon: '📖' },
    { name: 'Traveling', icon: '✈️' },
    { name: 'Photography', icon: '📷' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Music', icon: '🎵' },
    { name: 'Art', icon: '🎨' },
    { name: 'Coding', icon: '💻' },
    { name: 'Writing', icon: '✍️' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Showcase your personality and cultural fit. Choose from presets or add your own.</p>
      
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map(p => {
          const exists = (resumeData.hobbies || []).some(h => h.name === p.name)
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => exists ? null : addHobby(p.name)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center',
                exists 
                  ? 'bg-brand-50 border-brand-200 text-brand-600 opacity-50 cursor-default shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 hover:shadow-sm'
              )}
            >
              <span className="mr-1.5">{p.icon}</span> {p.name}
            </button>
          )
        })}
      </div>

      <div className="space-y-2">
        {(resumeData.hobbies || []).map(hobby => (
          <div key={hobby.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 group transition-all hover:bg-white hover:shadow-sm">
            <div className="flex-1">
              <input 
                id={`hobby-name-${hobby.id}`}
                name="hobby"
                aria-label="Name your hobby"
                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-800 w-full" 
                placeholder="Name your hobby..." 
                value={hobby.name} 
                onChange={e => updateHobby(hobby.id, { name: e.target.value })} 
              />
            </div>
            <button onClick={() => removeHobby(hobby.id)} className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {(!resumeData.hobbies || resumeData.hobbies.length === 0) && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
             <p className="text-xs text-gray-400">Click a preset above or add a custom hobby</p>
          </div>
        )}
      </div>

      <button onClick={() => addHobby()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 text-brand-600 text-sm font-semibold rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all mt-2">
        <Plus size={15} />Add Custom Hobby
      </button>
    </div>
  )
}
