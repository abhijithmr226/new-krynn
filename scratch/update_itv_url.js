const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Match the streamUrl field inside the "ITV1 (DASH)" block
const regex = /"name":\s*"ITV1\s*\(DASH\)",\s*"logo":\s*"[^"]*",\s*"streamUrl":\s*"([^"]*)"/;
const match = content.match(regex);

if (match) {
  const originalUrl = match[1];
  console.log('Found original ITV1 URL in index.html:', originalUrl);

  // Convert the originalUrl (which contains &amp;) to the proxied route, also preserving the &amp; formatting
  const proxiedUrl = originalUrl.replace('https://', '/api/proxy/https/');
  
  content = content.replace(originalUrl, proxiedUrl);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully updated ITV1 streamUrl in index.html using relative proxy URL!');
} else {
  console.log('Could not find ITV1 (DASH) block in index.html.');
}
