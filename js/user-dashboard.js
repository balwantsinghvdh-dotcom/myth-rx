/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * User Dashboard Controller (Real Supabase Profiles, Bookmarks & Submissions)
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initUserDashboard();
  initQuickSubmitToggle();
  document.getElementById('dashSidebarLogoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof window.MythRx?.handleLogout === 'function') {
      window.MythRx.handleLogout();
    }
  });
});

/**
 * Handles tab switching between Bookmarks, Submissions, and Profile.
 */
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show matching tab content
      tabContents.forEach((content) => {
        if (content.id === targetTabId) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Main dashboard initialization and live Supabase data loading.
 */
async function initUserDashboard() {
  const noticeBox = document.getElementById('sessionNoticeBox');
  const supabase = window.MythRx?.getSupabaseClient?.();

  // 1. Check if Supabase is configured
  if (!supabase) {
    if (noticeBox) {
      noticeBox.innerHTML = `
        <div class="medical-disclaimer-box" style="margin-top: 0; margin-bottom: 1.5rem; background-color: #EFF6FF; border-left-color: #0D9488; color: #0F172A;">
          <strong>Reader Dashboard Preview:</strong> This dashboard is displaying sample saved bookmarks and submitted claims across multiple health domains. Add your Supabase credentials in <code>js/supabase.js</code> to sync with your database.
        </div>
      `;
    }
    initGuestDashboardPreview();
    return;
  }

  // 2. Check for active authenticated session
  const session = await window.MythRx?.getCurrentSession?.();
  if (!session || !session.user) {
    if (noticeBox) {
      noticeBox.innerHTML = `
        <div class="medical-disclaimer-box" style="margin-top: 0; margin-bottom: 1.5rem; background-color: #EFF6FF; border-left-color: #0D9488; color: #0F172A;">
          <strong>Reader Dashboard Preview:</strong> You are viewing sample reader bookmarks and submitted claims across various health domains. <a href="login.html" style="font-weight: 700; color: var(--color-teal); text-decoration: underline;">Sign in</a> to save real-time personal bookmarks and track your own submissions.
        </div>
      `;
    }
    initGuestDashboardPreview();
    return;
  }

  const user = session.user;
  const profile = await window.MythRx?.getCurrentUserProfile?.();

  // Populate sidebar user details
  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email.split('@')[0];
  const userRole = profile?.role || 'user';

  const nameElem = document.getElementById('sidebarUserName');
  const emailElem = document.getElementById('sidebarUserEmail');
  const roleElem = document.getElementById('sidebarUserRole');

  if (nameElem) nameElem.textContent = displayName;
  if (emailElem) emailElem.textContent = user.email;
  if (roleElem) roleElem.textContent = userRole === 'admin' ? '🛡️ Administrator' : 'Community Reader';

  // Setup Profile Tab
  setupProfileForm(user, profile);

  // Load Bookmarks and Submissions concurrently
  await Promise.all([
    loadUserBookmarks(user.id),
    loadUserSubmissions(user.id)
  ]);

  // Setup Quick Claim Submission form inside dashboard
  setupDashboardClaimForm(user.id);
}

/**
 * Loads user bookmarks from public.bookmarks joined with public.investigations.
 */
async function loadUserBookmarks(userId) {
  const container = document.getElementById('bookmarksContainer');
  const badge = document.getElementById('sidebarBookmarkBadge');
  const metric = document.getElementById('metricBookmarksCount');
  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!container || !supabase) return;

  try {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        id,
        created_at,
        investigations (
          id,
          title,
          slug,
          original_claim,
          summary,
          verdict,
          category_id,
          categories (
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const count = (bookmarks || []).length;
    if (badge) badge.textContent = count;
    if (metric) metric.textContent = count;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (count === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; margin: var(--space-lg) 0;">
          <div class="empty-state-icon">🔖</div>
          <h3 class="empty-state-title">No Saved Bookmarks Yet</h3>
          <p class="empty-state-text">Bookmark investigations while browsing the archive to quickly access them later or share verified facts with family.</p>
          <a href="investigations.html" class="btn btn-primary btn-sm">Browse Fact-Checks</a>
        </div>
      `;
      return;
    }

    bookmarks.forEach(bm => {
      const inv = bm.investigations;
      if (!inv) return;

      const card = document.createElement('article');
      card.className = 'card investigation-card';

      const verdictLower = (inv.verdict || 'unverified').toLowerCase();
      const catName = inv.categories?.name || 'General Health';

      card.innerHTML = `
        <div class="investigation-card-header">
          <span class="verdict-badge verdict-${escapeHTML(verdictLower)}">${escapeHTML(inv.verdict || 'Unverified')}</span>
          <span class="category-tag">${escapeHTML(catName)}</span>
        </div>
        <div class="investigation-claim-box">
          <div class="investigation-claim-label">Claim</div>
          <p class="investigation-claim-text">"${escapeHTML(inv.original_claim || '')}"</p>
        </div>
        <h3 class="investigation-title">
          <a href="article.html?id=${encodeURIComponent(inv.slug || inv.id)}">${escapeHTML(inv.title)}</a>
        </h3>
        <p class="investigation-summary">${escapeHTML(inv.summary || '')}</p>
        <div class="investigation-meta">
          <span>Saved: ${formatDate(bm.created_at)}</span>
          <div style="display: flex; gap: var(--space-xs);">
            <a href="article.html?id=${encodeURIComponent(inv.slug || inv.id)}" class="btn btn-secondary btn-sm">Read Article</a>
            <button class="btn btn-outline-teal btn-sm remove-bm-btn" data-bm-id="${escapeHTML(bm.id)}">Remove</button>
          </div>
        </div>
      `;

      const removeBtn = card.querySelector('.remove-bm-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
          if (confirm('Remove this saved bookmark?')) {
            await deleteBookmark(bm.id, userId);
          }
        });
      }

      container.appendChild(card);
    });

  } catch (err) {
    console.error('[Myth Rx] Error loading bookmarks:', err.message);
    container.innerHTML = `<div class="medical-disclaimer-box" style="grid-column: 1 / -1; background-color: #FEF2F2; color: #991B1B;">Error loading saved bookmarks: ${escapeHTML(err.message)}</div>`;
  }
}

/**
 * Deletes a bookmark for the current user.
 */
async function deleteBookmark(bookmarkId, userId) {
  const supabase = window.MythRx?.getSupabaseClient?.();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId)
      .eq('user_id', userId);

    if (error) throw error;
    await loadUserBookmarks(userId);
  } catch (err) {
    alert(`Could not remove bookmark: ${err.message}`);
  }
}

/**
 * Loads user claim submissions from public.submissions_user_view.
 */
async function loadUserSubmissions(userId) {
  const tbody = document.getElementById('submissionsTableBody');
  const badge = document.getElementById('sidebarSubmissionBadge');
  const metric = document.getElementById('metricSubmissionsCount');
  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!tbody || !supabase) return;

  try {
    // Uses submissions_user_view which excludes admin_notes and enforces RLS
    const { data: submissions, error } = await supabase
      .from('submissions_user_view')
      .select('id, claim_text, source_url, additional_context, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const count = (submissions || []).length;
    if (badge) badge.textContent = count;
    if (metric) metric.textContent = count;

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    if (count === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-muted" style="text-align: center; padding: var(--space-xl) var(--space-md);">
            You have not submitted any health claims for clinical review yet.<br>
            <button class="btn btn-primary btn-sm mt-sm" onclick="document.getElementById('openQuickSubmitBtn')?.click();">
              Submit Your First Claim
            </button>
          </td>
        </tr>
      `;
      return;
    }

    submissions.forEach(sub => {
      const tr = document.createElement('tr');

      const statusBadge = getStatusBadge(sub.status);
      const origin = sub.additional_context || sub.source_url || 'Direct Community Submission';

      tr.innerHTML = `
        <td>
          <strong>${escapeHTML(sub.claim_text)}</strong>
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">${escapeHTML(origin)}</span>
        </td>
        <td>
          <span style="font-size: 0.85rem;">${formatDate(sub.created_at)}</span>
        </td>
        <td>
          ${statusBadge}
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('[Myth Rx] Error loading user submissions:', err.message);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger" style="text-align: center;">Error loading submissions: ${escapeHTML(err.message)}</td></tr>`;
  }
}

/**
 * Returns formatted HTML badge for submission status.
 */
function getStatusBadge(status) {
  switch (status) {
    case 'pending':
      return '<span class="verdict-badge verdict-context" style="font-size: 0.72rem;">Pending Intake</span>';
    case 'under_review':
      return '<span class="verdict-badge verdict-misleading" style="font-size: 0.72rem;">In Clinical Review</span>';
    case 'accepted':
      return '<span class="verdict-badge verdict-supported" style="font-size: 0.72rem;">Fact-Check Published</span>';
    case 'rejected':
      return '<span class="verdict-badge verdict-false" style="font-size: 0.72rem;">Out of Scope</span>';
    default:
      return `<span class="verdict-badge" style="font-size: 0.72rem;">${escapeHTML(status)}</span>`;
  }
}

/**
 * Handles profile form submission and display_name updates.
 */
function setupProfileForm(user, profile) {
  const form = document.getElementById('profileForm');
  const nameInput = document.getElementById('profileFullName');
  const emailInput = document.getElementById('profileEmail');
  const roleInput = document.getElementById('profileRole');
  const alertBox = document.getElementById('profileAlert');

  if (!form) return;

  if (nameInput) nameInput.value = profile?.display_name || user.user_metadata?.full_name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (roleInput) roleInput.value = profile?.role || 'user';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = nameInput?.value.trim();

    if (!newName || newName.length < 2) {
      showDashboardAlert(alertBox, 'error', 'Full Name must be at least 2 characters.');
      nameInput?.focus();
      return;
    }

    const supabase = window.MythRx?.getSupabaseClient?.();
    if (!supabase) return;

    const submitBtn = document.getElementById('saveProfileBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    try {
      // Allowed by RLS policy "Users can update own display name" and column grant
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newName })
        .eq('id', user.id);

      if (error) throw error;

      showDashboardAlert(alertBox, 'success', 'Profile updated successfully!');
      const nameSidebar = document.getElementById('sidebarUserName');
      if (nameSidebar) nameSidebar.textContent = newName;

    } catch (err) {
      showDashboardAlert(alertBox, 'error', `Could not update profile: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Profile Changes';
      }
    }
  });
}

/**
 * Handles Quick Submit Claim form in User Dashboard.
 */
function setupDashboardClaimForm(userId) {
  const form = document.getElementById('dashboardClaimForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const claimInput = document.getElementById('dashClaimText');
    const urlInput = document.getElementById('dashSourceUrl');
    const contextInput = document.getElementById('dashContext');
    const alertBox = document.getElementById('dashClaimAlert');
    const submitBtn = document.getElementById('dashClaimSubmitBtn');

    const claimText = claimInput?.value.trim() || '';
    const sourceUrl = urlInput?.value.trim() || null;
    const additionalContext = contextInput?.value.trim() || null;

    if (!claimText || claimText.length < 10) {
      showDashboardAlert(alertBox, 'error', 'Please enter a health claim statement of at least 10 characters.');
      claimInput?.focus();
      return;
    }

    const supabase = window.MythRx?.getSupabaseClient?.();
    if (!supabase) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      // Authenticated user inserts own claim (RLS policy enforces user_id=auth.uid() and status='pending')
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          user_id: userId,
          claim_text: claimText,
          source_url: sourceUrl,
          additional_context: additionalContext,
          status: 'pending'
        });

      if (error) throw error;

      showDashboardAlert(alertBox, 'success', 'Claim submitted successfully to the editorial review desk!');
      form.reset();

      // Refresh submissions table
      await loadUserSubmissions(userId);

      setTimeout(() => {
        const card = document.getElementById('quickSubmitCard');
        if (card) card.style.display = 'none';
        if (alertBox) alertBox.style.display = 'none';
      }, 2000);

    } catch (err) {
      showDashboardAlert(alertBox, 'error', `Submission error: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Claim';
      }
    }
  });
}

function initQuickSubmitToggle() {
  const openBtn = document.getElementById('openQuickSubmitBtn');
  const cancelBtn = document.getElementById('cancelQuickSubmitBtn');
  const sidebarBtn = document.getElementById('sidebarSubmitClaimBtn');
  const card = document.getElementById('quickSubmitCard');

  const toggle = () => {
    if (card) {
      const isVisible = card.style.display !== 'none';
      card.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        // Switch to Submissions tab
        const subTabBtn = document.querySelector('.tab-btn[data-tab="tab-submissions"]');
        subTabBtn?.click();
        document.getElementById('dashClaimText')?.focus();
      }
    }
  };

  openBtn?.addEventListener('click', toggle);
  cancelBtn?.addEventListener('click', () => { if (card) card.style.display = 'none'; });
  sidebarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
}

