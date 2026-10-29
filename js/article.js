/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Dynamic Article Detail Controller, Supabase Evidence Fetcher & Bookmark Manager
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initArticleDetailPage();
});

async function initArticleDetailPage() {
  const articleRoot = document.getElementById('articleContainer');
  if (!articleRoot) return; // Not on article.html

  // Read the ?id=... parameter from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const articleParam = urlParams.get('id');

  // If no ID is specified, default to 'ginger-kidney-stones'
  const targetId = articleParam ? articleParam.trim() : 'ginger-kidney-stones';

  renderArticleLoading(articleRoot);

  const supabase = window.MythRx?.getSupabaseClient?.();

  // 1. If Supabase is configured, attempt to fetch from the live database
  if (supabase) {
    try {
      // Determine if parameter is UUID or slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

      // Check if viewing user is an administrator to allow draft previews
      const profile = await window.MythRx?.getCurrentUserProfile?.();
      const isAdmin = profile?.role === 'admin';

      let query = supabase
        .from('investigations')
        .select(`
          id,
          title,
          slug,
          original_claim,
          summary,
          article_content,
          verdict,
          status,
          published_at,
          reviewed_at,
          created_at,
          category_id,
          categories (
            id,
            name,
            slug
          )
        `);

      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      if (isUuid) {
        query = query.eq('id', targetId);
      } else {
        query = query.eq('slug', targetId);
      }

      const { data: invData, error: invError } = await query.maybeSingle();

      if (invError) {
        throw invError;
      }

      if (invData) {
        // Fetch related sources from public.sources
        const { data: sourcesData } = await supabase
          .from('sources')
          .select('id, title, source_url, publisher, publication_date, notes')
          .eq('investigation_id', invData.id);

        // Fetch related published investigations
        const { data: relatedData } = await supabase
          .from('investigations')
          .select('id, slug, title, verdict')
          .eq('status', 'published')
          .neq('id', invData.id)
          .limit(3);

        // Check bookmark status for current user if signed in
        let isBookmarked = false;
        let bookmarkId = null;
        const currentUser = await window.MythRx?.getCurrentUser?.();

        if (currentUser) {
          const { data: bmData } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('investigation_id', invData.id)
            .maybeSingle();

          if (bmData) {
            isBookmarked = true;
            bookmarkId = bmData.id;
          }
        }

        // Map database record to standard view model
        const mappedArticle = mapDatabaseInvestigation(invData, sourcesData, relatedData, isBookmarked, bookmarkId);
        renderArticleDetail(articleRoot, mappedArticle);
        return;
      }
    } catch (err) {
      console.warn('[Myth Rx] Database article fetch note:', err.message);
    }
  }

  // 2. Fallback: Lookup in demonstration dataset
  // If an explicit ID was requested and neither database nor demo data matches, render honest 404
  if (articleParam) {
    const demoArticle = window.MythRxData?.getArticleById(targetId);
    if (demoArticle) {
      renderArticleDetail(articleRoot, demoArticle);
      return;
    }
    renderArticleNotFound(articleRoot, `No published fact-check investigation found matching ID: "${escapeText(targetId)}"`);
    return;
  }

  // If no ID parameter was specified in the URL at all, load the introductory demo article
  const defaultSample = window.MythRxData?.getArticleById('ginger-kidney-stones');
  if (defaultSample) {
    renderArticleDetail(articleRoot, defaultSample);
    return;
  }

  renderArticleNotFound(articleRoot, 'No investigation specified. Please select an investigation from the archive.');
}

/**
 * Maps database records to the unified article detail structure.
 */
