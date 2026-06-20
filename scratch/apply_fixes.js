const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
html = html.replace(/\r\n/g, '\n');

// 1. Update sidebar links href from "#" to "javascript:void(0)"
const oldSidebarNav = `        <a href="#" class="nav-item active" id="side-nav-fixtures" onclick="switchCenterTab('fixtures')">
          <i class="fa-solid fa-calendar-days"></i> Fixtures
        </a>
        <a href="#" class="nav-item" id="side-nav-results" onclick="switchCenterTab('results')">
          <i class="fa-solid fa-square-poll-vertical"></i> Results
        </a>
        <a href="#" class="nav-item" id="side-nav-standings" onclick="switchCenterTab('standings')">
          <i class="fa-solid fa-trophy"></i> Standings
        </a>
        <a href="#" class="nav-item" id="side-nav-scorers" onclick="switchCenterTab('scorers')">
          <i class="fa-solid fa-user-ninja"></i> Top Scorers
        </a>`;

const newSidebarNav = `        <a href="javascript:void(0)" class="nav-item active" id="side-nav-fixtures" onclick="switchCenterTab('fixtures')">
          <i class="fa-solid fa-calendar-days"></i> Fixtures
        </a>
        <a href="javascript:void(0)" class="nav-item" id="side-nav-results" onclick="switchCenterTab('results')">
          <i class="fa-solid fa-square-poll-vertical"></i> Results
        </a>
        <a href="javascript:void(0)" class="nav-item" id="side-nav-standings" onclick="switchCenterTab('standings')">
          <i class="fa-solid fa-trophy"></i> Standings
        </a>
        <a href="javascript:void(0)" class="nav-item" id="side-nav-scorers" onclick="switchCenterTab('scorers')">
          <i class="fa-solid fa-user-ninja"></i> Top Scorers
        </a>`;

if (html.includes(oldSidebarNav)) {
    html = html.replace(oldSidebarNav, newSidebarNav);
} else {
    console.warn('Warning: Could not match exact old sidebar navigation structure.');
}

// 2. Hide top-bar logo on desktop by default
const oldTopBarLeft = `    .top-bar-left {
      flex: 1;
      overflow: hidden;
    }`;

const newTopBarLeft = `    .top-bar-left {
      flex: 1;
      overflow: hidden;
    }
    .top-bar-left .logo-container {
      display: none !important;
    }`;

if (html.includes(oldTopBarLeft)) {
    html = html.replace(oldTopBarLeft, newTopBarLeft);
} else {
    console.warn('Warning: Could not match default .top-bar-left style.');
}

// 3. Show top-bar logo on mobile
const oldMobileTopBarLeft = `      .top-bar-left {
        width: 100%;
      }`;

const newMobileTopBarLeft = `      .top-bar-left {
        width: 100%;
      }
      .top-bar-left .logo-container {
        display: flex !important;
      }`;

if (html.includes(oldMobileTopBarLeft)) {
    html = html.replace(oldMobileTopBarLeft, newMobileTopBarLeft);
} else {
    console.warn('Warning: Could not match mobile top-bar-left style.');
}

// 4. Stacking right sidebar at the bottom for tablet viewport
const oldTabletSidebar = `    @media (max-width: 1200px) {
      .app-layout {
        grid-template-columns: 240px 1fr;
      }
      .right-sidebar {
        display: none !important;
      }
    }`;

const newTabletSidebar = `    @media (max-width: 1200px) {
      .app-layout {
        grid-template-columns: 240px 1fr;
        height: auto;
        overflow: visible;
      }
      .right-sidebar {
        grid-column: 1 / -1;
        width: 100% !important;
        height: auto !important;
        overflow-y: visible !important;
        border-left: none !important;
        border-top: 1px solid var(--card-border) !important;
        padding: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
      }
    }`;

if (html.includes(oldTabletSidebar)) {
    html = html.replace(oldTabletSidebar, newTabletSidebar);
} else {
    console.warn('Warning: Could not match tablet @media right-sidebar style.');
}

// 5. Stacking right sidebar and ordering panels for mobile viewport
const oldMobileSidebar = `    @media (max-width: 768px) {
      body { padding-bottom: 64px; }
      .app-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        height: auto;
        overflow: visible;
      }
      .sidebar {
        display: none !important;
      }
      .right-sidebar {
        display: none !important;
      }`;

