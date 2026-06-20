const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
html = html.replace(/\r\n/g, '\n');

// 1. Switch Center Column tabs switching logic injection
const tabSwitchingCode = `
        // --- Center Column Tab Switching ---
        window.switchCenterTab = function(tabName) {
            // Hide all tab panels
            document.querySelectorAll('.center-tab-panel').forEach(p => p.classList.remove('active'));
            // Show selected panel
            const panel = document.getElementById(\`center-tab-\${tabName}\`);
            if (panel) panel.classList.add('active');
            
            // Sync center-tab-btn active state
            document.querySelectorAll('.center-tab-btn').forEach(btn => {
                const onclickAttr = btn.getAttribute('onclick');
                const isMatch = onclickAttr && onclickAttr.includes(\`'\${tabName}'\`);
                btn.classList.toggle('active', !!isMatch);
            });
            
            // Sync top-bar top-pill active state
            document.querySelectorAll('.top-pill').forEach(btn => {
                const onclickAttr = btn.getAttribute('onclick');
                const isMatch = onclickAttr && onclickAttr.includes(\`'\${tabName}'\`);
                btn.classList.toggle('active', !!isMatch);
            });
            
            // Sync sidebar-nav item active state
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
                const onclickAttr = btn.getAttribute('onclick');
                const isMatch = onclickAttr && onclickAttr.includes(\`'\${tabName}'\`);
                btn.classList.toggle('active', !!isMatch);
            });
        };
`;

// 2. Stream Health Latency Monitor Sparkline update code
const sparklineCode = `
        // --- Stream Health Latency Monitor Sparkline ---
        let latencyHistory = [35, 40, 38, 42, 36, 45, 39, 41, 38, 40];
        
        window.updateSparkline = function() {
            let lastVal = latencyHistory[latencyHistory.length - 1] || 40;
            let diff = (Math.random() - 0.5) * 8; // random fluctuation -4ms to +4ms
            let newVal = Math.round(lastVal + diff);
            newVal = Math.max(20, Math.min(95, newVal));
            latencyHistory.push(newVal);
            if (latencyHistory.length > 15) latencyHistory.shift();
            
            const w = 100;
            const h = 40;
            const pts = [];
            const maxVal = Math.max(...latencyHistory, 100);
            const minVal = Math.min(...latencyHistory, 0);
            const valRange = maxVal - minVal || 1;
            
            for (let i = 0; i < latencyHistory.length; i++) {
                const x = (i / (latencyHistory.length - 1)) * w;
                const y = h - ((latencyHistory[i] - minVal) / valRange) * (h - 10) - 5;
                pts.push(\`\${x.toFixed(1)},\${y.toFixed(1)}\`);
            }
            
            const polyline = document.getElementById('sparkline-polyline');
            if (polyline) {
                polyline.setAttribute('points', pts.join(' '));
                const activeChannel = channelsData[activeChannelIndex];
                const isOnline = activeChannel ? (channelsHealthStatus[activeChannel.streamUrl] !== false) : true;
                polyline.setAttribute('stroke', isOnline ? 'var(--green)' : 'var(--red)');
            }
            
            const badgeStatus = document.getElementById('health-badge-status');
            if (badgeStatus) {
                const activeChannel = channelsData[activeChannelIndex];
                const isOnline = activeChannel ? (channelsHealthStatus[activeChannel.streamUrl] !== false) : true;
                badgeStatus.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
                badgeStatus.className = isOnline ? 'badge online' : 'badge offline';
                badgeStatus.style.background = isOnline ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                badgeStatus.style.color = isOnline ? 'var(--green)' : 'var(--red)';
                badgeStatus.style.border = isOnline ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)';
            }
        };
`;