function mapDatabaseInvestigation(inv, sources, related, isBookmarked, bookmarkId) {
  let content = inv.article_content || {};
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = { body: content };
    }
  }

  const detailedExp = Array.isArray(content.detailedExplanation) 
    ? content.detailedExplanation 
    : (content.body ? [content.body] : [inv.summary]);

  const scientificEv = Array.isArray(content.scientificEvidence)
    ? content.scientificEvidence
    : (content.evidence ? [content.evidence] : []);

  const risks = Array.isArray(content.risksAndLimitations)
    ? content.risksAndLimitations
    : (content.risks ? [content.risks] : []);

  const sourcesList = (sources || []).map(s => ({
    title: s.title,
    citation: `${s.publisher || 'Medical Reference'}${s.publication_date ? ' (' + s.publication_date + ')' : ''}`,
    url: s.source_url
  }));

  const mappedRelated = (related || []).map(r => ({
    id: r.slug || r.id,
    title: r.title,
    verdict: (r.verdict || 'unverified').toLowerCase(),
    verdictLabel: r.verdict || 'Unverified'
  }));

  return {
    id: inv.slug || inv.id,
    dbId: inv.id,
    title: inv.title,
    originalClaim: inv.original_claim,
    claimOrigin: content.claimOrigin || 'Reported community health claim',
    category: inv.categories?.slug || 'general',
    categoryLabel: inv.categories?.name || 'General Health',
    verdict: (inv.verdict || 'unverified').toLowerCase(),
    verdictLabel: inv.verdict || 'Unverified',
    summary: inv.summary,
    conclusion: content.conclusion || inv.summary,
    detailedExplanation: detailedExp,
    scientificEvidence: scientificEv,
    risksAndLimitations: risks,
    sources: sourcesList,
    relatedInvestigations: mappedRelated,
    publishedDate: inv.published_at ? formatDate(inv.published_at) : 'Published Fact-Check',
    reviewDate: inv.reviewed_at ? formatDate(inv.reviewed_at) : null,
    readTime: '4 min read',
    isDemonstration: false,
    isBookmarked: isBookmarked,
    bookmarkId: bookmarkId,
    isDraft: inv.status === 'draft',
    status: inv.status || 'published'
  };
}

/**
 * Renders the full article detail view using safe DOM manipulation.
 */