const newMobileSidebar = `    @media (max-width: 768px) {
      body { padding-bottom: 64px; }
      .app-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        height: auto;
        overflow: visible;
      }
      .sidebar {
        display: none !important;
      }
      .right-sidebar {
        width: 100% !important;
        height: auto !important;
        overflow-y: visible !important;
        border-left: none !important;
        border-top: 1px solid var(--card-border) !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
      }
      .player-container {
        order: 1;
      }
      .channels-carousel-container {
        order: 2;
      }
      .chat-wrapper {
        order: 3;
      }`;

if (html.includes(oldMobileSidebar)) {
    html = html.replace(oldMobileSidebar, newMobileSidebar);
} else {
    console.warn('Warning: Could not match mobile @media right-sidebar style.');
}

// 6. Disable mobile tabs bar and body visibility classes to stack views
const oldMobileBodyVisibilityClasses = `      /* Control visibility of widgets using body classes on mobile */
      body.tab-feeds-active .channels-carousel-container { display: flex !important; }
      body.tab-feeds-active .chat-wrapper,
      body.tab-feeds-active .scoreboard-container,
      body.tab-feeds-active #upcoming-matches-section,
      body.tab-feeds-active #standings-section { display: none !important; }

      body.tab-chat-active .chat-wrapper { display: flex !important; }
      body.tab-chat-active .channels-carousel-container,
      body.tab-chat-active .scoreboard-container,
      body.tab-chat-active #upcoming-matches-section,
      body.tab-chat-active #standings-section { display: none !important; }

      body.tab-matches-active .scoreboard-container,
      body.tab-matches-active #upcoming-matches-section { display: block !important; }
      body.tab-matches-active .channels-carousel-container,
      body.tab-matches-active .chat-wrapper,
      body.tab-matches-active #standings-section { display: none !important; }

      body.tab-standings-active #standings-section { display: block !important; }
      body.tab-standings-active .channels-carousel-container,
      body.tab-standings-active .chat-wrapper,
      body.tab-standings-active .scoreboard-container,
      body.tab-standings-active #upcoming-matches-section { display: none !important; }`;

const newMobileBodyVisibilityClasses = `      /* Hide mobile tabs bar to stack sections in single view */
      .mobile-tabs-bar {
        display: none !important;
      }`;

if (html.includes(oldMobileBodyVisibilityClasses)) {
    html = html.replace(oldMobileBodyVisibilityClasses, newMobileBodyVisibilityClasses);
} else {
    console.warn('Warning: Could not match mobile body visibility classes.');
}

// 7. Update bottom navigation HTML to match the mockup (Home, Live TV, Stats, Calendar, More)
const oldBottomNav = `  <!-- Mobile Bottom Tab Bar -->
  <nav class="bottom-nav" id="bottom-nav">
    <button class="nav-tab active" id="tab-home" onclick="mobileNavTo('hero-section', 0)">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </button>
    <button class="nav-tab" id="tab-watch" onclick="mobileNavTo('video-section', 1)">
      <i class="fa-solid fa-circle-play"></i>
      <span>Watch</span>
    </button>
    <button class="nav-tab" id="tab-scores" onclick="mobileNavTo('scoreboard-section', 2)">
      <i class="fa-solid fa-square-poll-vertical"></i>
      <span>Scores</span>
    </button>
    <button class="nav-tab" id="tab-chat" onclick="mobileOpenChat()">
      <i class="fa-solid fa-comments"></i>
      <span>Chat</span>
    </button>
  </nav>`;

const newBottomNav = `  <!-- Mobile Bottom Tab Bar -->
  <nav class="bottom-nav" id="bottom-nav">
    <button class="nav-tab active" id="tab-home" onclick="mobileNavTo('hero-section', 0)">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </button>
    <button class="nav-tab" id="tab-live-tv" onclick="mobileNavTo('video-section', 1)">
      <i class="fa-solid fa-tv"></i>
      <span>Live TV</span>
    </button>
    <button class="nav-tab" id="tab-stats" onclick="mobileNavTo('match-stats-card', 2)">
      <i class="fa-solid fa-chart-simple"></i>
      <span>Stats</span>
    </button>
    <button class="nav-tab" id="tab-calendar" onclick="mobileNavTo('center-tabs-container', 3)">
      <i class="fa-solid fa-calendar-days"></i>
      <span>Calendar</span>
    </button>
    <button class="nav-tab" id="tab-more" onclick="scrollToSection('faq-section'); setActiveNavTab(4);">
      <i class="fa-solid fa-ellipsis"></i>
      <span>More</span>
    </button>
  </nav>`;

