const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/app/[locale]/advertiser/wallet/components');

// Map: component file → { props to add back, paths to restore }
const patches = {
  'TopupMain.js': {
    oldSig: "export default function TopupMain({ onBankTransfer, onMultiDeposit, onDepositSuccess, onDepositGateway })",
    newSig: "export default function TopupMain()",
    addHooks: true,
    replacements: [
      ["onBankTransfer?.()", "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
      ["onMultiDeposit?.()", "router.push(`/${locale}/advertiser/wallet/deposit/multi`)"],
      ["onDepositSuccess?.()", "router.push(`/${locale}/advertiser/wallet/deposit/success`)"],
      ["onDepositGateway?.()", "router.push(`/${locale}/advertiser/wallet/deposit`)"],
    ]
  },
  'TopupErrorMax.js': {
    oldSig: "export default function TopupErrorMax({ onBankTransfer, onBack })",
    newSig: "export default function TopupErrorMax()",
    addHooks: true,
    replacements: [
      ["onBankTransfer?.()", "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
    ]
  },
  'TopupConfirmed.js': {
    oldSig: "export default function TopupConfirmed({ onDepositSuccess })",
    newSig: "export default function TopupConfirmed()",
    addHooks: true,
    replacements: [
      ["onDepositSuccess?.()", "router.push(`/${locale}/advertiser/wallet/deposit/success`)"],
    ]
  },
  'PaymentFailed.js': {
    oldSig: "export default function PaymentFailed({ onRetry, onBankTransfer })",
    newSig: "export default function PaymentFailed()",
    addHooks: true,
    replacements: [
      ["onRetry?.()", "router.push(`/${locale}/advertiser/wallet`)"],
      ["onBankTransfer?.()", "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
    ]
  },
  'PaymentCancelled.js': {
    oldSig: "export default function PaymentCancelled({ onRetry, onBankTransfer })",
    newSig: "export default function PaymentCancelled()",
    addHooks: true,
    replacements: [
      ["onRetry?.()", "router.push(`/${locale}/advertiser/wallet`)"],
      ["onBankTransfer?.()", "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
    ]
  },
  'PaymentReceipt.js': {
    oldSig: "export default function PaymentReceipt({ onTopupAgain, onCampaigns })",
    newSig: "export default function PaymentReceipt()",
    addHooks: true,
    replacements: [
      ["onTopupAgain?.()", "router.push(`/${locale}/advertiser/wallet/topup/confirmed`)"],
      ["onCampaigns?.()", "router.push(`/${locale}/advertiser/campaigns`)"],
    ]
  },
  'DepositGateway.js': {
    oldSig: "export default function DepositGateway({ onBankTransfer, onMultiDeposit })",
    newSig: "export default function DepositGateway()",
    addHooks: true,
    replacements: [
      ["onBankTransfer?.()", "router.push(`/${locale}/advertiser/wallet/deposit/bank-transfer`)"],
      ["onMultiDeposit?.()", "router.push(`/${locale}/advertiser/wallet/deposit/multi`)"],
    ]
  },
  'DepositSuccess.js': {
    oldSig: "export default function DepositSuccess({ onBack })",
    newSig: "export default function DepositSuccess()",
    addHooks: true,
    replacements: [
      ["onBack?.()", "router.push(`/${locale}/advertiser/wallet/deposit`)"],
    ]
  },
  'DepositConfirmed.js': {
    oldSig: "export default function DepositConfirmed({ onCampaigns })",
    newSig: "export default function DepositConfirmed()",
    addHooks: true,
    replacements: [
      ["onCampaigns?.()", "router.push(`/${locale}/advertiser/campaigns`)"],
    ]
  },
};

for (const [file, cfg] of Object.entries(patches)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) { console.log('NOT FOUND: ' + file); continue; }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace function signature
  content = content.replace(cfg.oldSig, cfg.newSig);
  
  // Add hooks right after the function signature opening
  if (cfg.addHooks && !content.includes('const router = useRouter()')) {
    content = content.replace(
      cfg.newSig + ' {',
      cfg.newSig + ' {\n  const router = useRouter();\n  const locale = useLocale();'
    );
    // Ensure imports exist
    if (!content.includes("useRouter")) {
      content = content.replace("'use client';", "'use client';\nimport { useRouter } from 'next/navigation';\nimport { useLocale } from 'next-intl';");
    }
  }
  
  // Replace callback calls with router.push
  for (const [oldCall, newCall] of cfg.replacements) {
    // Escape for regex
    const escaped = oldCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    content = content.replace(re, newCall);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched: ' + file);
}

console.log('All done.');