function renderArticleDetail(container, article) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Update browser document title
  document.title = `Fact-Check: ${article.title} — Myth Rx`;

  // Render Admin Draft Banner if viewing an unpublished draft
  if (article.isDraft) {
    const draftNotice = document.createElement('div');
    draftNotice.className = 'medical-disclaimer-box';
    draftNotice.style.backgroundColor = '#FEF3C7';
    draftNotice.style.borderLeftColor = '#D97706';
    draftNotice.style.color = '#92400E';
    draftNotice.style.marginBottom = '1.5rem';
    draftNotice.innerHTML = `<strong>🔒 Administrator Draft Preview:</strong> This fact-check investigation is saved as an internal <strong>DRAFT</strong> and is not published to the public. <a href="admin/new-investigation.html?id=${encodeURIComponent(article.dbId || '')}" style="text-decoration: underline; font-weight: 700; margin-left: 8px;">Edit in Admin Desk &rarr;</a>`;
    container.appendChild(draftNotice);
  }

  // 1. Breadcrumbs
  const breadcrumbsNav = document.createElement('nav');
  breadcrumbsNav.setAttribute('aria-label', 'Breadcrumb');
  breadcrumbsNav.style.marginBottom = 'var(--space-md)';
  breadcrumbsNav.style.fontSize = '0.85rem';
  breadcrumbsNav.style.color = 'var(--color-text-muted)';

  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = 'Home';

  const sep1 = document.createTextNode(' › ');

  const archiveLink = document.createElement('a');
  archiveLink.href = 'investigations.html';
  archiveLink.textContent = 'Investigations';

  const sep2 = document.createTextNode(' › ');

  const catLink = document.createElement('a');
  catLink.href = `investigations.html?category=${encodeURIComponent(article.category)}`;
  catLink.textContent = article.categoryLabel;

  const sep3 = document.createTextNode(' › ');

  const currentSpan = document.createElement('span');
  currentSpan.textContent = truncateText(article.title, 40);

  breadcrumbsNav.appendChild(homeLink);
  breadcrumbsNav.appendChild(sep1);
  breadcrumbsNav.appendChild(archiveLink);
  breadcrumbsNav.appendChild(sep2);
  breadcrumbsNav.appendChild(catLink);
  breadcrumbsNav.appendChild(sep3);
  breadcrumbsNav.appendChild(currentSpan);

  container.appendChild(breadcrumbsNav);

  // 3. Article Header
  const headerElem = document.createElement('header');
  headerElem.style.marginBottom = 'var(--space-xl)';

  const metaPillsRow = document.createElement('div');
  metaPillsRow.style.display = 'flex';
  metaPillsRow.style.gap = 'var(--space-xs)';
  metaPillsRow.style.alignItems = 'center';
  metaPillsRow.style.flexWrap = 'wrap';
  metaPillsRow.style.marginBottom = 'var(--space-sm)';

  const categoryTag = document.createElement('span');
  categoryTag.className = 'category-tag';
  categoryTag.textContent = article.categoryLabel;

  const pubDateSpan = document.createElement('span');
  pubDateSpan.className = 'text-muted';
  pubDateSpan.style.fontSize = '0.8rem';
  pubDateSpan.textContent = `Published: ${article.publishedDate}`;

  metaPillsRow.appendChild(categoryTag);
  metaPillsRow.appendChild(pubDateSpan);

  if (article.reviewDate) {
    const revSpan = document.createElement('span');
    revSpan.className = 'text-muted';
    revSpan.style.fontSize = '0.8rem';
    revSpan.textContent = `• Review Date: ${article.reviewDate}`;
    metaPillsRow.appendChild(revSpan);
  }

  const h1Elem = document.createElement('h1');
  h1Elem.style.fontSize = '2.3rem';
  h1Elem.style.marginBottom = 'var(--space-md)';
  h1Elem.textContent = article.title;

  const leadSummary = document.createElement('p');
  leadSummary.className = 'text-muted';
  leadSummary.style.fontSize = '1.15rem';
  leadSummary.style.maxWidth = '800px';
  leadSummary.textContent = article.summary;

  headerElem.appendChild(metaPillsRow);
  headerElem.appendChild(h1Elem);
  headerElem.appendChild(leadSummary);

  container.appendChild(headerElem);

  // 4. Large Verdict Banner
  const verdictBanner = document.createElement('div');
  verdictBanner.className = `verdict-banner verdict-banner-${article.verdict}`;
  verdictBanner.setAttribute('role', 'region');
  verdictBanner.setAttribute('aria-label', 'Fact Check Verdict');

  const verdictContentDiv = document.createElement('div');

  const badgeElem = document.createElement('span');
  badgeElem.className = `verdict-badge verdict-${article.verdict}`;
  badgeElem.style.fontSize = '0.9rem';
  badgeElem.style.padding = '6px 14px';
  badgeElem.textContent = `VERDICT: ${article.verdictLabel.toUpperCase()}`;

  const verdictTitle = document.createElement('h2');
  verdictTitle.style.fontSize = '1.3rem';
  verdictTitle.style.marginTop = 'var(--space-xs)';
  verdictTitle.style.marginBottom = '4px';
  verdictTitle.textContent = getVerdictSummaryHeading(article.verdict, article.title);

  const verdictConclusion = document.createElement('p');
  verdictConclusion.style.fontSize = '0.95rem';
  verdictConclusion.style.marginBottom = '0';
  verdictConclusion.textContent = article.conclusion;

  verdictContentDiv.appendChild(badgeElem);
  verdictContentDiv.appendChild(verdictTitle);
  verdictContentDiv.appendChild(verdictConclusion);
  verdictBanner.appendChild(verdictContentDiv);

  container.appendChild(verdictBanner);

  // 5. Two-column Layout: Article Body & Sidebar
  const layoutDiv = document.createElement('div');
  layoutDiv.className = 'article-layout';

  // --- MAIN BODY ---
  const bodyElem = document.createElement('article');
  bodyElem.className = 'article-body';

  // Original Claim Box
  const claimBox = document.createElement('div');
  claimBox.className = 'investigation-claim-box';
  claimBox.style.marginBottom = 'var(--space-xl)';
  claimBox.style.padding = 'var(--space-md)';

  const claimLabel = document.createElement('div');
  claimLabel.className = 'investigation-claim-label';
  claimLabel.style.fontWeight = '800';
  claimLabel.textContent = 'The Exact Viral Claim Being Circulated:';

  const claimQuote = document.createElement('p');
  claimQuote.className = 'investigation-claim-text';
  claimQuote.style.fontSize = '1.05rem';
  claimQuote.style.fontStyle = 'italic';
  claimQuote.textContent = `"${article.originalClaim}"`;

  const claimOriginSpan = document.createElement('div');
  claimOriginSpan.style.fontSize = '0.8rem';
  claimOriginSpan.className = 'text-muted';
  claimOriginSpan.style.marginTop = '6px';
  claimOriginSpan.textContent = `Platform Origin: ${article.claimOrigin}`;

  claimBox.appendChild(claimLabel);
  claimBox.appendChild(claimQuote);
  claimBox.appendChild(claimOriginSpan);
  bodyElem.appendChild(claimBox);

  // Detailed Clinical Explanation
  const expHeading = document.createElement('h2');
  expHeading.textContent = '1. Detailed Scientific Explanation';
  bodyElem.appendChild(expHeading);

  (article.detailedExplanation || []).forEach((pText) => {
    const p = document.createElement('p');
    p.textContent = pText;
    bodyElem.appendChild(p);
  });

  // Scientific Evidence (only if present)
  if (article.scientificEvidence && article.scientificEvidence.length > 0) {
    const sciHeading = document.createElement('h2');
    sciHeading.textContent = '2. Scientific Consensus & Peer-Reviewed Evidence';
    bodyElem.appendChild(sciHeading);

    const evidenceList = document.createElement('ul');
    evidenceList.style.listStyle = 'disc';
    evidenceList.style.paddingLeft = '1.25rem';
    evidenceList.style.marginBottom = '1.5rem';

    article.scientificEvidence.forEach((eText) => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.textContent = eText;
      evidenceList.appendChild(li);
    });
    bodyElem.appendChild(evidenceList);
  }

  // Clinical Risks (only if present)
  if (article.risksAndLimitations && article.risksAndLimitations.length > 0) {
    const risksHeading = document.createElement('h2');
    risksHeading.textContent = '3. Clinical Risks & Harm Analysis';
    bodyElem.appendChild(risksHeading);

    const risksList = document.createElement('ul');
    risksList.style.listStyle = 'disc';
    risksList.style.paddingLeft = '1.25rem';
    risksList.style.marginBottom = '1.5rem';

    article.risksAndLimitations.forEach((rText) => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.textContent = rText;
      risksList.appendChild(li);
    });
    bodyElem.appendChild(risksList);
  }

  // Source References Section (only if sources exist)
  if (article.sources && article.sources.length > 0) {
    const sourcesBox = document.createElement('div');
    sourcesBox.className = 'source-list';
    sourcesBox.id = 'references';

    const sourcesHeading = document.createElement('h3');
    sourcesHeading.style.fontSize = '1.1rem';
    sourcesHeading.style.marginBottom = 'var(--space-sm)';
    sourcesHeading.style.color = 'var(--color-navy)';
    sourcesHeading.textContent = '📚 Peer-Reviewed Sources & Guidelines';
    sourcesBox.appendChild(sourcesHeading);

    article.sources.forEach((source, index) => {
      const item = document.createElement('div');
      item.className = 'source-item';

      const indexBold = document.createElement('strong');
      indexBold.textContent = `${index + 1}. ${source.title}: `;

      const citationSpan = document.createElement('span');
      citationSpan.className = 'text-muted';
      citationSpan.textContent = source.citation;

      item.appendChild(indexBold);
      item.appendChild(citationSpan);

      if (source.url && source.url.startsWith('http')) {
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.marginLeft = '6px';
        link.style.fontSize = '0.8rem';
        link.textContent = '[External Citation ↗]';
        item.appendChild(link);
      }

      sourcesBox.appendChild(item);
    });

    bodyElem.appendChild(sourcesBox);
  }

  layoutDiv.appendChild(bodyElem);

  // --- SIDEBAR ---
  const asideElem = document.createElement('aside');
  asideElem.className = 'article-sidebar';
  asideElem.setAttribute('aria-label', 'Investigation Details');

  // Summary Card
  const summaryCard = document.createElement('div');
  summaryCard.className = 'card mb-md';

  const summaryHeader = document.createElement('h3');
  summaryHeader.style.fontSize = '1rem';
  summaryHeader.style.textTransform = 'uppercase';
  summaryHeader.style.letterSpacing = '0.6px';
  summaryHeader.style.marginBottom = 'var(--space-sm)';
  summaryHeader.textContent = 'Fact-Check Overview';
  summaryCard.appendChild(summaryHeader);

  summaryCard.appendChild(createMetaRow('Verdict Rating', article.verdictLabel));
  summaryCard.appendChild(createMetaRow('Category', article.categoryLabel));
  summaryCard.appendChild(createMetaRow('Date Published', article.publishedDate));

  // Bookmark Button (Connected to Supabase public.bookmarks)
  const bookmarkBtn = document.createElement('button');
  bookmarkBtn.type = 'button';
  bookmarkBtn.className = 'btn btn-outline-teal btn-block mt-sm';
  bookmarkBtn.id = 'bookmarkArticleBtn';
  bookmarkBtn.innerHTML = article.isBookmarked ? '★ Saved to Bookmarks' : '☆ Bookmark Fact-Check';

  bookmarkBtn.addEventListener('click', async () => {
    await handleBookmarkToggle(article, bookmarkBtn);
  });

  summaryCard.appendChild(bookmarkBtn);

  // WhatsApp Share Button
  const shareBtn = document.createElement('a');
  shareBtn.className = 'whatsapp-share-btn btn-block mt-sm';
  shareBtn.target = '_blank';
  shareBtn.rel = 'noopener noreferrer';
  
  const currentUrl = window.location.href;
  const shareMessage = `*Fact-Check by Myth Rx:*\n${article.title}\nVerdict: ${article.verdictLabel.toUpperCase()}\nRead the scientific analysis:\n${currentUrl}`;
  shareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  shareBtn.textContent = '📲 Share Fact-Check on WhatsApp';
  summaryCard.appendChild(shareBtn);

  // Universal Copy Link Button
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn btn-secondary btn-sm btn-block mt-xs';
  copyBtn.id = 'copyArticleLinkBtn';
  copyBtn.innerHTML = '📋 Copy Article Link';
  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
      copyBtn.innerHTML = '✓ Link Copied to Clipboard!';
      copyBtn.classList.remove('btn-secondary');
      copyBtn.classList.add('btn-primary');
      setTimeout(() => {
        copyBtn.innerHTML = '📋 Copy Article Link';
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-secondary');
      }, 2500);
    } catch {
      prompt('Copy this fact-check link:', window.location.href);
    }
  });
  summaryCard.appendChild(copyBtn);

  asideElem.appendChild(summaryCard);

  // Related Investigations Card
  const relatedCard = document.createElement('div');
  relatedCard.className = 'card';

  const relatedHeading = document.createElement('h3');
  relatedHeading.style.fontSize = '1rem';
  relatedHeading.style.marginBottom = 'var(--space-sm)';
  relatedHeading.textContent = 'Related Investigations';
  relatedCard.appendChild(relatedHeading);

  const relatedList = document.createElement('ul');
  const relatedItems = article.relatedInvestigations || 
    (window.MythRxData?.getAllArticles() || []).filter(item => item.id !== article.id).slice(0, 3);

  relatedItems.forEach((rel) => {
    const li = document.createElement('li');
    li.style.marginBottom = 'var(--space-xs)';
    li.style.paddingBottom = 'var(--space-xs)';
    li.style.borderBottom = '1px solid var(--color-border)';

    const a = document.createElement('a');
    a.href = `article.html?id=${encodeURIComponent(rel.id)}`;
    a.style.fontWeight = '600';
    a.style.color = 'var(--color-navy)';
    a.style.fontSize = '0.88rem';
    a.textContent = rel.title;

    const badge = document.createElement('div');
    badge.className = `verdict-badge verdict-${rel.verdict}`;
    badge.style.fontSize = '0.65rem';
    badge.style.padding = '2px 6px';
    badge.style.marginTop = '2px';
    badge.textContent = rel.verdictLabel || rel.verdict;

    li.appendChild(a);
    li.appendChild(badge);
    relatedList.appendChild(li);
  });

  relatedCard.appendChild(relatedList);
  asideElem.appendChild(relatedCard);

  layoutDiv.appendChild(asideElem);
  container.appendChild(layoutDiv);
}

