const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

const startMarker = '  <!-- Premium Ambient Glow Backgrounds -->';
const endMarker = '  <!-- Cookie Consent Banner -->';

const startIndex = html.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

const endMarkerIndex = html.indexOf(endMarker, startIndex);
if (endMarkerIndex === -1) {
    console.error('End marker not found');
    process.exit(1);
}

const scriptTagIndex = html.indexOf('  <script>', endMarkerIndex);
if (scriptTagIndex === -1) {
    console.error('Script tag after end marker not found');
    process.exit(1);
}


const newBody = `  <!-- Premium Ambient Glow Backgrounds -->
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>

  <div class="app-layout">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img class="logo-img" src="krynn_logo.png" alt="Krynn Logo" width="38" height="38">
        <span class="brand-title">KRYNN <span>SPORTS</span></span>
      </div>
      
      <nav class="sidebar-nav">
        <a href="#" class="nav-item active" id="side-nav-fixtures" onclick="switchCenterTab('fixtures')">
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
        </a>
      </nav>
      
      <div class="channel-selection-section">
        <div class="channel-selection-header">Live Feeds</div>
        <div class="channel-search-wrapper">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="sidebar-channel-search" placeholder="Search feeds..." oninput="filterChannelsList()">
        </div>
        <div class="sidebar-channels-scroll" id="sidebar-channels-list">
          <!-- Populated dynamically -->
        </div>
      </div>
      
      <div class="stream-health-panel">
        <div class="health-header">
          <span>Stream Health</span>
          <div class="health-badges">
            <span class="badge online" id="health-badge-status">ONLINE</span>
          </div>
        </div>
        <div class="sparkline-wrapper">
          <svg id="health-sparkline" viewBox="0 0 100 40" width="100%" height="100%">
            <polyline id="sparkline-polyline" fill="none" stroke="var(--green)" stroke-width="2" points="0,20 10,20 20,20 30,20 40,20 50,20 60,20 70,20 80,20 90,20 100,20" />
          </svg>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <button class="footer-icon-btn" onclick="scrollToSection('faq-section')" title="FAQ Guide"><i class="fa-solid fa-circle-question"></i></button>
        <button class="footer-icon-btn" onclick="shareStream()" title="Share Portal"><i class="fa-solid fa-share-nodes"></i></button>
        <button class="footer-icon-btn" onclick="window.open('/contact', '_blank')" title="Contact Support"><i class="fa-solid fa-envelope"></i></button>
      </div>
    </aside>

    <!-- Center Main Column -->
    <main class="main-content">
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="logo-container" style="display: flex; align-items: center; gap: 8px;">
            <img class="logo-img" src="krynn_logo.png" alt="Krynn Logo" width="32" height="32">
            <span class="brand-title" style="font-size: 16px; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">KRYNN <span style="color: var(--orange);">SPORTS</span></span>
          </div>
        </div>
        <div class="top-bar-right">
          <div class="top-bar-pills">
            <button class="top-pill active" id="top-pill-fixtures" onclick="switchCenterTab('fixtures')">Fixtures</button>
            <button class="top-pill" id="top-pill-results" onclick="switchCenterTab('results')">Results</button>
            <button class="top-pill" id="top-pill-standings" onclick="switchCenterTab('standings')">Standings</button>
            <button class="top-pill" id="top-pill-scorers" onclick="switchCenterTab('scorers')">Scorers</button>
          </div>
          <div class="live-badge" style="margin-left: 12px;">
            <div class="live-dot"></div>
            WORLD CUP LIVE
          </div>
        </div>
      </div>
      
      <!-- Dynamic Live Match Score Ticker -->
      <div class="score-ticker-container" id="live-score-ticker">
        <div class="score-ticker-wrapper" id="ticker-wrapper">
          <span class="ticker-item placeholder-ticker"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading Live Match Scoreboard...</span>
        </div>
      </div>
      
      <div class="center-scrollable-container">
        <!-- Hero Banner (custom World Cup graphics) -->
        <div class="hero-banner" id="hero-section">
          <div class="hero-overlay">
            <div class="hero-tag"><i class="fa-solid fa-trophy"></i> FIFA World Cup 2026</div>
            <h1 class="hero-title">KRYNN SPORTS — Live FIFA World Cup 2026 Streams</h1>
            <div class="hero-desc">Watch all matches live, check real-time standings, scoreboards, and toggle multi-audio feeds. High definition stream views and match analytics.</div>
            <button class="hero-btn" onclick="scrollToSection('video-section')"><i class="fa-solid fa-play"></i> Watch Now</button>
          </div>
        </div>

        <!-- Instagram Follow Banner -->
        <div class="ig-follow-banner" id="ig-banner">
          <div class="ig-follow-banner-inner" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div class="ig-banner-left" style="display: flex; align-items: center; gap: 12px;">
              <i class="fa-brands fa-instagram ig-icon" style="font-size: 24px; color: var(--orange);"></i>
              <div class="ig-banner-text">
                <span class="ig-banner-title" style="font-weight: 700; color: #fff; display: block; font-size: 13px;">Follow @krynnlabs</span>
                <span class="ig-banner-sub" style="font-size: 11px; color: var(--muted);">Get stream updates, new feeds &amp; exclusive content</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <a href="https://www.instagram.com/krynnlabs" target="_blank" rel="noopener noreferrer" class="ig-follow-btn" style="background: var(--orange); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 12px; text-decoration: none; font-weight: 700;">
                <i class="fa-brands fa-instagram"></i> Follow
              </a>
              <button class="ig-banner-close" onclick="document.getElementById('ig-banner').style.display='none'" title="Dismiss" style="background: transparent; border: none; color: var(--muted); cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
        </div>

        <!-- Centered Video Player Console & Chat Layout -->
        <div class="media-container" id="video-section">
          <!-- Live Channel Feeds Slider / Sidebar (relocated inside media-container, visible on mobile) -->
          <div class="channels-carousel-container" id="channels-section">
            <h2 class="section-title">
              <i class="fa-solid fa-tv"></i> Live Broadcast Feeds
            </h2>
            <div class="channels-scroll" id="channel-list-scroll">
              <!-- Dynamically populated stream cards -->
            </div>
          </div>

          <div class="player-container">
            <div class="player-ambient-glow"></div>
            <div class="player-wrapper">
              <div class="player-header">
                <div class="player-match-info">
                  <span class="live-pill">● LIVE</span>
                  <span class="match-teams" id="now-playing-title">Loading Stream...</span>
                </div>
                <div class="player-controls-right">
                  <!-- Viewer Count Badge -->
                  <div class="viewer-badge" id="viewer-badge" title="Live viewers">
                    <i class="fa-solid fa-eye"></i>
                    <span id="viewer-count">—</span><span class="watching-text"> watching</span>
                  </div>
                  <button class="share-btn" onclick="shareStream()" title="Share this stream">
                    <i class="fa-solid fa-share-nodes"></i> <span>Share</span>
                  </button>

                  <a class="ctrl-btn mirror-feed-ctrl" id="mirror-feed-btn" href="https://www.effectivecpmnetwork.com/h5w1ryzbxr?key=e84c28e15446501957ab4abd631eff11" target="_blank" rel="noopener noreferrer" title="Alternative stream link (Ad supported)"><i class="fa-solid fa-server"></i> <span>Mirror Feed</span></a>
                  <button class="ctrl-btn" id="quick-feeds-btn" onclick="toggleQuickChannels()"><i class="fa-solid fa-tv"></i> <span>Feeds</span></button>
                  <button class="ctrl-btn" id="chat-toggle-btn" onclick="toggleChat()"><i class="fa-solid fa-comments"></i> <span>Chat</span></button>
                  <button class="ctrl-btn" id="theater-btn" onclick="toggleTheaterMode()" title="Toggle Theater Mode"><i class="fa-solid fa-masks-theater"></i> <span>Theater</span></button>
                  <button class="ctrl-btn" id="pip-btn" onclick="togglePictureInPicture()" title="Picture-in-Picture Mode"><i class="fa-solid fa-window-restore"></i> <span>PiP</span></button>
                  <button class="ctrl-btn" onclick="toggleFullscreen()" title="Toggle Fullscreen"><i class="fa-solid fa-expand"></i> <span>Fullscreen</span></button>
                </div>
              </div>
              <div class="player-frame" id="player-frame">
                <!-- Floating Channels Menu button inside the player frame -->
                <button class="player-menu-btn" onclick="toggleQuickChannels()" title="Quick Channels Menu">
                  <i class="fa-solid fa-tv"></i> <span>Feeds Menu</span>
                </button>
      
                <!-- Floating Upcoming Match Countdown Badge -->
                <div class="upcoming-match-badge" id="upcoming-match-badge">
                  <span style="color: var(--orange); font-size: 10px; display: inline-flex; align-items: center; gap: 4px; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-clock"></i> Next:</span>
                  <img id="badge-home-flag" class="badge-flag" src="krynn_logo.png" alt="Home Team" width="16" height="16" loading="lazy">
                  <span id="badge-home-name">—</span>
                  <span style="color: var(--muted); font-size: 9px; font-weight: 900;">VS</span>
                  <img id="badge-away-flag" class="badge-flag" src="krynn_logo.png" alt="Away Team" width="16" height="16" loading="lazy">
                  <span id="badge-away-name">—</span>
                  <span style="color: rgba(255,255,255,0.15);">|</span>
                  <span id="badge-secs-countdown" class="badge-timer">00:00:00</span>
                </div>
      
                <!-- Player Error Overlay -->
                <div class="player-error-overlay" id="player-error-overlay">
                  <i class="fa-solid fa-triangle-exclamation error-overlay-icon"></i>
                  <div class="error-overlay-title">Playback Error Encountered</div>
                  <div class="error-overlay-msg" id="player-error-msg">This broadcast feed is currently experiencing issues. Please try reloading or select another feed from the drawer.</div>
                  <button class="error-overlay-btn" onclick="retryActiveChannel()">
                    <i class="fa-solid fa-rotate-right"></i> Retry Connection
                  </button>
                </div>
      
                <!-- Krynn Watermark overlay -->
                <div class="krynn-watermark" id="krynn-watermark">
                  <div class="watermark-dot"></div>
                  <img src="krynn_logo.png" alt="K" class="watermark-logo" width="60" height="60" loading="lazy">
                  <div class="watermark-divider"></div>
                  <span class="watermark-text">KRYNN <span>SPORTS</span></span>
                </div>
      
                <!-- Shaka Player Container -->
                <div data-shaka-player-container id="shaka-container" style="width:100%; height:100%; position:absolute; top:0; left:0; z-index:1;">
                  <video data-shaka-player id="video" autoplay style="width:100%; height:100%; background:#000;"></video>
                </div>
      
                <!-- Iframe Player Container for fallback web players -->
                <div id="iframe-container" style="width:100%; height:100%; position:absolute; top:0; left:0; z-index:1; display:none; background:#000;">
                  <iframe id="player-iframe" style="width:100%; height:100%; border:none;" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                </div>
      
                <!-- Quick Channels Side Drawer overlay -->
                <div class="quick-channels-drawer" id="quick-channels-drawer">
                  <div class="drawer-header">
                    <span><i class="fa-solid fa-tv"></i> Broadcast Feeds</span>
                    <button class="drawer-close-btn" onclick="toggleQuickChannels(false)"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                  <div class="drawer-content" id="drawer-channels-list">
                    <!-- Dynamically populated list -->
                  </div>
                </div>
      
                <!-- Swipe/Switch Channel visual indicator overlay -->
                <div class="channel-switch-indicator" id="channel-switch-indicator">
                  <i class="fa-solid fa-arrow-left arrow-left"></i>
                  <div class="indicator-details">
                    <span class="indicator-action">Switching to</span>
                    <span class="indicator-channel-name" id="indicator-channel-name">Stream</span>
                  </div>
                  <i class="fa-solid fa-arrow-right arrow-right"></i>
                </div>
      
                <!-- Next/Prev overlay chevrons -->
                <button class="player-nav-btn prev" onclick="playPrevChannel()" aria-label="Previous Channel">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button class="player-nav-btn next" onclick="playNextChannel()" aria-label="Next Channel">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              <div class="player-tip-bar">
                <i class="fa-solid fa-circle-info"></i>
                <span>If stream is not working or buffering, try to switch to a different broadcast feed. Experiencing issues? Reach out to <a href="/contact" style="color: var(--orange); text-decoration: none; font-weight: 600;">Support / Contact Us</a>.</span>
              </div>
            </div>
          </div>

          <!-- Mobile Tab Selection Panel (Visible only on Mobile Viewports) -->
          <div class="mobile-tabs-bar" id="mobile-tabs-bar">
            <button class="mobile-tab-btn active" onclick="switchMobileTab('feeds')">
              <i class="fa-solid fa-tv"></i> Feeds
            </button>
            <button class="mobile-tab-btn" onclick="switchMobileTab('chat')">
              <i class="fa-solid fa-comments"></i> Chat
            </button>
            <button class="mobile-tab-btn" onclick="switchMobileTab('matches')">
              <i class="fa-solid fa-square-poll-vertical"></i> Matches
            </button>
            <button class="mobile-tab-btn" onclick="switchMobileTab('standings')">
              <i class="fa-solid fa-trophy"></i> Standings
            </button>
          </div>

          <!-- Collapsible Chat Sidebar -->
          <div class="chat-wrapper" id="chat-section">
            <div class="chat-header">
              <span><i class="fa-solid fa-comments"></i> Live Fan Chat</span>
              <button class="chat-close-btn" onclick="toggleChat()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="chat-widget-container" style="flex: 1; background: #060609; min-height: 300px; display: flex; flex-direction: column; overflow: hidden; border-radius: 8px;">
              <div style="flex: 1; width: 100%; position: relative;">
                <script src="https://minnit.chat/js/chatsdk.js?c=1772345196" defer></script>
                <script src="https://minnit.chat/js/embed.js?c=1772345192" defer></script>
                <span style="display: none;" class="minnit-chat-sembed" data-iframeid="chat" data-chatname="https://organizations.minnit.chat/768757246470535/c/Main?embed&sdk&sdkversion=1.1mobile&dark&language=en" data-style="width:100%; height:100%; border:none; background:transparent; position:absolute; top:0; left:0;" data-version="1.55">Chat</span>
              </div>
              <p class="powered-by-minnit" style="font-size: 10px; color: var(--muted); margin: 6px auto; text-align: center;">
                <a href="https://minnit.chat" target="_blank" rel="noopener noreferrer" style="color: var(--orange); text-decoration: none; font-weight: 600;">Get your own free chatroom with Minnit Chat</a>
              </p>
              <script>
                let minnit;
                document.addEventListener("DOMContentLoaded", function(event) {
                   minnit = new MinnitChat({"iframe": document.getElementById("chat")});
                   minnit.connect();
                });
              </script>
            </div>
          </div>
        </div>

        <!-- Native Banner Ad Container (Centred and Glassmorphic) -->
        <div class="ad-native-container" style="max-width: 800px; margin: 24px auto 12px; padding: 16px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
          <div style="font-size: 10px; color: var(--muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Sponsored Content</div>
          <div id="container-a88b00d739e0800cab524437a4babb37" style="display: flex; justify-content: center; width: 100%;"></div>
          <script async="async" data-cfasync="false" src="https://pl29732135.effectivecpmnetwork.com/a88b00d739e0800cab524437a4babb37/invoke.js"></script>
        </div>

        <!-- Center Tabs Container containing Fixtures, Results, Standings, Scorers -->
        <div class="center-tabs-container">
          <div class="center-tabs-header">
            <button class="center-tab-btn active" id="center-tab-btn-fixtures" onclick="switchCenterTab('fixtures')">Fixtures</button>
            <button class="center-tab-btn" id="center-tab-btn-results" onclick="switchCenterTab('results')">Results</button>
            <button class="center-tab-btn" id="center-tab-btn-standings" onclick="switchCenterTab('standings')">Standings</button>
            <button class="center-tab-btn" id="center-tab-btn-scorers" onclick="switchCenterTab('scorers')">Scorers</button>
          </div>
          
          <div class="center-tabs-content">
            <!-- Fixtures Panel (Upcoming / Live) -->
            <div id="center-tab-fixtures" class="center-tab-panel active">
              <div class="upcoming-controls" style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
                <div class="search-input-wrapper" style="position: relative; flex: 1; min-width: 240px;">
                  <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px;"></i>
                  <input type="text" id="upcoming-search" placeholder="Search team, group, or stadium..." style="width: 100%; padding: 10px 12px 10px 38px; border: 1px solid var(--card-border); border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: #fff; font-size: 13px; outline: none;" oninput="filterUpcomingMatches()">
                </div>
                <button id="btn-toggle-upcoming" class="watch-btn" onclick="toggleUpcomingMatches()" style="padding: 10px 18px; border-radius: 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-list-ul"></i> Show All (<span id="upcoming-total-count">0</span>)
                </button>
              </div>
              <div class="upcoming-table-wrapper">
                <table class="upcoming-table">
                  <thead>
                    <tr>
                      <th>Match Details</th>
                      <th>Home Team</th>
                      <th style="text-align: center;">Win Probability</th>
                      <th style="text-align: right;">Away Team</th>
                      <th style="text-align: center;">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="upcoming-matches-body">
                    <!-- Dynamically populated from JS -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Results Panel (Finished) -->
            <div id="center-tab-results" class="center-tab-panel">
              <div class="upcoming-table-wrapper">
                <table class="upcoming-table">
                  <thead>
                    <tr>
                      <th>Match Details</th>
                      <th>Home Team</th>
                      <th style="text-align: center;">Final Score</th>
                      <th style="text-align: right;">Away Team</th>
                      <th style="text-align: center;">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="finished-matches-body">
                    <!-- Dynamically populated from JS -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Standings Panel -->
            <div id="center-tab-standings" class="center-tab-panel">
              <div class="standings-tabs-wrapper" style="margin-bottom: 16px; overflow-x: auto; white-space: nowrap; padding-bottom: 8px; border-bottom: 1px solid var(--card-border);">
                <div class="standings-tabs" style="display: flex; gap: 8px;">
                  <button class="tab-btn active" onclick="selectStandingsGroup('A')">Group A</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('B')">Group B</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('C')">Group C</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('D')">Group D</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('E')">Group E</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('F')">Group F</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('G')">Group G</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('H')">Group H</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('I')">Group I</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('J')">Group J</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('K')">Group K</button>
                  <button class="tab-btn" onclick="selectStandingsGroup('L')">Group L</button>
                </div>
              </div>
              <div class="upcoming-table-wrapper">
                <table class="upcoming-table standings-table">
                  <thead>
                    <tr>
                      <th style="width: 50px; text-align: center;">Pos</th>
                      <th>Team</th>
                      <th style="text-align: center;">P</th>
                      <th style="text-align: center;">W</th>
                      <th style="text-align: center;">D</th>
                      <th style="text-align: center;">L</th>
                      <th style="text-align: center;">GF</th>
                      <th style="text-align: center;">GA</th>
                      <th style="text-align: center;">GD</th>
                      <th style="text-align: center; font-weight: 700; color: var(--orange);">Pts</th>
                    </tr>
                  </thead>
                  <tbody id="standings-table-body">
                    <!-- Dynamically populated from JS -->
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Top Scorers Panel -->
            <div id="center-tab-scorers" class="center-tab-panel">
              <div class="upcoming-table-wrapper">
                <table class="upcoming-table">
                  <thead>
                    <tr>
                      <th style="width: 50px; text-align: center;">Rank</th>
                      <th>Player</th>
                      <th>Team</th>
                      <th style="text-align: center;">Goals</th>
                      <th style="text-align: center;">Assists</th>
                    </tr>
                  </thead>
                  <tbody id="scorers-table-body">
                    <!-- Dynamically populated from JS -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <!-- FAQ Guide -->
        <div class="upcoming-container" id="faq-section" style="margin-top: 24px;">
          <h2 class="section-title" style="margin-bottom: 20px;">
            <i class="fa-solid fa-circle-question"></i> FIFA World Cup 2026 — Live Streaming Guide &amp; FAQ
          </h2>
          
          <div class="guide-intro" style="margin-bottom: 24px; color: var(--muted); font-size: 14px; line-height: 1.8;">
            <p style="margin-bottom: 12px;">Welcome to the ultimate fan dashboard for the <strong>FIFA World Cup 2026</strong>. This historic 23rd edition of the tournament is co-hosted across three North American countries: the United States, Mexico, and Canada. With an expanded format of 48 nations competing in 104 matches, this represents the largest World Cup in association football history.</p>
            <p>Our dashboard integrates real-time match data, group standings, live scoreboards, and official broadcast schedule directories. Below is a comprehensive guide to utilizing our platform and getting the best viewing experience.</p>
          </div>

          <div class="faq-accordion">
            <div class="faq-card" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s;">
              <div class="faq-header" onclick="toggleFaq(this)" style="padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #fff;">How can I watch live matches on KRYNN SPORTS?</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 13px; color: var(--orange); transition: transform 0.3s;"></i>
              </div>
              <div class="faq-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; padding: 0 24px;">
                <p style="padding-bottom: 18px; color: #a1a1aa; font-size: 13.5px; line-height: 1.7;">To watch a live match, simply scroll to the <strong>Live Player Section</strong>. Select any channels or broadcast feeds from the menu on the side of the player. Our player supports both DASH (.mpd) and HLS (.m3u8) streams. If a stream fails to load, the player will automatically search and switch to working backup feeds.</p>
              </div>
            </div>

            <div class="faq-card" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s;">
              <div class="faq-header" onclick="toggleFaq(this)" style="padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #fff;">Are the live match scores and data accurate?</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 13px; color: var(--orange); transition: transform 0.3s;"></i>
              </div>
              <div class="faq-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; padding: 0 24px;">
                <p style="padding-bottom: 18px; color: #a1a1aa; font-size: 13.5px; line-height: 1.7;">Yes. Our real-time scoreboard is connected to live statistics APIs (including OpenFootball and SportScore). We display live scores, possession percentages, match probability projections, and complete group standings updated immediately after the final whistle of every match day.</p>
              </div>
            </div>

            <div class="faq-card" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s;">
              <div class="faq-header" onclick="toggleFaq(this)" style="padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #fff;">Why am I getting a playback authentication error?</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 13px; color: var(--orange); transition: transform 0.3s;"></i>
              </div>
              <div class="faq-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; padding: 0 24px;">
                <p style="padding-bottom: 18px; color: #a1a1aa; font-size: 13.5px; line-height: 1.7;">Many premium broadcast streams use Digital Rights Management (DRM) to protect their feeds. KRYNN SPORTS incorporates a built-in playback client utilizing secure stream tokens. If the tokens expire or if the broadcaster changes their rotation, the stream may fail to load. When this happens, our system will attempt auto-failover, or you can manually select an alternate feed from the channel menu.</p>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>🏆 <span>KRYNN SPORTS</span> — Official World Cup 2026 Broadcast &amp; Scores Guide</p>
          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
          <div class="footer-links" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
            <a href="/teams">Teams Guide</a>
            <a href="/groups">Stage Standings</a>
            <a href="/schedule">Match Schedule</a>
            <a href="/predictions">Match Predictions</a>
            <a href="/news">News Updates</a>
          </div>
        </footer>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <div class="right-sidebar-header">
        <div class="sidebar-title">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Match Analytics</span>
        </div>
      </div>
      
      <!-- Win Probability Card -->
      <div class="card">
        <div class="panel-title">Win Probability</div>
        <div class="probability-dial-container">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="36" stroke="#2a2a35" />
            <!-- Segment 1: Home Win (Orange) -->
            <circle id="dial-home" cx="50" cy="50" r="36" stroke="var(--orange)" transform="rotate(-90 50 50)" />
            <!-- Segment 2: Draw (Gold) -->
            <circle id="dial-draw" cx="50" cy="50" r="36" stroke="var(--gold)" transform="rotate(-90 50 50)" />
            <!-- Segment 3: Away Win (Red) -->
            <circle id="dial-away" cx="50" cy="50" r="36" stroke="#ef4444" transform="rotate(-90 50 50)" />
          </svg>
          <div class="dial-center-text">
            <span class="lbl">WIN PROB</span>
            <span class="teams" id="dial-teams-abbr">H vs A</span>
          </div>
        </div>
        <div class="dial-legend" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start; padding: 0 8px;">
          <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
            <span class="dot home" style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--orange);"></span>
            <span id="lbl-legend-home" style="color: var(--muted); font-size: 11px;">Home: </span><span id="pct-home" style="color:#fff; font-weight:700; font-size:11px;">—</span>
          </div>
          <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
            <span class="dot draw" style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--gold);"></span>
            <span style="color: var(--muted); font-size: 11px;">Draw: </span><span id="pct-draw" style="color:#fff; font-weight:700; font-size:11px;">—</span>
          </div>
          <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
            <span class="dot away" style="width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444;"></span>
            <span id="lbl-legend-away" style="color: var(--muted); font-size: 11px;">Away: </span><span id="pct-away" style="color:#fff; font-weight:700; font-size:11px;">—</span>
          </div>
        </div>
      </div>
      
      <!-- Match Stats Panel -->
      <div class="card" id="match-stats-card">
        <div class="panel-title" id="stats-card-title">Live Match Statistics</div>
        <div class="stats-comparison-bars" id="stats-bars-container">
          <!-- Possession -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-possession">50%</span>
              <span>Possession</span>
              <span id="stat-val-away-possession">50%</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-possession" style="width: 50%;"></div>
              <div class="away-bar" id="stat-bar-away-possession" style="width: 50%;"></div>
            </div>
          </div>
          <!-- Shots -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-shots">0</span>
              <span>Shots</span>
              <span id="stat-val-away-shots">0</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-shots" style="width: 0%;"></div>
              <div class="away-bar" id="stat-bar-away-shots" style="width: 0%;"></div>
            </div>
          </div>
          <!-- Shots on Target -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-ontarget">0</span>
              <span>Shots on Target</span>
              <span id="stat-val-away-ontarget">0</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-ontarget" style="width: 0%;"></div>
              <div class="away-bar" id="stat-bar-away-ontarget" style="width: 0%;"></div>
            </div>
          </div>
          <!-- Corners -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-corners">0</span>
              <span>Corners</span>
              <span id="stat-val-away-corners">0</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-corners" style="width: 0%;"></div>
              <div class="away-bar" id="stat-bar-away-corners" style="width: 0%;"></div>
            </div>
          </div>
          <!-- Fouls -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-fouls">0</span>
              <span>Fouls</span>
              <span id="stat-val-away-fouls">0</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-fouls" style="width: 0%;"></div>
              <div class="away-bar" id="stat-bar-away-fouls" style="width: 0%;"></div>
            </div>
          </div>
          <!-- Yellow Cards -->
          <div class="stat-row">
            <div class="stat-labels">
              <span id="stat-val-home-yellow">0</span>
              <span>Yellow Cards</span>
              <span id="stat-val-away-yellow">0</span>
            </div>
            <div class="stat-bar">
              <div class="home-bar" id="stat-bar-home-yellow" style="width: 0%;"></div>
              <div class="away-bar" id="stat-bar-away-yellow" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top Scorers Sidebar List -->
      <div class="card">
        <div class="panel-title">Tournament Leaderboard</div>
        <div class="scorers-sidebar-list" id="scorers-sidebar-list">
          <!-- Dynamically populated from JS -->
        </div>
      </div>
    </aside>
  </div>

  <!-- Mobile Bottom Tab Bar -->
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
  </nav>

  <!-- Cookie Consent Banner -->
  <div class="cookie-consent-banner" id="cookie-consent">
    <div class="cookie-consent-content">
      <div class="cookie-consent-icon"><i class="fa-solid fa-cookie-bite"></i></div>
      <div class="cookie-consent-text">
        <h5>We Value Your Privacy</h5>
        <p>We use cookies and similar technologies to analyze traffic, personalize content and ads, and provide social media features. Read our <a href="/privacy-policy">Privacy Policy</a> to learn more.</p>
      </div>
    </div>
    <div class="cookie-consent-buttons">
      <button class="cookie-btn decline" onclick="declinePrivacyConsent()">Decline</button>
      <button class="cookie-btn accept" onclick="acceptPrivacyConsent()">Accept &amp; Continue</button>
    </div>
  </div>`;

const before = html.substring(0, startIndex);
const after = html.substring(scriptTagIndex);

fs.writeFileSync(filePath, before + newBody + "\n\n" + after, 'utf8');
console.log('Successfully replaced body html!');
