-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Migration: 001_initial_schema.sql
-- Phase 3: Supabase Database Schema and Row Level Security
-- =============================================================================
-- Description:
-- Establishes the core database schema for Myth Rx with strict PostgreSQL
-- constraints, foreign keys, automated timestamps, helper functions, and
-- database-enforced Row Level Security (RLS) policies.
--
-- Security Summary:
--   - Public Visitors: Read published investigations, categories, and published sources.
--                      Can submit anonymous claims with pending status only.
--   - Authenticated Users: Read/update own profile (display_name only), read own
--                          submissions, create/delete own bookmarks for published
--                          investigations. Cannot self-promote or read private notes.
--   - Administrators: Verified via secure SECURITY DEFINER helper public.is_admin().
--                     Full management of investigations, categories, sources, and
--                     submissions moderation.
--
-- Dependency Ordering Note:
-- Tables are created first so that functions (such as is_admin) and triggers
-- referencing public.profiles can compile without "relation does not exist" errors.
-- =============================================================================

-- Ensure clean execution environment
SET search_path = public, pg_temp;


-- -----------------------------------------------------------------------------
-- 1. CORE TABLE DEFINITIONS
-- -----------------------------------------------------------------------------

-- Table: profiles
-- Extends Supabase auth.users with public application metadata and RBAC role.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_profiles_role CHECK (role IN ('user', 'admin'))
);

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users with RBAC role authorization.';
COMMENT ON COLUMN public.profiles.role IS 'User authorization role. Must be user or admin. Protected from user self-modification.';

-- Table: categories
-- Taxonomic classification for health claims (e.g., WhatsApp Viral, Nutrition, Cancer).
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.categories IS 'Taxonomic classifications for health misinformation domains.';

-- Table: investigations
-- Core health claim fact-checks and scientific reviews.
CREATE TABLE IF NOT EXISTS public.investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  original_claim TEXT NOT NULL,
  summary TEXT NOT NULL,
  article_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  verdict TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  CONSTRAINT chk_investigation_verdict CHECK (verdict IN ('Supported', 'False', 'Misleading', 'Unverified')),
  CONSTRAINT chk_investigation_status CHECK (status IN ('draft', 'published', 'archived'))
);

COMMENT ON TABLE public.investigations IS 'Health fact-check investigations containing claims, scientific consensus, and verdicts.';
COMMENT ON COLUMN public.investigations.verdict IS 'Standardized public verdict: Supported, False, Misleading, or Unverified.';
COMMENT ON COLUMN public.investigations.status IS 'Lifecycle state: draft (internal), published (publicly visible), archived (retired).';

-- Table: sources
-- Scientific citations, clinical guidelines, and peer-reviewed journal references.
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  publisher TEXT NOT NULL,
  publication_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.sources IS 'Peer-reviewed evidence sources and clinical references supporting investigations.';

-- Table: submissions
-- Reader-submitted health claims from the public contact/submission form.
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claim_text TEXT NOT NULL,
  source_url TEXT,
  additional_context TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_submission_status CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected'))
);

COMMENT ON TABLE public.submissions IS 'User-submitted viral health claims awaiting editorial intake and fact-checking.';
COMMENT ON COLUMN public.submissions.status IS 'Intake state: pending (new), under_review (in editorial pipeline), accepted (investigated), rejected (out of scope).';
COMMENT ON COLUMN public.submissions.admin_notes IS 'Private editorial notes reserved strictly for administrators.';

-- Table: bookmarks
-- User-curated investigation bookmarks for authenticated visitors.
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_investigation_bookmark UNIQUE (user_id, investigation_id)
);

COMMENT ON TABLE public.bookmarks IS 'Saved investigations curated by authenticated users.';


-- -----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Automated timestamp updater function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Secure administrative role verification helper
-- Runs as SECURITY DEFINER with fixed search_path to prevent search-path injection
-- and eliminate RLS recursion when querying public.profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(v_role = 'admin', FALSE);
END;
$$;

-- Grant execution to all connection roles so RLS policies can evaluate safely
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Function: Auto-create profile on Supabase Auth signup
-- SECURITY GUARANTEE: The role is explicitly hardcoded to 'user'.
-- Under no circumstances is user-supplied metadata trusted for role assignment.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    'user', -- STRICT: Never trust user-controlled metadata for role! Always default to 'user'.
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Function: Enforce profile column immutability and prevent privilege escalation
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Prevent altering the primary key user identity
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Modifying profile account ID is not permitted.';
  END IF;

  -- Prevent ordinary users from promoting themselves or changing their own role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Privilege escalation rejected: Only administrators can modify user roles.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Function: Enforce submission field protection (prevent non-admins from altering status or admin notes)