// 3. Right Sidebar match analytics and deterministic stats simulation
const matchAnalyticsCode = `
        // --- Match Analytics Stats Generator & Right Sidebar ---
        window.selectedStatsMatch = null;
        
        window.selectMatchForStats = function(home, away, matchId, status, score) {
            window.selectedStatsMatch = { home, away, matchId, status, score };
            
            // Highlight the selected row in Fixtures/Results tables
            document.querySelectorAll('.upcoming-row').forEach(row => {
                if (row.getAttribute('data-match-id') === matchId) {
                    row.classList.add('selected-stats-match-row');
                    row.style.background = 'rgba(255, 106, 0, 0.08)';
                    row.style.borderColor = 'var(--orange)';
                } else {
                    row.classList.remove('selected-stats-match-row');
                    row.style.background = '';
                    row.style.borderColor = '';
                }
            });
            
            updateRightSidebarContent();
        };

        function generateMatchStats(home, away, status, score) {
            const str = \`\${home}-\&nbsp;\${away}\`;
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash |= 0;
            }
            hash = Math.abs(hash);
            
            const rHome = TEAM_RATINGS[cleanName(home)] || 75;
            const rAway = TEAM_RATINGS[cleanName(away)] || 75;
            
            const ratingDiff = rHome - rAway;
            let homePossession = Math.round(50 + (ratingDiff * 0.8) + (hash % 5) - 2);
            homePossession = Math.max(30, Math.min(70, homePossession));
            const awayPossession = 100 - homePossession;
            
            let homeShots = Math.round(10 + (ratingDiff * 0.15) + (hash % 6));
            let awayShots = Math.round(10 - (ratingDiff * 0.15) + ((hash >> 2) % 6));
            homeShots = Math.max(3, homeShots);
            awayShots = Math.max(3, awayShots);
            
            let homeOnTarget = Math.round(homeShots * (0.3 + (hash % 3) * 0.08));
            let awayOnTarget = Math.round(awayShots * (0.3 + ((hash >> 1) % 3) * 0.08));
            homeOnTarget = Math.min(homeShots, Math.max(1, homeOnTarget));
            awayOnTarget = Math.min(awayShots, Math.max(1, awayOnTarget));
            
            let homeCorners = Math.round(4 + (ratingDiff * 0.08) + (hash % 4));
            let awayCorners = Math.round(4 - (ratingDiff * 0.08) + ((hash >> 3) % 4));
            homeCorners = Math.max(1, homeCorners);
            awayCorners = Math.max(1, awayCorners);
            
            let homeFouls = Math.round(11 + (hash % 6));
            let awayFouls = Math.round(12 + ((hash >> 1) % 6));
            
            let homeYellow = Math.round((hash % 3));
            let awayYellow = Math.round(((hash >> 2) % 3));
            
            if (score) {
                const hs = parseInt(score.homeScore) || 0;
                const as = parseInt(score.awayScore) || 0;
                homeOnTarget = Math.max(hs, homeOnTarget);
                awayOnTarget = Math.max(as, awayOnTarget);
                homeShots = Math.max(homeShots, homeOnTarget);
                awayShots = Math.max(awayShots, awayOnTarget);
            }
            
            return {
                possession: { home: homePossession, away: awayPossession },
                shots: { home: homeShots, away: awayShots },
                shotsOnTarget: { home: homeOnTarget, away: awayOnTarget },
                corners: { home: homeCorners, away: awayCorners },
                fouls: { home: homeFouls, away: awayFouls },
                yellowCards: { home: homeYellow, away: awayYellow }
            };
        }

        function updateRightSidebarContent() {
            if (!window.selectedStatsMatch) return;
            const { home, away, status, score } = window.selectedStatsMatch;
            
            const cardTitle = document.getElementById('stats-card-title');
            if (cardTitle) {
                cardTitle.textContent = \`\${getTeamAbbreviation(home)} vs \` + 
                                       \`\${getTeamAbbreviation(away)} — \` + 
                                       (status === 'live' ? 'Live Analytics' : status === 'finished' ? 'Final Stats' : 'Match Preview');
            }
            
            const stats = generateMatchStats(home, away, status, score);
            
            const updateStatRow = (key, suffix = '') => {
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
            updateStatRow('yellowCards');
            
            const probs = getWinProbability(home, away);
            updateWinProbabilityDial(probs);
            
            const teamsAbbr = document.getElementById('dial-teams-abbr');
            if (teamsAbbr) {
                teamsAbbr.textContent = \`\${getTeamAbbreviation(home)} vs \${getTeamAbbreviation(away)}\`;
            }
            
            const lblLegendHome = document.getElementById('lbl-legend-home');
            const lblLegendAway = document.getElementById('lbl-legend-away');
            if (lblLegendHome) lblLegendHome.textContent = \`\${getTeamAbbreviation(home)}: \`;
            if (lblLegendAway) lblLegendAway.textContent = \`\${getTeamAbbreviation(away)}: \`;
        }
        
        function updateWinProbabilityDial(probs) {
            const C = 226.2;
            const homeLen = (probs.homeWin / 100) * C;
            const drawLen = (probs.draw / 100) * C;
            const awayLen = (probs.awayWin / 100) * C;
            
            const homeDial = document.getElementById('dial-home');
            const drawDial = document.getElementById('dial-draw');
            const awayDial = document.getElementById('dial-away');
            
            if (homeDial) {
                homeDial.setAttribute('stroke-dasharray', \`\${homeLen} \${C}\`);
                homeDial.setAttribute('stroke-dashoffset', '0');
            }
            if (drawDial) {
                drawDial.setAttribute('stroke-dasharray', \`\${drawLen} \${C}\`);
                drawDial.setAttribute('stroke-dashoffset', \`\${-homeLen}\`);
            }
            if (awayDial) {
                awayDial.setAttribute('stroke-dasharray', \`\${awayLen} \${C}\`);
                awayDial.setAttribute('stroke-dashoffset', \`\${-(homeLen + drawLen)}\`);
            }
            
            const pctHome = document.getElementById('pct-home');
            const pctDraw = document.getElementById('pct-draw');
            const pctAway = document.getElementById('pct-away');
            if (pctHome) pctHome.textContent = \`\${probs.homeWin}%\`;
            if (pctDraw) pctDraw.textContent = \`\${probs.draw}%\`;
            if (pctAway) pctAway.textContent = \`\${probs.awayWin}%\`;
        }

        // --- Tournament Top Scorers List Render ---
        const mockTopScorers = [
            { name: "Kylian Mbappé", team: "France", goals: 5, assists: 2, rank: 1 },
            { name: "Lionel Messi", team: "Argentina", goals: 4, assists: 3, rank: 2 },
            { name: "Harry Kane", team: "England", goals: 4, assists: 1, rank: 3 },
            { name: "Erling Haaland", team: "Norway", goals: 3, assists: 2, rank: 4 },
            { name: "Marcus Rashford", team: "England", goals: 3, assists: 1, rank: 5 }
        ];

        function renderScorers() {
            // 1. Right Sidebar Tournament Leaderboard
            const sidebarScorersList = document.getElementById('scorers-sidebar-list');
            if (sidebarScorersList) {
                sidebarScorersList.innerHTML = mockTopScorers.map(s => {
                    const flagUrl = getTeamFlagUrl(s.team);
                    return \`
                        <div class="scorer-item">
                            <span class="scorer-rank">\${s.rank}</span>
                            <img src="\${flagUrl}" class="scorer-flag" onerror="this.src='krynn_logo.png'" alt="\${s.team} flag" width="20" height="14" loading="lazy">
                            <div class="scorer-info">
                                <div class="scorer-name">\${s.name}</div>
                                <div class="scorer-team">\${s.team}</div>
                            </div>
                            <div class="scorer-stats">
                                <span class="scorer-goals"><strong>\${s.goals}</strong> goals</span>
                                <span class="scorer-assists">\${s.assists} assists</span>
                            </div>
                        </div>
                    \`;
                }).join('');
            }
            
            // 2. Center Panel Top Scorers Tab
            const scorersTableBody = document.getElementById('scorers-table-body');
            if (scorersTableBody) {
                scorersTableBody.innerHTML = mockTopScorers.map(s => {
                    const flagUrl = getTeamFlagUrl(s.team);
                    return \`
                        <tr>
                            <td style="text-align: center; font-weight: 700; color: var(--orange); font-family: 'Outfit';">\${s.rank}</td>
                            <td><strong style="color: #fff;">\${s.name}</strong></td>
                            <td>
                                <div class="upcoming-team-cell">
                                    <img src="\${flagUrl}" class="upcoming-team-logo" onerror="this.src='krynn_logo.png'" alt="\${s.team} flag" width="20" height="20" style="margin-right: 6px;">
                                    <span>\${s.team}</span>
                                </div>
                            </td>
                            <td style="text-align: center; font-weight: 700; color: #fff;">\${s.goals}</td>
                            <td style="text-align: center; color: var(--muted);">&nbsp;\${s.assists}</td>
                        </tr>
                    \`;
                }).join('');
            }
        }
`;

