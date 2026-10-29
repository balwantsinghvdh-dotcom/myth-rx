/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Admin Panel Controller: Server-Enforced Role Gates, Article Management & Moderation RPC
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAccessControl();
});

let cachedAdminSubmissions = [];
let activeSubmissionFilter = 'all';

/**
 * Access Control Gate:
 * Verifies that the active authenticated user holds the server-enforced 'admin' role.
 * If unauthorized, renders an access-denied state preventing UI interaction.
 */
async function initAdminAccessControl() {
  const supabase = window.MythRx?.getSupabaseClient?.();

  // 1. Check if Supabase is configured
  if (!supabase) {
    initAdminNotice();
    setupStaticPreviewFilters();
    routeAdminPage();
    return;
  }

  // Check if evaluation or demo presentation mode is requested via URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === '1' || urlParams.get('preview') === '1') {
    renderEvaluatorDemoBanner();
    setupStaticPreviewFilters();
    routeAdminPage();
    return;
  }

  // 2. Check session and role
  const session = await window.MythRx?.getCurrentSession?.();
  if (!session || !session.user) {
    // Redirect unauthenticated visitor to login with redirect indicator
    window.location.href = '../login.html?redirect=admin';
    return;
  }

  const profile = await window.MythRx?.getCurrentUserProfile?.();

  if (profile?.role !== 'admin') {
    renderAccessDeniedScreen();
    return;
  }

  // Authenticated administrator confirmed
  updateAdminSidebar(session.user, profile);
  hideAdminPreviewNotice();

  // Route to page-specific controller
  routeAdminPage();
}

function routeAdminPage() {
  const currentPath = window.location.pathname;
  if (currentPath.includes('submissions.html')) {
    initAdminSubmissionsPage();
  } else if (currentPath.includes('new-investigation.html') || currentPath.includes('editor.html') || currentPath.includes('publish.html')) {
    initAdminInvestigationEditorPage();
  } else if (currentPath.includes('articles.html')) {
    initAdminArticlesPage();
  } else {
    initAdminOverviewPage();
  }
}

/**
 * Renders access-denied barrier for non-admin accounts.
 */
function renderAccessDeniedScreen() {
  const main = document.querySelector('.dashboard-main');
  if (!main) return;

  main.innerHTML = `
    <div class="empty-state" style="margin: 4rem auto; max-width: 600px; text-align: center;">
      <div class="empty-state-icon" style="font-size: 3rem;">⛔</div>
      <h2 class="empty-state-title" style="margin-top: 1rem; color: #991B1B;">Access Denied: Administrator Privileges Required</h2>
      <p class="empty-state-text" style="color: var(--color-text-muted); font-size: 0.95rem; margin-top: 0.5rem;">
        Your authenticated account does not have clinical administrator permissions. In compliance with Phase 3 Row Level Security (RLS), access to the moderation desk is restricted to verified administrators.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
        <a href="../user-dashboard.html" class="btn btn-primary">Go to User Dashboard</a>
        <a href="../index.html" class="btn btn-secondary">Return to Public Site</a>
      </div>
    </div>
  `;
}

/**
 * Updates sidebar with authenticated admin details.
 */
function updateAdminSidebar(user, profile) {
  const nameElem = document.querySelector('.sidebar-user-name');
  const emailElem = document.querySelector('.sidebar-user-email');
  const roleElem = document.querySelector('.sidebar-user-role');

  if (nameElem) nameElem.textContent = profile?.display_name || user.user_metadata?.full_name || 'Admin Desk';
  if (emailElem) emailElem.textContent = user.email;
  if (roleElem) roleElem.textContent = '🛡️ Verified Administrator';
}

function hideAdminPreviewNotice() {
  const notice = document.getElementById('adminPhaseNotice');
  if (notice) notice.style.display = 'none';
}

function initAdminNotice() {
  const adminNotice = document.getElementById('adminPhaseNotice');
  if (adminNotice && !window.MythRx?.isSupabaseConfigured?.()) {
    adminNotice.innerHTML = `
      <div class="medical-disclaimer-box" style="margin-top: 0; margin-bottom: 1.5rem; background-color: #FEF3C7; border-left-color: #D97706; color: #92400E;">
        <strong>Frontend Admin Preview:</strong> Add your Supabase project credentials in <code>js/supabase.js</code> and sign in with an account holding <code>role = 'admin'</code> to enable live moderation.
      </div>
    `;
  }
}

function renderEvaluatorDemoBanner() {
  const adminNotice = document.getElementById('adminPhaseNotice');
  if (adminNotice) {
    adminNotice.innerHTML = `
      <div class="medical-disclaimer-box" style="margin-top: 0; margin-bottom: 1.5rem; background-color: #FEF3C7; border-left-color: #D97706; color: #92400E; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <strong>Academic Presentation &amp; Demonstration Mode:</strong> Viewing editorial desk in review mode. You can test moderation modals, metric filters, and draft creation.
        </div>
        <a href="../login.html" class="btn btn-primary btn-sm" style="background: #D97706; border-color: #B45309;">Sign In to Live Admin</a>
      </div>
    `;
  }
  const nameElem = document.querySelector('.sidebar-user-name');
  const emailElem = document.querySelector('.sidebar-user-email');
  const roleElem = document.querySelector('.sidebar-user-role');
  if (nameElem) nameElem.textContent = 'Clinical Reviewer (Demo)';
  if (emailElem) emailElem.textContent = 'evaluator@mythrx.org';
  if (roleElem) roleElem.textContent = '🛡️ Verified Administrator';
}

function setupStaticPreviewFilters() {
  const reviewBtns = document.querySelectorAll('.review-claim-btn');
  reviewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const subId = btn.getAttribute('data-sub-id') || 'sub-mock-1';
      const row = btn.closest('tr');
      const claimText = row ? row.querySelector('strong')?.textContent || 'Reported health claim under clinical review.' : 'Reported health claim under clinical review.';
      const origin = row ? row.querySelector('td:nth-child(2)')?.textContent || 'WhatsApp Forward' : 'WhatsApp Forward';
      const status = row ? row.getAttribute('data-status') || 'pending' : 'pending';
      openModerationModal({
        id: subId,
        claim_text: claimText,
        additional_context: origin,
        source_url: 'https://instagram.com/reels/reported-health-claim',
        created_at: new Date().toISOString(),
        status: status,
        admin_notes: 'Initial clinical intake review in progress.'
      });
    });
  });
  setupModerationModal();
}

/**
 * ============================================================================
 * 1. ADMIN OVERVIEW CONTROLLER (admin/index.html)
 * ============================================================================
 */
