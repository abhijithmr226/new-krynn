const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Match the entire block of ITV1 (DASH)
const regex = /\{\s*"name":\s*"ITV1\s*\(DASH\)",[\s\S]*?\}/;
const match = content.match(regex);

if (match) {
  const itvBlock = match[0];
  console.log('Found ITV1 block in index.html.');

  const cazeTvBlock = `,\n  {\n    "name": "CazeTV (Brazil Proxy)",\n    "logo": "https://via.placeholder.com/150?text=CazeTV",\n    "streamUrl": "/api/proxy/https/dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8?proxy=auto-br",\n    "type": "hls",\n    "language": "Portuguese",\n    "quality": "Auto"\n  }`;

  const replacement = itvBlock + cazeTvBlock;
  content = content.replace(itvBlock, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully inserted CazeTV into channelsData in index.html!');
} else {
  console.log('ITV1 block not found in index.html.');
}
