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

  'Doctor': [
    'Managed OPD of 40+ patients daily in a 500-bed tertiary care hospital with 98% patient satisfaction',
    'Performed 200+ laparoscopic surgeries with zero major intra-operative complications in FY24',
    'Reduced average patient waiting time from 45 mins to 18 mins through triage protocol redesign',
    'Conducted 15+ CME sessions for resident doctors and nursing staff on evidence-based protocols',
    'Published 3 peer-reviewed papers in indexed journals (PubMed/Scopus) on surgical outcomes',
    'Achieved 95% adherence to antibiotic stewardship protocols, reducing resistance rate by 22%',
    'Mentored 8 postgraduate medical students, with 100% first-attempt NBEMS pass rate',
    'Led COVID-19 ICU team managing 60+ critical patients; reduced mortality rate by 18% vs hospital average',
    'Implemented electronic medical records (EMR) adoption across 3 wards, reducing documentation errors by 60%',
    'Completed DNB/MD with 85%+ percentile in PGI/AIIMS entrance — research dissertation rated Excellent',
    'Managed multidisciplinary tumor board discussions for 25+ oncology cases per month',
    'Reduced post-operative infection rate from 4.2% to 1.8% through enhanced aseptic protocol training',
    'Delivered 500+ teleconsultations during pandemic ensuring continuity of care for chronic patients',
    'Obtained MCI/NMC registration (Reg. No. XXXXX) — active license, no disciplinary action',
    'Coordinated with insurance providers for cashless claims processing for 200+ patients monthly',
  ],

  'Advocate': [
    'Appeared in 120+ cases before District Courts, High Court, and NCDRC in FY24 with 78% success rate',
    'Drafted and reviewed 200+ commercial contracts, JVAs, and NDAs for corporate clients across 5 sectors',
    'Represented company in arbitration proceedings saving ₹3.5Cr in disputed amounts',
    'Filed and obtained 15 trademarks and 8 patents for technology and FMCG clients within 90-day timelines',
    'Led due diligence for 3 M&A transactions cumulatively valued at ₹120Cr',
    'Argued 6 cases before High Court on IP infringement and consumer protection matters',
    'Structured legal framework for ESOP plan covering 800+ employees in compliance with SEBI regulations',
    'Advised on FEMA, RBI, and SEBI compliance for 5 FDI transactions worth USD 50M+',
    'Managed contract lifecycle management system for portfolio of 500+ active vendor agreements',
    'Conducted legal audit for 3 group companies identifying 12 compliance gaps and 6 litigation risks',
    'Drafted constitutional writ petitions challenging regulatory orders; 2 of 4 decisions were favorable',
    'Negotiated settlement in labor dispute involving 120 employees, reducing company liability by ₹80L',
    'Enrolled with Bar Council of [State] — 10+ years standing with zero professional misconduct complaints',
    'Represented clients in 20+ RERA matters related to real estate project delays and refund disputes',
    'Built and managed client database of 150+ individuals and corporate entities with CRM system',
  ],

  'Teacher': [
    'Taught Mathematics / Science / English to 200+ students across Grades 6–12 with 95% board pass rate',
    'Improved average class score from 62% to 81% over 2 academic years through targeted intervention',
    'Developed 150+ lesson plans aligned with CBSE/ICSE/State Board curriculum and NEP 2020 guidelines',
    'Mentored 12 students selected for National Science Olympiad and Mathematics Olympiad state round',
    'Introduced activity-based learning for 3 subjects, reducing absenteeism by 30% and improving engagement',
    'Prepared 30+ students for JEE/NEET foundation with 85% qualifying IIT/NEET coaching level tests',
    'Designed online course on Vedantu/BYJU\'s platform — 5,000+ enrolled students, 4.7/5 rating',
    'Coordinated school science fair with 60+ student projects and 3 state-level prize winners',
    'Served as class teacher for 45 students handling attendance, academic counseling, and parent communication',
    'Conducted remedial classes for 20 underperforming students; 18 showed 15%+ grade improvement',
    'Trained 10 new teachers in digital tools (Google Classroom, Kahoot, Canva for Education)',
    'Published curriculum resource pack used by 8 schools across the district for Maths formative assessment',
    'Led school\'s CBSE accreditation review and prepared compliance documentation achieving Grade A',
    'Implemented student learning outcome (SLO) tracking system across 4 sections',
    'Organized annual inter-school debate and quiz competitions with 500+ student participants',
  ],

  'Government Officer': [
    'Administered 12 government schemes with total beneficiary coverage of 50,000+ citizens in district',
    'Led land records digitization project covering 1,80,000 khasra entries within 8-month timeline',
    'Resolved 800+ citizen grievances through CM Helpline and NIC portal within 30-day SLA mandate',
    'Conducted 25 gram sabhas and 4 jan sunwais ensuring stakeholder consultation for development projects',
    'Managed district treasury operations with zero audit objections in 3 consecutive annual audits',
    'Supervised construction of 12 government buildings and 45km road projects under PMGSY',
    'Coordinated state government response during flood relief — managed ₹8Cr disaster relief fund',
    'Achieved 98% Aadhaar seeding for beneficiaries under 3 DBT schemes in block jurisdiction',
    'Led digitization of 50 years of court records under e-Courts Mission Mode Project',
    'Reduced average file processing time from 15 days to 6 days through SOP redesign and staff training',
    'Prepared and submitted 20+ policy notes and cabinet memos with accurate data and analysis',
    'Trained 150+ field staff in PFMS, GeM, and NIC tools for e-governance compliance',
    'Coordinated with 8 departments for implementation of Smart City Mission projects worth ₹120Cr',
    'Achieved 100% utilization of MGNREGS budget in jurisdiction for FY23 — zero lapse or surrender',
    'Resolved inter-departmental land dispute within 45 days through structured mediation process',
  ],

  'HR Manager': [
    'Built HR function from scratch for 200-person startup — developed all policies, frameworks, and HRIS',
    'Reduced attrition from 28% to 14% through structured retention programs, skip-level connects, and ESAT surveys',
    'Hired 80+ employees in 4 months for Series B expansion across sales, tech, and operations functions',
    'Rolled out OKR framework across 6 departments, improving quarterly goal achievement by 35%',
    'Launched POSH policy, trained 600+ employees, constituted IC Committee with 100% compliance',
    'Implemented Darwinbox HRIS eliminating 18 manual processes and reducing HR admin effort by 40%',
    'Designed and executed L&D roadmap covering 1,200 training hours per year for 150 employees',
    'Built employer brand strategy that reduced cost-per-hire by 25% through LinkedIn and campus channels',
    'Conducted 3 HR audits ensuring PF, ESIC, PT, Gratuity, and Shops & Establishment compliance',
    'Partnered with 5 business heads to design competency frameworks and structured career ladders',
    'Launched quarterly pulse surveys; implemented 12 action items resulting in 22-point eNPS improvement',
    'Managed annual appraisal cycle for 300+ employees — designed moderation process reducing manager bias',
    'Sourced and onboarded 5 C-suite executives (CHRO, CTO, CFO) through retained search approach',
    'Built diversity hiring program resulting in 35% women representation in engineering team (up from 18%)',
    'Deployed AI-based resume screening tool reducing initial shortlisting time by 65%',
  ],

  'Sales Manager': [
    'Led and managed team of 15 field sales executives across 4 cities, achieving 132% of annual team target',
    'Built territory sales strategy for North India, expanding client base from 120 to 380 accounts in 18 months',
    'Designed incentive structure for 50-person sales team improving average quota attainment from 85% to 112%',
    'Closed ₹4.5Cr strategic deal with largest enterprise client — 24-month implementation contract',
    'Reduced sales cycle from 75 days to 40 days through introduction of ROI-based selling toolkit',
    'Built and led inside sales team of 8; scaled outbound pipeline from ₹1Cr to ₹6Cr in 9 months',
    'Onboarded and trained 18 new sales hires; 15 of 18 achieved 100%+ quota in ramp quarter',
    'Represented company at 8 industry events (NASSCOM, SaaS Boomi, CII) generating 200+ new leads',
    'Implemented Salesforce CRM for team of 20 — improved data hygiene, pipeline visibility, and forecast accuracy by 40%',
    'Established channel partner network of 25 resellers contributing 30% of regional revenue',
    'Achieved highest Net Promoter Score (NPS) in regional team for 3 consecutive quarters (NPS: 72)',
    'Won back 5 churned enterprise clients worth ₹1.2Cr ARR through structured win-back strategy',
    'Negotiated multi-year contract renewals with enterprise clients protecting ₹8Cr ARR annually',
    'Developed competitive battlecards and objection-handling frameworks adopted by national sales team',
    'Led pilot for AI-sales assistant tool reducing time-on-admin by 2 hours/rep/day across 12-person team',
  ],

  'Digital Marketing': [
    'Generated ₹2.5Cr in attributed revenue through integrated performance marketing campaigns on Google and Meta',
    'Reduced customer acquisition cost (CAC) by 42% through funnel optimization and audience segmentation',
    'Grew organic traffic from 80K to 450K monthly sessions through technical SEO and content strategy',
    'Managed ₹1.2Cr monthly ad budget across 4 platforms with average ROAS of 4.8x',
    'Built email automation sequences converting 18% of leads to paying customers in 14-day nurture window',
    'Grew Instagram from 12K to 250K followers in 10 months through creator collaborations and content calendar',
    'Launched 20+ A/B tests on landing pages improving average conversion rate from 2.1% to 4.6%',
    'Managed affiliate marketing program with 500+ partners generating ₹60L in monthly attributed revenue',
    'Launched WhatsApp marketing channel reaching 1.5L users with 52% open rate — 3x vs email',
    'Implemented GA4 + GTM setup for 5 products enabling granular conversion tracking and attribution',
    'Led video content strategy — 30 reels/shorts per month averaging 200K organic views each',
    'Executed IPL/festive season campaign reaching 5M+ impressions with ₹0.35 cost per reach',
    'Secured 3 brand partnership deals worth ₹15L combined value through PR and influencer outreach',
    'Built SEO content cluster strategy — 45 pillar pages ranking page 1 for high-intent transactional keywords',
    'Improved email deliverability from 72% to 96% through list hygiene, domain authentication, and content audit',
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

  'Doctor': [
    'Medical professional with {{yearsExp}}+ years of clinical experience specializing in {{topSkill1}}. Proven track record of managing high-volume OPD and complex surgical cases at {{company}} with exceptional patient outcomes.',
    'MBBS/MD doctor with {{yearsExp}} years of hands-on clinical and surgical experience. Skilled in {{topSkill1}} with research publications in indexed journals. NMC registered with active license.',
    'Compassionate and evidence-driven clinician with {{yearsExp}}+ years in tertiary care settings. Expertise in {{topSkill1}} and {{topSkill2}}, with a focus on teaching and mentoring postgraduate residents.',
  ],

  'Advocate': [
    'Practicing advocate with {{yearsExp}}+ years of litigation and transactional experience across commercial, IP, and employment law. Appeared before High Courts and NCDRC. Strong in {{topSkill1}} and contract drafting.',
    'Corporate counsel with {{yearsExp}} years advising startups and enterprises on M&A, SEBI compliance, and FEMA regulations. Skilled in {{topSkill1}} and deal structuring. Recently {{achievement}}.',
    'Results-oriented legal professional with {{yearsExp}}+ years of experience in {{topSkill1}} and {{topSkill2}}. Known for meticulous drafting, strategic litigation, and consistently delivering favorable client outcomes.',
  ],

  'Teacher': [
    'Dedicated educator with {{yearsExp}}+ years of teaching experience in {{topSkill1}} for Grades 6–12. Improved average class scores by 20%+ through activity-based learning, personalized mentoring, and structured assessments.',
    'Passionate teacher and curriculum developer with {{yearsExp}} years experience in CBSE/ICSE institutions. Expert in {{topSkill1}} and innovative pedagogy aligned with NEP 2020 guidelines. Recently {{achievement}}.',
    'Academic professional with {{yearsExp}}+ years in secondary and higher education. Strong in {{topSkill1}}, student mentorship, and building collaborative learning environments that produce consistent board toppers.',
  ],

  'Government Officer': [
    'IAS/IPS/IRS/State Service officer with {{yearsExp}}+ years of field administration experience in rural and urban governance, scheme implementation, and inter-departmental coordination. Administered ₹ Cr budgets with full audit compliance.',
    'Public servant with {{yearsExp}} years of proven track record in {{topSkill1}}, district administration, and citizen-centric service delivery. Recently {{achievement}} — recognized by [State Government / Ministry].',
    'Detail-oriented government officer with {{yearsExp}}+ years in policy implementation, revenue administration, and e-governance. Skilled in {{topSkill1}} and driving systemic reforms under NIC/GeM/PFMS frameworks.',
  ],

  'HR Manager': [
    'Strategic HR leader with {{yearsExp}}+ years of experience building people functions from scratch and scaling them for growth-stage companies. Expert in {{topSkill1}} and employer branding. Reduced attrition by 14% at {{company}}.',
    'CHRO-track HR Business Partner with {{yearsExp}} years of experience in full-spectrum HR across talent acquisition, L&D, and organizational design. Known for data-driven people decisions and building high-performance cultures.',
    'HR Manager with {{yearsExp}}+ years driving talent strategy for {{topSkill1}} domains. Passionate about building workplaces where people grow fast. Recently {{achievement}}.',
  ],

  'Sales Manager': [
    'Sales leader with {{yearsExp}}+ years of consistently building and scaling revenue teams. Led 15+ person sales organization to 132% annual quota at {{company}}. Expert in {{topSkill1}} and enterprise deal management.',
    'Revenue-focused Sales Manager with {{yearsExp}} years specializing in B2B SaaS, consultative selling, and territory expansion. Skilled in {{topSkill1}} and CRM discipline. Recently {{achievement}}.',
    'High-performing sales professional and people manager with {{yearsExp}}+ years building pipelines and closing 6-figure deals. Expert in {{topSkill1}}, channel partnerships, and competitive positioning.',
  ],

  'Digital Marketing': [
    'Performance marketing expert with {{yearsExp}}+ years delivering measurable ROI across Google, Meta, and programmatic channels. Average ROAS of 4x+ on managed budgets. Skilled in {{topSkill1}} and {{topSkill2}}.',
    'Data-driven digital marketer with {{yearsExp}} years specializing in {{topSkill1}}, SEO, and full-funnel growth strategy. Grew organic traffic by 5x and reduced CAC by 40%+ at {{company}}. Recently {{achievement}}.',
    'Integrated marketing strategist with {{yearsExp}}+ years driving brand growth and demand generation across digital channels for D2C and B2B brands. Strong in content marketing, paid media, and marketing automation.',
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
