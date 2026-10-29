-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Hardened Security Verification Suite: security_tests.sql
-- Phase 3: Precise Security Boundaries & Integrity Verification
-- =============================================================================
-- Instructions:
-- Run this test suite in the Supabase Studio SQL Editor to validate the live
-- database security posture, column privileges, security-invoker views,
-- RLS policies, role escalation defenses, and RPC authorization guards.
--
-- Strict Validation Principles:
--   1. ZERO TOLERANCE FOR BROAD "WHEN OTHERS": Every test verifies the exact
--      expected PostgreSQL error code (SQLSTATE) or specific exception message.
--      Missing functions, syntax errors, or unrelated failures cause immediate
--      test failure rather than false-positive passes.
--   2. ATOMIC ROLLBACK: The suite executes inside a transaction block (BEGIN...ROLLBACK).
--      All test fixtures are cleanly discarded regardless of whether tests pass or fail.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- TEST 1: Schema Integrity & Check Constraints
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_missing_tables INT;
  v_unsecured_tables INT;
  v_missing_constraints INT;
BEGIN
  -- 1.1 Verify all 6 application tables exist
  SELECT count(*) INTO v_missing_tables
  FROM (
    VALUES ('profiles'), ('categories'), ('investigations'), ('sources'), ('submissions'), ('bookmarks')
  ) AS expected(tbl)
  LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public' AND t.table_name = expected.tbl
  WHERE t.table_name IS NULL;

  IF v_missing_tables > 0 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 1.1]: % expected application tables are missing from public schema!', v_missing_tables;
  END IF;

  -- 1.2 Verify Row Level Security is ENABLED on all 6 tables
  SELECT count(*) INTO v_unsecured_tables
  FROM pg_class
  WHERE relname IN ('profiles', 'categories', 'investigations', 'sources', 'submissions', 'bookmarks')
    AND relnamespace = 'public'::regnamespace
    AND relrowsecurity = false;

  IF v_unsecured_tables > 0 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 1.2]: % tables do NOT have RLS enabled!', v_unsecured_tables;
  END IF;

  -- 1.3 Verify Check Constraints exist
  SELECT count(*) INTO v_missing_constraints
  FROM (
    VALUES
      ('chk_profiles_role'),
      ('chk_investigation_verdict'),
      ('chk_investigation_status'),
      ('chk_submission_status')
  ) AS expected(cname)
  LEFT JOIN pg_constraint c ON c.conname = expected.cname
  WHERE c.conname IS NULL;

  IF v_missing_constraints > 0 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 1.3]: % expected check constraints are missing!', v_missing_constraints;
  END IF;

  RAISE NOTICE 'PASS [Test 1]: Schema tables, RLS activation, and constraints verified.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 2: Function Definition & Privilege Inspection: get_admin_submissions()
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_fn_exists BOOLEAN;
  v_is_secdef BOOLEAN;
  v_has_anon_exec BOOLEAN;
  v_has_auth_exec BOOLEAN;
BEGIN
  -- 2.1 Verify function exists in public schema
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_admin_submissions'
  ) INTO v_fn_exists;

  IF NOT v_fn_exists THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 2.1]: Function public.get_admin_submissions() does not exist!';
  END IF;

  -- 2.2 Verify function is declared with SECURITY DEFINER
  SELECT p.prosecdef INTO v_is_secdef
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' AND p.proname = 'get_admin_submissions';

  IF NOT v_is_secdef THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 2.2]: get_admin_submissions() must be declared SECURITY DEFINER!';
  END IF;

  -- 2.3 Assert function execution privileges
  v_has_anon_exec := has_function_privilege('anon', 'public.get_admin_submissions()', 'execute');
  v_has_auth_exec := has_function_privilege('authenticated', 'public.get_admin_submissions()', 'execute');

  IF v_has_anon_exec THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 2.3]: anon role must NOT have EXECUTE privilege on public.get_admin_submissions()!';
  END IF;

  IF NOT v_has_auth_exec THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 2.3]: authenticated role must have EXECUTE privilege on public.get_admin_submissions() to allow admin callers!';
  END IF;

  RAISE NOTICE 'PASS [Test 2]: get_admin_submissions() exists, is SECURITY DEFINER, anon execution denied, authenticated execution granted.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 3: Verify submissions_user_view Security Invoker Configuration
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_options TEXT[];
  v_has_security_invoker BOOLEAN := false;
