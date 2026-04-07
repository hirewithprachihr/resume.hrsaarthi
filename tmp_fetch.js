import { createClient } from '@supabase/supabase-js'

const url = 'https://mtfxwyezotzrzzsyhoay.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Znh3eWV6b3R6cnp6c3lob2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzA3MjAsImV4cCI6MjA5MDQ0NjcyMH0.c5weN_IZ0zkWxryr2m9ZyjRSKYV_5aMoXo4PaTgIoIM'
const supabase = createClient(url, key)

async function main() {
  const userId = '801db2e8-457d-43ea-8fec-c4fa44f9d258'
  // Note: We are using the anon key. RLS might block this.
  // Wait, if RLS blocks it because we don't have the user's auth token,
  // we can't query it using the anon key directly unless we know how to bypass it.
  
  // Let's try it anyway
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, updated_at, resume_data')
    .eq('user_id', userId)

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Returned data count:', data ? data.length : 0);
    console.log(JSON.stringify(data, null, 2))
  }
}

main()
