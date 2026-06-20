const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGO_DIR = path.join(__dirname, '..', 'public', 'logos');

const channels = [
  { file: 'azteca_uno.svg', query: 'Azteca Uno logo svg' },
  { file: 'tv5monde.svg', query: 'TV5Monde Logo svg' },
  { file: 'dw_sports.svg', query: 'Deutsche Welle logo svg' },
  { file: 'tyc_sports.png', query: 'TyC Sports Logo' },
  { file: 'm6.svg', query: 'M6 logo svg' },
  { file: 'bein_sports.svg', query: 'Bein Sports logo svg' },
  { file: 'rai_1.svg', query: 'Rai 1 logo svg' },
  { file: 'cgtn.svg', query: 'CGTN logo svg' }
];

async function apiRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'KrynnTVLogoDownloader/1.0 (contact@krynntv.com; bot)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'KrynnTVLogoDownloader/1.0 (contact@krynntv.com; bot)'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function getLogoUrl(searchQuery) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srnamespace=6&srlimit=3&format=json`;
  const searchResult = await apiRequest(searchUrl);
  if (!searchResult.query || !searchResult.query.search || searchResult.query.search.length === 0) {
    return null;
  }

  const bestMatch = searchResult.query.search[0].title;
  console.log(`  Found best match: ${bestMatch}`);

  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestMatch)}&prop=imageinfo&iiprop=url&format=json`;
  const infoResult = await apiRequest(infoUrl);
  if (!infoResult.query || !infoResult.query.pages) {
    return null;
  }

  const pages = infoResult.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId === '-1' || !pages[pageId].imageinfo || pages[pageId].imageinfo.length === 0) {
    return null;
  }

  return pages[pageId].imageinfo[0].url;
}

async function main() {
  console.log(`Starting download for remaining logos...`);
  for (const channel of channels) {
    console.log(`Searching for "${channel.query}"...`);
    try {
      const url = await getLogoUrl(channel.query);
      if (!url) {
        console.warn(`  No logo found for "${channel.query}"`);
        continue;
      }
      console.log(`  Downloading from ${url}...`);
      const ext = path.extname(url).toLowerCase();
      const filename = path.basename(channel.file, path.extname(channel.file)) + ext;
      const dest = path.join(LOGO_DIR, filename);
      await downloadFile(url, dest);
      console.log(`  Saved to public/logos/${filename}`);
      channel.savedFile = `logos/${filename}`;
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n--- Remaining Download Summary ---');
  console.log(JSON.stringify(channels, null, 2));
}

main();
