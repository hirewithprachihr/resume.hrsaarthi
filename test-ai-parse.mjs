import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        return [match[1].trim(), value];
      }
      return null;
    }).filter(Boolean)
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

async function testFetch() {
  const text = "Rahul Sharma. Senior Software Engineer at Apple. 10 years of experience.";
  console.log("Sending text to parse-resume at:", SUPABASE_URL);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/parse-resume`, {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({ text }),
    });

    clearTimeout(timeoutId);
    
    console.log("Status:", res.status);
    const textRes = await res.text();
    console.log("Response:", textRes);
  } catch (err) {
    console.error("Error:", err);
  }
}

testFetch();
