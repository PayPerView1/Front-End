const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/[locale]/advertiser/wallet/components');

const replacements = [
  // old external paths → new internal wallet sub-paths
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/bank-transfer`\)/g, "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/multi-deposit`\)/g, "router.push(`/${locale}/advertiser/wallet/deposit/multi`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/deposit-success`\)/g, "router.push(`/${locale}/advertiser/wallet/deposit/success`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/deposit-confirmed`\)/g, "router.push(`/${locale}/advertiser/wallet/deposit/confirmed`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/deposit`\)/g, "router.push(`/${locale}/advertiser/wallet/deposit`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/wallet-topup-142`\)/g, "router.push(`/${locale}/advertiser/wallet/topup/confirmed`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/wallet-topup-133`\)/g, "router.push(`/${locale}/advertiser/wallet/topup/error-min`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/wallet-topup-134`\)/g, "router.push(`/${locale}/advertiser/wallet/topup/error-max`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/wallet-topup-135`\)/g, "router.push(`/${locale}/advertiser/wallet/topup/error-invalid`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/wallet-topup`\)/g, "router.push(`/${locale}/advertiser/wallet`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/payment-failed-124`\)/g, "router.push(`/${locale}/advertiser/wallet/payment/failed`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/payment-cancelled-125`\)/g, "router.push(`/${locale}/advertiser/wallet/payment/cancelled`)"],
  [/router\.push\(`\$\{[^}]+\}\/advertiser\/payment-receipt`\)/g, "router.push(`/${locale}/advertiser/wallet/payment/receipt`)"],
];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let changed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [pattern, replacement] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) modified = true;
  }

  // Restore router and locale usage if they were removed (add them back if needed)
  if (modified && !content.includes('const router = useRouter()') && content.includes('router.push')) {
    content = content.replace(
      /export default function (\w+)\([^)]*\)/,
      (match) => {
        return match;
      }
    );
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched: ' + file);
    changed++;
  }
}

console.log(`Done. ${changed} files patched.`);