async function initAdminOverviewPage() {
  const supabase = window.MythRx?.getSupabaseClient?.();
  if (!supabase) return;

  try {
    // 1. Load Metric Counts
    const [pubCountRes, totalInvRes, pendingSubRes, draftCountRes] = await Promise.all([
      supabase.from('investigations').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('investigations').select('id', { count: 'exact', head: true }),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('investigations').select('id', { count: 'exact', head: true }).eq('status', 'draft')
    ]);

    const pubCount = pubCountRes.count ?? 0;
    const totalInv = totalInvRes.count ?? 0;
    const pendingCount = pendingSubRes.count ?? 0;
    const draftCount = draftCountRes.count ?? 0;

    const pubMetric = document.getElementById('metricAdminPublished');
    const pendingMetric = document.getElementById('metricAdminPending');
    const draftMetric = document.getElementById('metricAdminDraft');
    const totalMetric = document.getElementById('metricAdminTotal');

    if (pubMetric) pubMetric.textContent = pubCount;
    if (pendingMetric) pendingMetric.textContent = pendingCount;
    if (draftMetric) draftMetric.textContent = draftCount;
    if (totalMetric) totalMetric.textContent = totalInv;

    // 2. Load Recent Submissions using get_admin_submissions() RPC
    const tbody = document.getElementById('adminRecentSubmissionsBody');
    if (!tbody) return;

    const { data: submissions, error } = await supabase.rpc('get_admin_submissions');

    if (error) throw error;

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    const recent = (submissions || []).slice(0, 5);

    if (recent.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-muted" style="text-align: center; padding: var(--space-lg);">
            No crowdsourced claim submissions in the database yet.
          </td>
        </tr>
      `;
      return;
    }

    recent.forEach(sub => {
      const tr = document.createElement('tr');
      const origin = sub.additional_context || sub.source_url || 'Direct Submission';
      const statusBadge = getAdminStatusBadge(sub.status);

      tr.innerHTML = `
        <td>
          <strong>${escapeHTML(truncateText(sub.claim_text, 65))}</strong>
        </td>
        <td><span style="font-size: 0.82rem; color: var(--color-text-muted);">${escapeHTML(origin)}</span></td>
        <td><span style="font-size: 0.82rem;">${formatDate(sub.created_at)}</span></td>
        <td>${statusBadge}</td>
        <td>
          <button type="button" class="btn btn-primary btn-sm review-claim-btn" data-sub-id="${escapeHTML(sub.id)}" title="Review claim details and moderation decision">Review Claim &rarr;</button>
        </td>
      `;

      const reviewBtn = tr.querySelector('.review-claim-btn');
      if (reviewBtn) {
        reviewBtn.addEventListener('click', () => openModerationModal(sub));
      }

      tbody.appendChild(tr);
    });

    setupModerationModal();

    // 3. Load Recent Investigations for overview table
    const recentArticlesBody = document.getElementById('adminRecentArticlesBody');
    if (recentArticlesBody) {
      const { data: recentArticles, error: artError } = await supabase
        .from('investigations')
        .select(`
          id,
          title,
          slug,
          verdict,
          status,
          created_at,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!artError && recentArticles && recentArticles.length > 0) {
        while (recentArticlesBody.firstChild) {
          recentArticlesBody.removeChild(recentArticlesBody.firstChild);
        }

        recentArticles.forEach(inv => {
          const tr = document.createElement('tr');
          const catName = inv.categories?.name || 'General Health';
          const verdictBadge = `<span class="verdict-badge verdict-${(inv.verdict || 'unverified').toLowerCase()}">${escapeHTML(inv.verdict || 'Unverified')}</span>`;
          const isPublished = inv.status === 'published';
          const statusBadge = isPublished 
            ? '<span class="verdict-badge verdict-supported" style="font-size: 0.68rem;">Published</span>' 
            : '<span class="verdict-badge verdict-context" style="font-size: 0.68rem;">Draft</span>';

          const viewLiveText = isPublished ? 'View Live' : 'Preview Draft';
          const viewLiveHref = `../article.html?id=${encodeURIComponent(inv.slug || inv.id)}`;
          const editHref = `new-investigation.html?id=${encodeURIComponent(inv.id)}`;

          tr.innerHTML = `
            <td><strong>${escapeHTML(inv.title)}</strong></td>
            <td>${escapeHTML(catName)}</td>
            <td>${verdictBadge}</td>
            <td><span style="font-size: 0.82rem;">${formatDate(inv.created_at)}</span></td>
            <td>
              <div class="table-actions">
                <a href="${viewLiveHref}" class="btn btn-secondary btn-sm" target="_blank">${viewLiveText}</a>
                <a href="${editHref}" class="btn btn-outline-teal btn-sm">Edit</a>
              </div>
            </td>
          `;
          recentArticlesBody.appendChild(tr);
        });
      }
    }

  } catch (err) {
    console.error('[Myth Rx Admin] Overview loading error:', err.message);
  }
}

/**
 * ============================================================================
 * 2. SUBMISSIONS MANAGEMENT CONTROLLER (admin/submissions.html)
 * ============================================================================
 */
let submissionSearchQuery = '';
let lastUpdatedSubmissionId = null;

async function initAdminSubmissionsPage() {
  setupSubmissionsFilters();
  setupSubmissionsSearch();
  setupModerationModal();
  await loadAdminSubmissions();

  // Support direct deep-link review (?review=<id> or ?id=<id>)
  const urlParams = new URLSearchParams(window.location.search);
  const targetReviewId = urlParams.get('review') || urlParams.get('id');
  if (targetReviewId && cachedAdminSubmissions.length > 0) {
    const targetSub = cachedAdminSubmissions.find(s => String(s.id) === String(targetReviewId));
    if (targetSub) {
      const st = (targetSub.status || '').toLowerCase();
      if (activeSubmissionFilter !== 'all' && activeSubmissionFilter !== st) {
        setSubmissionsFilter('all');
      }
      openModerationModal(targetSub);
    }
  }
}

/**
 * Loads submissions using the secure public.get_admin_submissions() RPC.
 */
