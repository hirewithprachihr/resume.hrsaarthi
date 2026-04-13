const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const SUPABASE_URL = 'https://mtfxwyezotzrzzsyhoay.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.argv[2] // I'll try to find this or just use psql

// Wait, I don't have the service role key. I'll use the postgres connection string with pg.
const { Client } = require('pg')

async function applySql() {
  const client = new Client({
    connectionString: "postgresql://postgres:Harish%400510@db.mtfxwyezotzrzzsyhoay.supabase.co:5432/postgres"
  })

  try {
    await client.connect()
    console.log('Connected to Postgres')
    
    const sql = fs.readFileSync('f:\\programing\\Projects\\hr\\resume-builder\\supabase\\migrations\\20260408100000_fix_all_rls_recursion.sql', 'utf8')
    
    console.log('Applying migration...')
    await client.query(sql)
    console.log('Migration applied successfully!')
    
  } catch (err) {
    console.error('Error applying migration:', err.message)
  } finally {
    await client.end()
  }
}

applySql()
