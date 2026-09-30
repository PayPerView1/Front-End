'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import DepositConfirmed from '../../components/DepositConfirmed';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_deposit_confirmed');
  if (!allowed) return null;
  return <DepositConfirmed />;
}
