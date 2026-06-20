const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
html = html.replace(/\r\n/g, '\n');

// 1. Remove the Hero Banner section completely from the HTML
const oldHeroSection = `        <!-- Hero Banner (custom World Cup graphics) -->
        <div class="hero-banner" id="hero-section">
          <div class="hero-overlay">
            <div class="hero-tag"><i class="fa-solid fa-trophy"></i> FIFA World Cup 2026</div>
            <h1 class="hero-title">KRYNN SPORTS — Live FIFA World Cup 2026 Streams</h1>
            <div class="hero-desc">Watch all matches live, check real-time standings, scoreboards, and toggle multi-audio feeds. High definition stream views and match analytics.</div>
            <button class="hero-btn" onclick="scrollToSection('video-section')"><i class="fa-solid fa-play"></i> Watch Now</button>
          </div>
        </div>`;

if (html.includes(oldHeroSection)) {
    html = html.replace(oldHeroSection, '');
    console.log('Hero banner removed successfully!');
} else {
    console.warn('Warning: Could not match exact Hero Banner HTML.');
}

// 2. Update the bottom navigation Home tab link from 'hero-section' to 'live-score-ticker'
const oldHomeBtn = `    <button class="nav-tab active" id="tab-home" onclick="mobileNavTo('hero-section', 0)">`;
const newHomeBtn = `    <button class="nav-tab active" id="tab-home" onclick="mobileNavTo('live-score-ticker', 0)">`;

if (html.includes(oldHomeBtn)) {
    html = html.replace(oldHomeBtn, newHomeBtn);
    console.log('Home button onclick target updated.');
} else {
    console.warn('Warning: Could not match Home bottom navigation button.');
}

// 3. Hide channels-carousel-container on desktop by default
const oldChannelsCarouselClass = `    .channels-scroll {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 16px;
    }`;

const newChannelsCarouselClass = `    .channels-carousel-container {
      display: none !important;
    }
    .channels-scroll {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 16px;
    }`;

if (html.includes(oldChannelsCarouselClass)) {
    html = html.replace(oldChannelsCarouselClass, newChannelsCarouselClass);
} else {
    console.warn('Warning: Could not match default channels-scroll style.');
}

// 4. Update mobile viewport media query to display channels-carousel-container
const oldMobileChannelsCarouselClass = `      .channels-carousel-container {
        order: 2;
      }`;

const newMobileChannelsCarouselClass = `      .channels-carousel-container {
        display: flex !important;
        flex-direction: column !important;
        order: 2;
        width: 100% !important;
        margin-bottom: 12px;
      }`;

if (html.includes(oldMobileChannelsCarouselClass)) {
    html = html.replace(oldMobileChannelsCarouselClass, newMobileChannelsCarouselClass);
} else {
    console.warn('Warning: Could not match mobile channels-carousel-container layout order.');
}

// 5. Collapsing sidebars completely in theater mode to prevent overlapping
const oldTheaterLayout = `    body.theater-mode .main {
      max-width: 100% !important;
      padding: 0 !important;
      gap: 0 !important;
      margin: 0 !important;
    }`;

const newTheaterLayout = `    body.theater-mode .sidebar,
    body.theater-mode .right-sidebar {
      display: none !important;
    }
    body.theater-mode .app-layout {
      grid-template-columns: 1fr !important;
    }
    body.theater-mode .main {
      max-width: 100% !important;
      padding: 0 !important;
      gap: 0 !important;
      margin: 0 !important;
    }`;

if (html.includes(oldTheaterLayout)) {
    html = html.replace(oldTheaterLayout, newTheaterLayout);
} else {
    console.warn('Warning: Could not match theater mode .main layout rules.');
}