// 4. Replace channel selection card render function
const originalChannelListRender = `        function renderChannelList() {
            const listScroll = document.getElementById('channel-list-scroll');
            if (!listScroll) return;
            listScroll.innerHTML = '';

            const channelsWithIndex = channelsData.map((channel, originalIndex) => ({
                channel,
                originalIndex
            }));

            channelsWithIndex.sort((a, b) => {
                const aOnline = channelsHealthStatus[a.channel.streamUrl] !== false;
                const bOnline = channelsHealthStatus[b.channel.streamUrl] !== false;
                if (aOnline && !bOnline) return -1;
                if (!aOnline && bOnline) return 1;
                return 0;
            });

            channelsWithIndex.forEach(({ channel, originalIndex }) => {
                const card = document.createElement('div');
                card.className = 'channel-select-card';
                card.setAttribute('data-channel-index', originalIndex);
                if (originalIndex === activeChannelIndex) card.classList.add('active');

                // Clean logo fallback
                let logoUrl = channel.logo;
                const isOnline = channelsHealthStatus[channel.streamUrl] !== false; // Default true
                const healthColor = isOnline ? 'var(--green)' : 'var(--red)';
                const healthLabel = isOnline ? 'LIVE' : 'OFFLINE';

                card.innerHTML = \`
                    <div class="card-logo-container">
                        <img class="card-logo" src="\\\${logoUrl}" onerror="this.src='krynn_logo.png'" alt="\\\${channel.name} Logo" width="50" height="50" loading="lazy">
                    </div>
                    <div class="card-info">
                        <div class="card-name">\\\${channel.name}</div>
                        <div class="card-meta" style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
                            <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; color: var(--muted); text-transform: uppercase; font-weight: 700;">\\\${channel.language}</span>
                            <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25); border-radius: 2px; color: var(--orange); text-transform: uppercase; font-weight: 700;">\\\${channel.quality}</span>
                            <span class="card-status" style="color: \\\${healthColor}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                <span class="card-status-dot" style="background: \\\${healthColor}; width: 5px; height: 5px; border-radius: 50%;"></span> \\\${healthLabel}
                            </span>
                        </div>
                    </div>
                \`;

                card.addEventListener('click', () => {
                    selectChannel(originalIndex);
                    scrollToSection('video-section');
                });

                listScroll.appendChild(card);
            });
        }`;