/**
 * Handles toggling bookmark state in Supabase.
 */
async function handleBookmarkToggle(article, button) {
  const supabase = window.MythRx?.getSupabaseClient?.();

  if (!supabase) {
    alert('Connecting to Supabase is required to save bookmarks to your user account.');
    return;
  }

  const currentUser = await window.MythRx?.getCurrentUser?.();
  if (!currentUser) {
    if (confirm('You must be signed in to save bookmarks. Would you like to go to the login page?')) {
      window.location.href = 'login.html';
    }
    return;
  }

  if (!article.dbId) {
    alert('This investigation is a static preview item and cannot be bookmarked in the database.');
    return;
  }

  button.disabled = true;

  try {
    if (article.isBookmarked && article.bookmarkId) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', article.bookmarkId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      article.isBookmarked = false;
      article.bookmarkId = null;
      button.innerHTML = '☆ Bookmark Fact-Check';
    } else {
      // Add bookmark (RLS enforces status='published' and user_id=auth.uid())
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: currentUser.id,
          investigation_id: article.dbId
        })
        .select('id')
        .single();

      if (error) throw error;

      article.isBookmarked = true;
      article.bookmarkId = data.id;
      button.innerHTML = '★ Saved to Bookmarks';
    }
  } catch (err) {
    alert(`Could not update bookmark: ${err.message}`);
  } finally {
    button.disabled = false;
  }
}

