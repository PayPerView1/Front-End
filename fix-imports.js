const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, "src/app/[locale]/advertiser/wallet/components");

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file uses allowWalletPage but doesn't import it
  if (content.includes('allowWalletPage') && !content.includes("from '../lib/walletSession'")) {
    content = content.replace(
      '"use client";',
      '"use client";\nimport { allowWalletPage } from \'../lib/walletSession\';'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed import in: ' + file);
  }
}
console.log('Done.');
