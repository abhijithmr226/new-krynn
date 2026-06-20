const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const LOGO_DIR = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

const logos = [
  { name: 'azteca_uno.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Azteca_Uno_2022.svg' },
  { name: 'tv5monde.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/TV5Monde_Logo.svg' },
  { name: 'd_sports.jpg', url: 'https://mir-s3-cdn-cf.behance.net/projects/404/3049c9206241453.Y3JvcCwxMDgwLDg0NCwwLDEwNA.jpg' },
  { name: 'dw_sports.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Deutsche_Welle_logo.svg' },
  { name: 'tyc_sports.jpg', url: 'https://pbs.twimg.com/profile_images/1672607618498056193/2lqLnqBr_400x400.jpg' },
  { name: 'm6.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/M6_2020.svg' },
  { name: 'bein_sports.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Bein_sport_logo.svg' },
  { name: 'rai_1.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Rai_1_-_Logo_2016.svg' },
  { name: 'cgtn.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/CGTN_logo.svg' },
  { name: 'rtp.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/RTP1_logo_2024.svg' },
  { name: 'mtv3.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/MTV3_logo_2022.svg' },
  { name: 'suspilne.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Suspilne_logo.svg' },
  { name: 'mbc.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/MBC_logo.svg' },
  { name: 'ptv.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/PTV_logo.svg' },
  { name: 'sportv.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/SporTV_logo_2021.svg' },
  { name: 'fox_sports.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Fox_Sports_wordmark.svg' },
  { name: 'fifa_plus.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/FIFA_logo_without_slogan.svg' },
  { name: 'fs1.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/2015_Fox_Sports_1_logo.svg' },
  { name: 'sbs6.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/SBS6_%282023%29.svg' },
  { name: 'globo.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Rede_Globo_logo.svg' },
  { name: 'sbt.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/SBT_logo.svg' },
  { name: 'dazn.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/DAZN_logo.svg' },
  { name: 'sabc.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/South_African_Broadcasting_Corporation_logo.svg' },
  { name: 'nhk_world.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/NHK_WORLD-JAPAN_logo.svg' },
  { name: 'rcn.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Canal_RCN_logo.svg' }
];

function downloadFile(urlStr, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return reject(new Error('Too many redirects'));
    }

    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };

    client.get(urlStr, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, parsedUrl.origin).href;
        }
        return resolve(downloadFile(redirectUrl, destPath, redirectCount + 1));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${urlStr}, status code: ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting logo downloads to: ${LOGO_DIR}`);
  for (const item of logos) {
    const dest = path.join(LOGO_DIR, item.name);
    console.log(`Downloading ${item.name} from ${item.url}...`);
    try {
      await downloadFile(item.url, dest);
      console.log(`Successfully downloaded ${item.name}`);
    } catch (err) {
      console.error(`Failed to download ${item.name}: ${err.message}`);
    }
  }
  console.log('All downloads completed!');
}

run();
