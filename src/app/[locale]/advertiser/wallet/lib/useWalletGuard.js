'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { isWalletPageAllowed } from './walletSession';

/**
 * useWalletGuard(pageKey)
 * 
 * Protects a wallet sub-page from direct URL access.
 * If the user didn't arrive through the proper flow, redirects to /wallet.
 * 
 * Returns: { allowed: boolean } — render nothing until allowed === true.
 */
export function useWalletGuard(pageKey) {
  const router = useRouter();
  const locale = useLocale();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isWalletPageAllowed(pageKey)) {
      setAllowed(true);
    } else {
      router.replace(`/${locale}/advertiser/wallet`);
    }
  }, []);

  return { allowed };
}
