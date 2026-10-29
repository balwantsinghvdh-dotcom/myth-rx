# Myth Rx: Busting Health Hoaxes

**Myth Rx** is an evidence-based health misinformation fact-checking platform. It investigates viral WhatsApp forwards, social media home remedies, miracle supplements, and dubious medical claims using peer-reviewed scientific literature and clear clinical explanations.

---

## 1. Technology Architecture

This project strictly adheres to vanilla web technologies:
- **Markup:** Semantic HTML5
- **Styling:** Modular Vanilla CSS3 (Custom properties design system, flexbox, CSS grid, fully responsive)
- **Scripting:** Pure Vanilla JavaScript (ES6+)
- **Backend & Database:** Supabase (Auth, PostgreSQL Database, and Storage via official CDN client)
- **Zero Heavy Frameworks:** No React, Vue, Angular, Node.js backend frameworks, Bootstrap, or Tailwind CSS.

---

## 2. Directory & File Structure

```text
myth-rx/
├── index.html               # Public Homepage (hero, search, featured claims, methodology)
├── investigations.html      # Investigations Archive (domain and verdict filters)
├── article.html             # Individual Investigation View (claim box, clinical breakdown, citations)
├── about.html               # About & Methodology (4-step verification process, editorial standards)
├── contact.html             # Claim Submission & Contact Page (public crowdsourcing form)
├── login.html               # User Login Page
├── signup.html              # User Registration Page
├── user-dashboard.html      # User Panel (bookmarks, submitted claims, profile settings)
├── admin/
│   ├── index.html           # Admin Dashboard Overview (metrics & quick queues)
│   ├── articles.html        # Manage Investigations (investigation directory & inline authoring)
│   ├── submissions.html     # Review Submissions (crowdsourced claim evaluation)
│   └── new-investigation.html # Investigation Editor (create & edit fact-checks)
├── css/
│   ├── style.css            # Primary design tokens, typography, verdict badges, navbar & footer
│   ├── responsive.css       # Mobile/tablet breakpoints and navigation drawer
│   └── dashboard.css        # Layouts, metrics, and data tables for user & admin panels
├── js/
│   ├── supabase.js          # Supabase client setup, connection tester, and security validation
│   ├── auth.js              # Navigation drawer toggle & auth session management hooks
│   ├── investigations.js    # Client search queries, topic pills, and verdict filter logic
│   ├── user-dashboard.js    # Tab switching and bookmark management controller
│   └── admin.js             # Submission filter queues and admin preview notices
├── assets/
│   ├── images/              # Static images and infographics
│   └── icons/               # Brand and category icons
└── README.md                # Project documentation and setup guide
```

---

## 3. How to Run Locally

Because Myth Rx is built with vanilla HTML, CSS, and JavaScript, it requires no compilation or build steps.

### Option A: Using Python (Recommended)
Open PowerShell or your terminal in the project directory:
```powershell
# Python 3
python -m http.server 3000
```
Then visit: `http://localhost:3000`

### Option B: Using Node (npx)
```powershell
npx -y serve .
```
Then visit the local URL displayed (e.g. `http://localhost:3000`).

### Option C: Using IDE Live Server
If using VS Code or Antigravity IDE with a live preview server, right-click `index.html` and choose **"Open with Live Server"**.

---

## 4. Supabase Configuration (Required for Future Phases)

During **Phase 1**, all pages operate in static preview mode with valid semantic structure. In subsequent phases, you will connect Supabase by following these steps:

1. Create a project at [Supabase](https://app.supabase.com).
2. Go to **Project Settings &rarr; API**.
3. Open `js/supabase.js` and replace the placeholder credentials:
   ```javascript
   const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```

### Critical Security Rule:
> **NEVER paste your `service_role` secret key into client-side browser JavaScript.**
> Only use the `anon` (public) key. Security and user permissions are enforced via Supabase **Row-Level Security (RLS)** policies.

---

## 5. Standardized Scientific Verdict System

Myth Rx fact-checks are classified into 4 standardized public verdict tiers:
- **SUPPORTED (`.verdict-supported`):** Scientific consensus, randomized controlled trials, and clinical practice guidelines support the claim.
- **FALSE (`.verdict-false`):** Demonstrably inaccurate, contradicted by clinical trials, or physiologically impossible.
- **MISLEADING (`.verdict-misleading`):** Contains isolated laboratory observations or partial truths distorted into inaccurate health advice.
- **UNVERIFIED (`.verdict-unverified`):** Inconclusive or absent human clinical trials; preliminary cell/animal models cannot justify medical claims.

---

## 6. Project Phase Status

- [x] **Phase 1: Project Setup and Architecture**
  - Semantic HTML5, Vanilla CSS design system, and responsive breakpoints.
  - Core brand palette: Obsidian Navy (`#080E1A`), Slate 900 (`#0F172A`), Bio-Teal (`#0D9488`), Crisp Background (`#F8FAFC`).
  - Reusable glassmorphic navigation header, pulsing live radar indicator, and accessible footer.
- [x] **Phase 2: Dynamic Investigations & Frontend Fact-Checking**
  - Dynamic archive with real-time multi-filter engine (keywords, category chips, verdict badges).
  - Individual investigation detail pages with citation lists, risk analyses, and bookmarking UI.
  - Standardized medical fact-checking verdicts: Supported, False, Misleading, Unverified.
- [x] **Phase 3: Supabase Database Schema, RLS & Hardened Security**
  - Six core tables: `profiles`, `categories`, `investigations`, `sources`, `submissions`, `bookmarks`.
  - Column-level privilege restriction on `admin_notes` and `profiles.role`.
  - Security-invoker view `public.submissions_user_view`.
  - All 10 Phase 3 security assertions verified with zero failures in `supabase/security_tests.sql`.
- [x] **Phase 4: Frontend–Supabase Integration**
  - Supabase Auth lifecycle (signup, login, session persistence, role-aware routing).
  - Authenticated user dashboard (profile updates, saved bookmarks, crowdsourced submissions).
  - Administrative portal (`admin/` desk, articles authoring, submissions queue).
- [x] **Phase 5: End-to-End Testing, Security Hardening & Deployment Readiness**
  - Anonymous claim intake bug resolved (omitted `user_id` so column privileges are respected).
  - Article 404 handling fixed (non-existent slugs/UUIDs display honest not-found view).
  - Sequential migration `003_admin_moderation.sql` created for atomic `update_admin_submission` RPC.
  - Universal Quick Search (`Ctrl + K`) integrated with live database queries and local indexing.
  - High-contrast anti-washout text protection enforced across forms, inputs, and dark containers.
  - Complete deployment guide and checklist created in [`supabase/PHASE5_TESTING_AND_DEPLOYMENT.md`](supabase/PHASE5_TESTING_AND_DEPLOYMENT.md).
- [x] **Phase 6: Website Feature Completion & UI Polish**
  - Dynamic Homepage: Stream latest published investigations from Supabase with honest empty state for unpopulated databases.
  - Investigations Archive: Added interactive sorting (Newest, Oldest, Title A–Z) and paginated "Load More" controls.
  - Article Reading Experience: Universal "Copy Fact-Check Link" button with instant clipboard feedback toast.
  - User Dashboard: Dedicated sidebar logout button, persistent profile and bookmark management.
  - Universal Quick Search (Ctrl+K): Admin route-prefix awareness (`../`) preventing 404s when searching from inside `/admin/`.

