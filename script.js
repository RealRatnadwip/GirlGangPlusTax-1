/**
 * GirlGangPlusTax // Interactive Engine & Monospace Features
 * Built for Smart India Hackathon (SIH) 2026
 */

(function () {
  'use strict';

  // Global variables to store parsed data
  let squadData = [];
  let roadmapData = [];
  let missionData = {};
  let typewriterPhrases = [
    "Turning 3 AM pe charcha into national-level solutions.",
    "100% caffeine, 0% compromise. SIH 2026 Ready."
  ];

  /* ==========================================================================
     01. Page Routing & Section Navigation
     ========================================================================== */
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Intercept navigation clicks for smooth scroll
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link, .mobile-nav-link, .brand-logo, #exploreBtn, .hero-cta-group .btn');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (window.DATA_PREFIX === '../') {
          window.location.href = '../' + href;
          return;
        }
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          try {
            history.pushState(null, '', href);
          } catch (err) {
            // Fallback for file:// protocol
          }
          
          desktopNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === href));
          mobileNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === href));
        }
      }
    }
  });

  // Handle load scroll if URL has a hash
  window.addEventListener('load', () => {
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  });

  /* ==========================================================================
     02. Markdown File Parsers
     ========================================================================== */
  function parseDataMd(text) {
    const lines = text.split('\n');
    let repoLink = '';
    let projectStatus = '';
    for (const line of lines) {
      if (line.includes('Repository Link')) {
        const match = line.match(/https:\/\/github\.com\/[^\/\s\?\#\)]+\/[^\/\s\?\#\)]+/);
        if (match) repoLink = match[0];
      }
      if (line.includes('Current Project Status')) {
        const parts = line.split(':');
        if (parts.length > 1) {
          projectStatus = parts[1].replace(/[\*\-\`]/g, '').trim();
        }
      }
    }
    return { repoLink, projectStatus };
  }

  function parseMarkdownTable(text) {
    const lines = text.split('\n');
    const rows = [];
    let headers = [];
    let separatorSkipped = false;

    for (let line of lines) {
      line = line.trim();
      if (!line.startsWith('|') || !line.endsWith('|')) continue;
      
      const cols = line.split('|').map(s => s.trim());
      if (cols.length > 1) {
        cols.shift();
        cols.pop();
      }
      
      if (headers.length === 0) {
        headers = cols;
      } else if (!separatorSkipped) {
        if (cols[0].includes('---') || cols[0].includes('-')) {
          separatorSkipped = true;
        }
      } else {
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = cols[idx] || '';
        });
        rows.push(row);
      }
    }
    return rows;
  }

  function parseKeyValueTable(rows) {
    const map = {};
    rows.forEach(row => {
      if (row.Key && row.Value) {
        map[row.Key.trim()] = row.Value.trim();
      }
    });
    return map;
  }

  function highlightJSCode(code) {
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Strings
    html = html.replace(/(["'])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');

    // Keywords
    html = html.replace(/\b(const|return)\b/g, '<span class="token-keyword">$1</span>');

    // Numbers
    html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token-number">$1</span>');

    // Functions
    html = html.replace(/\b(execute)\b/g, '<span class="token-func">$1</span>');

    // Variables & Properties
    html = html.replace(/\b(GirlGangPlusTax)\b/g, '<span class="token-var">$1</span>');
    html = html.replace(/\b(baseSquad|hackathonTax|caffeine|debuggingEnergy|brainpowerSurge|sarcasmIndex|readiness)\b/g, '<span class="token-prop">$1</span>');

    return html;
  }

  /* ==========================================================================
     03. Dynamic Data Fetch & Render
     ========================================================================== */
  
  // Fetch repository commits and issues count from GitHub API
  async function fetchGitHubStats(repoUrl) {
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\s\?\#]+)/);
      if (!match) throw new Error('Invalid GitHub URL');
      const owner = match[1];
      const repo = match[2];

      const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const commitsApiUrl = `${repoApiUrl}/commits?per_page=1`;

      // Fetch issues count
      const repoResponse = await fetch(repoApiUrl);
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        const bugsCount = repoData.open_issues_count !== undefined ? repoData.open_issues_count : 0;
        const bugsElem = document.getElementById('statBugs');
        if (bugsElem) {
          bugsElem.innerHTML = `${bugsCount}<span class="stat-unit"> bugs</span>`;
        }
      }

      // Fetch commits count via Link header relation count
      const commitsResponse = await fetch(commitsApiUrl);
      if (commitsResponse.ok) {
        let commitCount = 348;
        const linkHeader = commitsResponse.headers.get('Link');
        if (linkHeader) {
          const lastMatch = linkHeader.match(/page=(\d+)>;\s*rel="last"/);
          if (lastMatch) {
            commitCount = parseInt(lastMatch[1], 10);
          }
        } else {
          const commitsData = await commitsResponse.json();
          if (Array.isArray(commitsData)) {
            commitCount = commitsData.length;
          }
        }
        const commitsElem = document.getElementById('statCommits');
        if (commitsElem) {
          commitsElem.innerHTML = `${commitCount}<span class="stat-unit">+</span>`;
        }
      }
    } catch (e) {
      console.warn('Fallback metadata counts used due to network rate limiting:', e.message);
      const bugsElem = document.getElementById('statBugs');
      const commitsElem = document.getElementById('statCommits');
      if (bugsElem) bugsElem.innerHTML = `4<span class="stat-unit"> bugs</span>`;
      if (commitsElem) commitsElem.innerHTML = `348<span class="stat-unit">+</span>`;
    }
  }

  // Load data.md
  async function initDataMd() {
    try {
      const response = await fetch((window.DATA_PREFIX || '') + 'data/data.md');
      if (!response.ok) throw new Error('Failed to fetch data.md');
      const text = await response.text();
      const rows = parseMarkdownTable(text);
      const dataMap = parseKeyValueTable(rows);
      
      const { repoLink, projectStatus } = parseDataMd(text);
      
      const statusElems = document.querySelectorAll('.site-footer .meta-col .meta-item strong.text-lime');
      statusElems.forEach(el => {
        el.textContent = projectStatus || 'In Progress';
      });

      // Ticker Track
      const tickerTrack = document.getElementById('marqueeTrack');
      if (tickerTrack && dataMap['Ticker Items']) {
        const items = dataMap['Ticker Items'].split(',').map(s => s.trim());
        let tickerHtml = '';
        for (let i = 0; i < 2; i++) {
          items.forEach(item => {
            tickerHtml += `<span class="marquee-item">`;
            if (item.includes('STATUS') || item.includes('SIH')) {
              tickerHtml += `<span class="pulse-dot"></span> `;
            }
            tickerHtml += `${item}</span>\n<span class="marquee-sep">//</span>\n`;
          });
        }
        tickerTrack.innerHTML = tickerHtml;
      }

      // Typewriter phrases
      if (dataMap['Typewriter Phrases']) {
        typewriterPhrases = dataMap['Typewriter Phrases'].split(',').map(s => s.trim());
      }

      // Hero Description
      const heroDesc = document.getElementById('heroDesc');
      if (heroDesc && dataMap['Hero Description']) {
        heroDesc.textContent = dataMap['Hero Description'];
      }

      // Calculator Headers
      const calcBadge = document.getElementById('calcBadge');
      if (calcBadge && dataMap['Calculator Badge']) calcBadge.textContent = dataMap['Calculator Badge'];
      const calcTitle = document.getElementById('calcTitle');
      if (calcTitle && dataMap['Calculator Title']) calcTitle.textContent = dataMap['Calculator Title'];
      const calcSubtitle = document.getElementById('calcSubtitle');
      if (calcSubtitle && dataMap['Calculator Subtitle']) calcSubtitle.textContent = dataMap['Calculator Subtitle'];

      // Footer
      const footerSlogan = document.getElementById('footerSlogan');
      if (footerSlogan && dataMap['Footer Slogan']) footerSlogan.textContent = dataMap['Footer Slogan'];
      const footerEvent = document.getElementById('footerEvent');
      if (footerEvent && dataMap['Footer Event']) footerEvent.textContent = dataMap['Footer Event'];
      const footerTeamName = document.getElementById('footerTeamName');
      if (footerTeamName && dataMap['Footer Team Name']) footerTeamName.textContent = dataMap['Footer Team Name'];
      const footerTaxDeductible = document.getElementById('footerTaxDeductible');
      if (footerTaxDeductible && dataMap['Footer Tax Deductible']) footerTaxDeductible.textContent = dataMap['Footer Tax Deductible'];

      if (repoLink) {
        fetchGitHubStats(repoLink);
      }
    } catch (e) {
      console.warn('Failed to load local data.md, using static project fallback.', e.message);
      fetchGitHubStats('https://github.com/RealRatnadwip/GirlGangPlusTax-1');
    }
  }

  // Load lore.md
  async function initLoreMd() {
    try {
      const response = await fetch((window.DATA_PREFIX || '') + 'data/lore.md');
      if (!response.ok) throw new Error('Failed to fetch lore.md');
      const text = await response.text();
      const rows = parseMarkdownTable(text);
      const loreMap = parseKeyValueTable(rows);

      const loreBadge = document.getElementById('loreBadge');
      if (loreBadge && loreMap['Badge']) loreBadge.textContent = loreMap['Badge'];
      const loreTitle = document.getElementById('loreTitle');
      if (loreTitle && loreMap['Title']) loreTitle.textContent = loreMap['Title'];
      const loreSubtitle = document.getElementById('loreSubtitle');
      if (loreSubtitle && loreMap['Subtitle']) loreSubtitle.textContent = loreMap['Subtitle'];
      
      const loreLead = document.getElementById('loreLead');
      if (loreLead && loreMap['Lead']) {
        loreLead.innerHTML = loreMap['Lead'].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }
      
      const loreMain = document.getElementById('loreMain');
      if (loreMain && loreMap['Main Body']) loreMain.textContent = loreMap['Main Body'];
      const loreQuote = document.getElementById('loreQuote');
      if (loreQuote && loreMap['Quote']) loreQuote.textContent = loreMap['Quote'];
      const loreNote = document.getElementById('loreNote');
      if (loreNote && loreMap['Note']) loreNote.textContent = loreMap['Note'];

      // Code Snippet
      const codeBlock = document.querySelector('.formula-card code');
      if (codeBlock && loreMap['Code Snippet']) {
        const rawCode = loreMap['Code Snippet'].replace(/\\n/g, '\n');
        codeBlock.innerHTML = highlightJSCode(rawCode);
      }

      // Badges
      const loreBadges = document.getElementById('loreBadges');
      if (loreBadges && loreMap['Badges']) {
        const chips = loreMap['Badges'].split(',').map(s => s.trim());
        let badgesHtml = '';
        const chipColors = ['chip-lime', 'chip-peach', 'chip-cyan', 'chip-gold'];
        chips.forEach((chip, idx) => {
          const colorClass = chipColors[idx % chipColors.length];
          badgesHtml += `<span class="chip ${colorClass}">${chip}</span>\n`;
        });
        loreBadges.innerHTML = badgesHtml;
      }
    } catch (e) {
      console.warn('Failed to load lore.md', e.message);
    }
  }

  // Load mission.md
  async function initMissionMd() {
    try {
      const response = await fetch((window.DATA_PREFIX || '') + 'data/mission.md');
      if (!response.ok) throw new Error('Failed to fetch mission.md');
      const text = await response.text();
      const rows = parseMarkdownTable(text);
      const missionMap = parseKeyValueTable(rows);
      missionData = missionMap;

      const missionBadge = document.getElementById('missionBadge');
      if (missionBadge && missionMap['Badge']) missionBadge.textContent = missionMap['Badge'];
      const missionTitle = document.getElementById('missionTitle');
      if (missionTitle && missionMap['Title']) missionTitle.textContent = missionMap['Title'];
      const missionSubtitle = document.getElementById('missionSubtitle');
      if (missionSubtitle && missionMap['Subtitle']) missionSubtitle.textContent = missionMap['Subtitle'];

      const missionLayout = document.querySelector('.mission-layout');
      if (missionLayout && missionMap['Problem Title'] === 'Yet to be revealed') {
        missionLayout.classList.add('mission-locked-layout');
        missionLayout.innerHTML = `
          <div class="mission-locked-card">
            <div class="card-terminal-bar">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="bar-title">classified_mission.sh</span>
            </div>
            <div class="locked-card-body">
              <div class="locked-icon">[ LOCKED ]</div>
              <h3 class="locked-title">MISSION DECRYPTING...</h3>
              <p class="locked-text">
                ${missionMap['Problem Description'] || 'We are currently analyzing and refining potential Smart India Hackathon problem statements. The official solution blueprint, system architecture, and tech stack will be disclosed here once locked.'}
              </p>
              <div class="decryption-progress">
                <div class="progress-track">
                  <div class="progress-bar" style="width: 33.3%;"></div>
                </div>
                <span class="progress-pct">33.3% Decrypted (Awaiting Final Statement)</span>
              </div>
            </div>
          </div>
        `;
        return;
      }

      const problemCardTag = document.getElementById('problemCardTag');
      if (problemCardTag && missionMap['Problem Card Tag']) problemCardTag.textContent = missionMap['Problem Card Tag'];
      const problemTitle = document.getElementById('problemTitle');
      if (problemTitle && missionMap['Problem Title']) problemTitle.textContent = missionMap['Problem Title'];
      const problemDescription = document.getElementById('problemDescription');
      if (problemDescription && missionMap['Problem Description']) problemDescription.textContent = missionMap['Problem Description'];

      // Highlights
      const problemHighlights = document.getElementById('problemHighlights');
      if (problemHighlights) {
        let highlightsHtml = '';
        for (let i = 1; i <= 3; i++) {
          const hl = missionMap[`Highlight ${i}`];
          if (hl) {
            const parts = hl.split(':');
            const title = parts[0] ? parts[0].trim() : '';
            const desc = parts[1] ? parts[1].trim() : '';
            highlightsHtml += `
              <div class="highlight-item">
                <span class="icon">*</span>
                <div>
                  <strong>${title}:</strong> ${desc}
                </div>
              </div>`;
          }
        }
        problemHighlights.innerHTML = highlightsHtml;
      }

      const stackCardTag = document.getElementById('stackCardTag');
      if (stackCardTag && missionMap['Stack Card Tag']) stackCardTag.textContent = missionMap['Stack Card Tag'];

      // Tech Stack Groups
      const stackCategories = document.getElementById('stackCategories');
      if (stackCategories) {
        let categoriesHtml = '';
        for (let i = 1; i <= 4; i++) {
          const groupTitle = missionMap[`Tech Group ${i} Title`];
          const groupTags = missionMap[`Tech Group ${i} Tags`];
          if (groupTitle && groupTags) {
            const tagsList = groupTags.split(',').map(s => s.trim());
            let tagsHtml = '';
            tagsList.forEach(tag => {
              tagsHtml += `<span class="tech-tag">${tag}</span>\n`;
            });
            categoriesHtml += `
              <div class="stack-group">
                <div class="group-header">
                  <span class="mono-symbol">#0${i}</span> ${groupTitle}
                </div>
                <div class="group-tags">
                  ${tagsHtml}
                </div>
              </div>`;
          }
        }
        stackCategories.innerHTML = categoriesHtml;
      }

      const archNote = document.getElementById('archNote');
      if (archNote && missionMap['Architecture Note']) {
        archNote.innerHTML = `<span>${missionMap['Architecture Note']}</span>`;
      }
    } catch (e) {
      console.warn('Failed to load mission.md', e.message);
    }
  }



  // Load squad.md
  async function initSquadMd() {
    try {
      const response = await fetch((window.DATA_PREFIX || '') + 'data/squad.md');
      if (!response.ok) throw new Error('Failed to fetch squad.md');
      const text = await response.text();
      
      squadData = parseMarkdownTable(text);
      renderSquadCards(squadData);
    } catch (e) {
      console.warn('Failed to load squad.md, squad grid remains unpopulated.', e.message);
    }
  }

  function renderSquadCards(rows) {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    grid.innerHTML = '';

    rows.forEach(row => {
      const name = row.Name || 'Yet to be announced';
      const username = row.Username || 'Coming Soon';
      const link = row['Profile Link'] || '#';
      const image = row.Image || '#';
      const role = row.Role || '';
      const category = row.Category || 'core';
      const badge = row['Mini Badge'] || '';
      const bio = row.Bio || '';
      const superpower = row.Superpower || 'TBD';
      const caffeine = row['Caffeine Intake'] || 'TBD';
      const favError = row['Favorite Error'] || 'TBD';
      const tagsStr = row.Tags || '';
      const status = (row.Status || 'Confirmed').toLowerCase();

      const card = document.createElement('div');
      card.className = 'member-card';
      card.setAttribute('data-category', category);

      if (status === 'unconfirmed') {
        card.classList.add('member-card-unconfirmed');
        
        let roleHtml = '';
        if (role && role.trim() !== '') {
          roleHtml = `<span class="member-role">${role}</span>`;
        }

        let badgeHtml = '';
        if (badge && badge.trim() !== '') {
          badgeHtml = `<span class="badge-mini">${badge}</span>`;
        }

        let bioHtml = '';
        if (bio && bio.trim() !== '') {
          bioHtml = `<p class="member-bio">${bio}</p>`;
        }
        
        let tagsHtml = '';
        if (tagsStr && tagsStr.trim() !== '') {
          tagsHtml = `<div class="member-tags">` + 
            tagsStr.split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0)
              .map(t => `<span>${t}</span>`)
              .join('\n') + 
            `</div>`;
        }

        card.innerHTML = `
          <div class="member-header">
            <div class="member-avatar avatar-tba">
              <span class="avatar-text">&lt;TBA/&gt;</span>
            </div>
            <div class="member-badge-group">
              ${roleHtml}
              ${badgeHtml}
            </div>
          </div>
          <div class="member-body">
            <h3 class="member-name">Yet to be announced</h3>
            <p class="member-handle">${username}</p>
            ${bioHtml}
            <div class="member-quirks">
              <div class="quirk-item">
                <span class="q-label">Superpower:</span> <span class="q-val">TBD</span>
              </div>
              <div class="quirk-item">
                <span class="q-label">Caffeine Intake:</span> <span class="q-val">TBD</span>
              </div>
              <div class="quirk-item">
                <span class="q-label">Favorite Error:</span> <span class="q-val"><code>TBD</code></span>
              </div>
            </div>
            ${tagsHtml}
          </div>
        `;
      } else {
        let avatarClass = 'avatar-fs';
        let avatarText = '<FS/>';
        const roleLower = role.toLowerCase();
        const catLower = category.toLowerCase();
        
        if (catLower === 'core') {
          avatarClass = 'avatar-lead';
          avatarText = '<TL/>';
        } else if (catLower === 'ai') {
          avatarClass = 'avatar-ai';
          avatarText = '<AI/>';
        } else if (catLower === 'design') {
          avatarClass = 'avatar-ux';
          avatarText = '<UX/>';
        } else if (roleLower.includes('devops') || roleLower.includes('security') || roleLower.includes('infra')) {
          avatarClass = 'avatar-infra';
          avatarText = '<OPS/>';
        } else if (roleLower.includes('data') || roleLower.includes('research')) {
          avatarClass = 'avatar-research';
          avatarText = '<DATA/>';
        }

        const tagsHtml = tagsStr.split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(t => `<span>${t}</span>`)
          .join('\n');

        let avatarInnerHtml = `<span class="avatar-text">${avatarText}</span>`;
        if (image !== '#' && image.trim() !== '') {
          const absoluteImgPath = (window.DATA_PREFIX || '') + image;
          avatarInnerHtml = `<img src="${absoluteImgPath}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=&quot;avatar-text&quot;>${avatarText}</span>';">`;
        }

        card.innerHTML = `
          <div class="member-header">
            <div class="member-avatar ${avatarClass}">
              ${avatarInnerHtml}
            </div>
            <div class="member-badge-group">
              <span class="member-role">${role}</span>
              <span class="badge-mini">${badge}</span>
            </div>
          </div>
          <div class="member-body">
            <h3 class="member-name">${name}</h3>
            <p class="member-handle">
              <a href="${link}" target="_blank" class="member-handle-link" style="color: var(--accent-pink); text-decoration: none;">${username}</a>
            </p>
            <p class="member-bio">${bio}</p>
            <div class="member-quirks">
              <div class="quirk-item">
                <span class="q-label">Superpower:</span> <span class="q-val">${superpower}</span>
              </div>
              <div class="quirk-item">
                <span class="q-label">Caffeine Intake:</span> <span class="q-val">${caffeine}</span>
              </div>
              <div class="quirk-item">
                <span class="q-label">Favorite Error:</span> <span class="q-val"><code>${favError}</code></span>
              </div>
            </div>
            <div class="member-tags">
              ${tagsHtml}
            </div>
          </div>
        `;
      }
      grid.appendChild(card);
    });

    setupFilterListeners();
  }

  function setupFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        newBtn.classList.add('active');

        const filterValue = newBtn.getAttribute('data-filter');
        const activeCards = document.querySelectorAll('.member-card');

        activeCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // Load roadmap.md
  async function initRoadmapMd() {
    try {
      const response = await fetch((window.DATA_PREFIX || '') + 'data/roadmap.md');
      if (!response.ok) throw new Error('Failed to fetch roadmap.md');
      const text = await response.text();
      
      roadmapData = parseMarkdownTable(text);
      renderRoadmap(roadmapData);
    } catch (e) {
      console.warn('Failed to load roadmap.md, roadmap timeline remains empty.', e.message);
    }
  }

  function renderRoadmap(rows) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    container.innerHTML = '';

    rows.forEach(row => {
      const step = row.Step || '01';
      const title = row.Title || '';
      const desc = row.Description || '';
      const status = (row.Status || 'Upcoming').toLowerCase();
      const phase = row.Phase || '';

      const item = document.createElement('div');
      item.className = 'timeline-item';
      
      let statusClass = 'upcoming';
      let pillText = 'UPCOMING';
      
      if (status === 'completed') {
        item.classList.add('done');
        statusClass = 'done';
        pillText = 'COMPLETED';
      } else if (status === 'in progress') {
        item.classList.add('active');
        statusClass = 'active';
        pillText = 'IN PROGRESS (ACTIVE)';
      } else {
        item.classList.add('upcoming');
      }

      item.innerHTML = `
        <div class="timeline-marker">${step}</div>
        <div class="timeline-content">
          <div class="timeline-status-pill ${statusClass === 'active' ? 'pulse-pill' : ''}">${pillText}</div>
          <h3 class="timeline-title">${title}</h3>
          <p class="timeline-desc">${desc}</p>
          <span class="timeline-date">${phase}</span>
        </div>
      `;
      container.appendChild(item);
    });
  }

  /* ==========================================================================
     04. Typewriter Effect (Hero Subtitle)
     ========================================================================== */
  const dynamicTypewriter = document.getElementById('dynamicTypewriter');
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 50;

  function typeWriterLoop() {
    if (!dynamicTypewriter || typewriterPhrases.length === 0) return;

    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      dynamicTypewriter.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 25;
    } else {
      dynamicTypewriter.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 55;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typeSpeed = 500;
    }

    setTimeout(typeWriterLoop, typeSpeed);
  }

  /* ==========================================================================
     05. Mobile Drawer Navigation & Scroll Highlighting
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const sections = document.querySelectorAll('section[id]');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetHref = `#${sectionId}`;

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === targetHref);
        });
        mobileNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === targetHref);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  /* ==========================================================================
     06. Initial Boot
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // Initial dynamic loaders in parallel for performance
    Promise.all([
      initDataMd(),
      initLoreMd(),
      initMissionMd(),
      initSquadMd(),
      initRoadmapMd()
    ]).then(() => {
      typeWriterLoop();
      
      // Easter egg console greetings for developers
      console.log(
        "%c[GIRLGANG+TAX] Welcome SIH Evaluators! Built with coffee, grit, and zero libraries.", 
        "color: #22d3ee; font-weight: bold; font-size: 14px; font-family: monospace;"
      );
      console.log(
        "%cTry running help() in this console!", 
        "color: #a3e635; font-family: monospace;"
      );
      
      window.help = () => {
        console.log(
          "%c🔥 Secret unlocked! Guy Tax overhead calculated: 33.3% of team energy spent explaining recursive layouts to the guys. SIH victory is assured.", 
          "color: #ff5e7e; font-weight: bold;"
        );
        return "CHAMPIONS_SIH_2026";
      };
    });
  });

})();
