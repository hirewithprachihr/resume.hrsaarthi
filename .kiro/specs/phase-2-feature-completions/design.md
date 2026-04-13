# Phase 2 — Design Document

## Architecture Overview
This phase completes 5 partially implemented features by adding backend functionality, proper state management, and UI polish. No new architectural patterns - we're completing existing implementations.

## Database Schema

### Table: `job_applications`
```sql
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'offer', 'rejected')),
  applied_date date,
  notes text,
  resume_id uuid,
  job_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
```

### Table: `cover_letters`
```sql
CREATE TABLE cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id uuid,
  title text NOT NULL,
  company text,
  job_title text,
  content text NOT NULL,
  tone text,
  template_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own letters"
  ON cover_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letters"
  ON cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letters"
  ON cover_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own letters"
  ON cover_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
```

## Component Architecture

### 2.1 — Job Tracker Kanban Board

**Component Structure**:
```
DashboardPage
├── JobTrackerSection (new)
│   ├── KanbanColumn × 4 (Applied, Screening, Interview, Offer+Rejected)
│   │   └── JobCard (uses TiltCard)
│   └── AddJobModal
```

**State Management**:
- Local state in `DashboardPage` for job applications
- Fetch on mount, update on CRUD operations
- Optimistic UI updates with rollback on error

**Drag & Drop Implementation**:
```jsx
// No external library - use native HTML5 drag API
<div
  draggable
  onDragStart={(e) => e.dataTransfer.setData('jobId', job.id)}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    const jobId = e.dataTransfer.getData('jobId')
    updateJobStatus(jobId, newStatus)
  }}
>
```

### 2.2 — Cover Letter Persistence

**Data Flow**:
1. On mount: `fetchCoverLetters(user.id)` → populate `savedLetters` state
2. On save: `saveCoverLetter(letterData)` → upsert by ID → show "Saved ✓" toast
3. On select: populate all form fields from selected letter
4. On delete: confirm → `deleteCoverLetter(id)` → remove from state

**UI Changes**:
- Dropdown shows: `{title} - {company} ({date})`
- Delete button (trash icon) per letter in dropdown
- "Saved ✓" indicator fades after 2s using CSS animation

### 2.3 — JD Persistence

**Zustand Store Changes**:
```js
// In resumeStore.js - ensure jobDescription is persisted
const useResumeStore = create(
  persist(
    (set, get) => ({
      jobDescription: '',
      setJobDescription: (jd) => set({ jobDescription: jd }),
      clearJobDescription: () => set({ jobDescription: '' }),
      // ... existing state
    }),
    {
      name: 'resume-storage',
      // Ensure jobDescription is NOT in exclude list
    }
  )
)
```

**UI Enhancements**:
- Character count: `{jobDescription.length} / 5000 characters`
- Clear button: trash icon, shows confirm if >100 chars
- Auto-match button: Zap icon, calls `tailorResumeToJD()`, shows diff modal

**Diff Modal**:
```jsx
// Show before/after comparison
<Modal>
  <h3>Suggested Changes</h3>
  {suggestions.map(s => (
    <div>
      <del>{s.original}</del>
      <ins>{s.suggested}</ins>
    </div>
  ))}
  <Button onClick={applyChanges}>Apply All</Button>
</Modal>
```

### 2.4 — PrachiSignature Template

**Photo Rendering Logic**:
```jsx
{personal.photo ? (
  <img 
    src={personal.photo} 
    className="w-24 h-24 rounded-full object-cover"
    style={{ border: `3px solid ${settings.accentColor}` }}
  />
) : (
  <div 
    className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
    style={{ 
      backgroundColor: settings.accentColor,
      color: '#fff'
    }}
  >
    {getInitials(personal.fullName)}
  </div>
)}
```

**Skills Pills**:
```jsx
<div className="flex flex-wrap gap-2">
  {skills.items.split(',').map(skill => (
    <span 
      className="px-3 py-1 rounded-full text-sm"
      style={{ 
        backgroundColor: `${settings.accentColor}20`,
        color: settings.accentColor,
        border: `1px solid ${settings.accentColor}`
      }}
    >
      {skill.trim()}
    </span>
  ))}
</div>
```

**Font Size Scaling**:
```jsx
const fontSizeMap = {
  small: { base: '0.875rem', heading: '1.125rem' },
  medium: { base: '1rem', heading: '1.25rem' },
  large: { base: '1.125rem', heading: '1.5rem' }
}

const sizes = fontSizeMap[settings.fontSize || 'medium']
```

**Page Break Prevention**:
```jsx
<div style={{ pageBreakInside: 'avoid' }}>
  {/* Experience entry content */}
</div>
```

