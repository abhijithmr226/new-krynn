require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load portals configuration
const IS_VERCEL = !!process.env.VERCEL;
let CONFIG_DIR = path.join(__dirname, 'data');

if (IS_VERCEL) {
  const tmpDataDir = path.join('/tmp', 'data');
  try {
    if (!fs.existsSync(tmpDataDir)) {
      fs.mkdirSync(tmpDataDir, { recursive: true });
    }
    if (fs.existsSync(CONFIG_DIR)) {
      fs.cpSync(CONFIG_DIR, tmpDataDir, { recursive: true });
      console.log('[Vercel Setup] Successfully copied data directory to /tmp/data');
    }
    CONFIG_DIR = tmpDataDir;
  } catch (err) {
    console.error('[Vercel Setup] Failed to copy data directory:', err);
  }
} else {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

const PORTALS_PATH = path.join(CONFIG_DIR, 'portals.json');
let portals = [];
if (fs.existsSync(PORTALS_PATH)) {
  portals = JSON.parse(fs.readFileSync(PORTALS_PATH, 'utf8'));
} else {
  console.error('portals.json config missing!');
}

let activePortalId = '1'; // Default active portal is Zapto (Portal 1)

// Helper to get active portal object
function getActivePortal() {
  return portals.find(p => p.id === activePortalId) || portals[0];
}

// Helper to get cache directory for the active portal
function getPortalDataDir() {
  const dir = path.join(CONFIG_DIR, 'portal_' + activePortalId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// In-Memory Cache
let cache = {
  userInfo: null,
  liveCategories: [],
  liveStreams: [],
  vodCategories: [],
  vodStreams: [],
  seriesCategories: [],
  seriesStreams: []
};

// Syncing State
let syncState = {
  status: 'idle', // 'idle', 'syncing', 'completed', 'failed'
  step: '',       // current step name
  progress: 0,    // percentage
  error: null,
  lastUpdated: null
};

// Channel Health Cache: { [stream_id]: { status: 200|0, checkedAt: Date } }
let channelHealth = {};
let healthCheckState = { status: 'idle', progress: 0, total: 0, checked: 0 };

// Load health cache from disk
function loadHealthFromDisk() {
  try {
    const portalDir = getPortalDataDir();
    const healthPath = path.join(portalDir, 'channel_health.json');
    if (fs.existsSync(healthPath)) {
      channelHealth = JSON.parse(fs.readFileSync(healthPath, 'utf8'));
      console.log(`[Health] Loaded ${Object.keys(channelHealth).length} health records from disk.`);
    }
  } catch (e) {
    console.warn('[Health] Failed to load health cache:', e.message);
    channelHealth = {};
  }
}

// Background channel health checker — checks all M3U streams concurrently in batches
async function runHealthCheck(streams) {
  if (healthCheckState.status === 'running') return;
  healthCheckState = { status: 'running', progress: 0, total: streams.length, checked: 0 };
  console.log(`[Health] Starting health check for ${streams.length} channels...`);

  const BATCH_SIZE = 12;
  const TIMEOUT_MS = 5000;
  const portalDir = getPortalDataDir();

  for (let i = 0; i < streams.length; i += BATCH_SIZE) {
    const batch = streams.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(batch.map(async (stream) => {
      if (!stream.url) {
        channelHealth[stream.stream_id] = { status: 0, checkedAt: new Date().toISOString() };
        return;
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(stream.url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        clearTimeout(timeoutId);
        channelHealth[stream.stream_id] = { status: res.status, checkedAt: new Date().toISOString() };
      } catch (err) {
        // If HEAD fails, try GET with abort
        try {
          const ctrl2 = new AbortController();
          const t2 = setTimeout(() => ctrl2.abort(), TIMEOUT_MS);
          const res2 = await fetch(stream.url, {
            method: 'GET',
            signal: ctrl2.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          clearTimeout(t2);
          ctrl2.abort(); // don't download body
          channelHealth[stream.stream_id] = { status: res2.status, checkedAt: new Date().toISOString() };
        } catch {
          channelHealth[stream.stream_id] = { status: 0, checkedAt: new Date().toISOString() };
        }
      }
    }));

    healthCheckState.checked = Math.min(i + BATCH_SIZE, streams.length);
    healthCheckState.progress = Math.round((healthCheckState.checked / streams.length) * 100);
  }

  // Save to disk
  try {
    const healthPath = path.join(portalDir, 'channel_health.json');
    fs.writeFileSync(healthPath, JSON.stringify(channelHealth));
  } catch(e) { console.warn('[Health] Failed to save health cache:', e.message); }

  const alive = Object.values(channelHealth).filter(h => h.status >= 200 && h.status < 400).length;
  healthCheckState.status = 'done';
  console.log(`[Health] Done. ${alive}/${streams.length} channels alive.`);
}

// Helper: load cache from disk
function loadCacheFromDisk() {
  try {
    const files = {
      userInfo: 'user_info.json',
      liveCategories: 'live_categories.json',
      liveStreams: 'live_streams.json',
      vodCategories: 'vod_categories.json',
      vodStreams: 'vod_streams.json',
      seriesCategories: 'series_categories.json',
      seriesStreams: 'series_streams.json'
    };

    const portalDir = getPortalDataDir();
    let loadedCount = 0;
    for (const [key, filename] of Object.entries(files)) {
      const filePath = path.join(portalDir, filename);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        cache[key] = JSON.parse(fileContent);
        loadedCount++;
      }
    }

    if (loadedCount === Object.keys(files).length) {
      syncState.status = 'completed';
      const stats = fs.statSync(path.join(portalDir, 'user_info.json'));
      syncState.lastUpdated = stats.mtime;
      console.log(`Cache fully loaded from disk for Portal ${activePortalId}.`);
      loadHealthFromDisk(); // Load health data alongside the cache
    } else {
      syncState.status = 'idle';
      console.log(`Cache partially loaded (${loadedCount}/${Object.keys(files).length} files) for Portal ${activePortalId}. Sync required.`);
    }
  } catch (err) {
    console.error('Error loading cache from disk:', err);
    syncState.status = 'failed';
    syncState.error = 'Failed to load cache from disk';
  }
}

// Fetch helper with User-Agent and timeouts
async function fetchIPTV(action, extraParams = '') {
  const portal = getActivePortal();
  const url = `${portal.url}/player_api.php?username=${portal.username}&password=${portal.password}&action=${action}${extraParams}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} for action ${action}`);
  }
  return await response.json();
}

function parseM3U(m3uContent, portal) {
  const lines = m3uContent.split(/\r?\n/);
  const streams = [];
  const categoriesMap = new Map();
  
  let currentItem = null;
  let num = 1;

  // Helper: clean up a raw M3U group-title to a readable category name
  function cleanCategoryName(raw) {
    if (!raw) return 'Sports';
    // Handle semicolon-separated tags like "Kids;Sports" or "Auto;Outdoor;Sports"
    // Take all parts and join them with " & ", removing duplicates and normalizing
    const parts = raw.split(';').map(p => p.trim()).filter(p => p.length > 0);
    const unique = [...new Set(parts)];
    return unique.join(' & ');
  }

  function makeCategoryId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    if (line.startsWith('#EXTINF:')) {
      currentItem = {
        num: num++,
        stream_type: 'live',
        stream_icon: '',
        epg_channel_id: null,
        category_id: 'sports',
        category_name: 'Sports'
      };
      
      // Extract name (after the last comma)
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex > -1) {
        currentItem.name = line.substring(commaIndex + 1).trim();
      } else {
        currentItem.name = 'Unknown Channel';
      }
      
      // Strip control chars/emoji artifacts from name
      currentItem.name = currentItem.name.replace(/[\x00-\x08\x0b\x0e-\x1f\x7f]/g, '');
      
      // Extract tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i) || line.match(/logo="([^"]*)"/i);
      if (logoMatch) {
        currentItem.stream_icon = logoMatch[1];
      }
      
      // Extract tvg-id
      const idMatch = line.match(/tvg-id="([^"]*)"/i);
      if (idMatch) {
        currentItem.epg_channel_id = idMatch[1];
      }
      
      // Extract group-title (category)
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      if (groupMatch) {
        const rawCat = groupMatch[1].trim();
        const catName = cleanCategoryName(rawCat);
        const catId = makeCategoryId(catName);
        currentItem.category_name = catName;
        currentItem.category_id = catId;
        categoriesMap.set(catId, catName);
      } else {
        // Default to Sports if no group-title
        categoriesMap.set('sports', 'Sports');
      }
    } else if (line.startsWith('#')) {
      continue;
    } else {
      // It's a URL line
      if (currentItem) {
        currentItem.url = line;
        currentItem.stream_id = String(100000 + currentItem.num);
        streams.push(currentItem);
        currentItem = null;
      }
    }
  }
  
  const categories = Array.from(categoriesMap.entries()).map(([id, name]) => ({
    category_id: id,
    category_name: name,
    parent_id: 0
  }));
  
  return { streams, categories };
}

