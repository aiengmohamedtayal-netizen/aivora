# Data Model Design: Aivora Platform MVP

## Entities & Schemas

### 1. Leads Table (Supabase/PostgreSQL)
Tracks inquiries submitted through the contact portal.
- **Properties**:
  - `id`: `uuid`, Primary Key, default `gen_random_uuid()`
  - `name`: `text`, validation: NOT NULL, min 2 chars
  - `email`: `text`, validation: NOT NULL, email format check
  - `company`: `text`, validation: Optional
  - `message`: `text`, validation: NOT NULL, min 10 chars
  - `status`: `text`, default `"new"`, constraints: `"new" | "contacted" | "resolved"`
  - `created_at`: `timestamp with time zone`, default `now()`

### 2. Services Table (Supabase/PostgreSQL)
Stores service listings and dynamic definitions.
- **Properties**:
  - `id`: `uuid`, Primary Key
  - `slug`: `text`, Unique, validation: NOT NULL, URL-safe slug check
  - `title_en`: `text`, validation: NOT NULL
  - `title_ar`: `text`, validation: NOT NULL
  - `desc_en`: `text`, validation: NOT NULL
  - `desc_ar`: `text`, validation: NOT NULL
  - `icon`: `text`, validation: NOT NULL (maps to a Lucide icon key)

### 3. CaseStudies Table (Supabase/PostgreSQL)
Stores past portfolio work and engineering highlights.
- **Properties**:
  - `id`: `uuid`, Primary Key
  - `slug`: `text`, Unique, validation: NOT NULL, URL-safe slug check
  - `title_en`: `text`, validation: NOT NULL
  - `title_ar`: `text`, validation: NOT NULL
  - `content_en`: `text`, validation: NOT NULL (Markdown formatting allowed)
  - `content_ar`: `text`, validation: NOT NULL (Markdown formatting allowed)
  - `metrics`: `jsonb`, validation: Optional (stores KPI success figures)
  - `tech_stack`: `text[]`, validation: NOT NULL (array of technology tags used)

---

## Data Relations
- **Client to Project Mapping**: Standard leads do not directly link to database rows, but case studies contain a reference field to former client names if applicable.
- **Dynamic Content Mapping**: Case study entries map tags to tech categories for easy UI indexing.
