'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import PaymentReceipt from '../../components/PaymentReceipt';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_payment_receipt');
  if (!allowed) return null;
  return <PaymentReceipt />;
}