if (html.includes(oldBottomNav)) {
    html = html.replace(oldBottomNav, newBottomNav);
} else {
    console.warn('Warning: Could not match exact bottom navigation HTML.');
}

// 8. Update mockTopScorers with real tournament players
const oldScorers = `        // --- Tournament Top Scorers List Render ---
        const mockTopScorers = [
            { name: "Kylian Mbappé", team: "France", goals: 5, assists: 2, rank: 1 },
            { name: "Lionel Messi", team: "Argentina", goals: 4, assists: 3, rank: 2 },
            { name: "Harry Kane", team: "England", goals: 4, assists: 1, rank: 3 },
            { name: "Erling Haaland", team: "Norway", goals: 3, assists: 2, rank: 4 },
            { name: "Marcus Rashford", team: "England", goals: 3, assists: 1, rank: 5 }
        ];`;

const newScorers = `        // --- Tournament Top Scorers List Render ---
        const mockTopScorers = [
            { name: "Kylian Mbappé", team: "France", goals: 5, assists: 2, rank: 1 },
            { name: "Lionel Messi", team: "Argentina", goals: 4, assists: 3, rank: 2 },
            { name: "Álvaro Morata", team: "Spain", goals: 3, assists: 1, rank: 3 },
            { name: "Bukayo Saka", team: "England", goals: 3, assists: 2, rank: 4 },
            { name: "Cody Gakpo", team: "Netherlands", goals: 3, assists: 1, rank: 5 }
        ];`;

if (html.includes(oldScorers)) {
    html = html.replace(oldScorers, newScorers);
} else {
    console.warn('Warning: Could not match mockTopScorers definition.');
}

// 9. Update selectMatchForStats signature to support score elements safely
const oldSelectSig = `        window.selectMatchForStats = function(home, away, matchId, status, score) {
            window.selectedStatsMatch = { home, away, matchId, status, score };`;

const newSelectSig = `        window.selectMatchForStats = function(home, away, matchId, status, scoreHome = null, scoreAway = null) {
            const score = (scoreHome !== null && scoreHome !== undefined) ? { homeScore: scoreHome, awayScore: scoreAway } : null;
            window.selectedStatsMatch = { home, away, matchId, status, score };`;

if (html.includes(oldSelectSig)) {
    html = html.replace(oldSelectSig, newSelectSig);
} else {
    console.warn('Warning: Could not match selectMatchForStats signature.');
}

// 10. Update stats comparison bars update logic to map key IDs correctly
const oldUpdateStatRow = `            const updateStatRow = (key, suffix = '') => {
                const valHome = stats[key].home;
                const valAway = stats[key].away;
                const total = valHome + valAway || 1;
                const pctHome = (valHome / total) * 100;
                
                const labelHome = document.getElementById(\`stat-val-home-\${key.toLowerCase()}\`);
                const labelAway = document.getElementById(\`stat-val-away-\${key.toLowerCase()}\`);
                const barHome = document.getElementById(\`stat-bar-home-\${key.toLowerCase()}\`);
                const barAway = document.getElementById(\`stat-bar-away-\${key.toLowerCase()}\`);
                
                if (labelHome) labelHome.textContent = \`\${valHome}\${suffix}\`;
                if (labelAway) labelAway.textContent = \`\${valAway}\${suffix}\`;
                if (barHome) barHome.style.width = \`\${pctHome}%\`;
                if (barAway) barAway.style.width = \`\${100 - pctHome}%\`;
            };
            
            updateStatRow('possession', '%');
            updateStatRow('shots');
            updateStatRow('shotsOnTarget');
            updateStatRow('corners');
            updateStatRow('fouls');
            updateStatRow('yellowCards');`;

const newUpdateStatRow = `            const updateStatRow = (key, idKey, suffix = '') => {
                const valHome = stats[key].home;
                const valAway = stats[key].away;
                const total = valHome + valAway || 1;
                const pctHome = (valHome / total) * 100;
                
                const labelHome = document.getElementById(\`stat-val-home-\${idKey}\`);
                const labelAway = document.getElementById(\`stat-val-away-\${idKey}\`);
                const barHome = document.getElementById(\`stat-bar-home-\${idKey}\`);
                const barAway = document.getElementById(\`stat-bar-away-\${idKey}\`);
                
                if (labelHome) labelHome.textContent = \`\${valHome}\${suffix}\`;
                if (labelAway) labelAway.textContent = \`\${valAway}\${suffix}\`;
                if (barHome) barHome.style.width = \`\${pctHome}%\`;
                if (barAway) barAway.style.width = \`\${100 - pctHome}%\`;
            };
            
            updateStatRow('possession', 'possession', '%');
            updateStatRow('shots', 'shots');
            updateStatRow('shotsOnTarget', 'ontarget');
            updateStatRow('corners', 'corners');
            updateStatRow('fouls', 'fouls');
            updateStatRow('yellowCards', 'yellow');`;