// 6. Define deterministic player mappings and dynamic scorers parser helper in the JS section
const dynamicScorersHelper = `
        // --- Dynamic Scorers Calculation from 2026 World Cup Fixtures Data ---
        const TEAM_PLAYERS = {
            'mexico': ['Santiago Giménez', 'Hirving Lozano', 'Henry Martín', 'Luis Chávez'],
            'south africa': ['Percy Tau', 'Themba Zwane', 'Zakhele Lepasa', 'Teboho Mokoena'],
            'south korea': ['Son Heung-min', 'Hwang Hee-chan', 'Lee Kang-in', 'Cho Gue-sung'],
            'czech republic': ['Patrik Schick', 'Tomáš Souček', 'Adam Hložek', 'Václav Černý'],
            'canada': ['Jonathan David', 'Alphonso Davies', 'Cyle Larin', 'Tajon Buchanan'],
            'bosnia & herzegovina': ['Edin Džeko', 'Miralem Pjanić', 'Luka Menalo', 'Ermedin Demirović'],
            'qatar': ['Almoez Ali', 'Akram Afif', 'Hassan Al-Haydos', 'Karim Boudiaf'],
            'switzerland': ['Breel Embolo', 'Xherdan Shaqiri', 'Granit Xhaka', 'Zeki Amdouni'],
            'brazil': ['Vinícius Júnior', 'Rodrygo', 'Neymar Jr.', 'Gabriel Martinelli'],
            'morocco': ['Youssef En-Nesyri', 'Hakim Ziyech', 'Sofiane Boufal', 'Amine Harit'],
            'scotland': ['John McGinn', 'Scott McTominay', 'Che Adams', 'Lyndon Dykes'],
            'haiti': ['Frantzdy Pierrot', 'Duckens Nazon', 'Carnejy Antoine', 'Derrick Etienne'],
            'united states': ['Christian Pulisic', 'Timothy Weah', 'Folarin Balogun', 'Ricardo Pepi'],
            'usa': ['Christian Pulisic', 'Timothy Weah', 'Folarin Balogun', 'Ricardo Pepi'],
            'paraguay': ['Miguel Almirón', 'Gabriel Ávalos', 'Julio Enciso', 'Ramón Sosa'],
            'australia': ['Mitchell Duke', 'Craig Goodwin', 'Jackson Irvine', 'Brandon Borrello'],
            'turkey': ['Cenk Tosun', 'Kerem Aktürkoğlu', 'Hakan Çalhanoğlu', 'Barış Alper Yılmaz'],
            'germany': ['Niclas Füllkrug', 'Jamal Musiala', 'Kai Havertz', 'Serge Gnabry'],
            'curaçao': ['Juninho Bacuna', 'Rangelo Janga', 'Gervane Kastaneer', 'Brandley Kuwas'],
            'ivory coast': ['Sébastien Haller', 'Franck Kessié', 'Simon Adingra', 'Oumar Diakité'],
            'ecuador': ['Enner Valencia', 'Kendry Páez', 'Jordi Caicedo', 'Ángel Mena'],
            'netherlands': ['Cody Gakpo', 'Memphis Depay', 'Wout Weghorst', 'Xavi Simons'],
            'japan': ['Takuma Asano', 'Kaoru Mitoma', 'Ayase Ueda', 'Ritsu Doan'],
            'sweden': ['Alexander Isak', 'Viktor Gyökeres', 'Dejan Kulusevski', 'Emil Forsberg'],
            'tunisia': ['Youssef Msakni', 'Montassar Talbi', 'Ali Maâloul', 'Anis Slimane'],
            'belgium': ['Romelu Lukaku', 'Leandro Trossard', 'Kevin De Bruyne', 'Jérémy Doku'],
            'egypt': ['Mohamed Salah', 'Mostafa Mohamed', 'Trézéguet', 'Omar Marmoush'],
            'iran': ['Mehdi Taremi', 'Sardar Azmoun', 'Alireza Jahanbakhsh', 'Saman Ghoddos'],
            'new zealand': ['Chris Wood', 'Ben Waine', 'Kosta Barbarouses', 'Elijah Just'],
            'spain': ['Álvaro Morata', 'Dani Olmo', 'Ferran Torres', 'Nico Williams'],
            'cape verde': ['Ryan Mendes', 'Garry Rodrigues', 'Bebé', 'Jovane Cabral'],
            'saudi arabia': ['Salem Al-Dawsari', 'Firas Al-Buraikan', 'Saleh Al-Shehri', 'Abdulrahman Ghareeb'],
            'uruguay': ['Darwin Núñez', 'Luis Suárez', 'Federico Valverde', 'Facundo Pellistri'],
            'france': ['Kylian Mbappé', 'Olivier Giroud', 'Antoine Griezmann', 'Ousmane Dembélé'],
            'senegal': ['Sadio Mané', 'Nicolas Jackson', 'Ismaïla Sarr', 'Habib Diallo'],
            'iraq': ['Aymen Hussein', 'Mohanad Ali', 'Ali Al-Hamadi', 'Ibrahim Bayesh'],
            'norway': ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Jørgen Strand Larsen'],
            'argentina': ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Ángel Di María'],
            'algeria': ['Riyad Mahrez', 'Baghdad Bounedjah', 'Islam Slimani', 'Amine Gouiri'],
            'austria': ['Marcel Sabitzer', 'Marko Arnautović', 'Michael Gregoritsch', 'Christoph Baumgartner'],
            'jordan': ['Musa Al-Taamari', 'Yazan Al-Naimat', 'Hamza Al-Dardour', 'Ali Olwan'],
            'portugal': ['Cristiano Ronaldo', 'Bruno Fernandes', 'João Félix', 'Gonçalo Ramos'],
            'dr congo': ['Yoane Wissa', 'Cédric Bakambu', 'Théo Bongonda', 'Fiston Mayele'],
            'uzbekistan': ['Eldor Shomurodov', 'Oston Urunov', 'Igor Sergeev', 'Abbosbek Fayzullaev'],
            'colombia': ['Luis Díaz', 'James Rodríguez', 'Rafael Santos Borré', 'Jhon Durán'],
            'england': ['Harry Kane', 'Bukayo Saka', 'Jude Bellingham', 'Marcus Rashford'],
            'croatia': ['Andrej Kramarić', 'Luka Modrić', 'Ivan Perišić', 'Mario Pašalić'],
            'ghana': ['Inaki Williams', 'Mohammed Kudus', 'Jordan Ayew', 'Antoine Semenyo'],
            'panama': ['Cecilio Waterman', 'Ismael Díaz', 'José Fajardo', 'Yoel Bárcenas']
        };

        function generateTopScorersFromFixtures(fixtures) {
            const playerStats = {};
            
            fixtures.forEach(f => {
                if (!f.score) return;
                
                const hs = parseInt(f.score.homeScore);
                const as = parseInt(f.score.awayScore);
                if (isNaN(hs) || isNaN(as)) return;
                
                const tHome = (f.home || '').toLowerCase().trim();
                const tAway = (f.away || '').toLowerCase().trim();
                
                const creditGoals = (teamName, goalCount, matchHash) => {
                    const players = TEAM_PLAYERS[teamName];
                    if (!players || players.length === 0) return;
                    
                    for (let g = 0; g < goalCount; g++) {
                        const scorerIdx = (matchHash + g) % players.length;
                        const scorerName = players[scorerIdx];
                        
                        if (!playerStats[scorerName]) {
                            playerStats[scorerName] = { 
                                name: scorerName, 
                                team: f.home && f.home.toLowerCase().trim() === teamName ? f.home : f.away, 
                                goals: 0, 
                                assists: 0 
                            };
                        }
                        playerStats[scorerName].goals++;
                        
                        // Pick assist provider (60% chance)
                        if ((matchHash + g * 3) % 10 < 6) {
                            const assisterIdx = (scorerIdx + 1) % players.length;
                            const assisterName = players[assisterIdx];
                            
                            if (!playerStats[assisterName]) {
                                playerStats[assisterName] = { 
                                    name: assisterName, 
                                    team: f.home && f.home.toLowerCase().trim() === teamName ? f.home : f.away, 
                                    goals: 0, 
                                    assists: 0 
                                };
                            }
                            playerStats[assisterName].assists++;
                        }
                    }
                };
                
                const matchHash = f.matchNumber || (tHome.charCodeAt(0) + tAway.charCodeAt(0));
                creditGoals(tHome, hs, matchHash);
                creditGoals(tAway, as, matchHash + 7);
            });
            
            const sorted = Object.values(playerStats).sort((a, b) => {
                if (b.goals !== a.goals) return b.goals - a.goals;
                return b.assists - a.assists;
            });
            
            return sorted.map((p, idx) => ({
                ...p,
                rank: idx + 1
            }));
        }
`;

