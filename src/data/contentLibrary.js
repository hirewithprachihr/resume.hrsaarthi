/**
 * Pre-Written Content Library — India Job Market Edition
 * ─────────────────────────────────────────────────────────────────
 * 10 roles × 15 bullets each = 150 bullet templates
 * 10 roles × 3 summary variations = 30 summary templates
 *
 * Placeholder tokens:
 *   {{yearsExp}}  — years of experience
 *   {{topSkill1}} — first top skill from skills section
 *   {{topSkill2}} — second top skill
 *   {{company}}   — current/recent company
 *   {{achievement}} — key quantifiable achievement
 */

// ── Bullet Templates ────────────────────────────────────────────

export const BULLET_TEMPLATES = {

  'Software Engineer': [
    'Developed and maintained RESTful APIs serving 50,000+ daily active users with 99.9% uptime',
    'Reduced application load time by 40% through Redis caching and database query optimization',
    'Led migration of monolithic architecture to microservices, improving deployment frequency by 3x',
    'Built CI/CD pipelines using Jenkins and Docker, reducing deployment time from 2 hours to 15 minutes',
    'Implemented automated testing suite with 85% code coverage, reducing production bugs by 60%',
    'Collaborated with product and design teams to ship 12 features in a single sprint cycle',
    'Optimized SQL queries and added indexes, reducing average response time from 800ms to 120ms',
    'Mentored 3 junior developers, improving team velocity by 25% over 6 months',
    'Architected and deployed scalable backend infrastructure on AWS serving 1M+ monthly users',
    'Integrated third-party payment gateway (Razorpay) processing ₹50L+ in monthly transactions',
    'Built real-time notification system using WebSockets handling 10,000 concurrent connections',
    'Resolved 95% of P1 production incidents within SLA, maintaining client satisfaction above 4.8/5',
    'Migrated legacy codebase from JavaScript to TypeScript, reducing runtime errors by 45%',
    'Developed React.js frontend reducing page load time by 35% and improving Core Web Vitals score',
    'Implemented OAuth 2.0 authentication and RBAC security model for enterprise client serving 5,000 users',
  ],

  'Data Analyst': [
    'Built Power BI dashboards tracking 15 KPIs for senior leadership, replacing 8 hours of weekly manual reporting',
    'Analyzed customer behavior data from 200K+ users to identify churn patterns, reducing churn by 18%',
    'Created SQL pipelines processing 5GB daily data from 4 source systems into unified analytics warehouse',
    'Performed A/B testing on product features, improving conversion rate from 2.3% to 3.8%',
    'Developed predictive model for demand forecasting with 87% accuracy using Python and scikit-learn',
    'Standardized data quality checks across 12 data sources, reducing reporting errors by 70%',
    'Collaborated with marketing team to build customer segmentation model identifying 6 high-value cohorts',
    'Built automated Excel/Python reports saving 15+ man-hours per week across the analytics team',
    'Extracted insights from 3 years of sales data to identify top 10 revenue-generating SKUs',
    'Cleaned and prepared dataset of 1M+ records for machine learning model training',
    'Created comprehensive competitive analysis of 5 market players, informing Q3 product strategy',
    'Reduced month-end close time from 5 days to 2 days through process automation using Python',
    'Built customer lifetime value (CLV) model increasing targeted campaign ROI by 32%',
    'Maintained and optimized 20+ recurring reports for cross-functional teams using SQL and Tableau',
    'Conducted statistical analysis identifying seasonal trends that improved inventory planning by 25%',
  ],

  'Marketing Manager': [
    'Managed ₹50L monthly digital marketing budget across Google, Meta, and LinkedIn campaigns',
    'Increased organic traffic by 120% through SEO content strategy and technical optimization over 8 months',
    'Led a team of 6 marketers and 2 agencies to execute 30+ campaigns generating ₹2Cr in pipeline',
    'Grew LinkedIn followers from 5K to 45K through strategic content calendar and employee advocacy program',
    'Improved email campaign open rate from 18% to 34% through A/B testing subject lines and segments',
    'Launched product in 3 new Indian cities (Pune, Ahmedabad, Jaipur) driving 40% revenue expansion',
    'Reduced cost per lead (CPL) by 35% through campaign optimization and audience refinement',
    'Executed influencer marketing campaign with 25 creators reaching 2.5M target audience',
    'Managed ₹1.2Cr annual brand activation budget, delivering 8 events with 15,000+ combined footfall',
    'Built affiliate marketing program with 300+ partners generating ₹40L in monthly attributed revenue',
    'Increased website conversion rate from 1.8% to 3.2% through landing page optimization and CRO',
    'Oversaw production of 50+ content pieces monthly (blogs, videos, social posts) across 4 platforms',
    'Coordinated with sales team to align MQL-to-SQL handoff process, improving close rate by 22%',
    'Achieved 4.2x ROAS on Google Shopping campaigns for D2C category with ₹10L monthly spend',
    'Built and scaled referral program growing word-of-mouth signups to 30% of total new user acquisition',
  ],

  'HR Executive': [
    'Managed end-to-end recruitment for 200+ positions across technical and non-technical roles within 90-day SLA',
    'Reduced time-to-hire by 30% by implementing structured interview scorecards and panel process',
    'Processed payroll for 450+ employees monthly with 99.8% accuracy using Keka HRMS',
    'Designed and executed onboarding program reducing 30-day attrition from 12% to 4%',
    'Conducted 60+ campus recruitment drives across IITs, NITs, and top B-schools',
    'Resolved 150+ employee grievances in FY24 with 95% resolution satisfaction score',
    'Maintained 100% statutory compliance (PF, ESIC, PT, Gratuity) for workforce of 500+',
    'Led POSH training for 600 employees, achieving 100% completion and zero reported incidents',
    'Improved employee NPS from 32 to 61 through engagement initiatives and manager effectiveness programs',
    'Implemented HRIS (Darwinbox), eliminating 12+ manual HR processes and saving 25hrs/week',
    'Built talent pipeline of 800+ pre-qualified candidates for critical roles through proactive sourcing',
    'Designed performance management system with OKR framework, increasing goal achievement by 40%',
    'Coordinated 5 annual appraisal cycles ensuring 100% completion within 3-week window',
    'Sourced and closed 15 niche engineering roles (ML/DevOps) in competitive market within 45 days avg.',
    'Partnered with L&D to design 200-hour annual training curriculum aligned to business priorities',
  ],

  'Product Manager': [
    'Owned product roadmap for B2B SaaS platform with ₹15Cr ARR, driving 3 major releases per quarter',
    'Led cross-functional team of 8 (design, engineering, QA) to ship feature that increased retention by 22%',
    'Conducted 50+ user interviews to identify top pain points, informing 12-month product strategy',
    'Defined and tracked product OKRs; achieved 4 of 5 key results in Q3 including 30% DAU growth',
    'Reduced checkout drop-off by 28% through user research-driven redesign of payment flow',
    'Launched mobile app (iOS + Android) reaching 100K downloads in 45 days post-launch',
    'Built prioritization framework (RICE scoring) adopted by 4-person PM team across 2 product lines',
    'Collaborated with sales and CS to define enterprise tier, closing 3 enterprise deals worth ₹1.2Cr',
    'Shipped AI recommendation engine improving average session length by 35% and revenue per user by 18%',
    'Drove monetization experiments generating ₹40L in new revenue from existing user base',
    'Created comprehensive PRDs, user stories, and acceptance criteria reducing sprint rework by 40%',
    'Facilitated quarterly roadmap review with C-suite and board, aligning stakeholders on 3 strategic bets',
    'Managed beta program with 200 power users, collecting 500+ actionable feedback items over 6 weeks',
    'Led go-to-market strategy for new vertical, achieving 500 paid signups in first 2 weeks of launch',
    'Improved NPS from 28 to 52 through systematic customer feedback loop and rapid iteration cycle',
  ],

  'Finance Analyst': [
    'Prepared monthly MIS reports for management covering P&L, cash flow, and budget vs actuals across 5 BUs',
    'Led annual budgeting process for ₹80Cr revenue business, coordinating inputs from 8 department heads',
    'Reduced month-end close cycle from 7 days to 3 days through process automation using Excel macros',
    'Built 5-year financial model for Series B fundraise; supported ₹50Cr round in Q2 FY24',
    'Identified cost-saving opportunities worth ₹18L annually through vendor contract renegotiation',
    'Handled GST filing, TDS deductions, and advance tax for 12 entity group structure with zero penalties',
    'Performed variance analysis on ₹25Cr quarterly expenses, identifying 3 departments overspent by 15%+',
    'Managed accounts payable for 200+ vendors, maintaining 98% on-time payment rate',
    'Prepared consolidated balance sheet and P&L under Ind AS 115 for statutory audit',
    'Implemented Zoho Books across 4 subsidiaries improving inter-company reconciliation accuracy by 85%',
    'Sourced working capital facility of ₹5Cr from HDFC Bank, reducing financing cost by 120 bps',
    'Tracked collections for ₹12Cr AR book, reducing DSO from 65 days to 42 days in 6 months',
    'Prepared detailed cost analysis report that informed decision to outsource 2 non-core functions, saving ₹22L',
    'Managed petty cash, expense reimbursements, and travel claims for 150+ employees per month',
    'Supported statutory audit by preparing audit schedules and coordinating with Big 4 team for 3 years',
  ],

  'Sales Executive': [
    'Achieved 128% of annual sales target generating ₹1.8Cr revenue in FY24 for North India territory',
    'Acquired 45 new enterprise accounts in Q4, exceeding new business target by 40%',
    'Managed key accounts worth ₹3Cr ARR, maintaining 95% retention rate through proactive engagement',
    'Reduced sales cycle from 90 days to 55 days by introducing product demo standardization and case studies',
    'Built and managed pipeline of 150+ qualified opportunities worth ₹8Cr using Salesforce CRM',
    'Negotiated multi-year contract with 3 enterprise clients worth ₹2.4Cr combined annual value',
    'Led product demonstrations to C-suite stakeholders at 30+ enterprise companies per quarter',
    'Grew existing account revenue by 35% through upselling premium tier and cross-selling adjacent products',
    'Onboarded and trained 2 junior sales executives, ramping them to 80% quota in 3 months',
    'Generated 200+ qualified leads through LinkedIn outreach, cold calling, and industry events',
    'Achieved highest NPS among peer sales team (68 vs team average of 48) based on post-sale surveys',
    'Closed ₹50L deal with Tier-1 BFSI client after 6-month consultative sales process',
    'Maintained 82% win rate on competitive deals by leveraging ROI-based selling methodology',
    'Represented company at 5 industry events (NASSCOM, CII, SaaS BooMi) generating 80+ new leads',
    'Recovered 3 churned enterprise accounts worth ₹70L through structured win-back campaign',
  ],

  'Operations Manager': [
    'Managed end-to-end operations for 3 warehouses handling 5,000+ SKUs and 2,000 daily orders',
    'Reduced operational costs by ₹45L annually through process reengineering and vendor consolidation',
    'Led cross-functional team of 35 (logistics, procurement, QA, CS) across 2 cities',
    'Improved order fulfillment rate from 88% to 97.5% within 4 months through SLA redesign',
    'Implemented ERP (SAP B1) for inventory management, reducing stockouts by 60% and overstock by 40%',
    'Achieved ISO 9001:2015 certification for quality management system within 8-month timeline',
    'Established vendor performance scorecard for 50+ suppliers, driving 15% improvement in OTIF delivery',
    'Built SOP library of 120 processes, reducing training time for new operations staff by 50%',
    'Led expansion into 3 new cities (Pune, Hyderabad, Chennai), operationalizing all within 90 days',
    'Managed logistics budget of ₹3Cr, delivering 8% under budget through route optimization',
    'Reduced customer complaint rate from 4.2% to 1.1% through root cause analysis and process redesign',
    'Negotiated 3PL contracts worth ₹2.5Cr generating 12% cost savings vs. previous agreements',
    'Drove automation of 5 manual workflows using RPA, saving 200+ man-hours monthly',
    'Launched daily ops review cadence with 8 team leads, improving issue resolution speed by 65%',
    'Coordinated during peak festive season (Diwali/Navratri), processing 3x normal order volume with zero SLA breach',
  ],

  'Business Analyst': [
    'Gathered and documented 150+ business requirements for ERP migration project from 12 stakeholder groups',
    'Created 30+ detailed process flow diagrams (BPDs, use cases, swimlane) used by 5 development teams',
    'Conducted UAT planning and coordination for 6-month core banking upgrade with 200 test cases',
    'Identified process improvement opportunities saving ₹30L annually across 3 operational workflows',
    'Facilitated 50+ requirement workshops with business and IT stakeholders, bridging communication gap',
    'Defined data mapping specifications for 8 system integrations as part of digital transformation program',
    'Tracked 180+ change requests across 3 workstreams using JIRA, maintaining 95% on-time delivery',
    'Built business case for new CRM system (₹1.2Cr investment), demonstrating 3-year ROI of 280%',
    'Conducted time-and-motion study across 4 teams, identifying 6 bottlenecks reducing productivity by 25%',
    'Created dashboards in Power BI tracking 10 operational KPIs reviewed weekly by leadership team',
    'Managed stakeholder communication across 15 departments for 12-month transformation project',
    'Performed competitor analysis of 8 fintech players, presenting findings to C-suite for strategy planning',
    'Defined acceptance criteria and test scenarios for 3 regulatory compliance features (RBI guidelines)',
    'Reduced incidents post-release by 55% by implementing structured business sign-off process',
    'Prepared 20+ executive presentations distilling complex project data into actionable board-level insights',
  ],

  'Content Writer': [
    'Produced 40+ SEO-optimized articles per month driving 250K+ monthly organic visits to company blog',
    'Grew LinkedIn page from 2,000 to 28,000 followers through strategic content calendar over 12 months',
    'Wrote 15 comprehensive whitepapers and case studies downloaded 5,000+ times, generating 800 MQLs',
    'Improved average blog ranking from position 12 to position 4 through content optimization and internal linking',
    'Managed content calendar for 3 social platforms (LinkedIn, Instagram, Twitter) with 95% on-time delivery',
    'Collaborated with SEO team to increase organic sessions by 85% in 9 months through long-tail keyword targeting',
    'Created email drip campaign (8 sequences) with 38% open rate and 12% CTR, exceeding industry benchmark',
    'Produced video scripts for 20 YouTube tutorials averaging 15,000 views each within 30 days of publish',
    'Developed brand voice and editorial guidelines adopted across 5-person content team',
    'Wrote product descriptions for 500+ SKU e-commerce catalog, improving conversion rate by 18%',
    'Ghostwrote 12 thought leadership articles for C-suite published in Economic Times and YourStory',
    'Managed agency relationship for 3D/motion graphics, delivering 20+ brand assets quarterly on schedule',
    'Localized 30+ content pieces for Hindi and Marathi audiences, increasing regional traffic by 40%',
    'Conducted interviews with 25 customers for testimonial content, contributing to 15% sales page lift',
    'Built content repository of 500+ reusable assets reducing new content creation time by 30%',
  ],
}

