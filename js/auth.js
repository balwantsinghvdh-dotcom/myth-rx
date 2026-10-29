/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Authentication, Session Lifecycle & Dynamic Navigation Controller
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenuToggle();
  initAuthUI();
  initLoginForm();
  initSignupForm();
});

let authStateSubscribed = false;

/**
 * Initializes the mobile navigation drawer toggle.
 */
function initMobileMenuToggle() {
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Checks current session state and updates navigation buttons accordingly.
 * Registers an onAuthStateChange listener once to update UI dynamically.
 */
async function initAuthUI() {
  const authPreviewNotice = document.getElementById('authPreviewNotice');
  if (authPreviewNotice && window.MythRx?.isSupabaseConfigured?.()) {
    authPreviewNotice.style.display = 'none';
  }

  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', handleLogout);
  }

  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!supabase) {
    // Supabase unconfigured or offline: guest navigation remains
    return;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session && session.user) {
      await updateNavbarForLoggedInUser(session.user);
    }

    // Subscribe to auth state transitions (guarded against duplicate listeners)
    if (!authStateSubscribed) {
      authStateSubscribed = true;
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession?.user) {
          await updateNavbarForLoggedInUser(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          restoreNavbarForGuest();
        }
      });
    }
  } catch (err) {
    console.debug('[Myth Rx Auth] Session check notice:', err.message);
  }
}

/**
 * Dynamically adjusts the navbar when an authenticated session is present.
 * Inspects user role from public.profiles to display admin shortcut when authorized.
 * @param {object} user - Supabase auth user
 */