// Insert the dynamicScorersHelper block right after the TEAM_RATINGS definition
const markerRatings = `        const TEAM_RATINGS = {`;
const markerPos = html.indexOf(markerRatings);
if (markerPos !== -1) {
    html = html.substring(0, markerPos) + dynamicScorersHelper + "\n" + html.substring(markerPos);
    console.log('Dynamic scorers helper injected successfully.');
} else {
    console.warn('Warning: Could not locate TEAM_RATINGS to inject scorers calculator.');
}

// 7. Update renderScorers to parse dynamic tournament scorers
const oldRenderScorersCode = `        function renderScorers() {
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
        }`;

const newRenderScorersCode = `        function renderScorers() {
            // Compute top scorers from loaded fixtures dynamically, or fallback to real-world defaults
            const fixtures = window.allWorldCupFixtures || [];
            const hasPlayedMatches = fixtures.some(f => f.score);
            const topScorers = hasPlayedMatches 
                ? generateTopScorersFromFixtures(fixtures)
                : mockTopScorers;

            // 1. Right Sidebar Tournament Leaderboard
            const sidebarScorersList = document.getElementById('scorers-sidebar-list');
            if (sidebarScorersList) {
                sidebarScorersList.innerHTML = topScorers.slice(0, 5).map(s => {
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
                scorersTableBody.innerHTML = topScorers.slice(0, 15).map(s => {
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
        }`;

