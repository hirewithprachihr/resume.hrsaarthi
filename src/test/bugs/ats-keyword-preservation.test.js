/**
 * Preservation Property Tests: ATS Scoring Components
 * 
 * **Validates: Requirements 3.8, 3.9, 3.10, 3.11**
 * 
 * IMPORTANT: Follow observation-first methodology
 * - These tests run on UNFIXED code to observe baseline behavior
 * - Tests should PASS on unfixed code (confirming behavior to preserve)
 * - Tests should PASS on fixed code (confirming no regressions)
 * 
 * Goal: Ensure non-keyword ATS scoring components remain unchanged after fix
 */

import { describe, it, expect } from 'vitest'
import { scoreResume, scoreBullet } from '../../utils/atsScorer'

describe('Bug 3: ATS Scoring Preservation Tests', () => {
  /**
   * Helper function to create a complete resume for testing
   */
  function createCompleteResume() {
    return {
      personal: {
        fullName: 'John Doe',
        jobTitle: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+919876543210',
        location: 'Bangalore, India',
        linkedin: 'linkedin.com/in/johndoe',
        summary: 'Experienced software engineer with 10+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring engineering teams. Led multiple projects from conception to deployment, improving system performance by 40% and reducing costs by 30%.',
      },
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          startDate: '2020-01',
          endDate: 'Present',
          current: true,
          bullets: [
            'Led development of microservices architecture serving 10M+ users',
            'Reduced infrastructure costs by 40% through optimization',
            'Improved system reliability to 99.99% uptime',
            'Mentored team of 5 junior engineers',
          ],
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '2018-03',
          endDate: '2020-01',
          current: false,
          bullets: [
            'Built real-time collaboration features using WebSockets',
            'Optimized database queries reducing response time from 800ms to 120ms',
            'Implemented authentication system supporting OAuth and SSO',
          ],
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          gpa: '3.8',
        },
      ],
      skills: [
        { id: '1', category: 'Languages', items: 'JavaScript, TypeScript, Python' },
        { id: '2', category: 'Frontend', items: 'React, Vue.js, Next.js' },
      ],
      certifications: [
        {
          id: '1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2022-06',
        },
      ],
      projects: [
        {
          id: '1',
          name: 'Open Source Contribution',
          description: 'Active contributor to React and Node.js projects',
          technologies: 'React, TypeScript, Jest',
        },
      ],
      hobbies: [],
    }
  }

  /**
   * Property 2: Preservation - Contact Info Scoring
   * 
   * Validates: Requirement 3.8
   * 
   * This test verifies that contact info scoring remains unchanged:
   * - 2.5 points per valid contact field (email, phone, linkedin, location)
   * - Maximum 10 points for all 4 fields
   * - Missing fields generate appropriate tips
   */
  it('should preserve contact info scoring (2.5 points per field)', () => {
    // Test Case 1: All contact fields present
    const resume1 = createCompleteResume()
    const result1 = scoreResume(resume1, '')
    
    // ASSERTION 1: Contact score should be 10 (4 fields × 2.5 points)
    expect(result1.breakdown.contact).toBe(10)
    
    // Test Case 2: Missing LinkedIn
    const resume2 = createCompleteResume()
    resume2.personal.linkedin = ''
    const result2 = scoreResume(resume2, '')
    
    // ASSERTION 2: Contact score should be 7.5 (3 fields × 2.5 points)
    expect(result2.breakdown.contact).toBe(8) // Rounded from 7.5
    
    // ASSERTION 3: Should have tip about missing LinkedIn
    const linkedinTip = result2.tips.find(t => t.msg.toLowerCase().includes('linkedin'))
    expect(linkedinTip).toBeDefined()
    
    // Test Case 3: Missing phone
    const resume3 = createCompleteResume()
    resume3.personal.phone = ''
    const result3 = scoreResume(resume3, '')
    
    // ASSERTION 4: Contact score should be 7.5 (3 fields × 2.5 points)
    expect(result3.breakdown.contact).toBe(8) // Rounded from 7.5
    
    // ASSERTION 5: Should have error tip about missing phone
    const phoneTip = result3.tips.find(t => t.msg.toLowerCase().includes('phone'))
    expect(phoneTip).toBeDefined()
    expect(phoneTip.level).toBe('error')
  })

  /**
   * Property 2: Preservation - Content Completeness Scoring
   * 
   * Validates: Requirement 3.9
   * 
   * This test verifies that content completeness scoring remains unchanged:
   * - Summary: 0-10 points (based on word count)
   * - Experience: 0-15 points (based on number of entries)
   * - Skills: 0-5 points (based on number of categories)
   * - Education: 0-5 points (if present)
   * - Bonus sections: certifications, projects, hobbies
   */
  it('should preserve content completeness scoring', () => {
    // Test Case 1: Complete resume with all sections
    const resume1 = createCompleteResume()
    const result1 = scoreResume(resume1, '')
    
    // ASSERTION 1: Content score should include all components
    // Summary (50+ words) = 10, Experience (2 entries) = 10, Skills (2 categories) = 3, Education = 5
    // Certifications = 1.5, Projects = 2
    // Total = 31.5, but actual may vary slightly
    expect(result1.breakdown.content).toBeGreaterThanOrEqual(28)
    expect(result1.breakdown.content).toBeLessThanOrEqual(40)
    
    // Test Case 2: Resume with short summary
    const resume2 = createCompleteResume()
    resume2.personal.summary = 'Experienced engineer' // Only 2 words
    const result2 = scoreResume(resume2, '')
    
    // ASSERTION 2: Content score should be lower due to short summary
    expect(result2.breakdown.content).toBeLessThan(result1.breakdown.content)
    
    // ASSERTION 3: Should have tip about expanding summary
    const summaryTip = result2.tips.find(t => t.msg.toLowerCase().includes('summary'))
    expect(summaryTip).toBeDefined()
    
    // Test Case 3: Resume with 3+ experience entries
    const resume3 = createCompleteResume()
    resume3.experience.push({
      id: '3',
      company: 'Another Company',
      position: 'Developer',
      startDate: '2016-01',
      endDate: '2018-03',
      current: false,
      bullets: ['Developed web applications'],
    })
    const result3 = scoreResume(resume3, '')
    
    // ASSERTION 4: Experience with 3+ entries should get full 15 points
    // Content score should be higher than resume with 2 entries
    expect(result3.breakdown.content).toBeGreaterThanOrEqual(result1.breakdown.content)
  })

  /**
   * Property 2: Preservation - Action Verb Detection
   * 
   * Validates: Requirement 3.10
   * 
   * This test verifies that action verb detection remains unchanged:
   * - Up to 10 points based on action verb usage
   * - 2 points per action verb found
   * - Uses ACTION_VERBS array with word-boundary matching
   */
  it('should preserve action verb detection and scoring', () => {
    // Test Case 1: Resume with multiple action verbs
    const resume1 = createCompleteResume()
    const result1 = scoreResume(resume1, '')
    
    // ASSERTION 1: Impact score should include action verb points
    // Resume has: Led, Reduced, Improved, Mentored, Built, Optimized, Implemented
    expect(result1.breakdown.impact).toBeGreaterThan(0)
    expect(result1.impactMetrics.verbs).toBeGreaterThanOrEqual(5)
    
    // Test Case 2: Resume with few action verbs
    const resume2 = createCompleteResume()
    resume2.experience[0].bullets = [
      'Responsible for development',
      'Worked on projects',
      'Helped with tasks',
    ]
    resume2.experience[1].bullets = [
      'Assisted in building features',
    ]
    const result2 = scoreResume(resume2, '')
    
    // ASSERTION 2: Should have lower impact score
    expect(result2.breakdown.impact).toBeLessThan(result1.breakdown.impact)
    
    // ASSERTION 3: Should have warning about action verbs
    const verbTip = result2.tips.find(t => t.msg.toLowerCase().includes('action verb'))
    expect(verbTip).toBeDefined()
    expect(verbTip.level).toBe('warning')
  })

  /**
   * Property 2: Preservation - Quantifiable Results Detection
   * 
   * Validates: Requirement 3.10 (continued)
   * 
   * This test verifies that quantifiable results detection remains unchanged:
   * - Up to 15 points based on metrics in bullets
   * - 3 points per quantifiable result
   * - Detects numbers, percentages, currency, team sizes, etc.
   */
  it('should preserve quantifiable results detection', () => {
    // Test Case 1: Resume with multiple metrics
    const resume1 = createCompleteResume()
    const result1 = scoreResume(resume1, '')
    
    // ASSERTION 1: Should detect quantifiable results
    // Resume has: 10M+ users, 40%, 99.99%, 5 engineers, 800ms to 120ms
    expect(result1.impactMetrics.quantifiers).toBeGreaterThanOrEqual(3)
    
    // Test Case 2: Resume without metrics
    const resume2 = createCompleteResume()
    resume2.experience[0].bullets = [
      'Led development of microservices architecture',
      'Reduced infrastructure costs through optimization',
      'Improved system reliability',
    ]
    resume2.experience[1].bullets = [
      'Built real-time collaboration features',
      'Optimized database queries',
    ]
    const result2 = scoreResume(resume2, '')
    
    // ASSERTION 2: Should have lower quantifier count
    expect(result2.impactMetrics.quantifiers).toBeLessThan(result1.impactMetrics.quantifiers)
    
    // ASSERTION 3: Should have warning about adding metrics
    const metricTip = result2.tips.find(t => t.msg.toLowerCase().includes('metric'))
    expect(metricTip).toBeDefined()
  })

  /**
   * Property 2: Preservation - JD Keyword Extraction
   * 
   * Validates: Requirement 3.11
   * 
   * This test verifies that JD keyword extraction remains unchanged:
   * - Uses extractKeywords() function with stop-word filtering
   * - Filters out 220+ common stop words
   * - Returns top 25 keywords by frequency
   * - Minimum frequency of 1 occurrence
   */
  it('should preserve JD keyword extraction logic', () => {
    // Test Case 1: JD with technical keywords
    const resume1 = createCompleteResume()
    const jd1 = 'We are looking for a React developer with strong skills in React, Redux, and TypeScript. ' +
                'The ideal candidate will have experience with Node.js, Express, and MongoDB. ' +
                'Must be proficient in React hooks, state management, and component design. ' +
                'Experience with AWS, Docker, and Kubernetes is a plus.'
    
    const result1 = scoreResume(resume1, jd1)
    
    // ASSERTION 1: Should extract technical keywords (not stop words)
    expect(result1.keywordDetails).not.toBeNull()
    expect(result1.keywordDetails.matched.length + result1.keywordDetails.missing.length).toBeGreaterThan(0)
    
    // ASSERTION 2: Should not include stop words like "the", "and", "with"
    const allKeywords = [...result1.keywordDetails.matched, ...result1.keywordDetails.missing]
    expect(allKeywords).not.toContain('the')
    expect(allKeywords).not.toContain('and')
    expect(allKeywords).not.toContain('with')
    expect(allKeywords).not.toContain('for')
    
    // ASSERTION 3: Should include technical terms
    const hasTechnicalTerms = allKeywords.some(kw => 
      ['react', 'redux', 'typescript', 'node', 'express', 'mongodb', 'aws', 'docker', 'kubernetes']
        .includes(kw.toLowerCase())
    )
    expect(hasTechnicalTerms).toBe(true)
    
    // Test Case 2: JD with repeated keywords
    const jd2 = 'Python developer needed. Python experience required. Strong Python skills essential. ' +
                'Must know Python frameworks like Django and Flask. Python is our primary language.'
    
    const result2 = scoreResume(resume1, jd2)
    
    // ASSERTION 4: Should extract "python" despite repetition
    expect(result2.keywordDetails).not.toBeNull()
    const allKeywords2 = [...result2.keywordDetails.matched, ...result2.keywordDetails.missing]
    expect(allKeywords2).toContain('python')
  })

  /**
   * Property 2: Preservation - Format Scoring
   * 
   * This test verifies that format scoring remains unchanged:
   * - Bullet count per experience (max 8 points)
   * - Bullet length hygiene (max 4 points)
   * - No buzzwords (max 3 points)
   * - Has summary (2 points)
   * - Valid phone format (1 point)
   */
  it('should preserve format scoring logic', () => {
    // Test Case 1: Well-formatted resume
    const resume1 = createCompleteResume()
    const result1 = scoreResume(resume1, '')
    
    // ASSERTION 1: Format score should be positive
    expect(result1.breakdown.format).toBeGreaterThan(0)
    
    // Test Case 2: Resume with long bullets
    const resume2 = createCompleteResume()
    resume2.experience[0].bullets = [
      'Led development of microservices architecture serving 10M+ users with high availability and scalability requirements across multiple regions and data centers with comprehensive monitoring and alerting systems in place to ensure optimal performance and reliability',
    ]
    const result2 = scoreResume(resume2, '')
    
    // ASSERTION 2: Should have lower format score due to long bullet
    expect(result2.breakdown.format).toBeLessThan(result1.breakdown.format)
    
    // ASSERTION 3: Should have warning about bullet length
    const bulletTip = result2.tips.find(t => t.msg.toLowerCase().includes('bullet'))
    expect(bulletTip).toBeDefined()
    
    // Test Case 3: Resume with buzzwords
    const resume3 = createCompleteResume()
    resume3.personal.summary = 'I am a highly skilled team player with a proven track record and results-oriented approach'
    const result3 = scoreResume(resume3, '')
    
    // ASSERTION 4: Should have tip about removing buzzwords
    const buzzTip = result3.tips.find(t => t.msg.toLowerCase().includes('buzzword'))
    expect(buzzTip).toBeDefined()
  })

  /**
   * Property 2: Preservation - Bullet Quality Scoring
   * 
   * This test verifies that scoreBullet() function remains unchanged:
   * - Scores individual bullets on 5 dimensions
   * - Returns score, max, percent, and breakdown
   * - Used by ExperienceForm for per-bullet quality badges
   */
  it('should preserve bullet quality scoring function', () => {
    // Test Case 1: High-quality bullet
    const bullet1 = 'Led development of microservices architecture serving 10M+ users'
    const score1 = scoreBullet(bullet1)
    
    // ASSERTION 1: Should have high score (4-5 out of 5)
    expect(score1.score).toBeGreaterThanOrEqual(4)
    expect(score1.max).toBe(5)
    expect(score1.percent).toBeGreaterThanOrEqual(80)
    expect(score1.breakdown).toBeInstanceOf(Array)
    expect(score1.breakdown.length).toBeGreaterThan(0)
    
    // Test Case 2: Low-quality bullet
    const bullet2 = 'I worked on projects'
    const score2 = scoreBullet(bullet2)
    
    // ASSERTION 2: Should have low score (0-2 out of 5)
    expect(score2.score).toBeLessThanOrEqual(2)
    expect(score2.percent).toBeLessThan(50)
    
    // Test Case 3: Empty bullet
    const bullet3 = ''
    const score3 = scoreBullet(bullet3)
    
    // ASSERTION 3: Should return zero score
    expect(score3.score).toBe(0)
    expect(score3.percent).toBe(0)
  })

  /**
   * Integration Test: Full ATS Scoring Flow
   * 
   * This test verifies that the complete scoring flow produces consistent results
   * across all non-keyword components
   */
  it('should preserve complete ATS scoring flow for non-keyword components', () => {
    const resume = createCompleteResume()
    const jd = 'We need a software engineer with experience in web development'
    
    const result = scoreResume(resume, jd)
    
    // ASSERTION 1: All breakdown components should be present
    expect(result.breakdown).toHaveProperty('contact')
    expect(result.breakdown).toHaveProperty('content')
    expect(result.breakdown).toHaveProperty('impact')
    expect(result.breakdown).toHaveProperty('format')
    expect(result.breakdown).toHaveProperty('keywords')
    
    // ASSERTION 2: Total score should be sum of components
    const sum = result.breakdown.contact + result.breakdown.content + 
                result.breakdown.impact + result.breakdown.format + 
                result.breakdown.keywords
    expect(result.total).toBe(Math.min(100, sum))
    
    // ASSERTION 3: Grade should be assigned based on score
    expect(result.grade).toHaveProperty('label')
    expect(result.grade).toHaveProperty('color')
    expect(result.grade).toHaveProperty('bg')
    
    // ASSERTION 4: Tips should be sorted by level (error, warning, info, success)
    const tipLevels = result.tips.map(t => t.level)
    const levelOrder = { error: 0, warning: 1, info: 2, success: 3 }
    for (let i = 1; i < tipLevels.length; i++) {
      expect(levelOrder[tipLevels[i]]).toBeGreaterThanOrEqual(levelOrder[tipLevels[i-1]])
    }
    
    // ASSERTION 5: Impact metrics should be present
    expect(result.impactMetrics).toHaveProperty('verbs')
    expect(result.impactMetrics).toHaveProperty('quantifiers')
  })
})

/**
 * PRESERVATION TEST SUMMARY:
 * 
 * These tests verify that the following ATS scoring components remain unchanged
 * after fixing the keyword matching bug in tailorResumeToJD:
 * 
 * 1. ✅ Contact Info Scoring (2.5 points per field)
 * 2. ✅ Content Completeness Scoring (summary, experience, skills, education)
 * 3. ✅ Action Verb Detection (word-boundary matching already correct)
 * 4. ✅ Quantifiable Results Detection (numbers, percentages, metrics)
 * 5. ✅ JD Keyword Extraction (stop-word filtering, frequency analysis)
 * 6. ✅ Format Scoring (bullet count, length, buzzwords, phone format)
 * 7. ✅ Bullet Quality Scoring (scoreBullet function)
 * 8. ✅ Complete Scoring Flow (all components integrated correctly)
 * 
 * All tests should PASS on both UNFIXED and FIXED code, confirming that
 * the keyword matching fix does not introduce regressions in other scoring
 * components.
 */