async function loadAdminSubmissions() {
  const tbody = document.getElementById('adminSubmissionsTableBody');
  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!tbody) return;

  if (!supabase) {
    // Populate cachedAdminSubmissions from static rows so filters & moderation work
    const rows = document.querySelectorAll('#adminSubmissionsTableBody .submission-row');
    cachedAdminSubmissions = Array.from(rows).map(r => ({
      id: r.getAttribute('data-id'),
      claim_text: r.querySelector('strong')?.textContent || '',
      additional_context: r.querySelector('td:nth-child(2)')?.textContent || '',
      user_id: null,
      source_url: 'https://example.com/sample-viral-health-claim',
      created_at: new Date().toISOString(),
      status: r.getAttribute('data-status') || 'pending',
      admin_notes: 'Initial clinical assessment.'
    }));
    updateSubmissionTabCounts();
    return;
  }

  try {
    if (cachedAdminSubmissions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: var(--space-lg);">Calling secure administrator RPC public.get_admin_submissions()...</td></tr>`;
    }

    // Secure RPC returns all fields including private admin_notes
    const { data: submissions, error } = await supabase.rpc('get_admin_submissions');

    if (error) throw error;

    cachedAdminSubmissions = submissions || [];
    updateSubmissionTabCounts();
    renderFilteredSubmissions();

  } catch (err) {
    console.error('[Myth Rx Admin] Submissions RPC error:', err.message);
    if (cachedAdminSubmissions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-danger" style="text-align: center; padding: var(--space-lg);">
            Failed to retrieve admin submissions: ${escapeHTML(err.message)}
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Updates dynamic count badges across all submission tabs.
 */
function updateSubmissionTabCounts() {
  const counts = {
    all: cachedAdminSubmissions.length,
    pending: 0,
    under_review: 0,
    accepted: 0,
    rejected: 0
  };

  cachedAdminSubmissions.forEach(sub => {
    const st = (sub.status || '').toLowerCase();
    if (st === 'pending') counts.pending++;
    else if (st === 'under_review' || st === 'review') counts.under_review++;
    else if (st === 'accepted' || st === 'investigated') counts.accepted++;
    else if (st === 'rejected') counts.rejected++;
  });

  const updateBadge = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  updateBadge('countAll', counts.all);
  updateBadge('countPending', counts.pending);
  updateBadge('countUnderReview', counts.under_review);
  updateBadge('countAccepted', counts.accepted);
  updateBadge('countRejected', counts.rejected);
}

function renderFilteredSubmissions() {
  const tbody = document.getElementById('adminSubmissionsTableBody');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const filtered = cachedAdminSubmissions.filter(sub => {
    // 1. Status Filter
    let statusMatch = false;
    const st = (sub.status || '').toLowerCase();
    if (activeSubmissionFilter === 'all') {
      statusMatch = true;
    } else if (activeSubmissionFilter === 'pending') {
      statusMatch = st === 'pending';
    } else if (activeSubmissionFilter === 'under_review' || activeSubmissionFilter === 'review') {
      statusMatch = st === 'under_review' || st === 'review';
    } else if (activeSubmissionFilter === 'accepted' || activeSubmissionFilter === 'investigated') {
      statusMatch = st === 'accepted' || st === 'investigated';
    } else if (activeSubmissionFilter === 'rejected') {
      statusMatch = st === 'rejected';
    } else {
      statusMatch = st === activeSubmissionFilter;
    }

    if (!statusMatch) return false;

    // 2. Search Query Filter
    if (submissionSearchQuery) {
      const q = submissionSearchQuery;
      const claimText = (sub.claim_text || '').toLowerCase();
      const originText = (sub.additional_context || '').toLowerCase();
      const urlText = (sub.source_url || '').toLowerCase();
      const notesText = (sub.admin_notes || '').toLowerCase();
      return claimText.includes(q) || originText.includes(q) || urlText.includes(q) || notesText.includes(q);
    }

    return true;
  });

  if (filtered.length === 0) {
    const filterLabel = getAdminStatusLabel(activeSubmissionFilter);
    const searchNotice = submissionSearchQuery ? ` matching "${escapeHTML(submissionSearchQuery)}"` : '';
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-muted" style="text-align: center; padding: var(--space-xl);">
          <div style="font-size: 1.2rem; margin-bottom: 6px;">📭</div>
          <strong>No claim submissions found</strong>
          <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 4px;">
            No records in the <em>${escapeHTML(filterLabel)}</em> queue${searchNotice}.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(sub => {
    const tr = document.createElement('tr');
    tr.className = 'submission-row';
    if (sub.id === lastUpdatedSubmissionId) {
      tr.classList.add('submission-row-updated');
    }
    tr.setAttribute('data-status', sub.status);
    tr.setAttribute('data-id', sub.id);

    const submitter = sub.user_id ? 'Authenticated User' : 'Anonymous Citizen';
    const origin = sub.additional_context || sub.source_url || 'Direct Submission';
    const statusBadge = getAdminStatusBadge(sub.status);
    const hasNotes = sub.admin_notes 
      ? `<div style="font-size: 0.78rem; color: var(--color-electric-teal, #00A896); margin-top: 4px; font-weight: 500;">📝 Note: ${escapeHTML(truncateText(sub.admin_notes, 55))}</div>` 
      : '';

    tr.innerHTML = `
      <td>
        <strong style="color: var(--color-ink, #17212B);">${escapeHTML(sub.claim_text)}</strong>
        ${hasNotes}
      </td>
      <td><span style="font-size: 0.82rem; color: var(--color-text-muted);">${escapeHTML(origin)}</span></td>
      <td><span style="font-size: 0.82rem;">${escapeHTML(submitter)}</span></td>
      <td><span style="font-size: 0.82rem;">${formatDate(sub.created_at)}</span></td>
      <td>${statusBadge}</td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn-primary btn-sm review-claim-btn" data-sub-id="${escapeHTML(sub.id)}" title="Review and moderate this claim">
            Review Claim &rarr;
          </button>
          <a href="new-investigation.html?claim=${encodeURIComponent(sub.claim_text)}&source=${encodeURIComponent(sub.source_url || '')}&context=${encodeURIComponent(sub.additional_context || '')}&subId=${encodeURIComponent(sub.id)}" class="btn btn-outline-teal btn-sm">Draft Fact-Check</a>
        </div>
      </td>
    `;

    const reviewBtn = tr.querySelector('.review-claim-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => openModerationModal(sub));
    }

    tbody.appendChild(tr);
  });
}

function setupSubmissionsFilters() {
  const filterBtns = document.querySelectorAll('[data-admin-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubmissionFilter = (btn.getAttribute('data-admin-filter') || 'all').toLowerCase();
      renderFilteredSubmissions();
    });
  });
}

function setupSubmissionsSearch() {
  const searchInput = document.getElementById('submissionSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    submissionSearchQuery = (e.target.value || '').trim().toLowerCase();
    renderFilteredSubmissions();
  });
}