CREATE OR REPLACE FUNCTION public.protect_submission_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only administrators can modify submission status or private admin notes
  IF (NEW.status IS DISTINCT FROM OLD.status OR NEW.admin_notes IS DISTINCT FROM OLD.admin_notes) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access denied: Only administrators can modify submission status or internal admin notes.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- 3. AUTOMATED TRIGGERS
-- -----------------------------------------------------------------------------

-- Trigger: Automatically update updated_at timestamps on record modification
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_investigations_updated_at ON public.investigations;
CREATE TRIGGER trg_investigations_updated_at
BEFORE UPDATE ON public.investigations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON public.submissions;
CREATE TRIGGER trg_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-create profile on Supabase Auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Enforce profile column immutability and prevent privilege escalation
DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_fields();

-- Trigger: Enforce submission field protection (status & admin notes)
DROP TRIGGER IF EXISTS trg_protect_submission_fields ON public.submissions;
CREATE TRIGGER trg_protect_submission_fields
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.protect_submission_fields();


-- -----------------------------------------------------------------------------
-- 4. PERFORMANCE AND QUERY INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_investigations_status ON public.investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_category_id ON public.investigations(category_id);
CREATE INDEX IF NOT EXISTS idx_investigations_slug ON public.investigations(slug);
CREATE INDEX IF NOT EXISTS idx_investigations_published_at ON public.investigations(published_at DESC) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_sources_investigation_id ON public.sources(investigation_id);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_investigation_id ON public.bookmarks(investigation_id);


-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) ENABLING
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY POLICIES
-- -----------------------------------------------------------------------------

-- =============================================================================
-- POLICIES: profiles
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own display name" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Authenticated users can view only their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Administrators can view all user profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Authenticated users can update only their own display name (role change guarded by trigger)
CREATE POLICY "Users can update own display name"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Administrators can update any profile (e.g. promoting a user to admin)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Administrators can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_admin());


-- =============================================================================
-- POLICIES: categories
-- =============================================================================

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- Anyone (anonymous visitors & authenticated users) can view categories
CREATE POLICY "Public can view categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

-- Administrators: full management
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.is_admin());


-- =============================================================================
-- POLICIES: investigations
-- =============================================================================

DROP POLICY IF EXISTS "Public can view published investigations" ON public.investigations;
DROP POLICY IF EXISTS "Admins can view all investigations" ON public.investigations;
DROP POLICY IF EXISTS "Admins can insert investigations" ON public.investigations;
DROP POLICY IF EXISTS "Admins can update investigations" ON public.investigations;
DROP POLICY IF EXISTS "Admins can delete investigations" ON public.investigations;

-- Public visitors and ordinary users can view ONLY published investigations
CREATE POLICY "Public can view published investigations"
ON public.investigations
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Administrators can view ALL investigations (including drafts and archived)
CREATE POLICY "Admins can view all investigations"
ON public.investigations
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Administrators: full management
CREATE POLICY "Admins can insert investigations"
ON public.investigations
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update investigations"
ON public.investigations
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete investigations"
ON public.investigations
FOR DELETE
TO authenticated
USING (public.is_admin());


-- =============================================================================
-- POLICIES: sources
-- =============================================================================

DROP POLICY IF EXISTS "Public can view sources of published investigations" ON public.sources;
DROP POLICY IF EXISTS "Admins can view all sources" ON public.sources;
DROP POLICY IF EXISTS "Admins can insert sources" ON public.sources;
DROP POLICY IF EXISTS "Admins can update sources" ON public.sources;
DROP POLICY IF EXISTS "Admins can delete sources" ON public.sources;

-- Public visitors and ordinary users can view sources ONLY IF the parent investigation is published
CREATE POLICY "Public can view sources of published investigations"
ON public.sources
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.investigations i
    WHERE i.id = sources.investigation_id AND i.status = 'published'
  )
);

-- Administrators can view ALL sources
CREATE POLICY "Admins can view all sources"
ON public.sources
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Administrators: full management
CREATE POLICY "Admins can insert sources"
ON public.sources
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sources"
ON public.sources
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete sources"
ON public.sources
FOR DELETE
TO authenticated
USING (public.is_admin());


-- =============================================================================
-- POLICIES: submissions
-- =============================================================================

DROP POLICY IF EXISTS "Public can submit claims anonymously" ON public.submissions;
DROP POLICY IF EXISTS "Authenticated users can submit claims" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;

-- Public visitors can submit claims anonymously
-- Enforces: user_id must be null, status must be pending, admin_notes must be null
CREATE POLICY "Public can submit claims anonymously"
ON public.submissions
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL AND
  status = 'pending' AND
  admin_notes IS NULL
);

-- Authenticated users can submit claims for their own account
-- Enforces: user_id = auth.uid(), status must be pending, admin_notes must be null
CREATE POLICY "Authenticated users can submit claims"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  status = 'pending' AND
  admin_notes IS NULL
);

