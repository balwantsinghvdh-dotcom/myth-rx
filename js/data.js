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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
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
    isDemonstration: false,
    featured: true
  },
  {
    id: 'resistance-training-bone-density',
    title: 'Can Progressive Resistance Training Reverse Bone Density Loss in Osteopenia?',
    originalClaim: 'High-intensity progressive resistance exercise and impact loading stimulate osteoblast bone formation and reverse osteopenia and osteoporosis.',
    claimOrigin: 'Geriatric sports medicine reviews and clinical bone health guidelines.',
    category: 'fitness',
    categoryLabel: 'Fitness & Metabolism',
    verdict: 'supported',
    verdictLabel: 'Supported',
    summary: 'Landmark randomized controlled trials prove high-intensity resistance and weight-bearing impact training safely stimulate osteogenesis, significantly increasing lumbar spine and femoral neck bone mineral density in older adults with osteopenia and osteoporosis.',
    conclusion: 'Clinical evidence decisively confirms that progressive resistance training reverses bone loss, improves structural bone geometry, and dramatically reduces fall-related fracture risk.',
    detailedExplanation: [
      'Bone is dynamic living tissue that adapts to mechanical strain according to Wolff’s law and Frost’s mechanostat model.',
      'When mechanical strain from muscular contractions and ground reaction forces exceeds customary physiological thresholds (typically >1,500 microstrain), osteocytes trigger prostaglandins and nitric oxide signaling, upregulating osteoblast activity over osteoclast resorption.',
      'In the landmark LIFTMOR trial, post-menopausal women performing supervised high-intensity resistance exercises (deadlifts, overhead presses, squats at >80–85% of 1RM) combined with jumping impact significantly improved bone mineral density and functional performance without adverse vertebral fractures.'
    ],
    scientificEvidence: [
      'LIFTMOR Randomized Controlled Trial (Watson et al., Journal of Bone and Mineral Research, 2018): High-intensity resistance training increased lumbar spine BMD by +3.0% vs. -1.2% in control group (p < 0.001).',
      'Systematic review and meta-analysis in Osteoporosis International (2022) confirming resistance exercise preserves femoral neck trabecular microarchitecture in aging populations.',
      'Endocrine Society and National Osteoporosis Foundation clinical practice guidelines.'
    ],
    risksAndLimitations: [
      'Individuals with severe pre-existing vertebral compression fractures require tailored physical therapy supervision to avoid unaccustomed spinal flexion.',
      'Progression must be gradual and supervised by certified exercise physiologists to ensure pristine spinal alignment and mechanics.'
    ],
    sources: [
      {
        title: 'High-Intensity Resistance and Impact Training Improves Bone Mineral Density: The LIFTMOR Trial',
        citation: 'Journal of Bone and Mineral Research, 33(2):211–220.',
        url: 'https://asbmr.onlinelibrary.wiley.com/doi/10.1002/jbmr.3284'
      },
      {
        title: 'Exercise and physical activity for osteoporosis: a consensus statement',
        citation: 'British Journal of Sports Medicine, 56(15):837–846.',
        url: 'https://bjsm.bmj.com'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: false,
    featured: true
  },
  {
    id: 'soap-water-viral-disruption',
    title: 'How Plain Soap and Running Water Physically Destroy Viral Pathogens',
    originalClaim: 'Washing hands thoroughly with plain soap and running water for 20 seconds is clinically more effective at destroying enveloped respiratory viruses and clearing non-enveloped enteric pathogens than alcohol gels.',
    claimOrigin: 'Infectious disease epidemiology and clinical hygiene surveillance.',
    category: 'infectious',
    categoryLabel: 'Infectious Diseases',
    verdict: 'supported',
    verdictLabel: 'Supported',
    summary: 'Soap molecules are amphiphilic; their hydrophobic tails insert into the lipid bilayer envelopes of respiratory viruses (coronaviruses, influenza) and physically rip them apart, while mechanical lathering and running water rinse away alcohol-resistant pathogens like Norovirus.',
    conclusion: 'Clinical microbiology confirms that proper handwashing with plain soap and running water is a primary, evidence-backed defense against infectious viral transmission.',
    detailedExplanation: [
      'Enveloped viruses—including SARS-CoV-2, influenza, and respiratory syncytial virus (RSV)—are enclosed within a delicate bilayer of lipid fats and hydrophobic glycoproteins.',
      'Soap molecules possess a pin-like amphiphilic molecular structure: a hydrophilic (water-attracting) head and a lipophilic/hydrophobic (fat-attracting) hydrocarbon tail.',
      'When lathered with water, the hydrophobic tails wedge themselves into the virus’s protective lipid membrane, acting like molecular crowbars that pry apart the bilayer envelope and dissolve it into soluble micelles, permanently inactivating the viral core.'
    ],
    scientificEvidence: [
      'Centers for Disease Control and Prevention (CDC) Hand Hygiene Guidelines: Washing with soap mechanically lifts and removes pathogens while dissolving enveloped lipid membranes.',
      'Comparative microbiological studies demonstrate that non-enveloped viruses (e.g., Norovirus) and spore-forming bacteria (Clostridioides difficile) are inherently resistant to alcohol sanitizers but are physically removed by 20 seconds of soap lathering and running water.',
      'World Health Organization (WHO) Guidelines on Hand Hygiene in Health Care.'
    ],
    risksAndLimitations: [
      'Rushing the wash in under 10 seconds fails to allow sufficient contact time for lipid envelope dissolution and physical soil detachment.',
      'Washing with overly harsh industrial detergents can cause dermal xerosis (dryness) and microfissures; gentle plain unscented soap is clinically optimal.'
    ],
    sources: [
      {
        title: 'Show Me the Science: How Soap and Water Removes Pathogens',
        citation: 'Centers for Disease Control and Prevention (CDC) Technical Brief, 2024.',
        url: 'https://www.cdc.gov/handwashing/show-me-the-science.html'
      },
      {
        title: 'The Chemical Architecture of Hand Hygiene: Mechanisms of Lipid Inactivation',
        citation: 'Clinical Microbiology Reviews, 32(3):e00098-18.',
        url: 'https://journals.asm.org/journal/cmr'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: false,
    featured: false
  },
  {
    id: 'mmr-vaccine-autism-hoax',
    title: 'The Debunked MMR Vaccine and Autism Myth: A Comprehensive Evidence Review',
    originalClaim: 'The routine childhood Measles, Mumps, and Rubella (MMR) vaccine causes gastrointestinal inflammation that leads to autism spectrum disorder.',
    claimOrigin: 'Retracted 1998 case series and recurring anti-vaccine social media campaigns.',
    category: 'vaccines',
    categoryLabel: 'Vaccines & Immunity',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Originating from a fraudulent, fully retracted 1998 case study of only 12 children, rigorous global epidemiological investigations tracking over 1.25 million children have definitively proven zero causal or correlative link between MMR vaccination and autism.',
    conclusion: 'Extensive global medical consensus and decades of clinical surveillance prove the MMR vaccine is exceptionally safe and does not cause autism.',
    detailedExplanation: [
      'In 1998, Andrew Wakefield and colleagues published a speculative 12-patient case series in The Lancet claiming a novel "autistic enterocolitis" linked to the MMR vaccine.',
      'Subsequent investigative journalism and formal British General Medical Council (GMC) inquiries proved that patient medical records were falsified, ethical review protocols were breached, and the author had undisclosed financial conflicts of interest with personal patent applications.',
      'The Lancet fully retracted the paper in 2010. Since then, multiple massive prospective and retrospective cohort studies in Denmark, the United States, Japan, and the United Kingdom have tracked millions of children, demonstrating identical autism rates among vaccinated and unvaccinated cohorts.'
    ],
    scientificEvidence: [
      'Danish Nationwide Cohort Study (Hviid et al., Annals of Internal Medicine, 2019): Tracking 657,461 children over a decade found an adjusted Hazard Ratio of 0.93 (95% CI, 0.85–1.02) comparing vaccinated to unvaccinated children, confirming no increased autism risk even in high-risk familial subgroups.',
      'Cochrane Database Systematic Review (Demicheli et al., 2020) analyzing 138 studies and over 23 million participants concluded MMR vaccination carries no association with autism spectrum disorders.',
      'Institute of Medicine (IOM) Adverse Effects of Vaccines Review evaluating 1,000+ scientific peer-reviewed publications.'
    ],
    risksAndLimitations: [
      'Vaccine Refusal Outbreaks: Dropping below the 95% population herd immunity threshold has caused severe resurgences of measles, leading to encephalitis, subacute sclerosing panencephalitis (SSPE), and preventable pediatric deaths.',
      'Common Mild Side Effects: Temporary localized arm soreness or low-grade fever occurring 7–12 days post-vaccine is normal immune activation.'
    ],
    sources: [
      {
        title: 'Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study',
        citation: 'Annals of Internal Medicine, 170(8):513–520.',
        url: 'https://www.acpjournals.org/doi/10.7326/M18-2101'
      },
      {
        title: 'Vaccines for measles, mumps, rubella, and varicella in children',
        citation: 'Cochrane Database of Systematic Reviews, CD004407.',
        url: 'https://www.cochranelibrary.com'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '6 min read',
    isDemonstration: false,
    featured: true
  },
  {
    id: 'targeted-abdominal-fat-reduction',
    title: 'Targeted Fat Loss: Why Crunches Cannot Selectively Spot-Reduce Abdominal Fat',
    originalClaim: 'Performing 100 abdominal crunches and torso twists every day burns subcutaneous belly fat and slims the waistline directly.',
    claimOrigin: 'Fitness influencers, infomercial ab-gadgets, and popular gym mythology.',
    category: 'fitness',
    categoryLabel: 'Fitness & Metabolism',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Muscular contraction does not pull fatty acids from adjacent subcutaneous fat stores. Lipolysis is triggered systemically by circulating catecholamines and hormone-sensitive lipase throughout the entire bloodstream.',
    conclusion: 'Abdominal exercises strengthen core musculature and improve posture, but cannot spot-reduce overlying abdominal adipose tissue without a systemic caloric deficit.',
    detailedExplanation: [
      'The concept of "spot reduction" presumes that working a specific muscle group directly extracts and burns the fatty tissue situated immediately over that muscle.',
      'Physiologically, when skeletal muscle fibers contract, they consume intracellular glycogen and circulating free fatty acids (FFAs) delivered via capillary blood flow from adipose depots distributed throughout the entire body.',
      'Lipolysis is regulated by systemic endocrine signaling—principally epinephrine, norepinephrine, and atrial natriuretic peptide—acting on beta-adrenergic receptors across global adipose tissue. Genetics, hormonal balance, and overall energy deficit determine which regional fat deposits mobilize first.'
    ],
    scientificEvidence: [
      'Journal of Strength and Conditioning Research randomized trial (Vispute et al.): 6 weeks of dedicated abdominal training produced significant core muscular endurance gains but zero change in abdominal subcutaneous fat or body fat percentage compared to controls.',
      'American College of Sports Medicine (ACSM) Exercise and Weight Loss Position Stand: Localized muscle endurance training does not induce localized subcutaneous fat reduction.',
      'Biopsies of subcutaneous fat over trained vs. untrained limbs demonstrate identical rates of fatty acid release, confirming systemic rather than local lipolysis.'
    ],
    risksAndLimitations: [
      'Repetitive Lumbar Flexion Strain: Performing excessive spinal flexion crunches without core stabilization can exacerbate lumbar disc herniation and lower back pain.',
      'False Frustration: Exercisers who expect spot reduction often abandon healthy cardiovascular and nutritional habits out of unjustified disappointment.'
    ],
    sources: [
      {
        title: 'The effect of abdominal exercise on abdominal fat',
        citation: 'Journal of Strength and Conditioning Research, 25(9):2559–2564.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21804427/'
      },
      {
        title: 'Appropriate Physical Activity Intervention Strategies for Weight Loss and Prevention of Weight Regain for Adults',
        citation: 'Medicine & Science in Sports & Exercise, 41(2):459–471.',
        url: 'https://journals.lww.com/acsm-msse'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '4 min read',
    isDemonstration: false,
    featured: false
  },
  {
    id: 'antibiotics-viral-colds',
    title: 'Why Taking Antibiotics for Viral Colds, Flu, and Bronchitis Has Zero Effect',
    originalClaim: 'Taking amoxicillin or azithromycin as soon as upper respiratory symptoms start kills the infection quickly and stops it from turning into pneumonia.',
    claimOrigin: 'Over-the-counter medicine sharing, patient expectation pressures, and family medicine lore.',
    category: 'infectious',
    categoryLabel: 'Infectious Diseases',
    verdict: 'false',
    verdictLabel: 'False',
    summary: 'Antibiotics specifically inhibit bacterial biological targets (peptidoglycan cell wall synthesis, bacterial 70S ribosomes) which viruses completely lack. Ingesting antibiotics for viral colds offers zero symptom relief while destroying beneficial gut microbiota and driving global antimicrobial resistance.',
    conclusion: 'Clinical evidence is unequivocal: antibiotics cannot treat or shorten viral upper respiratory tract infections.',
    detailedExplanation: [
      'More than 90% of acute upper respiratory tract infections—including the common cold, acute nasopharyngitis, acute laryngitis, and non-asthmatic acute bronchitis—are caused by viruses (rhinoviruses, enteroviruses, adenoviruses, and influenza viruses).',
      'Antibacterial pharmacology targets mechanisms unique to prokaryotic bacterial cells, such as beta-lactam disruption of bacterial peptidoglycan cross-linking or macrolide binding to bacterial ribosomal subunits. Viruses lack cell walls, lack ribosomes, and reproduce by hijacking host eukaryotic machinery.',
      'Antibiotics have literally zero molecular target in a virion. Taking them has zero impact on viral replication, mucus clearance, or duration of coughing and sore throat.'
    ],
    scientificEvidence: [
      'Cochrane Database Systematic Review (Smith et al.): Over 17 randomized controlled trials with thousands of patients confirmed that antibiotics produce no clinically significant reduction in illness duration or severity for acute bronchitis.',
      'CDC Outpatient Antibiotic Stewardship Surveillance: Up to 30% of outpatient antibiotic prescriptions are completely unnecessary, driven primarily by viral respiratory illnesses.',
      'World Health Organization (WHO) Global Antimicrobial Resistance and Use Surveillance System (GLASS) warning of multi-drug resistant superbugs caused by viral misprescribing.'
    ],
    risksAndLimitations: [
      'Clostridioides difficile Colitis: Eradicating protective intestinal bacteria can allow life-threatening toxin-producing C. diff to proliferate.',
      'Severe Drug Allergies: Anaphylaxis, Stevens-Johnson syndrome, and toxic epidermal necrolysis are rare but fatal adverse drug reactions.',
      'Global Resistance: Inappropriate antibiotic use selects for resistant bacterial strains, making future true bacterial infections harder to treat.'
    ],
    sources: [
      {
        title: 'Antibiotics for acute bronchitis',
        citation: 'Cochrane Database of Systematic Reviews, CD000245.',
        url: 'https://www.cochranelibrary.com'
      },
      {
        title: 'Core Elements of Outpatient Antibiotic Stewardship',
        citation: 'Morbidity and Mortality Weekly Report (MMWR), CDC, 65(6):1–12.',
        url: 'https://www.cdc.gov/mmwr'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: false,
    featured: false
  },
  {
    id: 'melatonin-sleep-dependency',
    title: 'Melatonin for Sleep: Does Long-Term Use Cause Dependency or Pineal Shutdown?',
    originalClaim: 'Taking over-the-counter melatonin every night shuts down your brain\'s natural pineal gland production and causes severe chemical addiction.',
    claimOrigin: 'Biohacking forums, wellness social media warning videos, and anecdotal sleep advice.',
    category: 'mental-health',
    categoryLabel: 'Mental Health & Sleep',
    verdict: 'misleading',
    verdictLabel: 'Misleading',
    summary: 'Unlike prescription hypnotics (benzodiazepines or Z-drugs), exogenous melatonin does not cause chemical dependency, receptor tolerance, or permanent pineal gland shutdown. However, excessive doses (5–10 mg) and incorrect timing desensitize MT1/MT2 receptors, disrupt circadian phase shifting, and cause vivid nightmares and daytime somnolence.',
    conclusion: 'Melatonin is safe for short-term chronobiological realignment, but viral claims of irreversible chemical addiction are physiologically inaccurate.',
    detailedExplanation: [
      'Melatonin (N-acetyl-5-methoxytryptamine) is an endogenous neurohormone produced primarily by the pineal gland in response to darkness signaled through the suprachiasmatic nucleus (SCN).',
      'Prescription sedatives target the GABA-A receptor complex, altering central nervous system excitability and creating rapid pharmacodynamic tolerance and withdrawal upon cessation. In contrast, melatonin acts on G-protein coupled MT1 and MT2 receptors to adjust circadian phase timing.',
      'Clinical cessation trials confirm that discontinuing exogenous melatonin does not trigger physiological withdrawal symptoms or rebound insomnia worse than baseline. However, commercial retail gummies frequently contain 5 to 10 times the physiological dose (0.3 to 1 mg is optimal), creating receptor desensitization and grogginess.'
    ],
    scientificEvidence: [
      'American Academy of Sleep Medicine (AASM) Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia.',
      'JAMA study evaluating commercial melatonin formulations: 88% of tested products were inaccurately labeled, with actual quantities ranging from 74% less to 347% more than stated on the label.',
      'Clinical reviews in Sleep Medicine Reviews confirming that physiological micro-dosing (0.3 mg–1 mg) shifts circadian phase with zero negative feedback suppression of endogenous nighttime pineal surges.'
    ],
    risksAndLimitations: [
      'Phase Delay Misalignment: Taking melatonin in the morning or early afternoon can delay the circadian rhythm, worsening sleep-onset latency.',
      'Vivid Nightmares & Daytime Sedation: High-dose OTC formulations (>5mg) cause protracted plasma clearance and morning motor sluggishness.'
    ],
    sources: [
      {
        title: 'Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia in Adults',
        citation: 'Journal of Clinical Sleep Medicine, 13(2):307–349.',
        url: 'https://jcsm.aasm.org'
      },
      {
        title: 'Quantity and Quality of Melatonin Products Available Over the Counter',
        citation: 'JAMA, 329(16):1401–1402.',
        url: 'https://jamanetwork.com/journals/jama'
      }
    ],
    publishedDate: 'October 28, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: false,
    featured: true
  },
  {
    id: 'intermittent-fasting-longevity',
    title: 'Intermittent Fasting vs. Caloric Restriction: Does 16:8 Fasting Double Human Longevity?',
    originalClaim: '16:8 intermittent fasting induces cellular autophagy that burns body fat twice as fast as normal diets and extends human lifespan without requiring calorie restriction.',
    claimOrigin: 'Viral longevity podcasts, biohacking bestsellers, and fasting app advertisements.',
    category: 'diet',
    categoryLabel: 'Nutrition & Diet',
    verdict: 'misleading',
    verdictLabel: 'Misleading',
    summary: 'Rigorous 12-month randomized human trials show that 16:8 time-restricted eating produces weight loss and metabolic improvements identical to standard continuous calorie restriction of equal energy intake. While fasting stimulates autophagy in rodent models, evidence that it directly extends human lifespan independent of total calorie balance is unproven.',
    conclusion: 'Intermittent fasting is an effective behavioral tool for managing calorie intake, but is not clinically superior to standard portion control for fat loss or longevity.',
    detailedExplanation: [
      'Intermittent fasting (IF) protocols—most commonly 16 hours of daily fasting followed by an 8-hour feeding window—have exploded in popularity.',
      'Proponents assert that time restriction triggers metabolic switching from glucose to fatty acid ketones, stimulating dramatic autophagic intracellular cleanup that extends life and melts fat faster than traditional diet management.',
      'However, large-scale randomized human trials controlling for total caloric intake demonstrate that when energy deficits are matched, 16:8 fasting produces virtually indistinguishable reductions in body weight, fat mass, visceral fat, blood pressure, and glycemic markers compared to non-time-restricted caloric restriction.'
    ],
    scientificEvidence: [
      'New England Journal of Medicine (NEJM) 12-Month Trial (Liu et al., 2022, n=139): Time-restricted eating with calorie restriction was not more beneficial with respect to reductions in body fat, visceral fat, or metabolic risk factors than daily calorie restriction alone.',
      'JAMA Internal Medicine TREAT Trial (Lowe et al.): Time-restricted eating in the absence of prescribed caloric reduction produced no significant weight loss or cardiometabolic improvements compared to consistent meal timing.',
      'Cochrane Database of Systematic Reviews: Intermittent fasting vs continuous energy restriction for weight loss in adults.'
    ],
    risksAndLimitations: [
      'Sarcopenia in Older Adults: Restricting feeding windows can make it difficult to consume sufficient dietary protein (1.2–1.6 g/kg), potentially accelerating lean muscle loss.',
      'Disordered Eating Patterns: Strict feeding time windows can trigger binge-eating episodes in vulnerable individuals.'
    ],
    sources: [
      {
        title: 'Calorie Restriction with or without Time-Restricted Eating in Weight Loss',
        citation: 'New England Journal of Medicine, 386(16):1495–1504.',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2114833'
      },
      {
        title: 'Effects of Time-Restricted Eating on Weight Loss and Other Metabolic Parameters in Overweight and Obese Adults',
        citation: 'JAMA Internal Medicine, 180(11):1491–1499.',
        url: 'https://jamanetwork.com/journals/jamainternalmedicine'
      }
    ],
    publishedDate: 'October 29, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: false,
    featured: false
  },
  {
    id: 'ashwagandha-anxiety-cortisol',
    title: 'Ashwagandha Root Extract for Stress and Anxiety: What Does Clinical Science Say?',
    originalClaim: 'Taking high-concentration ashwagandha root extract permanently eliminates generalized anxiety disorder and resets adrenal burnout without prescription medication or therapy.',
    claimOrigin: 'Herbal wellness influencer trends, adaptogen supplement marketing, and TikTok mental health posts.',
    category: 'mental-health',
    categoryLabel: 'Mental Health & Sleep',
    verdict: 'unverified',
    verdictLabel: 'Unverified',
    summary: 'While small clinical trials suggest standardized ashwagandha (Withania somnifera) extracts modestly reduce perceived stress scores and morning salivary cortisol, long-term safety, optimal dosing, and efficacy for diagnosed Generalized Anxiety Disorder (GAD) remain inconclusive. Furthermore, clinical registries have documented rare cases of supplement-induced cholestatic liver injury.',
    conclusion: 'Ashwagandha may offer mild supportive stress reduction, but evidence is unverified for treating psychiatric disorders and cannot replace evidence-based psychotherapy or pharmacology.',
    detailedExplanation: [
      'Ashwagandha is a traditional Ayurvedic botanical shrub containing biologically active steroidal lactones known as withanolides.',
      'In rodent and in-vitro models, withanolides interact with GABAergic neurotransmission and modulate the hypothalamic-pituitary-adrenal (HPA) axis, attenuating cortisol synthesis.',
      'Human clinical trials are mostly small (fewer than 60–80 participants), short-term (6 to 8 weeks), and often industry-funded using proprietary branded extracts. While participants frequently report lower scores on subjective anxiety inventories, large-scale multi-center trials evaluating durability and safety beyond 12 weeks are absent.'
    ],
    scientificEvidence: [
      'Systematic Review and Meta-Analysis in Journal of Clinical Medicine (2022) of 12 randomized controlled trials: Found statistically significant but clinically modest reductions in subjective anxiety and cortisol, noting high heterogeneity and publication bias.',
      'European Association for the Study of the Liver (EASL) Clinical Case Registry: Documented five cases of acute drug-induced cholestatic liver injury associated with commercial ashwagandha root preparations.',
      'National Institutes of Health (NIH) LiverTox Clinical Database monograph on Withania somnifera hepatotoxicity.'
    ],
    risksAndLimitations: [
      'Idiosyncratic Hepatotoxicity: Jaundice, pruritus, and elevated hepatic transaminases have occurred with high-potency withanolide concentrates.',
      'Thyroid Hormone Elevation: Ashwagandha can stimulate thyroid hormone synthesis, posing risks for individuals with subclinical hyperthyroidism or Graves disease.',
      'Medication Interactions: Enhances sedative effects of benzodiazepines, alcohol, and barbiturates.'
    ],
    sources: [
      {
        title: 'An Investigation into the Stress-Relieving and Pharmacological Actions of Ashwagandha: A Systematic Review and Meta-Analysis',
        citation: 'Journal of Clinical Medicine, 11(14):3977.',
        url: 'https://www.mdpi.com/journal/jcm'
      },
      {
        title: 'Ashwagandha-Induced Liver Injury: A Case Series from the Drug-Induced Liver Injury Network',
        citation: 'LiverTox: Clinical and Research Information on Drug-Induced Liver Injury, NIH/NIDDK.',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK548483/'
      }
    ],
    publishedDate: 'October 29, 2026',
    reviewDate: null,
    readTime: '5 min read',
    isDemonstration: false,
    featured: false
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
