# Myth Rx — Phase 4: Frontend–Supabase Integration Guide

## Overview

In **Phase 4**, all user-facing and administrator interfaces of **Myth Rx: Busting Health Hoaxes** have been connected to the Supabase backend. This integration operates directly on top of the hardened Phase 3 database schema, Row Level Security (RLS) policies, and security patches without altering existing migrations or weakening database security.

---

## 1. Project Architecture & Configuration

### Live Project Configuration
The project is currently connected to your live Supabase project:
- **Project URL:** `https://vsetsdbxfmbamrzzxknt.supabase.co`
- **Project Key:** Public `anon` JWT key (configured in [`js/supabase.js`](../js/supabase.js))
- **Live Database Connection:** Verified (HTTP 200 with seeded categories)

To update or point to another project:
1. Open your [Supabase Dashboard](https://app.supabase.com).
2. Select your Myth Rx project.
3. Navigate to **Project Settings** &rarr; **API**.
4. Update `SUPABASE_URL_DEFAULT` and `SUPABASE_ANON_KEY_DEFAULT` in [`js/supabase.js`](../js/supabase.js).

> [!WARNING]
> **NEVER** paste your `service_role` secret key into [`js/supabase.js`](../js/supabase.js) or any frontend code! The `anon` publishable key is safe for client-side browsers because all access is strictly enforced by PostgreSQL Row Level Security (RLS) policies.

### Local Testing Override (Browser Console)
You can also set credentials without modifying code directly by opening the browser developer console (F12) on any page:
```javascript
localStorage.setItem('MYTHRX_SUPABASE_URL', 'https://your-project.supabase.co');
localStorage.setItem('MYTHRX_SUPABASE_ANON_KEY', 'your-anon-key');
location.reload();
```

---

## 2. How to Run the Website Locally

Myth Rx uses standard HTML5, CSS3, and Vanilla JavaScript.

Run any local static file server from the project root directory:

Using `npx serve`:
```bash
npx -y serve -l 3000 .
```

Or using Python:
```bash
python -m http.server 3000
```

Open `http://localhost:3000` in any web browser.

---

## 3. Connected Features & Workflows

| Page | Supabase Connection | Feature Details |
| :--- | :--- | :--- |
| `index.html` | Supabase Auth & Search Bridge | Dynamic navbar showing authenticated user session and role; homepage search bridge to archive. |
| `investigations.html` | `public.investigations` & `public.categories` | Retrieves published investigations (`status = 'published'`); multi-filter engine (keywords, category chips, verdict badges). Fallback demo mode with honest disclosure banner if unconfigured. |
| `article.html` | `public.investigations`, `public.sources`, `public.bookmarks` | Retrieves single fact-check by slug/UUID; loads related peer-reviewed citations; interactive bookmark button. |
| `signup.html` | Supabase Auth (`signUp`) | Full validation, email format check, password confirmation check, metadata passing. Triggers database profile creation (`role = 'user'`). |
| `login.html` | Supabase Auth (`signInWithPassword`) | Authenticates credentials; queries `public.profiles` for `role`; intelligent redirect (`admin` &rarr; `admin/index.html`, `user` &rarr; `user-dashboard.html`). |
| `user-dashboard.html` | `public.profiles`, `public.bookmarks`, `public.submissions_user_view` | Displays and updates user `display_name`; displays user's own bookmarks (with remove button); displays user's own submissions; includes quick claim submission form. |
| `contact.html` | `public.submissions` | Public claim intake supporting anonymous submissions (`user_id = null`) and authenticated submissions (`user_id = auth.uid()`). Direct email guidance for editorial inquiries. |
| `admin/index.html` | `public.investigations`, `public.submissions` | Overview metric counters; calls `public.get_admin_submissions()` to display recent incoming claims queue. |
| `admin/submissions.html` | `public.get_admin_submissions()`, `public.submissions` | Lists all community claims with submitter and date; modal moderation tool allowing status change and editing private `admin_notes`. |
| `admin/articles.html` | `public.investigations`, `public.sources`, `public.categories` | Lists all investigations (draft and published); full authoring form to draft/publish new fact-checks and save peer-reviewed citations. |

---

## 4. How to Create and Verify an Administrator Account

Because ordinary users can never elevate their own role through frontend code or forms (strictly blocked by trigger `trg_protect_profile_fields` and column-level privileges), creating an administrator is done safely via the Supabase Dashboard:

1. **Sign Up via the Website:**
   - Go to `http://localhost:3000/signup.html`.
   - Enter your name (e.g. `Editorial Admin`), email, and password.
   - Click **Create Free Account**.
2. **Promote the Account in Supabase SQL Editor:**
   - Open your Supabase Dashboard &rarr; **SQL Editor**.
   - Run the following update query replacing the email with your address:
     ```sql
     UPDATE public.profiles
     SET role = 'admin'
     WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com');
     ```
3. **Verify Admin Privileges:**
   - Sign in at `http://localhost:3000/login.html`.
   - You will automatically be routed to `admin/index.html`.
   - The top navigation bar will display the **Admin Desk** badge.
   - The moderation panel at `admin/submissions.html` will successfully execute `public.get_admin_submissions()`.

---

## 5. Distinction Between Demo Mode & Live Database Content

- **Live Database Mode:** Activated automatically when valid credentials are provided in [`js/supabase.js`](../js/supabase.js). The archive displays the badge `(Live Database)` and streams records directly from PostgreSQL.
- **Demonstration Mode:** If credentials remain as placeholders, the application runs in an explicit **Demonstration Mode** using [`js/data.js`](../js/data.js). An honest blue alert banner is displayed:
  > *"Demonstration Mode: Displaying static preview dataset. Add your live Supabase credentials in js/supabase.js to stream records directly from the database."*
- If the live database returns 0 records, the system **never fabricates fake records**; it displays a genuine empty state: *"No published investigations in database yet."*

---

## 6. Testing Results & Verification

### Static Verification Suite
Executed via `node scratch/test_phase4.js`:
- **Total Checks:** 91
- **Passed:** 91 (100% Pass Rate)
- **Failed:** 0
- **Verifications:**
  - Syntax parsing of all JavaScript controllers (`supabase.js`, `auth.js`, `investigations.js`, `article.js`, `user-dashboard.js`, `admin.js`, `data.js`).
  - Script tags, stylesheet links, and unique DOM element IDs across all 11 HTML pages.
  - Absence of `service_role` keys in client-side code.
  - XSS defense and safe DOM construction across dynamic renderers.

### Phase 3 SQL Security Suite Integrity
Executed via `node scratch/test_phase3_sql.js`:
- **Total Checks:** 22
- **Passed:** 22 (100% Pass Rate)
- **Failed:** 0
- **Verifications:**
  - Phase 3 security assertions remain completely intact.
  - `001_initial_schema.sql`, `002_security_patch.sql`, `seed.sql`, and `security_tests.sql` are preserved without regressions.
