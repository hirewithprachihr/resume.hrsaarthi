import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://mtfxwyezotzrzzsyhoay.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Znh3eWV6b3R6cnp6c3lob2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzA3MjAsImV4cCI6MjA5MDQ0NjcyMH0.c5weN_IZ0zkWxryr2m9ZyjRSKYV_5aMoXo4PaTgIoIM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testParser() {
  const filePath = "F:\\programing\\Projects\\hr\\resume-builder\\Prachi_Premium_Resume_Final.docx"
  
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath)
    return
  }

  console.log('Testing AI Parser Edge Function directly...')
  
  // Note: Since I'm not in a browser, I'll simulate extracting text 
  // or just send a dummy text to see if the function is alive.
  const { data, error } = await supabase.functions.invoke('parse-resume', {
    body: { text: "This is a test resume for Prachi. Experience at Apple INC as Lead Architect." }
  })

  if (error) {
    console.error('Edge Function Error:', error)
  } else {
    console.log('Edge Function Response:', JSON.stringify(data, null, 2))
  }
}

testParser()