async function updateNavbarForLoggedInUser(user) {
  const navActions = document.querySelector('.nav-actions');
  const mobileActions = document.querySelector('.mobile-only-actions');
  if (!navActions) return;

  const profile = await window.MythRx?.getCurrentUserProfile?.();
  const isAdmin = profile?.role === 'admin';
  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  const inAdminDir = window.location.pathname.includes('/admin/');

  if (inAdminDir) {
    navActions.innerHTML = `
      <span class="user-greeting" style="font-size: 0.88rem; font-weight: 600; color: var(--color-navy); margin-right: 4px;">
        <span class="verdict-badge verdict-context" style="font-size: 0.72rem; padding: 2px 6px; margin-right: 4px;">Admin Session</span>
        👤 ${escapeHTML(displayName)}
      </span>
      <a href="../user-dashboard.html" class="btn btn-secondary btn-sm" title="My Dashboard">User Dashboard</a>
      <a href="../index.html" class="btn btn-secondary btn-sm" target="_blank">&larr; View Public Site</a>
      <button id="logoutBtn" class="btn btn-outline-teal btn-sm" type="button">Log Out</button>
    `;
  } else {
    // Desktop Navigation Actions
    navActions.innerHTML = `
      <span class="user-greeting" style="font-size: 0.88rem; font-weight: 600; color: var(--color-navy); margin-right: 4px;">
        ${isAdmin ? '<span class="verdict-badge verdict-context" style="font-size: 0.72rem; padding: 2px 6px; margin-right: 4px;">Admin</span>' : ''}
        👤 ${escapeHTML(displayName)}
      </span>
      ${isAdmin ? '<a href="admin/index.html" class="btn btn-outline-teal btn-sm" title="Admin Editorial Desk">Admin Desk</a>' : ''}
      <a href="user-dashboard.html" class="btn btn-secondary btn-sm" title="My Dashboard">Dashboard</a>
      <button id="logoutBtn" class="btn btn-outline-teal btn-sm" type="button">Log Out</button>
    `;
  }

  // Mobile Drawer Actions
  if (mobileActions) {
    const dashboardHref = inAdminDir ? '../user-dashboard.html' : 'user-dashboard.html';
    const adminHref = inAdminDir ? 'index.html' : 'admin/index.html';
    mobileActions.innerHTML = `
      <a href="${dashboardHref}" class="btn btn-secondary btn-sm btn-block">👤 ${escapeHTML(displayName)} (Dashboard)</a>
      ${isAdmin ? `<a href="${adminHref}" class="btn btn-primary btn-sm btn-block">🛡️ Admin Editorial Desk</a>` : ''}
      <button id="mobileLogoutBtn" class="btn btn-outline-teal btn-sm btn-block" type="button">Log Out</button>
    `;
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', handleLogout);
    }
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Restores navbar buttons to standard guest links upon logout.
 */
function restoreNavbarForGuest() {
  const navActions = document.querySelector('.nav-actions');
  const mobileActions = document.querySelector('.mobile-only-actions');
  const inAdminDir = window.location.pathname.includes('/admin/');
  const loginHref = inAdminDir ? '../login.html' : 'login.html';
  const signupHref = inAdminDir ? '../signup.html' : 'signup.html';

  if (navActions) {
    navActions.innerHTML = `
      <a href="${loginHref}" class="btn btn-secondary btn-sm">Log In</a>
      <a href="${signupHref}" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }

  if (mobileActions) {
    mobileActions.innerHTML = `
      <a href="${loginHref}" class="btn btn-secondary btn-sm btn-block">Log In</a>
      <a href="${signupHref}" class="btn btn-primary btn-sm btn-block">Sign Up</a>
    `;
  }
}

/**
 * Handles user sign out through Supabase Auth.
 */
async function handleLogout() {
  const supabase = window.MythRx?.getSupabaseClient?.();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Myth Rx Auth] Sign out error:', err.message);
    }
  }
  // Determine relative redirect depending on whether in admin/ directory
  const inAdminDir = window.location.pathname.includes('/admin/');
  window.location.href = inAdminDir ? '../index.html' : 'index.html';
}

/**
 * Connects the login form to Supabase Auth.
 */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';

    // Validation
    if (!email || !validateEmail(email)) {
      showAuthAlert(alertBox, 'error', 'Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    if (!password) {
      showAuthAlert(alertBox, 'error', 'Please enter your account password.');
      passwordInput?.focus();
      return;
    }

    const supabase = window.MythRx?.getSupabaseClient?.();

    if (!supabase) {
      // Supabase is not configured
      showAuthAlert(
        alertBox, 
        'info', 
        '<strong>Supabase Not Yet Configured:</strong> Add your project URL and publishable anon key in <code>js/supabase.js</code> to enable live authentication.'
      );
      return;
    }

    // Submit state
    setButtonLoading(submitBtn, true, 'Signing in...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        let errorMsg = 'Invalid email or password. Please try again.';
        if (error.message.toLowerCase().includes('email not confirmed')) {
          errorMsg = 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
          errorMsg = 'Network connection error. Please verify your internet connection.';
        }
        showAuthAlert(alertBox, 'error', errorMsg);
        setButtonLoading(submitBtn, false, 'Sign In');
        return;
      }

      // Check role to redirect appropriately
      showAuthAlert(alertBox, 'success', 'Authenticated successfully! Redirecting to your dashboard...');
      
      const profile = await window.MythRx?.getCurrentUserProfile?.();
      setTimeout(() => {
        if (profile?.role === 'admin') {
          window.location.href = 'admin/index.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      }, 700);

    } catch (err) {
      showAuthAlert(alertBox, 'error', `Sign in failed: ${escapeHTML(err.message)}`);
      setButtonLoading(submitBtn, false, 'Sign In');
    }
  });
}

/**
 * Connects the signup form to Supabase Auth.
 */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('signupAlert');
    const submitBtn = document.getElementById('signupBtn');
    const nameInput = document.getElementById('signupFullName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    const termsCheck = document.getElementById('termsCheck');

    const fullName = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const password = passInput?.value || '';
    const confirmPassword = confirmInput?.value || '';

    // Validation
    if (!fullName || fullName.length < 2) {
      showAuthAlert(alertBox, 'error', 'Please enter your full name (minimum 2 characters).');
      nameInput?.focus();
      return;
    }

    if (!email || !validateEmail(email)) {
      showAuthAlert(alertBox, 'error', 'Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    if (!password || password.length < 8) {
      showAuthAlert(alertBox, 'error', 'Password must be at least 8 characters in length.');
      passInput?.focus();
      return;
    }

    if (password !== confirmPassword) {
      showAuthAlert(alertBox, 'error', 'Passwords do not match. Please verify both password fields.');
      confirmInput?.focus();
      return;
    }

    if (termsCheck && !termsCheck.checked) {
      showAuthAlert(alertBox, 'error', 'You must agree to the Editorial Terms & Medical Disclaimer to create an account.');
      termsCheck?.focus();
      return;
    }

    const supabase = window.MythRx?.getSupabaseClient?.();

    if (!supabase) {
      showAuthAlert(
        alertBox, 
        'info', 
        '<strong>Supabase Not Yet Configured:</strong> Add your project URL and publishable anon key in <code>js/supabase.js</code> to enable live registration.'
      );
      return;
    }

    setButtonLoading(submitBtn, true, 'Creating account...');

    try {
      // Role is NEVER passed or trusted here. The database trigger on_auth_user_created strictly hardcodes role = 'user'.
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName
          }
        }
      });

      if (error) {
        let msg = error.message;
        if (msg.toLowerCase().includes('user already registered')) {
          msg = 'An account with this email address already exists. Please sign in instead.';
        }
        showAuthAlert(alertBox, 'error', msg);
        setButtonLoading(submitBtn, false, 'Create Free Account');
        return;
      }

      // Check if session was returned or email confirmation is required
      if (data.session) {
        showAuthAlert(alertBox, 'success', 'Account created and verified! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = 'user-dashboard.html';
        }, 1000);
      } else {
        showAuthAlert(
          alertBox, 
          'success', 
          '<strong>Account created successfully!</strong> Please check your email inbox to confirm your address before logging in.'
        );
        form.reset();
        setButtonLoading(submitBtn, false, 'Create Free Account');
      }

    } catch (err) {
      showAuthAlert(alertBox, 'error', `Sign up failed: ${escapeHTML(err.message)}`);
      setButtonLoading(submitBtn, false, 'Create Free Account');
    }
  });
}

/**
 * Standardized alert renderer for auth forms.
 */
function showAuthAlert(alertBox, type, message) {
  if (!alertBox) return;
  alertBox.style.display = 'block';
  alertBox.className = 'medical-disclaimer-box';

  if (type === 'error') {
    alertBox.style.backgroundColor = '#FEF2F2';
    alertBox.style.borderLeftColor = '#DC2626';
    alertBox.style.color = '#991B1B';
  } else if (type === 'success') {
    alertBox.style.backgroundColor = '#F0FDF4';
    alertBox.style.borderLeftColor = '#16A34A';
    alertBox.style.color = '#166534';
  } else {
    // Info
    alertBox.style.backgroundColor = '#EFF6FF';
    alertBox.style.borderLeftColor = '#3B82F6';
    alertBox.style.color = '#1E40AF';
  }

  alertBox.innerHTML = message;
}

/**
 * Helper to toggle button loading state.
 */
function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = text;
}

/**
 * Validates email format.
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper to prevent XSS when rendering user-generated strings in DOM.
 * @param {string} str 
 * @returns {string} Sanitized string
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Attach to namespace
window.MythRx = window.MythRx || {};
window.MythRx.handleLogout = handleLogout;
window.MythRx.escapeHTML = escapeHTML;