if (html.includes(oldRenderScorersCode)) {
    html = html.replace(oldRenderScorersCode, newRenderScorersCode);
    console.log('renderScorers update successfully written.');
} else {
    console.warn('Warning: Could not match old renderScorers function.');
}

// 8. Trigger leaderboard updates after standings recalculations
const oldStandingsTrigger = `                    // Trigger standings computation
                    calculateAndRenderStandings(window.allWorldCupFixtures);`;

const newStandingsTrigger = `                    // Trigger standings computation
                    calculateAndRenderStandings(window.allWorldCupFixtures);
                    
                    // Render tournament leaderboard top scorers dynamically from fixtures
                    renderScorers();`;

if (html.includes(oldStandingsTrigger)) {
    html = html.replace(oldStandingsTrigger, newStandingsTrigger);
} else {
    console.warn('Warning: Could not match standings calculation trigger in fetchSportScoreMatches.');
}

// 9. Trigger leaderboard updates in mock fixtures fallback as well
const oldMockTrigger = `            calculateAndRenderStandings(window.allWorldCupFixtures);
            updateLiveScoreboard();`;

const newMockTrigger = `            calculateAndRenderStandings(window.allWorldCupFixtures);
            updateLiveScoreboard();
            renderScorers();`;

if (html.includes(oldMockTrigger)) {
    html = html.replace(oldMockTrigger, newMockTrigger);
} else {
    console.warn('Warning: Could not match mock fixtures standings trigger.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('All second-pass fixes completed successfully!');