// Background sync worker
async function runSync() {
  if (syncState.status === 'syncing') return;

  syncState.status = 'syncing';
  syncState.error = null;
  syncState.progress = 0;

  try {
    const portal = getActivePortal();
    const portalDir = getPortalDataDir();

    // Check if it is an M3U portal
    if (portal.isM3u || portal.url.endsWith('.m3u') || portal.url.endsWith('.m3u8')) {
      syncState.step = 'Downloading M3U playlist...';
      syncState.progress = 20;
      
      const res = await fetch(portal.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) throw new Error(`Failed to fetch M3U playlist with status ${res.status}`);
      const m3uContent = await res.text();
      
      syncState.step = 'Parsing M3U playlist...';
      syncState.progress = 50;
      const { streams, categories } = parseM3U(m3uContent, portal);
      
      syncState.step = 'Caching M3U playlist data...';
      syncState.progress = 80;
      
      // Mock User Info
      const mockUserInfo = {
        user_info: {
          username: portal.name,
          password: '',
          auth: 1,
          status: 'Active',
          exp_date: '0',
          active_cons: '0',
          max_connections: 'Unlimited'
        },
        server_info: {
          url: new URL(portal.url).hostname,
          port: '80',
          server_protocol: 'https',
          timestamp_now: Math.floor(Date.now() / 1000),
          time_now: new Date().toISOString().replace('T', ' ').substring(0, 19),
          process: true
        }
      };
      
      cache.userInfo = mockUserInfo;
      cache.liveCategories = categories;
      cache.liveStreams = streams;
      cache.vodCategories = [];
      cache.vodStreams = [];
      cache.seriesCategories = [];
      cache.seriesStreams = [];
      
      fs.writeFileSync(path.join(portalDir, 'user_info.json'), JSON.stringify(mockUserInfo, null, 2));
      fs.writeFileSync(path.join(portalDir, 'live_categories.json'), JSON.stringify(categories, null, 2));
      fs.writeFileSync(path.join(portalDir, 'live_streams.json'), JSON.stringify(streams));
      fs.writeFileSync(path.join(portalDir, 'vod_categories.json'), JSON.stringify([], null, 2));
      fs.writeFileSync(path.join(portalDir, 'vod_streams.json'), JSON.stringify([]));
      fs.writeFileSync(path.join(portalDir, 'series_categories.json'), JSON.stringify([], null, 2));
      fs.writeFileSync(path.join(portalDir, 'series_streams.json'), JSON.stringify([]));
      
      syncState.status = 'completed';
      syncState.step = 'M3U Synchronization successful!';
      syncState.progress = 100;
      syncState.lastUpdated = new Date();
      console.log(`M3U Sync complete for Portal ${activePortalId}.`);
      // Load any existing health data from disk, then start fresh health check in background
      loadHealthFromDisk();
      runHealthCheck(streams).catch(e => console.error('[Health] Error:', e.message));
      return;
    }

    // Step 1: User Info
    syncState.step = 'Authenticating with server...';
    syncState.progress = 5;
    const authUrl = `${portal.url}/player_api.php?username=${portal.username}&password=${portal.password}`;
    const authRes = await fetch(authUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!authRes.ok) throw new Error(`Auth failed with status ${authRes.status}`);
    const authData = await authRes.json();
    if (!authData.user_info || authData.user_info.auth !== 1) {
      throw new Error('IPTV portal returned authentication failure.');
    }
    cache.userInfo = authData;
    fs.writeFileSync(path.join(portalDir, 'user_info.json'), JSON.stringify(authData, null, 2));

    // Step 2: Live Categories
    syncState.step = 'Downloading Live TV categories...';
    syncState.progress = 15;
    const liveCats = await fetchIPTV('get_live_categories');
    cache.liveCategories = liveCats;
    fs.writeFileSync(path.join(portalDir, 'live_categories.json'), JSON.stringify(liveCats, null, 2));

    // Step 3: Live Streams
    syncState.step = 'Downloading Live TV channels...';
    syncState.progress = 30;
    const liveStreams = await fetchIPTV('get_live_streams');
    cache.liveStreams = liveStreams;
    fs.writeFileSync(path.join(portalDir, 'live_streams.json'), JSON.stringify(liveStreams));

    // Step 4: VOD Categories
    syncState.step = 'Downloading Movie categories...';
    syncState.progress = 45;
    const vodCats = await fetchIPTV('get_vod_categories');
    cache.vodCategories = vodCats;
    fs.writeFileSync(path.join(portalDir, 'vod_categories.json'), JSON.stringify(vodCats, null, 2));

    // Step 5: VOD Streams
    syncState.step = 'Downloading Movies list (this may take a few seconds)...';
    syncState.progress = 60;
    const vodStreams = await fetchIPTV('get_vod_streams');
    cache.vodStreams = vodStreams;
    fs.writeFileSync(path.join(portalDir, 'vod_streams.json'), JSON.stringify(vodStreams));

    // Step 6: Series Categories
    syncState.step = 'Downloading TV Series categories...';
    syncState.progress = 80;
    const seriesCats = await fetchIPTV('get_series_categories');
    cache.seriesCategories = seriesCats;
    fs.writeFileSync(path.join(portalDir, 'series_categories.json'), JSON.stringify(seriesCats, null, 2));

    // Step 7: Series Streams
    syncState.step = 'Downloading TV Series list...';
    syncState.progress = 95;
    const seriesStreams = await fetchIPTV('get_series');
    cache.seriesStreams = seriesStreams;
    fs.writeFileSync(path.join(portalDir, 'series_streams.json'), JSON.stringify(seriesStreams));

    syncState.status = 'completed';
    syncState.step = 'Synchronization successful!';
    syncState.progress = 100;
    syncState.lastUpdated = new Date();
    console.log(`Synchronization complete and cached for Portal ${activePortalId}.`);
  } catch (err) {
    console.error('Sync error:', err);
    syncState.status = 'failed';
    syncState.step = 'Synchronization failed';
    syncState.error = err.message;
  }
}