function showDashboardAlert(alertBox, type, message) {
  if (!alertBox) return;
  alertBox.style.display = 'block';
  alertBox.className = 'medical-disclaimer-box';

  if (type === 'error') {
    alertBox.style.backgroundColor = '#FEF2F2';
    alertBox.style.borderLeftColor = '#DC2626';
    alertBox.style.color = '#991B1B';
  } else {
    alertBox.style.backgroundColor = '#F0FDF4';
    alertBox.style.borderLeftColor = '#16A34A';
    alertBox.style.color = '#166534';
  }

  alertBox.innerHTML = message;
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * Initializes the dashboard view in preview / guest mode with full interactivity.
 */
function initGuestDashboardPreview() {
  const bookmarks = document.querySelectorAll('#bookmarksContainer .investigation-card');
  const submissions = document.querySelectorAll('#submissionsTableBody tr');

  const bmCount = bookmarks.length;
  const subCount = submissions.length;

  const bmBadge = document.getElementById('sidebarBookmarkBadge');
  const bmMetric = document.getElementById('metricBookmarksCount');
  const subBadge = document.getElementById('sidebarSubmissionBadge');
  const subMetric = document.getElementById('metricSubmissionsCount');

  if (bmBadge) bmBadge.textContent = bmCount;
  if (bmMetric) bmMetric.textContent = bmCount;
  if (subBadge) subBadge.textContent = subCount;
  if (subMetric) subMetric.textContent = subCount;

  // Setup interactive remove buttons on pre-rendered bookmarks
  document.querySelectorAll('.remove-bm-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.investigation-card');
      if (card) {
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          card.remove();
          const remaining = document.querySelectorAll('#bookmarksContainer .investigation-card').length;
          if (bmBadge) bmBadge.textContent = remaining;
          if (bmMetric) bmMetric.textContent = remaining;
        }, 200);
      }
    });
  });

  // Setup guest quick claim submission
  const claimForm = document.getElementById('dashboardClaimForm');
  const claimText = document.getElementById('dashClaimText');
  const claimContext = document.getElementById('dashContext');
  const claimAlert = document.getElementById('dashClaimAlert');
  const tbody = document.getElementById('submissionsTableBody');

  if (claimForm && claimText && tbody) {
    claimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = claimText.value.trim();
      const ctx = (claimContext ? claimContext.value.trim() : '') || 'Direct Reader Submission';
      if (!text || text.length < 10) return;

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><strong>${escapeHTML(text)}</strong></td>
        <td><span style="font-size: 0.85rem; color: var(--color-text-muted);">${escapeHTML(ctx)}</span></td>
        <td><span style="font-size: 0.85rem;">Just now</span></td>
        <td><span class="verdict-badge verdict-context" style="font-size: 0.72rem;">Pending Intake</span></td>
      `;
      tbody.prepend(newRow);

      const newTotal = tbody.querySelectorAll('tr').length;
      if (subBadge) subBadge.textContent = newTotal;
      if (subMetric) subMetric.textContent = newTotal;

      claimForm.reset();
      const card = document.getElementById('quickSubmitCard');
      if (card) card.style.display = 'none';

      if (claimAlert) {
        claimAlert.style.display = 'block';
        claimAlert.className = 'medical-disclaimer-box';
        claimAlert.style.backgroundColor = '#ECFDF5';
        claimAlert.style.borderLeftColor = '#10B981';
        claimAlert.style.color = '#065F46';
        claimAlert.innerHTML = '✓ Claim received! Our clinical review team has queued this health rumor for scientific evidence analysis.';
      }
    });
  }
}
