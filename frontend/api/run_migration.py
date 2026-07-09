import os
import psycopg2
from urllib.parse import quote_plus

# The raw password from user (with a space if it has one)
# postgresql://postgres:X9!codex@2026#Supabase @db.rxuegwwuxmqgbiumgspx.supabase.co:5432/postgres
# URL-encoding the password part just in case:
raw_password = "X9!codex@2026#Supabase "
encoded_password = quote_plus(raw_password)

host = "db.rxuegwwuxmqgbiumgspx.supabase.co"
db = "postgres"
user = "postgres"
port = "5432"

db_url = f"postgresql://{user}:{encoded_password}@{host}:{port}/{db}"

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