// Initial cache load on launch
loadCacheFromDisk();

// --- API ENDPOINTS ---

// Check server/cache status
app.get('/api/status', async (req, res) => {
  let liveUserInfo = cache.userInfo;
  const portal = getActivePortal();
  const portalDir = getPortalDataDir();

  // Try to get fresh user info from IPTV server dynamically to show real-time connections (except for M3U portals)
  if (!(portal.isM3u || portal.url.endsWith('.m3u') || portal.url.endsWith('.m3u8'))) {
    try {
      const authUrl = `${portal.url}/player_api.php?username=${portal.username}&password=${portal.password}`;
      const authRes = await fetch(authUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(3000)
      });
      if (authRes.ok) {
        const liveData = await authRes.json();
        if (liveData && liveData.user_info) {
          liveUserInfo = liveData;
          // Update cache in-memory and write to disk
          cache.userInfo = liveData;
          fs.writeFileSync(path.join(portalDir, 'user_info.json'), JSON.stringify(liveData, null, 2));
        }
      }
    } catch (err) {
      console.warn('[Status API] Failed to fetch live user info, using cached:', err.message);
    }
  }

  res.json({
    activePortalId: activePortalId,
    sync: syncState,
    subscription: liveUserInfo ? {
      username: liveUserInfo.user_info.username,
      status: liveUserInfo.user_info.status,
      expiry: liveUserInfo.user_info.exp_date,
      connections: liveUserInfo.user_info.active_cons,
      maxConnections: liveUserInfo.user_info.max_connections,
      serverTime: liveUserInfo.server_info.time_now
    } : null,
    counts: {
      liveCategories: cache.liveCategories.length,
      liveStreams: cache.liveStreams.length,
      vodCategories: cache.vodCategories.length,
      vodStreams: cache.vodStreams.length,
      seriesCategories: cache.seriesCategories.length,
      seriesStreams: cache.seriesStreams.length
    }
  });
});

// Refresh cache
app.post('/api/refresh', (req, res) => {
  if (syncState.status === 'syncing') {
    return res.status(409).json({ message: 'Synchronization is already in progress.' });
  }
  // Start async sync worker
  runSync();
  res.status(202).json({ message: 'Sync started successfully.' });
});

// Get Categories
app.get('/api/categories', (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ error: 'Missing type parameter (live, vod, series)' });

  if (type === 'live') return res.json(cache.liveCategories);
  if (type === 'vod') return res.json(cache.vodCategories);
  if (type === 'series') return res.json(cache.seriesCategories);

  return res.status(400).json({ error: 'Invalid type parameter. Must be live, vod, or series' });
});

// Get channel health status
app.get('/api/channels/health', (req, res) => {
  res.json({
    state: healthCheckState,
    health: channelHealth
  });
});

// Trigger a new health check manually
app.post('/api/channels/health-check', (req, res) => {
  if (healthCheckState.status === 'running') {
    return res.status(409).json({ message: 'Health check already running.' });
  }
  if (cache.liveStreams.length === 0) {
    return res.status(400).json({ message: 'No streams cached. Sync first.' });
  }
  channelHealth = {}; // Reset for fresh check
  runHealthCheck(cache.liveStreams).catch(e => console.error('[Health] Manual check error:', e.message));
  res.status(202).json({ message: 'Health check started.', total: cache.liveStreams.length });
});

