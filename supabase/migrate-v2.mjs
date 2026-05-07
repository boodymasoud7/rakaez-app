// Migration: Add project_images table and read column to contacts
// Usage: node supabase/migrate-v2.mjs

const SUPABASE_URL = 'https://tqxwzfagoeecbxlqawsd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxeHd6ZmFnb2VlY2J4bHFhd3NkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY1NTIwNSwiZXhwIjoyMDg5MjMxMjA1fQ.3i2QUbfjquEUduFMTTn8_60ZM9Kxom1Lz-zpfPzSUp4';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'return=minimal',
};

async function runSQL(sql) {
  // Use the Supabase Management API SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  return res;
}

async function migrate() {
  console.log('Creating project_images table via REST...');

  // We can't run raw SQL via REST API without a function.
  // Instead, create a test row to see if table exists, or create table via schema approach.
  // For now, check if table exists by trying to query it
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/project_images?limit=0`, { headers });

  if (checkRes.status === 404 || checkRes.status === 400) {
    console.log('project_images table does not exist yet.');
    console.log('Please run this SQL in Supabase Dashboard > SQL Editor:');
    console.log('---');
    console.log(`
CREATE TABLE IF NOT EXISTS project_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption_en text DEFAULT '',
  caption_ar text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY project_images_public_read ON project_images FOR SELECT USING (true);
CREATE POLICY project_images_auth_write ON project_images FOR ALL USING (true);
    `);
    console.log('---');
  } else {
    console.log('✓ project_images table already exists');
  }

  // Check if contacts.read column exists
  const contactsRes = await fetch(`${SUPABASE_URL}/rest/v1/contacts?select=read&limit=0`, { headers });
  if (contactsRes.ok) {
    console.log('✓ contacts.read column exists');
  } else {
    console.log('Please run this SQL: ALTER TABLE contacts ADD COLUMN IF NOT EXISTS read boolean DEFAULT false;');
  }

  console.log('\nMigration check complete!');
}

migrate().catch(console.error);