/**
 * Renders loading state.
 */
function renderArticleLoading(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const loadingDiv = document.createElement('div');
  loadingDiv.style.textAlign = 'center';
  loadingDiv.style.padding = 'var(--space-2xl) 0';
  loadingDiv.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 8px;">⏳</div>
    <h3 style="font-size: 1.2rem; color: var(--color-navy);">Retrieving Clinical Fact-Check...</h3>
    <p class="text-muted">Fetching investigation and peer-reviewed sources from Supabase...</p>
  `;
  container.appendChild(loadingDiv);
}

/**
 * Renders a graceful error when an article ID cannot be found.
 */
function renderArticleNotFound(container, message) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.style.margin = 'var(--space-2xl) auto';
  emptyDiv.style.maxWidth = '600px';

  const icon = document.createElement('div');
  icon.className = 'empty-state-icon';
  icon.textContent = '⚠️';

  const title = document.createElement('h2');
  title.className = 'empty-state-title';
  title.textContent = 'Investigation Not Found';

  const desc = document.createElement('p');
  desc.className = 'empty-state-text';
  desc.textContent = message || 'The requested health investigation could not be located in our archive.';

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = 'var(--space-sm)';
  btnRow.style.justifyContent = 'center';
  btnRow.style.marginTop = 'var(--space-md)';

  const backLink = document.createElement('a');
  backLink.href = 'investigations.html';
  backLink.className = 'btn btn-primary';
  backLink.textContent = 'Browse All Investigations';

  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.className = 'btn btn-secondary';
  homeLink.textContent = 'Return to Homepage';

  btnRow.appendChild(backLink);
  btnRow.appendChild(homeLink);

  emptyDiv.appendChild(icon);
  emptyDiv.appendChild(title);
  emptyDiv.appendChild(desc);
  emptyDiv.appendChild(btnRow);

  container.appendChild(emptyDiv);
}

function createMetaRow(label, value) {
  const div = document.createElement('div');
  div.style.fontSize = '0.88rem';
  div.style.marginBottom = 'var(--space-xs)';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'text-muted';
  labelSpan.textContent = `${label}: `;

  const valStrong = document.createElement('strong');
  valStrong.textContent = value;

  div.appendChild(labelSpan);
  div.appendChild(valStrong);
  return div;
}

function getVerdictSummaryHeading(verdict, title) {
  switch (verdict) {
    case 'false':
      return 'The Scientific Evidence Does Not Support This Claim';
    case 'misleading':
      return 'Evidence Is Substantially Distorted or Overstated';
    case 'unverified':
      return 'Insufficient Clinical Evidence in Humans to Validate Claim';
    case 'supported':
      return 'Clinical Consensus and Empirical Evidence Confirm This Claim';
    default:
      return 'Evidence-Based Evaluation of This Claim';
  }
}

function truncateText(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function escapeText(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, '');
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}
