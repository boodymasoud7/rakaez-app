// Run database migration against Supabase
// Usage: node supabase/run-migration.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://tqxwzfagoeecbxlqawsd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxeHd6ZmFnb2VlY2J4bHFhd3NkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY1NTIwNSwiZXhwIjoyMDg5MjMxMjA1fQ.3i2QUbfjquEUduFMTTn8_60ZM9Kxom1Lz-zpfPzSUp4';

async function runMigration() {
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  
  // Split into individual statements and run them
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    // Skip pure comment lines
    const cleanStmt = stmt.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim();
    if (!cleanStmt || cleanStmt === ';') continue;
    
    console.log(`[${i + 1}/${statements.length}] Executing...`);
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: cleanStmt }),
      });

      if (!res.ok) {
        // Try the SQL endpoint instead
        const res2 = await fetch(`${SUPABASE_URL}/pg`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ query: cleanStmt }),
        });
        if (!res2.ok) {
          const err = await res2.text();
          console.log(`  Warning: ${err.substring(0, 100)}`);
        } else {
          console.log(`  ✓ Done`);
        }
      } else {
        console.log(`  ✓ Done`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  console.log('\nMigration complete!');
}

runMigration();
