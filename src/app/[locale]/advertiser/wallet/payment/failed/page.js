'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import PaymentFailed from '../../components/PaymentFailed';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_payment_failed');
  if (!allowed) return null;
  return <PaymentFailed />;
}