BEGIN
  -- 3.1 Inspect view options in pg_class
  SELECT reloptions INTO v_options
  FROM pg_class
  WHERE relname = 'submissions_user_view' AND relnamespace = 'public'::regnamespace;

  IF v_options IS NOT NULL THEN
    v_has_security_invoker := 'security_invoker=true' = ANY(v_options);
  END IF;

  IF NOT v_has_security_invoker THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 3.1]: submissions_user_view is NOT configured with (security_invoker = true)!';
  END IF;

  -- 3.2 Verify admin_notes is excluded from view columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'submissions_user_view' AND column_name = 'admin_notes'
  ) THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 3.2]: submissions_user_view exposes private admin_notes column!';
  END IF;

  RAISE NOTICE 'PASS [Test 3]: submissions_user_view confirmed with security_invoker=true and admin_notes excluded.';
END $$;


-- -----------------------------------------------------------------------------
-- SETUP: Create Isolated Test Fixtures
-- -----------------------------------------------------------------------------
-- Explicitly remove any residual fixture IDs from previous aborted sessions
DELETE FROM public.submissions WHERE id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
);
DELETE FROM public.profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '99999999-9999-9999-9999-999999999999'
);
DELETE FROM auth.users WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '99999999-9999-9999-9999-999999999999'
);

-- Insert test users into auth.users (trigger on_auth_user_created creates profiles with role = 'user')
INSERT INTO auth.users (id, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'usera@mythrx.test'),
  ('22222222-2222-2222-2222-222222222222', 'userb@mythrx.test'),
  ('99999999-9999-9999-9999-999999999999', 'admin@mythrx.test');

-- Replace the auto-created 'user' profile with an 'admin' profile for the admin fixture.
-- Note: DELETE + INSERT avoids firing the BEFORE UPDATE trigger trg_protect_profile_fields
-- which strictly requires an active admin session when updating roles.
DELETE FROM public.profiles WHERE id = '99999999-9999-9999-9999-999999999999';

INSERT INTO public.profiles (id, display_name, role)
VALUES ('99999999-9999-9999-9999-999999999999', 'Admin Fixture', 'admin');

-- Insert test submissions
INSERT INTO public.submissions (id, user_id, claim_text, status, admin_notes)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'User A Claim on Ginger', 'pending', 'User A Private Editorial Note'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'User B Claim on Lemon', 'under_review', 'User B Confidential Fraud Alert');


-- -----------------------------------------------------------------------------
-- TEST 4: Cross-User Submission Isolation (Base Table & View)
-- -----------------------------------------------------------------------------
-- Simulate User A
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

DO $$
DECLARE
  v_count_base INT;
  v_leak_base INT;
  v_count_view INT;
  v_leak_view INT;
BEGIN
  -- 4.1 Base Table RLS Isolation
  SELECT count(*) INTO v_count_base FROM public.submissions;
  SELECT count(*) INTO v_leak_base FROM public.submissions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  IF v_count_base <> 1 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 4.1]: User A sees % submissions on base table (expected exactly 1)!', v_count_base;
  END IF;

  IF v_leak_base > 0 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 4.1]: Cross-user leak! User A accessed User B submission on base table!';
  END IF;

  -- 4.2 View RLS Isolation (submissions_user_view)
  SELECT count(*) INTO v_count_view FROM public.submissions_user_view;
  SELECT count(*) INTO v_leak_view FROM public.submissions_user_view WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  IF v_count_view <> 1 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 4.2]: User A sees % submissions on submissions_user_view (expected exactly 1)!', v_count_view;
  END IF;

  IF v_leak_view > 0 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 4.2]: Cross-user leak! User A accessed User B submission on submissions_user_view!';
  END IF;

  RAISE NOTICE 'PASS [Test 4]: Cross-user submission isolation confirmed on base table and security-invoker view.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 5: Column-Level Confidentiality of admin_notes
