const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, "src/app/[locale]/advertiser/wallet");

// ── 1. Protected page.js files ────────────────────────────────
const protectedPages = {
  "deposit/success/page.js": {
    key: "wallet_deposit_success",
    comp: "DepositSuccess",
    relImport: "../../components/DepositSuccess",
  },
  "deposit/confirmed/page.js": {
    key: "wallet_deposit_confirmed",
    comp: "DepositConfirmed",
    relImport: "../../components/DepositConfirmed",
  },
  "topup/confirmed/page.js": {
    key: "wallet_topup_confirmed",
    comp: "TopupConfirmed",
    relImport: "../../components/TopupConfirmed",
  },
  "payment/failed/page.js": {
    key: "wallet_payment_failed",
    comp: "PaymentFailed",
    relImport: "../../components/PaymentFailed",
  },
  "payment/cancelled/page.js": {
    key: "wallet_payment_cancelled",
    comp: "PaymentCancelled",
    relImport: "../../components/PaymentCancelled",
  },
  "payment/receipt/page.js": {
    key: "wallet_payment_receipt",
    comp: "PaymentReceipt",
    relImport: "../../components/PaymentReceipt",
  },
};

for (const [relPath, cfg] of Object.entries(protectedPages)) {
  const content = `'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import ${cfg.comp} from '${cfg.relImport}';

export default function Page() {
  const { allowed } = useWalletGuard('${cfg.key}');
  if (!allowed) return null;
  return <${cfg.comp} />;
}
`;
  const fullPath = path.join(base, relPath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Protected: ' + relPath);
}

console.log('\nDone: protected pages written.');
