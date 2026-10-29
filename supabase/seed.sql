-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Seed Data: seed.sql (Categories Only)
-- Phase 3: Supabase Database Schema and Security
-- =============================================================================
-- Description:
-- Populates the standardized health misinformation categories corresponding to
-- the domains established in Phase 1 and Phase 2.
--
-- Ethical Disclosure:
-- In compliance with Phase 3 instructions, this file seeds ONLY standardized
-- classification categories. It does not publish unverified health claims,
-- fabricate clinical trials, or invent physician endorsements.
-- =============================================================================

SET search_path = public, pg_temp;

INSERT INTO public.categories (name, slug, description)
VALUES
  (
    'WhatsApp Viral',
    'whatsapp',
    'Viral audio forwards, chain text messages, and family group home-remedy hoaxes circulating across private messaging platforms.'
  ),
  (
    'Nutrition & Diet',
    'diet',
    'Nutritional misconceptions, raw dairy hazards, alkaline water claims, and metabolic cure diets.'
  ),
  (
    'Supplements & Herbs',
    'supplements',
    'High-dose vitamin regimens, unregulated herbal extracts, and unproven natural substitutes for prescription medications.'
  ),
  (
    'Cancer Claims',
    'cancer',
    'Alternative oncology regimens, purported miracle citrus remedies, and unverified tumor prevention claims.'
  ),
  (
    'Cardiovascular',
    'cardiology',
    'Heart attack and stroke first aid misinformation, blood pressure hoaxes, and emergency protocols.'
  ),
  (
    'Vaccines & Immunity',
    'vaccines',
    'Vaccine safety surveillance, immunization evidence, herd immunity thresholds, and infectious disease defense.'
  ),
  (
    'Fitness & Metabolism',
    'fitness',
    'Exercise physiology, resistance training, metabolic spot reduction myths, and post-workout recovery science.'
  ),
  (
    'Mental Health & Sleep',
    'mental-health',
    'Sleep architecture, chronobiology, circadian hormones, adaptogens, and evidence-based mental wellness.'
  ),
  (
    'Infectious Diseases',
    'infectious',
    'Microbiological hygiene, viral transmission, antimicrobial resistance, and antibiotic stewardship.'
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
