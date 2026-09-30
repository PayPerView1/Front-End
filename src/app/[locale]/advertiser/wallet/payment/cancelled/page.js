'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import PaymentCancelled from '../../components/PaymentCancelled';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_payment_cancelled');
  if (!allowed) return null;
  return <PaymentCancelled />;
}
