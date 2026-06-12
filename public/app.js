// State Management
let state = {
  currentTab: 'live',
  selectedCategory: 'all',
  searchQuery: '',
  categorySearchQuery: '',
  currentPage: 1,
  totalPages: 1,
  categories: [],
  streams: [],
  isLoading: false,
  aliveOnly: false,         // Filter: hide offline channels
  healthData: {},           // { stream_id: { status, checkedAt } }
  healthCheckState: null,   // { status, progress, total, checked }
  healthPollInterval: null,
  favorites: {
    live: [],
    vod: [],
    series: []
  },
  currentPlaying: null,
  syncInterval: null,
  isInitialized: false
};

// Video Players instances
let hlsInstance = null;
let mpegtsInstance = null;

// Category Translation Helper
function formatCategoryName(name) {
  if (!name) return '';
  
  // Standardize country names in category e.g. Netherland -> Netherlands
  let cleanName = name.replace(/\bNetherland\b/i, 'Netherlands');
  
  // Translation map for common Dutch, Italian, and Nordic category terms
  const translations = {
    'Algemeen': 'General',
    'Nasjonale': 'National',
    'Nationale': 'National',
    'Kansalliset': 'National',
    'Nationella': 'National',
    'Sport': 'Sports',
    'Urheilu': 'Sports',
    'Íþróttir': 'Sports',
    'Films en Series': 'Movies & Series',
    'Filmer & Serier': 'Movies & Series',
    'Film & Serier': 'Movies & Series',
    'Elokuvat ja Sarjat': 'Movies & Series',
    'Documentaires en Lifestyle': 'Documentaries & Lifestyle',
    'Dokumentärer & Livsstil': 'Documentaries & Lifestyle',
    'Dokumentarer & Livsstil': 'Documentaries & Lifestyle',
    'Dokumentar & Livsstil': 'Documentaries & Lifestyle',
    'Dokumentit & Elämäntapa': 'Documentaries & Lifestyle',
    'Kinderen': 'Kids',
    'Barn': 'Kids',
    'Børn': 'Kids',
    'Lapset': 'Kids',
    'Bambini': 'Kids',
    'Muziek': 'Music',
    'Musik': 'Music',
    'Musikk': 'Music',
    'Musiikki': 'Music',
    'Regionaal': 'Regional',
    'Regionala': 'Regional',
    'Buitenland': 'International',
    'Underhållning': 'Entertainment',
    'Intrattenimento': 'Entertainment',
    'Viihde': 'Entertainment',
    'Nyheter': 'News',
    'Nyheder': 'News',
    'Uutiset': 'News',
    'Notizie': 'News',
    'Cultura': 'Culture',
    'Solo Audio': 'Audio Only'
  };

  // Perform word replacement dynamically based on map
  for (const [dutch, english] of Object.entries(translations)) {
    const regex = new RegExp('\\b' + dutch + '\\b', 'gi');
    cleanName = cleanName.replace(regex, english);
  }
  
  // Clean up punctuation and spacing
  return cleanName.replace(/\s+/g, ' ').trim();
}

// Media / Channel Title Formatting & Badge Extraction Helper
function formatMediaName(name, type) {
  if (!name) return { cleanedName: '', badge: '' };
  
  let cleanedName = name;
  let badge = '';

  // 1. Quality / Resolution badge detection — including parenthesized forms like (720p), (1080p), (4K)
  const qualityPatterns = [
    { pattern: /[\[\(]?(4K\s*-\s*NC|4K-NC|4K\s*NC)[\]\)]?/i, label: '4K-NC' },
    { pattern: /[\[\(]?(4K|UHD)[\]\)]?/i, label: '4K' },
    { pattern: /[\[\(]?(FHD|FULL\s*HD|FULL-HD|FULLHD|1080p?)[\]\)]?/i, label: 'FHD' },
    { pattern: /[\[\(]?(HD|720p?)[\]\)]?/i, label: 'HD' },
    { pattern: /[\[\(]?(SD|576p?|480p?)[\]\)]?/i, label: 'SD' },
    { pattern: /[\[\(]?(HEVC|H\.?265|x265)[\]\)]?/i, label: 'HEVC' }
  ];

  for (const item of qualityPatterns) {
    if (item.pattern.test(cleanedName)) {
      badge = item.label;
      break;
    }
  }

  // Strip all quality tags from the title (in parentheses, brackets, or bare)
  const stripRegex = /[\[\(]?\s*(4K\s*-\s*NC|4K-NC|4K\s*NC|4K|UHD|FHD|FULL\s*HD|FULL-HD|FULLHD|HD|SD|HEVC|H\.?265|x265|x264|H\.?264|1080p?|720p?|576p?|480p?)\s*[\]\)]?/gi;
  cleanedName = cleanedName.replace(stripRegex, ' ');

  // Strip bracketed annotations like [Not 24/7], [Geo-blocked], [Backup], etc.
  cleanedName = cleanedName.replace(/\[[^\]]*\]/g, '');

  // 2. Expand and translate country/category prefixes
  const prefixMap = {
    'NL': 'Netherlands',
    'WC': 'World Cup',
    'woolrdcup': 'World Cup',
    'worldcup': 'World Cup',
    'US': 'USA',
    'USA': 'USA',
    'UK': 'UK',
    'GB': 'UK',
    'BE': 'Belgium',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'IT': 'Italy',
    'PT': 'Portugal',
    'PL': 'Poland',
    'TR': 'Turkey',
    'AR': 'Arabic',
    'SE': 'Sweden',
    'SWE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'EX-YU': 'Ex-Yugoslavia',
    'VIP': 'VIP'
  };

  const prefixRegex = /^([a-z0-9\-]+)\s*[:\-\|\]\s]+/i;
  const prefixMatch = cleanedName.match(prefixRegex);
  if (prefixMatch) {
    const rawPrefix = prefixMatch[1].trim();
    const mapped = prefixMap[rawPrefix] || prefixMap[rawPrefix.toUpperCase()];
    if (mapped) {
      cleanedName = cleanedName.replace(prefixRegex, mapped + ': ');
    }
  }

  // 3. Fix general typos
  cleanedName = cleanedName.replace(/\bwoolrdcup\b/gi, 'World Cup');
  cleanedName = cleanedName.replace(/\bworldcup\b/gi, 'World Cup');

  // 4. Cleanup parentheses and whitespace
  cleanedName = cleanedName
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove trailing colon or dashes
  cleanedName = cleanedName.replace(/[:\-\|]+$/, '').trim();

  return { cleanedName, badge };
}


// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  initEventListeners();
  loadPortalsList().then(() => checkServerStatus());

  // Poll server status every 20 seconds to keep connection slots and expiry details live
  setInterval(checkServerStatus, 20000);

  // Global image fallback handler
  document.getElementById('streams-grid').addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.style.display = 'none';
      const placeholder = e.target.nextElementSibling;
      if (placeholder) {
        placeholder.classList.remove('hidden');
      }
    }
  }, true); // Capture phase required
});

// Load Favorites from LocalStorage
function loadFavorites() {
  const saved = localStorage.getItem('krynn_favorites');
  if (saved) {
    try {
      state.favorites = JSON.parse(saved);
      // Ensure all arrays exist
      if (!state.favorites.live) state.favorites.live = [];
      if (!state.favorites.vod) state.favorites.vod = [];
      if (!state.favorites.series) state.favorites.series = [];
    } catch (e) {
      console.error('Error parsing favorites', e);
    }
  }
}

// Save Favorites to LocalStorage
function saveFavorites() {
  localStorage.setItem('krynn_favorites', JSON.stringify(state.favorites));
}

// Check if an item is favorited
function isFavorited(type, id) {
  const list = state.favorites[type] || [];
  return list.some(item => String(item.stream_id || item.series_id) === String(id));
}

// Toggle Favorite
function toggleFavorite(type, item) {
  const list = state.favorites[type] || [];
  const id = item.stream_id || item.series_id;
  const index = list.findIndex(i => String(i.stream_id || i.series_id) === String(id));

  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(item);
  }
  
  state.favorites[type] = list;
  saveFavorites();
  updatePlayerFavBtnState();
  
  // Refresh view if on Favorites tab
  if (state.currentTab === 'favorites') {
    renderFavorites();
  } else {
    // Re-render currently visible cards to update hearts
    const cards = document.querySelectorAll(`[data-id="${id}"]`);
    cards.forEach(card => {
      const favInd = card.querySelector('.fav-indicator');
      if (favInd) {
        if (index > -1) {
          favInd.remove();
        }
      } else if (index === -1) {
        const ind = document.createElement('div');
        ind.className = 'fav-indicator';
        ind.innerHTML = '<i class="fa-solid fa-heart"></i>';
        card.appendChild(ind);
      }
    });
  }
}