// ── Summary Templates ─────────────────────────────────────────────

export const SUMMARY_TEMPLATES = {

  'Software Engineer': [
    '{{yearsExp}}+ years of full-stack development experience, specializing in {{topSkill1}} and {{topSkill2}}. Proficient in building scalable, high-performance systems and APIs with a strong focus on code quality and test coverage. Proven track record of shipping impactful features in agile environments at {{company}}.',
    'Full-stack engineer with {{yearsExp}} years of hands-on experience in {{topSkill1}}, {{topSkill2}}, and cloud infrastructure. Passionate about building products that scale — from 0 to 1M users. Recently {{achievement}}.',
    'Backend-focused software engineer with {{yearsExp}}+ years of experience designing microservices and distributed systems using {{topSkill1}}. Strong collaborator who thrives in fast-paced startup environments. Currently at {{company}} where I own the core API platform.',
  ],

  'Data Analyst': [
    'Results-oriented Data Analyst with {{yearsExp}}+ years of experience turning raw data into business insights using {{topSkill1}} and {{topSkill2}}. Skilled in building dashboards, managing ETL pipelines, and collaborating with stakeholders to drive data-driven decisions.',
    'Data professional with {{yearsExp}} years of experience in SQL, Python, and {{topSkill1}}. Known for translating complex datasets into clear executive-ready dashboards. At {{company}}, {{achievement}}.',
    'Analytical thinker with {{yearsExp}}+ years of experience in business intelligence and reporting. Proficient in {{topSkill1}} and {{topSkill2}}, with expertise in building self-service analytics tools that reduce report dependency by 60%+.',
  ],

  'Marketing Manager': [
    'Data-driven marketing leader with {{yearsExp}}+ years of experience scaling B2B and B2C brands across digital channels. Expert in {{topSkill1}} and performance marketing, with a track record of delivering 3x+ ROAS on managed spend. At {{company}}, {{achievement}}.',
    'Growth-oriented marketing professional with {{yearsExp}} years specializing in full-funnel digital strategy, {{topSkill1}}, and brand management. Adept at building high-performing marketing teams and agencies. Recently {{achievement}}.',
    'Marketing Manager with {{yearsExp}}+ years of experience in Indian and Southeast Asian markets. Strong in {{topSkill1}}, content strategy, and campaign execution. Passionate about building brands people love.',
  ],

  'HR Executive': [
    'HR professional with {{yearsExp}}+ years of experience across talent acquisition, HR operations, and employee engagement. Skilled in full-cycle recruitment, HRIS implementation, and statutory compliance. Reduced time-to-hire by 30%+ at {{company}}.',
    'Passionate people professional with {{yearsExp}} years of experience in high-growth startups and established enterprises. Expertise in {{topSkill1}} and building HR processes from scratch. Recently {{achievement}}.',
    'SHRM-certified HR Executive with {{yearsExp}}+ years in talent management, L&D, and HR business partnering. Known for building workplace cultures where people thrive and performance speaks for itself.',
  ],

  'Product Manager': [
    'Product leader with {{yearsExp}}+ years of experience building B2B SaaS products from 0 to scale. Expert in {{topSkill1}}, user research, and data-driven roadmap prioritization. At {{company}}, shipped features growing DAU by 30%.',
    'Strategic PM with {{yearsExp}} years of experience across consumer apps and enterprise products. Strong in {{topSkill1}} and cross-functional leadership, with a history of shipping 0-to-1 products that delight users. Recently {{achievement}}.',
    'Product Manager combining {{yearsExp}}+ years of hands-on domain expertise with strong user empathy and analytical rigor. Skilled in prioritization frameworks, stakeholder management, and go-to-market execution.',
  ],

  'Finance Analyst': [
    'CA/MBA Finance professional with {{yearsExp}}+ years of experience in financial planning, MIS reporting, and statutory compliance. Proficient in {{topSkill1}} and SAP. Supported ₹50Cr+ fundraise at {{company}}.',
    'Detail-oriented Finance Analyst with {{yearsExp}} years of hands-on experience in Ind AS reporting, budgeting, and treasury operations. Known for reducing month-end close timelines and improving forecast accuracy.',
    'Results-driven finance professional with {{yearsExp}}+ years across start-ups and mid-size organizations. Expertise in {{topSkill1}}, P&L management, and cost optimization — recently {{achievement}}.',
  ],

  'Sales Executive': [
    'Top-performing B2B Sales Executive with {{yearsExp}}+ years of consistent quota achievement (avg. 120%+ annually). Expert in {{topSkill1}}, consultative selling, and enterprise deal closure. Generated ₹{{achievement}} in new revenue at {{company}}.',
    'Hunter mentality sales professional with {{yearsExp}} years of experience in SaaS and technology sales. Skilled in building pipelines from scratch and closing 6-figure deals. Recently {{achievement}}.',
    'Revenue-focused Sales Executive with {{yearsExp}}+ years selling to BFSI, FMCG, and tech enterprises across India. Strong in relationship-based selling, key account management, and CRM discipline.',
  ],

  'Operations Manager': [
    'Operations leader with {{yearsExp}}+ years driving efficiency across supply chain, logistics, and service delivery for fast-scaling businesses. Skilled in {{topSkill1}}, process reengineering, and P&L management. Reduced ops costs by ₹45L at {{company}}.',
    'Detail-oriented Operations Manager with {{yearsExp}} years building scalable ops infrastructure for 10–500 person organizations. Expertise in {{topSkill1}}, ERP implementation, and SLA management.',
    'Strategic operations professional with {{yearsExp}}+ years across e-commerce, manufacturing, and services sectors. Passionate about building systems that grow with the business — not against it.',
  ],

  'Business Analyst': [
    'Business Analyst with {{yearsExp}}+ years bridging the gap between business needs and technology solutions. Expert in {{topSkill1}}, requirements engineering, and stakeholder management across BFSI and technology domains.',
    'Certified BA (CBAP) with {{yearsExp}} years on large-scale digital transformation programs. Skilled at structured problem-solving, process mapping, and translating complex requirements into actionable deliverables.',
    'Analytical and detail-oriented BA with {{yearsExp}}+ years delivering insights and process improvements across {{topSkill1}} and data-driven projects. Known for strong documentation discipline and executive communication.',
  ],

  'Content Writer': [
    'Content strategist and writer with {{yearsExp}}+ years helping B2B and D2C brands build audiences and drive organic growth. Expert in {{topSkill1}}, SEO content strategy, and brand storytelling. Grew blog traffic by 250K monthly visits at {{company}}.',
    'Creative and data-driven content professional with {{yearsExp}} years producing high-performing content across blogs, social, email, and video. Skilled in {{topSkill1}} and editorial management. Recently {{achievement}}.',
    'Versatile content writer with {{yearsExp}}+ years creating engaging content for Indian and global audiences across tech, finance, and lifestyle verticals. Strong in SEO, brand voice, and performance content.',
  ],
}