### 2.5 — DOCX Export Formatting

**List Items Implementation**:
```js
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ListItem } from 'docx'

// Create numbering for bullets
const numbering = {
  config: [{
    reference: 'bullet-points',
    levels: [{
      level: 0,
      format: 'bullet',
      text: '•',
      alignment: AlignmentType.LEFT,
      style: {
        paragraph: {
          indent: { left: 720, hanging: 360 }
        }
      }
    }]
  }]
}

// Experience bullets
experience.bullets.map(bullet => 
  new Paragraph({
    text: bullet,
    bullet: {
      level: 0
    }
  })
)
```

**Section Headings**:
```js
new Paragraph({
  text: 'EXPERIENCE',
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 120 }
})
```

**Contact Table**:
```js
new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({ 
          children: [new Paragraph(email)],
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
        }),
        new TableCell({ 
          children: [new Paragraph(phone)],
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
        }),
        new TableCell({ 
          children: [new Paragraph(linkedin)],
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
        }),
        new TableCell({ 
          children: [new Paragraph(location)],
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
        })
      ]
    })
  ],
  width: { size: 100, type: WidthType.PERCENTAGE }
})
```

**Photo Stripping**:
```js
// In docxExporter.js - never include photo in DOCX
// ATS scanners can't parse images, and they increase file size
const exportData = {
  ...data,
  personal: {
    ...data.personal,
    photo: '' // Always strip photo for DOCX
  }
}
```

## API Contracts

### `services/supabase.js` - New Functions

```js
// Job Applications
export async function fetchJobApplications(userId) {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createJobApplication(application) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([application])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateJobApplication(id, updates) {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteJobApplication(id) {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Cover Letters
export async function fetchCoverLetters(userId) {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function saveCoverLetter(letter) {
  const { data, error } = await supabase
    .from('cover_letters')
    .upsert([{
      ...letter,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteCoverLetter(id) {
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
```

## Error Handling

### Network Errors
- Show toast notification: "Failed to save. Please check your connection."
- Retry button in toast for failed operations
- Optimistic UI with rollback on error

### Validation Errors
- Job Tracker: Company and role are required
- Cover Letter: Title and content are required (min 50 chars)
- JD: Max 5000 characters

### Edge Cases
- Empty states: Show helpful messages with CTA buttons
- Offline mode: Queue operations, sync when online
- Concurrent edits: Last write wins (no conflict resolution needed)

## Performance Considerations

### Database Queries
- Use indexes on `user_id` and `status` columns
- Limit initial fetch to 50 most recent items
- Implement pagination if user has >50 applications

### DOCX Generation
- Generate in Web Worker to avoid blocking UI
- Show progress indicator for large resumes (>3 pages)
- Cache generated DOCX for 5 minutes (same resume data)

### State Updates
- Debounce JD auto-match by 500ms
- Throttle drag events to 60fps
- Use React.memo for JobCard components

## Security Considerations

### RLS Policies
- All tables have user_id-based RLS
- No admin override needed for Phase 2
- Verify auth.uid() in all policies

### Input Sanitization
- Escape HTML in job notes and cover letter content
- Validate URLs in job_url field
- Limit text field lengths at DB level

### Data Privacy
- Never log user content to console
- Don't include PII in error messages
- DOCX export strips photo for privacy

## Testing Strategy

### Unit Tests
- Test each Supabase function with mock data
- Test DOCX generation with various resume structures
- Test drag-and-drop state updates

### Integration Tests
- Test full Job Tracker CRUD flow
- Test Cover Letter save/load/delete flow
- Test JD persistence across browser refresh

### Manual Testing Checklist
- [ ] Create job application in each status column
- [ ] Drag job between columns, verify status updates
- [ ] Save cover letter, refresh page, verify it loads
- [ ] Delete cover letter, verify it's removed
- [ ] Paste JD, refresh page, verify it persists
- [ ] Export DOCX, open in Word, verify bullet formatting
- [ ] Test PrachiSignature with photo and without
- [ ] Test PrachiSignature with all font sizes
- [ ] Verify accent color changes reflect in template

## Rollback Plan

If any feature causes issues:
1. Feature flags: Add `ENABLE_JOB_TRACKER` etc. in config
2. Database: Keep old tables, don't drop anything
3. Code: Keep old implementations commented out
4. Revert: Single commit per feature for easy revert

## Success Metrics

- Job Tracker: 50% of active users create at least 1 application within 7 days
- Cover Letter: 30% of cover letter users save at least 1 letter
- JD Persistence: 80% of users with JD have it persist across sessions
- PrachiSignature: 0 rendering errors in production logs
- DOCX Export: 0 formatting complaints in support tickets
