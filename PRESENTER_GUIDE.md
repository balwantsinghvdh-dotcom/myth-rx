# Myth Rx: Busting Health Hoaxes — Evaluation Panel Presenter Guide

This guide provides a structured, 4–6 minute walkthrough designed for presenting Myth Rx to a three-member academic college evaluation panel.

---

## Presentation Overview & Objectives

- **Project Name:** Myth Rx: Busting Health Hoaxes
- **Domain:** Academic Health Misinformation Fact-Checking & Digital Investigation
- **Target Audience:** College Evaluation Committee / Panel
- **Demonstration Time:** 4–6 minutes
- **Core Message:** "Myth Rx is an evidence-first digital journalism platform that systematically intakes viral health claims, applies rigorous clinical evaluation using peer-reviewed sources, and publishes structured, accessible verdicts protected by PostgreSQL Row Level Security."

---

## 4–6 Minute Demonstration Walkthrough

### Step 1: Problem Introduction (1 Minute)
- **URL:** [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **Talking Points:**
  - Online health misinformation (WhatsApp forwards, viral social media posts) causes real-world physical harm when patients delay clinical treatment in favor of unproven remedies.
  - Existing search engines and blogs return conflicting advice or commercial products.
  - Myth Rx operates as a dedicated **Health Claim Investigation Desk** modeled on investigative science journalism.
- **On Screen:**
  - Show the editorial hero banner: *"Question the claim. Follow the evidence."*
  - Point to the 4-stage transparent review workflow: **Claim received &rarr; Evidence reviewed &rarr; Verdict assessed &rarr; Findings published**.
  - Highlight the explicit disclaimer: *"Claims are not verified upon receipt. Every claim undergoes clinical review before publication."*

### Step 2: Investigation Discovery & Search (45 Seconds)
- **URL:** [http://localhost:3000/investigations.html](http://localhost:3000/investigations.html)
- **Action:**
  - Type `ginger` or `kidney` into the search box.
  - Click the **✓ Supported**, **✕ False**, or **▲ Misleading** verdict chips to demonstrate instant filtering.
- **Talking Points:**
  - Published investigations are categorized by health domain (e.g., WhatsApp Forwards, Nutrition & Diet, Cancer Claims) and standardized verdict categories.
  - Readers can rapidly confirm whether a viral remedy has clinical backing or poses health risks.

### Step 3: Deep-Dive into an Investigation Article (1 Minute)
- **URL:** [http://localhost:3000/article.html?id=ginger-kidney-stones](http://localhost:3000/article.html?id=ginger-kidney-stones)
- **Action:**
  - Scroll through the article sections:
    1. **Original Viral Claim Quote:** What the public received online.
    2. **Scientific Verdict Banner:** Clear visual indication (`False / Hoax`).
    3. **Clinical Breakdown & Biological Mechanism:** Why the claim fails physiologically.
    4. **Risks and Clinical Limitations:** Patient dangers of relying on unverified remedies.
    5. **Peer-Reviewed Sources:** Direct academic citations from PubMed, AUA, and Cochrane.
    6. **Sharing & Bookmarking:** One-click WhatsApp sharing to refute hoaxes directly inside chat groups.
- **Talking Points:**
  - Myth Rx never presents arbitrary opinions; every verdict is supported by transparent peer-reviewed citations.

### Step 4: Community Claim Submission & Demo-Fill (45 Seconds)
- **URL:** [http://localhost:3000/contact.html#submit-claim](http://localhost:3000/contact.html#submit-claim)
- **Action:**
  - Click the **"🧪 Try with Sample Claim"** button.
  - Show that the form safely populates:
    - Sample Claim: *"Drinking a particular herbal drink is claimed to dissolve kidney stones within 48 hours."*
    - Context: *"Example submitted for demonstrating the claim-review workflow."*
  - Mention that this button **only fills the form** and does **not auto-submit** to the database without explicit user action.
  - Click **"Submit Claim for Evaluation"** to transmit the record to Supabase.
  - Show the confirmation alert: *"Claim Received by Clinical Desk"*.

### Step 5: Administrator Investigation Desk & Moderation Queue (1 Minute)
- **URL:** [http://localhost:3000/admin/submissions.html](http://localhost:3000/admin/submissions.html)
- **Action:**
  - Show the live review queue with dynamic tab counts for all 5 statuses:
    - *All Submissions*
    - *Pending Intake*
    - *In Clinical Review*
    - *Fact-Check Accepted*
    - *Rejected / Out of Scope*
  - Use the search bar to filter by keywords (e.g. `papaya` or `kidney`).
  - Click **"Moderate"** on a pending claim.
  - In the modal:
    1. Change status from `pending` to `under_review`.
    2. Add an internal clinical note: *"Assigning to reviewer for biochemical literature analysis."*
    3. Click **"Save Moderation Decision"**.
  - Show that the decision is saved via the secure PostgreSQL RPC `public.update_admin_submission()`.
  - Point to the updated badge and the notification banner confirming the status change.

### Step 6: Investigation Authoring & Draft Management (45 Seconds)
- **URL:** [http://localhost:3000/admin/new-investigation.html](http://localhost:3000/admin/new-investigation.html)
- **Action:**
  - Click the **"🧪 Load Example Investigation"** button.
  - Show how the 6-stage workflow is populated with safe demonstration data:
    1. Basic Information (Headline & permalink slug)
    2. Original Health Claim
    3. Clinical Summary & In-Depth Explanation
    4. Verdict (`False`) & Category
    5. Peer-Reviewed Citations
    6. Status set strictly to `draft` (internal only, unpublished)
  - Point out that clicking this button does **not** auto-publish unverified content.
  - Click **"Save Draft"** to store the draft securely in Supabase.

### Step 7: Technology Stack & Security Architecture (30 Seconds)
- **Architecture Highlights:**
  - **Frontend:** Semantic HTML5, Vanilla CSS3 (Investigation Desk design system, responsive layout), Vanilla ES6+ JavaScript. No bloated heavy frameworks.
  - **Database & Auth:** Supabase PostgreSQL with strict Row Level Security (RLS).
  - **Security Highlights:**
    - Non-admins and anonymous users can only read `status = 'published'` investigations.
    - Anonymous readers can submit claims into `public.submissions` but cannot view other readers' private submissions or admin moderation notes.
    - Status and private notes mutations are strictly gated by the server-side `SECURITY DEFINER` function `public.update_admin_submission()`, which executes `public.is_admin()` before making changes.
    - `EXECUTE` privilege is revoked from `PUBLIC` and `anon`.

---

## Presenter Quick Reference URLs

| Page | URL | Purpose |
|---|---|---|
| Public Homepage | [http://localhost:3000/index.html](http://localhost:3000/index.html) | Editorial identity & 4-step workflow |
| Investigations Archive | [http://localhost:3000/investigations.html](http://localhost:3000/investigations.html) | Multi-criteria search and verdict filtering |
| Investigation Article | [http://localhost:3000/article.html?id=ginger-kidney-stones](http://localhost:3000/article.html?id=ginger-kidney-stones) | Clinical evidence, verdict, and citations |
| Claim Submission | [http://localhost:3000/contact.html#submit-claim](http://localhost:3000/contact.html#submit-claim) | Crowdsourced claim intake with demo-fill |
| Admin Overview | [http://localhost:3000/admin/index.html](http://localhost:3000/admin/index.html) | Real database metrics and quick actions |
| Submissions Queue | [http://localhost:3000/admin/submissions.html](http://localhost:3000/admin/submissions.html) | Secure administrative status moderation |
| Investigation Editor | [http://localhost:3000/admin/new-investigation.html](http://localhost:3000/admin/new-investigation.html) | 6-stage authoring with demo-fill |

---

## Troubleshooting & Recovery Steps

### 1. Browser shows "Connection Refused"
- **Cause:** Local web server is not running.
- **Fix:** In PowerShell/terminal, run:
  ```powershell
  npx -y serve -l 3000 .
  ```
  Then reload [http://localhost:3000](http://localhost:3000).

### 2. Moderation Modal shows "Configuration Error (PGRST202 / 42883)"
- **Cause:** Migration `003_admin_moderation.sql` has not been executed in the live Supabase project yet.
- **Fix:** Open the Supabase Dashboard &rarr; SQL Editor &rarr; paste and run the contents of `supabase/migrations/003_admin_moderation.sql`.

### 3. Claim Submission shows "Could not reach database"
- **Cause:** Network interruption or Supabase API key misconfiguration in `js/supabase.js`.
- **Fix:** Verify internet connectivity and check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `js/supabase.js` match your Supabase project settings. The form also includes an honest demonstration mode if offline.

### 4. Admin Panel shows "Access Denied"
- **Cause:** Current user is logged in with a non-admin account.
- **Fix:** Log in with an account that has `role = 'admin'` in `public.profiles`. To test public features, click the "Return to Public Site" link.