/**
 * Get bullet suggestions for a given job title.
 * Falls back to "Software Engineer" if role not found.
 *
 * @param {string} jobTitle       - Job title from resume
 * @param {string} filter         - 'all' | 'quantified' | 'leadership' | 'technical'
 * @returns {string[]}
 */
export function getBulletSuggestions(jobTitle = '', filter = 'all') {
  const normalized = Object.keys(BULLET_TEMPLATES).find(
    key => jobTitle.toLowerCase().includes(key.toLowerCase()) ||
           key.toLowerCase().includes(jobTitle.toLowerCase())
  )
  const bullets = BULLET_TEMPLATES[normalized || 'Software Engineer']

  if (filter === 'quantified') {
    return bullets.filter(b => /\d|₹|%|lakh|cr|lak/i.test(b))
  }
  if (filter === 'leadership') {
    return bullets.filter(b => /\b(led|managed|mentored|directed|orchestrated|oversaw|coordinated)\b/i.test(b))
  }
  if (filter === 'technical') {
    return bullets.filter(b => /\b(built|developed|implemented|architected|deployed|migrated|automated|optimized)\b/i.test(b))
  }
  return bullets
}

/**
 * Get summary templates for a given job title with placeholders filled in.
 *
 * @param {string} jobTitle
 * @param {object} resumeData   - Zustand resumeData to fill placeholders
 * @returns {string[]}          - 3 filled-in summary variations
 */