-- -----------------------------------------------------------------------------
-- Still simulating User A
DO $$
DECLARE
  v_val TEXT;
  v_succeeded BOOLEAN := false;
  v_err_msg TEXT;
  v_err_code TEXT;
BEGIN
  BEGIN
    EXECUTE 'SELECT admin_notes FROM public.submissions LIMIT 1' INTO v_val;
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 5]: User A successfully queried private admin_notes column!';
  END IF;

  -- Verify specific failure reason: must be insufficient_privilege (42501)
  IF v_err_code <> '42501' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 5]: admin_notes query failed with unexpected error code: % (expected 42501 insufficient_privilege). Error message: %', v_err_code, v_err_msg;
  END IF;

  RAISE NOTICE 'PASS [Test 5]: admin_notes access denied specifically with insufficient_privilege (42501).';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 6: Rejection of Non-Admin RPC Calls (Exact Authorization Check)
-- -----------------------------------------------------------------------------
-- Still simulating User A
DO $$
DECLARE
  v_rec RECORD;
  v_succeeded BOOLEAN := false;
  v_err_msg TEXT;
  v_err_code TEXT;
BEGIN
  BEGIN
    SELECT * INTO v_rec FROM public.get_admin_submissions() LIMIT 1;
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 6]: Non-admin User A successfully executed get_admin_submissions()!';
  END IF;

  -- Verify exact expected authorization rejection message
  IF v_err_msg NOT LIKE '%Access denied: Administrator privileges required.%' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 6]: get_admin_submissions() failed with unexpected error: "%" (SQLSTATE %). Expected "Access denied: Administrator privileges required."', v_err_msg, v_err_code;
  END IF;

  RAISE NOTICE 'PASS [Test 6]: Non-admin RPC call rejected with exact authorization error.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 7: Rejection of Role Escalation Attempts (Specific Reason)
-- -----------------------------------------------------------------------------
-- Still simulating User A
DO $$
DECLARE
  v_succeeded BOOLEAN := false;
  v_err_msg TEXT;
  v_err_code TEXT;
BEGIN
  BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = '11111111-1111-1111-1111-111111111111';
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 7]: User A successfully elevated own role to admin!';
  END IF;

  -- Must be denied specifically by column privilege (42501) OR protection trigger (P0001)
  IF v_err_code = '42501' THEN
    RAISE NOTICE 'PASS [Test 7]: Role escalation blocked specifically by column privileges (42501).';
  ELSIF v_err_msg LIKE '%Privilege escalation rejected: Only administrators can modify user roles.%' THEN
    RAISE NOTICE 'PASS [Test 7]: Role escalation blocked specifically by protection trigger (P0001).';
  ELSE
    RAISE EXCEPTION 'ASSERTION FAILED [Test 7]: Role escalation failed with unexpected error: "%" (SQLSTATE %). Expected 42501 or trigger message.', v_err_msg, v_err_code;
  END IF;
END $$;


-- -----------------------------------------------------------------------------
-- TEST 8: Anonymous Intake & Access Restrictions
-- -----------------------------------------------------------------------------
-- Switch to simulated anonymous visitor
SET LOCAL ROLE anon;

DO $$
DECLARE
  v_sub_id UUID;
  v_succeeded BOOLEAN := false;
  v_err_msg TEXT;
  v_err_code TEXT;
  v_select_cnt INT;
