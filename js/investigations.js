/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Investigations Archive Controller: Supabase Integration & Multi-Filter Engine
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initInvestigationsArchive();
  initHomepageSearchBridge();
  initHomepageRecentInvestigations();
});

// Active Filter State
const archiveFilterState = {
  searchQuery: '',
  category: 'all',
  verdict: 'all',
  sortBy: 'newest'
};

let currentPage = 1;
const ITEMS_PER_PAGE = 6;
let loadedArticles = [];
let isDemonstrationMode = false;

/**
 * Initializes the investigations archive page.
 */
async function initInvestigationsArchive() {
  const gridContainer = document.getElementById('investigationsGrid');
  if (!gridContainer) return; // Not on investigations.html

  // Read URL parameters on initial load
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const catParam = urlParams.get('category');
  const verParam = urlParams.get('verdict');
  const sortParam = urlParams.get('sort');

  if (qParam) {
    archiveFilterState.searchQuery = qParam.trim();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = archiveFilterState.searchQuery;
  }

  if (catParam) {
    archiveFilterState.category = catParam.trim().toLowerCase();
  }

  if (verParam) {
    archiveFilterState.verdict = verParam.trim().toLowerCase();
  }

  if (sortParam && ['newest', 'oldest', 'alpha'].includes(sortParam.toLowerCase())) {
    archiveFilterState.sortBy = sortParam.toLowerCase();
  }

  // Setup form & interactive filter listeners
  setupArchiveSearchForm();
  setupCategoryFilterButtons();
  setupVerdictFilterButtons();
  setupSortSelect();
  setupResetFiltersButton();
  setupLoadMoreButton();

  // Synchronize button UI state
  syncActiveFilterUI();

  // Load live investigations or fallback
  await loadInvestigationsData();
}

/**
 * Loads investigations from the real Supabase database,
 * or falls back cleanly to the demo dataset with clear disclosure if unconfigured.
 */