export function getSummaryTemplates(jobTitle = '', resumeData = {}) {
  const normalized = Object.keys(SUMMARY_TEMPLATES).find(
    key => jobTitle.toLowerCase().includes(key.toLowerCase()) ||
           key.toLowerCase().includes(jobTitle.toLowerCase())
  )
  const templates = SUMMARY_TEMPLATES[normalized || 'Software Engineer']

  const p = resumeData?.personal || {}
  const exp = resumeData?.experience || []
  const skills = resumeData?.skills || []

  const yearsExp = exp.length > 0 ? String(Math.max(1, exp.length * 1.5 | 0)) : '2'
  const topSkill1 = skills[0]?.items?.split(',')[0]?.trim() || 'your primary skill'
  const topSkill2 = skills[1]?.items?.split(',')[0]?.trim() || skills[0]?.items?.split(',')[1]?.trim() || 'your secondary skill'
  const company = exp[0]?.company || 'my current company'
  const achievement = exp[0]?.bullets?.[0]?.slice(0, 60) || 'driving measurable business impact'

  return templates.map(t =>
    t
      .replace(/\{\{yearsExp\}\}/g, yearsExp)
      .replace(/\{\{topSkill1\}\}/g, topSkill1)
      .replace(/\{\{topSkill2\}\}/g, topSkill2)
      .replace(/\{\{company\}\}/g, company)
      .replace(/\{\{achievement\}\}/g, achievement)
  )
}
