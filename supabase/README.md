# Myth Rx — Supabase Database Architecture & Security Guide

This guide documents the database schema, Row Level Security (RLS) model, security hardening patch, and administrator bootstrap workflow for **Myth Rx: Busting Health Hoaxes** (Phase 3).

---

## 1. Prerequisites & Technology Scope

In accordance with project specifications:
- **Database Engine**: PostgreSQL 15+ with Supabase
- **Authentication**: Supabase Auth (JWT-based)
- **Frontend Stack**: Vanilla HTML5, CSS3, Vanilla JavaScript (No React, Next.js, TypeScript, Bootstrap, or Tailwind)
- **Phase 3 Focus**: Pure database schema design, integrity constraints, and database-enforced security policies. Full frontend data fetching and auth wiring will occur in Phase 4.

> [!WARNING]
> **API Key Safety Notice**
> - The **Anon (Public) Key** is intended for client-side browsers and is safeguarded by Row Level Security.
> - The **Service Role (Secret) Key** bypasses all Row Level Security. **NEVER** expose the service-role key in any frontend HTML, CSS, JavaScript, or repository file.

---

## 2. Step-by-Step Supabase Setup & Security Patch Application

### Option A: If Setting Up a Fresh Database
1. Open the Supabase **SQL Editor**.
2. Run [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/migrations/001_initial_schema.sql) (includes full schema, RLS policies, `security_invoker` view, and column grants).
3. Run [`supabase/seed.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/seed.sql) to populate the 5 categories.
4. Run [`supabase/security_tests.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/security_tests.sql) to run the automated security assertions.

### Option B: If You Already Executed `001_initial_schema.sql`
If you previously ran an earlier version of `001_initial_schema.sql`, apply the follow-up patch without dropping your database:
1. Open the Supabase **SQL Editor**.
2. Open [`supabase/migrations/002_security_patch.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/migrations/002_security_patch.sql).
3. Copy its contents, paste into the query tab, and click **Run**.
4. Confirm `Success: No rows returned`.
5. Run [`supabase/security_tests.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/security_tests.sql) to verify that all 8 security assertions pass.

---

## 3. Database Schema Overview

```
auth.users (Supabase Auth Engine)
   │
   ├── (1:1 ON DELETE CASCADE) ──> public.profiles (id, display_name, role)
   │                                     │
   ├── (1:N ON DELETE CASCADE) ──> public.bookmarks (user_id, investigation_id)
   │                                     │
   └── (1:N ON DELETE SET NULL) ─> public.submissions (user_id, claim_text, status, admin_notes)
                                         │
public.categories (id, name, slug)       │
   │                                     │
   └── (1:N ON DELETE SET NULL) ─────────┼──> public.investigations (status, verdict, content)
                                         │          │
                                         │          └── (1:N ON DELETE CASCADE) ──> public.sources
```

### Table Specifications

| Table | Primary Key | Critical Foreign Keys | Constraints & Enum Enforcements |
| :--- | :--- | :--- | :--- |
| **`profiles`** | `id UUID` | References `auth.users(id) ON DELETE CASCADE` | `role IN ('user', 'admin')`, default `'user'` |
| **`categories`** | `id UUID` | None | Unique `slug` |
| **`investigations`** | `id UUID` | `category_id REFERENCES categories(id) ON DELETE SET NULL`, `created_by REFERENCES profiles(id) ON DELETE SET NULL` | Unique `slug`; `verdict IN ('Supported', 'False', 'Misleading', 'Unverified')`; `status IN ('draft', 'published', 'archived')` |
| **`sources`** | `id UUID` | `investigation_id REFERENCES investigations(id) ON DELETE CASCADE` | Valid URL, publisher not null |
| **`submissions`** | `id UUID` | `user_id REFERENCES auth.users(id) ON DELETE SET NULL` | `status IN ('pending', 'under_review', 'accepted', 'rejected')`, default `'pending'` |
| **`bookmarks`** | `id UUID` | `user_id REFERENCES auth.users(id)`, `investigation_id REFERENCES investigations(id)` | Unique constraint `(user_id, investigation_id)` |

---

## 4. Security Architecture & Threat Model

The Myth Rx database implements **Defense-in-Depth**. Security is enforced at the database kernel level through combining:
1. Base Table and Column Privileges (`GRANT` / `REVOKE`)
2. Row Level Security Policies (`USING` / `WITH CHECK`)
3. `SECURITY DEFINER` Helper Functions with fixed search paths
4. Security-Invoker Views (`WITH (security_invoker = true)`)
5. PostgreSQL Database Triggers (`BEFORE UPDATE`)

