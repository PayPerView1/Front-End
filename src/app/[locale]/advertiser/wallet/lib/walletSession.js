// ─── Wallet Flow Session Guard ───────────────────────────────
// Protects sensitive wallet sub-pages from direct URL access.
// Works purely in sessionStorage (client-side, cleared on tab close).

const KEY = 'ppv_wallet_flow';
const TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Set which page the user is allowed to visit next.
 * Call this BEFORE router.push() in any component.
 */
export function allowWalletPage(page) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(
    KEY,
    JSON.stringify({ page, ts: Date.now() })
  );
}

/**
 * Check if the user arrived at this page through the proper flow.
 * Returns true if allowed, false if they should be redirected away.
 */
export function isWalletPageAllowed(page) {
  if (typeof window === 'undefined') return true; // SSR: allow
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return false;
  try {
    const { page: allowed, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL) {
      sessionStorage.removeItem(KEY);
      return false;
    }
    return allowed === page;
  } catch {
    return false;
  }
}

/** Clear the session (call on final page to prevent re-access). */
export function clearWalletFlow() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(KEY);
}
