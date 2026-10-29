-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Migration: 003_admin_moderation.sql
-- Phase 5: Administrator Moderation RPC & Mutation Authorization
-- =============================================================================
-- Description:
-- Establishes a dedicated, secure server-side administrative RPC for updating
-- crowdsourced claim submission status and internal editorial admin_notes.
--
-- Security Guarantees:
--   1. Strict Server-Side Role Check: Executes public.is_admin() to verify
--      the caller has role = 'admin' in public.profiles. Non-admins are
--      immediately rejected with an explicit authorization exception.
--   2. Input Validation: Validates that the target status belongs to the
--      chk_submission_status constraint ('pending', 'under_review', 'accepted', 'rejected').
--   3. Column Protection Alignment: Runs as SECURITY DEFINER so that authorized
--      administrators can update admin_notes while preserving column-level
--      restrictions against ordinary authenticated users.
--   4. Role Grants: Explicitly revokes EXECUTE from PUBLIC and anon, granting
--      EXECUTE only to authenticated (which is internally guarded by is_admin()).
-- =============================================================================

SET search_path = public, pg_temp;

-- -----------------------------------------------------------------------------
-- 1. SECURE ADMINISTRATIVE MODERATION RPC
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_admin_submission(
  p_submission_id UUID,
  p_status TEXT,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS public.submissions
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated public.submissions;
BEGIN
  -- 1. Strict Administrator Authorization Check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Administrator privileges required.';
  END IF;

  -- 2. Validate Submission ID
  IF p_submission_id IS NULL THEN
    RAISE EXCEPTION 'Invalid argument: Submission ID cannot be null.';
  END IF;

  -- 3. Validate Submission Status Enum Value
  IF p_status NOT IN ('pending', 'under_review', 'accepted', 'rejected') THEN
    RAISE EXCEPTION 'Invalid submission status: "%". Allowed values: pending, under_review, accepted, rejected.', p_status;
  END IF;

  -- 4. Execute Protected Mutation
  UPDATE public.submissions
  SET
    status = p_status,
    admin_notes = p_admin_notes,
    updated_at = NOW()
  WHERE id = p_submission_id
  RETURNING * INTO v_updated;

  -- 5. Confirm Record Exists
  IF v_updated.id IS NULL THEN
    RAISE EXCEPTION 'Submission with ID "%" does not exist.', p_submission_id;
  END IF;

  RETURN v_updated;
END;
$$;

COMMENT ON FUNCTION public.update_admin_submission(UUID, TEXT, TEXT) IS
'Secure administrative RPC to update claim submission status and private admin_notes. Enforces is_admin() validation and status integrity.';

-- -----------------------------------------------------------------------------
-- 2. ROLE PRIVILEGES & EXECUTE GRANTS
-- -----------------------------------------------------------------------------

-- Revoke execution from PUBLIC and anon explicitly
REVOKE EXECUTE ON FUNCTION public.update_admin_submission(UUID, TEXT, TEXT) FROM PUBLIC, anon;

-- Authenticated users receive execute privilege; the function body enforces is_admin()
GRANT EXECUTE ON FUNCTION public.update_admin_submission(UUID, TEXT, TEXT) TO authenticated;
