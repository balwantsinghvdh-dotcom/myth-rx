/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Demonstration Investigation Dataset
 * Phase 2: Complete and Polish Public Website Frontend
 * ============================================================================
 * 
 * NOTICE:
 * All records below represent sample demonstration fact-checks compiled
 * for academic review and frontend demonstration purposes.
 * Standardized Public Verdicts:
 *   - "Supported": Clinical evidence and scientific consensus support the claim.
 *   - "False": Demonstrably inaccurate, fabricated, or physiologically impossible.
 *   - "Misleading": Contains a grain of laboratory truth exaggerated into false claims.
 *   - "Unverified": Inconclusive or lacking human clinical trials.
 */

const DEMO_INVESTIGATIONS = [
  {
    id: 'ginger-kidney-stones',
    title: 'Why Boiled Ginger Water Does Not Melt Kidney Stones',
    originalClaim: 'Drinking high-concentration boiled ginger water on an empty stomach dissolves kidney stones completely in 48 hours without surgery.',
    claimOrigin: 'Viral WhatsApp forward & short-form video audio circulating in family groups.',
    category: 'whatsapp',
    categoryLabel: 'WhatsApp Viral',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Kidney stones are calcified crystalline mineral deposits that cannot be dissolved by ingested ginger metabolites. Relying on this myth risks severe ureteral obstruction and renal damage.',
    conclusion: 'Ginger contains mild antioxidant compounds, but ingested fluids pass through the digestive system and cannot act as a chemical solvent inside the urinary tract.',
    detailedExplanation: [
      'Nephrolithiasis (kidney stones) develops when urinary minerals—most commonly calcium oxalate, calcium phosphate, or uric acid—supersaturate and aggregate into hard crystalline stones in renal tubules and calyces.',
      'When an individual drinks boiled ginger tea, the fluid and active gingerols are broken down by gastric acid in the stomach, absorbed across enterocytes in the small intestine, and metabolized by liver enzymes into minor conjugated metabolites.',
      'At no point does concentrated ginger liquid enter the renal pelvis or contact stones in a solvent state. Delaying proper clinical evaluation while attempting home solvent recipes frequently results in acute obstruction, hydronephrosis, and preventable renal damage.'
    ],
    scientificEvidence: [
      'American Urological Association (AUA) clinical guidelines establish that stone passage depends entirely on stone diameter, anatomic location, and smooth-muscle relaxation—not herbal melting.',
      'A systematic review of botanical extracts in the Cochrane Database confirms zero randomized controlled human trials showing reduction of established stone mass from ginger tea.',
      'Small laboratory animal models demonstrate mild renal antioxidant protection against chemical toxins, which is fundamentally distinct from dissolving solid mineral stones in humans.'
    ],
    risksAndLimitations: [
      'Acute Ureteral Obstruction: Stones larger than 5 mm can lodge in the ureter, blocking urine outflow.',
      'Hydronephrosis & Sepsis: Obstructed kidneys can suffer irreversible functional decline and life-threatening urosepsis within days if untreated.',
      'Delay of Proven Interventions: Delaying consultation prevents time-sensitive medical expulsive therapy or minimally invasive lithotripsy.'
    ],
    sources: [
      {
        title: 'Medical Management of Kidney Stones: AUA Guideline',
        citation: 'American Urological Association Guidelines, updated 2024.',
        url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-medical-management-guideline'
      },
      {
        title: 'Water and fluid intake for preventing the recurrence of urinary calculi',
        citation: 'Cochrane Database of Systematic Reviews, CD003504.',
        url: 'https://www.cochranelibrary.com'
      },
      {
        title: 'Evaluation of renoprotective and antioxidant properties of Zingiber officinale',
        citation: 'Journal of Ethnopharmacology, PMC4518290.',
        url: 'https://pubmed.ncbi.nlm.nih.gov'
      }
    ],
    publishedDate: 'October 24, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: true,
    featured: true
  },
  {
    id: 'alkaline-water-ph',
    title: 'Can Alkaline Water Actually Alter Human Blood pH Levels?',
    originalClaim: 'Drinking alkaline water (pH 8.5+) neutralizes body acidity, alters blood pH, and cures chronic acid-based diseases.',
    claimOrigin: 'Commercial bottled water advertisements and wellness influencer social posts.',
    category: 'diet',
    categoryLabel: 'Nutrition & Diet',
    verdict: 'misleading',
    verdictLabel: 'Misleading',
    summary: 'Stomach hydrochloric acid neutralizes alkaline water on contact. Human arterial blood pH is tightly regulated within 7.35 to 7.45 by renal and respiratory homeostatic mechanisms.',
    conclusion: 'Drinking water is beneficial for hydration, but alkaline water cannot alter systemic blood pH or cure disease through body de-acidification.',
    detailedExplanation: [
      'Promoters of alkaline water assert that metabolic waste creates a dangerous state of "acidosis" that can be reversed by drinking high-pH water.',
      'In reality, the stomach produces concentrated hydrochloric acid (pH 1.5 to 3.5). Any alkaline fluid ingested is instantly neutralized upon entering the gastric chamber before reaching systemic circulation.',
      'Furthermore, human blood pH is among the most rigorously defended physiological variables in biology. Arterial pH remains between 7.35 and 7.45 through the bicarbonate buffer system, pulmonary carbon dioxide exhalation, and renal acid-base filtration.'
    ],
    scientificEvidence: [
      'Clinical reviews indexed in PubMed consistently confirm that oral alkaline beverages produce no clinically significant change in systemic arterial blood pH in healthy adults.',
      'Urine pH may temporarily fluctuate as kidneys excrete excess bicarbonate ions, but urinary pH reflects excretion rather than blood acidity.',
      'Systemic acidosis is a severe medical condition caused by diabetic ketoacidosis, lactic acidosis, or renal failure—none of which are treatable with alkaline drinking water.'
    ],
    risksAndLimitations: [
      'False Reassurance: Patients may avoid evidence-based management for metabolic or digestive disorders.',
      'Digestive Impairment: Excessive consumption of highly alkaline additives can temporarily reduce stomach acid, impairing digestive protein breakdown and pathogen defense.',
      'Financial Exploitation: Bottled alkaline water and specialized ionizers cost orders of magnitude more than clean municipal tap water without clinical benefit.'
    ],
    sources: [
      {
        title: 'Systematic review of the association between dietary acid load, alkaline water and cancer',
        citation: 'BMJ Open, 6(6):e010438.',
        url: 'https://bmjopen.bmj.com'
      },
      {
        title: 'Acid-Base Homeostasis and Regulation of Arterial pH',
        citation: 'Harrison’s Principles of Internal Medicine, 21st Edition.',
        url: 'https://accessmedicine.mhmedical.com'
      }
    ],
    publishedDate: 'October 25, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: true,
    featured: true
  },
  {
    id: 'turmeric-diabetes-insulin',
    title: 'Curcumin Supplements vs. Prescription Insulin in Type 2 Diabetes',
    originalClaim: 'High-dose turmeric and curcumin supplements are a natural cure that completely replaces prescription insulin and metformin.',
    claimOrigin: 'Sponsored natural remedy blogs and shared social media graphics.',
    category: 'supplements',
    categoryLabel: 'Supplements & Herbs',
    verdict: 'unverified',
    verdictLabel: 'Unverified',
    summary: 'While curcumin exhibits mild anti-inflammatory properties in laboratory cell cultures, no clinical human trials support discontinuing prescription glycemic control agents.',
    conclusion: 'Abruptly substituting unproven dietary supplements for prescription antidiabetic medications creates severe hyperosmolar and ketoacidotic risks.',
    detailedExplanation: [
      'Curcumin is a polyphenol extracted from turmeric root (Curcuma longa). It has been studied extensively in laboratory dishes and rodent models for its anti-inflammatory and antioxidant biochemical actions.',
      'However, curcumin has notoriously poor oral bioavailability—it is rapidly conjugated and cleared from the body with minimal systemic tissue absorption.',
      'Crucially, no clinical trial has ever demonstrated that curcumin can stimulate physiological pancreatic beta-cell insulin secretion sufficiently to control human diabetes, let alone replace exogenous insulin in insulin-dependent patients.'
    ],
    scientificEvidence: [
      'American Diabetes Association (ADA) Standards of Care review herbal supplements annually and find insufficient clinical evidence to recommend curcumin for glycemic control.',
      'Small exploratory human trials show modest improvements in fasting blood glucose when used as an adjunct to diet, but never as a monotherapy or medication replacement.',
      'Cellular in-vitro effects observed at high concentrations in test tubes cannot be directly translated into clinical dosing in patients.'
    ],
    risksAndLimitations: [
      'Hyperglycemic Hyperosmolar State (HHS): Abruptly stopping prescribed medications leads to dangerous blood glucose elevation.',
      'Diabetic Ketoacidosis (DKA): Discontinuing required insulin can cause acute life-threatening metabolic acidosis.',
      'Supplement Contamination & Drug Interactions: Concentrated curcumin can interact with anticoagulants and antiplatelet drugs.'
    ],
    sources: [
      {
        title: 'Standards of Care in Diabetes: Lifestyle and Pharmacologic Approaches',
        citation: 'Diabetes Care, American Diabetes Association, 2024.',
        url: 'https://diabetesjournals.org/care'
      },
      {
        title: 'Curcumin: A Review of Its Effects on Human Health',
        citation: 'Foods, 6(10):92, PMC5664031.',
        url: 'https://pubmed.ncbi.nlm.nih.gov'
      }
    ],
    publishedDate: 'October 25, 2026',
    reviewDate: null,
    readTime: '6 min read',
    isDemonstration: true,
    featured: true
  },
  {
    id: 'lemon-water-cancer',
    title: 'The Viral "Hot Lemon Water Destroys Cancer Cells" Chain Hoax',
    originalClaim: 'Drinking hot lemon water is 10,000 times stronger than chemotherapy and kills cancer cells without harming healthy cells.',
    claimOrigin: 'Decades-old viral chain email resurfacing continuously on WhatsApp and Facebook.',
    category: 'cancer',
    categoryLabel: 'Cancer Claims',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'A fabricated claim falsely attributed to reputable cancer research institutes. No human clinical trials demonstrate that hot lemon water destroys malignant tumors.',
    conclusion: 'Lemons are a healthy source of dietary vitamin C, but cannot treat, eradicate, or cure malignant neoplasms.',
    detailedExplanation: [
      'This hoax has circulated online since at least 2011, frequently claiming that citrus fruit extracts are thousands of times more potent than conventional chemotherapeutic agents like Adriamycin.',
      'While citrus peel contains phytochemicals such as limonene and flavonoids that have been studied in petri dishes for cellular proliferation inhibition, laboratory cell responses do not equal clinical human oncology treatments.',
      'Malignant tumors are complex cellular ecosystems characterized by genomic instability and immune evasion. Ingesting citrus fruit or hot water provides no therapeutic dosing to eradicate solid or hematologic tumors.'
    ],
    scientificEvidence: [
      'National Cancer Institute (NCI) and Memorial Sloan Kettering Cancer Center have issued clear public statements repudiating the claim that lemon juice acts as a chemotherapy substitute.',
      'Systematic reviews in clinical oncology find zero evidence that lemon water alters tumor staging or improves cancer survival rates.',
      'Delaying validated curative therapies (such as surgical resection, radiotherapy, or targeted immunotherapy) in early-stage cancers drastically diminishes 5-year survival rates.'
    ],
    risksAndLimitations: [
      'Curable Stage Progression: Patients who substitute herbal drinks for medical oncology risk progressing from localized, curable disease to metastatic, incurable stages.',
      'Dental Enamel Erosion: Frequent consumption of concentrated hot lemon water causes permanent acid demineralization of dental enamel.'
    ],
    sources: [
      {
        title: 'Cancer Misinformation on Social Media: A Threat to Public Health',
        citation: 'Journal of the National Cancer Institute, 113(8):957–960.',
        url: 'https://academic.oup.com/jnci'
      },
      {
        title: 'Citrus Phytochemicals and Cancer Research: Evidence vs Myth',
        citation: 'Memorial Sloan Kettering Cancer Center Integrative Medicine Database.',
        url: 'https://www.mskcc.org'
      }
    ],
    publishedDate: 'October 26, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'raw-milk-pathogens',
    title: 'Raw Milk Trends and Zoonotic Bacterial Infection Hazards',
    originalClaim: 'Drinking unpasteurized raw milk significantly increases the risk of severe bacterial foodborne illness compared to pasteurized milk.',
    claimOrigin: 'Public health advisories responding to viral raw dairy social media trends.',
    category: 'diet',
    categoryLabel: 'Nutrition & Diet',
    verdict: 'supported',
    verdictLabel: 'Supported',
    summary: 'Epidemiological surveillance and clinical microbiology confirm that pasteurization eliminates dangerous bacterial pathogens without destroying vital milk nutrition.',
    conclusion: 'Clinical and epidemiological evidence strongly supports the public health consensus that unpasteurized raw milk carries substantial zoonotic infection risks.',
    detailedExplanation: [
      'Social media influencers have recently promoted unpasteurized "raw" dairy, claiming that pasteurization destroys enzymes and beneficial antibodies.',
      'However, historical public health data and contemporary disease surveillance demonstrate that raw milk is a primary transmission vector for dangerous bacterial pathogens, including Campylobacter jejuni, Salmonella enterica, Escherichia coli O157:H7, and Listeria monocytogenes.',
      'Pasteurization—heating milk to 161°F (71.7°C) for 15 seconds—was introduced to prevent devastating outbreaks of bovine tuberculosis, diphtheria, and typhoid fever. Modern nutritional analysis proves that pasteurization causes negligible change in protein quality, calcium bioavailability, or primary vitamins.'
    ],
    scientificEvidence: [
      'Centers for Disease Control and Prevention (CDC) outbreak data demonstrates that unpasteurized dairy is responsible for 840 times more illnesses and 45 times more hospitalizations than pasteurized dairy.',
      'Food and Drug Administration (FDA) microbiological surveys show consistent contamination rates in raw milk bulk tanks despite sanitized agricultural milking equipment.',
      'Listeria monocytogenes in raw dairy poses an exceptionally high fatality rate (up to 20–30%) in pregnant women, neonates, and immunocompromised patients.'
    ],
    risksAndLimitations: [
      'Hemolytic Uremic Syndrome (HUS): Shiga toxin-producing E. coli from raw dairy can cause acute kidney failure, particularly in children under 5.',
      'Pregnancy Loss: Listeriosis contracted from raw milk can trigger spontaneous miscarriage, premature labor, and neonatal sepsis.'
    ],
    sources: [
      {
        title: 'Outbreak-Related Foodborne Illnesses Associated with Unpasteurized Milk',
        citation: 'Emerging Infectious Diseases, CDC, 23(3):484–488.',
        url: 'https://wwwnc.cdc.gov/eid'
      },
      {
        title: 'The Myth of Raw Milk: Science-Based Food Safety',
        citation: 'U.S. Food and Drug Administration (FDA) Guidance Document.',
        url: 'https://www.fda.gov'
      }
    ],
    publishedDate: 'October 26, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'breath-holding-fibrosis',
    title: 'The 10-Second Breath-Holding Pulmonary Self-Test Hoax',
    originalClaim: 'Holding your breath for 10 seconds without coughing or tightness proves you have healthy lungs and no pulmonary fibrosis.',
    claimOrigin: 'Viral chain message falsely attributed to Stanford University and hospital boards.',
    category: 'whatsapp',
    categoryLabel: 'WhatsApp Viral',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Breath-holding capacity depends on chest mechanics, oxygen saturation, and psychological tolerance. It cannot detect or rule out pulmonary fibrosis, lung lesions, or respiratory infections.',
    conclusion: 'Clinical spirometry, diffusing capacity tests (DLCO), and high-resolution computed tomography (HRCT) are the only validated diagnostics for pulmonary fibrosis.',
    detailedExplanation: [
      'This viral chain forward circulated internationally, instructing readers to hold their breath for more than 10 seconds every morning. If successful without discomfort, the message claimed their lungs were free from fibrosis and infection.',
      'Pulmonology consensus confirms that breath-holding capability is influenced primarily by arterial partial pressure of carbon dioxide (PaCO2), diaphragmatic muscle training, and central nervous system chemoreceptors.',
      'Patients with early-stage pulmonary fibrosis or atypical viral pneumonias can easily hold their breath for 10 seconds while still experiencing significant subclinical alveolar damage.'
    ],
    scientificEvidence: [
      'World Health Organization (WHO) and American Thoracic Society (ATS) specifically debunked this viral test, noting it creates dangerous false reassurance.',
      'Pulmonary fibrosis diagnosis requires formal pulmonary function testing (PFT), arterial blood gas measurement, and chest imaging.',
      'Patients experiencing breathlessness, persistent cough, or low pulse oximetry readings should never rely on informal breath-holding as a clearance test.'
    ],
    risksAndLimitations: [
      'False Negative Reassurance: Individuals with active respiratory distress may delay medical evaluation because they successfully held their breath.',
      'Chest Strain: Forced breath-holding in patients with underlying cardiac arrhythmia can induce vasovagal syncope or transient blood pressure spikes.'
    ],
    sources: [
      {
        title: 'Diagnosis and Management of Idiopathic Pulmonary Fibrosis: ATS/ERS/JRS/ALAT Clinical Practice Guideline',
        citation: 'American Journal of Respiratory and Critical Care Medicine, 205(9):e18–e47.',
        url: 'https://www.atsjournals.org'
      },
      {
        title: 'WHO Clarification on Social Media Coronavirus and Pulmonary Self-Checks',
        citation: 'World Health Organization Mythbusters Archive.',
        url: 'https://www.who.int'
      }
    ],
    publishedDate: 'October 26, 2026',
    reviewDate: null,
    readTime: '3 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'vitamin-c-cold-prevention',
    title: 'Do Megadoses of Vitamin C Prevent Catching the Common Cold?',
    originalClaim: 'Taking 2,000 mg to 5,000 mg of Vitamin C daily prevents you from catching viral upper respiratory infections.',
    claimOrigin: 'Historical claims popularized in wellness literature and dietary supplement marketing.',
    category: 'supplements',
    categoryLabel: 'Supplements & Herbs',
    verdict: 'misleading',
    verdictLabel: 'Misleading',
    summary: 'Extensive randomized trials show that daily Vitamin C supplementation does not reduce the incidence of colds in the general population, though it may modestly shorten symptom duration by roughly 8%.',
    conclusion: 'Vitamin C is an essential nutrient for immune function, but megadoses do not act as an impervious shield against viral respiratory transmission.',
    detailedExplanation: [
      'The theory that large doses of ascorbic acid (Vitamin C) prevent colds was championed in the 1970s. Since then, decades of clinical research have tested this hypothesis in tens of thousands of human participants.',
      'Cochrane systematic reviews analyzing over 29 placebo-controlled trials involving more than 11,000 individuals concluded that regular Vitamin C supplementation does not reduce the frequency of colds in the general community.',
      'However, regular supplementation was found to produce a minor reduction in cold duration (about 8% in adults and 14% in children), meaning a 7-day cold might resolve roughly half a day sooner.'
    ],
    scientificEvidence: [
      'Cochrane Database of Systematic Reviews: "Vitamin C for preventing and treating the common cold" (2013, confirmed in updates).',
      'Renal threshold studies indicate that oral intake above 400 mg daily results in near-complete urinary excretion of unabsorbed ascorbic acid in healthy adults.',
      'Extreme physical stress cohorts (e.g. marathon runners in sub-arctic conditions) showed a 50% incidence reduction, but this benefit does not extrapolate to ordinary non-athlete populations.'
    ],
    risksAndLimitations: [
      'Gastrointestinal Upset: Doses exceeding the 2,000 mg tolerable upper intake level (UL) frequently cause osmotic diarrhea, nausea, and abdominal cramping.',
      'Kidney Stone Risk: Ascorbic acid is metabolized to oxalate; chronic megadoses significantly elevate calcium oxalate nephrolithiasis risk in susceptible individuals.'
    ],
    sources: [
      {
        title: 'Vitamin C for preventing and treating the common cold',
        citation: 'Cochrane Database of Systematic Reviews, Issue 1. Art. No.: CD000980.',
        url: 'https://www.cochranelibrary.com'
      },
      {
        title: 'Nutrient Summary: Vitamin C',
        citation: 'Linus Pauling Institute Micronutrient Information Center, Oregon State University.',
        url: 'https://lpi.oregonstate.edu'
      }
    ],
    publishedDate: 'October 26, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'aspirin-first-aid-stroke',
    title: 'Why You Should Never Automatically Give Aspirin for a Suspected Stroke',
    originalClaim: 'If someone displays symptoms of a stroke, immediately give them two aspirins to dissolve the blood clot before the ambulance arrives.',
    claimOrigin: 'Viral first-aid advice shared across WhatsApp groups and Facebook posts.',
    category: 'cardiology',
    categoryLabel: 'Cardiovascular',
    verdict: 'misleading',
    verdictLabel: 'Misleading',
    summary: 'While aspirin is beneficial for acute heart attacks, strokes can be ischemic (clot) or hemorrhagic (bleed). Administering aspirin during a brain hemorrhage can cause fatal intracranial bleeding.',
    conclusion: 'Never administer aspirin for suspected stroke. Call emergency medical services immediately so a hospital CT scan can differentiate between ischemic and hemorrhagic stroke.',
    detailedExplanation: [
      'First-aid messages frequently confuse acute myocardial infarction (heart attack) protocols with acute cerebrovascular accident (stroke) protocols.',
      'In a heart attack, chewing an aspirin inhibits platelet aggregation in the coronary arteries. However, approximately 13–15% of acute strokes are hemorrhagic—caused by a ruptured blood vessel bleeding directly into brain tissue.',
      'Giving aspirin—an irreversible antiplatelet medication—to a patient experiencing a hemorrhagic stroke will impair clotting, drastically accelerate intracranial bleeding, and dramatically increase mortality.'
    ],
    scientificEvidence: [
      'American Heart Association / American Stroke Association (AHA/ASA) Guidelines explicitly mandate non-contrast head CT imaging prior to initiating any antiplatelet or thrombolytic therapy.',
      'Emergency medicine protocols state that non-medical bystanders must never administer oral medications to suspected stroke patients due to acute dysphagia (swallowing impairment) and aspiration pneumonia risks.'
    ],
    risksAndLimitations: [
      'Fatal Intracranial Hemorrhage: Administering antiplatelet therapy during an active brain bleed accelerates fatal herniation.',
      'Choking & Aspiration: Stroke frequently impairs the swallowing reflex; oral tablets can block the airway or enter the lungs.',
      'Delaying 911 / EMS: Searching for aspirin wastes precious minutes where emergency clot-busting tPA or thrombectomy could be mobilized.'
    ],
    sources: [
      {
        title: 'Guidelines for the Early Management of Patients With Acute Ischemic Stroke',
        citation: 'Stroke, American Heart Association / American Stroke Association, 50(12):e344–e418.',
        url: 'https://www.ahajournals.org/journal/str'
      },
      {
        title: 'Stroke First Aid Protocols: What Bystanders Should and Should Not Do',
        citation: 'Mayo Clinic Stroke Care Resources.',
        url: 'https://www.mayoclinic.org'
      }
    ],
    publishedDate: 'October 26, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'daily-walking-cardiovascular-health',
    title: 'Can Walking 8,000 to 10,000 Steps Daily Significantly Reduce Cardiovascular Mortality?',
    originalClaim: 'Walking 8,000 to 10,000 steps daily significantly reduces the risk of heart disease, stroke, and all-cause mortality compared to sedentary lifestyles.',
    claimOrigin: 'Preventive cardiology consensus guidelines and wearable fitness tracking health discussions.',
    category: 'cardiology',
    categoryLabel: 'Cardiovascular',
    verdict: 'supported',
    verdictLabel: 'Supported',
    summary: 'Large-scale prospective cohort studies and meta-analyses definitively prove that achieving 8,000–10,000 steps per day provides substantial, progressive reductions in cardiovascular events and all-cause mortality.',
    conclusion: 'Clinical and epidemiological evidence strongly supports the cardiovascular benefits of daily moderate physical activity.',
    detailedExplanation: [
      'Physical inactivity is recognized by the World Health Organization as a major independent modifiable risk factor for global cardiovascular mortality.',
      'Recent prospective cohort data tracking over 78,000 individuals using accelerometers demonstrated that stepping up from 4,000 to approximately 9,000–10,000 steps daily yielded an approximately 50% lower risk of cardiovascular mortality.',
      'The physiological mechanisms include enhanced endothelial nitric oxide synthase expression, reduced systemic arterial stiffness, improved insulin sensitivity in skeletal muscle, and lower resting systolic blood pressure.'
    ],
    scientificEvidence: [
      'Lancet Public Health meta-analysis of 15 international studies (n=47,471) confirming steep mortality reductions up to 8,000–10,000 steps/day in adults under 60 and 6,000–8,000 in adults 60+.',
      'JAMA Internal Medicine cohort analysis demonstrating step intensity and daily total step accumulation independently lower cardiovascular disease incidence.',
      'American Heart Association Scientific Statement on physical activity and cardiometabolic health.'
    ],
    risksAndLimitations: [
      'Patients with advanced heart failure or unstable angina should consult their cardiologist for tailored exercise prescriptions.',
      'Stepping volume should be accumulated gradually in previously sedentary individuals to prevent musculoskeletal overuse injuries.'
    ],
    sources: [
      {
        title: 'Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts',
        citation: 'The Lancet Public Health, 7(3):e219–e228.',
        url: 'https://www.thelancet.com/journals/lanpub'
      },
      {
        title: 'Prospective associations of daily step counts with cardiovascular disease',
        citation: 'JAMA Internal Medicine, 182(11):1139–1148.',
        url: 'https://jamanetwork.com/journals/jamainternalmedicine'
      }
    ],
    publishedDate: 'October 27, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: true,
    featured: true
  },
  {
    id: 'hpv-vaccine-cervical-cancer',
    title: 'Does the Human Papillomavirus (HPV) Vaccine Actually Prevent Cervical Cancer?',
    originalClaim: 'Routine HPV vaccination before initial exposure prevents more than 88% to 90% of cervical and anogenital cancer cases.',
    claimOrigin: 'International oncology surveillance data and pediatric immunization public health advisories.',
    category: 'cancer',
    categoryLabel: 'Cancer Claims',
    verdict: 'supported',
    verdictLabel: 'Supported',
    summary: 'Long-term national registry data and clinical trials establish that recombinant HPV vaccines prevent high-grade cervical intraepithelial neoplasia (CIN3) and invasive cervical carcinomas.',
    conclusion: 'Rigorous epidemiological evidence confirms that HPV immunization dramatically reduces cervical cancer incidence.',
    detailedExplanation: [
      'Human papillomavirus types 16 and 18 are high-risk oncogenic strains responsible for approximately 70% of invasive cervical cancers worldwide, while types 31, 33, 45, 52, and 58 account for an additional 20%.',
      'The vaccine consists of recombinant virus-like particles (VLPs) of the L1 capsid protein. It contains no viral DNA and cannot cause HPV infection or cancer.',
      'When administered prior to viral exposure, the vaccine generates high titers of neutralizing antibodies that block viral cellular entry and subsequent oncogenic integration into cervical epithelial host genomes.'
    ],
    scientificEvidence: [
      'New England Journal of Medicine (NEJM) Swedish registry study tracking over 1.67 million females showed an 88% lower risk of invasive cervical cancer among women vaccinated before age 17.',
      'Cochrane Database of Systematic Reviews confirmed near-complete protection against precancerous lesions in girls and women without prior HPV exposure.',
      'CDC continuous surveillance shows an 88% reduction in vaccine-strain HPV infections among teen girls and an 81% decline in young women.'
    ],
    risksAndLimitations: [
      'The vaccine does not clear existing, established pre-vaccination HPV infections or treat active cervical dysplasia.',
      'Vaccinated individuals must still participate in routine age-appropriate cervical cancer screening (Pap and HPV co-testing).'
    ],
    sources: [
      {
        title: 'HPV Vaccination and the Risk of Invasive Cervical Cancer',
        citation: 'New England Journal of Medicine, 383:1340–1348.',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1917338'
      },
      {
        title: 'Prophylactic vaccination against human papillomaviruses to prevent cervical cancer and its precursors',
        citation: 'Cochrane Database of Systematic Reviews, CD009069.',
        url: 'https://www.cochranelibrary.com'
      }
    ],
    publishedDate: 'October 27, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'toothpaste-butter-burns',
    title: 'Why You Must Never Put Toothpaste, Butter, or Flour on Thermal Burns',
    originalClaim: 'Applying cold toothpaste, butter, or raw flour immediately to severe burns soothes pain, prevents blisters, and heals skin without scars.',
    claimOrigin: 'Generational domestic home remedies circulating on Facebook, WhatsApp, and family kitchen lore.',
    category: 'whatsapp',
    categoryLabel: 'WhatsApp Viral',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Applying butter, toothpaste, or flour traps residual heat inside dermis tissue, introduces bacterial contamination, and complicates surgical debridement.',
    conclusion: 'Evidence-based burn first aid requires immediate cooling under running clean tap water (10–20°C) for 20 minutes—never pantry products.',
    detailedExplanation: [
      'Thermal burns damage cutaneous epithelial layers through thermal energy transfer. The primary first-aid objective is halting deep tissue heat dissipation and dermal ischemia.',
      'Butter, oils, and grease are thermal insulators; applying them acts as an occlusive blanket that traps residual heat within the dermal microvasculature, extending partial-thickness burns into full-thickness necrosis.',
      'Toothpaste contains abrasives (calcium carbonate, silica), flavoring agents (menthol), and detergents (sodium lauryl sulfate) that induce chemical irritation and severe tissue inflammation in denuded skin.'
    ],
    scientificEvidence: [
      'International Society for Burn Injuries (ISBI) Practice Guidelines explicitly mandate 20 minutes of cool running water and forbid any unsterile topical pantry substances.',
      'Emergency department observational studies show higher rates of secondary wound infection, delayed re-epithelialization, and traumatic mechanical debridement when butter or flour must be washed out of open burns.'
    ],
    risksAndLimitations: [
      'Deep Tissue Necrosis: Heat trapped by fatty layers converts superficial burns into deep full-thickness injuries.',
      'Severe Infection: Raw flour and butter harbor bacterial spores and pathogens that thrive in warm necrotic burn eschar.'
    ],
    sources: [
      {
        title: 'ISBI Practice Guidelines for Burn Care',
        citation: 'Burns, International Society for Burn Injuries, 42(5):953–1021.',
        url: 'https://www.sciencedirect.com/journal/burns'
      },
      {
        title: 'First aid for burn injuries: a systematic review and clinical consensus',
        citation: 'Emergency Medicine Australasia, 31(5):710–717.',
        url: 'https://onlinelibrary.wiley.com'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: true,
    featured: false
  },
  {
    id: 'cold-water-immersion-recovery',
    title: 'Ice Baths and Cold Plunges: Do They Accelerate Muscle Growth and Tissue Repair?',
    originalClaim: 'Taking 3-to-5-minute ice baths immediately after weight lifting accelerates muscle hypertrophy and repairs microtears twice as fast.',
    claimOrigin: 'Fitness podcasts, biohacking influencers, and viral social media gym videos.',
    category: 'supplements',
    categoryLabel: 'Supplements & Herbs',
    verdict: 'unverified',
    verdictLabel: 'Unverified',
    summary: 'While cold water immersion reduces acute muscle soreness and perception of fatigue, randomized trials show post-workout ice baths blunt long-term muscle hypertrophy and strength gains by suppressing inflammatory anabolic signaling.',
    conclusion: 'Cold plunges may aid tournament recovery between close athletic events, but chronic post-lifting cold immersion actually impairs long-term muscle building.',
    detailedExplanation: [
      'Cold water immersion (CWI)—typically 10–15 minutes at 10–15°C—triggers intense cutaneous vasoconstriction, decreases core temperature, and temporarily numbs peripheral nerve conduction.',
      'While this reduces subjective delayed onset muscle soreness (DOMS) within 24–48 hours, exercise-induced muscular hypertrophy fundamentally relies on controlled inflammatory cascades and ribosome biogenesis.',
      'Post-exercise cold immersion suppresses intracellular anabolic signaling pathways—specifically the p70S6 kinase and mTORC1 pathways—and diminishes muscle protein synthesis for hours post-exercise.'
    ],
    scientificEvidence: [
      'Journal of Physiology human trials demonstrated that regular post-exercise cold water immersion blunted muscle mass and strength gains over a 12-week resistance training program compared to active recovery.',
      'Systematic review in Sports Medicine concluded that acute CWI benefits competition turnarounds (e.g., multi-match tournaments) but blunts long-term muscular adaptations.'
    ],
    risksAndLimitations: [
      'Blunted Hypertrophy: Strength athletes seeking muscle growth may experience significantly diminished gains.',
      'Cardiovascular Shock: Sudden cold immersion in unacclimated individuals can trigger the cold shock response, profound tachycardia, and cardiac arrhythmias.'
    ],
    sources: [
      {
        title: 'Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training',
        citation: 'The Journal of Physiology, 593(18):4285–4301.',
        url: 'https://physoc.onlinelibrary.wiley.com/doi/10.1113/JP270570'
      },
      {
        title: 'Cold-water immersion (cryotherapy) for preventing and treating muscle soreness after exercise',
        citation: 'Cochrane Database of Systematic Reviews, CD008262.',
        url: 'https://www.cochranelibrary.com'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: true,
    featured: true
  }
];

// Helper functions for accessing demonstration investigations
const MythRxData = {
  getAllArticles: function() {
    return DEMO_INVESTIGATIONS;
  },
  getFeaturedArticles: function() {
    return DEMO_INVESTIGATIONS.filter(item => item.featured);
  },
  getArticleById: function(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    return DEMO_INVESTIGATIONS.find(item => item.id.toLowerCase() === cleanId) || null;
  },
  getCategories: function() {
    const categoriesMap = new Map();
    DEMO_INVESTIGATIONS.forEach(item => {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          slug: item.category,
          label: item.categoryLabel
        });
      }
    });
    return Array.from(categoriesMap.values());
  }
};

// Attach to window object for vanilla JavaScript consumption across pages
window.MythRxData = MythRxData;
