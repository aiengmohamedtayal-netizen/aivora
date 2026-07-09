import os
import psycopg2
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

db_url = os.environ.get("DATABASE_URL")

if not db_url:
    print("Error: DATABASE_URL environment variable is not set.")
    exit(1)

migration_path = "../supabase/migrations/20260709000001_chat_memory.sql"

print(f"Connecting to {host}...")
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    
    with open(migration_path, "r") as f:
        sql = f.read()
    
    print("Executing migration...")
    cursor.execute(sql)
    print("Migration executed successfully.")
    
except Exception as e:
    print(f"Error executing migration: {e}")
finally:
    if 'conn' in locals() and conn:
        conn.close()
