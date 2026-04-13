/**
 * Bug Condition Exploration Test: ATS Keyword False Positives
 * 
 * **Validates: Requirements 1.7, 1.8, 1.9**
 * 
 * CRITICAL: This test encodes the EXPECTED behavior (what SHOULD happen).
 * - On UNFIXED code: This test FAILS (proving the bug exists)
 * - On FIXED code: This test PASSES (confirming the fix works)
 * 
 * Bug Condition: ATS scorer uses substring matching causing false positives
 * Expected Behavior: Word-boundary regex should match only complete words
 */

import { describe, it, expect } from 'vitest'
import { scoreResume, getKeywordGaps, tailorResumeToJD } from '../../utils/atsScorer'

describe('Bug 3: ATS Keyword False Positives', () => {
  /**
   * Helper function to create a resume with specific text content
   */
  function createResumeWithText(text) {
    return {
      personal: {
        fullName: 'Test User',
        jobTitle: 'Software Developer',
        email: 'test@example.com',
        phone: '+1234567890',
        location: 'Test City',
        linkedin: 'linkedin.com/in/testuser',
        summary: text,
      },
      experience: [
        {
          id: '1',
          company: 'Test Company',
          position: 'Developer',
          startDate: '2020-01',
          endDate: 'Present',
          current: true,
          bullets: [text],
        },
      ],
      education: [
        {
          id: '1',
          institution: 'Test University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
        },
      ],
      skills: [
        { id: '1', category: 'Technical', items: text },
      ],
      certifications: [],
      projects: [],
      hobbies: [],
    }
  }

  /**
   * Property 1: Bug Condition - ATS Keyword Substring Matching
   * 
   * This test verifies the EXPECTED behavior:
   * - Keyword "react" should NOT match "interactive" (false positive)
   * - Keyword "react" should NOT match "overreact" (false positive)
   * - Keyword "react" should NOT match "reaction" (false positive)
   * - Keyword "java" should NOT match "javascript" (false positive)
   * - Keyword matching should use word-boundary regex (\breact\b)
   * - Keyword match percentages should be accurate (whole-word only)
   * 
   * On UNFIXED code, this test would FAIL because:
   * - Current implementation uses .includes() substring matching
   * - "react" matches "interactive", "overreact", "reaction" as substrings
   * - "java" matches "javascript" as substring
   * - Keyword match percentages are inflated due to false positives
   */
  it('should NOT match keywords as substrings (false positives)', () => {
    // Test Case 1: "react" should NOT match "interactive"
    const resume1 = createResumeWithText('I have experience with interactive design and user interfaces')
    const jd1 = 'We are looking for a React developer with strong skills in React and Redux. ' +
                'The ideal candidate will have experience building modern web applications. ' +
                'Must be proficient in React hooks, state management, and component design.'
    
    const result1 = scoreResume(resume1, jd1)
    
    // ASSERTION 1: "react" should NOT be found in "interactive"
    // On UNFIXED code, this would FAIL - substring match would report "react" as present
    expect(result1.keywordDetails).not.toBeNull()
    expect(result1.keywordDetails.matched).not.toContain('react')
    expect(result1.keywordDetails.missing).toContain('react')
    
    // ASSERTION 2: Keyword match percentage should be low (no false positives)
    // On UNFIXED code, this would FAIL - inflated percentage due to substring match
    expect(result1.keywordDetails.matchPercent).toBeLessThan(50)

    // Test Case 2: "react" should NOT match "overreact"
    const resume2 = createResumeWithText('I tend to overreact to bugs but always fix them quickly and efficiently')
    const jd2 = 'Looking for React developer with experience in modern frontend frameworks. ' +
                'Must have strong React skills and understanding of component lifecycle.'
    
    const result2 = scoreResume(resume2, jd2)
    
    // ASSERTION 3: "react" should NOT be found in "overreact"
    // On UNFIXED code, this would FAIL - substring match
    expect(result2.keywordDetails).not.toBeNull()
    expect(result2.keywordDetails.matched).not.toContain('react')
    expect(result2.keywordDetails.missing).toContain('react')

    // Test Case 3: "react" should NOT match "reaction"
    const resume3 = createResumeWithText('Quick reaction time and problem-solving skills with attention to detail')
    const jd3 = 'React developer needed for building scalable web applications. ' +
                'Strong React knowledge required with experience in hooks and context.'
    
    const result3 = scoreResume(resume3, jd3)
    
    // ASSERTION 4: "react" should NOT be found in "reaction"
    // On UNFIXED code, this would FAIL - substring match
    expect(result3.keywordDetails).not.toBeNull()
    expect(result3.keywordDetails.matched).not.toContain('react')
    expect(result3.keywordDetails.missing).toContain('react')

    // Test Case 4: "java" should NOT match "javascript"
    const resume4 = createResumeWithText('Expert in JavaScript, TypeScript, and Node.js development with modern frameworks')
    const jd4 = 'We need a Java developer with Spring Boot experience and microservices architecture. ' +
                'Strong Java programming skills required with knowledge of enterprise patterns.'
    
    const result4 = scoreResume(resume4, jd4)
    
    // ASSERTION 5: "java" should NOT be found in "javascript"
    // On UNFIXED code, this would FAIL - substring match
    expect(result4.keywordDetails).not.toBeNull()
    expect(result4.keywordDetails.matched).not.toContain('java')
    expect(result4.keywordDetails.missing).toContain('java')
  })

  /**
   * Property 1 (Continued): Verify correct whole-word matches
   * 
   * This test ensures that legitimate whole-word matches still work correctly
   */
  it('should match keywords as complete words (true positives)', () => {
    // Test Case 1: "react" SHOULD match "React" (whole word)
    const resume1 = createResumeWithText('I have 5 years of experience with React and Redux building modern applications')
    const jd1 = 'Looking for React developer with experience in modern frontend frameworks. ' +
                'Must have strong React skills and understanding of component lifecycle.'
    
    const result1 = scoreResume(resume1, jd1)
    
    // ASSERTION 1: "react" should be found as whole word
    expect(result1.keywordDetails).not.toBeNull()
    expect(result1.keywordDetails.matched).toContain('react')
    expect(result1.keywordDetails.missing).not.toContain('react')
    
    // ASSERTION 2: Keyword match percentage should be high
    expect(result1.keywordDetails.matchPercent).toBeGreaterThan(50)

    // Test Case 2: "java" SHOULD match "Java" (whole word)
    const resume2 = createResumeWithText('Proficient in Java, Spring Boot, and Hibernate with enterprise experience')
    const jd2 = 'Java developer needed for building scalable enterprise applications. ' +
                'Strong Java programming skills required with Spring Boot knowledge.'
    
    const result2 = scoreResume(resume2, jd2)
    
    // ASSERTION 3: "java" should be found as whole word
    expect(result2.keywordDetails).not.toBeNull()
    expect(result2.keywordDetails.matched).toContain('java')
    expect(result2.keywordDetails.missing).not.toContain('java')

    // Test Case 3: Multiple keywords with word boundaries
    const resume3 = createResumeWithText('Expert in React, Node.js, Python, and Docker with cloud deployment experience')
    const jd3 = 'We need React and Python developer with Docker experience for cloud infrastructure. ' +
                'Must be proficient in React, Python, and Docker containerization.'
    
    const result3 = scoreResume(resume3, jd3)
    
    // ASSERTION 4: All whole-word keywords should be matched
    expect(result3.keywordDetails).not.toBeNull()
    expect(result3.keywordDetails.matched).toContain('react')
    expect(result3.keywordDetails.matched).toContain('python')
    expect(result3.keywordDetails.matched).toContain('docker')
    
    // ASSERTION 5: Match percentage should be high (80%+)
    expect(result3.keywordDetails.matchPercent).toBeGreaterThanOrEqual(80)
  })

  /**
   * Property 1 (Continued): Test getKeywordGaps function
   * 
   * Verify that keyword gap analysis uses word-boundary matching
   */
  it('should use word-boundary matching in getKeywordGaps', () => {
    // Test Case 1: "react" in "interactive" should NOT match
    const resumeText1 = 'I have experience with interactive design and user interfaces'
    const jd1 = 'React developer needed with strong React skills and modern frontend experience. ' +
                'Must be proficient in React hooks and component architecture.'
    
    const gaps1 = getKeywordGaps(resumeText1, jd1)
    
    // ASSERTION 1: "react" should be in missing keywords
    // On UNFIXED code, this would FAIL - substring match would report as present
    expect(gaps1.missing).toContain('react')
    expect(gaps1.present).not.toContain('react')
    
    // ASSERTION 2: Match percentage should be 0%
    expect(gaps1.matchPercent).toBe(0)

    // Test Case 2: "java" in "javascript" should NOT match
    const resumeText2 = 'JavaScript and TypeScript expert with modern web development skills'
    const jd2 = 'Java developer with Spring Boot and microservices architecture experience. ' +
                'Strong Java programming skills required for enterprise applications.'
    
    const gaps2 = getKeywordGaps(resumeText2, jd2)
    
    // ASSERTION 3: "java" should be in missing keywords
    // On UNFIXED code, this would FAIL - substring match
    expect(gaps2.missing).toContain('java')
    expect(gaps2.present).not.toContain('java')

    // Test Case 3: Correct whole-word match
    const resumeText3 = 'React and Redux development with modern frontend architecture'
    const jd3 = 'React developer needed with experience in modern web applications. ' +
                'Must have strong React skills and component design knowledge.'
    
    const gaps3 = getKeywordGaps(resumeText3, jd3)
    
    // ASSERTION 4: "react" should be in present keywords
    expect(gaps3.present).toContain('react')
    expect(gaps3.missing).not.toContain('react')
    
    // ASSERTION 5: Match percentage should be 100%
    expect(gaps3.matchPercent).toBe(100)
  })

  /**
   * Property 1 (Continued): Test tailorResumeToJD function
   * 
   * Verify that tailor-to-JD suggestions use word-boundary matching
   */
  it('should use word-boundary matching in tailorResumeToJD', () => {
    // Test Case 1: "react" in "interactive" should be flagged as missing
    const resume1 = createResumeWithText('I have experience with interactive design and user interfaces')
    const jd1 = 'React developer needed with strong React skills and modern frontend experience. ' +
                'Must be proficient in React hooks, state management, and component design.'
    
    const suggestions1 = tailorResumeToJD(resume1, jd1)
    
    // ASSERTION 1: Should suggest adding "react" keyword
    // On UNFIXED code, this would FAIL - substring match would not flag as missing
    const keywordSuggestion = suggestions1.find(s => s.type === 'keyword')
    expect(keywordSuggestion).toBeDefined()
    expect(keywordSuggestion.msg.toLowerCase()).toContain('react')

    // Test Case 2: "java" in "javascript" should be flagged as missing
    const resume2 = createResumeWithText('JavaScript and Node.js development with modern web frameworks')
    const jd2 = 'Java developer with Spring Boot experience and microservices architecture. ' +
                'Strong Java programming skills required for enterprise applications.'
    
    const suggestions2 = tailorResumeToJD(resume2, jd2)
    
    // ASSERTION 2: Should suggest adding "java" keyword
    // On UNFIXED code, this would FAIL - substring match
    const keywordSuggestion2 = suggestions2.find(s => s.type === 'keyword')
    expect(keywordSuggestion2).toBeDefined()
    expect(keywordSuggestion2.msg.toLowerCase()).toContain('java')
  })

  /**
   * Edge Case: Special regex characters should be escaped
   * 
   * This ensures keywords with special regex characters work correctly
   */
  it('should escape special regex characters in keywords', () => {
    // Test Case 1: Keyword with dot (e.g., "node.js")
    const resume1 = createResumeWithText('Expert in Node.js and Express.js with backend development experience')
    const jd1 = 'Node.js developer needed for building scalable backend services. ' +
                'Must have strong Node.js skills and experience with Express framework.'
    
    const result1 = scoreResume(resume1, jd1)
    
    // ASSERTION 1: "node.js" or "node" should be matched correctly
    // The dot should be escaped in regex to match literal dot
    expect(result1.keywordDetails).not.toBeNull()
    expect(result1.keywordDetails.matched.some(kw => kw.includes('node'))).toBe(true)

    // Test Case 2: Keyword with plus (e.g., "c++")
    const resume2 = createResumeWithText('Proficient in C++ and Python with systems programming experience')
    const jd2 = 'C++ developer needed for high-performance systems programming. ' +
                'Strong C++ skills required with knowledge of modern standards.'
    
    const result2 = scoreResume(resume2, jd2)
    
    // ASSERTION 2: "c++" or "c" should be matched correctly
    // The plus signs should be escaped in regex
    expect(result2.keywordDetails).not.toBeNull()
    expect(result2.keywordDetails.matched.some(kw => kw.includes('c'))).toBe(true)
  })

  /**
   * Integration Test: Full ATS scoring flow with word-boundary matching
   * 
   * This test verifies the complete scoring flow produces accurate results
   */
  it('should produce accurate ATS scores without false positives', () => {
    // Create resume with words that contain keywords as substrings
    const resume = createResumeWithText(
      'I have interactive design skills and tend to overreact to bugs. ' +
      'My reaction time is quick and I work well with JavaScript and TypeScript.'
    )
    
    // JD specifically wants React and Java (not JavaScript)
    const jd = 'We need a React and Java developer with strong React and Java skills'
    
    const result = scoreResume(resume, jd)
    
    // ASSERTION 1: "react" should NOT be matched (only "interactive", "overreact", "reaction")
    // On UNFIXED code, this would FAIL - all three would match as substrings
    expect(result.keywordDetails.matched).not.toContain('react')
    
    // ASSERTION 2: "java" should NOT be matched (only "javascript")
    // On UNFIXED code, this would FAIL - would match as substring
    expect(result.keywordDetails.matched).not.toContain('java')
    
    // ASSERTION 3: Both keywords should be in missing list
    expect(result.keywordDetails.missing).toContain('react')
    expect(result.keywordDetails.missing).toContain('java')
    
    // ASSERTION 4: Match percentage should be 0% (no actual matches)
    // On UNFIXED code, this would be 100% due to false positives
    expect(result.keywordDetails.matchPercent).toBe(0)
    
    // ASSERTION 5: Keyword score should be low
    // On UNFIXED code, this would be 25 (full score) due to false positives
    expect(result.breakdown.keywords).toBeLessThan(10)
  })

  /**
   * Case Sensitivity Test: Verify case-insensitive matching
   * 
   * This ensures word-boundary matching works regardless of case
   */
  it('should perform case-insensitive word-boundary matching', () => {
    // Test Case 1: Lowercase keyword, uppercase in resume
    const resume1 = createResumeWithText('I use REACT and REDUX for frontend development with modern architecture')
    const jd1 = 'react developer needed with experience in modern frontend frameworks. ' +
                'Must have strong react skills and understanding of component lifecycle.'
    
    const result1 = scoreResume(resume1, jd1)
    
    // ASSERTION 1: "react" should match "REACT" (case-insensitive)
    expect(result1.keywordDetails).not.toBeNull()
    expect(result1.keywordDetails.matched).toContain('react')
    
    // Test Case 2: Mixed case
    const resume2 = createResumeWithText('Proficient in React, Node.js, and Python with full-stack experience')
    const jd2 = 'REACT and PYTHON developer needed for building scalable applications. ' +
                'Must be proficient in REACT and PYTHON with modern development practices.'
    
    const result2 = scoreResume(resume2, jd2)
    
    // ASSERTION 2: Case-insensitive matching should work
    expect(result2.keywordDetails).not.toBeNull()
    expect(result2.keywordDetails.matched).toContain('react')
    expect(result2.keywordDetails.matched).toContain('python')
  })
})

