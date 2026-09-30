const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/app/[locale]/advertiser');
const dstDir = path.join(__dirname, 'src/app/[locale]/advertiser/wallet/components');

const renames = {
  'wallet-topup/components/WalletTopupPage.js': 'TopupMain.js',
  'wallet-topup-133/components/WalletTopup133Page.js': 'TopupErrorMin.js',
  'wallet-topup-134/components/WalletTopup134Page.js': 'TopupErrorMax.js',
  'wallet-topup-135/components/WalletTopup135Page.js': 'TopupErrorInvalid.js',
  'wallet-topup-142/components/WalletTopup142Page.js': 'TopupConfirmed.js',
  'payment-failed-124/components/PaymentFailed124Page.js': 'PaymentFailed.js',
  'payment-cancelled-125/components/PaymentCancelled125Page.js': 'PaymentCancelled.js',
  'multi-deposit/components/MultiDepositPage.js': 'MultiDeposit.js',
  'payment-receipt/components/PaymentReceiptPage.js': 'PaymentReceipt.js',
  'deposit/components/DepositGatewayPage.js': 'DepositGateway.js',
  'deposit-success/components/DepositSuccessPage.js': 'DepositSuccess.js',
  'deposit-confirmed/components/DepositConfirmedPage.js': 'DepositConfirmed.js',
  'bank-transfer/components/BankTransferPage.js': 'BankTransfer.js'
};

for (const [oldPathSuffix, newName] of Object.entries(renames)) {
  const oldFile = path.join(srcDir, oldPathSuffix);
  const newFile = path.join(dstDir, newName);
  
  if (fs.existsSync(oldFile)) {
    let content = fs.readFileSync(oldFile, 'utf8');
    
    // Replace export default function name
    const oldCompName = path.basename(oldFile, '.js');
    const newCompName = newName.replace('.js', '');
    content = content.replace(new RegExp('function ' + oldCompName, 'g'), 'function ' + newCompName);
    
    fs.writeFileSync(newFile, content, 'utf8');
    console.log('Processed ' + newName);
  } else {
    console.log('Not found: ' + oldFile);
  }
}