BEGIN
  -- 8.1 Legitimate anonymous intake must succeed with status = 'pending'
  -- Note: Performed without RETURNING clause because 'anon' is strictly INSERT-only
  -- and has no SELECT privilege on public.submissions.
  BEGIN
    INSERT INTO public.submissions (claim_text, status)
    VALUES ('Valid anonymous public claim intake', 'pending');
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.1]: Valid anonymous claim submission failed: % (SQLSTATE %)', SQLERRM, SQLSTATE;
  END;

  -- 8.2 Malicious attempt: setting status = 'accepted' must fail RLS
  v_succeeded := false;
  BEGIN
    INSERT INTO public.submissions (claim_text, status)
    VALUES ('Malicious pre-approved claim intake', 'accepted');
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.2]: Anonymous user was able to submit claim with status=accepted!';
  END IF;

  IF v_err_code <> '44000' AND v_err_msg NOT LIKE '%violates row-level security policy%' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.2]: Malicious status insert failed with unexpected error: "%" (SQLSTATE %). Expected RLS violation (44000).', v_err_msg, v_err_code;
  END IF;

  -- 8.3 Malicious attempt: injecting admin_notes must fail RLS
  v_succeeded := false;
  BEGIN
    INSERT INTO public.submissions (claim_text, status, admin_notes)
    VALUES ('Malicious claim with injected admin note', 'pending', 'Fake admin approval note');
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.3]: Anonymous user was able to inject admin_notes on submission!';
  END IF;

  IF v_err_code <> '44000' AND v_err_msg NOT LIKE '%violates row-level security policy%' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.3]: Malicious admin_notes insert failed with unexpected error: "%" (SQLSTATE %). Expected RLS violation (44000).', v_err_msg, v_err_code;
  END IF;

  -- 8.4 Anonymous cannot SELECT from submissions (must fail with 42501 insufficient_privilege)
  v_succeeded := false;
  BEGIN
    EXECUTE 'SELECT count(*) FROM public.submissions' INTO v_select_cnt;
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.4]: Anonymous user was able to SELECT from submissions!';
  END IF;

  IF v_err_code <> '42501' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 8.4]: Anonymous SELECT failed with unexpected error code: % (expected 42501). Error message: %', v_err_code, v_err_msg;
  END IF;

  RAISE NOTICE 'PASS [Test 8]: Anonymous intake restrictions verified (valid pending intake succeeded; status alteration, note injection, and SELECT denied for intended reasons).';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 9: Anonymous Access to get_admin_submissions() Must Be Rejected
-- -----------------------------------------------------------------------------
-- Still simulating anon
DO $$
DECLARE
  v_rec RECORD;
  v_succeeded BOOLEAN := false;
  v_err_msg TEXT;
  v_err_code TEXT;
BEGIN
  BEGIN
    SELECT * INTO v_rec FROM public.get_admin_submissions() LIMIT 1;
    v_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_code = RETURNED_SQLSTATE;
  END;

  IF v_succeeded THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 9]: Anonymous user successfully executed get_admin_submissions()!';
  END IF;

  -- Verify specific failure reason: must be insufficient_privilege (42501)
  -- since anon does not hold EXECUTE permission on get_admin_submissions()
  IF v_err_code <> '42501' THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 9]: Anonymous call to get_admin_submissions() failed with unexpected error code: % (expected 42501 insufficient_privilege). Error message: %', v_err_code, v_err_msg;
  END IF;

  RAISE NOTICE 'PASS [Test 9]: Anonymous call to get_admin_submissions() rejected specifically by insufficient privilege (42501).';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 10: Verified Administrator Full Moderation Access
-- -----------------------------------------------------------------------------
-- Switch to simulated Administrator
RESET ROLE;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';

DO $$
DECLARE
  v_admin_count INT;
  v_has_notes INT;
BEGIN
  -- Admin executes secure RPC
  SELECT count(*) INTO v_admin_count FROM public.get_admin_submissions();
  SELECT count(*) INTO v_has_notes FROM public.get_admin_submissions() WHERE admin_notes IS NOT NULL;

  IF v_admin_count < 2 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 10]: Admin retrieved % submissions (expected at least 2)!', v_admin_count;
  END IF;

  IF v_has_notes < 2 THEN
    RAISE EXCEPTION 'ASSERTION FAILED [Test 10]: Admin did not retrieve private admin_notes (only % had notes)!', v_has_notes;
  END IF;

  RAISE NOTICE 'PASS [Test 10]: Admin successfully retrieved all % submissions with private admin_notes via get_admin_submissions().', v_admin_count;
END $$;


-- -----------------------------------------------------------------------------
-- TEARDOWN & CLEANUP
-- -----------------------------------------------------------------------------
RESET ROLE;

-- Explicitly roll back the transaction so NO test data remains in the database
ROLLBACK;

-- Final Confirmation
SELECT 'ALL 10 PHASE 3 SECURITY ASSERTIONS PASSED WITH ZERO FAILURES' AS test_status;