const replacementChannelListRender = `        function renderChannelList() {
            const sidebarList = document.getElementById('sidebar-channels-list');
            const listScroll = document.getElementById('channel-list-scroll');
            
            const renderTo = (container, isMobileLayout) => {
                if (!container) return;
                container.innerHTML = '';
                
                const searchVal = document.getElementById('sidebar-channel-search')?.value.toLowerCase().trim() || '';
                
                const filtered = channelsData.map((channel, originalIndex) => ({
                    channel,
                    originalIndex
                })).filter(({ channel }) => {
                    if (isMobileLayout) return true; // Do not filter mobile carousel
                    return channel.name.toLowerCase().includes(searchVal) || 
                           channel.language.toLowerCase().includes(searchVal) ||
                           channel.quality.toLowerCase().includes(searchVal);
                });

                filtered.sort((a, b) => {
                    const aOnline = channelsHealthStatus[a.channel.streamUrl] !== false;
                    const bOnline = channelsHealthStatus[b.channel.streamUrl] !== false;
                    if (aOnline && !bOnline) return -1;
                    if (!aOnline && bOnline) return 1;
                    return 0;
                });

                filtered.forEach(({ channel, originalIndex }) => {
                    const card = document.createElement('div');
                    card.className = 'channel-select-card';
                    card.setAttribute('data-channel-index', originalIndex);
                    if (originalIndex === activeChannelIndex) card.classList.add('active');

                    let logoUrl = channel.logo;
                    const isOnline = channelsHealthStatus[channel.streamUrl] !== false;
                    const healthColor = isOnline ? 'var(--green)' : 'var(--red)';
                    const healthLabel = isOnline ? 'LIVE' : 'OFFLINE';

                    card.innerHTML = \`
                        <div class="card-logo-container">
                            <img class="card-logo" src="\${logoUrl}" onerror="this.src='krynn_logo.png'" alt="\${channel.name} Logo" width="38" height="38" loading="lazy">
                        </div>
                        <div class="card-info">
                            <div class="card-name">\${channel.name}</div>
                            <div class="card-meta" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
                                <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; color: var(--muted); text-transform: uppercase; font-weight: 700;">\${channel.language}</span>
                                <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25); border-radius: 2px; color: var(--orange); text-transform: uppercase; font-weight: 700;">\${channel.quality}</span>
                                <span class="card-status" style="color: \${healthColor}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                    <span class="card-status-dot" style="background: \${healthColor}; width: 5px; height: 5px; border-radius: 50%;"></span> \${healthLabel}
                                </span>
                            </div>
                        </div>
                    \`;

                    card.addEventListener('click', () => {
                        selectChannel(originalIndex);
                        scrollToSection('video-section');
                    });

                    container.appendChild(card);
                });
            };
            
            renderTo(sidebarList, false);
            renderTo(listScroll, true);
        }
        
        window.filterChannelsList = function() {
            renderChannelList();
        };`;