### 1. Avoiding RLS Recursion
- **Problem**: When a policy on `public.profiles` queries `SELECT role FROM profiles WHERE id = auth.uid()`, PostgreSQL evaluates the policy recursively, causing an infinite loop.
- **Solution**: The helper function `public.is_admin()` is declared as `SECURITY DEFINER` with `SET search_path = public, pg_temp;`. It executes with owner privileges to perform the role lookup directly, terminating recursion safely.

### 2. View Security Invoker (`submissions_user_view`)
- **Vulnerability**: Standard views in PostgreSQL run with the permissions of the view creator (`postgres`), which can bypass Row Level Security on the underlying tables.
- **Fix**: The view `public.submissions_user_view` is declared `WITH (security_invoker = true)`. When an authenticated user queries the view, PostgreSQL evaluates RLS policies under that user's identity, ensuring they can **only** see their own submissions (`user_id = auth.uid()`).

### 3. Column-Level Confidentiality (`admin_notes`)
- **Vulnerability**: PostgreSQL Row Level Security filters rows, but not columns. An authenticated user could run `SELECT admin_notes FROM public.submissions` on their own row and view private moderation notes.
- **Fix**:
  - Direct `SELECT` on `public.submissions` has been restricted to permitted non-sensitive columns: `id, user_id, claim_text, source_url, additional_context, status, created_at, updated_at`.
  - The `admin_notes` column is **not** granted to `authenticated` or `anon`.
  - Any direct attempt by an ordinary user to query `admin_notes` is blocked by PostgreSQL with `ERROR: 42501 (insufficient_privilege)`.
  - Administrators access `admin_notes` securely via `public.get_admin_submissions()`, which verifies `is_admin()` before returning data.

### 4. Guarding Profile Roles & Privilege Escalation
- **Attack Vector**: An attacker attempts to set `role = 'admin'` via signup metadata or an API `PATCH` request.
- **Defense Layer 1 (Trigger)**: `on_auth_user_created` hardcodes `'user'`. User metadata is ignored.
- **Defense Layer 2 (Column Privilege)**: Only `UPDATE (display_name)` is granted to `authenticated`. Direct updates to `role` fail with permission denied.
- **Defense Layer 3 (Trigger)**: `trg_protect_profile_fields` aborts with an exception if a non-admin attempts role alteration.

### 5. Protecting Drafts, Archives & Sources
- Public visitors and ordinary authenticated users can only view investigations where `status = 'published'`.
- Sources belonging to draft or archived investigations are hidden from the public via an `EXISTS (SELECT 1 FROM investigations WHERE ... AND status = 'published')` policy on `public.sources`.

---

## 5. Administrator Bootstrap Procedure

Administrators cannot register themselves through the frontend or public API. The initial administrator must be provisioned through a trusted administrative process.

### Step-by-Step Procedure:

1. **Create Account**: In Supabase Studio, navigate to **Authentication &rarr; Users &rarr; Add User &rarr; Create User**. Enter the administrator's email (e.g., `editor@mythrx.org`) and a strong password.
2. **Elevate to Administrator via SQL Editor**: Run this statement in the SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'editor@mythrx.org'
);
```

3. **Verify Promotion**:

```sql
SELECT p.id, u.email, p.display_name, p.role, p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

---

## 6. Automated Security Test Suite (`security_tests.sql`)

The test file [`supabase/security_tests.sql`](file:///c:/Users/DELL/OneDrive/Desktop/new%20mp/supabase/security_tests.sql) performs 8 explicit assertions:

| Test ID | Assertion Target | Pass Condition | Failure Action |
| :--- | :--- | :--- | :--- |
| **Test 1** | Schema Integrity | 6 tables exist, RLS active on all, 4 check constraints present | `RAISE EXCEPTION` |
| **Test 2** | Security Invoker | `submissions_user_view` has `security_invoker = true` | `RAISE EXCEPTION` |
| **Test 3** | Cross-User Isolation | User A cannot see User B's rows via base table or view | `RAISE EXCEPTION` |
| **Test 4** | `admin_notes` Confidentiality | Direct `SELECT admin_notes` denied with `insufficient_privilege`; view excludes column | `RAISE EXCEPTION` |
| **Test 5** | Non-Admin RPC Rejection | Non-admin calling `get_admin_submissions()` denied | `RAISE EXCEPTION` |
| **Test 6** | Role Escalation Rejection | User updating own role to `'admin'` denied | `RAISE EXCEPTION` |
| **Test 7** | Anonymous Intake Controls | Valid intake succeeds; altering status or injecting `admin_notes` denied by RLS | `RAISE EXCEPTION` |
| **Test 8** | Admin Moderation Access | Verified Admin retrieves all submissions with notes intact | `RAISE EXCEPTION` |

Run the script in your Supabase SQL Editor. If all tests pass, the output displays:
```text
ALL 8 PHASE 3 SECURITY ASSERTIONS PASSED WITH ZERO FAILURES
```
