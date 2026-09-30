const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, "src/app/[locale]/advertiser/wallet/components");

// Map: old router.push target → session key to set before navigating
const routeKeys = {
  "wallet/deposit/success":        "wallet_deposit_success",
  "wallet/deposit/confirmed":      "wallet_deposit_confirmed",
  "wallet/topup/confirmed":        "wallet_topup_confirmed",
  "wallet/payment/failed":         "wallet_payment_failed",
  "wallet/payment/cancelled":      "wallet_payment_cancelled",
  "wallet/payment/receipt":        "wallet_payment_receipt",
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [route, key] of Object.entries(routeKeys)) {
    const pushPattern = `router.push(\`/\${locale}/advertiser/${route}\`)`;
    if (content.includes(pushPattern)) {
      const injection = `allowWalletPage('${key}');\n      ${pushPattern}`;
      content = content.replaceAll(pushPattern, injection);
      modified = true;
    }
  }

  if (modified) {
    // Add import if not present
    if (!content.includes('allowWalletPage')) {
      content = content.replace(
        "'use client';",
        "'use client';\nimport { allowWalletPage } from '../lib/walletSession';"
      );
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched: ' + file);
  }
}

console.log('Done.');