// 5. Replace filterUpcomingMatches and renderUpcomingTable
const originalFilterMatches = `        window.filterUpcomingMatches = function() {
            if (!window.allWorldCupFixtures) return;
            
            const searchInput = document.getElementById('upcoming-search');
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            
            const now = new Date();
            let list = window.allWorldCupFixtures;
            
            if (!window.showAllUpcoming && !query) {
                list = list.filter(f => new Date(f.time) >= now);
                if (list.length === 0) {
                    list = window.allWorldCupFixtures.slice(-6);
                } else {
                    list = list.slice(0, 6);
                }
            } else if (query) {
                list = list.filter(f => {
                    const home = (f.home || '').toLowerCase();
                    const away = (f.away || '').toLowerCase();
                    const group = (f.group || '').toLowerCase();
                    const text = (f.status_text || '').toLowerCase();
                    return home.includes(query) || away.includes(query) || group.includes(query) || text.includes(query);
                });
            }
            
            renderUpcomingTable(list);
        };`;

const replacementFilterMatches = `        window.filterUpcomingMatches = function() {
            if (!window.allWorldCupFixtures) return;
            
            const searchInput = document.getElementById('upcoming-search');
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            
            const now = new Date();
            let list = window.allWorldCupFixtures;
            
            if (!window.showAllUpcoming && !query) {
                const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000);
                list = list.filter(f => new Date(f.time) >= twoHoursAgo);
                if (list.length === 0) {
                    list = window.allWorldCupFixtures;
                }
            } else if (query) {
                list = list.filter(f => {
                    const home = (f.home || '').toLowerCase();
                    const away = (f.away || '').toLowerCase();
                    const group = (f.group || '').toLowerCase();
                    const text = (f.status_text || '').toLowerCase();
                    return home.includes(query) || away.includes(query) || group.includes(query) || text.includes(query);
                });
            }
            
            const fixturesList = list.filter(f => f.status === 'upcoming' || f.status === 'live');
            const resultsList = list.filter(f => f.status === 'finished');
            
            renderUpcomingTable(fixturesList, 'upcoming-matches-body');
            renderUpcomingTable(resultsList, 'finished-matches-body');
            
            if (!window.selectedStatsMatch && fixturesList.length > 0) {
                const first = fixturesList[0];
                const matchId = \`\${first.home.toLowerCase().trim()}_vs_\${first.away.toLowerCase().trim()}\`.replace(/\\s+/g, '_');
                selectMatchForStats(first.home, first.away, matchId, first.status, first.score);
            }
        };`;

