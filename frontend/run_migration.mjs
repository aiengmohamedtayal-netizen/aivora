import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Password must be URL encoded if it contains special characters
const rawPassword = "X9!codex@2026#Supabase ";
const encodedPassword = encodeURIComponent(rawPassword);

const connectionString = `postgresql://postgres:${encodedPassword}@db.rxuegwwuxmqgbiumgspx.supabase.co:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to Supabase...");
    await client.connect();
    
    console.log("Reading migration file...");
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20260709000000_init.sql'), 'utf-8');
    
    console.log("Executing migration...");
    await client.query(sql);
    console.log("Migration executed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

main();
