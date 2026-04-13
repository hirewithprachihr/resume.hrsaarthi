/**
 * Indian English Spell Checker
 * ─────────────────────────────────────────────────────────────────
 * Purpose:
 *   1. Flag common Indian English misspellings in resume bullets
 *   2. Suggest corrections
 *   3. NOT a full grammar checker — focused on resume context
 *
 * Usage:
 *   import { checkSpelling, INDIAN_CORRECTIONS } from '../utils/spellChecker'
 *   const issues = checkSpelling(text)
 *   // issues: [{ word, suggestion, index, context }]
 */

/** @type {Record<string, string>} */
export const INDIAN_CORRECTIONS = {
  // Commonly misspelled in Indian English resumes
  'recieve'        : 'receive',
  'acheive'        : 'achieve',
  'acheived'       : 'achieved',
  'acheiving'      : 'achieving',
  'ammount'        : 'amount',
  'managment'      : 'management',
  'devlopment'     : 'development',
  'devloped'       : 'developed',
  'devloper'       : 'developer',
  'successfull'    : 'successful',
  'successfuly'    : 'successfully',
  'succesfully'    : 'successfully',
  'buisness'       : 'business',
  'bussiness'      : 'business',
  'busines'        : 'business',
  'accomodation'   : 'accommodation',
  'committment'    : 'commitment',
  'comittment'     : 'commitment',
  'occured'        : 'occurred',
  'occurence'      : 'occurrence',
  'seperate'       : 'separate',
  'seperating'     : 'separating',
  'seperately'     : 'separately',
  'maintainance'   : 'maintenance',
  'maintenence'    : 'maintenance',
  'performence'    : 'performance',
  'performence'    : 'performance',
  'impliment'      : 'implement',
  'implimented'    : 'implemented',
  'implimenting'   : 'implementing',
  'colaboration'   : 'collaboration',
  'colaborate'     : 'collaborate',
  'profficiency'   : 'proficiency',
  'profficient'    : 'proficient',
  'profesional'    : 'professional',
  'professionalism': 'professionalism',
  'excell'         : 'excel',
  'excellance'     : 'excellence',
  'excellant'      : 'excellent',
  'calender'       : 'calendar',
  'wrting'         : 'writing',
  'analysed'       : 'analyzed',  // Indian English often uses -ise but ATS standard is -ize
  'organised'      : 'organized',
  'optimised'      : 'optimized',
  'digitised'      : 'digitized',
  'recognised'     : 'recognized',
  'utilised'       : 'utilized',
  'standardised'   : 'standardized',
  'customised'     : 'customized',
  'maximised'      : 'maximized',
  'synchronised'   : 'synchronized',
  'centralised'    : 'centralized',
  'categorised'    : 'categorized',
  'motorised'      : 'motorized',
  'specialised'    : 'specialized',
  'visualised'     : 'visualized',
  'driveing'       : 'driving',
  'implemention'   : 'implementation',
  'implemntation'  : 'implementation',
  'recomend'       : 'recommend',
  'recomendation'  : 'recommendation',
  'recomended'     : 'recommended',
  'refered'        : 'referred',
  'referance'      : 'reference',
  'referances'     : 'references',
  'documentaion'   : 'documentation',
  'docuemnt'       : 'document',
  'requirment'     : 'requirement',
  'requirments'    : 'requirements',
  'priortize'      : 'prioritize',
  'priortized'     : 'prioritized',
  'priortizing'    : 'prioritizing',
  'oppertunity'    : 'opportunity',
  'oppertunities'  : 'opportunities',
  'challanges'     : 'challenges',
  'challange'      : 'challenge',
  'schdule'        : 'schedule',
  'schedual'       : 'schedule',
  'strategise'     : 'strategize',
  'liaising'       : 'liaising',  // correct but flag for context
  'intergration'   : 'integration',
  'intergrate'     : 'integrate',
  'intergrated'    : 'integrated',
  'architecure'    : 'architecture',
  'infrastracture' : 'infrastructure',
  'infastructure'  : 'infrastructure',
  'efficiancy'     : 'efficiency',
  'efficeincy'     : 'efficiency',
  'enviroment'     : 'environment',
  'enviornment'    : 'environment',
  'accomlish'      : 'accomplish',
  'accomlished'    : 'accomplished',
  'accomodated'    : 'accommodated',
  'facilit'        : 'facilitated',   // partial — do exact match
  'persuation'     : 'persuasion',
  'persuasion'     : 'persuasion',
  'influencial'    : 'influential',
  'intiative'      : 'initiative',
  'intiatives'     : 'initiatives',
  'entreprenurial' : 'entrepreneurial',
  'entrepenuer'    : 'entrepreneur',
  'entreperneur'   : 'entrepreneur',
  'compition'      : 'competition',
  'compititive'    : 'competitive',
  'compititor'     : 'competitor',
  'communciation'  : 'communication',
  'comunication'   : 'communication',
  'comunicate'     : 'communicate',
  'negociation'    : 'negotiation',
  'negociate'      : 'negotiate',
  'negociated'     : 'negotiated',
  'attrition'      : 'attrition',    // correct — many confuse with 'attriction'
  'attriction'     : 'attrition',
  'retension'      : 'retention',
  'aquisition'     : 'acquisition',
  'aquired'        : 'acquired',
  'aquire'         : 'acquire',
  'knowlege'       : 'knowledge',
  'knoweldge'      : 'knowledge',
  'knowlegde'      : 'knowledge',
  'leanring'       : 'learning',
  'expereince'     : 'experience',
  'experiece'      : 'experience',
  'experiance'     : 'experience',
  'experianced'    : 'experienced',
  'stategic'       : 'strategic',
  'stategy'        : 'strategy',
  'stratagey'      : 'strategy',
  'achivements'    : 'achievements',
  'co-ordinate'    : 'coordinate',
  'co-ordinated'   : 'coordinated',
  'co-ordinating'  : 'coordinating',
  'relavent'       : 'relevant',
  'relevent'       : 'relevant',
  'relevence'      : 'relevance',
}

/**
 * Naive but fast word-boundary spell check.
 * Returns list of issues in the given text.
 *
 * @param {string} text
 * @returns {{ word: string, suggestion: string, start: number, end: number }[]}
 */
export function checkSpelling(text = '') {
  if (!text || text.length < 4) return []

  const issues = []
  const wordRegex = /\b([a-zA-Z]{3,})\b/g
  let match

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[1]
    const lower = word.toLowerCase()
    const suggestion = INDIAN_CORRECTIONS[lower]
    if (suggestion) {
      issues.push({
        word,
        suggestion,
        start: match.index,
        end  : match.index + word.length,
      })
    }
  }

  return issues
}

/**
 * Quick check: returns true if text has any known misspellings.
 * @param {string} text
 */
export function hasSpellingIssues(text = '') {
  return checkSpelling(text).length > 0
}

/**
 * Auto-correct all known issues in text.
 * @param {string} text
 * @returns {string}
 */
export function autoCorrect(text = '') {
  return text.replace(/\b([a-zA-Z]{3,})\b/g, (match) => {
    return INDIAN_CORRECTIONS[match.toLowerCase()] || match
  })
}