-- Authenticated users can view ONLY their own submissions
CREATE POLICY "Users can view own submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Administrators can view ALL submissions (including intake status and private admin notes)
CREATE POLICY "Admins can view all submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Administrators can update submissions (status intake, internal admin notes)
CREATE POLICY "Admins can update submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Administrators can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
TO authenticated
USING (public.is_admin());


-- =============================================================================
-- POLICIES: bookmarks
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can create own bookmarks for published investigations" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;

-- Authenticated users can view ONLY their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON public.bookmarks
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Authenticated users can bookmark ONLY published investigations
-- Prevents unauthorized database operations targeting unpublished draft investigations
CREATE POLICY "Users can create own bookmarks for published investigations"
ON public.bookmarks
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.investigations i
    WHERE i.id = bookmarks.investigation_id AND i.status = 'published'
  )
);

-- Authenticated users can delete ONLY their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON public.bookmarks
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- -----------------------------------------------------------------------------
-- 7. SECURE ADMINISTRATIVE VIEWS & RPCS
-- -----------------------------------------------------------------------------

-- Secure RPC: get_admin_submissions()
-- Returns all submissions with private admin_notes. Restricted to verified administrators.
CREATE OR REPLACE FUNCTION public.get_admin_submissions()
RETURNS SETOF public.submissions
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Administrator privileges required.';
  END IF;

  RETURN QUERY
  SELECT * FROM public.submissions
  ORDER BY created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_submissions() TO authenticated;

-- User Safe View: submissions_user_view
-- Ensures ordinary users never see private editorial admin_notes even if querying a view.
-- Uses security_invoker = true so PostgreSQL evaluates Row Level Security under
-- the calling user's identity, preventing cross-user submission leaks.
CREATE OR REPLACE VIEW public.submissions_user_view
WITH (security_invoker = true)
AS
SELECT
  id,
  user_id,
  claim_text,
  source_url,
  additional_context,
  status,
  created_at,
  updated_at
FROM public.submissions;

COMMENT ON VIEW public.submissions_user_view IS
'Secure user-facing submissions view with security_invoker enabled. Enforces RLS and completely excludes private admin_notes.';

GRANT SELECT ON public.submissions_user_view TO authenticated;


-- -----------------------------------------------------------------------------
-- 8. TABLE PRIVILEGES & ROLE GRANTS (LEAST PRIVILEGE PRINCIPLE)
-- -----------------------------------------------------------------------------
-- Grants base table permissions so that PostgreSQL queries can enter the Row
-- Level Security (RLS) evaluation pipeline.
--
-- Defense-in-Depth Summary:
--   - Schema: anon and authenticated can resolve public schema names.
--   - Categories, Investigations, Sources: anon & authenticated can SELECT;
--     RLS restricts investigations/sources to published records.
--     Authenticated users can INSERT/UPDATE/DELETE only if verified as admin.
--   - Submissions:
--       * anon can INSERT claim intake columns only. NO SELECT privilege.
--       * authenticated can INSERT claim intake columns only.
--       * authenticated can SELECT only permitted columns (admin_notes is EXCLUDED).
--       * authenticated users can UPDATE/DELETE only if verified as admin.
--   - Profiles:
--       * anon has ZERO table privileges.
--       * authenticated can SELECT own profile, and UPDATE display_name ONLY (role is protected).
--   - Bookmarks:
--       * anon has ZERO table privileges.
--       * authenticated can SELECT/INSERT/DELETE own bookmarks governed strictly by RLS.
-- -----------------------------------------------------------------------------

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Table: categories (Public read; Admin management governed by RLS)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;

-- Table: investigations (Public read; Admin management governed by RLS)
GRANT SELECT ON public.investigations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.investigations TO authenticated;

-- Table: sources (Public read; Admin management governed by RLS)
GRANT SELECT ON public.sources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sources TO authenticated;

-- Table: submissions (Intake permissions, column-level SELECT, and Admin moderation)
GRANT INSERT (claim_text, source_url, additional_context, status, admin_notes)
  ON public.submissions TO anon;

GRANT INSERT (user_id, claim_text, source_url, additional_context, status, admin_notes)
  ON public.submissions TO authenticated;

-- Column-level SELECT on non-sensitive columns only.
-- Authenticated users CANNOT read 'admin_notes' directly from public.submissions.
GRANT SELECT (
  id,
  user_id,
  claim_text,
  source_url,
  additional_context,
  status,
  created_at,
  updated_at
) ON public.submissions TO authenticated;

GRANT UPDATE, DELETE ON public.submissions TO authenticated;

-- Table: profiles (Authenticated user view/edit own; Admin manage governed by RLS; Anon DENIED)
GRANT SELECT ON public.profiles TO authenticated;
-- Column-level UPDATE restricted to display_name only (role tampering blocked)
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- Table: bookmarks (Authenticated user view/save/delete own; Anon DENIED)
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