/**
 * COUNTEREXAMPLES DOCUMENTATION (Expected on UNFIXED code):
 * 
 * When this test is run on UNFIXED code, we expect the following failures:
 * 
 * 1. False positive: "react" matches "interactive"
 *    - Expected: "react" NOT in matched keywords
 *    - Actual: "react" reported as matched (substring .includes() match)
 * 
 * 2. False positive: "react" matches "overreact"
 *    - Expected: "react" NOT in matched keywords
 *    - Actual: "react" reported as matched (substring match)
 * 
 * 3. False positive: "react" matches "reaction"
 *    - Expected: "react" NOT in matched keywords
 *    - Actual: "react" reported as matched (substring match)
 * 
 * 4. False positive: "java" matches "javascript"
 *    - Expected: "java" NOT in matched keywords
 *    - Actual: "java" reported as matched (substring match)
 * 
 * 5. Inflated keyword match percentages
 *    - Expected: 0% match when no whole-word matches exist
 *    - Actual: 100% match due to substring false positives
 * 
 * 6. Inflated keyword scores
 *    - Expected: Low keyword score (0-10) when keywords missing
 *    - Actual: High keyword score (25) due to false positive matches
 * 
 * 7. getKeywordGaps reports false positives
 *    - Expected: Keywords in "missing" list when only substrings present
 *    - Actual: Keywords in "present" list due to substring matching
 * 
 * 8. tailorResumeToJD doesn't flag missing keywords
 *    - Expected: Suggestions to add missing keywords
 *    - Actual: No suggestions because substring matches reported as present
 * 
 * These failures confirm the bug exists: ATS scorer uses substring matching
 * (.includes()) which causes false positive keyword matches, inflating scores
 * and providing inaccurate feedback to users.
 */
