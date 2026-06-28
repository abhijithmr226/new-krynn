(async function() {
    // Live Sports Streaming Feeds
    const channelsData = [
        {
            "name": "Russian",
            "logo": "https://flagcdn.com/w80/ru.png",
            "streamUrl": "https://live.666666.zip/migu/1.m3u8",
            "type": "hls",
            "language": "Russian",
            "quality": "Auto",
            "countryCode": "ru"
        },
        {
            "name": "Malayalam",
            "logo": "https://flagcdn.com/w80/in.png",
            "streamUrl": "https://lb.xyzcloud3.xyz/tsn1/index.m3u8",
            "type": "hls",
            "language": "Malayalam",
            "quality": "Auto",
            "countryCode": "in"
        },
        {
            "name": "beIN Sports",
            "logo": "https://logo.clearbit.com/beinsports.com",
            "streamUrl": "https://live2.eu-north-1b.cf.dmcdn.net/sec2(yhdBauxk4ZgvIOc3RwTKw9FLFziILjWhHBy3UIny2TdNFym_FkHPeyqa-TzcX2t4CI8z8fHT9mY0PgvhowuKwi1qP_MBkzygUyy-2jbQwzXM4qeDfzGT0_3qwzAslno7)/cloud/3/x9ko9z8/s/live-720.m3u8",
            "type": "hls",
            "language": "Arabic",
            "quality": "720p",
            "countryCode": "qa"
        },
        {
            "name": "Live Feed",
            "logo": "https://assets.football-logos.cc/logos/tournaments/1500x1500/fifa-world-cup-2026--white.10e0b37b.png",
            "streamUrl": "https://live05.meung.app/live/08552895.m3u8",
            "type": "hls",
            "language": "Multi",
            "quality": "HD",
            "countryCode": "us"
        },
        {
            "name": "Trece",
            "logo": "https://flagcdn.com/w80/ar.png",
            "streamUrl": "https://live2.eu-north-1a.cf.dmcdn.net/sec2(7iXlyRc12FpME8jBI2tZ5mujzJRuwHeHgcb1s50tkW19x6aJttJMVyAP30qwflUl0e2rPppO02xyL6ZFAU7vSr2AdyrtGcbmocXxeQxGjZt6GP1O6NxtMFYlFmmRve7P)/cloud/3/x9ksaba/s/live-720.m3u8",
            "type": "hls",
            "language": "Spanish",
            "quality": "720p",
            "countryCode": "ar"
        },
        {
            "name": "Koora",
            "logo": "https://flagcdn.com/w80/eg.png",
            "streamUrl": "https://ex.moorarts.xyz/diluoe1_720/index.m3u8",
            "type": "hls",
            "language": "Arabic",
            "quality": "720p",
            "countryCode": "eg"
        },
        {
            "name": "Zee Malayalam Alt",
            "logo": "https://flagcdn.com/w80/in.png",
            "streamUrl": "https://ts2.sptrack.cfd/hls/tist2.m3u8",
            "type": "hls",
            "language": "Malayalam",
            "quality": "Auto",
            "countryCode": "in"
        }
    ];

    let shakaPlayerInstance = null;
    let activeChannelIndex = 0;
    let channelFailoverCount = 0;
    let isSwitchingChannel = false;
    let channelsHealthStatus = {}; // { [streamUrl]: isOnline }

    // --- Shaka Player Initialization ---
    async function initShaka() {
        const video = document.getElementById('video');
        if (!video || !video['ui']) {
            console.warn('Shaka UI controls not fully loaded yet.');
            return;
        }
        
        const controls = video['ui'].getControls();
        shakaPlayerInstance = controls.getPlayer();

        // Style seekbar to match theme orange
        video['ui'].configure({
            seekBarColors: {
                base: 'rgba(255, 255, 255, 0.2)',
                buffered: 'rgba(255, 255, 255, 0.4)',
                played: 'rgb(255, 106, 0)',
            }
        });

        // Speed configurations and failover limits optimized for zero buffering
        shakaPlayerInstance.configure({
            streaming: {
                bufferingGoal: 10,
                rebufferingGoal: 2,
                bufferBehind: 5,
                jumpLargeGaps: true,
                stallEnabled: true,
                stallThreshold: 1.5,
                stallSkip: 0.1,
                retryParameters: {
                    maxAttempts: 5,
                    baseDelay: 1000,
                    backoffFactor: 2,
                    timeout: 20000
                },
                preferNativeHls: false
            }
        });

        // Error Handlers
        shakaPlayerInstance.addEventListener('error', (event) => {
            if (isSwitchingChannel) return;
            if (event.detail && event.detail.severity === 2) {
                if (event.detail.code === 1007) return; // ignore load interrupted
                console.error('Fatal Shaka error:', event.detail);
                tryNextChannelFailover();
            }
        });

        video.addEventListener('error', () => {
            if (isSwitchingChannel) return;
            if (video.error && (video.error.code === 2 || video.error.code === 3)) {
                console.error('Fatal video element error:', video.error);
                tryNextChannelFailover();
            }
        });

        video.addEventListener('playing', () => {
            channelFailoverCount = 0;
            isSwitchingChannel = false;
        });

        // Load channel grid and default stream
        renderChannelsGrid();
        selectChannel(0, false);
    }

    async function tryNextChannelFailover() {
        if (isSwitchingChannel) return;
        
        if (channelFailoverCount >= channelsData.length * 2) {
            console.error('All channels failed.');
            showPlayerError('All available broadcast feeds are currently experiencing connectivity issues.');
            channelFailoverCount = 0;
            isSwitchingChannel = false;
            return;
        }

        channelFailoverCount++;
        let nextIndex = (activeChannelIndex + 1) % channelsData.length;
        window.showToast(`Feed offline. Auto-switching to ${channelsData[nextIndex].name}...`, 'fa-circle-notch fa-spin');
        selectChannel(nextIndex, false);
    }

    window.selectChannel = async function(index, isManual = true) {
        isSwitchingChannel = true;
        if (isManual) {
            channelFailoverCount = 0;
        }
        activeChannelIndex = index;
        const channel = channelsData[index];
        if (!channel) return;

        // Hide error overlay
        const errorOverlay = document.getElementById('player-error-overlay');
        if (errorOverlay) errorOverlay.classList.remove('show');

        // Update active grid card
        document.querySelectorAll('.channel-card').forEach((card, idx) => {
            card.classList.toggle('active', idx === index);
        });

        // Set Now Playing title
        document.getElementById('now-playing-title').textContent = `${channel.name} — Live Feed`;

        const video = document.getElementById('video');
        const shakaContainer = document.getElementById('shaka-container');
        const iframeContainer = document.getElementById('iframe-container');
        const playerIframe = document.getElementById('player-iframe');

        let targetUrl = channel.streamUrl;
        let playType = channel.type;

        // Intercept dynamically scraped ok.ru streams
        if (channel.type === 'ok_direct') {
            try {
                const res = await fetch('/api/ok-stream');
                if (!res.ok) throw new Error(`Scraper returned HTTP status ${res.status}`);
                const data = await res.json();
                if (data.streamUrl) {
                    targetUrl = data.streamUrl;
                    playType = data.type;
                    console.log('Resolved direct OK.ru stream:', targetUrl);
                } else {
                    throw new Error('No streamUrl returned from scraper');
                }
            } catch (err) {
                console.warn('Scraper failed, falling back to ok.ru iframe embed:', err);
                targetUrl = channel.streamUrl;
                playType = 'iframe';
            }
        }

        if (playType === 'iframe') {
            if (video) video.pause();
            if (shakaPlayerInstance) await shakaPlayerInstance.unload().catch(() => {});
            
            if (shakaContainer) shakaContainer.style.display = 'none';
            if (iframeContainer) iframeContainer.style.display = 'block';
            if (playerIframe) playerIframe.src = targetUrl;
            isSwitchingChannel = false;
        } else {
            if (playerIframe) playerIframe.src = 'about:blank';
            if (iframeContainer) iframeContainer.style.display = 'none';
            if (shakaContainer) shakaContainer.style.display = 'block';

            if (!shakaPlayerInstance) {
                isSwitchingChannel = false;
                return;
            }

            try {
                // Reset ClearKey DRM config
                shakaPlayerInstance.configure({
                    drm: {
                        clearKeys: {}
                    }
                });

                // Extract ClearKey DRM credentials from URL parameters if present
                try {
                    const urlObj = new URL(targetUrl);
                    const ckParam = urlObj.searchParams.get('ck');
                    if (ckParam) {
                        const parts = ckParam.split(':');
                        if (parts.length === 2) {
                            shakaPlayerInstance.configure({
                                drm: {
                                    clearKeys: {
                                        [parts[0]]: parts[1]
                                    }
                                }
                            });
                            console.log('Configured ClearKey DRM keys: ID=' + parts[0] + ', KEY=' + parts[1]);
                        }
                    }
                } catch (drmErr) {
                    console.warn('No inline DRM configuration parsed:', drmErr.message);
                }

                let mimeType = null;
                if (playType === 'hls' || targetUrl.includes('.m3u8')) {
                    mimeType = 'application/x-mpegurl';
                } else if (playType === 'dash' || targetUrl.includes('.mpd')) {
                    if (targetUrl.includes('pages.dev') || targetUrl.includes('infalliblevmerkle')) {
                        mimeType = 'application/x-mpegurl';
                    } else {
                        mimeType = 'application/dash+xml';
                    }
                }

                await shakaPlayerInstance.load(targetUrl, null, mimeType);
                video.muted = false;
                await video.play().catch(e => console.log('Autoplay deferred:', e));
                isSwitchingChannel = false;
            } catch (error) {
                console.error('Shaka load error:', error);
                isSwitchingChannel = false;
                tryNextChannelFailover();
            }
        }
    };

    window.playNextChannel = function() {
        const nextIndex = (activeChannelIndex + 1) % channelsData.length;
        selectChannel(nextIndex);
        window.showToast(`Switched to ${channelsData[nextIndex].name}`);
    };

    window.playPrevChannel = function() {
        const prevIndex = (activeChannelIndex - 1 + channelsData.length) % channelsData.length;
        selectChannel(prevIndex);
        window.showToast(`Switched to ${channelsData[prevIndex].name}`);
    };

    window.retryActiveChannel = function() {
        const errorOverlay = document.getElementById('player-error-overlay');
        if (errorOverlay) errorOverlay.classList.remove('show');
        selectChannel(activeChannelIndex);
    };

    function showPlayerError(msg) {
        const overlay = document.getElementById('player-error-overlay');
        const msgEl = document.getElementById('player-error-msg');
        if (overlay && msgEl) {
            msgEl.textContent = msg;
            overlay.classList.add('show');
        }
    }

    // --- Channel Grid Renderer ---
    function renderChannelsGrid() {
        const grid = document.getElementById('channels-grid');
        if (!grid) return;
        grid.innerHTML = '';

        channelsData.forEach((channel, index) => {
            const card = document.createElement('div');
            card.className = `channel-card ${index === activeChannelIndex ? 'active' : ''}`;
            
            const isOnline = channelsHealthStatus[channel.streamUrl] !== false;
            const statusLabel = isOnline ? 'ONLINE' : 'CHECKING';
            const statusClass = isOnline ? 'online' : 'checking';
            
            const flagUrl = `https://flagcdn.com/w40/${channel.countryCode}.png`;
            
            card.innerHTML = `
                <div class="channel-card-top">
                    <img class="channel-flag" src="${flagUrl}" alt="${channel.countryCode} Flag" width="18" height="12" onerror="this.style.display='none'">
                    <span class="channel-quality-badge">${channel.quality}</span>
                </div>
                <div class="channel-card-body">
                    <span class="channel-name-txt">${channel.name}</span>
                    <span class="channel-lang-badge">${channel.language}</span>
                </div>
                <div class="channel-card-bottom">
                    <span class="channel-status-dot ${statusClass}"></span>
                    <span class="channel-status-text">${statusLabel}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                selectChannel(index);
                document.getElementById('video-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            grid.appendChild(card);
        });
    }

    // --- Channel Health Check ---
    async function checkChannelsHealth() {
        try {
            const urls = channelsData.map(c => c.streamUrl);
            const res = await fetch('/api/health-check-urls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls })
            });
            if (!res.ok) return;
            const data = await res.json();
            const healthMap = data.health || {};
            
            channelsData.forEach(channel => {
                const status = healthMap[channel.streamUrl];
                channelsHealthStatus[channel.streamUrl] = (status >= 200 && status < 400);
            });
            
            renderChannelsGrid();
        } catch (err) {
            console.warn('Health check failed:', err);
        }
    }

    // --- SportScore API Scoreboard Ticker ---
    const COUNTRY_CODES = {
        'argentina': 'ar', 'australia': 'au', 'belgium': 'be', 'brazil': 'br',
        'canada': 'ca', 'croatia': 'hr', 'ecuador': 'ec', 'england': 'gb-eng',
        'france': 'fr', 'germany': 'de', 'iran': 'ir', 'japan': 'jp',
        'mexico': 'mx', 'morocco': 'ma', 'netherlands': 'nl', 'portugal': 'pt',
        'saudi arabia': 'sa', 'senegal': 'sn', 'spain': 'es', 'switzerland': 'ch',
        'united states': 'us', 'usa': 'us', 'uruguay': 'uy', 'south korea': 'kr',
        'turkiye': 'tr'
    };

    function cleanName(name) {
        if (!name) return '';
        let n = name.toLowerCase().trim();
        if (n === 'usa') return 'united states';
        return n;
    }

    function getTeamFlagUrl(teamName) {
        const clean = cleanName(teamName);
        const code = COUNTRY_CODES[clean];
        return code ? `https://flagcdn.com/w40/${code}.png` : 'krynn_logo.png';
    }

    function getTeamAbbreviation(name) {
        if (!name) return '—';
        if (name.length <= 3) return name.toUpperCase();
        return name.substring(0, 3).toUpperCase();
    }

    async function fetchFixtures() {
        const wrapper = document.getElementById('ticker-wrapper');
        try {
            const res = await fetch('/api/worldcup/fixtures');
            if (!res.ok) throw new Error();
            const data = await res.json();
            
            if (data && data.fixtures && data.fixtures.length > 0) {
                renderScoreTicker(data.fixtures);
            } else {
                renderFallbackTicker();
            }
        } catch (err) {
            renderFallbackTicker();
        }
    }

    function renderScoreTicker(fixtures) {
        const wrapper = document.getElementById('ticker-wrapper');
        if (!wrapper) return;

        const now = Date.now();

        // Show live first, then upcoming, then recently finished — max 20 items
        const sorted = [...fixtures].sort((a, b) => {
            const priority = { live: 0, upcoming: 1, finished: 2 };
            const ap = priority[a.status] ?? 3;
            const bp = priority[b.status] ?? 3;
            if (ap !== bp) return ap - bp;
            const aMs = new Date(a.kickoffUtc || 0).getTime();
            const bMs = new Date(b.kickoffUtc || 0).getTime();
            if (a.status === 'finished') return bMs - aMs;
            return aMs - bMs;
        });

        let itemsHtml = '';
        sorted.slice(0, 20).forEach(f => {
            // Determine match state from server-provided status or score
            const status = f.status || (f.score ? (f.score.finished ? 'finished' : 'live') : 'upcoming');
            const isLive = status === 'live';
            const isFinished = status === 'finished';

            let statusBadge = '';
            let scoreStr = '';

            if (isLive) {
                const minStr = (f.elapsedMin != null) ? `${f.elapsedMin}'` : 'LIVE';
                statusBadge = `<span class="ticker-badge live"><span class="live-min-blink">●</span> ${minStr}</span>`;
                const hs = (f.score && f.score.homeScore != null) ? f.score.homeScore : 0;
                const as_ = (f.score && f.score.awayScore != null) ? f.score.awayScore : 0;
                scoreStr = `<span class="ticker-score">${hs} - ${as_}</span>`;
            } else if (isFinished) {
                statusBadge = '<span class="ticker-badge finished">FT</span>';
                if (f.score && f.score.homeScore != null) {
                    scoreStr = `<span class="ticker-score">${f.score.homeScore} - ${f.score.awayScore}</span>`;
                } else {
                    scoreStr = '<span class="ticker-vs">vs</span>';
                }
            } else {
                // Upcoming — show kickoff time in user's local timezone + date if not today
                statusBadge = '<span class="ticker-badge upcoming">K.O</span>';
                if (f.kickoffUtc) {
                    const kickoffDate = new Date(f.kickoffUtc);
                    const todayMidnight = new Date();
                    todayMidnight.setHours(0, 0, 0, 0);
                    const tomorrowMidnight = new Date(todayMidnight.getTime() + 86400000);

                    const timeStr = kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    let prefix = '';
                    if (kickoffDate >= tomorrowMidnight) {
                        // Show day abbreviation for future matches
                        prefix = kickoffDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ';
                    }
                    scoreStr = `<span class="ticker-time">${prefix}${timeStr}</span>`;
                } else {
                    scoreStr = '<span class="ticker-vs">TBD</span>';
                }
            }

            const homeFlag = getTeamFlagUrl(f.homeTeam);
            const awayFlag = getTeamFlagUrl(f.awayTeam);
            const groupTag = f.group ? `<span class="ticker-group">${f.group}</span>` : '';

            itemsHtml += `
                <div class="ticker-item">
                    ${groupTag}
                    ${statusBadge}
                    <img src="${homeFlag}" class="ticker-flag" alt="" onerror="this.src='krynn_logo.png'">
                    <span class="ticker-team">${getTeamAbbreviation(f.homeTeam)}</span>
                    ${scoreStr}
                    <span class="ticker-team">${getTeamAbbreviation(f.awayTeam)}</span>
                    <img src="${awayFlag}" class="ticker-flag" alt="" onerror="this.src='krynn_logo.png'">
                </div>
                <div class="ticker-divider"></div>
            `;
        });

        wrapper.innerHTML = itemsHtml + itemsHtml; // duplicate for infinite loop scrolling
    }

    function renderFallbackTicker() {
        const wrapper = document.getElementById('ticker-wrapper');
        if (!wrapper) return;
        
        // Mock some World Cup matches as a fallback ticker
        const fallback = [
            { homeTeam: "Argentina", awayTeam: "France", status: "finished", homeScore: 3, awayScore: 3 },
            { homeTeam: "United States", awayTeam: "Mexico", status: "live", homeScore: 2, awayScore: 1 },
            { homeTeam: "Brazil", awayTeam: "Germany", status: "upcoming", kickoffUtc: new Date(Date.now() + 7200000).toISOString() }
        ];

        let itemsHtml = '';
        fallback.forEach(f => {
            let statusBadge = '';
            let scoreStr = 'vs';
            if (f.status === 'live') {
                statusBadge = '<span class="ticker-badge live">LIVE</span>';
                scoreStr = `<span class="ticker-score">${f.homeScore} - ${f.awayScore}</span>`;
            } else if (f.status === 'finished') {
                statusBadge = '<span class="ticker-badge finished">FT</span>';
                scoreStr = `<span class="ticker-score">${f.homeScore} - ${f.awayScore}</span>`;
            } else {
                statusBadge = '<span class="ticker-badge upcoming">K.O</span>';
                const time = new Date(f.kickoffUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                scoreStr = `<span class="ticker-time">${time}</span>`;
            }

            itemsHtml += `
                <div class="ticker-item">
                    ${statusBadge}
                    <img src="${getTeamFlagUrl(f.homeTeam)}" class="ticker-flag" alt="" onerror="this.src='krynn_logo.png'">
                    <span class="ticker-team">${getTeamAbbreviation(f.homeTeam)}</span>
                    ${scoreStr}
                    <span class="ticker-team">${getTeamAbbreviation(f.awayTeam)}</span>
                    <img src="${getTeamFlagUrl(f.awayTeam)}" class="ticker-flag" alt="" onerror="this.src='krynn_logo.png'">
                </div>
                <div class="ticker-divider"></div>
            `;
        });

        wrapper.innerHTML = itemsHtml + itemsHtml;
    }

    window.scrollTickerRight = function() {
        const container = document.getElementById('score-ticker-wrapper-scroll');
        if (container) {
            container.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // --- Live Viewer Count ---
    function initViewerCount() {
        const countEl = document.getElementById('viewer-count');
        if (!countEl) return;

        function animateCount(newVal) {
            countEl.textContent = Number(newVal).toLocaleString();
        }

        if (typeof EventSource !== 'undefined') {
            const sse = new EventSource('/api/viewer-stream');
            sse.addEventListener('count', e => {
                try { animateCount(parseInt(JSON.parse(e.data).count)); } catch(_) {}
            });
            sse.onerror = () => {
                sse.close();
                pollViewerCount();
            };
        } else {
            pollViewerCount();
        }

        function pollViewerCount() {
            async function tick() {
                try {
                    const r = await fetch('/api/viewer-count');
                    const d = await r.json();
                    if (d.count !== undefined) animateCount(d.count);
                } catch(_) {}
            }
            tick();
            setInterval(tick, 20000);
        }
    }

    // --- Share Button ---
    window.shareStream = async function() {
        const title = document.getElementById('now-playing-title')?.textContent || 'KRYNN SPORTS';
        const shareData = {
            title: 'Watch Live on KRYNN SPORTS 🏆',
            text: `${title} — Watch World Cup live streams for free!`,
            url: window.location.origin
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                window.showToast('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.origin);
                    window.showToast('Link copied to clipboard!');
                } catch (_) {
                    window.showToast('Share link: ' + window.location.origin, 'fa-share-nodes');
                }
            }
        }
    };

    window.showToast = function(msg, iconClass = 'fa-check') {
        const toast = document.getElementById('share-toast');
        if (!toast) return;
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> ` + msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // --- Event Listeners and Initializers ---
    document.addEventListener('DOMContentLoaded', () => {
        // Prevent click jacking ads on video frame
        const frame = document.getElementById('player-frame');
        if (frame) {
            ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(type => {
                frame.addEventListener(type, (e) => e.stopPropagation());
            });
        }

        // Shortcuts (Left/Right arrow, 1-9 numbers)
        document.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key.toLowerCase() === 'n') {
                e.preventDefault();
                playNextChannel();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'p') {
                e.preventDefault();
                playPrevChannel();
            } else if (e.key >= '1' && e.key <= '9') {
                const idx = parseInt(e.key) - 1;
                if (idx < channelsData.length) {
                    e.preventDefault();
                    selectChannel(idx);
                }
            }
        });

        // Initialize features
        fetchFixtures();
        setInterval(fetchFixtures, 20000); // refresh every 20s for near-realtime scores

        checkChannelsHealth();
        setInterval(checkChannelsHealth, 60000);

        initViewerCount();
        
        // PWA Service Worker Registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js?v=22')
                .then(reg => reg.update())
                .catch(err => console.warn('SW registration failed:', err));
        }
    });

    // Shaka load hook
    document.addEventListener('shaka-ui-loaded', initShaka);
    if (window.shaka && window.shaka.Player) {
        setTimeout(() => {
            if (!shakaPlayerInstance) initShaka();
        }, 500);
    }
})();