// Get Paginated, Filtered Streams
app.get('/api/streams', (req, res) => {
  const { type, category_id, search, page = 1, limit = 50, alive_only } = req.query;
  if (!type) return res.status(400).json({ error: 'Missing type parameter (live, vod, series)' });

  let streamList = [];
  if (type === 'live') streamList = cache.liveStreams;
  else if (type === 'vod') streamList = cache.vodStreams;
  else if (type === 'series') streamList = cache.seriesStreams;
  else return res.status(400).json({ error: 'Invalid type parameter' });

  // 1. Filter by category
  if (category_id && category_id !== 'all') {
    streamList = streamList.filter(item => item.category_id === category_id);
  }

  // 2. Filter by search query
  if (search) {
    const query = search.toLowerCase();
    streamList = streamList.filter(item => item.name && item.name.toLowerCase().includes(query));
  }

  // 3. Filter alive-only (hide channels that failed health check)
  if (alive_only === 'true' && Object.keys(channelHealth).length > 0) {
    streamList = streamList.filter(item => {
      const h = channelHealth[item.stream_id];
      // Keep if: no health data yet (unchecked), or status is 200-399
      if (!h) return true;
      return h.status >= 200 && h.status < 400;
    });
  }

  // 4. Paginate
  const totalItems = streamList.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const totalPages = Math.ceil(totalItems / limitNum);
  const offset = (pageNum - 1) * limitNum;
  const paginatedItems = streamList.slice(offset, offset + limitNum);

  // Attach health info to each item
  const itemsWithHealth = paginatedItems.map(item => ({
    ...item,
    _health: channelHealth[item.stream_id] || null
  }));

  res.json({
    items: itemsWithHealth,
    pagination: {
      total: totalItems,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages
    }
  });
});

// Get Series details & episodes (dynamic from IPTV)
app.get('/api/series-info/:id', async (req, res) => {
  const seriesId = req.params.id;
  if (!seriesId) return res.status(400).json({ error: 'Missing series id' });

  try {
    const data = await fetchIPTV('get_series_info', `&series_id=${seriesId}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching series info for ID ${seriesId}:`, err);
    res.status(500).json({ error: 'Failed to fetch series info from IPTV provider' });
  }
});

// Get stream URL by channel name (matching custom player format)
app.get('/api/stream', (req, res) => {
  const channelName = (req.query.channel || '').toLowerCase().trim();
  if (!channelName) {
    return res.status(400).json({ error: 'Missing channel parameter' });
  }

  // 1. Search in worldcup_channels.json first
  try {
    const worldcupPath = path.join(CONFIG_DIR, 'worldcup_channels.json');
    if (fs.existsSync(worldcupPath)) {
      const worldcupChannels = JSON.parse(fs.readFileSync(worldcupPath, 'utf8'));
      const channel = worldcupChannels.find(c => c.name.toLowerCase().includes(channelName));
      if (channel && channel.streamUrl) {
        console.log(`[Stream API] Found worldcup channel ${channel.name}: Redirecting to ${channel.streamUrl}`);
        return res.redirect(channel.streamUrl);
      }
    }
  } catch (err) {
    console.error('Error reading worldcup_channels.json:', err);
  }

  // 2. Search in live streams cache
  const liveChannel = cache.liveStreams.find(s => s.name && s.name.toLowerCase().includes(channelName));
  if (liveChannel && liveChannel.url) {
    console.log(`[Stream API] Found live stream ${liveChannel.name}: Redirecting to ${liveChannel.url}`);
    return res.redirect(liveChannel.url);
  }

  res.status(404).json({ error: 'Channel stream not found' });
});



// Live / Video play URLs (Secure Redirect proxy)
app.get('/api/play/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const ext = req.query.ext || 'ts'; // ts, m3u8, mkv, mp4

  if (!type || !id) return res.status(400).json({ error: 'Missing stream id or type' });

  const portal = getActivePortal();
  let playUrl = '';
  
  if (portal.isM3u || portal.url.endsWith('.m3u') || portal.url.endsWith('.m3u8')) {
    let stream = null;
    if (type === 'live') {
      stream = cache.liveStreams.find(s => String(s.stream_id) === String(id));
    } else if (type === 'vod') {
      stream = cache.vodStreams.find(s => String(s.stream_id) === String(id));
    } else if (type === 'series') {
      stream = cache.seriesStreams.find(s => String(s.stream_id) === String(id));
    }
    
    if (stream && stream.url) {
      playUrl = stream.url;
    } else {
      return res.status(404).json({ error: 'M3U stream url not found' });
    }
  } else {
    if (type === 'live') {
      playUrl = `${portal.url}/live/${portal.username}/${portal.password}/${id}.${ext}`;
    } else if (type === 'vod') {
      playUrl = `${portal.url}/movie/${portal.username}/${portal.password}/${id}.${ext}`;
    } else if (type === 'series') {
      playUrl = `${portal.url}/series/${portal.username}/${portal.password}/${id}.${ext}`;
    } else {
      return res.status(400).json({ error: 'Invalid stream type' });
    }
  }

  console.log(`[Stream Redirect] Redirecting ${type} ${id} to ${playUrl}`);
  res.redirect(playUrl);
});

