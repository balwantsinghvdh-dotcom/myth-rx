-- =============================================================================
-- MYTH RX: BUSTING HEALTH HOAXES
-- Comprehensive Seed Data: Categories, 20 Clinical Investigations & Sources
-- Phase 3 & 4: Live PostgreSQL Database Seeding
-- =============================================================================

SET search_path = public, pg_temp;

-- 1. Standardized Health Misinformation Categories (9 Domains)
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

-- 2. Seed 20 Fact-Checked Clinical Investigations

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'ginger-kidney-stones',
  'Why Boiled Ginger Water Does Not Melt Kidney Stones',
  'Drinking high-concentration boiled ginger water on an empty stomach dissolves kidney stones completely in 48 hours without surgery.',
  'Kidney stones are calcified crystalline mineral deposits that cannot be dissolved by ingested ginger metabolites. Relying on this myth risks severe ureteral obstruction and renal damage.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'whatsapp' LIMIT 1),
  '{"claimOrigin":"Viral WhatsApp forward & short-form video audio circulating in family groups.","conclusion":"Ginger contains mild antioxidant compounds, but ingested fluids pass through the digestive system and cannot act as a chemical solvent inside the urinary tract.","detailedExplanation":["Nephrolithiasis (kidney stones) develops when urinary minerals—most commonly calcium oxalate, calcium phosphate, or uric acid—supersaturate and aggregate into hard crystalline stones in renal tubules and calyces.","When an individual drinks boiled ginger tea, the fluid and active gingerols are broken down by gastric acid in the stomach, absorbed across enterocytes in the small intestine, and metabolized by liver enzymes into minor conjugated metabolites.","At no point does concentrated ginger liquid enter the renal pelvis or contact stones in a solvent state. Delaying proper clinical evaluation while attempting home solvent recipes frequently results in acute obstruction, hydronephrosis, and preventable renal damage."],"scientificEvidence":["American Urological Association (AUA) clinical guidelines establish that stone passage depends entirely on stone diameter, anatomic location, and smooth-muscle relaxation—not herbal melting.","A systematic review of botanical extracts in the Cochrane Database confirms zero randomized controlled human trials showing reduction of established stone mass from ginger tea.","Small laboratory animal models demonstrate mild renal antioxidant protection against chemical toxins, which is fundamentally distinct from dissolving solid mineral stones in humans."],"risksAndLimitations":["Acute Ureteral Obstruction: Stones larger than 5 mm can lodge in the ureter, blocking urine outflow.","Hydronephrosis & Sepsis: Obstructed kidneys can suffer irreversible functional decline and life-threatening urosepsis within days if untreated.","Delay of Proven Interventions: Delaying consultation prevents time-sensitive medical expulsive therapy or minimally invasive lithotripsy."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for ginger-kidney-stones
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'ginger-kidney-stones');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'ginger-kidney-stones'), 'Medical Management of Kidney Stones: AUA Guideline', 'American Urological Association Guidelines, updated 2024.', 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-medical-management-guideline'),
  ((SELECT id FROM public.investigations WHERE slug = 'ginger-kidney-stones'), 'Water and fluid intake for preventing the recurrence of urinary calculi', 'Cochrane Database of Systematic Reviews, CD003504.', 'https://www.cochranelibrary.com'),
  ((SELECT id FROM public.investigations WHERE slug = 'ginger-kidney-stones'), 'Evaluation of renoprotective and antioxidant properties of Zingiber officinale', 'Journal of Ethnopharmacology, PMC4518290.', 'https://pubmed.ncbi.nlm.nih.gov');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'alkaline-water-ph',
  'Can Alkaline Water Actually Alter Human Blood pH Levels?',
  'Drinking alkaline water (pH 8.5+) neutralizes body acidity, alters blood pH, and cures chronic acid-based diseases.',
  'Stomach hydrochloric acid neutralizes alkaline water on contact. Human arterial blood pH is tightly regulated within 7.35 to 7.45 by renal and respiratory homeostatic mechanisms.',
  'misleading',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'diet' LIMIT 1),
  '{"claimOrigin":"Commercial bottled water advertisements and wellness influencer social posts.","conclusion":"Drinking water is beneficial for hydration, but alkaline water cannot alter systemic blood pH or cure disease through body de-acidification.","detailedExplanation":["Promoters of alkaline water assert that metabolic waste creates a dangerous state of \"acidosis\" that can be reversed by drinking high-pH water.","In reality, the stomach produces concentrated hydrochloric acid (pH 1.5 to 3.5). Any alkaline fluid ingested is instantly neutralized upon entering the gastric chamber before reaching systemic circulation.","Furthermore, human blood pH is among the most rigorously defended physiological variables in biology. Arterial pH remains between 7.35 and 7.45 through the bicarbonate buffer system, pulmonary carbon dioxide exhalation, and renal acid-base filtration."],"scientificEvidence":["Clinical reviews indexed in PubMed consistently confirm that oral alkaline beverages produce no clinically significant change in systemic arterial blood pH in healthy adults.","Urine pH may temporarily fluctuate as kidneys excrete excess bicarbonate ions, but urinary pH reflects excretion rather than blood acidity.","Systemic acidosis is a severe medical condition caused by diabetic ketoacidosis, lactic acidosis, or renal failure—none of which are treatable with alkaline drinking water."],"risksAndLimitations":["False Reassurance: Patients may avoid evidence-based management for metabolic or digestive disorders.","Digestive Impairment: Excessive consumption of highly alkaline additives can temporarily reduce stomach acid, impairing digestive protein breakdown and pathogen defense.","Financial Exploitation: Bottled alkaline water and specialized ionizers cost orders of magnitude more than clean municipal tap water without clinical benefit."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for alkaline-water-ph
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'alkaline-water-ph');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'alkaline-water-ph'), 'Systematic review of the association between dietary acid load, alkaline water and cancer', 'BMJ Open, 6(6):e010438.', 'https://bmjopen.bmj.com'),
  ((SELECT id FROM public.investigations WHERE slug = 'alkaline-water-ph'), 'Acid-Base Homeostasis and Regulation of Arterial pH', 'Harrison’s Principles of Internal Medicine, 21st Edition.', 'https://accessmedicine.mhmedical.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'turmeric-diabetes-insulin',
  'Curcumin Supplements vs. Prescription Insulin in Type 2 Diabetes',
  'High-dose turmeric and curcumin supplements are a natural cure that completely replaces prescription insulin and metformin.',
  'While curcumin exhibits mild anti-inflammatory properties in laboratory cell cultures, no clinical human trials support discontinuing prescription glycemic control agents.',
  'unverified',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '{"claimOrigin":"Sponsored natural remedy blogs and shared social media graphics.","conclusion":"Abruptly substituting unproven dietary supplements for prescription antidiabetic medications creates severe hyperosmolar and ketoacidotic risks.","detailedExplanation":["Curcumin is a polyphenol extracted from turmeric root (Curcuma longa). It has been studied extensively in laboratory dishes and rodent models for its anti-inflammatory and antioxidant biochemical actions.","However, curcumin has notoriously poor oral bioavailability—it is rapidly conjugated and cleared from the body with minimal systemic tissue absorption.","Crucially, no clinical trial has ever demonstrated that curcumin can stimulate physiological pancreatic beta-cell insulin secretion sufficiently to control human diabetes, let alone replace exogenous insulin in insulin-dependent patients."],"scientificEvidence":["American Diabetes Association (ADA) Standards of Care review herbal supplements annually and find insufficient clinical evidence to recommend curcumin for glycemic control.","Small exploratory human trials show modest improvements in fasting blood glucose when used as an adjunct to diet, but never as a monotherapy or medication replacement.","Cellular in-vitro effects observed at high concentrations in test tubes cannot be directly translated into clinical dosing in patients."],"risksAndLimitations":["Hyperglycemic Hyperosmolar State (HHS): Abruptly stopping prescribed medications leads to dangerous blood glucose elevation.","Diabetic Ketoacidosis (DKA): Discontinuing required insulin can cause acute life-threatening metabolic acidosis.","Supplement Contamination & Drug Interactions: Concentrated curcumin can interact with anticoagulants and antiplatelet drugs."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for turmeric-diabetes-insulin
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'turmeric-diabetes-insulin');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'turmeric-diabetes-insulin'), 'Standards of Care in Diabetes: Lifestyle and Pharmacologic Approaches', 'Diabetes Care, American Diabetes Association, 2024.', 'https://diabetesjournals.org/care'),
  ((SELECT id FROM public.investigations WHERE slug = 'turmeric-diabetes-insulin'), 'Curcumin: A Review of Its Effects on Human Health', 'Foods, 6(10):92, PMC5664031.', 'https://pubmed.ncbi.nlm.nih.gov');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'lemon-water-cancer',
  'The Viral "Hot Lemon Water Destroys Cancer Cells" Chain Hoax',
  'Drinking hot lemon water is 10,000 times stronger than chemotherapy and kills cancer cells without harming healthy cells.',
  'A fabricated claim falsely attributed to reputable cancer research institutes. No human clinical trials demonstrate that hot lemon water destroys malignant tumors.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'cancer' LIMIT 1),
  '{"claimOrigin":"Decades-old viral chain email resurfacing continuously on WhatsApp and Facebook.","conclusion":"Lemons are a healthy source of dietary vitamin C, but cannot treat, eradicate, or cure malignant neoplasms.","detailedExplanation":["This hoax has circulated online since at least 2011, frequently claiming that citrus fruit extracts are thousands of times more potent than conventional chemotherapeutic agents like Adriamycin.","While citrus peel contains phytochemicals such as limonene and flavonoids that have been studied in petri dishes for cellular proliferation inhibition, laboratory cell responses do not equal clinical human oncology treatments.","Malignant tumors are complex cellular ecosystems characterized by genomic instability and immune evasion. Ingesting citrus fruit or hot water provides no therapeutic dosing to eradicate solid or hematologic tumors."],"scientificEvidence":["National Cancer Institute (NCI) and Memorial Sloan Kettering Cancer Center have issued clear public statements repudiating the claim that lemon juice acts as a chemotherapy substitute.","Systematic reviews in clinical oncology find zero evidence that lemon water alters tumor staging or improves cancer survival rates.","Delaying validated curative therapies (such as surgical resection, radiotherapy, or targeted immunotherapy) in early-stage cancers drastically diminishes 5-year survival rates."],"risksAndLimitations":["Curable Stage Progression: Patients who substitute herbal drinks for medical oncology risk progressing from localized, curable disease to metastatic, incurable stages.","Dental Enamel Erosion: Frequent consumption of concentrated hot lemon water causes permanent acid demineralization of dental enamel."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for lemon-water-cancer
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'lemon-water-cancer');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'lemon-water-cancer'), 'Cancer Misinformation on Social Media: A Threat to Public Health', 'Journal of the National Cancer Institute, 113(8):957–960.', 'https://academic.oup.com/jnci'),
  ((SELECT id FROM public.investigations WHERE slug = 'lemon-water-cancer'), 'Citrus Phytochemicals and Cancer Research: Evidence vs Myth', 'Memorial Sloan Kettering Cancer Center Integrative Medicine Database.', 'https://www.mskcc.org');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'raw-milk-pathogens',
  'Raw Milk Trends and Zoonotic Bacterial Infection Hazards',
  'Drinking unpasteurized raw milk significantly increases the risk of severe bacterial foodborne illness compared to pasteurized milk.',
  'Epidemiological surveillance and clinical microbiology confirm that pasteurization eliminates dangerous bacterial pathogens without destroying vital milk nutrition.',
  'supported',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'diet' LIMIT 1),
  '{"claimOrigin":"Public health advisories responding to viral raw dairy social media trends.","conclusion":"Clinical and epidemiological evidence strongly supports the public health consensus that unpasteurized raw milk carries substantial zoonotic infection risks.","detailedExplanation":["Social media influencers have recently promoted unpasteurized \"raw\" dairy, claiming that pasteurization destroys enzymes and beneficial antibodies.","However, historical public health data and contemporary disease surveillance demonstrate that raw milk is a primary transmission vector for dangerous bacterial pathogens, including Campylobacter jejuni, Salmonella enterica, Escherichia coli O157:H7, and Listeria monocytogenes.","Pasteurization—heating milk to 161°F (71.7°C) for 15 seconds—was introduced to prevent devastating outbreaks of bovine tuberculosis, diphtheria, and typhoid fever. Modern nutritional analysis proves that pasteurization causes negligible change in protein quality, calcium bioavailability, or primary vitamins."],"scientificEvidence":["Centers for Disease Control and Prevention (CDC) outbreak data demonstrates that unpasteurized dairy is responsible for 840 times more illnesses and 45 times more hospitalizations than pasteurized dairy.","Food and Drug Administration (FDA) microbiological surveys show consistent contamination rates in raw milk bulk tanks despite sanitized agricultural milking equipment.","Listeria monocytogenes in raw dairy poses an exceptionally high fatality rate (up to 20–30%) in pregnant women, neonates, and immunocompromised patients."],"risksAndLimitations":["Hemolytic Uremic Syndrome (HUS): Shiga toxin-producing E. coli from raw dairy can cause acute kidney failure, particularly in children under 5.","Pregnancy Loss: Listeriosis contracted from raw milk can trigger spontaneous miscarriage, premature labor, and neonatal sepsis."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for raw-milk-pathogens
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'raw-milk-pathogens');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'raw-milk-pathogens'), 'Outbreak-Related Foodborne Illnesses Associated with Unpasteurized Milk', 'Emerging Infectious Diseases, CDC, 23(3):484–488.', 'https://wwwnc.cdc.gov/eid'),
  ((SELECT id FROM public.investigations WHERE slug = 'raw-milk-pathogens'), 'The Myth of Raw Milk: Science-Based Food Safety', 'U.S. Food and Drug Administration (FDA) Guidance Document.', 'https://www.fda.gov');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'breath-holding-fibrosis',
  'The 10-Second Breath-Holding Pulmonary Self-Test Hoax',
  'Holding your breath for 10 seconds without coughing or tightness proves you have healthy lungs and no pulmonary fibrosis.',
  'Breath-holding capacity depends on chest mechanics, oxygen saturation, and psychological tolerance. It cannot detect or rule out pulmonary fibrosis, lung lesions, or respiratory infections.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'whatsapp' LIMIT 1),
  '{"claimOrigin":"Viral chain message falsely attributed to Stanford University and hospital boards.","conclusion":"Clinical spirometry, diffusing capacity tests (DLCO), and high-resolution computed tomography (HRCT) are the only validated diagnostics for pulmonary fibrosis.","detailedExplanation":["This viral chain forward circulated internationally, instructing readers to hold their breath for more than 10 seconds every morning. If successful without discomfort, the message claimed their lungs were free from fibrosis and infection.","Pulmonology consensus confirms that breath-holding capability is influenced primarily by arterial partial pressure of carbon dioxide (PaCO2), diaphragmatic muscle training, and central nervous system chemoreceptors.","Patients with early-stage pulmonary fibrosis or atypical viral pneumonias can easily hold their breath for 10 seconds while still experiencing significant subclinical alveolar damage."],"scientificEvidence":["World Health Organization (WHO) and American Thoracic Society (ATS) specifically debunked this viral test, noting it creates dangerous false reassurance.","Pulmonary fibrosis diagnosis requires formal pulmonary function testing (PFT), arterial blood gas measurement, and chest imaging.","Patients experiencing breathlessness, persistent cough, or low pulse oximetry readings should never rely on informal breath-holding as a clearance test."],"risksAndLimitations":["False Negative Reassurance: Individuals with active respiratory distress may delay medical evaluation because they successfully held their breath.","Chest Strain: Forced breath-holding in patients with underlying cardiac arrhythmia can induce vasovagal syncope or transient blood pressure spikes."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for breath-holding-fibrosis
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'breath-holding-fibrosis');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'breath-holding-fibrosis'), 'Diagnosis and Management of Idiopathic Pulmonary Fibrosis: ATS/ERS/JRS/ALAT Clinical Practice Guideline', 'American Journal of Respiratory and Critical Care Medicine, 205(9):e18–e47.', 'https://www.atsjournals.org'),
  ((SELECT id FROM public.investigations WHERE slug = 'breath-holding-fibrosis'), 'WHO Clarification on Social Media Coronavirus and Pulmonary Self-Checks', 'World Health Organization Mythbusters Archive.', 'https://www.who.int');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'vitamin-c-cold-prevention',
  'Do Megadoses of Vitamin C Prevent Catching the Common Cold?',
  'Taking 2,000 mg to 5,000 mg of Vitamin C daily prevents you from catching viral upper respiratory infections.',
  'Extensive randomized trials show that daily Vitamin C supplementation does not reduce the incidence of colds in the general population, though it may modestly shorten symptom duration by roughly 8%.',
  'misleading',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '{"claimOrigin":"Historical claims popularized in wellness literature and dietary supplement marketing.","conclusion":"Vitamin C is an essential nutrient for immune function, but megadoses do not act as an impervious shield against viral respiratory transmission.","detailedExplanation":["The theory that large doses of ascorbic acid (Vitamin C) prevent colds was championed in the 1970s. Since then, decades of clinical research have tested this hypothesis in tens of thousands of human participants.","Cochrane systematic reviews analyzing over 29 placebo-controlled trials involving more than 11,000 individuals concluded that regular Vitamin C supplementation does not reduce the frequency of colds in the general community.","However, regular supplementation was found to produce a minor reduction in cold duration (about 8% in adults and 14% in children), meaning a 7-day cold might resolve roughly half a day sooner."],"scientificEvidence":["Cochrane Database of Systematic Reviews: \"Vitamin C for preventing and treating the common cold\" (2013, confirmed in updates).","Renal threshold studies indicate that oral intake above 400 mg daily results in near-complete urinary excretion of unabsorbed ascorbic acid in healthy adults.","Extreme physical stress cohorts (e.g. marathon runners in sub-arctic conditions) showed a 50% incidence reduction, but this benefit does not extrapolate to ordinary non-athlete populations."],"risksAndLimitations":["Gastrointestinal Upset: Doses exceeding the 2,000 mg tolerable upper intake level (UL) frequently cause osmotic diarrhea, nausea, and abdominal cramping.","Kidney Stone Risk: Ascorbic acid is metabolized to oxalate; chronic megadoses significantly elevate calcium oxalate nephrolithiasis risk in susceptible individuals."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for vitamin-c-cold-prevention
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'vitamin-c-cold-prevention');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'vitamin-c-cold-prevention'), 'Vitamin C for preventing and treating the common cold', 'Cochrane Database of Systematic Reviews, Issue 1. Art. No.: CD000980.', 'https://www.cochranelibrary.com'),
  ((SELECT id FROM public.investigations WHERE slug = 'vitamin-c-cold-prevention'), 'Nutrient Summary: Vitamin C', 'Linus Pauling Institute Micronutrient Information Center, Oregon State University.', 'https://lpi.oregonstate.edu');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'aspirin-first-aid-stroke',
  'Why You Should Never Automatically Give Aspirin for a Suspected Stroke',
  'If someone displays symptoms of a stroke, immediately give them two aspirins to dissolve the blood clot before the ambulance arrives.',
  'While aspirin is beneficial for acute heart attacks, strokes can be ischemic (clot) or hemorrhagic (bleed). Administering aspirin during a brain hemorrhage can cause fatal intracranial bleeding.',
  'misleading',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'cardiology' LIMIT 1),
  '{"claimOrigin":"Viral first-aid advice shared across WhatsApp groups and Facebook posts.","conclusion":"Never administer aspirin for suspected stroke. Call emergency medical services immediately so a hospital CT scan can differentiate between ischemic and hemorrhagic stroke.","detailedExplanation":["First-aid messages frequently confuse acute myocardial infarction (heart attack) protocols with acute cerebrovascular accident (stroke) protocols.","In a heart attack, chewing an aspirin inhibits platelet aggregation in the coronary arteries. However, approximately 13–15% of acute strokes are hemorrhagic—caused by a ruptured blood vessel bleeding directly into brain tissue.","Giving aspirin—an irreversible antiplatelet medication—to a patient experiencing a hemorrhagic stroke will impair clotting, drastically accelerate intracranial bleeding, and dramatically increase mortality."],"scientificEvidence":["American Heart Association / American Stroke Association (AHA/ASA) Guidelines explicitly mandate non-contrast head CT imaging prior to initiating any antiplatelet or thrombolytic therapy.","Emergency medicine protocols state that non-medical bystanders must never administer oral medications to suspected stroke patients due to acute dysphagia (swallowing impairment) and aspiration pneumonia risks."],"risksAndLimitations":["Fatal Intracranial Hemorrhage: Administering antiplatelet therapy during an active brain bleed accelerates fatal herniation.","Choking & Aspiration: Stroke frequently impairs the swallowing reflex; oral tablets can block the airway or enter the lungs.","Delaying 911 / EMS: Searching for aspirin wastes precious minutes where emergency clot-busting tPA or thrombectomy could be mobilized."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for aspirin-first-aid-stroke
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'aspirin-first-aid-stroke');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'aspirin-first-aid-stroke'), 'Guidelines for the Early Management of Patients With Acute Ischemic Stroke', 'Stroke, American Heart Association / American Stroke Association, 50(12):e344–e418.', 'https://www.ahajournals.org/journal/str'),
  ((SELECT id FROM public.investigations WHERE slug = 'aspirin-first-aid-stroke'), 'Stroke First Aid Protocols: What Bystanders Should and Should Not Do', 'Mayo Clinic Stroke Care Resources.', 'https://www.mayoclinic.org');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'daily-walking-cardiovascular-health',
  'Can Walking 8,000 to 10,000 Steps Daily Significantly Reduce Cardiovascular Mortality?',
  'Walking 8,000 to 10,000 steps daily significantly reduces the risk of heart disease, stroke, and all-cause mortality compared to sedentary lifestyles.',
  'Large-scale prospective cohort studies and meta-analyses definitively prove that achieving 8,000–10,000 steps per day provides substantial, progressive reductions in cardiovascular events and all-cause mortality.',
  'supported',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'cardiology' LIMIT 1),
  '{"claimOrigin":"Preventive cardiology consensus guidelines and wearable fitness tracking health discussions.","conclusion":"Clinical and epidemiological evidence strongly supports the cardiovascular benefits of daily moderate physical activity.","detailedExplanation":["Physical inactivity is recognized by the World Health Organization as a major independent modifiable risk factor for global cardiovascular mortality.","Recent prospective cohort data tracking over 78,000 individuals using accelerometers demonstrated that stepping up from 4,000 to approximately 9,000–10,000 steps daily yielded an approximately 50% lower risk of cardiovascular mortality.","The physiological mechanisms include enhanced endothelial nitric oxide synthase expression, reduced systemic arterial stiffness, improved insulin sensitivity in skeletal muscle, and lower resting systolic blood pressure."],"scientificEvidence":["Lancet Public Health meta-analysis of 15 international studies (n=47,471) confirming steep mortality reductions up to 8,000–10,000 steps/day in adults under 60 and 6,000–8,000 in adults 60+.","JAMA Internal Medicine cohort analysis demonstrating step intensity and daily total step accumulation independently lower cardiovascular disease incidence.","American Heart Association Scientific Statement on physical activity and cardiometabolic health."],"risksAndLimitations":["Patients with advanced heart failure or unstable angina should consult their cardiologist for tailored exercise prescriptions.","Stepping volume should be accumulated gradually in previously sedentary individuals to prevent musculoskeletal overuse injuries."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for daily-walking-cardiovascular-health
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'daily-walking-cardiovascular-health');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'daily-walking-cardiovascular-health'), 'Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts', 'The Lancet Public Health, 7(3):e219–e228.', 'https://www.thelancet.com/journals/lanpub'),
  ((SELECT id FROM public.investigations WHERE slug = 'daily-walking-cardiovascular-health'), 'Prospective associations of daily step counts with cardiovascular disease', 'JAMA Internal Medicine, 182(11):1139–1148.', 'https://jamanetwork.com/journals/jamainternalmedicine');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'hpv-vaccine-cervical-cancer',
  'Does the Human Papillomavirus (HPV) Vaccine Actually Prevent Cervical Cancer?',
  'Routine HPV vaccination before initial exposure prevents more than 88% to 90% of cervical and anogenital cancer cases.',
  'Long-term national registry data and clinical trials establish that recombinant HPV vaccines prevent high-grade cervical intraepithelial neoplasia (CIN3) and invasive cervical carcinomas.',
  'supported',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'cancer' LIMIT 1),
  '{"claimOrigin":"International oncology surveillance data and pediatric immunization public health advisories.","conclusion":"Rigorous epidemiological evidence confirms that HPV immunization dramatically reduces cervical cancer incidence.","detailedExplanation":["Human papillomavirus types 16 and 18 are high-risk oncogenic strains responsible for approximately 70% of invasive cervical cancers worldwide, while types 31, 33, 45, 52, and 58 account for an additional 20%.","The vaccine consists of recombinant virus-like particles (VLPs) of the L1 capsid protein. It contains no viral DNA and cannot cause HPV infection or cancer.","When administered prior to viral exposure, the vaccine generates high titers of neutralizing antibodies that block viral cellular entry and subsequent oncogenic integration into cervical epithelial host genomes."],"scientificEvidence":["New England Journal of Medicine (NEJM) Swedish registry study tracking over 1.67 million females showed an 88% lower risk of invasive cervical cancer among women vaccinated before age 17.","Cochrane Database of Systematic Reviews confirmed near-complete protection against precancerous lesions in girls and women without prior HPV exposure.","CDC continuous surveillance shows an 88% reduction in vaccine-strain HPV infections among teen girls and an 81% decline in young women."],"risksAndLimitations":["The vaccine does not clear existing, established pre-vaccination HPV infections or treat active cervical dysplasia.","Vaccinated individuals must still participate in routine age-appropriate cervical cancer screening (Pap and HPV co-testing)."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for hpv-vaccine-cervical-cancer
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'hpv-vaccine-cervical-cancer');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'hpv-vaccine-cervical-cancer'), 'HPV Vaccination and the Risk of Invasive Cervical Cancer', 'New England Journal of Medicine, 383:1340–1348.', 'https://www.nejm.org/doi/full/10.1056/NEJMoa1917338'),
  ((SELECT id FROM public.investigations WHERE slug = 'hpv-vaccine-cervical-cancer'), 'Prophylactic vaccination against human papillomaviruses to prevent cervical cancer and its precursors', 'Cochrane Database of Systematic Reviews, CD009069.', 'https://www.cochranelibrary.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'toothpaste-butter-burns',
  'Why You Must Never Put Toothpaste, Butter, or Flour on Thermal Burns',
  'Applying cold toothpaste, butter, or raw flour immediately to severe burns soothes pain, prevents blisters, and heals skin without scars.',
  'Applying butter, toothpaste, or flour traps residual heat inside dermis tissue, introduces bacterial contamination, and complicates surgical debridement.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'whatsapp' LIMIT 1),
  '{"claimOrigin":"Generational domestic home remedies circulating on Facebook, WhatsApp, and family kitchen lore.","conclusion":"Evidence-based burn first aid requires immediate cooling under running clean tap water (10–20°C) for 20 minutes—never pantry products.","detailedExplanation":["Thermal burns damage cutaneous epithelial layers through thermal energy transfer. The primary first-aid objective is halting deep tissue heat dissipation and dermal ischemia.","Butter, oils, and grease are thermal insulators; applying them acts as an occlusive blanket that traps residual heat within the dermal microvasculature, extending partial-thickness burns into full-thickness necrosis.","Toothpaste contains abrasives (calcium carbonate, silica), flavoring agents (menthol), and detergents (sodium lauryl sulfate) that induce chemical irritation and severe tissue inflammation in denuded skin."],"scientificEvidence":["International Society for Burn Injuries (ISBI) Practice Guidelines explicitly mandate 20 minutes of cool running water and forbid any unsterile topical pantry substances.","Emergency department observational studies show higher rates of secondary wound infection, delayed re-epithelialization, and traumatic mechanical debridement when butter or flour must be washed out of open burns."],"risksAndLimitations":["Deep Tissue Necrosis: Heat trapped by fatty layers converts superficial burns into deep full-thickness injuries.","Severe Infection: Raw flour and butter harbor bacterial spores and pathogens that thrive in warm necrotic burn eschar."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for toothpaste-butter-burns
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'toothpaste-butter-burns');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'toothpaste-butter-burns'), 'ISBI Practice Guidelines for Burn Care', 'Burns, International Society for Burn Injuries, 42(5):953–1021.', 'https://www.sciencedirect.com/journal/burns'),
  ((SELECT id FROM public.investigations WHERE slug = 'toothpaste-butter-burns'), 'First aid for burn injuries: a systematic review and clinical consensus', 'Emergency Medicine Australasia, 31(5):710–717.', 'https://onlinelibrary.wiley.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'cold-water-immersion-recovery',
  'Ice Baths and Cold Plunges: Do They Accelerate Muscle Growth and Tissue Repair?',
  'Taking 3-to-5-minute ice baths immediately after weight lifting accelerates muscle hypertrophy and repairs microtears twice as fast.',
  'While cold water immersion reduces acute muscle soreness and perception of fatigue, randomized trials show post-workout ice baths blunt long-term muscle hypertrophy and strength gains by suppressing inflammatory anabolic signaling.',
  'unverified',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'supplements' LIMIT 1),
  '{"claimOrigin":"Fitness podcasts, biohacking influencers, and viral social media gym videos.","conclusion":"Cold plunges may aid tournament recovery between close athletic events, but chronic post-lifting cold immersion actually impairs long-term muscle building.","detailedExplanation":["Cold water immersion (CWI)—typically 10–15 minutes at 10–15°C—triggers intense cutaneous vasoconstriction, decreases core temperature, and temporarily numbs peripheral nerve conduction.","While this reduces subjective delayed onset muscle soreness (DOMS) within 24–48 hours, exercise-induced muscular hypertrophy fundamentally relies on controlled inflammatory cascades and ribosome biogenesis.","Post-exercise cold immersion suppresses intracellular anabolic signaling pathways—specifically the p70S6 kinase and mTORC1 pathways—and diminishes muscle protein synthesis for hours post-exercise."],"scientificEvidence":["Journal of Physiology human trials demonstrated that regular post-exercise cold water immersion blunted muscle mass and strength gains over a 12-week resistance training program compared to active recovery.","Systematic review in Sports Medicine concluded that acute CWI benefits competition turnarounds (e.g., multi-match tournaments) but blunts long-term muscular adaptations."],"risksAndLimitations":["Blunted Hypertrophy: Strength athletes seeking muscle growth may experience significantly diminished gains.","Cardiovascular Shock: Sudden cold immersion in unacclimated individuals can trigger the cold shock response, profound tachycardia, and cardiac arrhythmias."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for cold-water-immersion-recovery
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'cold-water-immersion-recovery');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'cold-water-immersion-recovery'), 'Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training', 'The Journal of Physiology, 593(18):4285–4301.', 'https://physoc.onlinelibrary.wiley.com/doi/10.1113/JP270570'),
  ((SELECT id FROM public.investigations WHERE slug = 'cold-water-immersion-recovery'), 'Cold-water immersion (cryotherapy) for preventing and treating muscle soreness after exercise', 'Cochrane Database of Systematic Reviews, CD008262.', 'https://www.cochranelibrary.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'resistance-training-bone-density',
  'Can Progressive Resistance Training Reverse Bone Density Loss in Osteopenia?',
  'High-intensity progressive resistance exercise and impact loading stimulate osteoblast bone formation and reverse osteopenia and osteoporosis.',
  'Landmark randomized controlled trials prove high-intensity resistance and weight-bearing impact training safely stimulate osteogenesis, significantly increasing lumbar spine and femoral neck bone mineral density in older adults with osteopenia and osteoporosis.',
  'supported',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'fitness' LIMIT 1),
  '{"claimOrigin":"Geriatric sports medicine reviews and clinical bone health guidelines.","conclusion":"Clinical evidence decisively confirms that progressive resistance training reverses bone loss, improves structural bone geometry, and dramatically reduces fall-related fracture risk.","detailedExplanation":["Bone is dynamic living tissue that adapts to mechanical strain according to Wolff’s law and Frost’s mechanostat model.","When mechanical strain from muscular contractions and ground reaction forces exceeds customary physiological thresholds (typically >1,500 microstrain), osteocytes trigger prostaglandins and nitric oxide signaling, upregulating osteoblast activity over osteoclast resorption.","In the landmark LIFTMOR trial, post-menopausal women performing supervised high-intensity resistance exercises (deadlifts, overhead presses, squats at >80–85% of 1RM) combined with jumping impact significantly improved bone mineral density and functional performance without adverse vertebral fractures."],"scientificEvidence":["LIFTMOR Randomized Controlled Trial (Watson et al., Journal of Bone and Mineral Research, 2018): High-intensity resistance training increased lumbar spine BMD by +3.0% vs. -1.2% in control group (p < 0.001).","Systematic review and meta-analysis in Osteoporosis International (2022) confirming resistance exercise preserves femoral neck trabecular microarchitecture in aging populations.","Endocrine Society and National Osteoporosis Foundation clinical practice guidelines."],"risksAndLimitations":["Individuals with severe pre-existing vertebral compression fractures require tailored physical therapy supervision to avoid unaccustomed spinal flexion.","Progression must be gradual and supervised by certified exercise physiologists to ensure pristine spinal alignment and mechanics."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for resistance-training-bone-density
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'resistance-training-bone-density');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'resistance-training-bone-density'), 'High-Intensity Resistance and Impact Training Improves Bone Mineral Density: The LIFTMOR Trial', 'Journal of Bone and Mineral Research, 33(2):211–220.', 'https://asbmr.onlinelibrary.wiley.com/doi/10.1002/jbmr.3284'),
  ((SELECT id FROM public.investigations WHERE slug = 'resistance-training-bone-density'), 'Exercise and physical activity for osteoporosis: a consensus statement', 'British Journal of Sports Medicine, 56(15):837–846.', 'https://bjsm.bmj.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'soap-water-viral-disruption',
  'How Plain Soap and Running Water Physically Destroy Viral Pathogens',
  'Washing hands thoroughly with plain soap and running water for 20 seconds is clinically more effective at destroying enveloped respiratory viruses and clearing non-enveloped enteric pathogens than alcohol gels.',
  'Soap molecules are amphiphilic; their hydrophobic tails insert into the lipid bilayer envelopes of respiratory viruses (coronaviruses, influenza) and physically rip them apart, while mechanical lathering and running water rinse away alcohol-resistant pathogens like Norovirus.',
  'supported',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'infectious' LIMIT 1),
  '{"claimOrigin":"Infectious disease epidemiology and clinical hygiene surveillance.","conclusion":"Clinical microbiology confirms that proper handwashing with plain soap and running water is a primary, evidence-backed defense against infectious viral transmission.","detailedExplanation":["Enveloped viruses—including SARS-CoV-2, influenza, and respiratory syncytial virus (RSV)—are enclosed within a delicate bilayer of lipid fats and hydrophobic glycoproteins.","Soap molecules possess a pin-like amphiphilic molecular structure: a hydrophilic (water-attracting) head and a lipophilic/hydrophobic (fat-attracting) hydrocarbon tail.","When lathered with water, the hydrophobic tails wedge themselves into the virus’s protective lipid membrane, acting like molecular crowbars that pry apart the bilayer envelope and dissolve it into soluble micelles, permanently inactivating the viral core."],"scientificEvidence":["Centers for Disease Control and Prevention (CDC) Hand Hygiene Guidelines: Washing with soap mechanically lifts and removes pathogens while dissolving enveloped lipid membranes.","Comparative microbiological studies demonstrate that non-enveloped viruses (e.g., Norovirus) and spore-forming bacteria (Clostridioides difficile) are inherently resistant to alcohol sanitizers but are physically removed by 20 seconds of soap lathering and running water.","World Health Organization (WHO) Guidelines on Hand Hygiene in Health Care."],"risksAndLimitations":["Rushing the wash in under 10 seconds fails to allow sufficient contact time for lipid envelope dissolution and physical soil detachment.","Washing with overly harsh industrial detergents can cause dermal xerosis (dryness) and microfissures; gentle plain unscented soap is clinically optimal."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for soap-water-viral-disruption
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'soap-water-viral-disruption');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'soap-water-viral-disruption'), 'Show Me the Science: How Soap and Water Removes Pathogens', 'Centers for Disease Control and Prevention (CDC) Technical Brief, 2024.', 'https://www.cdc.gov/handwashing/show-me-the-science.html'),
  ((SELECT id FROM public.investigations WHERE slug = 'soap-water-viral-disruption'), 'The Chemical Architecture of Hand Hygiene: Mechanisms of Lipid Inactivation', 'Clinical Microbiology Reviews, 32(3):e00098-18.', 'https://journals.asm.org/journal/cmr');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'mmr-vaccine-autism-hoax',
  'The Debunked MMR Vaccine and Autism Myth: A Comprehensive Evidence Review',
  'The routine childhood Measles, Mumps, and Rubella (MMR) vaccine causes gastrointestinal inflammation that leads to autism spectrum disorder.',
  'Originating from a fraudulent, fully retracted 1998 case study of only 12 children, rigorous global epidemiological investigations tracking over 1.25 million children have definitively proven zero causal or correlative link between MMR vaccination and autism.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'vaccines' LIMIT 1),
  '{"claimOrigin":"Retracted 1998 case series and recurring anti-vaccine social media campaigns.","conclusion":"Extensive global medical consensus and decades of clinical surveillance prove the MMR vaccine is exceptionally safe and does not cause autism.","detailedExplanation":["In 1998, Andrew Wakefield and colleagues published a speculative 12-patient case series in The Lancet claiming a novel \"autistic enterocolitis\" linked to the MMR vaccine.","Subsequent investigative journalism and formal British General Medical Council (GMC) inquiries proved that patient medical records were falsified, ethical review protocols were breached, and the author had undisclosed financial conflicts of interest with personal patent applications.","The Lancet fully retracted the paper in 2010. Since then, multiple massive prospective and retrospective cohort studies in Denmark, the United States, Japan, and the United Kingdom have tracked millions of children, demonstrating identical autism rates among vaccinated and unvaccinated cohorts."],"scientificEvidence":["Danish Nationwide Cohort Study (Hviid et al., Annals of Internal Medicine, 2019): Tracking 657,461 children over a decade found an adjusted Hazard Ratio of 0.93 (95% CI, 0.85–1.02) comparing vaccinated to unvaccinated children, confirming no increased autism risk even in high-risk familial subgroups.","Cochrane Database Systematic Review (Demicheli et al., 2020) analyzing 138 studies and over 23 million participants concluded MMR vaccination carries no association with autism spectrum disorders.","Institute of Medicine (IOM) Adverse Effects of Vaccines Review evaluating 1,000+ scientific peer-reviewed publications."],"risksAndLimitations":["Vaccine Refusal Outbreaks: Dropping below the 95% population herd immunity threshold has caused severe resurgences of measles, leading to encephalitis, subacute sclerosing panencephalitis (SSPE), and preventable pediatric deaths.","Common Mild Side Effects: Temporary localized arm soreness or low-grade fever occurring 7–12 days post-vaccine is normal immune activation."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for mmr-vaccine-autism-hoax
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'mmr-vaccine-autism-hoax');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'mmr-vaccine-autism-hoax'), 'Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study', 'Annals of Internal Medicine, 170(8):513–520.', 'https://www.acpjournals.org/doi/10.7326/M18-2101'),
  ((SELECT id FROM public.investigations WHERE slug = 'mmr-vaccine-autism-hoax'), 'Vaccines for measles, mumps, rubella, and varicella in children', 'Cochrane Database of Systematic Reviews, CD004407.', 'https://www.cochranelibrary.com');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'targeted-abdominal-fat-reduction',
  'Targeted Fat Loss: Why Crunches Cannot Selectively Spot-Reduce Abdominal Fat',
  'Performing 100 abdominal crunches and torso twists every day burns subcutaneous belly fat and slims the waistline directly.',
  'Muscular contraction does not pull fatty acids from adjacent subcutaneous fat stores. Lipolysis is triggered systemically by circulating catecholamines and hormone-sensitive lipase throughout the entire bloodstream.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'fitness' LIMIT 1),
  '{"claimOrigin":"Fitness influencers, infomercial ab-gadgets, and popular gym mythology.","conclusion":"Abdominal exercises strengthen core musculature and improve posture, but cannot spot-reduce overlying abdominal adipose tissue without a systemic caloric deficit.","detailedExplanation":["The concept of \"spot reduction\" presumes that working a specific muscle group directly extracts and burns the fatty tissue situated immediately over that muscle.","Physiologically, when skeletal muscle fibers contract, they consume intracellular glycogen and circulating free fatty acids (FFAs) delivered via capillary blood flow from adipose depots distributed throughout the entire body.","Lipolysis is regulated by systemic endocrine signaling—principally epinephrine, norepinephrine, and atrial natriuretic peptide—acting on beta-adrenergic receptors across global adipose tissue. Genetics, hormonal balance, and overall energy deficit determine which regional fat deposits mobilize first."],"scientificEvidence":["Journal of Strength and Conditioning Research randomized trial (Vispute et al.): 6 weeks of dedicated abdominal training produced significant core muscular endurance gains but zero change in abdominal subcutaneous fat or body fat percentage compared to controls.","American College of Sports Medicine (ACSM) Exercise and Weight Loss Position Stand: Localized muscle endurance training does not induce localized subcutaneous fat reduction.","Biopsies of subcutaneous fat over trained vs. untrained limbs demonstrate identical rates of fatty acid release, confirming systemic rather than local lipolysis."],"risksAndLimitations":["Repetitive Lumbar Flexion Strain: Performing excessive spinal flexion crunches without core stabilization can exacerbate lumbar disc herniation and lower back pain.","False Frustration: Exercisers who expect spot reduction often abandon healthy cardiovascular and nutritional habits out of unjustified disappointment."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for targeted-abdominal-fat-reduction
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'targeted-abdominal-fat-reduction');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'targeted-abdominal-fat-reduction'), 'The effect of abdominal exercise on abdominal fat', 'Journal of Strength and Conditioning Research, 25(9):2559–2564.', 'https://pubmed.ncbi.nlm.nih.gov/21804427/'),
  ((SELECT id FROM public.investigations WHERE slug = 'targeted-abdominal-fat-reduction'), 'Appropriate Physical Activity Intervention Strategies for Weight Loss and Prevention of Weight Regain for Adults', 'Medicine & Science in Sports & Exercise, 41(2):459–471.', 'https://journals.lww.com/acsm-msse');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'antibiotics-viral-colds',
  'Why Taking Antibiotics for Viral Colds, Flu, and Bronchitis Has Zero Effect',
  'Taking amoxicillin or azithromycin as soon as upper respiratory symptoms start kills the infection quickly and stops it from turning into pneumonia.',
  'Antibiotics specifically inhibit bacterial biological targets (peptidoglycan cell wall synthesis, bacterial 70S ribosomes) which viruses completely lack. Ingesting antibiotics for viral colds offers zero symptom relief while destroying beneficial gut microbiota and driving global antimicrobial resistance.',
  'false',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'infectious' LIMIT 1),
  '{"claimOrigin":"Over-the-counter medicine sharing, patient expectation pressures, and family medicine lore.","conclusion":"Clinical evidence is unequivocal: antibiotics cannot treat or shorten viral upper respiratory tract infections.","detailedExplanation":["More than 90% of acute upper respiratory tract infections—including the common cold, acute nasopharyngitis, acute laryngitis, and non-asthmatic acute bronchitis—are caused by viruses (rhinoviruses, enteroviruses, adenoviruses, and influenza viruses).","Antibacterial pharmacology targets mechanisms unique to prokaryotic bacterial cells, such as beta-lactam disruption of bacterial peptidoglycan cross-linking or macrolide binding to bacterial ribosomal subunits. Viruses lack cell walls, lack ribosomes, and reproduce by hijacking host eukaryotic machinery.","Antibiotics have literally zero molecular target in a virion. Taking them has zero impact on viral replication, mucus clearance, or duration of coughing and sore throat."],"scientificEvidence":["Cochrane Database Systematic Review (Smith et al.): Over 17 randomized controlled trials with thousands of patients confirmed that antibiotics produce no clinically significant reduction in illness duration or severity for acute bronchitis.","CDC Outpatient Antibiotic Stewardship Surveillance: Up to 30% of outpatient antibiotic prescriptions are completely unnecessary, driven primarily by viral respiratory illnesses.","World Health Organization (WHO) Global Antimicrobial Resistance and Use Surveillance System (GLASS) warning of multi-drug resistant superbugs caused by viral misprescribing."],"risksAndLimitations":["Clostridioides difficile Colitis: Eradicating protective intestinal bacteria can allow life-threatening toxin-producing C. diff to proliferate.","Severe Drug Allergies: Anaphylaxis, Stevens-Johnson syndrome, and toxic epidermal necrolysis are rare but fatal adverse drug reactions.","Global Resistance: Inappropriate antibiotic use selects for resistant bacterial strains, making future true bacterial infections harder to treat."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for antibiotics-viral-colds
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'antibiotics-viral-colds');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'antibiotics-viral-colds'), 'Antibiotics for acute bronchitis', 'Cochrane Database of Systematic Reviews, CD000245.', 'https://www.cochranelibrary.com'),
  ((SELECT id FROM public.investigations WHERE slug = 'antibiotics-viral-colds'), 'Core Elements of Outpatient Antibiotic Stewardship', 'Morbidity and Mortality Weekly Report (MMWR), CDC, 65(6):1–12.', 'https://www.cdc.gov/mmwr');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'melatonin-sleep-dependency',
  'Melatonin for Sleep: Does Long-Term Use Cause Dependency or Pineal Shutdown?',
  'Taking over-the-counter melatonin every night shuts down your brain''s natural pineal gland production and causes severe chemical addiction.',
  'Unlike prescription hypnotics (benzodiazepines or Z-drugs), exogenous melatonin does not cause chemical dependency, receptor tolerance, or permanent pineal gland shutdown. However, excessive doses (5–10 mg) and incorrect timing desensitize MT1/MT2 receptors, disrupt circadian phase shifting, and cause vivid nightmares and daytime somnolence.',
  'misleading',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'mental-health' LIMIT 1),
  '{"claimOrigin":"Biohacking forums, wellness social media warning videos, and anecdotal sleep advice.","conclusion":"Melatonin is safe for short-term chronobiological realignment, but viral claims of irreversible chemical addiction are physiologically inaccurate.","detailedExplanation":["Melatonin (N-acetyl-5-methoxytryptamine) is an endogenous neurohormone produced primarily by the pineal gland in response to darkness signaled through the suprachiasmatic nucleus (SCN).","Prescription sedatives target the GABA-A receptor complex, altering central nervous system excitability and creating rapid pharmacodynamic tolerance and withdrawal upon cessation. In contrast, melatonin acts on G-protein coupled MT1 and MT2 receptors to adjust circadian phase timing.","Clinical cessation trials confirm that discontinuing exogenous melatonin does not trigger physiological withdrawal symptoms or rebound insomnia worse than baseline. However, commercial retail gummies frequently contain 5 to 10 times the physiological dose (0.3 to 1 mg is optimal), creating receptor desensitization and grogginess."],"scientificEvidence":["American Academy of Sleep Medicine (AASM) Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia.","JAMA study evaluating commercial melatonin formulations: 88% of tested products were inaccurately labeled, with actual quantities ranging from 74% less to 347% more than stated on the label.","Clinical reviews in Sleep Medicine Reviews confirming that physiological micro-dosing (0.3 mg–1 mg) shifts circadian phase with zero negative feedback suppression of endogenous nighttime pineal surges."],"risksAndLimitations":["Phase Delay Misalignment: Taking melatonin in the morning or early afternoon can delay the circadian rhythm, worsening sleep-onset latency.","Vivid Nightmares & Daytime Sedation: High-dose OTC formulations (>5mg) cause protracted plasma clearance and morning motor sluggishness."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for melatonin-sleep-dependency
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'melatonin-sleep-dependency');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'melatonin-sleep-dependency'), 'Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia in Adults', 'Journal of Clinical Sleep Medicine, 13(2):307–349.', 'https://jcsm.aasm.org'),
  ((SELECT id FROM public.investigations WHERE slug = 'melatonin-sleep-dependency'), 'Quantity and Quality of Melatonin Products Available Over the Counter', 'JAMA, 329(16):1401–1402.', 'https://jamanetwork.com/journals/jama');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'intermittent-fasting-longevity',
  'Intermittent Fasting vs. Caloric Restriction: Does 16:8 Fasting Double Human Longevity?',
  '16:8 intermittent fasting induces cellular autophagy that burns body fat twice as fast as normal diets and extends human lifespan without requiring calorie restriction.',
  'Rigorous 12-month randomized human trials show that 16:8 time-restricted eating produces weight loss and metabolic improvements identical to standard continuous calorie restriction of equal energy intake. While fasting stimulates autophagy in rodent models, evidence that it directly extends human lifespan independent of total calorie balance is unproven.',
  'misleading',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'diet' LIMIT 1),
  '{"claimOrigin":"Viral longevity podcasts, biohacking bestsellers, and fasting app advertisements.","conclusion":"Intermittent fasting is an effective behavioral tool for managing calorie intake, but is not clinically superior to standard portion control for fat loss or longevity.","detailedExplanation":["Intermittent fasting (IF) protocols—most commonly 16 hours of daily fasting followed by an 8-hour feeding window—have exploded in popularity.","Proponents assert that time restriction triggers metabolic switching from glucose to fatty acid ketones, stimulating dramatic autophagic intracellular cleanup that extends life and melts fat faster than traditional diet management.","However, large-scale randomized human trials controlling for total caloric intake demonstrate that when energy deficits are matched, 16:8 fasting produces virtually indistinguishable reductions in body weight, fat mass, visceral fat, blood pressure, and glycemic markers compared to non-time-restricted caloric restriction."],"scientificEvidence":["New England Journal of Medicine (NEJM) 12-Month Trial (Liu et al., 2022, n=139): Time-restricted eating with calorie restriction was not more beneficial with respect to reductions in body fat, visceral fat, or metabolic risk factors than daily calorie restriction alone.","JAMA Internal Medicine TREAT Trial (Lowe et al.): Time-restricted eating in the absence of prescribed caloric reduction produced no significant weight loss or cardiometabolic improvements compared to consistent meal timing.","Cochrane Database of Systematic Reviews: Intermittent fasting vs continuous energy restriction for weight loss in adults."],"risksAndLimitations":["Sarcopenia in Older Adults: Restricting feeding windows can make it difficult to consume sufficient dietary protein (1.2–1.6 g/kg), potentially accelerating lean muscle loss.","Disordered Eating Patterns: Strict feeding time windows can trigger binge-eating episodes in vulnerable individuals."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for intermittent-fasting-longevity
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'intermittent-fasting-longevity');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'intermittent-fasting-longevity'), 'Calorie Restriction with or without Time-Restricted Eating in Weight Loss', 'New England Journal of Medicine, 386(16):1495–1504.', 'https://www.nejm.org/doi/full/10.1056/NEJMoa2114833'),
  ((SELECT id FROM public.investigations WHERE slug = 'intermittent-fasting-longevity'), 'Effects of Time-Restricted Eating on Weight Loss and Other Metabolic Parameters in Overweight and Obese Adults', 'JAMA Internal Medicine, 180(11):1491–1499.', 'https://jamanetwork.com/journals/jamainternalmedicine');

