import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL is not set in the environment.");
  process.exit(1);
}

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
