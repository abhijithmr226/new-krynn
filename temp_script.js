
    (async function() {
        // Feed configurations including DRM clearKeys
        const channelsData = [
          {
            "name": "Telemundo",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Telemundo_52_%282018%29.svg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://live-oneapp-prd-news.akamaized.net/Content/CMAF_OL2-CTR-4s-v2/Live/channel(kvea)/master.mpd"),
            "type": "dash",
            "language": "Spanish",
            "quality": "1080p",
            "drm": {
              "clearKeys": {
                "ce7ab3022e753307997f58afe001bac4": "72d631a66e635c60829a0fe7705516c1"
              }
            }
          },
            }
          },
          {
            "name": "TSN-1 (4800p)",
            "logo": "https://r2.thesportsdb.com/images/media/channel/logo/yrrvpq1433380019.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://server8host.run.place:9443/today/tsn1_4800p/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9Ni8xMy8yMDI2IDM6NDE6MzEgUE0maGFzaF92YWx1ZT1lU0cvejBSa3ZPU2h1cU5jUndidGtRPT0mdmFsaWRtaW51dGVzPTYw"),
            "type": "hls",
            "language": "English",
            "quality": "1080p"
          },
          {
            "name": "Fox Sports",
            "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT9dm4fKhUJScpNW_G3BwcRnqU5t2rPjGIzw&s",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://a204aivottepl-a.akamaihd.net/sin-nitro/live/clients/dash/enc/tmpzbbdj9y/out/v1/962736723a534ba294e7592fef49827b/cenc.mpd"),
            "type": "dash",
            "language": "English",
            "quality": "1080p",
            "drm": {
              "clearKeys": {
                "5466ebd70704bdeb657f0abf3c5ca4ef": "bdd79b72d8e48ed483aa623cc38a8a16"
              }
            }
          },
          {
            "name": "D Sports",
            "logo": "https://mir-s3-cdn-cf.behance.net/projects/404/3049c9206241453.Y3JvcCwxMDgwLDg0NCwwLDEwNA.jpg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://otte.cache.aiv-cdn.net/bom-nitro/live/clients/dash/enc/ubehitlwzo/out/v1/8e09c381a51f4366a19e979418112e8f/cenc.mpd"),
            "type": "dash",
            "language": "English",
            "quality": "1080p",
            "drm": {
              "clearKeys": {
                "a7d11d37a1f7611ee88d4db880171f32": "68f96d618b0b956b008c445896a25a79"
              }
            }
          },
            }
          },
          {
            "name": "Cignal Tv",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/4/41/Cignal.svg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://qp-pldt-live-bpk-ucd-prod.akamaized.net/bpk-tv/ch299/default/index.mpd"),
            "type": "dash",
            "language": "Filipino",
            "quality": "1080p",
            "drm": {
              "clearKeys": {
                "549ab7cd35a64bb6bb479ecead04d69d": "829799ed534d11fcadeb4b192467e050"
              }
            }
          },
          {
            "name": "Caze Tv",
            "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Caz%C3%A9TV_logo.svg/1280px-Caz%C3%A9TV_logo.svg.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://otte.live.fly.ww.aiv-cdn.net/iad-nitro/live/clients/dash/enc/iayg0kyrof/out/v1/91dc04907f56415b897faccfa9d252da/cenc.mpd"),
            "type": "dash",
            "language": "Portuguese",
            "quality": "1080p",
            "drm": {
              "clearKeys": {
                "1223d5105392cabf1bb9c2c1fdf6539a": "340b409f4b8f78a343e0363a7938df38"
              }
            }
          },
            }
          },
          {
            "name": "Zee",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/ZEE5_2025.svg/1280px-ZEE5_2025.svg.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeecinema/default/manifest.mpd"),
            "type": "dash",
            "language": "Hindi",
            "quality": "720p",
            "drm": {
              "clearKeys": {
                "43513b13f4b542e39c9265921dfc1726": "b0b2678bcd274c37b888a6c987d502ed"
              }
            }
          },
          {
            "name": "Himalaya Sports",
            "logo": "https://i.ytimg.com/vi/ATPh25ZXlmw/maxresdefault.jpg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://ottlive.dishhome.com.np/protected/GgTOzZkB0RDJ74Ryniuo/dash/manifest.mpd"),
            "type": "dash",
            "language": "Nepali",
            "quality": "720p",
            "drm": {
              "clearKeys": {
                "220d8978f3fd45b696137c5b94f7a264": "7bfe13500edee4f837ec03a907896306"
              }
            }
          },
          {
            "name": "IOS (TyC Sports)",
            "logo": "krynn_logo.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://amg26268-amg26268c14-freelivesports-emea-10267.playouts.now.amagi.tv/ts-us-e2-n2/playlist/amg26268-sportsstudio-tycsports-freelivesportsemea/playlist.m3u8"),
            "type": "hls",
            "language": "Spanish",
            "quality": "720p"
          },
          {
            "name": "IOS + (Web Player)",
            "logo": "krynn_logo.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://bokul-cdn.primesports.top/sp/play.php?url=https%3A%2F%2Fww2.sporttsonline.click%2Fchannels%2Fhd%2Fhd3.php"),
            "type": "iframe",
            "language": "English",
            "quality": "720p"
          },
          {
            "name": "Fox-2 (480p)",
            "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT9dm4fKhUJScpNW_G3BwcRnqU5t2rPjGIzw&s",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://server2host.run.place:9443/today/fox2_480p/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9Ni8xMy8yMDI2IDM6NDE6MzEgUE0maGFzaF92YWx1ZT1lU0cvejBSa3ZPU2h1cU5jUndidGtRPT0mdmFsaWRtaW51dGVzPTYw"),
            "type": "hls",
            "language": "English",
            "quality": "480p"
          },
          {
            "name": "TSN-4 (480p)",
            "logo": "https://r2.thesportsdb.com/images/media/channel/logo/yrrvpq1433380019.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://server3host.run.place:9443/today/tsn4_480p/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9Ni8xMy8yMDI2IDM6NDE6MzEgUE0maGFzaF92YWx1ZT1lU0cvejBSa3ZPU2h1cU5jUndidGtRPT0mdmFsaWRtaW51dGVzPTYw"),
            "type": "hls",
            "language": "English",
            "quality": "480p"
          },
          {
            "name": "TSN-1 (360p)",
            "logo": "https://r2.thesportsdb.com/images/media/channel/logo/yrrvpq1433380019.png",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://server1host.run.place:9443/today/tsn1_360p/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9Ni8xMy8yMDI2IDM6NDE6MzEgUE0maGFzaF92YWx1ZT1lU0cvejBSa3ZPU2h1cU5jUndidGtRPT0mdmFsaWRtaW51dGVzPTYw"),
            "type": "hls",
            "language": "English",
            "quality": "360p"
          },
          {
            "name": "NRK 1 HD",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/e/eb/NRK_1_logo.svg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("http://fomo.re/live/48rwR1XU4aADToYc/KhFcZBamcPosUfqR/2.m3u8"),
            "type": "hls",
            "language": "Norwegian",
            "quality": "1080p"
          },
          {
            "name": "Real Fox TV",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/7/76/Fox_Broadcasting_Company_logo_%282019%29.svg",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://ss4.bigchungus.zip/live/nrzepqom/vGruK584wr/268506.m3u8?token=Q0dRVxcMEAMbDVFWCAVRAwJSAVUABAoKCgECA1pTAwsLXFsGXF0DDA8bTRBDQBdXVF5vCFBACQoEDVEHVB0XTEsAS2kNABADGwhUBQMCRx4XR1kMUUAJCB4XFF4GEw8bCVUIB1xTARsVGwRKRFEXXFRfbwVRFFpbVxdeWRddWRUaCldpAAFfWFddQwgSBUceF1pDERZYXU1eWUgVAFhBS1kRXBReRgAMCgpDHhJXCkdbR0IYFlhdTV5ZSBUHSUFcVhZQWQpGCBtUChQKEhhHW0ZsQgRHFkFdU1gBRUALFwkaSRtbBRxtWlZXD1dTQAxdW0ASWxZRERQQWAtZC0VaS2cVUFJGXhAAAAtSAQcWGA=="),
            "type": "hls",
            "language": "English",
            "quality": "1080p"
          },
          {
            "name": "BBC (BBC Arabic)",
            "logo": "https://via.placeholder.com/150?text=BBC",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://vs-cmaf-pushb-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_arabic_tv/pc_hd_abr_v2.mpd"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "ITV (A2i TV)",
            "logo": "https://via.placeholder.com/150?text=ITV",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://stream.sen-gt.com/A2itv/myStream/playlist.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "FOX (Fox News Channel)",
            "logo": "https://via.placeholder.com/150?text=FOX",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("http://247preview.foxnews.com/hls/live/2020027/fncv3preview/primary.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "FS1 (FS1 Salzburg)",
            "logo": "https://via.placeholder.com/150?text=FS1",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("http://stream.fs1.tv:8080/hls/webstream.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "Telemundo (Telemundo Corpus Christi)",
            "logo": "https://via.placeholder.com/150?text=Telemundo",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://content.uplynk.com/channel/b6a96ed39d694ae1b738faa98cf7dd3f.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "CTV (ABC TV)",
            "logo": "https://via.placeholder.com/150?text=CTV",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://c.mjh.nz/abc-act.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "TSN (Fubo Sports Network)",
            "logo": "https://via.placeholder.com/150?text=TSN",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://dnf08l6u6uxnz.cloudfront.net/master.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "SBS (SBS6 Classics)",
            "logo": "https://via.placeholder.com/150?text=SBS",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://sbs6classic.prd1.talpatvcdn.nl/v1/master/8ada1ed2ae3b9c3db6fc5e604cfa78fc7d2d745e/sbs6classic_ssai/fea54560ba684701a2143f33a9cf4489/index.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "DD Sports (DD Sports)",
            "logo": "https://via.placeholder.com/150?text=DD%20Sports",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "Globo (Globo TV)",
            "logo": "https://via.placeholder.com/150?text=Globo",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://stream.radiosmundiales.com/hls/globotvhonduras/globotvhonduras.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "SBT (SBT Interior)",
            "logo": "https://via.placeholder.com/150?text=SBT",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/playlist.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "RTVE (Daystar TV Espanol)",
            "logo": "https://via.placeholder.com/150?text=RTVE",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://live-mcl.cdn01.net/smarttv/64wj6m6d8/playlist.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "DAZN (DAZN Combat)",
            "logo": "https://via.placeholder.com/150?text=DAZN",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "ARD (ARD-alpha)",
            "logo": "https://via.placeholder.com/150?text=ARD",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://mcdn.br.de/br/fs/ard_alpha/hls/de/master.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "M6 (M6 Music)",
            "logo": "https://via.placeholder.com/150?text=M6",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://test.946985.filegear-sg.me/proxy/803c517b325bfafc"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "beIN Sports (beIN SPORTS XTRA)",
            "logo": "https://via.placeholder.com/150?text=beIN%20Sports",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://amg01334-beinsportsllc-beinxtra-samsungau-eiyvc.amagi.tv/playlist/amg01334-beinsportsllc-beinxtra-samsungau/playlist.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "RAI (Alhurra Iraq)",
            "logo": "https://via.placeholder.com/150?text=RAI",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://mbn-ingest-worldsafe.akamaized.net/hls/live/2038899/MBN_Iraq_Worldsafe_HLS/master.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "TV Azteca (Azteca Honduras)",
            "logo": "https://via.placeholder.com/150?text=TV%20Azteca",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://mdstrm.com/live-stream-playlist/65a1d2fd7e7f14355550d570.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "SABC (SABC Lehae)",
            "logo": "https://via.placeholder.com/150?text=SABC",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://sabctretalh.cdn.mangomolo.com/lehae/smil:lehae.stream.smil/master.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "NHK (NHK World-Japan)",
            "logo": "https://via.placeholder.com/150?text=NHK",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://nhk.lls.pbs.org/index.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "DirecTV Sports (DD Sports)",
            "logo": "https://via.placeholder.com/150?text=DirecTV%20Sports",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          },
          {
            "name": "RCN (RCN Mas)",
            "logo": "https://via.placeholder.com/150?text=RCN",
            "streamUrl": "/api/proxy-stream?url=" + encodeURIComponent("https://rcntv-rcnmas-1-us.plex.wurl.tv/playlist.m3u8"),
            "type": "hls",
            "language": "Unknown",
            "quality": "Auto"
          }
        ];

        let shakaPlayerInstance = null;
        let activeChannelIndex = 0;
        let channelsHealthStatus = {}; // { [streamUrl]: isOnline }

        window.showPlayerError = function(msg) {
            const overlay = document.getElementById('player-error-overlay');
            const msgEl = document.getElementById('player-error-msg');
            if (overlay && msgEl) {
                msgEl.innerHTML = `${msg}<br><br><span style="color:var(--muted); font-size:11px;">Tip: Try switching to a different broadcast feed from the <b>Feeds Menu</b>.</span>`;
                overlay.classList.add('show');
            }
        };

        window.retryActiveChannel = function() {
            const overlay = document.getElementById('player-error-overlay');
            if (overlay) overlay.classList.remove('show');
            selectChannel(activeChannelIndex);
        };

        window.toggleMatchReminder = function(matchId, home, away, event) {
            event.stopPropagation();
            
            let reminders = JSON.parse(localStorage.getItem('krynn_match_reminders') || '[]');
            const index = reminders.indexOf(matchId);
            const isAdding = index === -1;
            
            if (isAdding) {
                reminders.push(matchId);
                localStorage.setItem('krynn_match_reminders', JSON.stringify(reminders));
                
                // Request notification permission
                if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('KRYNN SPORTS Reminder Active', {
                                body: `We will notify you before ${home} vs ${away} kick-off!`,
                                icon: 'worldcup_logo.png'
                            });
                        }
                    });
                }
                
                window.showToast(`Reminder set for ${home} vs ${away}!`);
            } else {
                reminders.splice(index, 1);
                localStorage.setItem('krynn_match_reminders', JSON.stringify(reminders));
                window.showToast(`Reminder cancelled for ${home} vs ${away}`);
            }
            
            // Update the button state dynamically
            const btn = event.currentTarget;
            if (btn) {
                btn.className = `watch-btn ${isAdding ? 'notify-active' : ''}`;
                btn.innerHTML = `<i class="${isAdding ? 'fa-solid fa-check' : 'fa-solid fa-bell'}"></i> ${isAdding ? 'Subscribed' : 'Notify'}`;
            }
        };

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
                
                // Update elements in carousel and drawer list
                renderChannelList();
                renderDrawerChannelList();
            } catch (err) {
                console.warn('Channel health check failed:', err);
            }
        }

        // --- Swipe Gestures & Custom Controls Setup ---
        function initPlayerGesturesAndChevrons() {
            const playerFrame = document.getElementById('player-frame');
            if (!playerFrame) return;

            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            playerFrame.addEventListener('touchstart', (e) => {
                // Ignore swipes starting on actual controls or overlay buttons
                const target = e.target;
                if (target.closest('.shaka-bottom-controls') || 
                    target.closest('.shaka-range-container') || 
                    target.closest('.shaka-overflow-menu') || 
                    target.closest('.shaka-settings-menu') || 
                    target.closest('.quick-channels-drawer') || 
                    target.closest('.player-nav-btn') || 
                    target.closest('.player-menu-btn')) {
                    touchStartX = 0;
                    touchStartY = 0;
                    return;
                }

                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].screenX;
                    touchStartY = e.touches[0].screenY;
                }
            }, { passive: true });

            playerFrame.addEventListener('touchend', (e) => {
                if (touchStartX === 0) return; // Ignore if swipe started on controls

                if (e.changedTouches.length === 1) {
                    touchEndX = e.changedTouches[0].screenX;
                    touchEndY = e.changedTouches[0].screenY;
                    
                    const deltaX = touchEndX - touchStartX;
                    const deltaY = touchEndY - touchStartY;
                    
                    // Horizontal swipe threshold
                    if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 40) {
                        if (deltaX < 0) {
                            playNextChannel();
                        } else {
                            playPrevChannel();
                        }
                    }
                }
            }, { passive: true });

            // Show chevrons on touch/mouse interaction
            let userActiveTimeout = null;
            function triggerUserActive() {
                playerFrame.classList.add('user-active');
                clearTimeout(userActiveTimeout);
                userActiveTimeout = setTimeout(() => {
                    playerFrame.classList.remove('user-active');
                }, 3000);
            }
            playerFrame.addEventListener('touchstart', triggerUserActive, { passive: true });
            playerFrame.addEventListener('mousemove', triggerUserActive, { passive: true });
        }

        window.playNextChannel = function() {
            let nextIndex = activeChannelIndex + 1;
            if (nextIndex >= channelsData.length) nextIndex = 0;
            selectChannel(nextIndex);
            showSwipeIndicator('next', channelsData[nextIndex].name);
        };

        window.playPrevChannel = function() {
            let prevIndex = activeChannelIndex - 1;
            if (prevIndex < 0) prevIndex = channelsData.length - 1;
            selectChannel(prevIndex);
            showSwipeIndicator('prev', channelsData[prevIndex].name);
        };

        let indicatorTimeout = null;
        function showSwipeIndicator(direction, channelName) {
            const ind = document.getElementById('channel-switch-indicator');
            const nameEl = document.getElementById('indicator-channel-name');
            if (!ind || !nameEl) return;
            
            nameEl.textContent = channelName;
            ind.className = 'channel-switch-indicator show';
            if (direction === 'next') {
                ind.classList.add('next');
            } else if (direction === 'prev') {
                ind.classList.add('prev');
            }
            
            clearTimeout(indicatorTimeout);
            indicatorTimeout = setTimeout(() => {
                ind.classList.remove('show');
            }, 1200);
        }

        window.toggleQuickChannels = function(forceState) {
            const drawer = document.getElementById('quick-channels-drawer');
            const btn = document.getElementById('quick-feeds-btn');
            const frame = document.getElementById('player-frame');
            if (!drawer) return;
            
            const isOpen = forceState !== undefined ? forceState : !drawer.classList.contains('open');
            
            if (isOpen) {
                drawer.classList.add('open');
                if (btn) btn.classList.add('active');
                if (frame) frame.classList.add('drawer-open');
            } else {
                drawer.classList.remove('open');
                if (btn) btn.classList.remove('active');
                if (frame) frame.classList.remove('drawer-open');
            }
        };

        function renderDrawerChannelList() {
            const drawerList = document.getElementById('drawer-channels-list');
            if (!drawerList) return;
            drawerList.innerHTML = '';

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
                card.className = 'drawer-channel-card';
                card.setAttribute('data-channel-index', originalIndex);
                if (originalIndex === activeChannelIndex) card.classList.add('active');

                const isOnline = channelsHealthStatus[channel.streamUrl] !== false; // Default true
                const healthColor = isOnline ? 'var(--green)' : 'var(--red)';
                const healthLabel = isOnline ? 'LIVE' : 'OFFLINE';

                card.innerHTML = `
                    <div class="drawer-channel-logo-container">
                        <img class="drawer-channel-logo" src="${channel.logo}" onerror="this.src='krynn_logo.png'">
                    </div>
                    <div class="drawer-channel-info">
                        <div class="drawer-channel-name">${channel.name}</div>
                        <div class="drawer-channel-meta" style="font-size: 11px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
                            <span style="color: ${healthColor}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><span class="card-status-dot" style="width: 5px; height: 5px; border-radius: 50%; display: inline-block; background: ${healthColor};"></span>${healthLabel}</span>
                            <span style="color: var(--muted); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 2px; font-size: 8.5px; text-transform: uppercase; font-weight: 700;">${channel.language}</span>
                            <span style="color: var(--orange); background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25); padding: 1px 4px; border-radius: 2px; font-size: 8.5px; text-transform: uppercase; font-weight: 700;">${channel.quality}</span>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    selectChannel(originalIndex);
                    setTimeout(() => {
                        toggleQuickChannels(false);
                    }, 400);
                });

                drawerList.appendChild(card);
            });
        }

        // --- Shaka Player Implementation ---------------------------------------

        async function initShaka() {
            const video = document.getElementById('video');
            if (!video || !video['ui']) {
                console.warn('Shaka UI controls not fully loaded yet.');
                return;
            }
            
            // Get player and controls instances
            const controls = video['ui'].getControls();
            const player = controls.getPlayer();
            shakaPlayerInstance = player;

            // Configure seekBarColors to match the orange brand theme
            video['ui'].configure({
                seekBarColors: {
                    base: 'rgba(255,255,255,.2)',
                    buffered: 'rgba(255,255,255,.4)',
                    played: 'rgb(255, 106, 0)', // Brand orange indicator
                }
            });

            // Listen for error events from Shaka Player
            player.addEventListener('error', (event) => {
                if (isSwitchingChannel) {
                    console.warn('Ignored Shaka player error event during transition:', event.detail);
                    return;
                }
                // Only trigger failover if the error is CRITICAL (severity === 2)
                if (event.detail && event.detail.severity === 2) {
                    console.error('Fatal Shaka player error event:', event.detail);
                    const code = event.detail.code;
                    // Ignore code 1007 (LOAD_INTERRUPTED) which fires during manual channel changes
                    if (code === 1007) return;
                    const isDrmError = (code >= 6000 && code < 7000);
                    const reason = isDrmError ? `shaka-drm-error-${code}` : `shaka-player-error-${code}`;
                    tryNextChannelFailover(reason);
                } else {
                    console.warn('Non-fatal Shaka player error event:', event.detail);
                }
            });

            // Listen for native video element errors (HLS fallback tag)
            video.addEventListener('error', (e) => {
                if (isSwitchingChannel) {
                    console.warn('Ignored video element error during transition:', video.error);
                    return;
                }
                const channel = channelsData[activeChannelIndex];
                if (channel && channel.type !== 'iframe' && video.error) {
                    const code = video.error.code;
                    // Only trigger for actual network or decoding fatal errors (code 2 = NETWORK, 3 = DECODE)
                    if (code === 2 || code === 3) {
                        console.error('Fatal video element error:', video.error);
                        tryNextChannelFailover(`video-error-${code}`);
                    } else {
                        console.warn('Ignored non-fatal video element error:', video.error);
                    }
                }
            });

            // Reset failover count on successful playback
            video.addEventListener('playing', () => {
                console.log('[Channel Success] Stream playing successfully. Resetting failover count.');
                channelFailoverCount = 0;
                encounteredDrmError = false;
                isSwitchingChannel = false;
            });

            // Initialize rendering
            renderChannelList();
            renderDrawerChannelList();
            initPlayerGesturesAndChevrons();

            // Load default channel (index 0)
            selectChannel(0, false);

            // Shaka overflow menu updates
            document.querySelectorAll('.shaka-overflow-menu-button').forEach(button => {
                button.textContent = 'settings';
            });
            document.querySelectorAll('.shaka-back-to-overflow-button .material-icons, .shaka-back-to-overflow-button .material-icons-round').forEach(icon => {
                icon.textContent = 'arrow_back_ios_new';
            });
        }

        let channelFailoverCount = 0;
        let encounteredDrmError = false;
        let isSwitchingChannel = false;

        async function tryNextChannelFailover(reason) {
            if (isSwitchingChannel) {
                console.warn(`[Channel Failover] Switch in progress, ignoring duplicate failover trigger for: ${reason}`);
                return;
            }
            
            console.warn(`[Channel Failover] Current channel ${activeChannelIndex} failed (${reason}). Trying next channel...`);
            
            if (reason.includes('drm')) {
                encounteredDrmError = true;
            }
            
            // Limit failover loop to prevent infinite loop if all channels are down (allow 2 full cycles)
            if (channelFailoverCount >= channelsData.length * 2) {
                console.error('[Channel Failover] All channels checked twice and failed.');
                if (encounteredDrmError) {
                    showPlayerError(`DRM Decryption failed: Decryption keys may have expired or rotated on the server. Please verify provider settings.`);
                } else {
                    showPlayerError(`Failed to load stream: All available broadcast feeds are currently offline.`);
                }
                channelFailoverCount = 0; // reset
                encounteredDrmError = false;
                isSwitchingChannel = false;
                return;
            }
            
            channelFailoverCount++;
            let nextIndex = activeChannelIndex + 1;
            if (nextIndex >= channelsData.length) {
                nextIndex = 0;
            }
            
            // Show toast message to user that we're failing over
            if (window.showToast) {
                window.showToast(`Feed offline. Auto-switching to ${channelsData[nextIndex].name}...`, 'fa-circle-notch fa-spin');
            }
            
            // Switch channel
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

            // Hide error overlay on channel switch
            const errorOverlay = document.getElementById('player-error-overlay');
            if (errorOverlay) errorOverlay.classList.remove('show');

            // Update active state in list selectors
            document.querySelectorAll('.channel-select-card').forEach((card) => {
                const cardIdx = parseInt(card.getAttribute('data-channel-index'));
                if (cardIdx === index) card.classList.add('active');
                else card.classList.remove('active');
            });

            // Update active state in drawer selectors
            document.querySelectorAll('.drawer-channel-card').forEach((card) => {
                const cardIdx = parseInt(card.getAttribute('data-channel-index'));
                if (cardIdx === index) card.classList.add('active');
                else card.classList.remove('active');
            });

            // Update now playing header text
            document.getElementById('now-playing-title').textContent = `${channel.name} — Live Broadcast Feed`;

            const video = document.getElementById('video');
            const shakaContainer = document.getElementById('shaka-container');
            const iframeContainer = document.getElementById('iframe-container');
            const playerIframe = document.getElementById('player-iframe');
            
            if (channel.type === 'iframe') {
                if (video) video.pause();
                if (shakaPlayerInstance) {
                    shakaPlayerInstance.unload().catch(() => {});
                }
                
                if (shakaContainer) shakaContainer.style.display = 'none';
                if (iframeContainer) iframeContainer.style.display = 'block';
                if (playerIframe) playerIframe.src = channel.streamUrl;
                isSwitchingChannel = false;
            } else {
                if (playerIframe) playerIframe.src = 'about:blank';
                if (iframeContainer) iframeContainer.style.display = 'none';
                if (shakaContainer) shakaContainer.style.display = 'block';

                if (!shakaPlayerInstance) {
                    console.warn('Player instance not ready yet.');
                    isSwitchingChannel = false;
                    return;
                }

                try {
                    // Reset existing DRM config
                    shakaPlayerInstance.configure({
                        drm: {
                            clearKeys: {}
                        }
                    });

                    // Load specific clearKeys DRM profile if needed
                    if (channel.drm && channel.drm.clearKeys) {
                        shakaPlayerInstance.configure({
                            drm: {
                                clearKeys: channel.drm.clearKeys
                            }
                        });
                        console.log(`Dynamic ClearKeys configured for: ${channel.name}`);
                    }

                    await shakaPlayerInstance.load(channel.streamUrl);
                    video.muted = false;
                    
                    await video.play().catch(e => console.log('Autoplay deferred:', e));
                    isSwitchingChannel = false;
                } catch (error) {
                    console.error('Shaka dynamic stream load error:', error);
                    isSwitchingChannel = false;
                    tryNextChannelFailover('shaka-load-catch');
                }
            }
        };

        function renderChannelList() {
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

                card.innerHTML = `
                    <div class="card-logo-container">
                        <img class="card-logo" src="${logoUrl}" onerror="this.src='krynn_logo.png'">
                    </div>
                    <div class="card-info">
                        <div class="card-name">${channel.name}</div>
                        <div class="card-meta" style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
                            <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; color: var(--muted); text-transform: uppercase; font-weight: 700;">${channel.language}</span>
                            <span style="font-size: 8.5px; padding: 1px 4px; background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25); border-radius: 2px; color: var(--orange); text-transform: uppercase; font-weight: 700;">${channel.quality}</span>
                            <span class="card-status" style="color: ${healthColor}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                <span class="card-status-dot" style="background: ${healthColor}; width: 5px; height: 5px; border-radius: 50%;"></span> ${healthLabel}
                            </span>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    selectChannel(originalIndex);
                    scrollToSection('video-section');
                });

                listScroll.appendChild(card);
            });
        }

        // Register Shaka loader event
        document.addEventListener('shaka-ui-loaded', initShaka);
        
        // Wait safety if event fired before load
        if (window.shaka && window.shaka.Player) {
            setTimeout(() => {
                if (!shakaPlayerInstance) {
                    initShaka();
                }
            }, 500);
        }

        // --- SportScore API Fixtures (Strict World Cup Only) ----------------------

        // --- SportScore API Fixtures (Strict World Cup Only) ----------------------

        function cleanName(name) {
            if (!name) return '';
            let n = name.toLowerCase().trim();
            n = n.replace(/&/g, 'and');
            n = n.replace(/ç/g, 'c');
            n = n.replace(/[áàâä]/g, 'a');
            n = n.replace(/[éèêë]/g, 'e');
            n = n.replace(/[íìîï]/g, 'i');
            n = n.replace(/[óòôö]/g, 'o');
            n = n.replace(/[úùûü]/g, 'u');
            n = n.replace(/ñ/g, 'n');
            n = n.replace(/[^a-z0-9\s']/g, '');
            n = n.replace(/\s+/g, ' ');
            if (n === 'usa' || n === 'united states of america') return 'united states';
            if (n === 'south korea' || n === 'republic of korea' || n === 'korea republic') return 'south korea';
            if (n === 'czech republic') return 'czechia';
            if (n === 'ivory coast') return "cote d'ivoire";
            if (n === 'cote divoire') return "cote d'ivoire";
            if (n === 'ir iran') return 'iran';
            if (n === 'congo dr' || n === 'dr congo' || n === 'democratic republic of the congo') return 'congo dr';
            if (n === 'cabo verde' || n === 'cape verde') return 'cabo verde';
            if (n === 'turkey') return 'turkiye';
            if (n === 'bosnia and herzegovina') return 'bosnia & herzegovina';
            return n;
        }

        const COUNTRY_CODES = {
            'algeria': 'dz',
            'argentina': 'ar',
            'australia': 'au',
            'austria': 'at',
            'belgium': 'be',
            'bosnia and herzegovina': 'ba',
            'bosnia & herzegovina': 'ba',
            'brazil': 'br',
            'cabo verde': 'cv',
            'canada': 'ca',
            'colombia': 'co',
            'congo dr': 'cd',
            'congo': 'cd',
            'cote divoire': 'ci',
            "cote d'ivoire": 'ci',
            'croatia': 'hr',
            'curacao': 'cw',
            'czechia': 'cz',
            'czech republic': 'cz',
            'ecuador': 'ec',
            'egypt': 'eg',
            'england': 'gb-eng',
            'france': 'fr',
            'germany': 'de',
            'ghana': 'gh',
            'haiti': 'ht',
            'iran': 'ir',
            'iraq': 'iq',
            'japan': 'jp',
            'jordan': 'jo',
            'korea republic': 'kr',
            'south korea': 'kr',
            'mexico': 'mx',
            'morocco': 'ma',
            'netherlands': 'nl',
            'new zealand': 'nz',
            'norway': 'no',
            'panama': 'pa',
            'paraguay': 'py',
            'portugal': 'pt',
            'qatar': 'qa',
            'saudi arabia': 'sa',
            'scotland': 'gb-sct',
            'senegal': 'sn',
            'south africa': 'za',
            'spain': 'es',
            'sweden': 'se',
            'switzerland': 'ch',
            'tunisia': 'tn',
            'turkiye': 'tr',
            'turkey': 'tr',
            'united states': 'us',
            'uruguay': 'uy',
            'uzbekistan': 'uz'
        };

        const TEAM_RATINGS = {
            'algeria': 75,
            'argentina': 88,
            'australia': 77,
            'austria': 80,
            'belgium': 83,
            'bosnia and herzegovina': 74,
            'brazil': 86,
            'cabo verde': 72,
            'canada': 75,
            'colombia': 82,
            'congo dr': 72,
            'cote divoire': 76,
            'croatia': 81,
            'curacao': 65,
            'czechia': 77,
            'ecuador': 77,
            'egypt': 76,
            'england': 86,
            'france': 87,
            'germany': 84,
            'ghana': 73,
            'haiti': 68,
            'iran': 77,
            'iraq': 73,
            'japan': 80,
            'jordan': 71,
            'korea republic': 78,
            'mexico': 78,
            'morocco': 82,
            'netherlands': 84,
            'new zealand': 69,
            'norway': 78,
            'panama': 74,
            'paraguay': 74,
            'portugal': 85,
            'qatar': 73,
            'saudi arabia': 73,
            'scotland': 75,
            'senegal': 78,
            'south africa': 73,
            'spain': 86,
            'sweden': 79,
            'switzerland': 78,
            'tunisia': 74,
            'turkiye': 78,
            'united states': 79,
            'uruguay': 83,
            'uzbekistan': 72
        };

        function getWinProbability(home, away) {
            const rHome = TEAM_RATINGS[cleanName(home)] || 70;
            const rAway = TEAM_RATINGS[cleanName(away)] || 70;
            
            // Generate real-time drift based on timestamp
            const noise = (Math.sin(Date.now() / 15000) * 1.8);
            const diff = (rHome - rAway) + noise;
            
            // Symmetric logistic curve calculations
            const pHome = 1 / (1 + Math.exp(-diff / 8));
            const pAway = 1 / (1 + Math.exp(diff / 8));
            
            // Dynamic draw probability that fluctuates slightly
            const drawChance = 0.22 + (Math.cos(Date.now() / 20000) * 0.02);
            const playChance = 1 - drawChance;
            
            let homeWin = Math.round(playChance * pHome * 100);
            let awayWin = Math.round(playChance * pAway * 100);
            
            // Safe boundaries to prevent 0% or extreme values
            homeWin = Math.max(10, Math.min(80, homeWin));
            awayWin = Math.max(10, Math.min(80, awayWin));
            
            const draw = 100 - homeWin - awayWin;
            
            return { homeWin, draw, awayWin };
        }

        const mockUpcomingFixtures = [
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Qatar",
                home_logo: "",
                away: "Switzerland",
                away_logo: "",
                time: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "Levi's Stadium, San Francisco"
            },
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Brazil",
                home_logo: "",
                away: "Morocco",
                away_logo: "",
                time: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "MetLife Stadium, New York"
            },
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Haiti",
                home_logo: "",
                away: "Scotland",
                away_logo: "",
                time: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "Gillette Stadium, Boston"
            },
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Australia",
                home_logo: "",
                away: "Turkiye",
                away_logo: "",
                time: new Date(Date.now() + 11 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "BC Place, Vancouver"
            },
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Cote d'Ivoire",
                home_logo: "",
                away: "Ecuador",
                away_logo: "",
                time: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "Lincoln Financial Field, Philadelphia"
            },
            {
                competition: "2026 FIFA World Cup — Group Stage",
                home: "Germany",
                home_logo: "",
                away: "Curacao",
                away_logo: "",
                time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
                status: "upcoming",
                status_text: "NRG Stadium, Houston"
            }
        ];

        // Dynamic, realistic score generator using team ratings & date as seed
        function getDeterministicScore(home, away, dateStr) {
            const str = `${home || ''}-${away || ''}-${dateStr || ''}`;
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash |= 0;
            }
            hash = Math.abs(hash);

            const rHome = TEAM_RATINGS[cleanName(home)] || 70;
            const rAway = TEAM_RATINGS[cleanName(away)] || 70;

            const diff = (rHome - rAway) / 10;
            
            let expHome = 1.0 + (diff * 0.25) + (hash % 4) * 0.3;
            let expAway = 1.0 - (diff * 0.25) + ((hash >> 2) % 4) * 0.3;

            let homeScore = Math.max(0, Math.floor(expHome - 0.2));
            let awayScore = Math.max(0, Math.floor(expAway - 0.2));

            if (hash % 9 === 0) {
                homeScore += (hash % 3);
            }
            if ((hash >> 3) % 9 === 0) {
                awayScore += ((hash >> 3) % 3);
            }

            homeScore = Math.min(homeScore, 5);
            awayScore = Math.min(awayScore, 5);

            return { homeScore, awayScore };
        }

        function getLiveScore(home, away, dateStr, elapsedMinutes) {
            const final = getDeterministicScore(home, away, dateStr);
            const progress = Math.min(90, elapsedMinutes) / 90;
            const hash = Math.abs((home || '').charCodeAt(0) + (away || '').charCodeAt(0) + elapsedMinutes);
            
            let homeScore = Math.floor(final.homeScore * progress);
            let awayScore = Math.floor(final.awayScore * progress);
            
            if (progress > 0.1 && final.homeScore > 0 && homeScore === 0 && (hash % 10 < 3)) {
                homeScore = 1;
            }
            if (progress > 0.1 && final.awayScore > 0 && awayScore === 0 && (hash % 10 > 7)) {
                awayScore = 1;
            }
            
            homeScore = Math.min(homeScore, final.homeScore);
            awayScore = Math.min(awayScore, final.awayScore);
            
            return { homeScore, awayScore };
        }

        window.normalizeWorldCupFixtureStates = function(fixtures) {
            const now = new Date();
            return fixtures.map(f => {
                const kickoff = new Date(f.time);
                const elapsedMs = now - kickoff;
                const elapsedMins = Math.floor(elapsedMs / 60000);
                
                let status = f.status;
                let score = f.score;
                let statusText = f.status_text;
                
                // If the fixture already has a real API score, trust it completely
                if (score && (score.homeScore !== null && score.awayScore !== null)) {
                    // Match has a real score — mark as finished
                    status = "finished";
                    return { ...f, status, status_text: statusText, score };
                }

                // No real score — determine state by time
                if (elapsedMins >= 120) {
                    // Match is old enough to be finished but no score available yet
                    // Don't fake it — show as finished with unknown score
                    status = "finished";
                    score = null; // no fake score
                } else if (elapsedMins >= 0) {
                    // Currently live
                    status = "live";
                    score = null; // no fake score during live
                    if (elapsedMins >= 45 && elapsedMins <= 60) {
                        statusText = "HT";
                    } else if (elapsedMins > 60) {
                        statusText = `${Math.min(90, elapsedMins - 15)}'`;
                    } else {
                        statusText = `${elapsedMins}'`;
                    }
                } else {
                    // Future match
                    status = "upcoming";
                    score = null;
                }
                
                return {
                    ...f,
                    status: status,
                    status_text: statusText,
                    score: score
                };
            });
        };

        window.fetchSportScoreMatches = async function() {
            const grid = document.getElementById('matches-grid');
            if (grid) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">
                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 32px; color: var(--orange); margin-bottom: 12px;"></i>
                        <p>Fetching official World Cup fixtures...</p>
                    </div>
                `;
            }

            // Fetch official World Cup schedules from openfootball (via proxy)
            try {
                const res = await fetch(`/api/worldcup/fixtures`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                
                if (data && data.fixtures && data.fixtures.length > 0) {
                    // Map official format to list renderer format
                    const mapped = data.fixtures.map(f => {
                        return {
                            matchNumber: f.matchNumber,
                            competition: `${data.tournament.edition} — ${f.stage.replace(/-/g, ' ').toUpperCase()}`,
                            home: f.homeTeam,
                            home_logo: '',
                            away: f.awayTeam,
                            away_logo: '',
                            time: f.kickoffUtc,
                            status: f.score ? "finished" : "upcoming",
                            status_text: f.stadium + ', ' + f.hostCity.replace(/-/g, ' ').toUpperCase(),
                            group: f.group,
                            score: f.score
                        };
                    });
                    
                    // Sort chronologically by kickoff date/time
                    mapped.sort((a, b) => new Date(a.time) - new Date(b.time));

                    // Normalize fixture states dynamically based on current time
                    window.allWorldCupFixtures = normalizeWorldCupFixtureStates(mapped);
                    
                    // Update upcoming total count in button
                    const upcomingWC = window.allWorldCupFixtures.filter(f => f.status === "upcoming");
                    const countEl = document.getElementById('upcoming-total-count');
                    if (countEl) countEl.textContent = upcomingWC.length > 0 ? upcomingWC.length : window.allWorldCupFixtures.length;

                    // Trigger standings computation
                    calculateAndRenderStandings(window.allWorldCupFixtures);
                    
                    // Update Live Scoreboard using normalized authentic fixtures
                    updateLiveScoreboard();
                    
                    // Update Upcoming Match Overlay Countdown
                    updateUpcomingMatchCountdown();
                    
                    // Trigger EPG render
                    filterUpcomingMatches();
                } else {
                    useMockFixtures();
                }
            } catch (err) {
                console.error("World Cup fixtures fetch error:", err);
                useMockFixtures();
            }
        };

        function updateLiveScoreboard() {
            if (!window.allWorldCupFixtures) return;
            
            // Find live matches
            const liveMatches = window.allWorldCupFixtures.filter(f => f.status === 'live');
            
            let displayList = [];
            if (liveMatches.length > 0) {
                displayList = liveMatches;
            } else {
                // No live matches right now. Show the 3 most recently finished matches and next 3 upcoming matches
                const finished = window.allWorldCupFixtures.filter(f => f.status === 'finished');
                const upcoming = window.allWorldCupFixtures.filter(f => f.status === 'upcoming');
                
                const lastFinished = finished.slice(-3);
                const nextUpcoming = upcoming.slice(0, 3);
                
                displayList = [...lastFinished, ...nextUpcoming];
            }
            
            if (displayList.length > 0) {
                // Render live scoreboard matches
                const listToRender = displayList.map(m => ({
                    ...m,
                    home_score: m.score ? m.score.homeScore : null,
                    away_score: m.score ? m.score.awayScore : null
                }));
                renderLiveMatches(listToRender);
            } else {
                showEmptyScoreboard();
            }
        }

        function useMockFixtures() {
            const mapped = mockUpcomingFixtures.map(f => ({
                ...f,
                home_logo: '',
                away_logo: '',
                score: null
            }));
            
            // Sort chronologically by kickoff date/time
            mapped.sort((a, b) => new Date(a.time) - new Date(b.time));

            window.allWorldCupFixtures = normalizeWorldCupFixtureStates(mapped);
            
            const countEl = document.getElementById('upcoming-total-count');
            if (countEl) {
                const upcomingWC = window.allWorldCupFixtures.filter(f => f.status === "upcoming");
                countEl.textContent = upcomingWC.length > 0 ? upcomingWC.length : window.allWorldCupFixtures.length;
            }
            
            calculateAndRenderStandings(window.allWorldCupFixtures);
            updateLiveScoreboard();
            updateUpcomingMatchCountdown();
            filterUpcomingMatches();
        }

        window.showAllUpcoming = false;

        window.toggleUpcomingMatches = function() {
            window.showAllUpcoming = !window.showAllUpcoming;
            const btn = document.getElementById('btn-toggle-upcoming');
            if (btn) {
                if (window.showAllUpcoming) {
                    btn.innerHTML = `<i class="fa-solid fa-compress-arrows-alt"></i> Show Next 6`;
                } else {
                    const upcomingWC = (window.allWorldCupFixtures || []).filter(f => new Date(f.time) >= new Date());
                    const count = upcomingWC.length > 0 ? upcomingWC.length : (window.allWorldCupFixtures || []).length;
                    btn.innerHTML = `<i class="fa-solid fa-list-ul"></i> Show All (${count})`;
                }
            }
            filterUpcomingMatches();
        };

        window.filterUpcomingMatches = function() {
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
        };

        window.activeStandingsGroup = 'A';

        window.selectStandingsGroup = function(grp) {
            window.activeStandingsGroup = grp;
            const buttons = document.querySelectorAll('.standings-tabs .tab-btn');
            buttons.forEach(btn => {
                if (btn.textContent.trim().endsWith(grp)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            renderStandings();
        };

        window.calculateAndRenderStandings = function(fixtures) {
            window.fixturesDataForStandings = fixtures;
            renderStandings();
        };

        window.renderStandings = function() {
            const fixtures = window.fixturesDataForStandings;
            const tbody = document.getElementById('standings-table-body');
            if (!tbody || !fixtures) return;

            const currentGroup = `group ${window.activeStandingsGroup}`.toLowerCase();
            const groupTeams = new Set();
            
            const groupMatches = fixtures.filter(f => {
                const fg = (f.group || '').toLowerCase().trim();
                return fg === currentGroup || fg === window.activeStandingsGroup.toLowerCase();
            });

            groupMatches.forEach(m => {
                if (m.home) groupTeams.add(m.home);
                if (m.away) groupTeams.add(m.away);
            });

            const stats = {};
            groupTeams.forEach(team => {
                stats[team] = {
                    teamName: team,
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    points: 0
                };
            });

            groupMatches.forEach(m => {
                if (!m.score) return;
                
                const tHome = m.home;
                const tAway = m.away;
                const scoreHome = parseInt(m.score.homeScore);
                const scoreAway = parseInt(m.score.awayScore);

                if (isNaN(scoreHome) || isNaN(scoreAway)) return;

                const sHome = stats[tHome];
                const sAway = stats[tAway];
                
                if (sHome && sAway) {
                    sHome.played++;
                    sAway.played++;
                    sHome.goalsFor += scoreHome;
                    sHome.goalsAgainst += scoreAway;
                    sAway.goalsFor += scoreAway;
                    sAway.goalsAgainst += scoreHome;

                    if (scoreHome > scoreAway) {
                        sHome.wins++;
                        sHome.points += 3;
                        sAway.losses++;
                    } else if (scoreHome < scoreAway) {
                        sAway.wins++;
                        sAway.points += 3;
                        sHome.losses++;
                    } else {
                        sHome.draws++;
                        sHome.points += 1;
                        sAway.draws++;
                        sAway.points += 1;
                    }
                }
            });

            const standingsArray = Object.values(stats).sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const gdA = a.goalsFor - a.goalsAgainst;
                const gdB = b.goalsFor - b.goalsAgainst;
                if (gdB !== gdA) return gdB - gdA;
                if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
                return a.teamName.localeCompare(b.teamName);
            });

            tbody.innerHTML = standingsArray.map((t, idx) => {
                const gd = t.goalsFor - t.goalsAgainst;
                const gdFormatted = gd > 0 ? `+${gd}` : gd;
                const teamLogo = getTeamFlagUrl(t.teamName);

                return `
                    <tr class="standings-row-${idx}">
                        <td style="text-align: center;">
                            <span class="standings-pos-badge">${idx + 1}</span>
                        </td>
                        <td>
                            <div class="upcoming-team-cell">
                                <img class="upcoming-team-logo" src="${teamLogo}" onerror="this.src='krynn_logo.png'" style="width: 24px; height: 24px; margin-right: 8px;">
                                <span style="font-weight: 600;">${t.teamName}</span>
                            </div>
                        </td>
                        <td style="text-align: center; font-weight: 500;">${t.played}</td>
                        <td style="text-align: center; color: var(--green);">${t.wins}</td>
                        <td style="text-align: center; color: var(--muted);">${t.draws}</td>
                        <td style="text-align: center; color: var(--red);">${t.losses}</td>
                        <td style="text-align: center; color: var(--muted);">${t.goalsFor}</td>
                        <td style="text-align: center; color: var(--muted);">${t.goalsAgainst}</td>
                        <td style="text-align: center; font-weight: 500; color: ${gd > 0 ? 'var(--green)' : gd < 0 ? 'var(--red)' : 'var(--muted)'}">${gdFormatted}</td>
                        <td style="text-align: center; font-weight: 800; color: var(--orange); font-size: 14px;">${t.points}</td>
                    </tr>
                `;
            }).join('');
        };

        function formatCalendarDate(date) {
            const pad = (num) => String(num).padStart(2, '0');
            return date.getUTCFullYear() +
                   pad(date.getUTCMonth() + 1) +
                   pad(date.getUTCDate()) + 'T' +
                   pad(date.getUTCHours()) +
                   pad(date.getUTCMinutes()) +
                   pad(date.getUTCSeconds()) + 'Z';
        }

        window.exportToGoogleCalendar = function(home, away, timeStr, locationText, event) {
            if (event) event.stopPropagation();
            const matchDate = new Date(timeStr);
            const endDate = new Date(matchDate.getTime() + 2 * 3600 * 1000);
            
            const title = encodeURIComponent(`FIFA World Cup 2026: ${home} vs ${away}`);
            const dates = `${formatCalendarDate(matchDate)}/${formatCalendarDate(endDate)}`;
            const details = encodeURIComponent(`Watch live on KRYNN SPORTS. Kickoff at ${matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST.`);
            const location = encodeURIComponent(locationText || 'FIFA World Cup 2026 Venue');
            
            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
            window.open(url, '_blank');
        };

        window.exportToICS = function(home, away, timeStr, locationText, event) {
            if (event) event.stopPropagation();
            const matchDate = new Date(timeStr);
            const endDate = new Date(matchDate.getTime() + 2 * 3600 * 1000);
            
            const start = formatCalendarDate(matchDate);
            const end = formatCalendarDate(endDate);
            const summary = `FIFA World Cup 2026: ${home} vs ${away}`;
            const description = `Watch live on KRYNN SPORTS. Kickoff at ${matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST.`;
            const location = locationText || 'FIFA World Cup 2026 Venue';
            
            const icsLines = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//KRYNN SPORTS//FIFA World Cup 2026 Reminders//EN',
                'CALSCALE:GREGORIAN',
                'BEGIN:VEVENT',
                `SUMMARY:${summary}`,
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `LOCATION:${location}`,
                `DESCRIPTION:${description}`,
                'STATUS:CONFIRMED',
                'SEQUENCE:0',
                'BEGIN:VALARM',
                'TRIGGER:-PT15M',
                'ACTION:DISPLAY',
                'DESCRIPTION:Reminder',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR'
            ];
            
            const icsString = icsLines.join('\r\n');
            const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${home.replace(/\s+/g, '_')}_vs_${away.replace(/\s+/g, '_')}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.showToast(`Calendar file downloaded for ${home} vs ${away}!`, 'fa-calendar-check');
        };

        function renderLiveMatches(matchesList) {
            const grid = document.getElementById('matches-grid');
            if (!grid) return;

            grid.innerHTML = matchesList.map(m => {
                const isLive = m.status === 'live';
                const matchDate = new Date(m.time);
                // Format explicitly in Indian Standard Time (IST)
                const formattedTime = matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';
                const formattedDate = matchDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
                
                const homeLogo = m.home_logo && m.home_logo.startsWith('http') ? m.home_logo : getTeamFlagUrl(m.home);
                const awayLogo = m.away_logo && m.away_logo.startsWith('http') ? m.away_logo : getTeamFlagUrl(m.away);
                
                return `
                    <div class="match-card ${isLive ? 'live-now' : ''}">
                        <div class="match-meta">
                            <span class="match-group" title="${m.competition}">${m.competition}</span>
                            <span class="match-status-badge ${m.status}">${
                                isLive ? '● LIVE' :
                                m.status === 'upcoming' ? '⏰ UPCOMING' : '✓ FINISHED'
                            }</span>
                        </div>
                        <div class="match-teams-row">
                            <div class="match-team">
                                <img class="team-flag" src="${homeLogo}" onerror="this.src='krynn_logo.png'" style="width: 32px; height: 32px; object-fit: contain; margin-bottom: 4px;">
                                <div class="team-name" style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.home}</div>
                            </div>
                            <div class="match-score">
                                <div class="score-display">${m.home_score !== null ? m.home_score : '-'} : ${m.away_score !== null ? m.away_score : '-'}</div>
                                <div class="score-sep" style="font-size: 10px; color: var(--muted); margin-top: 2px;">${m.status_text || ''}</div>
                            </div>
                            <div class="match-team">
                                <img class="team-flag" src="${awayLogo}" onerror="this.src='krynn_logo.png'" style="width: 32px; height: 32px; object-fit: contain; margin-bottom: 4px;">
                                <div class="team-name" style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.away}</div>
                            </div>
                        </div>
                        <div class="match-info-row">
                            <span><i class="fa-regular fa-clock"></i> ${formattedDate} ${formattedTime}</span>
                            ${isLive 
                                ? `<button class="watch-btn" onclick="scrollToSection('video-section')"><i class="fa-solid fa-play"></i> WATCH</button>`
                                : `<button class="watch-btn upcoming-btn" style="opacity: 0.5; cursor: default;"><i class="fa-solid fa-bell"></i> INFO</button>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
        }

        function getTeamFlagUrl(teamName) {
            if (!teamName) return 'krynn_logo.png';
            if (teamName.startsWith('http')) return teamName;
            const clean = cleanName(teamName);
            const code = COUNTRY_CODES[clean];
            if (code) {
                return `https://flagcdn.com/w40/${code}.png`;
            }
            return 'krynn_logo.png';
        }

        function renderUpcomingTable(upcomingList) {
            const upcomingBody = document.getElementById('upcoming-matches-body');
            if (!upcomingBody) return;
            
            upcomingBody.innerHTML = upcomingList.map(m => {
                const matchDate = new Date(m.time);
                // Format explicitly in Indian Standard Time (IST)
                const formattedTime = matchDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';
                const formattedDate = matchDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
                const probs = getWinProbability(m.home, m.away);
                const matchId = `${m.home.toLowerCase().trim()}_vs_${m.away.toLowerCase().trim()}`.replace(/\s+/g, '_');
                
                const reminders = JSON.parse(localStorage.getItem('krynn_match_reminders') || '[]');
                const isReminded = reminders.includes(matchId);

                const homeLogo = m.home_logo && m.home_logo.startsWith('http') ? m.home_logo : getTeamFlagUrl(m.home);
                const awayLogo = m.away_logo && m.away_logo.startsWith('http') ? m.away_logo : getTeamFlagUrl(m.away);

                let scoreOrProbsHtml = '';
                if (m.score) {
                    scoreOrProbsHtml = `
                        <div class="score-display-wrapper" style="text-align: center; background: rgba(0, 255, 0, 0.05); padding: 4px 12px; border-radius: 8px; border: 1px solid rgba(0, 255, 0, 0.15); display: inline-block;">
                            <span style="font-weight: 700; color: var(--green); letter-spacing: 1px; font-size: 10px;">✓ FINISHED</span>
                            <div style="font-size: 16px; font-weight: 800; color: #fff; margin-top: 2px;">${m.score.homeScore} : ${m.score.awayScore}</div>
                        </div>
                    `;
                } else {
                    scoreOrProbsHtml = `
                        <div class="prob-labels">
                            <span class="home-win">Win: <strong class="lbl-home-win">${probs.homeWin}%</strong></span>
                            <span>Draw: <strong class="lbl-draw-win">${probs.draw}%</strong></span>
                            <span class="away-win">Win: <strong class="lbl-away-win">${probs.awayWin}%</strong></span>
                        </div>
                        <div class="probability-bar-container">
                            <div class="prob-segment home" style="width: ${probs.homeWin}%">${probs.homeWin}%</div>
                            <div class="prob-segment draw" style="width: ${probs.draw}%">${probs.draw}%</div>
                            <div class="prob-segment away" style="width: ${probs.awayWin}%">${probs.awayWin}%</div>
                        </div>
                    `;
                }

                return `
                    <tr class="upcoming-row" data-home="${m.home}" data-away="${m.away}" data-match-id="${matchId}">
                        <td>
                            <div class="upcoming-match-info">
                                <span class="upcoming-comp">${m.competition}</span>
                                <span class="upcoming-time"><i class="fa-regular fa-clock"></i> ${formattedDate} ${formattedTime}</span>
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-team-cell">
                                <img class="upcoming-team-logo" src="${homeLogo}" onerror="this.src='krynn_logo.png'">
                                <span>${m.home}</span>
                            </div>
                        </td>
                        <td class="win-chance-cell" style="text-align: center;">
                            ${scoreOrProbsHtml}
                        </td>
                        <td>
                            <div class="upcoming-team-cell" style="justify-content: flex-end; text-align: right;">
                                <span>${m.away}</span>
                                <img class="upcoming-team-logo" src="${awayLogo}" onerror="this.src='krynn_logo.png'">
                            </div>
                        </td>
                        <td>
                            <div class="upcoming-actions" style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                                <button class="watch-btn ${isReminded ? 'notify-active' : ''}" 
                                        onclick="toggleMatchReminder('${matchId}', '${m.home.replace(/'/g, "\\'")}', '${m.away.replace(/'/g, "\\'")}', event)" 
                                        style="font-size: 10px; padding: 5px 10px; border-radius: 12px; white-space: nowrap;"
                                        title="Toggle notification reminder">
                                    <i class="${isReminded ? 'fa-solid fa-check' : 'fa-solid fa-bell'}"></i> ${isReminded ? 'Subscribed' : 'Notify'}
                                </button>
                                <div class="calendar-export-actions" style="display: flex; gap: 4px;">
                                    <button class="watch-btn" 
                                            onclick="exportToGoogleCalendar('${m.home.replace(/'/g, "\\'")}', '${m.away.replace(/'/g, "\\'")}', '${m.time}', '${m.status_text.replace(/'/g, "\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(66, 133, 244, 0.15); border-color: rgba(66, 133, 244, 0.4); color: #4285f4; cursor: pointer;"
                                            title="Add to Google Calendar">
                                        <i class="fa-brands fa-google"></i>
                                    </button>
                                    <button class="watch-btn" 
                                            onclick="exportToICS('${m.home.replace(/'/g, "\\'")}', '${m.away.replace(/'/g, "\\'")}', '${m.time}', '${m.status_text.replace(/'/g, "\\'")}', event)"
                                            style="padding: 5px 8px; border-radius: 8px; font-size: 10px; background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15); color: #fff; cursor: pointer;"
                                            title="Download ICS Calendar File">
                                        <i class="fa-regular fa-calendar-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Live Realtime calculations updates loop
        setInterval(() => {
            document.querySelectorAll('.upcoming-row').forEach(row => {
                const home = row.dataset.home;
                const away = row.dataset.away;
                if (!home || !away) return;
                
                const probs = getWinProbability(home, away);
                
                const segHome = row.querySelector('.prob-segment.home');
                if (segHome) {
                    segHome.style.width = probs.homeWin + '%';
                    segHome.textContent = probs.homeWin + '%';
                }
                const segDraw = row.querySelector('.prob-segment.draw');
                if (segDraw) {
                    segDraw.style.width = probs.draw + '%';
                    segDraw.textContent = probs.draw + '%';
                }
                const segAway = row.querySelector('.prob-segment.away');
                if (segAway) {
                    segAway.style.width = probs.awayWin + '%';
                    segAway.textContent = probs.awayWin + '%';
                }
                
                const lblHome = row.querySelector('.lbl-home-win');
                if (lblHome) lblHome.textContent = probs.homeWin + '%';
                const lblDraw = row.querySelector('.lbl-draw-win');
                if (lblDraw) lblDraw.textContent = probs.draw + '%';
                const lblAway = row.querySelector('.lbl-away-win');
                if (lblAway) lblAway.textContent = probs.awayWin + '%';
            });
        }, 3000);

        function showEmptyScoreboard() {
            const grid = document.getElementById('matches-grid');
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted); border: 1px dashed var(--card-border); border-radius: 12px; background: rgba(255,255,255,0.01);">
                    <i class="fa-solid fa-trophy" style="font-size: 32px; color: var(--orange); margin-bottom: 12px; opacity: 0.8;"></i>
                    <p style="font-weight: 600; color: #fff; margin-bottom: 4px;">No Live World Cup Matches Currently</p>
                    <p style="font-size: 12px;">Check back later during match hours. All upcoming and live World Cup fixtures will display here in real-time.</p>
                </div>
            `;
        }

        window.scrollToSection = function(id) {
            const el = document.getElementById(id);
            if (el) {
                let offset = 80;
                if (id === 'hero-section') offset = 100;
                
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + (window.scrollY || window.pageYOffset) - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Highlight active mobile bottom navigation tab
            const btnMap = {
                'hero-section': 0,
                'video-section': 1,
                'scoreboard-section': 2
            };
            const idx = btnMap[id];
            if (idx !== undefined) {
                document.querySelectorAll('.bottom-nav .nav-tab').forEach((tab, i) => {
                    if (i === idx) tab.classList.add('active');
                    else tab.classList.remove('active');
                });
            }
        };

        // Scroll spy listener to update bottom navigation active tabs as the user scrolls
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY || window.pageYOffset;
            const sections = ['hero-section', 'video-section', 'scoreboard-section'];
            let currentSection = 'hero-section';
            
            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop - 120; // offset buffer
                    if (scrollPos >= top) {
                        currentSection = sectionId;
                    }
                }
            }
            
            const btnMap = {
                'hero-section': 0,
                'video-section': 1,
                'scoreboard-section': 2
            };
            const idx = btnMap[currentSection];
            if (idx !== undefined) {
                document.querySelectorAll('.bottom-nav .nav-tab').forEach((tab, i) => {
                    if (i === idx) tab.classList.add('active');
                    else tab.classList.remove('active');
                });
            }
        });

        window.changeAdProvider = function(val) {
            localStorage.setItem('krynn_ad_provider', val);
            window.location.reload();
        };

        // --- Live Chat Toggle Logic ---------------------------------------------
        window.toggleChat = function() {
            const container = document.querySelector('.media-container');
            const chatBtn = document.getElementById('chat-toggle-btn');
            if (!container) return;
            if (container.classList.contains('chat-closed')) {
                container.classList.remove('chat-closed');
                if (chatBtn) chatBtn.classList.add('active');
                localStorage.setItem('krynn_chat_open', 'true');
            } else {
                container.classList.add('chat-closed');
                if (chatBtn) chatBtn.classList.remove('active');
                localStorage.setItem('krynn_chat_open', 'false');
            }
        };

        // --- Upcoming Match Countdown Badge Logic ---
        let badgeInterval = null;

        function getTeamAbbreviation(name) {
            if (!name) return '—';
            if (name.length <= 3) return name.toUpperCase();
            
            const clean = cleanName(name);
            const abbreviations = {
                'algeria': 'ALG',
                'argentina': 'ARG',
                'australia': 'AUS',
                'austria': 'AUT',
                'belgium': 'BEL',
                'bosnia and herzegovina': 'BIH',
                'bosnia & herzegovina': 'BIH',
                'brazil': 'BRA',
                'cabo verde': 'CPV',
                'canada': 'CAN',
                'colombia': 'COL',
                'congo dr': 'COD',
                'congo': 'COD',
                'cote divoire': 'CIV',
                "cote d'ivoire": 'CIV',
                'croatia': 'CRO',
                'curacao': 'CUW',
                'czechia': 'CZE',
                'czech republic': 'CZE',
                'ecuador': 'ECU',
                'egypt': 'EGY',
                'england': 'ENG',
                'france': 'FRA',
                'germany': 'GER',
                'ghana': 'GHA',
                'haiti': 'HAI',
                'iran': 'IRN',
                'iraq': 'IRQ',
                'italy': 'ITA',
                'japan': 'JPN',
                'mexico': 'MEX',
                'morocco': 'MAR',
                'netherlands': 'NED',
                'poland': 'POL',
                'portugal': 'POR',
                'qatar': 'QAT',
                'saudi arabia': 'KSA',
                'senegal': 'SEN',
                'serbia': 'SRB',
                'spain': 'ESP',
                'switzerland': 'SUI',
                'tunisia': 'TUN',
                'united states': 'USA',
                'uruguay': 'URU',
                'wales': 'WAL',
                'south korea': 'KOR',
                'turkiye': 'TUR'
            };
            return abbreviations[clean] || name.substring(0, 3).toUpperCase();
        }

        window.updateUpcomingMatchCountdown = function() {
            if (!window.allWorldCupFixtures) return;

            const badge = document.getElementById('upcoming-match-badge');
            if (!badge) return;

            const now = new Date();
            const upcomingMatches = window.allWorldCupFixtures
                .filter(f => f.status === 'upcoming' && new Date(f.time) > now)
                .sort((a, b) => new Date(a.time) - new Date(b.time));

            if (upcomingMatches.length === 0) {
                badge.classList.remove('show');
                clearInterval(badgeInterval);
                return;
            }

            const nextMatch = upcomingMatches[0];

            const homeLogo = getTeamFlagUrl(nextMatch.home);
            const awayLogo = getTeamFlagUrl(nextMatch.away);
            
            document.getElementById('badge-home-flag').src = homeLogo;
            document.getElementById('badge-away-flag').src = awayLogo;
            document.getElementById('badge-home-name').textContent = getTeamAbbreviation(nextMatch.home);
            document.getElementById('badge-away-name').textContent = getTeamAbbreviation(nextMatch.away);

            badge.classList.add('show');

            clearInterval(badgeInterval);
            const tick = () => {
                const diffMs = new Date(nextMatch.time) - new Date();
                if (diffMs <= 0) {
                    clearInterval(badgeInterval);
                    // Mark as live instantly in local memory to select next match
                    nextMatch.status = 'live';
                    // Switch to the next countdown immediately
                    updateUpcomingMatchCountdown();
                    // Sync scores in the background
                    fetchSportScoreMatches();
                    return;
                }

                const d = Math.floor(diffMs / (24 * 3600 * 1000));
                const h = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000));
                const m = Math.floor((diffMs % (3600 * 1000)) / 60000);
                const s = Math.floor((diffMs % 60000) / 1000);

                const pad = (num) => String(num).padStart(2, '0');

                let timeStr = '';
                if (d > 0) {
                    timeStr = `${d}d ${pad(h)}h ${pad(m)}m`;
                } else {
                    timeStr = `${pad(h)}:${pad(m)}:${pad(s)}`;
                }

                document.getElementById('badge-secs-countdown').textContent = timeStr;
            };

            tick();
            badgeInterval = setInterval(tick, 1000);
        };

        // --- Page Init & Service Worker -----------------------------------------

        document.addEventListener('DOMContentLoaded', () => {
            // Prevent popunder/onclick ads from triggering when clicking inside the video player or chat panel
            const adProtectedElements = [
                document.getElementById('player-frame'),
                document.getElementById('chat-section')
            ];
            adProtectedElements.forEach(el => {
                if (el) {
                    ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(eventType => {
                        el.addEventListener(eventType, (e) => {
                            e.stopPropagation();
                        });
                    });
                }
            });

            // Keyboard shortcuts to switch streams (Arrows for next/prev, Numbers 1-9 for direct selection)
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
                        showSwipeIndicator('next', channelsData[idx].name);
                    }
                }
            });

            // Initialize ad provider selector value
            const adSelect = document.getElementById('ad-provider-select');
            if (adSelect) {
                adSelect.value = localStorage.getItem('krynn_ad_provider') || 'adsterra';
            }

            fetchSportScoreMatches();
            // Refresh scores every 45 seconds
            setInterval(fetchSportScoreMatches, 45000);

            // Run initial channel health check
            checkChannelsHealth();
            // Refresh channel health status every 60 seconds
            setInterval(checkChannelsHealth, 60000);

            // Handle URL-based search queries on load
            const urlParams = new URLSearchParams(window.location.search);
            const queryParam = urlParams.get('search') || urlParams.get('q') || urlParams.get('query');
            if (queryParam) {
                const searchInput = document.getElementById('upcoming-search');
                if (searchInput) {
                    searchInput.value = queryParam;
                    window.showAllUpcoming = true;
                    const btn = document.getElementById('btn-toggle-upcoming');
                    if (btn) {
                        btn.innerHTML = `<i class="fa-solid fa-compress-arrows-alt"></i> Show Next 6`;
                    }
                }
                
                // Wait for fixtures to fetch and render, then scroll to section
                setTimeout(() => {
                    scrollToSection('upcoming-matches-section');
                }, 800);
            }

            // Register PWA Service Worker with cache busting query parameter to force update
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js?v=21')
                        .then(reg => {
                            console.log('Service Worker Registered!', reg.scope);
                            // Force check for updates
                            reg.update();
                        })
                        .catch(err => console.warn('Service Worker registration failed:', err));
                });

                // Reload the page when the service worker changes (e.g. updates) to apply changes
                let refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (!refreshing) {
                        refreshing = true;
                        window.location.reload();
                    }
                });
            }



            // Initialize chat toggle state based on preference and viewport
            const chatPref = localStorage.getItem('krynn_chat_open');
            const container = document.querySelector('.media-container');
            const chatBtn = document.getElementById('chat-toggle-btn');
            const isMobile = window.innerWidth <= 768;

            if (container) {
                if (isMobile || chatPref === 'false') {
                    container.classList.add('chat-closed');
                    if (chatBtn) chatBtn.classList.remove('active');
                } else {
                    container.classList.remove('chat-closed');
                    if (chatBtn) chatBtn.classList.add('active');
                }
            }
        });
    })();

    // ── Fullscreen + Mobile Landscape Rotation ──────────────────────────────
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // iOS pseudo-fullscreen state
    let iosFSActive = false;

    async function toggleFullscreen() {
        const frame = document.getElementById('player-frame');
        if (!frame) return;

        // ── iOS: No native fullscreen API — use CSS transform trick ──
        if (isIOS) {
            if (!iosFSActive) {
                enterIOSFullscreen(frame);
            } else {
                exitIOSFullscreen(frame);
            }
            return;
        }

        // ── Android / Desktop: Use standard Fullscreen API ──
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            try {
                if (frame.requestFullscreen) {
                    await frame.requestFullscreen();
                } else if (frame.webkitRequestFullscreen) {
                    await frame.webkitRequestFullscreen();
                }
            } catch(err) {
                console.warn('Fullscreen error:', err);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    // ── iOS Pseudo-Fullscreen (CSS-based landscape rotation) ──────────────
    function enterIOSFullscreen(frame) {
        iosFSActive = true;
        frame.classList.add('ios-fullscreen');
        document.body.classList.add('ios-fs-active');
        // Try to lock orientation (works on some newer iOS versions with PWA)
        tryLockLandscape();
        // Move watermark into frame
        const wm = document.getElementById('krynn-watermark');
        if (wm) { wm.classList.add('fullscreen-pinned'); }
        const ucmb = document.getElementById('upcoming-match-badge');
        if (ucmb) { ucmb.classList.add('fullscreen-pinned'); }
        // Update fullscreen button icon
        const fsBtn = document.querySelector('.ctrl-btn[onclick="toggleFullscreen()"]');
        if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i> Exit';
    }

    function exitIOSFullscreen(frame) {
        iosFSActive = false;
        frame.classList.remove('ios-fullscreen');
        document.body.classList.remove('ios-fs-active');
        tryUnlockOrientation();
        const wm = document.getElementById('krynn-watermark');
        if (wm) { wm.classList.remove('fullscreen-pinned'); }
        const ucmb = document.getElementById('upcoming-match-badge');
        if (ucmb) { ucmb.classList.remove('fullscreen-pinned'); }
        const fsBtn = document.querySelector('.ctrl-btn[onclick="toggleFullscreen()"]');
        if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Fullscreen';
    }

    // ── Orientation Lock Helpers ─────────────────────────────────────────
    function tryLockLandscape() {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        } else if (window.screen && window.screen.lockOrientation) {
            window.screen.lockOrientation('landscape');
        } else if (window.screen && window.screen.mozLockOrientation) {
            window.screen.mozLockOrientation('landscape');
        } else if (window.screen && window.screen.msLockOrientation) {
            window.screen.msLockOrientation('landscape');
        }
    }

    function tryUnlockOrientation() {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        } else if (window.screen && window.screen.unlockOrientation) {
            window.screen.unlockOrientation();
        } else if (window.screen && window.screen.mozUnlockOrientation) {
            window.screen.mozUnlockOrientation();
        } else if (window.screen && window.screen.msUnlockOrientation) {
            window.screen.msUnlockOrientation();
        }
    }

    // ── Standard Fullscreen Change Handler (Android/Desktop) ────────────
    function handleFullscreenChange() {
        const watermark  = document.getElementById('krynn-watermark');
        const upcomingBadge = document.getElementById('upcoming-match-badge');
        const playerFrame = document.getElementById('player-frame');
        const fsBtn = document.querySelector('.ctrl-btn[onclick="toggleFullscreen()"]');

        const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        if (isFullscreen) {
            const fsEl = document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;
            if (fsEl) {
                if (upcomingBadge && upcomingBadge.parentNode !== fsEl) fsEl.appendChild(upcomingBadge);
                if (watermark && watermark.parentNode !== fsEl) fsEl.appendChild(watermark);
            }
            if (watermark) watermark.classList.add('fullscreen-pinned');
            if (upcomingBadge) upcomingBadge.classList.add('fullscreen-pinned');

            // Lock to landscape on mobile
            if (isMobileDevice) tryLockLandscape();

            if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i> Exit';
        } else {
            if (playerFrame) {
                if (upcomingBadge && upcomingBadge.parentNode !== playerFrame) playerFrame.appendChild(upcomingBadge);
                if (watermark && watermark.parentNode !== playerFrame) playerFrame.appendChild(watermark);
            }
            if (watermark) watermark.classList.remove('fullscreen-pinned');
            if (upcomingBadge) upcomingBadge.classList.remove('fullscreen-pinned');

            // Unlock orientation when exiting
            if (isMobileDevice) tryUnlockOrientation();

            if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Fullscreen';
        }
    }

    document.addEventListener('fullscreenchange',       handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange',    handleFullscreenChange);
    document.addEventListener('MSFullscreenChange',     handleFullscreenChange);

    // Exit iOS pseudo-fullscreen if user rotates back to portrait physically
    if (window.screen && window.screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            if (iosFSActive && screen.orientation.type.includes('portrait')) {
                const frame = document.getElementById('player-frame');
                if (frame) exitIOSFullscreen(frame);
            }
        });
    }
  