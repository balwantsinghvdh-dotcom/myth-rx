/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Quick Search (Ctrl+K) & Universal Navigation Engine
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initQuickSearchModal);

  function initQuickSearchModal() {
    // If modal HTML does not exist in DOM, create and mount it dynamically
    let backdrop = document.getElementById('quickSearchBackdrop');
    if (!backdrop) {
      backdrop = createSearchModalDOM();
      document.body.appendChild(backdrop);
    }

    const modal = backdrop.querySelector('.quick-search-modal');
    const input = backdrop.querySelector('#quickSearchInput');
    const resultsContainer = backdrop.querySelector('#quickSearchResults');
    const closeBtn = backdrop.querySelector('#closeQuickSearchBtn');

    // Bind triggers
    const triggerButtons = document.querySelectorAll('.open-quick-search-trigger, #openQuickSearchBtn');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Keyboard shortcuts (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (backdrop.classList.contains('open')) {
          closeModal();
        } else {
          openModal();
        }
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Click outside modal to close
    backdrop.addEventListener('click', (e) => {
      if (!modal.contains(e.target)) {
        closeModal();
      }
    });

    // Real-time input search
    let debounceTimer = null;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performQuickSearch(input.value.trim(), resultsContainer);
      }, 150);
    });

    function openModal() {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      input.value = '';
      input.focus();
      performQuickSearch('', resultsContainer);
    }

    function closeModal() {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function createSearchModalDOM() {
    const backdrop = document.createElement('div');
    backdrop.id = 'quickSearchBackdrop';
    backdrop.className = 'quick-search-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-hidden', 'true');

    backdrop.innerHTML = `
      <div class="quick-search-modal" role="document">
        <div class="quick-search-input-row">
          <span class="quick-search-icon" aria-hidden="true">🔍</span>
          <input 
            type="search" 
            id="quickSearchInput" 
            class="quick-search-input" 
            placeholder="Search health claims, rumors, ingredients, or diseases..."
            aria-label="Search health claims"
            autocomplete="off"
            spellcheck="false"
          >
          <button type="button" class="quick-search-close-btn" id="closeQuickSearchBtn" aria-label="Close search dialog">✕</button>
        </div>
        <div class="quick-search-body">
          <div class="quick-search-results-list" id="quickSearchResults">
            <!-- Results populated dynamically -->
          </div>
        </div>
        <div class="quick-search-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd> • Select with <kbd>Enter</kbd></span>
          <span>Press <kbd>Esc</kbd> to close</span>
        </div>
      </div>
    `;

    return backdrop;
  }

  let liveArticlesCache = null;

  async function fetchLiveArticles() {
    const supabase = window.MythRx?.getSupabaseClient?.();
    if (!supabase) return [];
    if (liveArticlesCache) return liveArticlesCache;

    try {
      const { data, error } = await supabase
        .from('investigations')
        .select('id, title, slug, original_claim, summary, verdict, categories(name, slug)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(25);

      if (error) throw error;
      liveArticlesCache = (data || []).map(record => ({
        id: record.slug || record.id,
        title: record.title,
        originalClaim: record.original_claim,
        summary: record.summary,
        verdict: record.verdict,
        verdictLabel: record.verdict,
        categoryLabel: record.categories?.name || 'General Health',
        category: record.categories?.slug || 'general',
        isDemonstration: false
      }));
      return liveArticlesCache;
    } catch {
      return [];
    }
  }

  async function performQuickSearch(query, container) {
    if (!container) return;

    let items = [];

    // 1. Fetch live published investigations from database if available
    const liveItems = await fetchLiveArticles();

    // 2. Fetch local demo dataset as instant index
    const demoItems = (window.MythRxData && typeof window.MythRxData.getAllArticles === 'function')
      ? window.MythRxData.getAllArticles()
      : [];

    // Merge: live database items take precedence, demo items provide baseline coverage
    const combinedMap = new Map();
    liveItems.forEach(item => combinedMap.set(item.id, item));
    demoItems.forEach(item => {
      if (!combinedMap.has(item.id) && (!item.slug || !combinedMap.has(item.slug))) {
        combinedMap.set(item.id, item);
      }
    });

    items = Array.from(combinedMap.values());

    // 3. If user typed query, filter items
    let filtered = items;
    if (query) {
      const qLower = query.toLowerCase();
      filtered = items.filter(item => {
        return (
          item.title?.toLowerCase().includes(qLower) ||
          item.originalClaim?.toLowerCase().includes(qLower) ||
          item.summary?.toLowerCase().includes(qLower) ||
          item.categoryLabel?.toLowerCase().includes(qLower) ||
          item.verdict?.toLowerCase().includes(qLower)
        );
      });
    }

    const inAdmin = window.location.pathname.includes('/admin/');
    const rootPrefix = inAdmin ? '../' : '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔬</div>
          <p style="font-weight: 700; color: var(--color-navy); margin-bottom: 4px;">No matching investigations found</p>
          <p style="font-size: 0.85rem; margin-bottom: 1rem;">Have you heard a rumor we haven't covered yet?</p>
          <a href="${rootPrefix}contact.html#submit-claim" class="btn btn-outline-teal btn-sm">Submit This Claim for Fact-Checking &rarr;</a>
        </div>
      `;
      return;
    }

    // Render results list (limit to 6 for instant sleek scanning)
    const displayList = filtered.slice(0, 6);
    container.innerHTML = displayList.map(item => {
      const verdictClass = getVerdictBadgeClass(item.verdict);
      const verdictLabel = escapeHTML(item.verdictLabel || item.verdict || 'Unverified');
      const title = escapeHTML(item.title);
      const claim = escapeHTML(item.originalClaim || item.summary || '');
      const category = escapeHTML(item.categoryLabel || item.category || 'General Health');
      const href = `${rootPrefix}article.html?id=${encodeURIComponent(item.slug || item.id)}`;

      return `
        <a href="${href}" class="quick-search-result-item">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
              <span class="quick-search-result-title">${title}</span>
              <span class="category-tag" style="font-size: 0.68rem; padding: 1px 6px;">${category}</span>
            </div>
            <div class="quick-search-result-claim">“${claim}”</div>
          </div>
          <span class="verdict-badge ${verdictClass}" style="flex-shrink: 0; font-size: 0.68rem; padding: 2px 7px;">
            ${verdictLabel}
          </span>
        </a>
      `;
    }).join('');
  }

  function getVerdictBadgeClass(verdict) {
    const v = (verdict || '').toLowerCase();
    if (v === 'supported' || v === 'true') return 'verdict-supported';
    if (v === 'false') return 'verdict-false';
    if (v === 'misleading') return 'verdict-misleading';
    return 'verdict-unverified';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
