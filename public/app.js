(async function() {
    // Live Sports Streaming Feeds
    const channelsData = [
        {
            "name": "DSport",
            "logo": "https://logo.clearbit.com/dsports.in",
            "streamUrl": "http://190.108.83.69:8000/play/a05w/index.m3u8",
            "type": "hls",
            "language": "English",
            "quality": "Auto",
            "countryCode": "in"
        },
        {
            "name": "Caze TV",
            "logo": "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/logo.png",
            "streamUrl": "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8",
            "type": "hls",
            "language": "Portuguese",
            "quality": "Auto",
            "countryCode": "br"
        },
        {
            "name": "beIN Sports USA",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/BeIN_Sports_logo_%28vertical_version%29.svg/500px-BeIN_Sports_logo_%28vertical_version%29.svg.png",
            "streamUrl": "http://23.237.104.106:8080/USA_BEIN/index.m3u8",
            "type": "hls",
            "language": "English",
            "quality": "720p",
            "countryCode": "us"
        },
        {
            "name": "beIN Sports XTRA",
            "logo": "https://i.ibb.co/HT49GPmB/XTRA-2.png",
            "streamUrl": "https://bein-xtra-bein.amagi.tv/playlist.m3u8",
            "type": "hls",
            "language": "English",
            "quality": "1080p",
            "countryCode": "us"
        },
        {
            "name": "CBS Sports Golazo",
            "logo": "https://i.imgur.com/eMjutHS.png",
            "streamUrl": "https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8",
            "type": "hls",
            "language": "English",
            "quality": "720p",
            "countryCode": "us"
        },
        {
            "name": "DD Sports",
            "logo": "https://dtil.tmsimg.com/assets/s158255_ld_h15_aa.png?lock=720x540",
            "streamUrl": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8",
            "type": "hls",
            "language": "Hindi",
            "quality": "1080p",
            "countryCode": "in"
        },
        {
            "name": "ESPN8 The Ocho",
            "logo": "https://images.fubo.tv/channel-config-ui/station-logos/on-dark/espn_8_the_ocho_bw.png",
            "streamUrl": "https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8",
            "type": "hls",
            "language": "English",
            "quality": "1080p",
            "countryCode": "us"
        },
        {
            "name": "ESPN Deportes",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/ESPN_Deportes.svg/960px-ESPN_Deportes.svg.png",
            "streamUrl": "http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8",
            "type": "hls",
            "language": "Spanish",
            "quality": "360p",
            "countryCode": "us"
        },
        {
            "name": "NBC Sports NOW",
            "logo": "https://i.imgur.com/EzNf2Yx.png",
            "streamUrl": "https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8?ads.xumo_channelId=99993008",
            "type": "hls",
            "language": "English",
            "quality": "1080p",
            "countryCode": "us"
        },
        {
            "name": "KSA Sports 1",
            "logo": "https://i.imgur.com/ONKNOAp.png",
            "streamUrl": "https://aloula-redirect.vercel.app/9/playlist.m3u8",
            "type": "hls",
            "language": "Arabic",
            "quality": "1080p",
            "countryCode": "sa"
        },
        {
            "name": "KSA Sports 2",
            "logo": "https://i.imgur.com/v8ULLqg.png",
            "streamUrl": "https://aloula-redirect.vercel.app/10/playlist.m3u8",
            "type": "hls",
            "language": "Arabic",
            "quality": "1080p",
            "countryCode": "sa"
        },
        {
            "name": "Malayalam Feed",
            "logo": "https://assets.football-logos.cc/logos/tournaments/1500x1500/fifa-world-cup-2026--white.10e0b37b.png",
            "streamUrl": "https://ok.ru/videoembed/15500349283864?nochat=1&autoplay=1",
            "type": "iframe",
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

        // Speed configurations and failover limits
        shakaPlayerInstance.configure({
            streaming: {
                bufferingGoal: 15,
                rebufferingGoal: 2,
                bufferBehind: 10,
                retryParameters: {
                    maxAttempts: 4,
                    baseDelay: 500,
                    backoffFactor: 1.5,
                    timeout: 10000
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
                await shakaPlayerInstance.load(targetUrl);
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

        let itemsHtml = '';
        fixtures.slice(0, 10).forEach(f => {
            const isLive = f.score && !f.score.finished; // basic mock live logic
            const isFinished = f.score && f.score.finished;
            
            let statusBadge = '';
            let scoreStr = 'vs';
            
            if (isLive) {
                statusBadge = '<span class="ticker-badge live">LIVE</span>';
                scoreStr = `<span class="ticker-score">${f.score.homeScore} - ${f.score.awayScore}</span>`;
            } else if (isFinished) {
                statusBadge = '<span class="ticker-badge finished">FT</span>';
                scoreStr = `<span class="ticker-score">${f.score.homeScore} - ${f.score.awayScore}</span>`;
            } else {
                statusBadge = '<span class="ticker-badge upcoming">K.O</span>';
                const time = new Date(f.kickoffUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                scoreStr = `<span class="ticker-time">${time}</span>`;
            }

            const homeFlag = getTeamFlagUrl(f.homeTeam);
            const awayFlag = getTeamFlagUrl(f.awayTeam);

            itemsHtml += `
                <div class="ticker-item">
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
        setInterval(fetchFixtures, 45000);

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