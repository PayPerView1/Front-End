'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import TopupConfirmed from '../../components/TopupConfirmed';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_topup_confirmed');
  if (!allowed) return null;
  return <TopupConfirmed />;
}