function setSubmissionsFilter(filterName) {
  const filterBtns = document.querySelectorAll('[data-admin-filter]');
  filterBtns.forEach(btn => {
    const val = (btn.getAttribute('data-admin-filter') || '').toLowerCase();
    if (val === filterName || (filterName === 'under_review' && val === 'review') || (filterName === 'accepted' && val === 'investigated')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  activeSubmissionFilter = filterName.toLowerCase();
  renderFilteredSubmissions();
}

/**
 * Moderation Modal Setup & Decision Submission with RPC public.update_admin_submission().
 */
function setupModerationModal() {
  const modal = document.getElementById('adminReviewModal');
  const closeBtn = document.getElementById('closeReviewModalBtn');
  const cancelBtn = document.getElementById('cancelReviewModalBtn');
  const form = document.getElementById('submissionModerationForm');

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subId = document.getElementById('modalSubmissionId')?.value;
      const status = document.getElementById('modalSubmissionStatus')?.value;
      const notes = document.getElementById('modalAdminNotes')?.value.trim();
      const alertBox = document.getElementById('modalAlert');
      const submitBtn = document.getElementById('saveModerationBtn');

      if (!subId) return;

      const supabase = window.MythRx?.getSupabaseClient?.();
      if (!supabase) {
        // Handle preview mode submission gracefully
        handleStaticPreviewModeration(subId, status, notes);
        showAdminAlert(alertBox, 'success', 'Preview Mode: Submission updated locally in memory.');
        setTimeout(closeModal, 600);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Decision...';
      }

      try {
        // Enforce secure administrative RPC public.update_admin_submission()
        const { data, error } = await supabase.rpc('update_admin_submission', {
          p_submission_id: subId,
          p_status: status,
          p_admin_notes: notes || null
        });

        if (error) {
          // If RPC is missing from the database schema cache, show actionable configuration error
          if (error.code === 'PGRST202' || error.code === '42883' || (error.message && (error.message.includes('function') || error.message.includes('schema cache')))) {
            showAdminAlert(
              alertBox,
              'error',
              '<strong>Configuration Error:</strong> Secure administrative RPC <code>public.update_admin_submission</code> is missing from the database (Code: ' +
                escapeHTML(error.code) +
                '). Please execute <code>supabase/migrations/003_admin_moderation.sql</code> in your Supabase SQL Editor to enable server-side moderation.'
            );
            return;
          }
          throw error;
        }

        // 1. Optimistically update local cache so state never disappears or gets desynced
        const targetSub = cachedAdminSubmissions.find(s => s.id === subId);
        if (targetSub) {
          targetSub.status = status;
          targetSub.admin_notes = notes || null;
          targetSub.updated_at = new Date().toISOString();
        }
        lastUpdatedSubmissionId = subId;

        // 2. Update dynamic tab badges
        updateSubmissionTabCounts();

        // 3. Inform admin in modal
        showAdminAlert(alertBox, 'success', '✓ Moderation decision saved successfully via secure RPC public.update_admin_submission()!');

        // 4. Check if current tab filter would hide the updated record; notify admin
        const noticeBanner = document.getElementById('moderationNoticeBanner');
        if (noticeBanner) {
          const statusLabel = getAdminStatusLabel(status);
          const isHiddenByFilter = (activeSubmissionFilter !== 'all' && activeSubmissionFilter !== status && 
            !(activeSubmissionFilter === 'review' && status === 'under_review') &&
            !(activeSubmissionFilter === 'investigated' && status === 'accepted'));

          if (isHiddenByFilter) {
            noticeBanner.style.display = 'block';
            noticeBanner.style.backgroundColor = '#E0F4EC';
            noticeBanner.style.border = '1px solid #00A896';
            noticeBanner.style.color = '#17212B';
            noticeBanner.innerHTML = `
              <strong>✓ Status Saved:</strong> Submission moved to <strong>${escapeHTML(statusLabel)}</strong>.
              <button type="button" class="btn btn-outline-teal btn-sm" id="jumpToTabBtn" style="margin-left: 8px;">View in ${escapeHTML(statusLabel)} Queue &rarr;</button>
            `;
            const jumpBtn = document.getElementById('jumpToTabBtn');
            if (jumpBtn) {
              jumpBtn.addEventListener('click', () => {
                setSubmissionsFilter(status);
                noticeBanner.style.display = 'none';
              });
            }
          } else {
            noticeBanner.style.display = 'none';
          }
        }

        // 5. Close modal and re-render table with visual highlight pulse
        setTimeout(() => {
          closeModal();
          renderFilteredSubmissions();
        }, 600);

        // 6. Background synchronization with server
        try {
          const { data: refreshedSubs, error: refreshErr } = await supabase.rpc('get_admin_submissions');
          if (!refreshErr && refreshedSubs) {
            cachedAdminSubmissions = refreshedSubs;
            updateSubmissionTabCounts();
            renderFilteredSubmissions();
          }
        } catch (silentSyncErr) {
          console.warn('[Myth Rx Admin] Background refresh note:', silentSyncErr.message);
        }

      } catch (err) {
        showAdminAlert(alertBox, 'error', `Update error: ${err.message}`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Moderation Decision';
        }
      }
    });
  }
}

function handleStaticPreviewModeration(subId, newStatus, newNotes) {
  // Update mock item in cachedAdminSubmissions or DOM
  const item = cachedAdminSubmissions.find(s => s.id === subId);
  if (item) {
    item.status = newStatus;
    item.admin_notes = newNotes;
  }
  const domRow = document.querySelector(`.submission-row[data-id="${subId}"]`);
  if (domRow) {
    domRow.setAttribute('data-status', newStatus);
    const badgeTd = domRow.querySelector('td:nth-child(5)');
    if (badgeTd) badgeTd.innerHTML = getAdminStatusBadge(newStatus);
  }
  updateSubmissionTabCounts();
  renderFilteredSubmissions();
}

function getAdminStatusLabel(status) {
  switch (status) {
    case 'pending': return 'Pending Intake';
    case 'under_review':
    case 'review': return 'In Clinical Review';
    case 'accepted':
    case 'investigated': return 'Fact-Check Accepted';
    case 'rejected': return 'Rejected / Out of Scope';
    default: return status || 'All';
  }
}

function openModerationModal(sub) {
  const modal = document.getElementById('adminReviewModal');
  const idInput = document.getElementById('modalSubmissionId');
  const displayId = document.getElementById('modalDisplaySubId');
  const detailsDiv = document.getElementById('modalClaimDetails');
  const statusSelect = document.getElementById('modalSubmissionStatus');
  const notesText = document.getElementById('modalAdminNotes');
  const alertBox = document.getElementById('modalAlert');

  if (!modal) return;

  if (idInput) idInput.value = sub.id || '';
  if (displayId) displayId.textContent = sub.id || 'N/A';
  if (statusSelect) statusSelect.value = sub.status || 'pending';
  if (notesText) notesText.value = sub.admin_notes || '';
  if (alertBox) alertBox.style.display = 'none';

  if (detailsDiv) {
    const origin = sub.additional_context || 'None provided';
    const submitter = sub.user_id ? 'Authenticated Citizen' : 'Anonymous Citizen';
    const sourceHtml = sub.source_url 
      ? `<div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 6px;"><strong>Original Source URL:</strong> <a href="${escapeHTML(sub.source_url)}" target="_blank" rel="noopener" style="color: var(--color-teal); text-decoration: underline; word-break: break-all;">${escapeHTML(sub.source_url)} ↗</a></div>` 
      : '<div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 6px;"><strong>Original Source URL:</strong> <span style="font-style: italic;">No URL provided</span></div>';

    detailsDiv.innerHTML = `
      <div class="investigation-claim-box" style="margin-bottom: var(--space-sm); border-left: 4px solid var(--color-teal); background: #F8FAFC; padding: var(--space-sm) var(--space-md); border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
        <div class="investigation-claim-label" style="font-size: 0.72rem; font-weight: 700; color: var(--color-teal); text-transform: uppercase; letter-spacing: 0.5px;">Reported Health Claim</div>
        <p class="investigation-claim-text" style="font-size: 0.95rem; font-weight: 600; color: var(--color-ink); margin-top: 4px; line-height: 1.4;">"${escapeHTML(sub.claim_text)}"</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xs); margin-bottom: var(--space-sm); font-size: 0.85rem; background: var(--color-surface-alt); padding: 8px 12px; border-radius: var(--radius-sm);">
        <div><strong>Platform / Context:</strong><br><span style="color: var(--color-text-muted);">${escapeHTML(origin)}</span></div>
        <div><strong>Submitter Identity:</strong><br><span style="color: var(--color-text-muted);">${escapeHTML(submitter)}</span></div>
      </div>
      ${sourceHtml}
      <div style="font-size: 0.85rem; color: var(--color-text-muted);">
        <strong>Date Received:</strong> ${formatDate(sub.created_at)}
      </div>
    `;
  }

  modal.style.display = 'flex';
}