const originalRenderUpcomingTable = `        function renderUpcomingTable(upcomingList) {
            const upcomingBody = document.getElementById('upcoming-matches-body');
            if (!upcomingBody) return;
            
            upcomingBody.innerHTML = upcomingList.map(m => {
                const matchDate = new Date(m.time);
                // Format explicitly in Indian Standard Time (IST)
                const formattedTime = matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';
                const formattedDate = matchDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
                const probs = getWinProbability(m.home, m.away);
                const matchId = \`\${m.home.toLowerCase().trim()}_vs_\${m.away.toLowerCase().trim()}\`.replace(/\\s+/g, '_');
                
                const reminders = JSON.parse(localStorage.getItem('krynn_match_reminders') || '[]');
                const isReminded = reminders.includes(matchId);

                const homeLogo = m.home_logo && m.home_logo.startsWith('http') ? m.home_logo : getTeamFlagUrl(m.home);
                const awayLogo = m.away_logo && m.away_logo.startsWith('http') ? m.away_logo : getTeamFlagUrl(m.away);

                let scoreOrProbsHtml = '';
                if (m.score) {
                    scoreOrProbsHtml = \`
                        <div class="score-display-wrapper" style="text-align: center; background: rgba(0, 255, 0, 0.05); padding: 4px 12px; border-radius: 8px; border: 1px solid rgba(0, 255, 0, 0.15); display: inline-block;">
                            <span style="font-weight: 700; color: var(--green); letter-spacing: 1px; font-size: 10px;">✓ FINISHED</span>
                            <div style="font-size: 16px; font-weight: 800; color: #fff; margin-top: 2px;">\${m.score.homeScore} : \${m.score.awayScore}</div>
                        </div>
                    \`;
                } else {
                    scoreOrProbsHtml = \`
                        <div class="prob-labels">
                            <span class="home-win">Win: <strong class="lbl-home-win">\${probs.homeWin}%</strong></span>
                            <span>Draw: <strong class="lbl-draw-win">\${probs.draw}%</strong></span>
                            <span class="away-win">Win: <strong class="lbl-away-win">\${probs.awayWin}%</strong></span>
                        </div>
                        <div class="probability-bar-container">
                            <div class="prob-segment home" style="width: \${probs.homeWin}%">\${probs.homeWin}%</div>
                            <div class="prob-segment draw" style="width: \${probs.draw}%">\${probs.draw}%</div>
                            <div class="prob-segment away" style="width: \${probs.awayWin}%">\${probs.awayWin}%</div>
                        </div>
                    \`;
                }

                return \`
                    <tr class="upcoming-row" data-home="\${m.home}" data-away="\${m.away}" data-match-id="\${matchId}">
                        <td>
                            <div class="upcoming-match-info">
                                <span class="upcoming-comp">\${m.competition}</span>
                                <span class="upcoming-time"><i class="fa-regular fa-clock"></i> \${formattedDate} \${formattedTime}</span>
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-team-cell">
                                <img class="upcoming-team-logo" src="\${homeLogo}" onerror="this.src='krynn_logo.png'" alt="\${m.home} Logo" width="20" height="20" loading="lazy">
                                <span>\${m.home}</span>
                            </div>
                        </td>
                        <td class="win-chance-cell" style="text-align: center;">
                            \${scoreOrProbsHtml}
                        </td>
                        <td>
                            <div class="upcoming-team-cell" style="justify-content: flex-end; text-align: right;">
                                <span>\${m.away}</span>
                                <img class="upcoming-team-logo" src="\${awayLogo}" onerror="this.src='krynn_logo.png'" alt="\${m.away} Logo" width="20" height="20" loading="lazy">
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-actions" style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                                <button class="watch-btn \${isReminded ? 'notify-active' : ''}" 
                                        onclick="toggleMatchReminder('\${matchId}', '\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', event)" 
                                        style="font-size: 10px; padding: 5px 10px; border-radius: 12px; white-space: nowrap;"
                                        title="Toggle notification reminder">
                                    <i class="\${isReminded ? 'fa-solid fa-check' : 'fa-solid fa-bell'}"></i> \${isReminded ? 'Subscribed' : 'Notify'}
                                </button>
                                <div class="calendar-export-actions" style="display: flex; gap: 4px;">
                                    <button class="watch-btn" 
                                            onclick="exportToGoogleCalendar('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${m.time}', '\${m.status_text.replace(/'/g, "\\\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(66, 133, 244, 0.15); border-color: rgba(66, 133, 244, 0.4); color: #4285f4; cursor: pointer;"
                                            title="Add to Google Calendar">
                                        <i class="fa-brands fa-google"></i>
                                    </button>
                                    <button class="watch-btn" 
                                            onclick="exportToICS('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${m.time}', '\${m.status_text.replace(/'/g, "\\\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15); color: #fff; cursor: pointer;"
                                            title="Download ICS Calendar File">
                                        <i class="fa-regular fa-calendar-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                \`;
            }).join('');
        }`;