// Populate the portal select menu from API
async function loadPortalsList() {
  try {
    const res = await fetch('/api/portals');
    const list = await res.json();
    const select = document.getElementById('portal-select');
    if (select) {
      select.innerHTML = '';
      list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name}`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Failed to load portals list', err);
  }
}

// Check server cache & status
async function checkServerStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    
    // Update system widgets
    updateStatusWidget(data);

    // Update active portal select dropdown
    const select = document.getElementById('portal-select');
    if (select && data.activePortalId) {
      select.value = data.activePortalId;
    }

    if (data.sync.status !== 'completed' && data.sync.status !== 'syncing') {
      // Show first-time synchronizer overlay
      document.getElementById('sync-overlay').classList.remove('hidden');
    } else if (data.sync.status === 'syncing') {
      showSyncProgress();
      startSyncPolling();
    } else {
      // Cache completed
      document.getElementById('sync-overlay').classList.add('hidden');
      if (!state.isInitialized) {
        state.isInitialized = true;
        loadTab(state.currentTab);
      }
    }
  } catch (err) {
    console.error('Failed to communicate with local server:', err);
  }
}

// Update status widget elements in the sidebar
function updateStatusWidget(data) {
  const expEl = document.getElementById('sub-expiry');
  const connEl = document.getElementById('sub-conn');
  const cacheEl = document.getElementById('cache-time');
  const dotEl = document.querySelector('.status-dot');

  if (data.subscription) {
    dotEl.classList.add('active');
    
    // Expiry date format
    const expUnix = parseInt(data.subscription.expiry);
    if (isNaN(expUnix) || expUnix === 0) {
      expEl.textContent = 'Unlimited';
    } else {
      const date = new Date(expUnix * 1000);
      expEl.textContent = date.toLocaleDateString();
    }

    connEl.textContent = `${data.subscription.connections} / ${data.subscription.maxConnections}`;
  } else {
    dotEl.classList.remove('active');
    expEl.textContent = 'Offline';
    connEl.textContent = '-';
  }

  if (data.sync && data.sync.lastUpdated) {
    const lastDate = new Date(data.sync.lastUpdated);
    cacheEl.textContent = lastDate.toLocaleDateString() + ' ' + lastDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  } else {
    cacheEl.textContent = 'Never';
  }
}

// Trigger Cache sync
async function startCacheSync() {
  try {
    const res = await fetch('/api/refresh', { method: 'POST' });
    if (res.status === 202 || res.status === 200 || res.status === 409) {
      showSyncProgress();
      startSyncPolling();
    }
  } catch (err) {
    console.error('Error starting cache sync:', err);
    document.getElementById('sync-step').textContent = 'Error starting sync. Reconnecting...';
  }
}

function showSyncProgress() {
  document.getElementById('sync-overlay').classList.remove('hidden');
  document.getElementById('btn-start-sync').classList.add('hidden');
  document.getElementById('sync-progress-container').classList.remove('hidden');
  document.getElementById('btn-sync').classList.add('spinning');
}

function startSyncPolling() {
  if (state.syncInterval) clearInterval(state.syncInterval);
  
  state.syncInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      
      updateStatusWidget(data);
      
      const sync = data.sync;
      document.getElementById('sync-progress-bar').style.width = `${sync.progress}%`;
      document.getElementById('sync-percent').textContent = `${sync.progress}%`;
      document.getElementById('sync-step').textContent = sync.step;

      if (sync.status === 'completed') {
        clearInterval(state.syncInterval);
        document.getElementById('btn-sync').classList.remove('spinning');
        setTimeout(() => {
          document.getElementById('sync-overlay').classList.add('hidden');
          state.isInitialized = true; // Mark as initialized upon successful sync completion
          loadTab(state.currentTab);
        }, 1500);
      } else if (sync.status === 'failed') {
        clearInterval(state.syncInterval);
        document.getElementById('btn-sync').classList.remove('spinning');
        document.getElementById('sync-step').textContent = `Failed: ${sync.error || 'Server error'}`;
        document.getElementById('btn-start-sync').classList.remove('hidden');
        document.getElementById('btn-start-sync').innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Retry Sync';
      }
    } catch (e) {
      console.error('Error polling status', e);
    }
  }, 1000);
}

// --- UI / Navigation Logic ---
function initEventListeners() {
  // Portal switcher dropdown change
  const portalSelect = document.getElementById('portal-select');
  if (portalSelect) {
    portalSelect.addEventListener('change', async (e) => {
      const selectedId = e.target.value;
      closePlayer(); // Stop playing any current video

      // Show switching loader overlay
      document.getElementById('sync-overlay').classList.remove('hidden');
      document.getElementById('sync-step').textContent = 'Switching IPTV portals...';
      document.getElementById('sync-progress-bar').style.width = '0%';
      document.getElementById('sync-percent').textContent = '0%';
      document.getElementById('btn-start-sync').classList.add('hidden');
      document.getElementById('sync-progress-container').classList.remove('hidden');

      try {
        const res = await fetch('/api/portals/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedId })
        });
        const resData = await res.json();

        // Clear dashboard grid lists
        state.isInitialized = false;
        state.selectedCategory = 'all';
        state.searchQuery = '';
        state.currentPage = 1;
        state.streams = [];
        state.categories = [];

        document.getElementById('global-search').value = '';
        document.getElementById('categories-list').innerHTML = '';
        document.getElementById('streams-grid').innerHTML = '';

        // Check the status of the newly selected portal (shows synchronizer if not cached)
        await checkServerStatus();
      } catch (err) {
        console.error('Error switching portal:', err);
      }
    });
  }

  // Sidebar Tabs
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navBtns.forEach(b => b.classList.remove('active'));
      const activeBtn = e.currentTarget;
      activeBtn.classList.add('active');
      
      const tab = activeBtn.dataset.tab;
      state.currentTab = tab;
      
      // Update global search placeholder
      const searchInput = document.getElementById('global-search');
      if (tab === 'live') searchInput.placeholder = 'Search live channels...';
      else if (tab === 'vod') searchInput.placeholder = 'Search movies...';
      else if (tab === 'series') searchInput.placeholder = 'Search series...';
      else searchInput.placeholder = 'Search favorites...';

      searchInput.value = '';
      state.searchQuery = '';
      state.selectedCategory = 'all';
      
      loadTab(tab);
    });
  });

  // Global Search input
  const searchInput = document.getElementById('global-search');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      state.currentPage = 1;
      if (state.currentTab === 'favorites') {
        renderFavorites();
      } else {
        loadStreams(false);
      }
    }, 400);
  });

  // Category Search input
  const catSearchInput = document.getElementById('category-search');
  catSearchInput.addEventListener('input', (e) => {
    state.categorySearchQuery = e.target.value.toLowerCase();
    renderCategoryList();
  });

  // Pinned Video Player controls
  document.getElementById('btn-close-player').addEventListener('click', closePlayer);
  document.getElementById('stream-format').addEventListener('change', () => {
    if (state.currentPlaying) {
      const format = document.getElementById('stream-format').value;
      startVideoPlayback(state.currentPlaying.type, state.currentPlaying.id, format);
    }
  });

  document.getElementById('btn-player-fav').addEventListener('click', () => {
    if (state.currentPlaying) {
      toggleFavorite(state.currentPlaying.type, state.currentPlaying.raw);
    }
  });

  // First-time Sync triggers
  document.getElementById('btn-start-sync').addEventListener('click', startCacheSync);
  document.getElementById('btn-sync').addEventListener('click', startCacheSync);

  // Infinite Scroll binding on streams container
  const grid = document.getElementById('streams-grid');
  grid.addEventListener('scroll', () => {
    if (state.currentTab === 'favorites') return;
    
    const nearBottom = grid.scrollHeight - grid.scrollTop - grid.clientHeight < 200;
    if (nearBottom && !state.isLoading && state.currentPage < state.totalPages) {
      state.currentPage++;
      loadStreams(true);
    }
  });

  // Retry playback click
  document.getElementById('btn-retry-stream').addEventListener('click', () => {
    if (state.currentPlaying) {
      const format = document.getElementById('stream-format').value;
      startVideoPlayback(state.currentPlaying.type, state.currentPlaying.id, format);
    }
  });

  // Hero Banner — World Cup / FIFA+ Play button
  document.getElementById('btn-hero-play').addEventListener('click', () => {
    const activePill = document.querySelector('.channel-pill.active');
    const streamId = activePill ? activePill.dataset.streamId : '100073';
    const streamName = activePill ? activePill.dataset.streamName : 'FIFA+';
    playWorldCupChannel(streamId, streamName);
  });

  // Language pill clicks — switch FIFA+ language
  document.querySelectorAll('.channel-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.channel-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const btn = document.getElementById('btn-hero-play');
      btn.innerHTML = `<i class="fa-solid fa-play"></i> Watch ${pill.dataset.streamName.replace('FIFA+ ', '') || 'FIFA+'}`;
      // If player is playing a FIFA+ channel, switch language instantly
      const id = state.currentPlaying ? String(state.currentPlaying.id) : '';
      if (id >= '100073' && id <= '100081') {
        playWorldCupChannel(pill.dataset.streamId, pill.dataset.streamName);
      }
    });
  });

  // Hero Fav button
  document.getElementById('btn-hero-fav').addEventListener('click', () => {
    const activePill = document.querySelector('.channel-pill.active');
    if (!activePill) return;
    const streamId = activePill.dataset.streamId;
    const matched = state.streams.find(i => String(i.stream_id) === String(streamId));
    const itemToFav = matched || {
      stream_id: streamId,
      name: activePill.dataset.streamName,
      stream_icon: '',
      url: '',
      category_name: 'Sports',
      stream_type: 'live'
    };
    toggleFavorite('live', itemToFav);
    const isFav = isFavorited('live', streamId);
    const btn = document.getElementById('btn-hero-fav');
    btn.innerHTML = isFav
      ? '<i class="fa-solid fa-heart"></i> Favorited'
      : '<i class="fa-regular fa-heart"></i> Add to Favorites';
  });

  // Filter toggle — hide offline channels
  document.getElementById('btn-filter-alive').addEventListener('click', () => {
    state.aliveOnly = !state.aliveOnly;
    const btn = document.getElementById('btn-filter-alive');
    if (state.aliveOnly) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fa-solid fa-signal"></i> Online Only';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fa-solid fa-signal"></i> All Channels';
    }
    state.currentPage = 1;
    loadStreams(false);
  });

  // Health check button
  document.getElementById('btn-health-check').addEventListener('click', async () => {
    const btn = document.getElementById('btn-health-check');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';
    try {
      const res = await fetch('/api/channels/health-check', { method: 'POST' });
      if (res.ok) {
        startHealthPolling();
      } else {
        const d = await res.json();
        btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${d.message}`;
        btn.disabled = false;
      }
    } catch(e) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Check Channels';
    }
  });


}