if (html.includes(oldUpdateStatRow)) {
    html = html.replace(oldUpdateStatRow, newUpdateStatRow);
} else {
    console.warn('Warning: Could not match updateStatRow logic.');
}

// 11. Update filterUpcomingMatches' default selection call
const oldFilterSelect = `            if (!window.selectedStatsMatch && fixturesList.length > 0) {
                const first = fixturesList[0];
                const matchId = \`\${first.home.toLowerCase().trim()}_vs_\${first.away.toLowerCase().trim()}\`.replace(/\\s+/g, '_');
                selectMatchForStats(first.home, first.away, matchId, first.status, first.score);
            }`;

const newFilterSelect = `            if (!window.selectedStatsMatch && fixturesList.length > 0) {
                const first = fixturesList[0];
                const matchId = \`\${first.home.toLowerCase().trim()}_vs_\${first.away.toLowerCase().trim()}\`.replace(/\\s+/g, '_');
                selectMatchForStats(first.home, first.away, matchId, first.status, first.score ? first.score.homeScore : null, first.score ? first.score.awayScore : null);
            }`;

if (html.includes(oldFilterSelect)) {
    html = html.replace(oldFilterSelect, newFilterSelect);
} else {
    console.warn('Warning: Could not match auto-select match block in filterUpcomingMatches.');
}

// 12. Update renderUpcomingTable row click attributes format to pass separate numbers
const oldClickCall = `                const clickCall = \`selectMatchForStats('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${matchId}', '\${m.status}', \` + 
                                  (m.score ? JSON.stringify(m.score) : 'null') + \`)\`;`;

const newClickCall = `                const clickCall = \`selectMatchForStats('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${matchId}', '\${m.status}', \${m.score ? m.score.homeScore : 'null'}, \${m.score ? m.score.awayScore : 'null'})\`;`;

if (html.includes(oldClickCall)) {
    html = html.replace(oldClickCall, newClickCall);
} else {
    console.warn('Warning: Could not match clickCall definition in renderUpcomingTable.');
}

// 13. Update NAV_TABS and setActiveNavTab inside mobile bottom nav controller
const oldNavTabsInit = `    const NAV_TABS = ['tab-home', 'tab-watch', 'tab-scores', 'tab-chat'];

    function setActiveNavTab(index) {
      NAV_TABS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', i === index);
      });
    }`;

const newNavTabsInit = `    const NAV_TABS = ['tab-home', 'tab-live-tv', 'tab-stats', 'tab-calendar', 'tab-more'];

    function setActiveNavTab(index) {
      NAV_TABS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', i === index);
      });
    }`;

if (html.includes(oldNavTabsInit)) {
    html = html.replace(oldNavTabsInit, newNavTabsInit);
} else {
    console.warn('Warning: Could not match NAV_TABS array and function.');
}

// 14. Update switchMobileTab synchronize bottom nav logic
const oldSwitchSync = `      // Synchronize bottom global nav highlighting
      if (tabName === 'feeds') {
        setActiveNavTab(1); // Watch tab
      } else if (tabName === 'chat') {
        setActiveNavTab(3); // Chat tab
      } else if (tabName === 'matches') {
        setActiveNavTab(2); // Scores tab
      }`;

const newSwitchSync = `      // Synchronize bottom global nav highlighting
      if (tabName === 'feeds') {
        setActiveNavTab(1); // Live TV tab
      } else if (tabName === 'chat') {
        // Chat
      } else if (tabName === 'matches') {
        setActiveNavTab(3); // Calendar tab
      } else if (tabName === 'standings') {
        setActiveNavTab(3); // Calendar tab
      }`;

if (html.includes(oldSwitchSync)) {
    html = html.replace(oldSwitchSync, newSwitchSync);
} else {
    console.warn('Warning: Could not match switchMobileTab sync highlighting block.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Done! All UI and functionality modifications successfully written to index.html.');
