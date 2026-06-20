const fs = require('fs');
const https = require('https');
const { URL } = require('url');

const testUrls = [
  { name: 'azteca_uno_svg.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Azteca_Uno_2022.svg' },
  { name: 'azteca_uno_png.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Azteca_Uno_2022.svg/512px-Azteca_Uno_2022.svg.png' },
  { name: 'tv5monde_svg.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/TV5Monde_Logo.svg' },
  { name: 'tv5monde_png.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/TV5Monde_Logo.svg/512px-TV5Monde_Logo.svg.png' }
];

function download(urlStr, name) {
  return new Promise((resolve) => {
    console.log(`Testing: ${name} from ${urlStr}`);
    const parsedUrl = new URL(urlStr);
    const options = {
      headers: {
        'User-Agent': 'KrynnTVLogoDownloader/1.0 (contact@krynntv.com; bot)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };
    https.get(urlStr, options, (res) => {
      console.log(`Response for ${name}: STATUS = ${res.statusCode}`);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Redirect to: ${res.headers.location}`);
      }
      resolve();
    }).on('error', (err) => {
      console.log(`Error for ${name}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const item of testUrls) {
    await download(item.url, item.name);
    // Sleep 1 second
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