// Check stream status to bypass CORS and download overhead on client
app.get('/api/check-stream/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const ext = req.query.ext || 'ts';

  if (!type || !id) return res.status(400).json({ error: 'Missing stream id or type' });

  const portal = getActivePortal();
  let playUrl = '';
  
  if (portal.isM3u || portal.url.endsWith('.m3u') || portal.url.endsWith('.m3u8')) {
    let stream = null;
    if (type === 'live') {
      stream = cache.liveStreams.find(s => String(s.stream_id) === String(id));
    } else if (type === 'vod') {
      stream = cache.vodStreams.find(s => String(s.stream_id) === String(id));
    } else if (type === 'series') {
      stream = cache.seriesStreams.find(s => String(s.stream_id) === String(id));
    }
    
    if (stream && stream.url) {
      playUrl = stream.url;
    } else {
      return res.status(404).json({ error: 'M3U stream url not found' });
    }
  } else {
    if (type === 'live') {
      playUrl = `${portal.url}/live/${portal.username}/${portal.password}/${id}.${ext}`;
    } else if (type === 'vod') {
      playUrl = `${portal.url}/movie/${portal.username}/${portal.password}/${id}.${ext}`;
    } else if (type === 'series') {
      playUrl = `${portal.url}/series/${portal.username}/${portal.password}/${id}.${ext}`;
    } else {
      return res.status(400).json({ error: 'Invalid stream type' });
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout
  let successStatus = null;

  try {
    const response = await fetch(playUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    successStatus = response.status;
    
    // Abort body stream download immediately to avoid consuming bandwidth
    controller.abort();
    clearTimeout(timeoutId);

    console.log(`[Stream Check] Checking status of ${playUrl}: Status ${successStatus}`);
    return res.json({ status: successStatus });
  } catch (err) {
    clearTimeout(timeoutId);
    if (successStatus !== null) {
      return res.json({ status: successStatus });
    }
    console.error(`[Stream Check Error] failed for ${playUrl}:`, err.message);
    if (err.name === 'AbortError') {
      return res.json({ status: 408, error: 'Request timed out' });
    }
    return res.json({ status: 500, error: err.message });
  }
});

// Get list of portals for switcher dropdown
app.get('/api/portals', (req, res) => {
  const list = portals.map(p => ({ id: p.id, name: p.name, url: p.url }));
  res.json(list);
});

// Select active portal
app.post('/api/portals/select', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing portal id' });

  const portal = portals.find(p => p.id === id);
  if (!portal) return res.status(404).json({ error: 'Portal not found' });

  activePortalId = id;
  console.log(`[Portal Switch] Switched active portal to: ${portal.name} (ID: ${id})`);

  // Reset in-memory caches and load the newly selected cache
  cache = {
    userInfo: null,
    liveCategories: [],
    liveStreams: [],
    vodCategories: [],
    vodStreams: [],
    seriesCategories: [],
    seriesStreams: []
  };

  syncState = {
    status: 'idle',
    step: '',
    progress: 0,
    error: null,
    lastUpdated: null
  };

  loadCacheFromDisk();

  res.json({
    message: 'Portal switched successfully',
    activePortalId: activePortalId,
    sync: syncState
  });
});



// ─── Live Viewer Count — Server-Sent Events ───────────────────────────────────
const sseClients = new Set();

// Base "seed" viewers — gives a realistic floor count even with few SSE connections
let currentViewerCount = 12450; // starts with a realistic audience size

function getLiveViewerCount() {
  // Real SSE connections + seed + active drift for realism
  const real = sseClients.size;
  // Drift the audience count dynamically by a small value between -12 and +12
  const drift = Math.floor(Math.random() * 25) - 12;
  currentViewerCount = Math.max(8500, Math.min(18000, currentViewerCount + drift));
  return currentViewerCount + real;
}

function broadcastViewerCount() {
  const count = getLiveViewerCount();
  const payload = `event: count\ndata: ${JSON.stringify({ count })}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch(_) { sseClients.delete(res); }
  }
}

// Broadcast every 3 seconds for active realtime fluctuation (disabled on Vercel)
if (!process.env.VERCEL) {
  setInterval(broadcastViewerCount, 3000);
}

// GET /api/viewer-stream — SSE endpoint
app.get('/api/viewer-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if applicable
  res.flushHeaders();

  sseClients.add(res);

  // Send current count immediately on connect
  res.write(`event: count\ndata: ${JSON.stringify({ count: getLiveViewerCount() })}\n\n`);

  // Keep-alive ping every 25s
  const pingInterval = setInterval(() => {
    try { res.write(': ping\n\n'); } catch(_) {}
  }, 25000);

  req.on('close', () => {
    sseClients.delete(res);
    clearInterval(pingInterval);
  });
});

// GET /api/viewer-count — simple poll fallback
app.get('/api/viewer-count', (req, res) => {
  res.json({ count: getLiveViewerCount() });
});

// GET /api/sportscore — Proxy for SportScore matches widget to bypass CORS
app.get('/api/sportscore', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch('https://sportscore.com/api/widget/matches/?sport=football&limit=12', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://sportscore.com/'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`SportScore API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[SportScore Proxy Error]:', err.message);
    res.status(502).json({ error: 'Failed to fetch matches from SportScore', details: err.message });
  }
});

// Helper to parse openfootball date & time (e.g., "13:00 UTC-6") into standard ISO UTC string
function parseOpenFootballDateTime(dateStr, timeStr) {
  if (!timeStr) return new Date(dateStr).toISOString();
  
  let tz = "Z";
  const tzMatch = timeStr.match(/UTC([+-]\d+)/);
  if (tzMatch) {
    const offset = parseInt(tzMatch[1]);
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = String(absOffset).padStart(2, '0');
    tz = `${sign}${hours}:00`;
  }
  
  const timeMatch = timeStr.match(/^(\d{2}:\d{2})/);
  const hm = timeMatch ? timeMatch[1] : "00:00";
  
  try {
    const isoString = `${dateStr}T${hm}:00${tz}`;
    return new Date(isoString).toISOString();
  } catch (e) {
    return new Date(dateStr).toISOString();
  }
}

// ─── Verified Real-World Match Results (Official Confirmed Scores) ────────────
// Key format: "Team1|Team2" (canonical name match)
// These override any missing/wrong data from the openfootball community repo.
const VERIFIED_RESULTS = {
  // June 11
  "Mexico|South Africa":           { homeScore: 2, awayScore: 0 },
  "South Korea|Czech Republic":    { homeScore: 2, awayScore: 1 },
  // June 12
  "Canada|Bosnia & Herzegovina":   { homeScore: 1, awayScore: 1 },
  "United States|Paraguay":        { homeScore: 4, awayScore: 1 },
  // Add more confirmed results here as the tournament progresses
};