const replacementRenderUpcomingTable = `        function renderUpcomingTable(upcomingList, tbodyId = 'upcoming-matches-body') {
            const upcomingBody = document.getElementById(tbodyId);
            if (!upcomingBody) return;
            
            upcomingBody.innerHTML = upcomingList.map(m => {
                const matchDate = new Date(m.time);
                // Format explicitly in Indian Standard Time (IST)
                const formattedTime = matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';
                const formattedDate = matchDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
                const probs = getWinProbability(m.home, m.away);
                const matchId = \`\${m.home.toLowerCase().trim()}_vs_\${m.away.toLowerCase().trim()}\`.replace(/\\s+/g, '_');
                
                const reminders = JSON.parse(localStorage.getItem('krynn_match_reminders') || '[]');
                const isReminded = reminders.includes(matchId);

                const homeLogo = m.home_logo && m.home_logo.startsWith('http') ? m.home_logo : getTeamFlagUrl(m.home);
                const awayLogo = m.away_logo && m.away_logo.startsWith('http') ? m.away_logo : getTeamFlagUrl(m.away);

                let scoreOrProbsHtml = '';
                if (m.score) {
                    scoreOrProbsHtml = \`
                        <div class="score-display-wrapper" style="text-align: center; background: rgba(0, 255, 0, 0.05); padding: 4px 12px; border-radius: 8px; border: 1px solid rgba(0, 255, 0, 0.15); display: inline-block;">
                            <span style="font-weight: 700; color: var(--green); letter-spacing: 1px; font-size: 10px;">✓ FINISHED</span>
                            <div style="font-size: 16px; font-weight: 800; color: #fff; margin-top: 2px;">\${m.score.homeScore} : \${m.score.awayScore}</div>
                        </div>
                    \`;
                } else {
                    scoreOrProbsHtml = \`
                        <div class="prob-labels">
                            <span class="home-win">Win: <strong class="lbl-home-win">\${probs.homeWin}%</strong></span>
                            <span>Draw: <strong class="lbl-draw-win">\${probs.draw}%</strong></span>
                            <span class="away-win">Win: <strong class="lbl-away-win">\${probs.awayWin}%</strong></span>
                        </div>
                        <div class="probability-bar-container">
                            <div class="prob-segment home" style="width: \${probs.homeWin}%">\${probs.homeWin}%</div>
                            <div class="prob-segment draw" style="width: \${probs.draw}%">\${probs.draw}%</div>
                            <div class="prob-segment away" style="width: \${probs.awayWin}%">\${probs.awayWin}%</div>
                        </div>
                    \`;
                }

                const clickCall = \`selectMatchForStats('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${matchId}', '\${m.status}', \` + 
                                  (m.score ? JSON.stringify(m.score) : 'null') + \`)\`;

                return \`
                    <tr class="upcoming-row" data-home="\${m.home}" data-away="\${m.away}" data-match-id="\${matchId}" onclick="\${clickCall}" style="cursor: pointer;">
                        <td>
                            <div class="upcoming-match-info">
                                <span class="upcoming-comp">\${m.competition}</span>
                                <span class="upcoming-time"><i class="fa-regular fa-clock"></i> \${formattedDate} \${formattedTime}</span>
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-team-cell">
                                <img class="upcoming-team-logo" src="\${homeLogo}" onerror="this.src='krynn_logo.png'" alt="\${m.home} Logo" width="20" height="20" loading="lazy">
                                <span>\${m.home}</span>
                            </div>
                        </td>
                        <td class="win-chance-cell" style="text-align: center;">
                            \${scoreOrProbsHtml}
                        </td>
                        <td>
                            <div class="upcoming-team-cell" style="justify-content: flex-end; text-align: right;">
                                <span>\${m.away}</span>
                                <img class="upcoming-team-logo" src="\${awayLogo}" onerror="this.src='krynn_logo.png'" alt="\${m.away} Logo" width="20" height="20" loading="lazy">
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-actions" style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                                <button class="watch-btn \${isReminded ? 'notify-active' : ''}" 
                                        onclick="toggleMatchReminder('\${matchId}', '\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', event)" 
                                        style="font-size: 10px; padding: 5px 10px; border-radius: 12px; white-space: nowrap;"
                                        title="Toggle notification reminder">
                                    <i class="\${isReminded ? 'fa-solid fa-check' : 'fa-solid fa-bell'}"></i> \${isReminded ? 'Subscribed' : 'Notify'}
                                </button>
                                <div class="calendar-export-actions" style="display: flex; gap: 4px;">
                                    <button class="watch-btn" 
                                            onclick="exportToGoogleCalendar('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${m.time}', '\${m.status_text.replace(/'/g, "\\\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(66, 133, 244, 0.15); border-color: rgba(66, 133, 244, 0.4); color: #4285f4; cursor: pointer;"
                                            title="Add to Google Calendar">
                                        <i class="fa-brands fa-google"></i>
                                    </button>
                                    <button class="watch-btn" 
                                            onclick="exportToICS('\${m.home.replace(/'/g, "\\\\'")}', '\${m.away.replace(/'/g, "\\\\'")}', '\${m.time}', '\${m.status_text.replace(/'/g, "\\\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15); color: #fff; cursor: pointer;"
                                            title="Download ICS Calendar File">
                                        <i class="fa-regular fa-calendar-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                \`;
            }).join('');
        }`;