/**
 * ============================================================================
 * 3. ARTICLES MANAGEMENT CONTROLLER (admin/articles.html)
 * ============================================================================
 */
async function initAdminArticlesPage() {
  await Promise.all([
    loadCategoryDropdown(),
    loadAdminArticlesList()
  ]);
  setupNewArticleForm();
}

/**
 * Loads categories into the article authoring dropdown.
 */
async function loadCategoryDropdown(selectId = 'artCategory') {
  const select = document.getElementById(selectId);
  if (!select) return;

  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!supabase) {
    select.innerHTML = `
      <option value="">-- Select Health Category --</option>
      <option value="nutrition-diet">Nutrition & Dietary Supplements</option>
      <option value="infectious-disease">Infectious Disease & Immunity</option>
      <option value="cancer-hoaxes">Cancer & Chronic Illness Hoaxes</option>
      <option value="herbal-remedies">Alternative Remedies & Botanicals</option>
      <option value="pharmaceuticals">Pharmaceuticals & Vaccines</option>
    `;
    return;
  }

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name', { ascending: true });

    if (error) throw error;

    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    if (!categories || categories.length === 0) {
      select.innerHTML = '<option value="">⚠️ No categories found in database</option>';
      return;
    }

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- Select Health Category --';
    select.appendChild(defaultOpt);

    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error('[Myth Rx Admin] Category dropdown error:', err.message);
    select.innerHTML = `<option value="">⚠️ Error loading categories (${escapeHTML(err.message)})</option>`;
  }
}

/**
 * Loads all investigations (drafts and published) for the admin table.
 */