// Normalize team name for lookup (handles USA alias etc.)
function normalizeTeamKey(name) {
  const aliases = {
    'USA': 'United States',
    'United States of America': 'United States',
    'Korea Republic': 'South Korea',
    'Czech Republic': 'Czechia',
    'Türkiye': 'Turkiye',
    'Turkey': 'Turkiye',
    'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  };
  return aliases[name] || name;
}

// Patch fixtures with verified results where the openfootball data is missing/wrong
function patchVerifiedResults(fixtures) {
  fixtures.forEach(f => {
    const h = normalizeTeamKey(f.homeTeam);
    const a = normalizeTeamKey(f.awayTeam);
    const key1 = `${h}|${a}`;
    const key2 = `${a}|${h}`;
    if (VERIFIED_RESULTS[key1]) {
      f.score = VERIFIED_RESULTS[key1];
      f.homeTeam = h;
      f.awayTeam = a;
    } else if (VERIFIED_RESULTS[key2]) {
      // reversed — swap score
      f.score = { homeScore: VERIFIED_RESULTS[key2].awayScore, awayScore: VERIFIED_RESULTS[key2].homeScore };
      f.homeTeam = h;
      f.awayTeam = a;
    }
  });
}

// ─── Full Local Fixture Data (fallback if GitHub fetch fails) ─────────────────
function getLocalFixtureData() {
  const matches = [
    // ── GROUP A ────────────────────────────────────────────────────────────────
    { date:'2026-06-11', time:'13:00 UTC-6', team1:'Mexico',       team2:'South Africa',     group:'Group A', ground:'Mexico City',               score:{ft:[2,0],ht:[1,0]} },
    { date:'2026-06-11', time:'20:00 UTC-6', team1:'South Korea',  team2:'Czech Republic',   group:'Group A', ground:'Guadalajara (Zapopan)',     score:{ft:[2,1],ht:[0,0]} },
    { date:'2026-06-18', time:'12:00 UTC-4', team1:'Czech Republic',team2:'South Africa',    group:'Group A', ground:'Atlanta',                   score:null },
    { date:'2026-06-18', time:'19:00 UTC-6', team1:'Mexico',       team2:'South Korea',      group:'Group A', ground:'Guadalajara (Zapopan)',     score:null },
    { date:'2026-06-24', time:'19:00 UTC-6', team1:'Czech Republic',team2:'Mexico',          group:'Group A', ground:'Mexico City',               score:null },
    { date:'2026-06-24', time:'19:00 UTC-6', team1:'South Africa', team2:'South Korea',      group:'Group A', ground:'Monterrey (Guadalupe)',     score:null },
    // ── GROUP B ────────────────────────────────────────────────────────────────
    { date:'2026-06-12', time:'15:00 UTC-4', team1:'Canada',       team2:'Bosnia & Herzegovina', group:'Group B', ground:'Toronto',              score:{ft:[1,1],ht:[0,1]} },
    { date:'2026-06-12', time:'21:00 UTC-4', team1:'United States', team2:'Paraguay',        group:'Group B', ground:'Los Angeles (Inglewood)', score:{ft:[4,1],ht:[2,0]} },
    { date:'2026-06-13', time:'12:00 UTC-7', team1:'Qatar',        team2:'Switzerland',      group:'Group B', ground:'San Francisco Bay Area (Santa Clara)', score:null },
    { date:'2026-06-18', time:'12:00 UTC-7', team1:'Switzerland',  team2:'Bosnia & Herzegovina', group:'Group B', ground:'Los Angeles (Inglewood)', score:null },
    { date:'2026-06-18', time:'15:00 UTC-7', team1:'Canada',       team2:'Qatar',            group:'Group B', ground:'Vancouver',                score:null },
    { date:'2026-06-24', time:'12:00 UTC-7', team1:'Switzerland',  team2:'Canada',           group:'Group B', ground:'Vancouver',                score:null },
    { date:'2026-06-24', time:'12:00 UTC-7', team1:'Bosnia & Herzegovina', team2:'Qatar',   group:'Group B', ground:'Seattle',                  score:null },
    { date:'2026-06-24', time:'12:00 UTC-7', team1:'United States', team2:'?',              group:'Group B', ground:'TBD',                       score:null },
    // ── GROUP C ────────────────────────────────────────────────────────────────
    { date:'2026-06-13', time:'18:00 UTC-4', team1:'Brazil',       team2:'Morocco',          group:'Group C', ground:'New York/New Jersey (East Rutherford)', score:null },
    { date:'2026-06-13', time:'21:00 UTC-4', team1:'Haiti',        team2:'Scotland',         group:'Group C', ground:'Boston (Foxborough)',       score:null },
    { date:'2026-06-19', time:'18:00 UTC-4', team1:'Scotland',     team2:'Morocco',          group:'Group C', ground:'Boston (Foxborough)',       score:null },
    { date:'2026-06-19', time:'20:30 UTC-4', team1:'Brazil',       team2:'Haiti',            group:'Group C', ground:'Philadelphia',             score:null },
    { date:'2026-06-25', time:'18:00 UTC-4', team1:'Morocco',      team2:'Haiti',            group:'Group C', ground:'Philadelphia',             score:null },
    { date:'2026-06-25', time:'18:00 UTC-4', team1:'Scotland',     team2:'Brazil',           group:'Group C', ground:'MetLife Stadium',          score:null },
    // ── GROUP D ────────────────────────────────────────────────────────────────
    { date:'2026-06-14', time:'12:00 UTC-7', team1:'Australia',    team2:'Turkiye',          group:'Group D', ground:'Vancouver',                score:null },
    { date:'2026-06-14', time:'15:00 UTC-7', team1:'Germany',      team2:'Curacao',          group:'Group D', ground:'Los Angeles (Inglewood)', score:null },
    { date:'2026-06-20', time:'15:00 UTC-7', team1:'Turkiye',      team2:'Curacao',          group:'Group D', ground:'San Francisco Bay Area (Santa Clara)', score:null },
    { date:'2026-06-20', time:'18:00 UTC-7', team1:'Germany',      team2:'Australia',        group:'Group D', ground:'Seattle',                  score:null },
    { date:'2026-06-26', time:'15:00 UTC-7', team1:'Curacao',      team2:'Australia',        group:'Group D', ground:'Vancouver',                score:null },
    { date:'2026-06-26', time:'15:00 UTC-7', team1:'Turkiye',      team2:'Germany',          group:'Group D', ground:'Los Angeles (Inglewood)', score:null },
    // ── GROUP E ────────────────────────────────────────────────────────────────
    { date:'2026-06-14', time:'18:00 UTC-4', team1:'Cote d\'Ivoire', team2:'Ecuador',        group:'Group E', ground:'Philadelphia',             score:null },
    { date:'2026-06-14', time:'21:00 UTC-4', team1:'Spain',        team2:'New Zealand',      group:'Group E', ground:'MetLife Stadium',          score:null },
    { date:'2026-06-20', time:'18:00 UTC-4', team1:'Ecuador',      team2:'New Zealand',      group:'Group E', ground:'New York/New Jersey (East Rutherford)', score:null },
    { date:'2026-06-20', time:'21:00 UTC-4', team1:'Spain',        team2:'Cote d\'Ivoire',  group:'Group E', ground:'MetLife Stadium',          score:null },
    { date:'2026-06-26', time:'18:00 UTC-4', team1:'New Zealand',  team2:'Spain',            group:'Group E', ground:'Philadelphia',             score:null },
    { date:'2026-06-26', time:'18:00 UTC-4', team1:'Ecuador',      team2:'Cote d\'Ivoire',  group:'Group E', ground:'Boston (Foxborough)',       score:null },
    // ── GROUP F ────────────────────────────────────────────────────────────────
    { date:'2026-06-15', time:'15:00 UTC-4', team1:'France',       team2:'Algeria',          group:'Group F', ground:'Boston (Foxborough)',       score:null },
    { date:'2026-06-15', time:'18:00 UTC-4', team1:'Argentina',    team2:'Uzbekistan',       group:'Group F', ground:'MetLife Stadium',          score:null },
    { date:'2026-06-21', time:'15:00 UTC-4', team1:'Algeria',      team2:'Uzbekistan',       group:'Group F', ground:'Philadelphia',             score:null },
    { date:'2026-06-21', time:'18:00 UTC-4', team1:'Argentina',    team2:'France',           group:'Group F', ground:'New York/New Jersey (East Rutherford)', score:null },
    { date:'2026-06-27', time:'18:00 UTC-4', team1:'Uzbekistan',   team2:'France',           group:'Group F', ground:'Boston (Foxborough)',       score:null },
    { date:'2026-06-27', time:'18:00 UTC-4', team1:'Algeria',      team2:'Argentina',        group:'Group F', ground:'MetLife Stadium',          score:null },
    // ── GROUP G ────────────────────────────────────────────────────────────────
    { date:'2026-06-15', time:'12:00 UTC-6', team1:'Portugal',     team2:'Iraq',             group:'Group G', ground:'Dallas (Frisco)',          score:null },
    { date:'2026-06-15', time:'15:00 UTC-6', team1:'Belgium',      team2:'Cabo Verde',       group:'Group G', ground:'Kansas City',              score:null },
    { date:'2026-06-21', time:'12:00 UTC-6', team1:'Iraq',         team2:'Cabo Verde',       group:'Group G', ground:'Dallas (Frisco)',          score:null },
    { date:'2026-06-21', time:'15:00 UTC-6', team1:'Belgium',      team2:'Portugal',         group:'Group G', ground:'Kansas City',              score:null },
    { date:'2026-06-27', time:'12:00 UTC-6', team1:'Cabo Verde',   team2:'Portugal',         group:'Group G', ground:'Kansas City',              score:null },
    { date:'2026-06-27', time:'12:00 UTC-6', team1:'Iraq',         team2:'Belgium',          group:'Group G', ground:'Dallas (Frisco)',          score:null },
    // ── GROUP H ────────────────────────────────────────────────────────────────
    { date:'2026-06-16', time:'12:00 UTC-6', team1:'England',      team2:'Congo DR',         group:'Group H', ground:'Monterrey (Guadalupe)',    score:null },
    { date:'2026-06-16', time:'15:00 UTC-6', team1:'Netherlands',  team2:'Senegal',          group:'Group H', ground:'Houston',                  score:null },
    { date:'2026-06-22', time:'12:00 UTC-6', team1:'Congo DR',     team2:'Senegal',          group:'Group H', ground:'Houston',                  score:null },
    { date:'2026-06-22', time:'15:00 UTC-6', team1:'England',      team2:'Netherlands',      group:'Group H', ground:'Dallas (Frisco)',          score:null },
    { date:'2026-06-28', time:'12:00 UTC-6', team1:'Senegal',      team2:'England',          group:'Group H', ground:'Dallas (Frisco)',          score:null },
    { date:'2026-06-28', time:'12:00 UTC-6', team1:'Congo DR',     team2:'Netherlands',      group:'Group H', ground:'Monterrey (Guadalupe)',    score:null },
    // ── GROUP I ────────────────────────────────────────────────────────────────
    { date:'2026-06-16', time:'18:00 UTC-4', team1:'Japan',        team2:'Egypt',            group:'Group I', ground:'Atlanta',                   score:null },
    { date:'2026-06-16', time:'21:00 UTC-4', team1:'Croatia',      team2:'Colombia',         group:'Group I', ground:'Charlotte',                 score:null },
    { date:'2026-06-22', time:'18:00 UTC-4', team1:'Egypt',        team2:'Colombia',         group:'Group I', ground:'Charlotte',                 score:null },
    { date:'2026-06-22', time:'21:00 UTC-4', team1:'Japan',        team2:'Croatia',          group:'Group I', ground:'Atlanta',                   score:null },
    { date:'2026-06-28', time:'18:00 UTC-4', team1:'Colombia',     team2:'Japan',            group:'Group I', ground:'Atlanta',                   score:null },
    { date:'2026-06-28', time:'18:00 UTC-4', team1:'Egypt',        team2:'Croatia',          group:'Group I', ground:'Charlotte',                 score:null },
    // ── GROUP J ────────────────────────────────────────────────────────────────
    { date:'2026-06-17', time:'12:00 UTC-5', team1:'Panama',       team2:'Sweden',           group:'Group J', ground:'Chicago (Evanston)',        score:null },
    { date:'2026-06-17', time:'15:00 UTC-5', team1:'Uruguay',      team2:'Jordan',           group:'Group J', ground:'Chicago (Evanston)',        score:null },
    { date:'2026-06-23', time:'12:00 UTC-5', team1:'Sweden',       team2:'Jordan',           group:'Group J', ground:'Chicago (Evanston)',        score:null },
    { date:'2026-06-23', time:'15:00 UTC-5', team1:'Uruguay',      team2:'Panama',           group:'Group J', ground:'Chicago (Evanston)',        score:null },
    { date:'2026-06-29', time:'12:00 UTC-5', team1:'Jordan',       team2:'Panama',           group:'Group J', ground:'Chicago (Evanston)',        score:null },
    { date:'2026-06-29', time:'12:00 UTC-5', team1:'Sweden',       team2:'Uruguay',          group:'Group J', ground:'Chicago (Evanston)',        score:null },
    // ── GROUP K ────────────────────────────────────────────────────────────────
    { date:'2026-06-17', time:'18:00 UTC-6', team1:'Saudi Arabia', team2:'Norway',           group:'Group K', ground:'Guadalajara (Zapopan)',    score:null },
    { date:'2026-06-17', time:'21:00 UTC-6', team1:'Austria',      team2:'Ghana',            group:'Group K', ground:'Monterrey (Guadalupe)',    score:null },
    { date:'2026-06-23', time:'18:00 UTC-6', team1:'Norway',       team2:'Ghana',            group:'Group K', ground:'Monterrey (Guadalupe)',    score:null },
    { date:'2026-06-23', time:'21:00 UTC-6', team1:'Austria',      team2:'Saudi Arabia',     group:'Group K', ground:'Guadalajara (Zapopan)',    score:null },
    { date:'2026-06-29', time:'18:00 UTC-6', team1:'Ghana',        team2:'Austria',          group:'Group K', ground:'Guadalajara (Zapopan)',    score:null },
    { date:'2026-06-29', time:'18:00 UTC-6', team1:'Norway',       team2:'Saudi Arabia',     group:'Group K', ground:'Monterrey (Guadalupe)',    score:null },
    // ── GROUP L ────────────────────────────────────────────────────────────────
    { date:'2026-06-18', time:'18:00 UTC-6', team1:'Tunisia',      team2:'Iran',             group:'Group L', ground:'Dallas (Frisco)',          score:null },
    { date:'2026-06-18', time:'21:00 UTC-6', team1:'Morocco',      team2:'?',                group:'Group L', ground:'TBD',                       score:null },
  ];

  const fixtures = matches.map((m, idx) => {
    const kickoffUtc = parseOpenFootballDateTime(m.date, m.time);
    return {
      matchNumber: idx + 1,
      date: m.date,
      kickoffUtc: kickoffUtc,
      stage: 'matchday',
      group: m.group || '',
      homeTeam: m.team1,
      awayTeam: m.team2,
      stadium: m.ground || '',
      hostCity: (m.ground || '').toLowerCase().replace(/\s+/g, '-'),
      score: m.score ? { homeScore: m.score.ft[0], awayScore: m.score.ft[1] } : null
    };
  });

  return {
    tournament: {
      edition: "2026 FIFA World Cup",
      startDate: "2026-06-11",
      endDate: "2026-07-19"
    },
    fixtures: fixtures
  };
}

// GET /api/worldcup/fixtures — Proxy for openfootball 2026 World Cup fixtures & scores
app.get('/api/worldcup/fixtures', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`OpenFootball responded with status ${response.status}`);
    }
    
    const openFootballData = await response.json();
    
    // Map openfootball matches array to standardized fixture list
    const fixtures = openFootballData.matches.map((m, idx) => {
      const kickoffUtc = parseOpenFootballDateTime(m.date, m.time);
      return {
        matchNumber: idx + 1,
        date: m.date,
        kickoffUtc: kickoffUtc,
        stage: (m.round || 'group-stage').toLowerCase().replace(/\s+/g, '-'),
        group: m.group || '',
        homeTeam: m.team1,
        awayTeam: m.team2,
        stadium: m.ground || '',
        hostCity: (m.ground || '').toLowerCase().replace(/\s+/g, '-'),
        score: m.score ? {
          homeScore: m.score.ft[0],
          awayScore: m.score.ft[1]
        } : null
      };
    });

    // Overlay verified real-world results on top of openfootball data
    patchVerifiedResults(fixtures);

    res.json({
      tournament: {
        edition: "2026 FIFA World Cup",
        startDate: "2026-06-11",
        endDate: "2026-07-19"
      },
      fixtures: fixtures
    });
  } catch (err) {
    console.error('[World Cup Fixtures Proxy Error]:', err.message);
    // Serve local verified fixture data as fallback
    res.json(getLocalFixtureData());
  }
});

