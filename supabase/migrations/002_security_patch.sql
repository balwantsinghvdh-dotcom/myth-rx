-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Migration: 002_security_patch.sql
-- Phase 3: Security Hardening Patch
-- =============================================================================
-- Description:
-- Safe follow-up migration to be applied if 001_initial_schema.sql has already
-- been executed on your Supabase database.
--
-- Security Patches Implemented:
--   1. Recreates public.submissions_user_view with (security_invoker = true)
--      so that Row Level Security (RLS) is strictly enforced under the caller's
--      identity, preventing cross-user submission leaks.
--   2. Restricts public.submissions SELECT privileges to permitted non-sensitive
--      columns, completely shielding the private 'admin_notes' column from
--      ordinary authenticated users.
--   3. Restricts public.profiles UPDATE privileges so authenticated users can
--      only update 'display_name', blocking column-level role tampering.
--   4. Re-enforces public.get_admin_submissions() with SECURITY DEFINER and
--      internal is_admin() role validation.
-- =============================================================================

SET search_path = public, pg_temp;

-- -----------------------------------------------------------------------------
-- 1. SECURE USER-FACING VIEW WITH SECURITY INVOKER
-- -----------------------------------------------------------------------------

-- Drop existing view to ensure clean recreation with PostgreSQL 15+ options
DROP VIEW IF EXISTS public.submissions_user_view;

-- Recreate with security_invoker = true so PostgreSQL evaluates RLS policies
-- of the underlying public.submissions table using the querying user's JWT context.
CREATE VIEW public.submissions_user_view
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

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.submissions_user_view TO authenticated;


-- -----------------------------------------------------------------------------
-- 2. COLUMN-LEVEL PERMISSION HARDENING: submissions.admin_notes
-- -----------------------------------------------------------------------------

-- Revoke table-wide SELECT on submissions from authenticated users
REVOKE SELECT ON public.submissions FROM authenticated;

-- Grant SELECT only on permitted, non-sensitive columns (excluding admin_notes)
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

-- Ensure anon role has NO SELECT privilege on submissions
REVOKE SELECT ON public.submissions FROM anon;

-- Ensure anon role can only INSERT claim intake columns
REVOKE INSERT ON public.submissions FROM anon;
GRANT INSERT (
  claim_text,
  source_url,
  additional_context,
  status,
  admin_notes
) ON public.submissions TO anon;

-- Ensure authenticated role can only INSERT claim intake columns
REVOKE INSERT ON public.submissions FROM authenticated;
GRANT INSERT (
  user_id,
  claim_text,
  source_url,
  additional_context,
  status,
  admin_notes
) ON public.submissions TO authenticated;


-- -----------------------------------------------------------------------------
-- 3. COLUMN-LEVEL PERMISSION HARDENING: profiles.role
-- -----------------------------------------------------------------------------

-- Revoke table-wide UPDATE on profiles from authenticated users
REVOKE UPDATE ON public.profiles FROM authenticated;

-- Grant UPDATE only on display_name to authenticated users
GRANT UPDATE (display_name) ON public.profiles TO authenticated;


-- -----------------------------------------------------------------------------
-- 4. VERIFY ADMINISTRATIVE RETRIEVAL RPC
-- -----------------------------------------------------------------------------

-- Secure administrative retrieval function:
-- Runs as SECURITY DEFINER to bypass column restrictions ONLY for verified admins.
CREATE OR REPLACE FUNCTION public.get_admin_submissions()
RETURNS SETOF public.submissions
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Strict internal authorization check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Administrator privileges required.';
  END IF;

  RETURN QUERY
  SELECT * FROM public.submissions
  ORDER BY created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_submissions() TO authenticated;