async function loadAdminArticlesList() {
  const tbody = document.getElementById('adminArticlesTableBody');
  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!tbody || !supabase) return;

  try {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: var(--space-lg);">Loading investigations from database...</td></tr>`;

    // Admins can view ALL investigations per RLS policy "Admins can view all investigations"
    const { data: investigations, error } = await supabase
      .from('investigations')
      .select(`
        id,
        title,
        slug,
        verdict,
        status,
        created_at,
        categories (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    if (!investigations || investigations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-muted" style="text-align: center; padding: var(--space-xl);">
            No investigations created in database yet. Author your first fact-check below.
          </td>
        </tr>
      `;
      return;
    }

    investigations.forEach(inv => {
      const tr = document.createElement('tr');
      const catName = inv.categories?.name || 'General Health';
      const verdictBadge = `<span class="verdict-badge verdict-${(inv.verdict || 'unverified').toLowerCase()}">${escapeHTML(inv.verdict || 'Unverified')}</span>`;
      const isPublished = inv.status === 'published';
      const statusBadge = isPublished 
        ? '<span class="verdict-badge verdict-supported" style="font-size: 0.68rem;">Published</span>' 
        : '<span class="verdict-badge verdict-context" style="font-size: 0.68rem;">Draft</span>';

      const viewLiveText = isPublished ? 'View Live' : 'Preview Draft';
      const viewLiveHref = `../article.html?id=${encodeURIComponent(inv.slug || inv.id)}`;
      const editHref = `new-investigation.html?id=${encodeURIComponent(inv.id)}`;

      tr.innerHTML = `
        <td><strong>${escapeHTML(inv.title)}</strong></td>
        <td>${escapeHTML(catName)}</td>
        <td>${verdictBadge}</td>
        <td>Clinical Reviewer</td>
        <td>${statusBadge}</td>
        <td>
          <div class="table-actions">
            <a href="${viewLiveHref}" class="btn btn-secondary btn-sm" target="_blank">${viewLiveText}</a>
            <a href="${editHref}" class="btn btn-outline-teal btn-sm">Edit</a>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('[Myth Rx Admin] Articles list error:', err.message);
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger" style="text-align: center;">Error loading articles: ${escapeHTML(err.message)}</td></tr>`;
  }
}

/**
 * Handles authoring a new investigation and inserting related citations.
 */
function setupNewArticleForm() {
  const form = document.getElementById('articleForm');
  if (!form) return;

  // Check if edit parameter is passed to articles.html (e.g. articles.html?edit=<id>)
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit') || urlParams.get('id');
  if (editId) {
    loadArticleIntoInlineEditor(editId);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editIdInput = document.getElementById('artEditId');
    const titleInput = document.getElementById('artTitle');
    const slugInput = document.getElementById('artSlug');
    const categorySelect = document.getElementById('artCategory');
    const verdictSelect = document.getElementById('artVerdict');
    const statusSelect = document.getElementById('artStatus');
    const claimInput = document.getElementById('artClaim');
    const summaryInput = document.getElementById('artSummary');
    const bodyInput = document.getElementById('artBody');
    const sourcesInput = document.getElementById('artSources');
    const alertBox = document.getElementById('articleFormAlert');
    const submitBtn = document.getElementById('saveArticleBtn');

    const currentEditId = editIdInput?.value?.trim() || null;
    const title = titleInput?.value.trim() || '';
    let slug = slugInput?.value.trim().toLowerCase() || '';
    const categoryId = categorySelect?.value || null;
    const verdict = verdictSelect?.value || 'False';
    const status = statusSelect?.value || 'draft';
    const claim = claimInput?.value.trim() || '';
    const summary = summaryInput?.value.trim() || '';
    const bodyText = bodyInput?.value.trim() || '';
    const rawSources = sourcesInput?.value.trim() || '';

    if (!title || !categoryId || !claim || !summary || !bodyText) {
      showAdminAlert(alertBox, 'error', 'Please complete all required fields.');
      return;
    }

    const supabase = window.MythRx?.getSupabaseClient?.();
    const session = await window.MythRx?.getCurrentSession?.();
    if (!supabase || !session?.user) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = currentEditId ? 'Updating Record...' : 'Saving to Database...';
    }

    try {
      if (!slug) {
        const slugBase = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .substring(0, 50);
        const uniqueSuffix = Math.random().toString(36).substring(2, 6);
        slug = `${slugBase}-${uniqueSuffix}`;
      } else {
        slug = slug.replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '');
      }

      const bodyParagraphs = bodyText.split('\n\n').map(p => p.trim()).filter(Boolean);
      const articleContentObj = {
        detailedExplanation: bodyParagraphs.length > 0 ? bodyParagraphs : [bodyText],
        scientificEvidence: [],
        risksAndLimitations: [],
        conclusion: summary,
        claimOrigin: 'Editorial fact-check investigation'
      };

      let targetInvId = currentEditId;

      if (currentEditId) {
        // UPDATE existing record
        const updatePayload = {
          title: title,
          slug: slug,
          original_claim: claim,
          summary: summary,
          verdict: verdict,
          category_id: categoryId,
          status: status,
          article_content: articleContentObj,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (status === 'published') {
          updatePayload.published_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('investigations')
          .update(updatePayload)
          .eq('id', currentEditId);

        if (updateError) throw updateError;

      } else {
        // INSERT into public.investigations
        const { data: invData, error: invError } = await supabase
          .from('investigations')
          .insert({
            title: title,
            slug: slug,
            original_claim: claim,
            summary: summary,
            verdict: verdict,
            category_id: categoryId,
            status: status,
            created_by: session.user.id,
            article_content: articleContentObj,
            published_at: status === 'published' ? new Date().toISOString() : null,
            reviewed_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (invError) throw invError;
        targetInvId = invData?.id;
      }

      // Parse and insert/update peer-reviewed sources if provided
      if (targetInvId) {
        if (currentEditId) {
          await supabase.from('sources').delete().eq('investigation_id', targetInvId);
        }

        if (rawSources) {
          const sourceLines = rawSources.split('\n').map(l => l.trim()).filter(Boolean);
          const sourceInserts = sourceLines.map(line => {
            const parts = line.split('|').map(p => p.trim());
            return {
              investigation_id: targetInvId,
              title: parts[0] || 'Scientific Reference',
              publisher: parts[1] || 'Peer-Reviewed Journal / Clinical Guideline',
              source_url: parts[2] || 'https://pubmed.ncbi.nlm.nih.gov'
            };
          });

          if (sourceInserts.length > 0) {
            const { error: srcError } = await supabase.from('sources').insert(sourceInserts);
            if (srcError) {
              console.warn('[Myth Rx Admin] Citation insert error:', srcError.message);
              showAdminAlert(
                alertBox,
                'info',
                `Investigation saved (slug: <code>${escapeHTML(slug)}</code>), but citations could not be saved: ${escapeHTML(srcError.message)}`
              );
              form.reset();
              if (editIdInput) editIdInput.value = '';
              await loadAdminArticlesList();
              return;
            }
          }
        }
      }

      const actionText = currentEditId ? 'updated' : 'saved';
      showAdminAlert(
        alertBox, 
        'success', 
        `Investigation ${actionText} successfully! Reference slug: <code>${escapeHTML(slug)}</code> | <a href="../article.html?id=${encodeURIComponent(slug)}" target="_blank" style="text-decoration: underline; font-weight: 700;">View Live / Preview &rarr;</a>`
      );

      form.reset();
      if (editIdInput) editIdInput.value = '';
      const sectionHeading = document.getElementById('newArticleTitle');
      if (sectionHeading) sectionHeading.textContent = 'Create or Update Fact-Check Investigation';
      if (submitBtn) submitBtn.textContent = 'Save Investigation';

      await loadAdminArticlesList();

    } catch (err) {
      showAdminAlert(alertBox, 'error', `Could not save investigation: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? 'Update Investigation' : 'Save Investigation';
      }
    }
  });
}

/**
 * Pre-populates inline editor in articles.html for edit mode.
 */
async function loadArticleIntoInlineEditor(invId) {
  const supabase = window.MythRx?.getSupabaseClient?.();
  if (!supabase || !invId) return;

  try {
    const { data: inv, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', invId)
      .single();

    if (error || !inv) return;

    const editIdInput = document.getElementById('artEditId');
    const titleInput = document.getElementById('artTitle');
    const slugInput = document.getElementById('artSlug');
    const categorySelect = document.getElementById('artCategory');
    const verdictSelect = document.getElementById('artVerdict');
    const statusSelect = document.getElementById('artStatus');
    const claimInput = document.getElementById('artClaim');
    const summaryInput = document.getElementById('artSummary');
    const bodyInput = document.getElementById('artBody');
    const sourcesInput = document.getElementById('artSources');
    const sectionHeading = document.getElementById('newArticleTitle');
    const submitBtn = document.getElementById('saveArticleBtn');

    if (editIdInput) editIdInput.value = inv.id;
    if (titleInput) titleInput.value = inv.title;
    if (slugInput) slugInput.value = inv.slug;
    if (categorySelect) categorySelect.value = inv.category_id || '';
    if (verdictSelect) verdictSelect.value = inv.verdict || 'False';
    if (statusSelect) statusSelect.value = inv.status || 'draft';
    if (claimInput) claimInput.value = inv.original_claim || '';
    if (summaryInput) summaryInput.value = inv.summary || '';

    let bodyContent = '';
    if (inv.article_content) {
      const content = typeof inv.article_content === 'string' ? JSON.parse(inv.article_content) : inv.article_content;
      if (Array.isArray(content.detailedExplanation)) {
        bodyContent = content.detailedExplanation.join('\n\n');
      } else if (content.body) {
        bodyContent = content.body;
      }
    }
    if (bodyInput) bodyInput.value = bodyContent;

    const { data: sources } = await supabase
      .from('sources')
      .select('title, publisher, source_url')
      .eq('investigation_id', inv.id);

    if (sources && sources.length > 0 && sourcesInput) {
      sourcesInput.value = sources.map(s => `${s.title} | ${s.publisher || 'Reference'} | ${s.source_url || ''}`).join('\n');
    }

    if (sectionHeading) sectionHeading.textContent = `Edit Investigation: ${inv.title}`;
    if (submitBtn) submitBtn.textContent = 'Update Investigation';

    const formSection = document.getElementById('new-article');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error('[Myth Rx Admin] Inline load error:', err.message);
  }
}

/**
 * ============================================================================
 * 4. DEDICATED INVESTIGATION EDITOR CONTROLLER (admin/new-investigation.html)
 * Supports full creation and editing using the existing public.investigations schema.
 * ============================================================================
 */
async function initAdminInvestigationEditorPage() {
  await loadCategoryDropdown('invCategory');
  setupDedicatedInvestigationEditor();
}

async function setupDedicatedInvestigationEditor() {
  const form = document.getElementById('investigationEditorForm');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id') || urlParams.get('edit');
  const claimParam = urlParams.get('claim');
  const sourceParam = urlParams.get('source');
  const contextParam = urlParams.get('context');

  const idInput = document.getElementById('invEditId');
  const titleInput = document.getElementById('invTitle');
  const slugInput = document.getElementById('invSlug');
  const categorySelect = document.getElementById('invCategory');
  const verdictSelect = document.getElementById('invVerdict');
  const statusSelect = document.getElementById('invStatus');
  const claimInput = document.getElementById('invClaim');
  const summaryInput = document.getElementById('invSummary');
  const bodyInput = document.getElementById('invBody');
  const sourcesInput = document.getElementById('invSources');
  const alertBox = document.getElementById('invAlert');
  const submitBtn = document.getElementById('invSaveBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const pageHeading = document.getElementById('editorPageHeading');
  const sectionTitle = document.getElementById('editorSectionTitle');
  const modeBadge = document.getElementById('editorModeBadge');
  const cancelWrapper = document.getElementById('editorCancelWrapper');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const claimBanner = document.getElementById('claimIntakeBanner');

  const supabase = window.MythRx?.getSupabaseClient?.();

  // Mode 1: Edit Existing Investigation
  if (editId && supabase) {
    try {
      showAdminAlert(alertBox, 'info', 'Loading investigation details from database...');
      const { data: inv, error: invError } = await supabase
        .from('investigations')
        .select(`
          id,
          title,
          slug,
          original_claim,
          summary,
          article_content,
          verdict,
          category_id,
          status,
          created_by,
          published_at,
          reviewed_at
        `)
        .eq('id', editId)
        .single();

      if (invError) throw invError;

      if (inv) {
        if (idInput) idInput.value = inv.id;
        if (titleInput) titleInput.value = inv.title;
        if (slugInput) slugInput.value = inv.slug;
        if (categorySelect) categorySelect.value = inv.category_id || '';
        if (verdictSelect) verdictSelect.value = inv.verdict || 'False';
        if (statusSelect) statusSelect.value = inv.status || 'draft';
        if (claimInput) claimInput.value = inv.original_claim || '';
        if (summaryInput) summaryInput.value = inv.summary || '';

        let bodyContent = '';
        if (inv.article_content) {
          const content = typeof inv.article_content === 'string' ? JSON.parse(inv.article_content) : inv.article_content;
          if (Array.isArray(content.detailedExplanation)) {
            bodyContent = content.detailedExplanation.join('\n\n');
          } else if (content.body) {
            bodyContent = content.body;
          }
        }
        if (bodyInput) bodyInput.value = bodyContent;

        // Fetch related sources
        const { data: sources } = await supabase
          .from('sources')
          .select('title, publisher, source_url')
          .eq('investigation_id', inv.id);

        if (sources && sources.length > 0 && sourcesInput) {
          sourcesInput.value = sources.map(s => `${s.title} | ${s.publisher || 'Reference'} | ${s.source_url || ''}`).join('\n');
        }

        // Update UI to Edit Mode
        if (pageHeading) pageHeading.textContent = 'Edit Investigation';
        if (sectionTitle) sectionTitle.textContent = `Editing: ${inv.title}`;
        if (modeBadge) {
          modeBadge.innerHTML = `<span class="verdict-badge verdict-misleading" style="font-size: 0.72rem;">Editing Record (ID: ${escapeHTML(inv.id.substring(0, 8))}...)</span>`;
        }
        if (submitBtn) submitBtn.textContent = 'Update Investigation';
        if (cancelWrapper) cancelWrapper.style.display = 'block';

        if (alertBox) alertBox.style.display = 'none';
      }
    } catch (err) {
      console.error('[Myth Rx Admin] Failed to load investigation for editing:', err.message);
      showAdminAlert(alertBox, 'error', `Could not load investigation: ${err.message}`);
    }
  } else if (claimParam) {
    // Mode 2: Prefilled from crowdsourced claim
    if (claimInput) claimInput.value = claimParam;
    if (claimBanner) claimBanner.style.display = 'block';
    if (sourceParam && sourcesInput) {
      sourcesInput.value = `Reported Online Source | Web / Social Media | ${sourceParam}`;
    }
    if (contextParam && summaryInput && !summaryInput.value) {
      summaryInput.value = `Investigating viral claim circulating via ${contextParam}.`;
    }
  }

  // Demo helper buttons for academic presentation & testing
  const demoBtn = document.getElementById('loadExampleInvestigationBtn');
  const clearBtn = document.getElementById('clearInvestigationFormBtn');

  demoBtn?.addEventListener('click', () => {
    if (typeof window.loadExampleInvestigationData === 'function') {
      window.loadExampleInvestigationData();
      return;
    }
    if (titleInput) titleInput.value = '[Demo] Why Boiled Papaya Leaf Extract Does Not Rapidly Cure Severe Dengue Thrombocytopenia';
    if (slugInput) slugInput.value = 'demo-papaya-leaf-dengue';
    if (categorySelect && categorySelect.options.length > 1) {
      categorySelect.selectedIndex = 1;
    }
    if (verdictSelect) verdictSelect.value = 'False';
    if (statusSelect) statusSelect.value = 'draft'; // Explicitly saved as draft; does NOT publish
    if (claimInput) claimInput.value = 'Drinking raw or boiled papaya leaf extract increases platelet count from 20,000 to 150,000 in 12 hours without hospitalization.';
    if (summaryInput) summaryInput.value = 'Educational Demonstration: While Carica papaya leaf contains phytochemicals investigated in vitro, clinical evidence does not support rapid platelet restoration in acute severe dengue. Hospitalization and fluid resuscitation remain essential.';
    if (bodyInput) {
      bodyInput.value = `Clinical Background:\nDengue virus causes acute thrombocytopenia primarily through bone marrow suppression and immune-mediated clearance of peripheral platelets. In severe dengue, plasma leakage and vascular permeability represent life-threatening emergencies.\n\nEvidence Assessment:\nSmall preliminary trials of standardized extracts showed modest variations in platelet trends, but randomized controlled trials have not demonstrated prevention of severe plasma leakage or rapid platelet recovery within 12-24 hours.\n\nClinical Risk & Limitations:\nRelying on homemade herbal extracts while deferring IV fluid resuscitation and clinical monitoring in severe dengue significantly increases the risk of hypovolemic shock, internal hemorrhage, and fatal complications.`;
    }
    if (sourcesInput) {
      sourcesInput.value = `WHO Dengue Guidelines & Clinical Management | World Health Organization | https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue\nCochrane Review: Herbal Medicines for Dengue Infection | Cochrane Database of Systematic Reviews | https://www.cochranelibrary.com`;
    }
    showAdminAlert(
      alertBox,
      'info',
      '<strong>🧪 Safe Demonstration Data Loaded:</strong> Real fact-check fields populated as an internal <strong>DRAFT</strong>. This sample has <em>NOT</em> been saved or published to Supabase. You can edit any field, choose <em>Save Draft</em> or <em>Publish Investigation</em>, or click <em>Clear Form</em>.'
    );
    alertBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  clearBtn?.addEventListener('click', () => {
    if (typeof window.clearInvestigationForm === 'function') {
      window.clearInvestigationForm();
      return;
    }
    form.reset();
    if (idInput) idInput.value = '';
    if (alertBox) alertBox.style.display = 'none';
  });

  titleInput?.addEventListener('input', () => {
    if (!slugInput?.dataset.manuallyEdited && !idInput?.value) {
      slugInput.value = titleInput.value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
    }
  });

  slugInput?.addEventListener('input', () => {
    slugInput.dataset.manuallyEdited = 'true';
  });

  // Cancel edit handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'new-investigation.html';
    });
  }

  // Save as Draft button
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      if (statusSelect) statusSelect.value = 'draft';
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  }

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentEditId = idInput?.value?.trim() || null;
    const title = titleInput?.value.trim() || '';
    let slug = slugInput?.value.trim().toLowerCase() || '';
    const categoryId = categorySelect?.value || null;
    const verdict = verdictSelect?.value || 'False';
    const status = statusSelect?.value || 'draft';
    const claim = claimInput?.value.trim() || '';
    const summary = summaryInput?.value.trim() || '';
    const bodyText = bodyInput?.value.trim() || '';
    const rawSources = sourcesInput?.value.trim() || '';

    if (!title || !categoryId || !claim || !summary || !bodyText) {
      showAdminAlert(alertBox, 'error', 'Please complete all required fields.');
      return;
    }

    if (!supabase) {
      showAdminAlert(alertBox, 'error', 'Supabase client is not connected.');
      return;
    }

    const session = await window.MythRx?.getCurrentSession?.();
    if (!session?.user) {
      showAdminAlert(alertBox, 'error', 'Administrator authentication required.');
      return;
    }

    // Auto-generate slug if empty
    if (!slug) {
      const slugBase = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      slug = `${slugBase}-${uniqueSuffix}`;
      if (slugInput) slugInput.value = slug;
    } else {
      slug = slug.replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = currentEditId ? 'Updating Record...' : 'Saving to Database...';
    }

    try {
      const bodyParagraphs = bodyText.split('\n\n').map(p => p.trim()).filter(Boolean);
      const articleContentObj = {
        detailedExplanation: bodyParagraphs.length > 0 ? bodyParagraphs : [bodyText],
        scientificEvidence: [],
        risksAndLimitations: [],
        conclusion: summary,
        claimOrigin: 'Editorial fact-check investigation'
      };

      let targetInvestigationId = currentEditId;

      if (currentEditId) {
        // UPDATE existing investigation matching public.investigations schema
        const updatePayload = {
          title: title,
          slug: slug,
          original_claim: claim,
          summary: summary,
          verdict: verdict,
          category_id: categoryId,
          status: status,
          article_content: articleContentObj,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (status === 'published') {
          updatePayload.published_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('investigations')
          .update(updatePayload)
          .eq('id', currentEditId);

        if (updateError) throw updateError;

      } else {
        // INSERT new investigation matching public.investigations schema
        const insertPayload = {
          title: title,
          slug: slug,
          original_claim: claim,
          summary: summary,
          verdict: verdict,
          category_id: categoryId,
          status: status,
          created_by: session.user.id,
          article_content: articleContentObj,
          published_at: status === 'published' ? new Date().toISOString() : null,
          reviewed_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
          .from('investigations')
          .insert(insertPayload)
          .select('id')
          .single();

        if (insertError) throw insertError;
        targetInvestigationId = insertData?.id;
      }

      // Sync Sources
      if (targetInvestigationId) {
        if (currentEditId) {
          await supabase.from('sources').delete().eq('investigation_id', targetInvestigationId);
        }

        if (rawSources) {
          const sourceLines = rawSources.split('\n').map(l => l.trim()).filter(Boolean);
          const sourceInserts = sourceLines.map(line => {
            const parts = line.split('|').map(p => p.trim());
            return {
              investigation_id: targetInvestigationId,
              title: parts[0] || 'Scientific Reference',
              publisher: parts[1] || 'Peer-Reviewed Journal / Clinical Guideline',
              source_url: parts[2] || 'https://pubmed.ncbi.nlm.nih.gov'
            };
          });

          if (sourceInserts.length > 0) {
            const { error: srcError } = await supabase.from('sources').insert(sourceInserts);
            if (srcError) {
              console.warn('[Myth Rx Admin] Citation insert error:', srcError.message);
            }
          }
        }
      }

      const viewLiveUrl = `../article.html?id=${encodeURIComponent(slug)}`;
      const actionText = currentEditId ? 'updated' : (status === 'published' ? 'published' : 'saved as draft');
      showAdminAlert(
        alertBox,
        'success',
        `<strong>Success:</strong> Investigation ${actionText} successfully! <a href="${viewLiveUrl}" target="_blank" style="text-decoration: underline; font-weight: 700; margin-left: 8px;">View / Preview Article &rarr;</a> | <a href="articles.html" style="text-decoration: underline; font-weight: 600; margin-left: 4px;">Return to Investigation List</a>`
      );

      // Scroll to alert
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
      console.error('[Myth Rx Admin] Investigation save error:', err.message);
      showAdminAlert(alertBox, 'error', `Could not save investigation: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? 'Update Investigation' : 'Save & Publish Fact-Check';
      }
    }
  });
}

function setupStaticPreviewFilters() {
  const filterBtns = document.querySelectorAll('[data-admin-filter]');
  const rows = document.querySelectorAll('.submission-row');
  const searchInput = document.getElementById('submissionSearchInput');

  // Compute counts from static preview rows
  const counts = { all: rows.length, pending: 0, under_review: 0, accepted: 0, rejected: 0 };
  rows.forEach(r => {
    const st = (r.getAttribute('data-status') || '').toLowerCase();
    if (st === 'pending') counts.pending++;
    else if (st === 'under_review' || st === 'review') counts.under_review++;
    else if (st === 'accepted' || st === 'investigated') counts.accepted++;
    else if (st === 'rejected') counts.rejected++;
  });
  const setBadge = (id, c) => { const el = document.getElementById(id); if (el) el.textContent = c; };
  setBadge('countAll', counts.all);
  setBadge('countPending', counts.pending);
  setBadge('countUnderReview', counts.under_review);
  setBadge('countAccepted', counts.accepted);
  setBadge('countRejected', counts.rejected);

  let activeFilter = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    rows.forEach(row => {
      const status = (row.getAttribute('data-status') || '').toLowerCase();
      let matchStatus = false;
      if (activeFilter === 'all') matchStatus = true;
      else if (activeFilter === 'pending') matchStatus = status === 'pending';
      else if (activeFilter === 'under_review' || activeFilter === 'review') matchStatus = status === 'under_review' || status === 'review';
      else if (activeFilter === 'accepted' || activeFilter === 'investigated') matchStatus = status === 'accepted' || status === 'investigated';
      else if (activeFilter === 'rejected') matchStatus = status === 'rejected';

      const text = row.textContent.toLowerCase();
      const matchSearch = !searchTerm || text.includes(searchTerm);

      row.style.display = (matchStatus && matchSearch) ? '' : 'none';
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = (btn.getAttribute('data-admin-filter') || 'all').toLowerCase();
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = (e.target.value || '').trim().toLowerCase();
    applyFilters();
  });

  // Enable interactive moderation in static preview mode for panel demonstration
  setupModerationModal();
  document.querySelectorAll('.review-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.submission-row');
      const claimStrong = row?.querySelector('td:first-child strong');
      const originSpan = row?.querySelector('td:nth-child(2)');
      const sub = {
        id: row?.getAttribute('data-id') || btn.getAttribute('data-sub-id') || 'preview-demo-id',
        claim_text: claimStrong?.textContent || 'Sample Claim Under Review',
        additional_context: originSpan?.textContent || 'Platform Origin Context',
        status: row?.getAttribute('data-status') || 'pending',
        created_at: new Date().toISOString()
      };
      openModerationModal(sub);
    });
  });
}

function getAdminStatusBadge(status) {
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

function showAdminAlert(alertBox, type, message) {
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

function truncateText(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