// POST /api/health-check-urls — Concurrently checks external URLs to verify channel health
app.post('/api/health-check-urls', async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Missing or invalid urls parameter' });
  }

  const results = {};
  const TIMEOUT_MS = 4000;

  await Promise.allSettled(urls.map(async (url) => {
    if (!url) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeoutId);
      results[url] = response.status;
    } catch (err) {
      // If HEAD fails, try a GET request with an immediate abort
      try {
        const ctrl2 = new AbortController();
        const t2 = setTimeout(() => ctrl2.abort(), TIMEOUT_MS);
        const res2 = await fetch(url, {
          method: 'GET',
          signal: ctrl2.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        clearTimeout(t2);
        ctrl2.abort();
        results[url] = res2.status;
      } catch {
        results[url] = 0;
      }
    }
  }));

  res.json({ health: results });
});
// ─────────────────────────────────────────────────────────────────────────────


// Static page routes — served without .html extension
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});
app.get('/disclaimer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'disclaimer.html'));
});

// Content Hub Page Routes
app.get('/teams', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teams.html'));
});
app.get('/groups', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'groups.html'));
});
app.get('/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});
app.get('/predictions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'predictions.html'));
});
app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'news.html'));
});

// Fallback to serve custom 404.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Export app for serverless deployment (Vercel)
module.exports = app;

// Only listen when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KRYNN TV Server running at http://localhost:${PORT}`);
  });
}