// 6. DOMContentLoaded additions (sparkline intervals, renderScorers, default tab initialization)
const originalDOMContentLoaded = `            fetchSportScoreMatches();
            // Refresh scores every 45 seconds
            setInterval(fetchSportScoreMatches, 45000);

            // Run initial channel health check
            checkChannelsHealth();
            // Refresh channel health status every 60 seconds
            setInterval(checkChannelsHealth, 60000);`;

const replacementDOMContentLoaded = `            fetchSportScoreMatches();
            // Refresh scores every 45 seconds
            setInterval(fetchSportScoreMatches, 45000);

            // Run initial channel health check
            checkChannelsHealth();
            // Refresh channel health status every 60 seconds
            setInterval(checkChannelsHealth, 60000);
            
            // Run stream latency sparkline update every 3 seconds
            updateSparkline();
            setInterval(updateSparkline, 3000);
            
            // Render tournament leaderboard top scorers
            renderScorers();
            
            // Highlight default tab 'fixtures' on page init
            switchCenterTab('fixtures');`;


// Execution of JS updates
// Inject tabSwitchingCode, sparklineCode, and matchAnalyticsCode near the start of the script, right after ActiveChannelIndex declaration or similar.
const marker = '        let activeChannelIndex = 0;';
const markerPos = html.indexOf(marker);
if (markerPos === -1) {
    console.error('Marker not found');
    process.exit(1);
}

const splitIdx = markerPos + marker.length;
html = html.substring(0, splitIdx) + "\n" + tabSwitchingCode + sparklineCode + matchAnalyticsCode + html.substring(splitIdx);

// Replace renderChannelList
if (!html.includes(originalChannelListRender)) {
    console.error('Original channel list render function not found');
    process.exit(1);
}
html = html.replace(originalChannelListRender, replacementChannelListRender);

// Replace filterUpcomingMatches
if (!html.includes(originalFilterMatches)) {
    console.error('Original filterMatches function not found');
    process.exit(1);
}
html = html.replace(originalFilterMatches, replacementFilterMatches);

// Replace renderUpcomingTable
if (!html.includes(originalRenderUpcomingTable)) {
    console.error('Original renderUpcomingTable function not found');
    process.exit(1);
}
html = html.replace(originalRenderUpcomingTable, replacementRenderUpcomingTable);

// Replace DOMContentLoaded parts
if (!html.includes(originalDOMContentLoaded)) {
    console.error('Original DOMContentLoaded events not found');
    process.exit(1);
}
html = html.replace(originalDOMContentLoaded, replacementDOMContentLoaded);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated JS behaviors!');
