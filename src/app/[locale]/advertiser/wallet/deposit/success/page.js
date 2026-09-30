'use client';
import { useWalletGuard } from '../../lib/useWalletGuard';
import DepositSuccess from '../../components/DepositSuccess';

export default function Page() {
  const { allowed } = useWalletGuard('wallet_deposit_success');
  if (!allowed) return null;
  return <DepositSuccess />;
}
