const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const publicDir = path.join(projectDir, 'public');

const htmlFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'disclaimer.html',
  'privacy-policy.html',
  'terms.html',
  'teams.html',
  'groups.html',
  'schedule.html',
  'predictions.html',
  'news.html',
  '404.html'
];

const standardFooter = `  <footer>
    <p>🏆 <span>KRYNN SPORTS</span> — Official World Cup 2026 Broadcast &amp; Scores Guide</p>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact Us</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/disclaimer">Disclaimer</a>
    </div>
    <div class="footer-links" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
      <a href="/teams">Teams Guide</a>
      <a href="/groups">Stage Standings</a>
      <a href="/schedule">Match Schedule</a>
      <a href="/predictions">Match Predictions</a>
      <a href="/news">News Updates</a>
    </div>
  </footer>`;

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping: ${file} (does not exist: ${filePath})`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Replace the entire footer block
  const footerRegex = /<footer>[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, standardFooter);
  } else {
    console.log(`No <footer> tag found in ${file}`);
  }

  // 2. Replace /index.html links with /
  content = content.split('href="/index.html"').join('href="/"');
  content = content.split('href="/index.html?').join('href="/?');
  content = content.split('href="/index.html#').join('href="/#');

  // 3. For the header back button in subpages, also check href="index.html" without slash
  content = content.split('href="index.html"').join('href="/"');

  // 4. Replace links with .html to clean URLs
  const pageReplacements = [
    ['href="/about.html"', 'href="/about"'],
    ['href="/contact.html"', 'href="/contact"'],
    ['href="/privacy-policy.html"', 'href="/privacy-policy"'],
    ['href="/terms.html"', 'href="/terms"'],
    ['href="/disclaimer.html"', 'href="/disclaimer"'],
    ['href="/teams.html"', 'href="/teams"'],
    ['href="/groups.html"', 'href="/groups"'],
    ['href="/schedule.html"', 'href="/schedule"'],
    ['href="/predictions.html"', 'href="/predictions"'],
    ['href="/news.html"', 'href="/news"']
  ];

  for (const [target, replacement] of pageReplacements) {
    content = content.split(target).join(replacement);
  }

  // 5. Specifically for 404.html image CLS optimization
  if (file === '404.html') {
    content = content.split('<img class="logo-img" src="krynn_logo.png" alt="Krynn Logo">')
                     .join('<img class="logo-img" src="krynn_logo.png" alt="Krynn Logo" width="42" height="42" fetchpriority="high">');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Standardized footer and clean links in: ${file}`);
  } else {
    console.log(`No changes made to: ${file}`);
  }
});

console.log('Standardization of all HTML files completed successfully!');