// Load Content for active Tab
async function loadTab(tab) {
  // Clear layout
  const catPanel = document.querySelector('.categories-panel');
  if (tab === 'favorites') {
    catPanel.classList.add('hidden');
    document.getElementById('current-category-title').textContent = 'My Favorites';
    renderFavorites();
  } else {
    catPanel.classList.remove('hidden');
    state.categorySearchQuery = '';
    document.getElementById('category-search').value = '';
    await loadCategories();
    loadStreams(false);
  }
}

// Load categories list from API
async function loadCategories() {
  try {
    const res = await fetch(`/api/categories?type=${state.currentTab}`);
    const data = await res.json();
    state.categories = data;
    renderCategoryList();
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

// Render category elements in sidebar
function renderCategoryList() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';

  // Add "All" Category
  const allItem = document.createElement('button');
  allItem.className = `category-item ${state.selectedCategory === 'all' ? 'active' : ''}`;
  allItem.innerHTML = `
    <span class="category-name">All Channels</span>
  `;
  allItem.addEventListener('click', () => selectCategory('all', 'All Channels'));
  container.appendChild(allItem);

  const query = state.categorySearchQuery;
  const filtered = state.categories.filter(cat => 
    cat.category_name && cat.category_name.toLowerCase().includes(query)
  );

  filtered.forEach(cat => {
    const catItem = document.createElement('button');
    const formattedName = formatCategoryName(cat.category_name);
    catItem.className = `category-item ${state.selectedCategory === cat.category_id ? 'active' : ''}`;
    catItem.innerHTML = `
      <span class="category-name">${formattedName}</span>
    `;
    catItem.addEventListener('click', () => selectCategory(cat.category_id, cat.category_name));
    container.appendChild(catItem);
  });
}

function selectCategory(id, name) {
  state.selectedCategory = id;
  document.getElementById('current-category-title').textContent = formatCategoryName(name);
  state.currentPage = 1;
  
  // Highlight active
  const items = document.querySelectorAll('.category-item');
  items.forEach(item => item.classList.remove('active'));
  
  // Re-render categories (to ensure scroll states or active styles remain correct)
  renderCategoryList();
  loadStreams(false);
}

// Load streams from API and render
async function loadStreams(append = false) {
  if (state.isLoading) return;
  
  state.isLoading = true;
  const loader = document.getElementById('grid-loader');
  loader.classList.remove('hidden');

  if (!append) {
    document.getElementById('streams-grid').innerHTML = '';
  }

  try {
    const url = `/api/streams?type=${state.currentTab}&category_id=${state.selectedCategory}&search=${encodeURIComponent(state.searchQuery)}&page=${state.currentPage}&limit=50&alive_only=${state.aliveOnly}`;
    const res = await fetch(url);
    const data = await res.json();

    state.totalPages = data.pagination.totalPages;
    document.getElementById('stream-count').textContent = `${data.pagination.total} items`;

    renderStreamCards(data.items, append);
  } catch (err) {
    console.error('Error loading streams', err);
  } finally {
    state.isLoading = false;
    loader.classList.add('hidden');
  }
}

// Render grid cards dynamically
function renderStreamCards(items, append) {
  const container = document.getElementById('streams-grid');
  if (!append) container.innerHTML = '';

  if (items.length === 0 && !append) {
    container.innerHTML = `
      <div class="grid-loader">
        <i class="fa-solid fa-folder-open" style="font-size: 32px; color: var(--text-muted);"></i>
        <span>No streams found. Try searching or syncing.</span>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    const isFav = isFavorited(state.currentTab, item.stream_id || item.series_id);
    // Health badge
    const health = item._health;
    let healthDotHtml = '';
    if (health) {
      if (health.status >= 200 && health.status < 400) {
        healthDotHtml = '<span class="health-dot online" title="Online"></span>';
      } else {
        healthDotHtml = '<span class="health-dot offline" title="Offline"></span>';
      }
    }

    if (state.currentTab === 'live') {
      const formatted = formatMediaName(item.name, 'live');
      const logoHtml = item.stream_icon && item.stream_icon.trim() !== ''
        ? `<img src="${item.stream_icon}" alt="" loading="lazy">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-tv"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-tv"></i></div>`;

      card.className = 'stream-card';
      card.setAttribute('data-id', item.stream_id);
      card.innerHTML = `
        ${isFav ? '<div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>' : ''}
        ${healthDotHtml}
        ${formatted.badge ? `<div class="stream-resolution-badge">${formatted.badge}</div>` : ''}
        <div class="stream-logo-container">
          ${logoHtml}
        </div>
        <div class="stream-card-title">${formatted.cleanedName}</div>
      `;
      card.addEventListener('click', () => {
        playLiveStream(item);
      });

    } else if (state.currentTab === 'vod') {
      const formatted = formatMediaName(item.name, 'vod');
      const posterHtml = item.stream_icon && item.stream_icon.trim() !== ''
        ? `<img src="${item.stream_icon}" alt="" loading="lazy">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-film"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-film"></i></div>`;

      card.className = 'stream-card poster-card';
      card.setAttribute('data-id', item.stream_id);
      card.innerHTML = `
        <div class="poster-img-container">
          ${isFav ? '<div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>' : ''}
          ${formatted.badge ? `<div class="poster-overlay-badge">${formatted.badge}</div>` : ''}
          ${posterHtml}
          ${item.rating && parseFloat(item.rating) > 0 ? `<div class="poster-overlay-rating"><i class="fa-solid fa-star"></i> ${parseFloat(item.rating).toFixed(1)}</div>` : ''}
        </div>
        <div class="poster-card-title">${formatted.cleanedName}</div>
        <div class="poster-card-meta">${item.container_extension ? item.container_extension.toUpperCase() : 'Movie'}</div>
      `;
      card.addEventListener('click', () => {
        showMovieDetails(item);
      });
    } else if (state.currentTab === 'series') {
      const formatted = formatMediaName(item.name, 'series');
      const coverHtml = item.cover && item.cover.trim() !== ''
        ? `<img src="${item.cover}" alt="" loading="lazy">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-clapperboard"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-clapperboard"></i></div>`;

      card.className = 'stream-card poster-card';
      card.setAttribute('data-id', item.series_id);
      card.innerHTML = `
        <div class="poster-img-container">
          ${isFav ? '<div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>' : ''}
          ${formatted.badge ? `<div class="poster-overlay-badge">${formatted.badge}</div>` : ''}
          ${coverHtml}
          ${item.rating && parseFloat(item.rating) > 0 ? `<div class="poster-overlay-rating"><i class="fa-solid fa-star"></i> ${parseFloat(item.rating).toFixed(1)}</div>` : ''}
        </div>
        <div class="poster-card-title">${formatted.cleanedName}</div>
        <div class="poster-card-meta">Series</div>
      `;
      card.addEventListener('click', () => {
        showSeriesDetails(item);
      });
    }

    container.appendChild(card);
  });
}

// Render Favorites view locally (no backend pagination needed)
function renderFavorites() {
  const container = document.getElementById('streams-grid');
  container.innerHTML = '';

  const q = state.searchQuery.toLowerCase();
  
  // Combine all types or just render sections
  let combined = [];
  ['live', 'vod', 'series'].forEach(type => {
    let items = state.favorites[type] || [];
    if (q) {
      items = items.filter(item => item.name && item.name.toLowerCase().includes(q));
    }
    // Tag them with their tab type
    items = items.map(item => ({ ...item, _favType: type }));
    combined = combined.concat(items);
  });

  document.getElementById('stream-count').textContent = `${combined.length} items`;

  if (combined.length === 0) {
    container.innerHTML = `
      <div class="grid-loader">
        <i class="fa-solid fa-heart-crack" style="font-size: 32px; color: var(--text-muted);"></i>
        <span>No favorites saved. Click the heart icons on channels to add them!</span>
      </div>
    `;
    return;
  }

  combined.forEach(item => {
    const card = document.createElement('div');
    const type = item._favType;

    if (type === 'live') {
      const formatted = formatMediaName(item.name, 'live');
      const logoHtml = item.stream_icon && item.stream_icon.trim() !== ''
        ? `<img src="${item.stream_icon}" alt="">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-tv"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-tv"></i></div>`;

      card.className = 'stream-card';
      card.innerHTML = `
        <div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>
        ${formatted.badge ? `<div class="stream-resolution-badge">${formatted.badge}</div>` : ''}
        <div class="stream-logo-container">
          ${logoHtml}
        </div>
        <div class="stream-card-title">${formatted.cleanedName}</div>
      `;
      card.addEventListener('click', () => {
        playLiveStream(item);
      });
    } else if (type === 'vod') {
      const formatted = formatMediaName(item.name, 'vod');
      const posterHtml = item.stream_icon && item.stream_icon.trim() !== ''
        ? `<img src="${item.stream_icon}" alt="">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-film"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-film"></i></div>`;

      card.className = 'stream-card poster-card';
      card.innerHTML = `
        <div class="poster-img-container">
          <div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>
          ${formatted.badge ? `<div class="poster-overlay-badge">${formatted.badge}</div>` : ''}
          ${posterHtml}
          ${item.rating && parseFloat(item.rating) > 0 ? `<div class="poster-overlay-rating"><i class="fa-solid fa-star"></i> ${parseFloat(item.rating).toFixed(1)}</div>` : ''}
        </div>
        <div class="poster-card-title">${formatted.cleanedName}</div>
        <div class="poster-card-meta">${item.container_extension ? item.container_extension.toUpperCase() : 'Movie'}</div>
      `;
      card.addEventListener('click', () => {
        showMovieDetails(item);
      });
    } else if (type === 'series') {
      const formatted = formatMediaName(item.name, 'series');
      const coverHtml = item.cover && item.cover.trim() !== ''
        ? `<img src="${item.cover}" alt="">
           <div class="logo-placeholder hidden"><i class="fa-solid fa-clapperboard"></i></div>`
        : `<div class="logo-placeholder"><i class="fa-solid fa-clapperboard"></i></div>`;

      card.className = 'stream-card poster-card';
      card.innerHTML = `
        <div class="poster-img-container">
          <div class="fav-indicator"><i class="fa-solid fa-heart"></i></div>
          ${formatted.badge ? `<div class="poster-overlay-badge">${formatted.badge}</div>` : ''}
          ${coverHtml}
          ${item.rating && parseFloat(item.rating) > 0 ? `<div class="poster-overlay-rating"><i class="fa-solid fa-star"></i> ${parseFloat(item.rating).toFixed(1)}</div>` : ''}
        </div>
        <div class="poster-card-title">${formatted.cleanedName}</div>
        <div class="poster-card-meta">Series</div>
      `;
      card.addEventListener('click', () => {
        showSeriesDetails(item);
      });
    }

    container.appendChild(card);
  });
}

// --- VIDEO PLAYER CONTROL ---

function playLiveStream(channel) {
  // Show right player panel
  const playerPanel = document.getElementById('player-panel');
  playerPanel.classList.remove('hidden');

  // Set Metadata
  const formatted = formatMediaName(channel.name, 'live');
  document.getElementById('player-title').textContent = formatted.cleanedName;
  document.getElementById('player-logo').src = channel.stream_icon || '';
  document.getElementById('player-category').textContent = 'Live Sports';
  document.getElementById('player-epg').textContent = channel.epg_channel_id 
    ? 'EPG: ' + channel.epg_channel_id 
    : (channel.category_name || 'Sports');

  // Auto-detect format:
  // 1. If channel has a direct URL, check if it's m3u8
  // 2. If stream_id >= 100000, it's from the M3U portal (all are m3u8 HLS)
  // 3. Otherwise default to ts
  const formatSelect = document.getElementById('stream-format');
  let format = 'ts';
  const streamIdNum = parseInt(channel.stream_id);
  if (channel.url && channel.url.toLowerCase().includes('.m3u8')) {
    format = 'm3u8';
  } else if (streamIdNum >= 100000) {
    // M3U portal streams — all use HLS
    format = 'm3u8';
  }
  formatSelect.value = format;

  state.currentPlaying = {
    type: 'live',
    id: channel.stream_id,
    title: formatted.cleanedName,
    raw: channel
  };

  updatePlayerFavBtnState();
  startVideoPlayback('live', channel.stream_id, format);
}


function updatePlayerFavBtnState() {
  const favBtn = document.getElementById('btn-player-fav');
  if (state.currentPlaying) {
    const isFav = isFavorited(state.currentPlaying.type, state.currentPlaying.id);
    if (isFav) {
      favBtn.classList.add('active');
      favBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Favorited';
    } else {
      favBtn.classList.remove('active');
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Favorite';
    }
  }
}

function startVideoPlayback(type, id, format) {
  const video = document.getElementById('main-video');
  const errorOverlay = document.getElementById('player-error-overlay');
  const loadingOverlay = document.getElementById('player-loading-overlay');
  
  // Hide native controls while loading
  video.removeAttribute('controls');

  errorOverlay.classList.add('hidden');
  loadingOverlay.classList.remove('hidden');

  // Reset players
  destroyPlayers();

  const playUrl = `/api/play/${type}/${id}?ext=${format}`;
  console.log('Playing stream:', playUrl, 'Format:', format);

  video.src = '';
  
  if (format === 'm3u8') {
    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(playUrl);
      hlsInstance.attachMedia(video);
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        loadingOverlay.classList.add('hidden');
        video.setAttribute('controls', 'true'); // Show native controls once video is ready to play
        video.play().catch(e => console.error('Play request failed', e));
      });

      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          console.error('HLS Fatal error:', data);
          
          // Test if 456 error or other network blockage
          testStreamError(playUrl);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = playUrl;
      video.addEventListener('loadedmetadata', () => {
        loadingOverlay.classList.add('hidden');
        video.setAttribute('controls', 'true'); // Show native controls
        video.play().catch(e => console.error('Native play failed', e));
      });
      video.addEventListener('error', () => {
        testStreamError(playUrl);
      });
    } else {
      showPlaybackError('HLS streaming is not supported on this browser.');
    }
  } else {
    // TS or direct movie files (MKV/MP4)
    if (format === 'ts' && mpegts.isSupported()) {
      mpegtsInstance = mpegts.createPlayer({
        type: 'mse', // MPEG-TS demuxer
        url: playUrl,
        isLive: type === 'live'
      });
      mpegtsInstance.attachMediaElement(video);
      mpegtsInstance.load();
      
      video.addEventListener('playing', () => {
        loadingOverlay.classList.add('hidden');
        video.setAttribute('controls', 'true'); // Show native controls
      }, { once: true });

      video.play().catch(e => {
        console.error('Mpegts play request failed', e);
      });

      mpegtsInstance.on('error', (errorType, errorDetail, errorInfo) => {
        console.error('Mpegts error:', errorType, errorDetail, errorInfo);
        testStreamError(playUrl);
      });
    } else {
      // Fallback: standard html5 source (great for mp4/mkv movies or native playback)
      video.src = playUrl;
      video.addEventListener('loadedmetadata', () => {
        loadingOverlay.classList.add('hidden');
        video.setAttribute('controls', 'true'); // Show native controls
        video.play().catch(e => console.error('Direct file play failed', e));
      });
      video.addEventListener('error', () => {
        testStreamError(playUrl);
      });
    }
  }
}

// Background test to check if playback error is due to active connections limit (456)
async function testStreamError(streamUrl) {
  const checkUrl = streamUrl.replace('/api/play/', '/api/check-stream/');

  try {
    const res = await fetch(checkUrl);
    const data = await res.json();

    if (data.status === 456) {
      showPlaybackError('Connection Limit Exceeded (Error 456). Please stop streaming on other devices and try again.', true);
    } else if (data.status === 200) {
      showPlaybackError('Stream is active, but your browser is having trouble playing this format. Try switching the format (TS/HLS) or reconnecting.', false);
    } else if (data.status === 408) {
      showPlaybackError('Stream request timed out. Provider might be offline or slow to respond.', false);
    } else {
      showPlaybackError(`Stream unavailable (Status ${data.status || 'Unknown'}). Provider might be offline.`, false);
    }
  } catch (err) {
    showPlaybackError('Failed to fetch stream status from server.', false);
  }
}

function showPlaybackError(msg, is456 = false) {
  document.getElementById('player-loading-overlay').classList.add('hidden');
  const errOverlay = document.getElementById('player-error-overlay');
  errOverlay.classList.remove('hidden');
  
  // Hide native controls while error overlay is showing
  document.getElementById('main-video').removeAttribute('controls');
  
  const textEl = errOverlay.querySelector('p');
  const titleEl = errOverlay.querySelector('h4');
  
  if (is456) {
    titleEl.textContent = 'Connection Limit Exceeded (Error 456)';
    textEl.textContent = 'Your IPTV subscription is limited to 1 connection, which is currently in use. Stop playback on other devices and try again.';
  } else {
    titleEl.textContent = 'Playback Failed';
    textEl.textContent = msg;
  }
}

function destroyPlayers() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  if (mpegtsInstance) {
    mpegtsInstance.destroy();
    mpegtsInstance = null;
  }
  const video = document.getElementById('main-video');
  video.pause();
  video.removeAttribute('src');
  video.load();
}

function closePlayer() {
  destroyPlayers();
  document.getElementById('player-panel').classList.add('hidden');
  state.currentPlaying = null;
  document.getElementById('main-video').removeAttribute('controls'); // Hide native controls
}

// --- MODALS FOR VOD AND SERIES ---

// Movie modal
function showMovieDetails(movie) {
  const modal = document.getElementById('movie-modal');
  modal.classList.remove('hidden');

  document.getElementById('movie-title').textContent = movie.name;
  document.getElementById('movie-poster').src = movie.stream_icon;
  document.getElementById('movie-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${movie.rating ? parseFloat(movie.rating).toFixed(1) : '0.0'}`;
  
  const addedDate = movie.added ? new Date(parseInt(movie.added) * 1000).getFullYear() : 'N/A';
  document.getElementById('movie-added').textContent = `Added: ${addedDate}`;
  document.getElementById('movie-format').textContent = movie.container_extension ? movie.container_extension.toUpperCase() : 'VOD';
  document.getElementById('movie-plot').textContent = movie.plot || 'No movie plot info returned from server.';

  // Favoriting
  const favBtn = document.getElementById('btn-fav-movie');
  const updateFavBtn = () => {
    if (isFavorited('vod', movie.stream_id)) {
      favBtn.classList.add('active');
      favBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Added to Favorites';
    } else {
      favBtn.classList.remove('active');
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favorites';
    }
  };
  
  favBtn.onclick = () => {
    toggleFavorite('vod', movie);
    updateFavBtn();
  };
  
  updateFavBtn();

  // Play button
  document.getElementById('btn-play-movie').onclick = () => {
    closeMovieModal();
    
    // Play movie
    const playerPanel = document.getElementById('player-panel');
    playerPanel.classList.remove('hidden');

    document.getElementById('player-title').textContent = movie.name;
    document.getElementById('player-logo').src = movie.stream_icon;
    document.getElementById('player-category').textContent = 'Movie VOD';
    document.getElementById('player-epg').textContent = movie.plot || 'No description.';

    // Ext selector
    const formatSelect = document.getElementById('stream-format');
    formatSelect.value = movie.container_extension || 'mp4';

    state.currentPlaying = {
      type: 'vod',
      id: movie.stream_id,
      title: movie.name,
      raw: movie
    };

    updatePlayerFavBtnState();
    startVideoPlayback('vod', movie.stream_id, movie.container_extension || 'mp4');
  };
}

function closeMovieModal() {
  document.getElementById('movie-modal').classList.add('hidden');
}

// Series Modal
let activeSeriesEpisodes = {};

async function showSeriesDetails(series) {
  const modal = document.getElementById('series-modal');
  modal.classList.remove('hidden');

  document.getElementById('series-title').textContent = series.name;
  
  // Set backdrop
  const backdropUrl = (series.backdrop_path && series.backdrop_path.length > 0) ? series.backdrop_path[0] : '';
  const backdropEl = document.getElementById('series-backdrop');
  if (backdropUrl) {
    backdropEl.style.backgroundImage = `url('${backdropUrl}')`;
  } else {
    backdropEl.style.backgroundImage = `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`;
  }

  document.getElementById('series-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${series.rating ? parseFloat(series.rating).toFixed(1) : '0.0'}`;
  document.getElementById('series-genre').textContent = series.genre || 'TV Series';
  document.getElementById('series-release').textContent = series.releaseDate || '2026';
  document.getElementById('series-plot').textContent = series.plot || 'No overview details.';
  document.getElementById('series-cast').textContent = series.cast || 'Unknown cast.';
  document.getElementById('series-director').textContent = series.director || 'Unknown director.';

  // Favorites
  const favBtn = document.getElementById('btn-fav-series');
  const updateFavBtn = () => {
    if (isFavorited('series', series.series_id)) {
      favBtn.classList.add('active');
      favBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Added to Favorites';
    } else {
      favBtn.classList.remove('active');
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favorites';
    }
  };
  favBtn.onclick = () => {
    toggleFavorite('series', series);
    updateFavBtn();
  };
  updateFavBtn();

  // Clear season selector and episodes
  const seasonSelect = document.getElementById('seasons-select');
  seasonSelect.innerHTML = '<option value="">Loading...</option>';
  document.getElementById('episodes-list').innerHTML = '';

  try {
    const res = await fetch(`/api/series-info/${series.series_id}`);
    const data = await res.json();
    
    // Cache episodes list
    activeSeriesEpisodes = data.episodes || {};

    // Populate Seasons select
    seasonSelect.innerHTML = '';
    const seasonsList = data.seasons || [];
    
    if (seasonsList.length === 0 && Object.keys(activeSeriesEpisodes).length > 0) {
      // Fallback: create seasons from episodes keys
      Object.keys(activeSeriesEpisodes).forEach(seasonNum => {
        const opt = document.createElement('option');
        opt.value = seasonNum;
        opt.textContent = `Season ${seasonNum}`;
        seasonSelect.appendChild(opt);
      });
    } else {
      seasonsList.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.season_number;
        opt.textContent = s.name || `Season ${s.season_number}`;
        seasonSelect.appendChild(opt);
      });
    }

    // Change season listener
    seasonSelect.onchange = () => {
      renderEpisodes(seasonSelect.value, series);
    };

    // Render first season episodes
    if (seasonSelect.value) {
      renderEpisodes(seasonSelect.value, series);
    } else {
      document.getElementById('episodes-list').innerHTML = '<span>No episodes found.</span>';
    }
  } catch (err) {
    console.error('Error fetching series details', err);
    seasonSelect.innerHTML = '<option value="">Failed to load seasons</option>';
  }
}

function renderEpisodes(seasonNum, series) {
  const container = document.getElementById('episodes-list');
  container.innerHTML = '';

  const episodes = activeSeriesEpisodes[seasonNum] || [];
  if (episodes.length === 0) {
    container.innerHTML = '<span>No episodes available in this season.</span>';
    return;
  }

  // Sort episodes by episode number
  episodes.sort((a, b) => parseInt(a.episode_num) - parseInt(b.episode_num));

  episodes.forEach(ep => {
    const item = document.createElement('div');
    item.className = 'episode-item';
    item.innerHTML = `
      <div class="episode-title-col">
        <span class="episode-number">Episode ${ep.episode_num}</span>
        <span class="episode-name">${ep.title || `Episode ${ep.episode_num}`}</span>
      </div>
      <div class="episode-duration">${ep.info ? (ep.info.duration || '') : ''}</div>
    `;

    item.onclick = () => {
      closeSeriesModal();

      // Play episode in player panel
      const playerPanel = document.getElementById('player-panel');
      playerPanel.classList.remove('hidden');

      document.getElementById('player-title').textContent = `${series.name} - S${String(seasonNum).padStart(2, '0')}E${String(ep.episode_num).padStart(2, '0')}`;
      document.getElementById('player-logo').src = ep.info ? (ep.info.movie_image || series.cover) : series.cover;
      document.getElementById('player-category').textContent = 'Series Episode';
      document.getElementById('player-epg').textContent = ep.title || 'No description.';

      // Format selector
      const formatSelect = document.getElementById('stream-format');
      formatSelect.value = ep.container_extension || 'mkv';

      state.currentPlaying = {
        type: 'series',
        id: ep.id,
        title: ep.title,
        raw: series // Save the actual series for favorites context
      };

      updatePlayerFavBtnState();
      startVideoPlayback('series', ep.id, ep.container_extension || 'mkv');
    };

    container.appendChild(item);
  });
}

function closeSeriesModal() {
  document.getElementById('series-modal').classList.add('hidden');
}

// Global functions for modals
window.closeMovieModal = closeMovieModal;
window.closeSeriesModal = closeSeriesModal;