INSERT INTO public.investigations (
  slug,
  title,
  original_claim,
  summary,
  verdict,
  status,
  category_id,
  article_content,
  published_at,
  reviewed_at
)
VALUES (
  'ashwagandha-anxiety-cortisol',
  'Ashwagandha Root Extract for Stress and Anxiety: What Does Clinical Science Say?',
  'Taking high-concentration ashwagandha root extract permanently eliminates generalized anxiety disorder and resets adrenal burnout without prescription medication or therapy.',
  'While small clinical trials suggest standardized ashwagandha (Withania somnifera) extracts modestly reduce perceived stress scores and morning salivary cortisol, long-term safety, optimal dosing, and efficacy for diagnosed Generalized Anxiety Disorder (GAD) remain inconclusive. Furthermore, clinical registries have documented rare cases of supplement-induced cholestatic liver injury.',
  'unverified',
  'published',
  (SELECT id FROM public.categories WHERE slug = 'mental-health' LIMIT 1),
  '{"claimOrigin":"Herbal wellness influencer trends, adaptogen supplement marketing, and TikTok mental health posts.","conclusion":"Ashwagandha may offer mild supportive stress reduction, but evidence is unverified for treating psychiatric disorders and cannot replace evidence-based psychotherapy or pharmacology.","detailedExplanation":["Ashwagandha is a traditional Ayurvedic botanical shrub containing biologically active steroidal lactones known as withanolides.","In rodent and in-vitro models, withanolides interact with GABAergic neurotransmission and modulate the hypothalamic-pituitary-adrenal (HPA) axis, attenuating cortisol synthesis.","Human clinical trials are mostly small (fewer than 60–80 participants), short-term (6 to 8 weeks), and often industry-funded using proprietary branded extracts. While participants frequently report lower scores on subjective anxiety inventories, large-scale multi-center trials evaluating durability and safety beyond 12 weeks are absent."],"scientificEvidence":["Systematic Review and Meta-Analysis in Journal of Clinical Medicine (2022) of 12 randomized controlled trials: Found statistically significant but clinically modest reductions in subjective anxiety and cortisol, noting high heterogeneity and publication bias.","European Association for the Study of the Liver (EASL) Clinical Case Registry: Documented five cases of acute drug-induced cholestatic liver injury associated with commercial ashwagandha root preparations.","National Institutes of Health (NIH) LiverTox Clinical Database monograph on Withania somnifera hepatotoxicity."],"risksAndLimitations":["Idiosyncratic Hepatotoxicity: Jaundice, pruritus, and elevated hepatic transaminases have occurred with high-potency withanolide concentrates.","Thyroid Hormone Elevation: Ashwagandha can stimulate thyroid hormone synthesis, posing risks for individuals with subclinical hyperthyroidism or Graves disease.","Medication Interactions: Enhances sedative effects of benzodiazepines, alcohol, and barbiturates."]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  original_claim = EXCLUDED.original_claim,
  summary = EXCLUDED.summary,
  verdict = EXCLUDED.verdict,
  status = 'published',
  category_id = EXCLUDED.category_id,
  article_content = EXCLUDED.article_content,
  published_at = COALESCE(public.investigations.published_at, NOW()),
  reviewed_at = NOW();

-- Sources for ashwagandha-anxiety-cortisol
DELETE FROM public.sources WHERE investigation_id = (SELECT id FROM public.investigations WHERE slug = 'ashwagandha-anxiety-cortisol');
INSERT INTO public.sources (investigation_id, title, publisher, source_url)
VALUES
  ((SELECT id FROM public.investigations WHERE slug = 'ashwagandha-anxiety-cortisol'), 'An Investigation into the Stress-Relieving and Pharmacological Actions of Ashwagandha: A Systematic Review and Meta-Analysis', 'Journal of Clinical Medicine, 11(14):3977.', 'https://www.mdpi.com/journal/jcm'),
  ((SELECT id FROM public.investigations WHERE slug = 'ashwagandha-anxiety-cortisol'), 'Ashwagandha-Induced Liver Injury: A Case Series from the Drug-Induced Liver Injury Network', 'LiverTox: Clinical and Research Information on Drug-Induced Liver Injury, NIH/NIDDK.', 'https://www.ncbi.nlm.nih.gov/books/NBK548483/');