async function loadInvestigationsData() {
  const gridContainer = document.getElementById('investigationsGrid');
  const countDisplay = document.getElementById('resultsCount');
  if (!gridContainer) return;

  const supabase = window.MythRx?.getSupabaseClient?.();

  // 1. If Supabase is configured, fetch live records
  if (supabase) {
    if (countDisplay) countDisplay.textContent = 'Connecting to clinical database...';
    renderLoadingState(gridContainer);

    try {
      // Query published investigations with joined category details
      const { data, error } = await supabase
        .from('investigations')
        .select(`
          id,
          title,
          slug,
          original_claim,
          summary,
          verdict,
          status,
          published_at,
          reviewed_at,
          category_id,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      isDemonstrationMode = false;
      loadedArticles = (data || []).map(record => ({
        id: record.slug || record.id,
        dbId: record.id,
        title: record.title,
        originalClaim: record.original_claim,
        summary: record.summary,
        verdict: (record.verdict || 'Unverified').toLowerCase(),
        verdictLabel: record.verdict || 'Unverified',
        category: record.categories?.slug || 'general',
        categoryLabel: record.categories?.name || 'General Health',
        publishedDate: record.published_at ? formatDate(record.published_at) : 'Published Fact-Check',
        publishedAtRaw: record.published_at ? new Date(record.published_at).getTime() : 0,
        isDemonstration: false
      }));

      // Render live banner removal
      removeDemoBanner();
      applyCombinedFiltersAndRender();
      return;

    } catch (err) {
      console.warn('[Myth Rx] Database fetch notice:', err.message);
      // Display error with option to view local preview
      renderErrorState(gridContainer, err.message);
      if (countDisplay) countDisplay.textContent = 'Database query encountered an issue.';
      return;
    }
  }

  // 2. Fallback: Supabase credentials not configured -> run in explicit Demonstration Mode
  isDemonstrationMode = true;
  const demoData = window.MythRxData ? window.MythRxData.getAllArticles() : [];
  loadedArticles = demoData.map(item => ({
    ...item,
    verdict: item.verdict.toLowerCase(),
    category: item.category.toLowerCase(),
    publishedAtRaw: item.publishedDate ? new Date(item.publishedDate).getTime() : 0
  }));

  displayDemoBanner();
  applyCombinedFiltersAndRender();
}

/**
 * Handles search form submissions on the archive page.
 */
function setupArchiveSearchForm() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      archiveFilterState.searchQuery = searchInput.value.trim();
      currentPage = 1;
      applyCombinedFiltersAndRender();
    });

    // Real-time search as user types
    searchInput.addEventListener('input', () => {
      archiveFilterState.searchQuery = searchInput.value.trim();
      currentPage = 1;
      applyCombinedFiltersAndRender();
    });
  }
}

/**
 * Handles category filter button clicks.
 */
function setupCategoryFilterButtons() {
  const buttons = document.querySelectorAll('[data-category]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-category') || 'all';
      archiveFilterState.category = cat.toLowerCase();
      currentPage = 1;
      syncActiveFilterUI();
      applyCombinedFiltersAndRender();
    });
  });
}

/**
 * Handles verdict filter button clicks (Supported, False, Misleading, Unverified).
 */
function setupVerdictFilterButtons() {
  const buttons = document.querySelectorAll('[data-verdict-filter]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const verdict = btn.getAttribute('data-verdict-filter') || 'all';
      archiveFilterState.verdict = verdict.toLowerCase();
      currentPage = 1;
      syncActiveFilterUI();
      applyCombinedFiltersAndRender();
    });
  });
}

/**
 * Handles sort order selection dropdown (newest, oldest, alpha).
 */
function setupSortSelect() {
  const sortSelect = document.getElementById('archiveSortSelect');
  if (sortSelect) {
    sortSelect.value = archiveFilterState.sortBy;
    sortSelect.addEventListener('change', (e) => {
      archiveFilterState.sortBy = e.target.value;
      currentPage = 1;
      applyCombinedFiltersAndRender();
    });
  }
}

/**
 * Handles pagination "Load More" button clicks.
 */
function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      applyCombinedFiltersAndRender();
    });
  }
}

/**
 * Handles the "Reset All Filters" button.
 */
function setupResetFiltersButton() {
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }
}

/**
 * Resets search query, category, verdict, and sort order filters back to default.
 */
function resetAllFilters() {
  archiveFilterState.searchQuery = '';
  archiveFilterState.category = 'all';
  archiveFilterState.verdict = 'all';
  archiveFilterState.sortBy = 'newest';
  currentPage = 1;

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('archiveSortSelect');
  if (sortSelect) sortSelect.value = 'newest';

  if (window.history.replaceState) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  syncActiveFilterUI();
  applyCombinedFiltersAndRender();
}

/**
 * Synchronizes the visual active state of filter chips.
 */
function syncActiveFilterUI() {
  document.querySelectorAll('[data-category]').forEach((btn) => {
    const val = (btn.getAttribute('data-category') || '').toLowerCase();
    btn.classList.toggle('active', val === archiveFilterState.category);
  });

  document.querySelectorAll('[data-verdict-filter]').forEach((btn) => {
    const val = (btn.getAttribute('data-verdict-filter') || '').toLowerCase();
    btn.classList.toggle('active', val === archiveFilterState.verdict);
  });
}

/**
 * Applies active filters (Search query AND Category AND Verdict AND Sort Order)
 * and manages pagination / load-more states.
 */
function applyCombinedFiltersAndRender() {
  const gridContainer = document.getElementById('investigationsGrid');
  const countDisplay = document.getElementById('resultsCount');
  if (!gridContainer) return;

  const query = archiveFilterState.searchQuery.toLowerCase();
  const selectedCat = archiveFilterState.category;
  const selectedVer = archiveFilterState.verdict;

  let filtered = loadedArticles.filter((article) => {
    // 1. Category Match
    const matchesCategory = 
      selectedCat === 'all' || 
      article.category === selectedCat ||
      (selectedCat === 'nutrition' && article.category === 'diet') ||
      (selectedCat === 'diet' && article.category === 'nutrition');

    // 2. Verdict Match
    const matchesVerdict = 
      selectedVer === 'all' || 
      article.verdict === selectedVer ||
      (selectedVer === 'supported' && article.verdict === 'true') ||
      (selectedVer === 'unverified' && article.verdict === 'unproven');

    // 3. Search Query Match
    let matchesSearch = true;
    if (query) {
      const textToSearch = [
        article.title || '',
        article.originalClaim || '',
        article.summary || '',
        article.categoryLabel || '',
        article.verdictLabel || ''
      ].join(' ').toLowerCase();

      matchesSearch = textToSearch.includes(query);
    }

    return matchesCategory && matchesVerdict && matchesSearch;
  });

  // 4. Sort Items
  filtered.sort((a, b) => {
    if (archiveFilterState.sortBy === 'oldest') {
      return (a.publishedAtRaw || 0) - (b.publishedAtRaw || 0);
    } else if (archiveFilterState.sortBy === 'alpha') {
      return (a.title || '').localeCompare(b.title || '');
    } else {
      // newest (default)
      return (b.publishedAtRaw || 0) - (a.publishedAtRaw || 0);
    }
  });

  const totalFiltered = filtered.length;
  const visibleArticles = filtered.slice(0, currentPage * ITEMS_PER_PAGE);

  // Update Result Count
  if (countDisplay) {
    const total = loadedArticles.length;
    countDisplay.textContent = `Showing ${visibleArticles.length} of ${totalFiltered} filtered investigation${totalFiltered === 1 ? '' : 's'} (${total} total)`;
  }

  // Render Cards or Empty State
  renderInvestigationCards(gridContainer, visibleArticles);

  // Update Pagination Controls
  const pagContainer = document.getElementById('archivePaginationContainer');
  const pagInfo = document.getElementById('paginationInfo');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (pagContainer && loadMoreBtn) {
    if (totalFiltered <= ITEMS_PER_PAGE) {
      pagContainer.style.display = 'none';
    } else {
      pagContainer.style.display = 'block';
      if (visibleArticles.length < totalFiltered) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.textContent = `Load More Investigations (${visibleArticles.length} of ${totalFiltered})`;
        if (pagInfo) pagInfo.textContent = `Displaying ${visibleArticles.length} of ${totalFiltered} investigations`;
      } else {
        loadMoreBtn.style.display = 'none';
        if (pagInfo) pagInfo.textContent = `All ${totalFiltered} investigations loaded`;
      }
    }
  }
}

/**
 * Safely renders the investigation cards into the DOM.
 */
function renderInvestigationCards(container, articles) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (articles.length === 0) {
    const emptyState = createEmptyStateElement();
    container.appendChild(emptyState);
    return;
  }

  articles.forEach((article) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'investigation-card-wrapper';
    cardWrapper.setAttribute('data-category', article.category);
    cardWrapper.setAttribute('data-verdict', article.verdict);

    const articleCard = document.createElement('article');
    articleCard.className = 'card investigation-card';

    // Header (Verdict Badge & Category Tag)
    const cardHeader = document.createElement('div');
    cardHeader.className = 'investigation-card-header';

    const verdictBadge = document.createElement('span');
    verdictBadge.className = `verdict-badge verdict-${article.verdict}`;
    verdictBadge.textContent = article.verdictLabel;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = article.categoryLabel;

    cardHeader.appendChild(verdictBadge);
    cardHeader.appendChild(categoryTag);

    // Claim Box
    const claimBox = document.createElement('div');
    claimBox.className = 'investigation-claim-box';

    const claimLabel = document.createElement('div');
    claimLabel.className = 'investigation-claim-label';
    claimLabel.textContent = 'Original Claim';

    const claimText = document.createElement('p');
    claimText.className = 'investigation-claim-text';
    claimText.textContent = `"${article.originalClaim}"`;

    claimBox.appendChild(claimLabel);
    claimBox.appendChild(claimText);

    // Title
    const titleElem = document.createElement('h3');
    titleElem.className = 'investigation-title';

    const titleLink = document.createElement('a');
    titleLink.href = `article.html?id=${encodeURIComponent(article.id)}`;
    titleLink.textContent = article.title;

    titleElem.appendChild(titleLink);

    // Summary
    const summaryElem = document.createElement('p');
    summaryElem.className = 'investigation-summary';
    summaryElem.textContent = article.summary;

    // Metadata Footer
    const metaFooter = document.createElement('div');
    metaFooter.className = 'investigation-meta';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'investigation-meta-source';
    dateSpan.textContent = `📅 ${article.publishedDate}`;

    const readLink = document.createElement('a');
    readLink.href = `article.html?id=${encodeURIComponent(article.id)}`;
    readLink.style.fontWeight = '600';
    readLink.textContent = 'Read Investigation →';

    metaFooter.appendChild(dateSpan);
    metaFooter.appendChild(readLink);

    // Assemble Card
    articleCard.appendChild(cardHeader);
    articleCard.appendChild(claimBox);
    articleCard.appendChild(titleElem);
    articleCard.appendChild(summaryElem);
    articleCard.appendChild(metaFooter);

    cardWrapper.appendChild(articleCard);
    container.appendChild(cardWrapper);
  });
}

/**
 * Creates the empty state DOM element when no investigations match.
 */
function createEmptyStateElement() {
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.style.gridColumn = '1 / -1';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'empty-state-icon';
  iconDiv.textContent = '🔍';

  const titleElem = document.createElement('h3');
  titleElem.className = 'empty-state-title';
  titleElem.textContent = loadedArticles.length === 0 
    ? 'No published investigations in database yet' 
    : 'No matching investigations found';

  const textElem = document.createElement('p');
  textElem.className = 'empty-state-text';
  textElem.textContent = loadedArticles.length === 0
    ? 'The clinical editorial team has not published any fact-check investigations to the live database yet. Check back soon or submit a claim.'
    : 'No fact-checks match your current search terms and selected filters. Try broadening your keywords or resetting filters.';

  emptyDiv.appendChild(iconDiv);
  emptyDiv.appendChild(titleElem);
  emptyDiv.appendChild(textElem);

  if (loadedArticles.length > 0) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-primary btn-sm';
    resetBtn.textContent = 'Reset All Filters';
    resetBtn.addEventListener('click', resetAllFilters);
    emptyDiv.appendChild(resetBtn);
  }

  return emptyDiv;
}

/**
 * Renders loading spinner/message.
 */
function renderLoadingState(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const loadingDiv = document.createElement('div');
  loadingDiv.style.gridColumn = '1 / -1';
  loadingDiv.style.textAlign = 'center';
  loadingDiv.style.padding = 'var(--space-2xl) 0';
  loadingDiv.innerHTML = `
    <div style="font-size: 1.8rem; margin-bottom: 8px;">⏳</div>
    <h3 style="font-size: 1.15rem; color: var(--color-navy);">Retrieving Published Fact-Checks...</h3>
    <p class="text-muted" style="font-size: 0.9rem;">Connecting to Supabase clinical database...</p>
  `;
  container.appendChild(loadingDiv);
}

/**
 * Renders error state.
 */
function renderErrorState(container, errorMsg) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const errDiv = document.createElement('div');
  errDiv.className = 'medical-disclaimer-box';
  errDiv.style.gridColumn = '1 / -1';
  errDiv.style.backgroundColor = '#FEF2F2';
  errDiv.style.borderLeftColor = '#DC2626';
  errDiv.style.color = '#991B1B';
  errDiv.innerHTML = `
    <strong>Database Query Error:</strong> ${escapeHTML(errorMsg)}<br>
    <div style="margin-top: 10px;">
      <button class="btn btn-secondary btn-sm" onclick="location.reload();">Retry Database Query</button>
      <button class="btn btn-outline-teal btn-sm" id="loadDemoBtn" style="margin-left: 8px;">View Local Demo Archive</button>
    </div>
  `;
  container.appendChild(errDiv);

  const demoBtn = document.getElementById('loadDemoBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      isDemonstrationMode = true;
      const demoData = window.MythRxData ? window.MythRxData.getAllArticles() : [];
      loadedArticles = demoData.map(item => ({
        ...item,
        verdict: item.verdict.toLowerCase(),
        category: item.category.toLowerCase()
      }));
      displayDemoBanner();
      applyCombinedFiltersAndRender();
    });
  }
}

/**
 * Displays an honest demonstration mode banner.
 */
function displayDemoBanner() {
  let banner = document.getElementById('archiveDemoBanner');
  if (!banner) {
    const filterSection = document.querySelector('.filter-bar');
    if (filterSection && filterSection.parentNode) {
      banner = document.createElement('div');
      banner.id = 'archiveDemoBanner';
      banner.className = 'medical-disclaimer-box';
      banner.style.marginTop = '0';
      banner.style.marginBottom = 'var(--space-lg)';
      banner.style.fontSize = '0.85rem';
      banner.style.backgroundColor = '#EFF6FF';
      banner.style.borderLeftColor = '#3B82F6';
      banner.style.color = '#1E40AF';
      banner.innerHTML = '<strong>Demonstration Mode:</strong> Displaying static preview dataset. Add your live Supabase credentials in <code>js/supabase.js</code> to stream records directly from the database.';
      filterSection.parentNode.insertBefore(banner, filterSection);
    }
  }
}

function removeDemoBanner() {
  const banner = document.getElementById('archiveDemoBanner');
  if (banner && banner.parentNode) {
    banner.parentNode.removeChild(banner);
  }
}

/**
 * Handles search bar on the homepage (index.html).
 */
function initHomepageSearchBridge() {
  const homepageForm = document.getElementById('searchForm');
  const homepageInput = document.getElementById('searchInput');

  if (homepageForm && homepageInput && !window.location.pathname.includes('investigations.html')) {
    homepageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = homepageInput.value.trim();
      window.location.href = q ? `investigations.html?q=${encodeURIComponent(q)}` : 'investigations.html';
    });
  }
}

/**
 * Loads recent published investigations on the public homepage (index.html).
 */
async function initHomepageRecentInvestigations() {
  const grid = document.getElementById('homeRecentInvestigationsGrid');
  if (!grid) return; // Not on homepage

  const supabase = window.MythRx?.getSupabaseClient?.();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('investigations')
        .select(`
          id,
          title,
          slug,
          original_claim,
          summary,
          verdict,
          status,
          published_at,
          category_id,
          categories (
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        while (grid.firstChild) {
          grid.removeChild(grid.firstChild);
        }

        data.forEach(item => {
          const cardWrapper = document.createElement('div');
          cardWrapper.className = 'investigation-card-wrapper';
          const verdictLower = (item.verdict || 'unverified').toLowerCase();
          const categorySlug = item.categories?.slug || 'general';
          const categoryName = item.categories?.name || 'General Health';
          cardWrapper.setAttribute('data-category', categorySlug);
          cardWrapper.setAttribute('data-verdict', verdictLower);

          const article = document.createElement('article');
          article.className = 'card investigation-card';

          article.innerHTML = `
            <div class="investigation-card-header">
              <span class="verdict-badge verdict-${escapeHTML(verdictLower)}">${escapeHTML(item.verdict || 'Unverified')}</span>
              <span class="category-tag">${escapeHTML(categoryName)}</span>
            </div>
            <div class="investigation-claim-box">
              <div class="investigation-claim-label">The Claim</div>
              <p class="investigation-claim-text">"${escapeHTML(item.original_claim || '')}"</p>
            </div>
            <h3 class="investigation-title">
              <a href="article.html?id=${encodeURIComponent(item.slug || item.id)}">${escapeHTML(item.title)}</a>
            </h3>
            <p class="investigation-summary">
              ${escapeHTML(item.summary || '')}
            </p>
            <div class="investigation-meta">
              <span class="investigation-meta-source">📅 ${formatDate(item.published_at)}</span>
              <a href="article.html?id=${encodeURIComponent(item.slug || item.id)}" style="font-weight: 600;">Full Verdict &rarr;</a>
            </div>
          `;

          cardWrapper.appendChild(article);
          grid.appendChild(cardWrapper);
        });
        return;
      } else if (data && data.length === 0) {
        // Live database connected, but 0 published records in database
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: var(--space-xl); text-align: center;">
            <div class="empty-state-icon">🔬</div>
            <h3 style="color: var(--color-navy); font-size: 1.15rem; margin-bottom: 6px;">No Published Investigations in Database Yet</h3>
            <p class="text-muted" style="font-size: 0.9rem; margin-bottom: var(--space-md);">Our clinical editorial team has not published any fact-checks to the live database yet. You can submit a new rumor for investigation.</p>
            <a href="contact.html#submit-claim" class="btn btn-outline-teal btn-sm">Submit a Health Claim &rarr;</a>
          </div>
        `;
        return;
      }
    } catch (err) {
      console.warn('[Myth Rx] Homepage live investigation fetch notice:', err.message);
      // Fallback gracefully to demo cards already present in HTML
    }
  }
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

// Expose helper to window namespace
window.MythRx = window.MythRx || {};
window.MythRx.resetAllFilters = resetAllFilters;
window.MythRx.applyCombinedFiltersAndRender = applyCombinedFiltersAndRender;
window.MythRx.loadInvestigationsData = loadInvestigationsData;
window.MythRx.initHomepageRecentInvestigations = initHomepageRecentInvestigations;
